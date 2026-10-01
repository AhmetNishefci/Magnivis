import {createHash} from 'node:crypto';
import {readFileSync, readdirSync} from 'node:fs';
import {resolve} from 'node:path';
import {z} from 'zod';
import {knowledgePackageSchema} from '../src/knowledge/schema';
import {contentAssetSchema} from '../src/content-assets/schema';
import {createKnowledgePackageRegistry} from '../src/knowledge/registry';
import {createContentAssetRegistry} from '../src/content-assets/registry';
import {validateClaimReviewBundle} from '../src/content-intelligence/claim-review';
import {sha256Json, stableJson} from '../src/content-intelligence/run-schema';
import {longitudeReviewDirectory, validateLongitudeResearch} from './validate-longitude-research';

export const longitudeFinalizationDirectory = resolve('content-intelligence/reviews/longitude-clock-finalization-v2');
const hash = z.string().regex(/^[a-f0-9]{64}$/);
const byteHash = (path: string) => createHash('sha256').update(readFileSync(path)).digest('hex');
const read = (directory: string, name: string): unknown => JSON.parse(readFileSync(resolve(directory, name), 'utf8'));
const interval = z.object({minimum: z.number().positive(), maximum: z.number().positive()}).strict();
const reportSchema = z.object({
  schemaVersion: z.literal(1), id: z.literal('editorial-finalization.longitude-clock.v2'), preparedAt: z.iso.datetime(),
  baseCommit: z.literal('c957692f87d376d5cfef1377042df2314d4eb638'), packageId: z.literal('longitude-clock'), packageRevision: z.literal(2),
  packageSha256: hash, assetId: z.literal('longitude-clock.asset.time-to-position'), assetRevision: z.literal(2), assetSha256: hash,
  reviewId: z.literal('claim-review.longitude-clock.v2'), reviewSha256: hash, scriptSha256: hash, visualPlanSha256: hash,
  instructionSha256: hash, verificationQueueSha256: hash, finalExactNarration: z.string().min(1), wordCount: z.number().int().positive(),
  wordCountConvention: z.string().min(1), runtimeEstimate: z.object({method: z.literal('word-rate estimate, not generated or measured audio'),
    wordsPerMinute: z.object({minimum: z.literal(140), maximum: z.literal(150)}).strict(), spokenSeconds: interval,
    intentionalPausesSeconds: z.object({minimum: z.literal(5), maximum: z.literal(8)}).strict(), likelyTotalSeconds: interval,
    pauseIntent: z.string().min(1),
  }).strict(), state: z.literal('awaiting-final-editorial-approval'), selectedClaimIds: z.array(z.string()), verifiedClaimIds: z.array(z.never()),
  productionAuthorized: z.literal(false), publicationAuthorized: z.literal(false), changes: z.array(z.string().min(1)),
  provenance: z.object({method: z.literal('manual-ai-assisted-editorial-finalization'), operator: z.literal('Codex'), model: z.string(),
    modelIdentityBasis: z.string().min(1), paidApiUsed: z.literal(false), workflowEnvelope: z.literal(false), ownerReviewTimestampSupplied: z.literal(false)}).strict(),
}).strict();

export const validateLongitudeFinalization = (directory = longitudeFinalizationDirectory) => {
  validateLongitudeResearch();
  const originalPackage = knowledgePackageSchema.parse(read(longitudeReviewDirectory, 'knowledge-package.review.json'));
  const priorAsset = contentAssetSchema.parse(read(longitudeReviewDirectory, 'content-asset.review.json'));
  const pkg = knowledgePackageSchema.parse(read(directory, 'knowledge-package.review.json'));
  const asset = contentAssetSchema.parse(read(directory, 'content-asset.review.json'));
  // Acceptance of the evidence basis is explicitly not statement-level verification.
  if (stableJson(pkg) !== stableJson({...originalPackage, revision: 2})) throw new Error('Research truth/status changed during finalization');
  if (pkg.approval || asset.approval || asset.revision !== 2 || asset.editorialStatus !== 'editorial-review' || asset.narrationPlan
    || asset.hookId !== priorAsset.hookId || asset.id !== priorAsset.id) throw new Error('Final editorial gate or identity bypass');
  createContentAssetRegistry([asset], createKnowledgePackageRegistry([pkg]));
  const review = validateClaimReviewBundle(read(directory, 'claim-review.json'), pkg, asset);
  const originalReview = validateClaimReviewBundle(read(longitudeReviewDirectory, 'claim-review.json'), originalPackage, priorAsset);
  const expectedReview = {...originalReview, id: 'claim-review.longitude-clock.v2', packageRevision: 2, assetRevision: 2, preparedAt: review.preparedAt,
    claimReviews: originalReview.claimReviews.map((c) => ({...c, useInRecommendedAsset: asset.selectedClaimIds.includes(c.claimId)}))};
  if (stableJson(review) !== stableJson(expectedReview)) throw new Error('Inspections/claim decisions changed during finalization');
  const selected = pkg.claims.filter((c) => asset.selectedClaimIds.includes(c.id));
  if (selected.length !== 8 || selected.some((c) => c.verificationStatus !== 'supported' || c.review)) throw new Error('Selected claims must remain supported, not verified');
  const ledger = z.object({packageRevision: z.literal(2), claims: z.array(z.object({claimId: z.string(), useInRecommendedAsset: z.boolean()}).passthrough())}).passthrough().parse(read(directory, 'claim-ledger.json'));
  const priorLedger = z.object({claims: z.array(z.object({claimId: z.string()}).passthrough())}).passthrough().parse(read(longitudeReviewDirectory, 'claim-ledger.json'));
  if (stableJson(ledger) !== stableJson({...priorLedger, packageRevision: 2,
    claims: priorLedger.claims.map((c) => ({...c, useInRecommendedAsset: asset.selectedClaimIds.includes(c.claimId)}))})) throw new Error('Ledger preservation drift');
  const instruction = z.object({schemaVersion: z.literal(1), id: z.literal('owner-instruction.longitude-clock.finalization.v2'), authority: z.literal('explicit-owner-message'),
    owner: z.literal('Ahmet Nishefci'), enteredAt: z.iso.datetime(), timeBasis: z.literal('decision-entry'), ownerSuppliedReviewTimestamp: z.null(),
    ownerInstruction: z.string().min(1), baseCommit: z.literal('c957692f87d376d5cfef1377042df2314d4eb638'), preferredHookId: z.literal('longitude-clock.hook.question'),
    researchBasisAccepted: z.literal(true), claimsVerified: z.literal(false), narrationApproved: z.literal(false), visualPlanApproved: z.literal(false),
    creativeDirectionAuthorized: z.literal(false), productionAuthorized: z.literal(false), publicationAuthorized: z.literal(false),
    researchArtifactHashes: z.array(z.object({path: z.string(), sha256: hash}).strict()),
  }).strict().parse(read(directory, 'owner-instruction.json'));
  const originalNames = readdirSync(longitudeReviewDirectory).sort();
  const expectedBindings = originalNames.map((name) => ({path: `content-intelligence/reviews/longitude-clock-v1/${name}`, sha256: byteHash(resolve(longitudeReviewDirectory, name))}));
  if (stableJson(instruction.researchArtifactHashes) !== stableJson(expectedBindings)) throw new Error('Accepted research artifact binding drift');
  const queue = z.object({schemaVersion: z.literal(1), packageId: z.literal('longitude-clock'), packageRevision: z.literal(2),
    assetId: z.literal('longitude-clock.asset.time-to-position'), assetRevision: z.literal(2), reviewId: z.literal('claim-review.longitude-clock.v2'),
    ownerVerificationGranted: z.literal(false), reservePolicy: z.string().min(1), selectedClaims: z.array(z.object({
      claimId: z.string(), statement: z.string(), statementSha256: hash, evidence: z.array(z.unknown()), caveats: z.array(z.string()),
      repositoryStatus: z.literal('supported'), usedByScriptSegmentIds: z.array(z.string()), usedByVisualIds: z.array(z.string()), ownerDecisionRequired: z.literal(true),
    }).strict()).length(8),
  }).strict().parse(read(directory, 'owner-verification-queue.json'));
  const expectedQueue = selected.map((c) => ({claimId: c.id, statement: c.statement, statementSha256: sha256Json(c.statement), evidence: c.evidence,
    caveats: c.caveats, repositoryStatus: c.verificationStatus,
    usedByScriptSegmentIds: asset.script.segments.filter((s) => s.type === 'factual' && s.claimIds.includes(c.id)).map((s) => s.id),
    usedByVisualIds: asset.visualPlan.filter((v) => v.claimIds.includes(c.id)).map((v) => v.id), ownerDecisionRequired: true}));
  if (stableJson(queue.selectedClaims) !== stableJson(expectedQueue)) throw new Error('Owner verification queue/statement hash drift');
  const contracts = z.object({schemaVersion: z.literal(1), assetId: z.literal('longitude-clock.asset.time-to-position'), assetRevision: z.literal(2),
    ownerApproved: z.literal(false), beats: z.array(z.object({beatId: z.string(), visualId: z.string(), comprehensionObjective: z.string().min(1),
      claimIds: z.array(z.string()).min(1), mustCommunicate: z.string().min(1), mustNotImply: z.string().min(1),
      continuityRequirements: z.string().min(1), disclosureRequirements: z.string().min(1)}).strict()).length(10),
  }).strict().parse(read(directory, 'visual-comprehension-contract.json'));
  if (asset.narrativeStructure.length !== 10 || asset.visualPlan.length !== 10) throw new Error('Incomplete conceptual beat coverage');
  contracts.beats.forEach((c, i) => {
    const v = asset.visualPlan[i]!; const b = asset.narrativeStructure[i]!;
    if (v.timingIntentSeconds || v.suggestedPrimitive || v.assetRequirements || v.visualType !== 'bespoke'
      || v.id !== c.visualId || b.id !== c.beatId || v.narrativeBeatId !== b.id || b.purpose !== c.comprehensionObjective
      || v.objective !== c.mustCommunicate || stableJson(v.claimIds) !== stableJson(c.claimIds)
      || !v.notes?.includes(c.mustNotImply) || !v.notes.includes(c.continuityRequirements) || !v.notes.includes(c.disclosureRequirements)) throw new Error('Conceptual comprehension/scope drift');
  });
  const narration = asset.script.segments.map((s) => s.text).join('\n\n');
  if (!narration.includes('corrected to match the clock’s timekeeping') || !narration.includes('Compare them at the same moment.')
    || !narration.includes('Two hours ahead. Thirty degrees east.') || !narration.includes('Other astronomical methods remained useful too.')) throw new Error('Required correction, simultaneity, east or historical qualification missing');
  if (!contracts.beats[2]!.disclosureRequirements.includes('mean solar time') || !contracts.beats[2]!.mustCommunicate.includes('BOTH MEAN SOLAR TIME')) throw new Error('Mean solar time disclosure missing');
  const report = reportSchema.parse(read(directory, 'editorial-finalization.json'));
  const words = (narration.match(/\b[\w]+(?:[-’'][\w]+)*\b/g) ?? []).length;
  if (report.packageSha256 !== sha256Json(pkg) || report.assetSha256 !== sha256Json(asset) || report.reviewSha256 !== sha256Json(review)
    || report.scriptSha256 !== sha256Json(asset.script) || report.visualPlanSha256 !== sha256Json(asset.visualPlan)
    || report.instructionSha256 !== sha256Json(instruction) || report.verificationQueueSha256 !== sha256Json(queue)) throw new Error('Final editorial binding drift');
  if (report.finalExactNarration !== narration || report.wordCount !== words || stableJson(report.selectedClaimIds) !== stableJson(asset.selectedClaimIds)
    || report.runtimeEstimate.spokenSeconds.minimum !== words / 150 * 60 || report.runtimeEstimate.spokenSeconds.maximum !== words / 140 * 60
    || report.runtimeEstimate.likelyTotalSeconds.minimum !== words / 150 * 60 + 5
    || report.runtimeEstimate.likelyTotalSeconds.maximum !== words / 140 * 60 + 8) throw new Error('Narration/count/runtime drift');
  const ownerText = readFileSync(resolve(directory, 'owner-review.md'), 'utf8');
  if (!ownerText.includes(narration) || !ownerText.includes('AHMET — CYCLE #2 FINAL EDITORIAL APPROVAL')) throw new Error('Owner handoff/gate drift');
  const manifest = z.object({schemaVersion: z.literal(1), kind: z.literal('editorial-finalization-review-artifacts'),
    files: z.array(z.object({path: z.string().regex(/^[a-z0-9.-]+$/), sha256: hash}).strict())}).strict().parse(read(directory, 'artifact-manifest.json'));
  const names = readdirSync(directory).filter((n) => n !== 'artifact-manifest.json').sort();
  if (names.some((n) => /creative-direction|production-plan|caption-plan|owner-decision|\.mp4$|\.wav$|\.png$/.test(n))) throw new Error('Unapproved production/decision artifact');
  if (stableJson(names) !== stableJson(manifest.files.map((f) => f.path).sort())) throw new Error('Final manifest coverage drift');
  for (const f of manifest.files) if (byteHash(resolve(directory, f.path)) !== f.sha256) throw new Error(`Final artifact hash drift: ${f.path}`);
  for (const n of [...names, 'artifact-manifest.json'].filter((n) => n.endsWith('.json'))) {
    if (readFileSync(resolve(directory, n), 'utf8') !== stableJson(read(directory, n), 2) + '\n') throw new Error(`Noncanonical final JSON: ${n}`);
  }
  return {result: 'passed', packageRevision: 2, assetRevision: 2, packageState: pkg.editorialStatus, assetState: asset.editorialStatus,
    reviewState: review.status, researchClaimsPreserved: pkg.claims.length, ownerVerificationRequired: selected.length, verifiedClaims: 0,
    wordCount: words, spokenSeconds: report.runtimeEstimate.spokenSeconds, likelyTotalSeconds: report.runtimeEstimate.likelyTotalSeconds,
    productionAuthorized: false, publicationAuthorized: false};
};

if (process.argv[1]?.endsWith('validate-longitude-finalization.ts')) console.log(JSON.stringify(validateLongitudeFinalization(), null, 2));
