import {z} from 'zod';
import {knowledgePackageSchema, type KnowledgePackage} from '../knowledge/schema';
import {contentAssetSchema, type ContentAsset} from '../content-assets/schema';
import {sourceInspectionSchema} from '../content-intelligence/claim-review';
import {sha256Json} from '../content-intelligence/run-schema';
import {digest, text, recordReferenceSchema, readBoundRecord,requireOwnerDecision,type RecordReference} from './evidence';

export const internalEditorialReviewSchema = z.object({
  schemaVersion: z.literal(3), cycleId: text, topicCandidateId: text, enteredAt: z.iso.datetime(), reviewer: text,
  packageSha256: digest, assetSha256: digest, scriptSha256: digest,
  inspections: z.array(sourceInspectionSchema.extend({
    inspectedEvidence: recordReferenceSchema,
    sourceQualityRationale: text,
  })).min(1),
  claims: z.array(z.object({
    id: text, statementSha256: digest,
    disposition: z.enum(['verify', 'reserve', 'exclude', 'unresolved']), rationale: text,
    evidence: z.array(z.object({sourceId: text, locator: text, assessment: text, sufficientForWording: z.boolean()}).strict()),
    qualificationsPreserved: z.boolean(),
  }).strict()).min(1),
  misconceptionSafeguards: z.array(text).min(1),
  comprehensionReview: text, rightsReview: text,
  careAssessment:z.object({state:z.enum(['routine','owner-judgment-required']),rationale:text}).strict(),
  exceptionalConditions: z.array(text),
  judgmentConditions:z.array(z.object({id:text,kind:z.enum(['rights','legal','brand','operational-authority']),reason:text}).strict()).optional(),
  exceptionResumptions:z.array(z.object({exception:recordReferenceSchema,decision:recordReferenceSchema,resumedAt:z.iso.datetime()}).strict()).optional(),
}).strict();
/** Evidence assessment is explicit operator work. A provider draft is never itself a review. */
export const verifyInternalEditorial = (input: unknown, pkg: KnowledgePackage, asset: ContentAsset, root = process.cwd(), authorizedDecisions:readonly RecordReference[]=[],evaluationAt?:string) => {
  const review = internalEditorialReviewSchema.parse(input);
  if (review.packageSha256 !== sha256Json(pkg) || review.assetSha256 !== sha256Json(asset) || review.scriptSha256 !== sha256Json(asset.script) || asset.knowledgePackageId !== pkg.id) throw new Error('Internal review target is stale');
  if(review.exceptionalConditions.length)throw new Error('Unresolved evidence/factual conditions require escalation and cannot be overridden by owner preference');
  const needsJudgment=review.careAssessment.state==='owner-judgment-required'||!!review.judgmentConditions?.length;
  if(needsJudgment){
    if(!review.exceptionResumptions?.length)throw new Error('Exceptional editorial conditions require owner escalation');
    const {exceptionResumptions:_resumptions,...proposal}=review;void _resumptions;
    for(const resumption of review.exceptionResumptions){
      if(!authorizedDecisions.some(r=>r.path===resumption.decision.path&&r.sha256===resumption.decision.sha256))throw new Error('Editorial resumption requires a journal-authorized exception decision');
      const exception=z.object({reason:text,target:recordReferenceSchema,resumeStage:z.literal('editorial')}).strict().parse(readBoundRecord(resumption.exception,root));
      const decision=requireOwnerDecision(resumption.decision,review.cycleId,'exception',exception,root);
      if(decision.decision!=='approve'||decision.lifecycle==='superseded'||(decision.validUntil&&resumption.resumedAt>decision.validUntil)||resumption.resumedAt<decision.enteredAt)throw new Error('Editorial exception authority is rejected, expired or superseded');
      if(evaluationAt&&(resumption.resumedAt>evaluationAt||decision.enteredAt>evaluationAt||(decision.validUntil&&evaluationAt>decision.validUntil)))throw new Error('Editorial exception authority invalid at actual resumption event');
      if(sha256Json(readBoundRecord(exception.target,root))!==sha256Json(proposal))throw new Error('Editorial exception approval is unrelated to exact resumed review');
    }
  }else if(review.exceptionResumptions?.length)throw new Error('Exception authority cannot disappear into a routine review');
  const inspections = new Map(review.inspections.map(i => [i.sourceId, i]));
  const claims = new Map(review.claims.map(c => [c.id, c]));
  if (inspections.size !== review.inspections.length || claims.size !== review.claims.length || inspections.size !== pkg.sources.length || claims.size !== pkg.claims.length) throw new Error('Review must account for every source and claim once');
  for (const source of pkg.sources) {
    const inspection = inspections.get(source.id);
    if (!inspection) throw new Error('Missing source access accounting');
    const evidence = z.object({sourceId: text, url: z.url(), retrievedAt: z.iso.datetime(), accessStatus: sourceInspectionSchema.shape.accessStatus, inspectedText: text, acquisition: z.enum(['http-body', 'pdf-inspection', 'manual-source-inspection'])}).passthrough().parse(readBoundRecord(inspection.inspectedEvidence, root));
    if (evidence.sourceId !== source.id || evidence.url !== source.url || evidence.accessStatus !== inspection.accessStatus) throw new Error('Source inspection acquisition identity mismatch');
  }
  for (const claim of pkg.claims) {
    const decision = claims.get(claim.id);
    if (!decision || decision.statementSha256 !== sha256Json(claim.statement)) throw new Error('Claim wording changed after review');
    if (decision.disposition !== 'verify') continue;
    if (!['supported', 'verified'].includes(claim.verificationStatus) || !decision.qualificationsPreserved || !decision.evidence.length) throw new Error('Uncertain/conflicting/unverified claims cannot automatically become verified');
    for (const e of decision.evidence) {
      const inspected = inspections.get(e.sourceId);
      if (!e.sufficientForWording || !inspected?.identityConfirmed || inspected.accessStatus === 'inaccessible' || !inspected.supportsClaimIds.includes(claim.id)
        || !inspected.evidenceLocations.includes(e.locator) || !claim.evidence.some(c => c.sourceId === e.sourceId && c.locator === e.locator)) throw new Error('Verification requires inspected, located evidence sufficient for exact wording');
    }
  }
  const selected = new Set([...asset.selectedClaimIds, ...asset.script.segments.flatMap(s => s.type === 'factual' ? s.claimIds : [])]);
  const hook = pkg.hooks.find(h => h.id === asset.hookId);
  if (!hook) throw new Error('Missing selected hook');
  hook.claimIds.forEach(id => selected.add(id));
  for (const id of selected) if (claims.get(id)?.disposition !== 'verify') throw new Error('Narration/hook cannot use excluded, reserve or unresolved claims');
  const authority = {kind: 'internal-evidence-review' as const, cycleId: review.cycleId, reviewSha256: sha256Json(review),...(review.exceptionResumptions?.length?{exceptionDecisions:review.exceptionResumptions.map(r=>r.decision.sha256)}:{})};
  const approval = {approvedBy: review.reviewer, approvedAt: review.enteredAt.slice(0, 10), authority, notes: 'Internal V3 editorial readiness; grants no master or publication approval.'};
  const nextPackage = knowledgePackageSchema.parse({...pkg, editorialStatus: 'approved', approval,
    claims: pkg.claims.map(c => claims.get(c.id)?.disposition === 'verify' ? {...c, verificationStatus: 'verified', review: {reviewedBy: review.reviewer, reviewedAt: review.enteredAt.slice(0, 10), authority}} : c)});
  const nextAsset = contentAssetSchema.parse({...asset, editorialStatus: 'approved', approval});
  return {review, knowledgePackage: nextPackage, contentAsset: nextAsset, authority};
};
