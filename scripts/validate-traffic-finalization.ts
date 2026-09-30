import {createHash} from 'node:crypto';
import {readFileSync, readdirSync} from 'node:fs';
import {resolve} from 'node:path';
import {z} from 'zod';
import originalPackage from '../content-intelligence/reviews/phantom-traffic-v1/knowledge-package.review.json';
import originalAsset from '../content-intelligence/reviews/phantom-traffic-v1/content-asset.review.json';
import originalReview from '../content-intelligence/reviews/phantom-traffic-v1/claim-review.json';
import originalManifest from '../content-intelligence/reviews/phantom-traffic-v1/artifact-manifest.json';
import {phantomTrafficKnowledgePackage as knowledgePackage} from '../src/knowledge/packages/phantom-traffic';
import {phantomTrafficContentAsset as contentAsset} from '../src/content-assets/assets/phantom-traffic';
import {knowledgePackageSchema} from '../src/knowledge/schema';
import {contentAssetSchema} from '../src/content-assets/schema';
import {createContentAssetRegistry} from '../src/content-assets/registry';
import {createKnowledgePackageRegistry} from '../src/knowledge/registry';
import {applyScopedOwnerDecision} from '../src/content-intelligence/scoped-owner-decision';
import {validateClaimReviewBundle} from '../src/content-intelligence/claim-review';
import {sha256Json, stableJson} from '../src/content-intelligence/run-schema';
import {validateTrafficResearch} from './validate-traffic-research';

export const trafficFinalizationDirectory = resolve('content-intelligence/reviews/phantom-traffic-finalization-v2');
const readJson = (name: string): unknown => JSON.parse(readFileSync(resolve(trafficFinalizationDirectory, name), 'utf8'));
const byteHash = (path: string) => createHash('sha256').update(readFileSync(path)).digest('hex');
const hash = z.string().regex(/^[a-f0-9]{64}$/);
const reportSchema = z.object({
  schemaVersion: z.literal(1), id: z.literal('editorial-finalization.phantom-traffic.v2'),
  ownerDecisionId: z.string(), ownerDecisionSha256: hash, preparedAt: z.iso.datetime(), baseCommit: z.string().regex(/^[a-f0-9]{40}$/),
  packageId: z.literal('phantom-traffic'), packageRevision: z.literal(2), packageSha256: hash,
  assetId: z.literal('phantom-traffic.asset.backward-wave'), assetRevision: z.literal(2), assetSha256: hash,
  reviewId: z.literal('claim-review.phantom-traffic.v2'), reviewSha256: hash, scriptSha256: hash,
  finalExactNarration: z.string(), wordCount: z.number().int().positive(),
  runtimeEstimate: z.object({method: z.literal('word-rate estimate, not generated or measured audio'),
    wordsPerMinute: z.object({minimum: z.literal(140), maximum: z.literal(150)}).strict(),
    spokenSeconds: z.object({minimum: z.number(), maximum: z.number()}).strict(),
    intendedSeconds: z.object({minimum: z.literal(34), maximum: z.literal(40)}).strict(), pauseIntent: z.string().min(1),
  }).strict(),
  state: z.literal('awaiting-final-exact-narration-and-editorial-package-approval'),
  verifiedClaimIds: z.array(z.string()), remainingSupportedReserveClaims: z.literal(13), excludedClaims: z.literal(11),
  productionAuthorized: z.literal(false), publicationAuthorized: z.literal(false), changes: z.array(z.string()),
  provenance: z.object({method: z.literal('manual-ai-assisted-editorial-finalization'), operator: z.literal('Codex'),
    paidApiUsed: z.literal(false), workflowEnvelope: z.literal(false), ownerReviewTimestampSupplied: z.literal(false)}).strict(),
}).strict();
const wordingSchema = z.object({
  schemaVersion: z.literal(1), preparedAt: z.iso.datetime(), reviewState: z.literal('awaiting-final-exact-narration-approval'),
  claimId: z.literal('phantom-traffic.claim.conditional-growth'), claimStatementUnchanged: z.literal(true),
  approvedClaimStatementSha256: hash, previousSentence: z.string(), proposedSentence: z.string(),
  decision: z.literal('viewer-facing-paraphrase-only'), analysis: z.string().min(1),
  alternatives: z.array(z.object({text: z.string(), assessment: z.string()}).strict()).length(3),
  evidence: z.array(z.object({sourceId: z.string(), url: z.url(), locator: z.string().min(1), inspection: z.string().min(1)}).strict()).min(1),
  selectedHookUnchanged: z.literal(true), allOtherNarrationUnchanged: z.literal(true),
}).strict();

export const validateTrafficFinalization = () => {
  validateTrafficResearch();
  const priorPackage = knowledgePackageSchema.parse(originalPackage);
  const priorAsset = contentAssetSchema.parse(originalAsset);
  const applied = applyScopedOwnerDecision({decision: readJson('owner-decision.json'), review: originalReview,
    knowledgePackage: priorPackage, contentAsset: priorAsset});
  const {decision} = applied;
  const expectedBindings = originalManifest.files.map(({path, sha256}) => ({path: `content-intelligence/reviews/phantom-traffic-v1/${path}`, sha256}));
  expectedBindings.push({path: 'content-intelligence/reviews/phantom-traffic-v1/artifact-manifest.json',
    sha256: byteHash(resolve('content-intelligence/reviews/phantom-traffic-v1/artifact-manifest.json'))});
  if (stableJson(decision.researchArtifactHashes) !== stableJson(expectedBindings)) throw new Error('Owner research artifact bindings differ');
  decision.researchArtifactHashes.forEach(({path, sha256}) => {
    if (byteHash(resolve(path)) !== sha256) throw new Error('Owner decision binds changed research bytes');
  });
  if (stableJson(applied.knowledgePackage) !== stableJson(knowledgePackage)) throw new Error('Verified package does not reproduce scoped owner decision');
  const verifiedIds = knowledgePackage.claims.filter((c) => c.verificationStatus === 'verified').map((c) => c.id).sort();
  if (stableJson(verifiedIds) !== stableJson([...priorAsset.selectedClaimIds].sort())) throw new Error('Owner approval must cover exactly the six narration claims');
  if (contentAsset.revision !== 2 || contentAsset.editorialStatus !== 'editorial-review' || contentAsset.approval
    || knowledgePackage.editorialStatus !== 'review' || knowledgePackage.approval) throw new Error('Final narration gate bypassed');
  createContentAssetRegistry([contentAsset], createKnowledgePackageRegistry([knowledgePackage]));
  const review = validateClaimReviewBundle(readJson('claim-review.json'), knowledgePackage, contentAsset);
  const wording = wordingSchema.parse(readJson('wording-review.json'));
  const conditional = knowledgePackage.claims.find(({id}) => id === wording.claimId)!;
  if (wording.approvedClaimStatementSha256 !== sha256Json(conditional.statement)
    || wording.previousSentence !== priorAsset.script.segments[2]!.text
    || wording.proposedSentence !== contentAsset.script.segments[2]!.text
    || wording.proposedSentence !== 'In dense traffic, small speed changes can sometimes grow as drivers adjust to the cars ahead.') {
    throw new Error('Conditional wording/claim binding drift');
  }
  const expectedAsset = structuredClone(contentAsset);
  expectedAsset.revision = 1;
  expectedAsset.script.segments[2]!.text = priorAsset.script.segments[2]!.text;
  expectedAsset.visualPlan = priorAsset.visualPlan;
  if (stableJson(expectedAsset) !== stableJson(priorAsset)) throw new Error('Unapproved changes outside wording and conceptual visual refinement');
  contentAsset.visualPlan.forEach((visual, i) => {
    const prior = priorAsset.visualPlan[i]!;
    if (visual.notes?.includes('Audio-muted comprehension') === false && i === 0) throw new Error('Muted motion distinction missing');
    if (visual.notes === prior.notes) throw new Error('Conceptual refinement missing');
    const shape = {...visual, notes: undefined, objective: undefined};
    const priorShape = {...prior, notes: undefined, objective: undefined};
    if (stableJson(shape) !== stableJson(priorShape)) throw new Error('Visual refinement added production parameters');
  });
  if (decision.approvedComponents.length !== 7) throw new Error('Missing approved editorial component');
  const report = reportSchema.parse(readJson('editorial-finalization.json'));
  if (report.ownerDecisionId !== decision.id || report.ownerDecisionSha256 !== sha256Json(decision)
    || report.packageSha256 !== sha256Json(knowledgePackage) || report.assetSha256 !== sha256Json(contentAsset)
    || report.reviewSha256 !== sha256Json(review) || report.scriptSha256 !== sha256Json(contentAsset.script)) {
    throw new Error('Final editorial state hash drift');
  }
  const narration = contentAsset.script.segments.map(({text}) => text).join('\n\n');
  const words = (narration.match(/\b[\w]+(?:[-’'][\w]+)*\b/g) ?? []).length;
  if (report.finalExactNarration !== narration || report.wordCount !== words
    || stableJson([...report.verifiedClaimIds].sort()) !== stableJson(verifiedIds)
    || report.runtimeEstimate.spokenSeconds.minimum !== words / 150 * 60
    || report.runtimeEstimate.spokenSeconds.maximum !== words / 140 * 60) throw new Error('Narration/runtime/claim report drift');
  const text = readFileSync(resolve(trafficFinalizationDirectory, 'owner-review.md'), 'utf8');
  contentAsset.script.segments.forEach(({text: sentence}) => {if (!text.includes(sentence)) throw new Error('Owner handoff script drift');});
  const manifest = z.object({schemaVersion: z.literal(1), kind: z.literal('editorial-finalization-review-artifacts'),
    files: z.array(z.object({path: z.string().regex(/^[a-z0-9.-]+$/), sha256: hash}).strict())}).strict().parse(readJson('artifact-manifest.json'));
  const names = readdirSync(trafficFinalizationDirectory).filter((name) => name !== 'artifact-manifest.json').sort();
  if (stableJson(manifest.files.map(({path}) => path).sort()) !== stableJson(names)) throw new Error('Final artifact coverage drift');
  manifest.files.forEach(({path, sha256}) => {if (byteHash(resolve(trafficFinalizationDirectory, path)) !== sha256) throw new Error('Final artifact bytes drift');});
  [...names, 'artifact-manifest.json'].filter((name) => name.endsWith('.json')).forEach((name) => {
    if (readFileSync(resolve(trafficFinalizationDirectory, name), 'utf8') !== stableJson(readJson(name), 2) + '\n') throw new Error('Noncanonical final JSON');
  });
  return {result: 'passed', packageRevision: 2, assetRevision: 2, verifiedClaims: verifiedIds.length,
    supportedReserveClaims: 13, excludedClaims: 11, wordCount: words, state: report.state,
    ownerTimestamp: 'not supplied; explicit decision-entry time only', productionAuthorized: false, publicationAuthorized: false};
};

if (process.argv[1]?.endsWith('validate-traffic-finalization.ts')) console.log(JSON.stringify(validateTrafficFinalization(), null, 2));
