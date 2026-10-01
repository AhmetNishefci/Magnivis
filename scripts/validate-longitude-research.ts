import {createHash} from 'node:crypto';
import {readFileSync, readdirSync} from 'node:fs';
import {resolve} from 'node:path';
import {z} from 'zod';
import {knowledgePackageSchema} from '../src/knowledge/schema';
import {contentAssetSchema} from '../src/content-assets/schema';
import {createKnowledgePackageRegistry} from '../src/knowledge/registry';
import {createContentAssetRegistry} from '../src/content-assets/registry';
import {createTopicCandidateRegistry} from '../src/content-intelligence/registry';
import {validateClaimReviewBundle} from '../src/content-intelligence/claim-review';
import {stableJson} from '../src/content-intelligence/run-schema';
import {assertTopicCandidateTransition, hookProposalBatchSchema, researchWorkspaceDraftSchema, topicCandidateSchema} from '../src/content-intelligence/schema';

export const longitudeReviewDirectory = resolve('content-intelligence/reviews/longitude-clock-v1');
const sha = (bytes: string | Buffer) => createHash('sha256').update(bytes).digest('hex');
const ledgerSchema = z.object({
  schemaVersion: z.literal(1), packageId: z.literal('longitude-clock'), packageRevision: z.literal(1),
  reviewState: z.literal('awaiting-owner-decision'), statusMapping: z.record(z.string(), z.string()),
  claims: z.array(z.object({
    claimId: z.string(), proposedWording: z.string(),
    evidence: z.array(z.object({sourceId: z.string(), locator: z.string(), notes: z.string()}).strict()),
    assessment: z.enum(['SUPPORTED', 'QUALIFIED', 'EXCLUDED', 'UNKNOWN']),
    repositoryStatus: z.enum(['supported', 'unverified', 'uncertain']), confidence: z.string().min(1),
    caveats: z.array(z.string()), narrationEligibility: z.string(), onScreenEligibility: z.string(),
    useInRecommendedAsset: z.boolean(), rationale: z.string().min(1),
  }).strict()),
}).strict();

// Native review objects remain scoped snapshots; this does not register a production.
export const validateLongitudeResearch = (directory = longitudeReviewDirectory) => {
  const bytes = (name: string) => readFileSync(resolve(directory, name));
  const read = (name: string): unknown => JSON.parse(bytes(name).toString());
  const knowledgePackage = knowledgePackageSchema.parse(read('knowledge-package.review.json'));
  const asset = contentAssetSchema.parse(read('content-asset.review.json'));
  const packages = createKnowledgePackageRegistry([knowledgePackage]);
  createContentAssetRegistry([asset], packages);
  const candidate = topicCandidateSchema.parse(read('topic-candidate.researching.json'));
  createTopicCandidateRegistry([candidate], packages);
  assertTopicCandidateTransition('evaluating', candidate.status);
  const selection = z.object({
    candidateId: z.literal('topic.longitude-clock'), cycleId: z.literal('discovery.cycle-2-2026-10-01'),
    discoveryPath: z.literal('content-intelligence/discovery/cycle-2-2026-10-01/discovery.json'),
    discoverySha256: z.string().regex(/^[a-f0-9]{64}$/), owner: z.literal('Ahmet Nishefci'),
    authorizedScope: z.literal('bounded-deep-research-and-editorial-proposal'),
    editorialApproval: z.literal(false), productionAuthorized: z.literal(false), publicationAuthorized: z.literal(false),
    provenance: z.object({baseCommit: z.literal('c122a3a158ffa33dd31463839e7654229acfb441'),
      paidApiUsed: z.literal(false), workflowEnvelope: z.literal(false)}).passthrough(),
  }).passthrough().parse(read('selection.json'));
  const discoveryBytes = readFileSync(resolve(selection.discoveryPath));
  if (sha(discoveryBytes) !== selection.discoverySha256) throw new Error('Historical discovery hash drift');
  const discovery = JSON.parse(discoveryBytes.toString()) as {id: string; candidates: unknown[]};
  const prior = topicCandidateSchema.parse(discovery.candidates.find((c) => topicCandidateSchema.parse(c).id === candidate.id));
  if (discovery.id !== selection.cycleId || candidate.id !== selection.candidateId
    || stableJson(candidate) !== stableJson({...prior, revision: 2, status: 'researching'})) throw new Error('Research selection identity/state drift');
  const workspace = researchWorkspaceDraftSchema.parse(read('research-workspace.draft.json'));
  if (workspace.topicCandidateId !== candidate.id || workspace.proposedKnowledgePackageId !== knowledgePackage.id
    || stableJson(workspace.claimCandidates) !== stableJson(knowledgePackage.claims.map((c) => ({...c, verificationStatus: 'unverified'})))) throw new Error('Unverified intake drift');
  if (knowledgePackage.id !== 'longitude-clock' || knowledgePackage.revision !== 1 || asset.revision !== 1
    || knowledgePackage.editorialStatus !== 'review' || asset.editorialStatus !== 'editorial-review'
    || knowledgePackage.approval || asset.approval || asset.narrationPlan
    || knowledgePackage.claims.some((c) => c.review || c.verificationStatus === 'verified')) throw new Error('Owner editorial gate bypass');
  const review = validateClaimReviewBundle(read('claim-review.json'), knowledgePackage, asset);
  const ledger = ledgerSchema.parse(read('claim-ledger.json'));
  if (ledger.claims.length !== knowledgePackage.claims.length || new Set(ledger.claims.map((c) => c.claimId)).size !== ledger.claims.length) throw new Error('Incomplete ledger');
  ledger.claims.forEach((entry) => {
    const claim = knowledgePackage.claims.find((c) => c.id === entry.claimId);
    const decision = review.claimReviews.find((c) => c.claimId === entry.claimId);
    if (!claim || !decision || entry.proposedWording !== claim.statement || entry.repositoryStatus !== claim.verificationStatus
      || stableJson(entry.evidence) !== stableJson(claim.evidence) || stableJson(entry.caveats) !== stableJson(claim.caveats)
      || entry.useInRecommendedAsset !== asset.selectedClaimIds.includes(entry.claimId)) throw new Error('Ledger/evidence mismatch');
    if (entry.assessment === 'EXCLUDED' || entry.assessment === 'UNKNOWN') {
      const excluded = entry.assessment === 'EXCLUDED';
      if (entry.useInRecommendedAsset || claim.verificationStatus !== (excluded ? 'unverified' : 'uncertain')
        || decision.recommendedVerificationStatus !== (excluded ? 'unverified' : 'uncertain')
        || decision.decision !== (excluded ? 'reject' : 'retain')
        || !entry.narrationEligibility.includes('excluded') || !entry.onScreenEligibility.includes('excluded')) throw new Error('Ineligible claim promoted');
    } else if (claim.verificationStatus !== 'supported' || decision.recommendedVerificationStatus !== 'verified'
      || (entry.assessment === 'QUALIFIED' && !claim.caveats.length)) throw new Error('Unsupported claim promoted');
  });
  for (const segment of asset.script.segments) {
    if (segment.type !== 'factual' || segment.claimIds.some((id) => !ledger.claims.find((c) => c.claimId === id)?.useInRecommendedAsset)) throw new Error('Unbound narration');
  }
  for (const visual of asset.visualPlan) {
    if (visual.timingIntentSeconds || visual.claimIds.some((id) => !asset.selectedClaimIds.includes(id))) throw new Error('Visual exceeds conceptual review scope');
  }
  const hooks = hookProposalBatchSchema.parse(read('hook-proposals.draft.json'));
  if (hooks.knowledgePackageId !== knowledgePackage.id || hooks.packageRevision !== 1 || hooks.proposals.length !== 6) throw new Error('Hook proposal identity drift');
  hooks.proposals.forEach((h) => {
    const canonical = knowledgePackage.hooks.find(({id}) => id === h.id.replace('.hook-proposal.', '.hook.'));
    if (!canonical || h.text !== canonical.text || stableJson(h.claimIds) !== stableJson(canonical.claimIds)
      || h.claimIds.some((id) => knowledgePackage.claims.find((c) => c.id === id)?.verificationStatus !== 'supported')) throw new Error('Hook evidence drift');
  });
  const inspections = z.object({inspections: z.array(z.unknown())}).passthrough().parse(read('source-inspections.json'));
  if (stableJson(inspections.inspections) !== stableJson(review.sourceInspections)) throw new Error('Source inspection drift');
  const hookReview = z.object({recommendedHookId: z.string(), ownerApproved: z.literal(false),
    options: z.array(z.object({hookId: z.string(), text: z.string()}).passthrough()).length(6)}).passthrough().parse(read('hook-review.json'));
  if (hookReview.recommendedHookId !== asset.hookId || new Set(hookReview.options.map((h) => h.hookId)).size !== 6
    || hookReview.options.some((h) => knowledgePackage.hooks.find(({id}) => id === h.hookId)?.text !== h.text)) throw new Error('Hook review drift');
  const numbers = z.object({ownerApproved: z.literal(false), examples: z.array(z.object({localMeanHours: z.number(), referenceMeanHours: z.number(),
    longitudeDegrees: z.number(), direction: z.enum(['east', 'west'])})).length(2),
    errorExamples: z.array(z.object({timeErrorSeconds: z.number(), longitudeErrorDegrees: z.number()})).length(3)}).passthrough().parse(read('numerical-intuition.json'));
  for (const example of numbers.examples) {
    const degrees = 15 * (example.localMeanHours - example.referenceMeanHours);
    if (example.longitudeDegrees !== degrees || example.direction !== (degrees > 0 ? 'east' : 'west')) throw new Error('Longitude sign/conversion error');
  }
  if (numbers.errorExamples.some((e) => Math.abs(e.longitudeErrorDegrees - e.timeErrorSeconds / 240) > 1e-12)) throw new Error('Timing error conversion drift');
  const myths = z.object({schemaVersion: z.literal(1), ownerApproved: z.literal(false), decisions: z.array(z.object({
    proposedPhrase: z.string().min(1), recommendation: z.enum(['reject', 'hold', 'qualify']),
    reason: z.string().min(1), claimId: z.string(),
  }).strict())}).strict().parse(read('misconception-audit.json'));
  for (const claim of knowledgePackage.claims.filter((c) => c.verificationStatus !== 'supported')) {
    const decision = myths.decisions.find((d) => d.claimId === claim.id);
    if (!decision || decision.proposedPhrase !== claim.statement
      || decision.recommendation !== (claim.verificationStatus === 'uncertain' ? 'hold' : 'reject')) throw new Error('Misconception audit coverage drift');
  }
  if (myths.decisions.some((d) => !knowledgePackage.claims.some((c) => c.id === d.claimId))) throw new Error('Unknown misconception evidence');
  const text = bytes('owner-review.md').toString();
  asset.script.segments.forEach((s) => {if (!text.includes(s.text)) throw new Error('Owner narration differs from ContentAsset');});
  if (!text.includes('AHMET — CYCLE #2 EDITORIAL REVIEW')) throw new Error('Missing owner gate');
  const manifest = z.object({schemaVersion: z.literal(1), kind: z.literal('research-editorial-review-artifacts'),
    files: z.array(z.object({path: z.string().regex(/^[a-z0-9.-]+$/), sha256: z.string().regex(/^[a-f0-9]{64}$/)}).strict())}).strict().parse(read('artifact-manifest.json'));
  const names = readdirSync(directory).filter((n) => n !== 'artifact-manifest.json').sort();
  if (names.some((n) => /creative-direction|production-plan|caption-plan|owner-decision|\.mp4$|\.wav$|\.png$/.test(n))) throw new Error('Production/approval artifact exceeds bounded scope');
  if (stableJson(manifest.files.map((f) => f.path).sort()) !== stableJson(names)) throw new Error('Artifact manifest coverage drift');
  for (const file of manifest.files) if (sha(bytes(file.path)) !== file.sha256) throw new Error(`Artifact hash drift: ${file.path}`);
  for (const name of [...names, 'artifact-manifest.json'].filter((n) => n.endsWith('.json'))) {
    if (bytes(name).toString() !== stableJson(read(name), 2) + '\n') throw new Error(`Noncanonical JSON: ${name}`);
  }
  return {result: 'passed', packageState: knowledgePackage.editorialStatus, assetState: asset.editorialStatus, reviewState: review.status,
    sources: knowledgePackage.sources.length, claims: ledger.claims.length, selectedClaims: asset.selectedClaimIds.length,
    excludedClaims: ledger.claims.filter((c) => c.assessment === 'EXCLUDED').length,
    unknownClaims: ledger.claims.filter((c) => c.assessment === 'UNKNOWN').length, hookOptions: hooks.proposals.length, deterministicArtifacts: manifest.files.length};
};

if (process.argv[1]?.endsWith('validate-longitude-research.ts')) console.log(JSON.stringify(validateLongitudeResearch(), null, 2));
