import {createHash} from 'node:crypto';
import {readFileSync, readdirSync} from 'node:fs';
import {resolve} from 'node:path';
import {z} from 'zod';
import {phantomTrafficKnowledgePackage as knowledgePackage} from '../src/knowledge/packages/phantom-traffic';
import {phantomTrafficContentAsset as contentAsset} from '../src/content-assets/assets/phantom-traffic';
import {createContentAssetRegistry} from '../src/content-assets/registry';
import {createKnowledgePackageRegistry} from '../src/knowledge/registry';
import {createTopicCandidateRegistry} from '../src/content-intelligence/registry';
import {validateClaimReviewBundle} from '../src/content-intelligence/claim-review';
import {stableJson} from '../src/content-intelligence/run-schema';
import {
  assertTopicCandidateTransition,
  hookProposalBatchSchema,
  researchWorkspaceDraftSchema,
  topicCandidateSchema,
} from '../src/content-intelligence/schema';

export const trafficReviewDirectory = resolve('content-intelligence/reviews/phantom-traffic-v1');
const readJson = (name: string): unknown => JSON.parse(readFileSync(resolve(trafficReviewDirectory, name), 'utf8'));
const sha256Bytes = (bytes: string | Buffer) => createHash('sha256').update(bytes).digest('hex');
const ledgerSchema = z.object({
  schemaVersion: z.literal(1), packageId: z.literal('phantom-traffic'), packageRevision: z.literal(1),
  reviewState: z.literal('awaiting-owner-decision'), statusMapping: z.record(z.string(), z.string()),
  claims: z.array(z.object({
    claimId: z.string(), proposedWording: z.string(),
    evidence: z.array(z.object({sourceId: z.string(), locator: z.string(), notes: z.string()}).strict()),
    assessment: z.enum(['SUPPORTED', 'QUALIFIED', 'EXCLUDED']),
    repositoryStatus: z.enum(['supported', 'unverified']), confidence: z.string().min(1),
    caveats: z.array(z.string()), narrationEligibility: z.string(), onScreenEligibility: z.string(),
    useInRecommendedAsset: z.boolean(), rationale: z.string().min(1),
  }).strict()),
}).strict();
const selectionSchema = z.object({
  schemaVersion: z.literal(1), cycleId: z.string(), discoveryPath: z.string(), discoverySha256: z.string(),
  candidateId: z.literal('topic.phantom-traffic'), discoveryCandidateRevision: z.literal(1),
  researchCandidateRevision: z.literal(2), owner: z.literal('Ahmet Nishefci'), authority: z.string().min(1),
  recordedAt: z.iso.datetime(), recordedLocalDate: z.literal('2026-10-01'), timezone: z.literal('Europe/Belgrade'),
  authorizedScope: z.literal('bounded-deep-research-and-editorial-proposal'),
  editorialApproval: z.literal(false), productionAuthorized: z.literal(false), publicationAuthorized: z.literal(false),
  provenance: z.object({method: z.literal('manual-ai-assisted-source-inspection-and-editorial-drafting'),
    operator: z.literal('Codex'), model: z.string(), modelIdentityBasis: z.string(),
    paidApiUsed: z.literal(false), workflowEnvelope: z.literal(false), baseCommit: z.string().regex(/^[a-f0-9]{40}$/),
  }).strict(),
}).strict();
const hookReviewSchema = z.object({schemaVersion: z.literal(1), recommendedHookId: z.string(), ownerApproved: z.literal(false),
  options: z.array(z.object({hookId: z.string(), text: z.string(), evaluation: z.object({
    comprehension: z.string().min(1), curiosity: z.string().min(1), accuracy: z.string().min(1),
    visualPayoff: z.string().min(1), explanationFit: z.string().min(1), clickbaitRisk: z.string().min(1), magnivisFit: z.string().min(1),
  }).strict()}).strict()).length(5),
}).strict();
const manifestSchema = z.object({schemaVersion: z.literal(1), kind: z.literal('research-editorial-review-artifacts'),
  files: z.array(z.object({path: z.string().regex(/^[a-z0-9.-]+$/), sha256: z.string().regex(/^[a-f0-9]{64}$/)}).strict()),
}).strict();

export const validateTrafficResearch = () => {
  const packages = createKnowledgePackageRegistry([knowledgePackage]);
  createContentAssetRegistry([contentAsset], packages);
  const candidate = topicCandidateSchema.parse(readJson('topic-candidate.researching.json'));
  createTopicCandidateRegistry([candidate], packages);
  assertTopicCandidateTransition('evaluating', candidate.status);
  if (candidate.revision !== 2 || candidate.review || candidate.proposedKnowledgePackageId !== knowledgePackage.id) {
    throw new Error('Research candidate identity/state drift');
  }
  const selection = selectionSchema.parse(readJson('selection.json'));
  const discoveryBytes = readFileSync(resolve(selection.discoveryPath));
  if (sha256Bytes(discoveryBytes) !== selection.discoverySha256) throw new Error('Historical discovery hash drift');
  const discovery = JSON.parse(discoveryBytes.toString()) as {id: string; candidates: unknown[]};
  const prior = topicCandidateSchema.parse(discovery.candidates.find((c) => topicCandidateSchema.parse(c).id === candidate.id));
  if (discovery.id !== selection.cycleId || stableJson(candidate) !== stableJson({...prior, revision: 2, status: 'researching'})) {
    throw new Error('Research candidate must preserve discovery identity and record only the authorized transition');
  }
  const workspace = researchWorkspaceDraftSchema.parse(readJson('research-workspace.draft.json'));
  if (workspace.topicCandidateId !== candidate.id || workspace.proposedKnowledgePackageId !== knowledgePackage.id
    || stableJson(workspace.claimCandidates) !== stableJson(knowledgePackage.claims.map((c) => ({...c, verificationStatus: 'unverified'})))) {
    throw new Error('Initial unverified research record drift');
  }
  const hooks = hookProposalBatchSchema.parse(readJson('hook-proposals.draft.json'));
  if (hooks.knowledgePackageId !== knowledgePackage.id || hooks.packageRevision !== knowledgePackage.revision) throw new Error('Stale hook proposal');
  hooks.proposals.forEach((h) => {
    const canonical = knowledgePackage.hooks.find(({id}) => id === h.id.replace('.hook-proposal.', '.hook.'));
    if (!canonical || h.text !== canonical.text || stableJson(h.claimIds) !== stableJson(canonical.claimIds)) throw new Error('Hook proposal drift');
    h.claimIds.forEach((id) => {
      if (knowledgePackage.claims.find((c) => c.id === id)?.verificationStatus !== 'supported') throw new Error('Hook uses unsupported claim');
    });
  });
  const review = validateClaimReviewBundle(readJson('claim-review.json'), knowledgePackage, contentAsset);
  if (knowledgePackage.editorialStatus !== 'review' || contentAsset.editorialStatus !== 'editorial-review'
    || knowledgePackage.approval || contentAsset.approval || knowledgePackage.claims.some((c) => c.review || c.verificationStatus === 'verified')) {
    throw new Error('Human gate bypass: review objects must remain unapproved');
  }
  const ledger = ledgerSchema.parse(readJson('claim-ledger.json'));
  if (ledger.claims.length !== knowledgePackage.claims.length || new Set(ledger.claims.map((c) => c.claimId)).size !== ledger.claims.length) {
    throw new Error('Claim ledger must cover every package claim exactly once');
  }
  ledger.claims.forEach((entry) => {
    const claim = knowledgePackage.claims.find((c) => c.id === entry.claimId);
    const audited = review.claimReviews.find((c) => c.claimId === entry.claimId);
    if (!claim || !audited || entry.proposedWording !== claim.statement || entry.repositoryStatus !== claim.verificationStatus
      || stableJson(entry.evidence) !== stableJson(claim.evidence) || stableJson(entry.caveats) !== stableJson(claim.caveats)
      || entry.useInRecommendedAsset !== contentAsset.selectedClaimIds.includes(entry.claimId)) throw new Error('Ledger/evidence mismatch');
    if (entry.assessment === 'EXCLUDED') {
      if (audited.decision !== 'reject' || entry.useInRecommendedAsset || entry.narrationEligibility !== 'excluded'
        || entry.onScreenEligibility !== 'excluded') throw new Error('Excluded statement can enter editorial material');
    } else if (claim.verificationStatus !== 'supported' || audited.recommendedVerificationStatus !== 'verified'
      || (entry.assessment === 'QUALIFIED' && claim.caveats.length === 0)) throw new Error('Unsupported or unqualified claim promoted');
  });
  contentAsset.script.segments.forEach((segment) => {
    if (segment.type !== 'factual') throw new Error('This proposal must bind every spoken sentence to evidence');
    segment.claimIds.forEach((id) => {
      if (!ledger.claims.find((c) => c.claimId === id)?.useInRecommendedAsset) throw new Error('Script fact is not reviewed/selected');
    });
  });
  const hookReview = hookReviewSchema.parse(readJson('hook-review.json'));
  if (hookReview.recommendedHookId !== contentAsset.hookId) throw new Error('Hook recommendation drift');
  if (new Set(hookReview.options.map((h) => h.hookId)).size !== knowledgePackage.hooks.length) throw new Error('Hook assessment coverage drift');
  hookReview.options.forEach((h) => {
    if (knowledgePackage.hooks.find(({id}) => id === h.hookId)?.text !== h.text) throw new Error('Hook assessment wording drift');
  });
  const inspections = z.object({schemaVersion: z.literal(1), inspections: z.array(z.unknown()), unusedLeads: z.array(z.unknown()),
    sourceTension: z.string(), retrievalConvention: z.string()}).strict().parse(readJson('source-inspections.json'));
  if (stableJson(inspections.inspections) !== stableJson(review.sourceInspections)) throw new Error('Source inspection drift');
  const causal = z.object({schemaVersion: z.literal(1), ownerApproved: z.literal(false), decisions: z.array(z.object({
    proposedPhrase: z.string().min(1), recommendation: z.enum(['revise', 'reject', 'qualify']), reason: z.string().min(1),
    replacementOrExclusionClaimId: z.string(),
  }).strict()).length(7)}).strict().parse(readJson('causality-decisions.json'));
  causal.decisions.forEach((entry) => {
    const claim = knowledgePackage.claims.find((c) => c.id === entry.replacementOrExclusionClaimId);
    if (!claim || (entry.recommendation === 'reject' && claim.verificationStatus !== 'unverified')) {
      throw new Error('Causal phrasing decision references a missing or non-excluded claim');
    }
  });
  const ownerText = readFileSync(resolve(trafficReviewDirectory, 'owner-review.md'), 'utf8');
  contentAsset.script.segments.forEach(({text}) => {if (!ownerText.includes(text)) throw new Error('Owner narration differs from ContentAsset');});
  const manifest = manifestSchema.parse(readJson('artifact-manifest.json'));
  const names = readdirSync(trafficReviewDirectory).filter((name) => name !== 'artifact-manifest.json').sort();
  if (stableJson(manifest.files.map(({path}) => path).sort()) !== stableJson(names)) throw new Error('Artifact manifest file coverage drift');
  for (const file of manifest.files) {
    if (sha256Bytes(readFileSync(resolve(trafficReviewDirectory, file.path))) !== file.sha256) throw new Error(`Artifact hash drift: ${file.path}`);
  }
  for (const name of [...names, 'artifact-manifest.json'].filter((name) => name.endsWith('.json'))) {
    if (readFileSync(resolve(trafficReviewDirectory, name), 'utf8') !== stableJson(readJson(name), 2) + '\n') {
      throw new Error(`Noncanonical JSON bytes: ${name}`);
    }
  }
  return {packageId: knowledgePackage.id, packageRevision: knowledgePackage.revision, packageState: knowledgePackage.editorialStatus,
    assetId: contentAsset.id, assetRevision: contentAsset.revision, assetState: contentAsset.editorialStatus,
    sources: knowledgePackage.sources.length, claims: ledger.claims.length, selectedClaims: contentAsset.selectedClaimIds.length,
    excludedClaims: ledger.claims.filter((c) => c.assessment === 'EXCLUDED').length, hookOptions: hooks.proposals.length,
    reviewState: review.status, deterministicArtifacts: manifest.files.length, result: 'passed'};
};

if (process.argv[1]?.endsWith('validate-traffic-research.ts')) console.log(JSON.stringify(validateTrafficResearch(), null, 2));
