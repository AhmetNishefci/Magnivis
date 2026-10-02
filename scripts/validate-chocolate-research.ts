import {architecturePreviousDocumentBytes} from './artifact-v2-integrity';
import {createHash} from 'node:crypto';
import {readFileSync, readdirSync} from 'node:fs';
import {resolve} from 'node:path';
import {execFileSync} from 'node:child_process';
import {z} from 'zod';
import {knowledgePackageSchema} from '../src/knowledge/schema';
import {contentAssetSchema} from '../src/content-assets/schema';
import {createKnowledgePackageRegistry} from '../src/knowledge/registry';
import {createContentAssetRegistry} from '../src/content-assets/registry';
import {createTopicCandidateRegistry} from '../src/content-intelligence/registry';
import {validateClaimReviewBundle} from '../src/content-intelligence/claim-review';
import {sha256Json, stableJson} from '../src/content-intelligence/run-schema';
import {assertTopicCandidateTransition, hookProposalBatchSchema, researchWorkspaceDraftSchema, topicCandidateSchema} from '../src/content-intelligence/schema';

export const chocolateReviewDirectory = resolve('content-intelligence/reviews/chocolate-crystal-choice-v1');
const sha = (bytes: string | Buffer) => createHash('sha256').update(bytes).digest('hex');
const ledgerSchema = z.object({
  schemaVersion: z.literal(1), packageId: z.literal('chocolate-crystal-choice'), packageRevision: z.literal(1),
  reviewState: z.literal('awaiting-owner-decision'), statusMapping: z.record(z.string(), z.string()),
  claims: z.array(z.object({
    claimId: z.string(), proposedWording: z.string(), statementSha256: z.string(), intendedScriptVisualUse: z.string().min(1),
    evidence: z.array(z.object({sourceId: z.string(), locator: z.string(), notes: z.string()}).strict()),
    assessment: z.enum(['SUPPORTED', 'QUALIFIED', 'EXCLUDED', 'UNKNOWN']),
    repositoryStatus: z.enum(['supported', 'unverified', 'uncertain']), confidence: z.string().min(1),
    caveats: z.array(z.string()), narrationEligibility: z.string(), onScreenEligibility: z.string(),
    useInRecommendedAsset: z.boolean(), rationale: z.string().min(1),
  }).strict()),
}).strict();

// Native review objects remain scoped snapshots; this does not register a production.
export const validateChocolateResearch = (directory = chocolateReviewDirectory) => {
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
    candidateId: z.literal('topic.chocolate-crystal-choice'), cycleId: z.literal('discovery.cycle-3-2026-10-01'),
    discoveryPath: z.literal('content-intelligence/discovery/cycle-3-2026-10-01/discovery.json'),
    discoverySha256: z.string().regex(/^[a-f0-9]{64}$/), owner: z.literal('Ahmet Nishefci'),
    authorizedScope: z.literal('bounded-deep-research-and-editorial-proposal'),
    editorialApproval: z.literal(false), productionAuthorized: z.literal(false), publicationAuthorized: z.literal(false),
    provenance: z.object({baseCommit: z.literal('d0026125de4d3866738c6da232c8ce480aa15769'),
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
  if (knowledgePackage.id !== 'chocolate-crystal-choice' || knowledgePackage.revision !== 1 || asset.revision !== 1
    || knowledgePackage.editorialStatus !== 'review' || asset.editorialStatus !== 'editorial-review'
    || knowledgePackage.approval || asset.approval || asset.narrationPlan
    || knowledgePackage.claims.some((c) => c.review || c.verificationStatus === 'verified')) throw new Error('Owner editorial gate bypass');
  const review = validateClaimReviewBundle(read('claim-review.json'), knowledgePackage, asset);
  const ledger = ledgerSchema.parse(read('claim-ledger.json'));
  if (ledger.claims.length !== knowledgePackage.claims.length || new Set(ledger.claims.map((c) => c.claimId)).size !== ledger.claims.length) throw new Error('Incomplete ledger');
  ledger.claims.forEach((entry) => {
    const claim = knowledgePackage.claims.find((c) => c.id === entry.claimId);
    const decision = review.claimReviews.find((c) => c.claimId === entry.claimId);
    if (!claim || !decision || entry.statementSha256 !== sha256Json(claim.statement) || entry.proposedWording !== claim.statement || entry.repositoryStatus !== claim.verificationStatus
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
  if (hooks.knowledgePackageId !== knowledgePackage.id || hooks.packageRevision !== 1 || hooks.proposals.length !== 5) throw new Error('Hook proposal identity drift');
  hooks.proposals.forEach((h) => {
    const canonical = knowledgePackage.hooks.find(({id}) => id === h.id.replace('.hook-proposal.', '.hook.'));
    if (!canonical || h.text !== canonical.text || stableJson(h.claimIds) !== stableJson(canonical.claimIds)
      || h.claimIds.some((id) => knowledgePackage.claims.find((c) => c.id === id)?.verificationStatus !== 'supported')) throw new Error('Hook evidence drift');
  });
  const inspections = z.object({inspections: z.array(z.unknown())}).passthrough().parse(read('source-inspections.json'));
  if (stableJson(inspections.inspections) !== stableJson(review.sourceInspections)) throw new Error('Source inspection drift');
  const hookReview = z.object({recommendedHookId: z.string(), ownerApproved: z.literal(false),
    options: z.array(z.object({hookId: z.string(), text: z.string()}).passthrough()).length(5)}).passthrough().parse(read('hook-review.json'));
  if (hookReview.recommendedHookId !== asset.hookId || new Set(hookReview.options.map((h) => h.hookId)).size !== 5
    || hookReview.options.some((h) => knowledgePackage.hooks.find(({id}) => id === h.hookId)?.text !== h.text)) throw new Error('Hook review drift');
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
  const proposal = z.object({exactNarration: z.string(), wordCount: z.number().int(),
    wordCountMethod: z.string(), totalEstimateSeconds: z.object({minimum: z.number(), maximum: z.number()}),
    nextGate: z.literal('AHMET — CYCLE #3 EDITORIAL REVIEW'), ownerApproved: z.literal(false),
  }).passthrough().parse(read('editorial-proposal.json'));
  const narration = asset.script.segments.map((s) => s.text).join(' ');
  const count = narration.split(/\s+/).length;
  if (proposal.exactNarration !== narration || proposal.wordCount !== count
    || stableJson(proposal.totalEstimateSeconds) !== stableJson(asset.durationIntentSeconds)) throw new Error('Narration/count/runtime drift');
  for (const visual of asset.visualPlan) if (visual.visualType !== 'bespoke' || visual.suggestedPrimitive
    || visual.assetRequirements || !visual.notes?.includes('not a selected visual medium')) throw new Error('Premature creative execution');
  const access = z.object({inventory: z.array(z.object({sourceId: z.string(), accessStatus: z.string(),
    evidenceLocations: z.array(z.string()), limitations: z.array(z.string())}).passthrough())}).passthrough().parse(read('source-access-accounting.json'));
  if (access.inventory.length !== review.sourceInspections.length || new Set(access.inventory.map((s) => s.sourceId)).size !== access.inventory.length) throw new Error('Access inventory incomplete');
  for (const item of access.inventory) {
    const inspection = review.sourceInspections.find((s) => s.sourceId === item.sourceId);
    if (!inspection || item.accessStatus !== inspection.accessStatus
      || stableJson(item.evidenceLocations) !== stableJson(inspection.evidenceLocations)
      || stableJson(item.limitations) !== stableJson(inspection.limitations)) throw new Error('Access accounting drift');
  }
  // Historical discovery, release, analytics and production bytes remain bound to the committed parent.
  const base = 'd0026125de4d3866738c6da232c8ce480aa15769';
  const allowed = (path: string) => path.startsWith('content-intelligence/reviews/chocolate-crystal-choice-v1/')
    || ['docs/PROJECT-STATE.md', 'docs/CONTENT-INTELLIGENCE.md', 'docs/DECISIONS.md',
      'scripts/validate-chocolate-research.ts', 'tests/chocolate-research.test.ts'].includes(path);
  const changed = execFileSync('git', ['diff', '--name-only', base, '--'], {encoding: 'utf8'}).trim().split('\n').filter(Boolean);
  const untracked = execFileSync('git', ['ls-files', '--others', '--exclude-standard'], {encoding: 'utf8'}).trim().split('\n').filter(Boolean);
  if ([...changed, ...untracked].some((path) => !allowed(path))) {
    // A later explicitly authorized extension must pass its stronger scope/owner/hash gate.
    // The original research snapshots and all original semantic checks remain unchanged.
    execFileSync(process.execPath, ['--import', 'tsx', 'scripts/validate-chocolate-finalization.ts'], {stdio: 'pipe'});
  }
  const protectedPaths = ['content-intelligence/discovery/cycle-3-2026-10-01',
    'content-intelligence/operations/longitude-clock-scheduling-v1',
    'content-intelligence/reviews/longitude-clock-publication-v1',
    'docs/STRATEGY.md', 'docs/CREATIVE-DIRECTION.md', 'docs/CAPTIONS.md', 'docs/ROADMAP.md',
    'docs/PERFORMANCE.md', 'docs/OPERATIONS.md', 'AGENTS.md'];
  for (const path of protectedPaths) {
    const names = execFileSync('git', ['ls-tree', '-r', '--name-only', base, '--', path], {encoding: 'utf8'}).trim().split('\n').filter(Boolean);
    for (const name of names) if (!architecturePreviousDocumentBytes(name,readFileSync(resolve(name))).equals(execFileSync('git', ['show', `${base}:${name}`]))) throw new Error(`Preserved bytes drift: ${name}`);
  }
  const scheduling = JSON.parse(readFileSync(resolve('content-intelligence/operations/longitude-clock-scheduling-v1/owner-report.json'), 'utf8')) as {master: {path: string; sha256: string}};
  if (sha(readFileSync(resolve(scheduling.master.path))) !== scheduling.master.sha256) throw new Error('Longitude locked master drift');
  const text = bytes('owner-review.md').toString();
  asset.script.segments.forEach((s) => {if (!text.includes(s.text)) throw new Error('Owner narration differs from ContentAsset');});
  if (!text.includes('AHMET — CYCLE #3 EDITORIAL REVIEW')) throw new Error('Missing owner gate');
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
    unknownClaims: ledger.claims.filter((c) => c.assessment === 'UNKNOWN').length, wordCount: count, historicalPreservation: 'passed', openWorldAndPolicyPreservation: 'passed', hookOptions: hooks.proposals.length, deterministicArtifacts: manifest.files.length};
};

if (process.argv[1]?.endsWith('validate-chocolate-research.ts')) console.log(JSON.stringify(validateChocolateResearch(), null, 2));
