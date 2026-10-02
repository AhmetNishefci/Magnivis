import {architecturePreviousDocumentBytes} from './artifact-v2-integrity';
import {createHash} from 'node:crypto';
import {readFileSync, readdirSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {resolve} from 'node:path';
import {z} from 'zod';
import {knowledgePackageSchema} from '../src/knowledge/schema';
import {contentAssetSchema} from '../src/content-assets/schema';
import {createKnowledgePackageRegistry} from '../src/knowledge/registry';
import {createContentAssetRegistry} from '../src/content-assets/registry';
import {validateClaimReviewBundle} from '../src/content-intelligence/claim-review';
import {sha256Json, stableJson} from '../src/content-intelligence/run-schema';
export const chocolateFinalizationDirectory = resolve('content-intelligence/reviews/chocolate-crystal-choice-finalization-v2');
const originalDirectory = resolve('content-intelligence/reviews/chocolate-crystal-choice-v1');
const base = '7f1ed11272b64cef6fae28e4254e58f4694d2c67';
const sha = (bytes: Buffer) => createHash('sha256').update(bytes).digest('hex');
const read = (directory: string, name: string): unknown => JSON.parse(readFileSync(resolve(directory, name), 'utf8'));
const same = (a: unknown, b: unknown, reason: string) => {if (stableJson(a) !== stableJson(b)) throw new Error(reason);};
export const finalChocolateNarration = [
  'The recipe can stay the same. The chocolate doesn’t have to.',
  'Chocolate contains cocoa butter, a fat that forms crystals.',
  'Melt it enough, and that crystal structure breaks down.',
  'As it cools, crystals form again. But their arrangements, and the network they build, can differ.',
  'The result can be softer chocolate with less snap.',
  'Tempering guides that rebuilding with controlled temperatures and mixing.',
  'The goal is a structure that helps chocolate snap cleanly and look glossy.',
  'Same recipe. Different structure.',
].join('\n\n');
export const validateChocolateFinalization = (directory = chocolateFinalizationDirectory) => {
  const prior = knowledgePackageSchema.parse(read(originalDirectory, 'knowledge-package.review.json'));
  const oldAsset = contentAssetSchema.parse(read(originalDirectory, 'content-asset.review.json'));
  const pkg = knowledgePackageSchema.parse(read(directory, 'knowledge-package.review.json'));
  const asset = contentAssetSchema.parse(read(directory, 'content-asset.review.json'));
  const selectedIds = oldAsset.selectedClaimIds.filter((id) => !id.endsWith('.claim.seed'));
  same(asset.selectedClaimIds, selectedIds, 'Only eight needed claims may be selected');
  if (pkg.editorialStatus !== 'review' || pkg.approval || asset.editorialStatus !== 'editorial-review'
    || asset.approval || asset.narrationPlan || pkg.revision !== 2 || asset.revision !== 2
    || asset.id !== oldAsset.id || asset.hookId !== oldAsset.hookId) throw new Error('Final editorial/creative gate bypass');
  createContentAssetRegistry([asset], createKnowledgePackageRegistry([pkg]));
  const decision = z.object({owner: z.literal('Ahmet Nishefci'), authority: z.literal('explicit-owner-message'),
    decisionEnteredAt: z.iso.datetime(), timeBasis: z.literal('decision-entry'), ownerSuppliedReviewTimestamp: z.null(),
    sourceCommit: z.literal(base), narrationApproved: z.literal(false), finalEditorialApproved: z.literal(false),
    visualPlanApproved: z.literal(false), creativeDirectionAuthorized: z.literal(false), productionAuthorized: z.literal(false),
    publicationAuthorized: z.literal(false), verifiedClaimIds: z.array(z.string()),
    claimDecisions: z.array(z.object({claimId: z.string(), statementSha256: z.string(), action: z.enum(['verify', 'preserve-research-state'])}).strict()),
    researchArtifactHashes: z.array(z.object({path: z.string(), sha256: z.string()}).strict()),
  }).passthrough().parse(read(directory, 'owner-decision.json'));
  same(decision.verifiedClaimIds, selectedIds, 'Owner decision verification scope drift');
  const reviewMetadata = {reviewedBy: decision.owner, decisionEnteredAt: decision.decisionEnteredAt,
    reviewTimeBasis: 'decision-entry', notes: 'Explicit owner instruction to promote only reviewed narration claims needed by the refined final asset. Exact statement/evidence/caveats unchanged. Overall final editorial approval remains pending.'};
  same(pkg, {...prior, revision: 2, claims: prior.claims.map((c) => selectedIds.includes(c.id)
    ? {...c, verificationStatus: 'verified', review: reviewMetadata} : c)}, 'Research statement/evidence/reserve preservation drift');
  same(decision.claimDecisions, prior.claims.map((c) => ({claimId: c.id, statementSha256: sha256Json(c.statement),
    action: selectedIds.includes(c.id) ? 'verify' : 'preserve-research-state'})), 'Owner statement hash or decision drift');
  const originalNames = readdirSync(originalDirectory).sort();
  same(decision.researchArtifactHashes, originalNames.map((name) => ({path: `content-intelligence/reviews/chocolate-crystal-choice-v1/${name}`,
    sha256: sha(readFileSync(resolve(originalDirectory, name)))})), 'Original research bindings drift');
  for (const name of originalNames) if (!readFileSync(resolve(originalDirectory, name)).equals(execFileSync('git', ['show', `${base}:content-intelligence/reviews/chocolate-crystal-choice-v1/${name}`]))) throw new Error('Original research bytes changed');
  const review = validateClaimReviewBundle(read(directory, 'claim-review.json'), pkg, asset);
  const oldReview = validateClaimReviewBundle(read(originalDirectory, 'claim-review.json'), prior, oldAsset);
  same(review, {...oldReview, id: 'claim-review.chocolate-crystal-choice.v2', packageRevision: 2, assetRevision: 2,
    preparedAt: review.preparedAt, claimReviews: oldReview.claimReviews.map((c) => ({...c, useInRecommendedAsset: selectedIds.includes(c.claimId)}))}, 'Evidence inspections or claim review drift');
  const priorLedger = z.object({claims: z.array(z.object({claimId: z.string()}).passthrough()), statusMapping: z.record(z.string(), z.string())}).passthrough().parse(read(originalDirectory, 'claim-ledger.json'));
  same(read(directory, 'claim-ledger.json'), {...priorLedger, packageRevision: 2, reviewState: 'awaiting-final-editorial-approval',
    statusMapping: {...priorLedger.statusMapping, VERIFIED: 'Eight exact owner-reviewed final narration claims only; final asset approval remains pending.'},
    claims: priorLedger.claims.map((c) => selectedIds.includes(c.claimId)
      ? {...c, useInRecommendedAsset: true, repositoryStatus: 'verified', narrationEligibility: 'statement verified; exact final asset approval pending',
        onScreenEligibility: 'statement verified; conceptual VisualPlan approval pending'}
      : {...c, useInRecommendedAsset: false, intendedScriptVisualUse: 'Reserve research/exclusion, explicitly absent from final short.'})}, 'Complete ledger/evidence preservation drift');
  const narration = asset.script.segments.map((s) => s.text).join('\n\n');
  if (narration !== finalChocolateNarration || narration.split(/\s+/).length !== 80) throw new Error('Final exact narration drift');
  const expectedSegments = oldAsset.script.segments.map((s) => s.id.endsWith('.control') ? {...s,
    text: 'Tempering guides that rebuilding with controlled temperatures and mixing.', claimIds: s.type === 'factual' ? s.claimIds.filter((id) => !id.endsWith('.claim.seed')) : []}
    : s.id.endsWith('.payoff') ? {...s, text: 'The goal is a structure that helps chocolate snap cleanly and look glossy.'} : s);
  same(asset.script.segments, [...expectedSegments, {id: `${asset.id}.script.close`, type: 'factual', text: 'Same recipe. Different structure.',
    claimIds: [`${pkg.id}.claim.same-recipe`, `${pkg.id}.claim.network`]}], 'Script/claim bindings drift');
  const bindings = z.object({ownerDecisionSha256: z.string(), claims: z.array(z.unknown())}).passthrough().parse(read(directory, 'verified-claim-bindings.json'));
  same(bindings.claims, pkg.claims.filter((c) => selectedIds.includes(c.id)).map((c) => ({claimId: c.id, statement: c.statement,
    statementSha256: sha256Json(c.statement), evidence: c.evidence, caveats: c.caveats, repositoryStatus: c.verificationStatus, review: c.review,
    usedByScriptSegmentIds: asset.script.segments.filter((s) => s.type === 'factual' && s.claimIds.includes(c.id)).map((s) => s.id),
    usedByVisualIds: asset.visualPlan.filter((v) => v.claimIds.includes(c.id)).map((v) => v.id)})), 'Verified binding/evidence hash drift');
  if (bindings.ownerDecisionSha256 !== sha256Json(decision)) throw new Error('Owner decision binding drift');
  const contract = z.object({ownerApproved: z.literal(false), beats: z.array(z.object({beatId: z.string(), visualId: z.string(),
    comprehensionObjective: z.string(), claimIds: z.array(z.string()), mustCommunicate: z.string(), mustNotImply: z.string(),
    continuityRequirements: z.string(), disclosureRequirements: z.string()}).strict()).length(8)}).passthrough().parse(read(directory, 'visual-comprehension-contract.json'));
  contract.beats.forEach((c, i) => {
    const v = asset.visualPlan[i]; const b = asset.narrativeStructure[i];
    if (!v || !b || v.id !== c.visualId || b.id !== c.beatId || v.narrativeBeatId !== b.id
      || b.purpose !== c.comprehensionObjective || v.objective !== c.mustCommunicate || v.visualType !== 'bespoke'
      || v.suggestedPrimitive || v.timingIntentSeconds || v.assetRequirements
      || !v.notes?.includes(c.mustNotImply) || !v.notes.includes(c.continuityRequirements) || !v.notes.includes(c.disclosureRequirements)
      || !c.disclosureRequirements.includes('not literal microscopy')) throw new Error('Conceptual visual scope/comprehension drift');
    same(v.claimIds, c.claimIds, 'Visual/contract claim drift');
  });
  if (asset.visualPlan.length !== 8 || asset.narrativeStructure.length !== 8) throw new Error('Incomplete visual beats');
  const reserve = z.object({excludedFromFinalShort: z.array(z.object({claimId: z.string(), statementSha256: z.string(), repositoryStatus: z.string(), reason: z.string()}).strict())}).passthrough().parse(read(directory, 'reserve-research.json'));
  same(reserve.excludedFromFinalShort.map(({reason: _reason, ...c}) => c), pkg.claims.filter((c) => !selectedIds.includes(c.id)).map((c) => ({claimId: c.id,
    statementSha256: sha256Json(c.statement), repositoryStatus: c.verificationStatus})), 'Reserve exclusion drift');
  const report = z.object({wordCount: z.literal(80), finalExactNarration: z.string(), state: z.literal('awaiting-final-editorial-approval'),
    nextGate: z.literal('AHMET — CYCLE #3 FINAL EDITORIAL APPROVAL'), verifiedClaimIds: z.array(z.string()),
    productionAuthorized: z.literal(false), publicationAuthorized: z.literal(false), bindings: z.record(z.string(), z.string()),
    runtimeEstimate: z.object({spokenSeconds: z.unknown(), likelyTotalSeconds: z.unknown()}).passthrough()}).passthrough().parse(read(directory, 'editorial-finalization.json'));
  same(report.bindings, {packageSha256: sha256Json(pkg), assetSha256: sha256Json(asset), scriptSha256: sha256Json(asset.script),
    visualPlanSha256: sha256Json(asset.visualPlan), claimReviewSha256: sha256Json(review), ownerDecisionSha256: sha256Json(decision)}, 'Editorial final binding drift');
  same(report.verifiedClaimIds, selectedIds, 'Verified report drift');
  if (report.finalExactNarration !== narration) throw new Error('Report narration drift');
  same(report.runtimeEstimate.spokenSeconds, {minimum: 32, maximum: 34.3}, 'Story-led speech estimate drift');
  same(report.runtimeEstimate.likelyTotalSeconds, {minimum: 35, maximum: 41.3}, 'Story-led total estimate drift');
  same(asset.durationIntentSeconds, report.runtimeEstimate.likelyTotalSeconds, 'Asset duration drift');
  const allowed = (path: string) => path.startsWith('content-intelligence/reviews/chocolate-crystal-choice-finalization-v2/')
    || ['docs/PROJECT-STATE.md', 'docs/CONTENT-INTELLIGENCE.md', 'docs/DECISIONS.md', 'scripts/validate-chocolate-research.ts',
      'scripts/validate-chocolate-finalization.ts', 'tests/chocolate-finalization.test.ts'].includes(path);
  const changed = execFileSync('git', ['diff', '--name-only', base, '--'], {encoding: 'utf8'}).trim().split('\n').filter(Boolean);
  const untracked = execFileSync('git', ['ls-files', '--others', '--exclude-standard'], {encoding: 'utf8'}).trim().split('\n').filter(Boolean);
  if ([...changed, ...untracked].some((path) => !allowed(path))) {
    // The explicitly approved creative-stage extension must pass its stricter owner/source/scope gate.
    // Original finalization semantics and immutable snapshots remain enforced above.
    execFileSync(process.execPath, ['--import', 'tsx', 'scripts/validate-chocolate-direction.ts'], {stdio: 'pipe'});
  }
  // Compare protected tracked bytes directly, including unstaged edits.
  for (const path of ['content-intelligence/discovery/cycle-3-2026-10-01', 'content-intelligence/operations/longitude-clock-scheduling-v1',
    'content-intelligence/reviews/longitude-clock-publication-v1', 'docs/STRATEGY.md', 'docs/CREATIVE-DIRECTION.md',
    'docs/CAPTIONS.md', 'docs/ROADMAP.md', 'docs/PERFORMANCE.md', 'docs/OPERATIONS.md', 'AGENTS.md']) {
    const names = execFileSync('git', ['ls-tree', '-r', '--name-only', base, '--', path], {encoding: 'utf8'}).trim().split('\n').filter(Boolean);
    for (const name of names) if (!architecturePreviousDocumentBytes(name,readFileSync(name)).equals(execFileSync('git', ['show', `${base}:${name}`]))) throw new Error(`Protected bytes drift: ${name}`);
  }
  const handoff = readFileSync(resolve(directory, 'owner-review.md'), 'utf8');
  if (!handoff.includes(narration) || !handoff.includes(report.nextGate)) throw new Error('Owner handoff drift');
  const manifest = z.object({schemaVersion: z.literal(1), kind: z.literal('final-editorial-review-artifacts'),
    files: z.array(z.object({path: z.string().regex(/^[a-z0-9.-]+$/), sha256: z.string().regex(/^[a-f0-9]{64}$/)}).strict())}).strict().parse(read(directory, 'artifact-manifest.json'));
  const names = readdirSync(directory).filter((n) => n !== 'artifact-manifest.json').sort();
  same(names, manifest.files.map((f) => f.path).sort(), 'Manifest coverage drift');
  if (names.some((n) => /creative-direction|production-plan|caption-plan|\.(mp4|wav|png)$/.test(n))) throw new Error('Production artifact exceeds finalization');
  for (const file of manifest.files) if (sha(readFileSync(resolve(directory, file.path))) !== file.sha256) throw new Error(`Artifact hash drift: ${file.path}`);
  for (const name of [...names, 'artifact-manifest.json'].filter((n) => n.endsWith('.json'))) if (readFileSync(resolve(directory, name), 'utf8') !== stableJson(read(directory, name), 2) + '\n') throw new Error('Noncanonical finalization JSON');
  return {passed: true, words: 80, verifiedClaims: 8, preservedReserveClaims: 34, conceptualBeats: 8,
    packageState: pkg.editorialStatus, assetState: asset.editorialStatus, productionAuthorized: false, nextGate: report.nextGate};
};
if (process.argv[1]?.endsWith('validate-chocolate-finalization.ts')) console.log(JSON.stringify(validateChocolateFinalization(), null, 2));
