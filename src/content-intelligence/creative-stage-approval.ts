import {z} from 'zod';
import {knowledgePackageSchema, type KnowledgePackage} from '../knowledge/schema';
import {contentAssetSchema, type ContentAsset} from '../content-assets/schema';
import {creativeReferenceSchema} from '../content-assets/creative-direction';
import {validateClaimReviewBundle} from './claim-review';
import {sha256Json, stableJson} from './run-schema';

const digest = z.string().regex(/^[a-f0-9]{64}$/);
/** Editorial approval plus selected claim verification, granting only the direction stage. */
export const creativeStageApprovalSchema = z.object({
  schemaVersion: z.literal(1), id: z.string().startsWith('owner-decision.'), revision: z.number().int().positive(),
  reviewer: z.string().min(1), authority: z.literal('explicit-owner-message'), ownerInstruction: z.string().min(1),
  enteredAt: z.iso.datetime(), timeBasis: z.literal('decision-entry'), ownerSuppliedReviewTimestamp: z.null(),
  approvedSourceCommit: z.string().regex(/^[a-f0-9]{40}$/),
  knowledgePackage: creativeReferenceSchema, contentAsset: creativeReferenceSchema, claimReview: creativeReferenceSchema,
  scriptSha256: digest, visualPlanSha256: digest, comprehensionContractSha256: digest,
  finalExactNarration: z.string().min(1), approvedHookId: z.string().min(1),
  claimDecisions: z.array(z.object({claimId: z.string(), statementSha256: digest,
    action: z.enum(['verify', 'preserve-research-state'])}).strict()).min(1),
  reviewedArtifacts: z.array(z.object({path: z.string().min(1), sha256: digest}).strict()).min(1),
  editorialApproved: z.literal(true), creativeDirectionAuthorized: z.literal(true),
  creativeDirectionApproved: z.literal(false), productionAuthorized: z.literal(false),
  platformApprovalGranted: z.literal(false), publicationApprovalGranted: z.literal(false),
}).strict();

export const applyCreativeStageApproval = (input: {
  decision: unknown; knowledgePackage: KnowledgePackage; contentAsset: ContentAsset;
  claimReview: unknown; comprehensionContract: unknown;
}) => {
  const d = creativeStageApprovalSchema.parse(input.decision);
  const {knowledgePackage: pkg, contentAsset: asset} = input;
  const review = validateClaimReviewBundle(input.claimReview, pkg, asset);
  const matches = (ref: {id:string;revision:number;sha256:string}, value: {id:string;revision:number}) =>
    ref.id === value.id && ref.revision === value.revision && ref.sha256 === sha256Json(value);
  if (!matches(d.knowledgePackage, pkg) || !matches(d.contentAsset, asset)
    || d.claimReview.id !== review.id || d.claimReview.revision !== asset.revision || d.claimReview.sha256 !== sha256Json(review)
    || d.scriptSha256 !== sha256Json(asset.script) || d.visualPlanSha256 !== sha256Json(asset.visualPlan)
    || d.comprehensionContractSha256 !== sha256Json(input.comprehensionContract)
    || d.finalExactNarration !== asset.script.segments.map(s => s.text).join('\n\n') || d.approvedHookId !== asset.hookId) {
    throw new Error('Creative-stage approval targets stale reviewed artifacts');
  }
  if (pkg.editorialStatus !== 'review' || asset.editorialStatus !== 'editorial-review' || pkg.approval || asset.approval) {
    throw new Error('Expected the unapproved reviewed source state');
  }
  if (d.claimDecisions.length !== pkg.claims.length || new Set(d.claimDecisions.map(c => c.claimId)).size !== pkg.claims.length
    || stableJson(d.claimDecisions.filter(c => c.action === 'verify').map(c => c.claimId).sort()) !== stableJson([...asset.selectedClaimIds].sort())) {
    throw new Error('Bind all claims exactly once and verify only the selected set');
  }
  const claims = pkg.claims.map(c => {
    const binding = d.claimDecisions.find(b => b.claimId === c.id);
    if (!binding || binding.statementSha256 !== sha256Json(c.statement)) throw new Error(`Stale statement: ${c.id}`);
    if (binding.action === 'preserve-research-state') return c;
    const inspected = review.claimReviews.find(r => r.claimId === c.id);
    if (c.verificationStatus !== 'supported' || !inspected || inspected.decision === 'reject'
      || inspected.recommendedVerificationStatus !== 'verified') throw new Error(`Claim not eligible: ${c.id}`);
    return {...c, verificationStatus: 'verified' as const, review: {reviewedBy: d.reviewer,
      decisionEnteredAt: d.enteredAt, reviewTimeBasis: 'decision-entry' as const,
      notes: `Explicit owner verification of exact statement and inspected evidence via ${d.id}; qualifications preserved.`}};
  });
  const approval = {approvedBy: d.reviewer, decisionEnteredAt: d.enteredAt, reviewTimeBasis: 'decision-entry' as const,
    notes: `Editorial approval at ${d.approvedSourceCommit} via ${d.id}. CreativeDirection proposal only; no production, platform or publication authorization.`};
  return {decision: d,
    knowledgePackage: knowledgePackageSchema.parse({...pkg, claims, revision: pkg.revision + 1, editorialStatus: 'approved', approval}),
    contentAsset: contentAssetSchema.parse({...asset, revision: asset.revision + 1, editorialStatus: 'approved', approval}),
  };
};
