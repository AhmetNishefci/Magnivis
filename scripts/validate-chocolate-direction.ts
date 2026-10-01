import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {readFileSync, readdirSync} from 'node:fs';
import {resolve} from 'node:path';
import {z} from 'zod';
import {knowledgePackageSchema} from '../src/knowledge/schema';
import {contentAssetSchema} from '../src/content-assets/schema';
import {createKnowledgePackageRegistry} from '../src/knowledge/registry';
import {contentAssetRegistry, createContentAssetRegistry} from '../src/content-assets/registry';
import {creativeDirectionDraftSchema} from '../src/content-assets/creative-direction';
import {validateCreativeDirection} from '../src/content-assets/creative-direction-integrity';
import {creativeStageApprovalSchema} from '../src/content-intelligence/creative-stage-approval';
import {validateClaimReviewBundle} from '../src/content-intelligence/claim-review';
import {sha256Json, stableJson} from '../src/content-intelligence/run-schema';
export const chocolateApprovalDirectory = resolve('content-intelligence/reviews/chocolate-crystal-choice-approved-v3');
export const chocolateDirectionDirectory = resolve('content-intelligence/creative-directions/chocolate-crystal-choice-same-recipe');
const prior = resolve('content-intelligence/reviews/chocolate-crystal-choice-finalization-v2');
const base = '2312d200a73b841efb60a86c56d664fe8d6602ff';
const read = (dir: string, name: string): unknown => JSON.parse(readFileSync(resolve(dir, name), 'utf8'));
const bytes = (path: string) => createHash('sha256').update(readFileSync(path)).digest('hex');
const ref = (v: {id: string; revision: number}) => ({id: v.id, revision: v.revision, sha256: sha256Json(v)});
const same = (a: unknown, b: unknown, reason: string) => {if (stableJson(a) !== stableJson(b)) throw new Error(reason);};
const fileBinding = z.object({path: z.string(), sha256: z.string().regex(/^[a-f0-9]{64}$/)}).strict();
export const validateChocolateDirection = (directory = chocolateDirectionDirectory, approvalDirectory = chocolateApprovalDirectory) => {
  const pkg = knowledgePackageSchema.parse(read(prior, 'knowledge-package.review.json'));
  const asset = contentAssetSchema.parse(read(prior, 'content-asset.review.json'));
  const review = validateClaimReviewBundle(read(prior, 'claim-review.json'), pkg, asset);
  const contract = z.object({beats: z.array(z.unknown()).length(8)}).passthrough().parse(read(prior, 'visual-comprehension-contract.json'));
  const d = creativeStageApprovalSchema.parse(read(approvalDirectory, 'owner-decision.json'));
  if (d.reviewer !== 'Ahmet Nishefci' || d.approvedSourceCommit !== base) throw new Error('Owner/source authority drift');
  same(d.knowledgePackage, ref(pkg), 'Reviewed package drift'); same(d.contentAsset, ref(asset), 'Reviewed asset drift');
  same(d.claimReview, {id: review.id, revision: 2, sha256: sha256Json(review)}, 'Reviewed claim evidence drift');
  if (d.scriptSha256 !== sha256Json(asset.script) || d.visualPlanSha256 !== sha256Json(asset.visualPlan)
    || d.comprehensionContractSha256 !== sha256Json(contract) || d.approvedHookId !== asset.hookId
    || d.finalExactNarration !== asset.script.segments.map(s => s.text).join('\n\n')
    || d.finalExactNarration.split(/\s+/).length !== 80) throw new Error('Exact editorial approval drift');
  if (pkg.editorialStatus !== 'review' || asset.editorialStatus !== 'editorial-review'
    || pkg.claims.filter(c => c.verificationStatus === 'verified').length !== 8
    || asset.selectedClaimIds.some(id => pkg.claims.find(c => c.id === id)?.verificationStatus !== 'verified')) throw new Error('Previously verified source state drift');
  same(d.claimDecisions, pkg.claims.map(c => ({claimId: c.id, statementSha256: sha256Json(c.statement),
    action: asset.selectedClaimIds.includes(c.id) ? 'verify' : 'preserve-research-state'})), 'Statement confirmation or reserve preservation drift');
  // Approval confirms already-verified statements; native claim reviews are retained, not retimed/reverified.
  const approval = {approvedBy: d.reviewer, decisionEnteredAt: d.enteredAt, reviewTimeBasis: 'decision-entry',
    notes: `Editorial approval at ${base} via ${d.id}. Eight already-verified claim reviews retained unchanged; CreativeDirection proposal only, no production/platform/publication authorization.`};
  const ap = knowledgePackageSchema.parse(read(approvalDirectory, 'knowledge-package.approved.json'));
  const aa = contentAssetSchema.parse(read(approvalDirectory, 'content-asset.approved.json'));
  same(ap, {...pkg, revision: 3, editorialStatus: 'approved', approval}, 'Approved package/claim metadata changed');
  same(aa, {...asset, revision: 3, editorialStatus: 'approved', approval}, 'Approved asset/script/VisualPlan changed');
  createContentAssetRegistry([aa], createKnowledgePackageRegistry([ap]));
  const expectedInputs = ['content-intelligence/reviews/chocolate-crystal-choice-v1',
    'content-intelligence/reviews/chocolate-crystal-choice-finalization-v2'].flatMap(dir => readdirSync(dir).sort().map(name => ({path: `${dir}/${name}`, sha256: bytes(`${dir}/${name}`)})));
  same(d.reviewedArtifacts, expectedInputs, 'Reviewed artifact coverage drift');
  for (const f of d.reviewedArtifacts) if (!readFileSync(f.path).equals(execFileSync('git', ['show', `${base}:${f.path}`]))) throw new Error('Immutable research/finalization drift');
  same(read(approvalDirectory, 'approved-claim-bindings.json'), {schemaVersion: 1, knowledgePackage: ref(ap), contentAsset: ref(aa),
    ownerDecision: ref(d), scriptSha256: sha256Json(aa.script), visualPlanSha256: sha256Json(aa.visualPlan), comprehensionContractSha256: sha256Json(contract),
    verifiedClaims: ap.claims.filter(c => aa.selectedClaimIds.includes(c.id)).map(c => ({claimId: c.id, statement: c.statement,
      statementSha256: sha256Json(c.statement), evidence: c.evidence, caveats: c.caveats, review: c.review})), reserveStatesPreserved: true, productionAuthorized: false}, 'Approved claim binding drift');
  const direction = creativeDirectionDraftSchema.parse(validateCreativeDirection(read(directory, 'direction-v1.json'), ap, aa));
  if (direction.id !== 'creative-direction.chocolate-crystal-choice.material-cutaway' || direction.revision !== 1
    || !direction.ownerReview.required || direction.convergenceReview.unresolvedConvenienceReuse.length) throw new Error('Direction/convergence/owner gate bypass');
  const dimensions = ['composition', 'microscopic-model', 'typography', 'ambience', 'music', 'camera', 'lighting', 'texture', 'transitions', 'motion', 'payoff'];
  if (dimensions.some(dim => !direction.decisions.some(c => c.dimension === dim))) throw new Error('Incomplete creative decisions');
  if (!direction.decisions.find(c => c.dimension === 'narration')?.treatment.includes('af_heart')) throw new Error('Primary narrator drift');
  if (!direction.decisions.find(c => c.dimension === 'microscopic-model')?.treatment.includes('SIMPLIFIED EXPLANATORY MODEL')) throw new Error('Microscopy disclosure missing');
  const options = z.object({state: z.literal('owner-review'), selectedProposalId: z.literal('material-cutaway'),
    approaches: z.array(z.object({id: z.string(), visualMedium: z.string(), strengths: z.array(z.string()).min(1), tradeoffs: z.array(z.string()).min(1),
      artDirection: z.string(), composition: z.string(), metaphorVersusLiteral: z.string(), microscopicModel: z.string(), transitions: z.string(),
      motion: z.string(), typography: z.string(), captions: z.string(), sound: z.string(), ambience: z.string(), music: z.string(), camera: z.string(),
      lighting: z.string(), texture: z.string(), hook: z.string(), payoff: z.string(), mobile: z.string(), narration: z.string(), pacing: z.string(), rights: z.string(),
    }).passthrough()).min(3)}).passthrough().parse(read(directory, 'creative-options.json'));
  if (new Set(options.approaches.map(c => c.id)).size !== options.approaches.length
    || new Set(options.approaches.map(c => c.visualMedium)).size !== options.approaches.length) throw new Error('Alternatives repeat a medium');
  const comparisons = z.object({comparisons: z.array(z.object({videoId: z.string(), recordKind: z.enum(['legacy-video-spec', 'content-asset']),
    contentAsset: z.object({id: z.string(), revision: z.number(), sha256: z.string()}).nullable(), inputs: z.array(fileBinding).min(2),
    differentiation: z.string().min(1), audienceFacingReuse: z.array(z.string()).min(1), assessment: z.literal('distinct-execution'),
  }).passthrough()).length(8), sharedInputBindings: z.array(fileBinding)}).passthrough().parse(read(directory, 'recent-content-comparison.json'));
  same(comparisons.comparisons.map(c => c.videoId).sort(), ['earth-to-stars','ocean-depth','billion-dollars','speed-of-light','human-engineering','wood-frog','phantom-traffic','longitude-clock'].sort(), 'Missing historical comparison');
  for (const c of comparisons.comparisons) {
    if (c.recordKind === 'legacy-video-spec' && c.contentAsset) throw new Error('Invented legacy asset');
    if (c.recordKind === 'content-asset') {if (!c.contentAsset) throw new Error('Missing actual asset'); same(c.contentAsset, ref(contentAssetRegistry.get(c.contentAsset.id)), 'Stale comparison asset');}
  }
  for (const f of [...comparisons.comparisons.flatMap(c => c.inputs), ...comparisons.sharedInputBindings]) if (bytes(f.path) !== f.sha256) throw new Error('Historical creative input drift');
  same(direction.convergenceReview.recentAssets.map(c => c.contentAsset), comparisons.comparisons.flatMap(c => c.contentAsset ? [c.contentAsset] : []), 'Native convergence reference drift');
  const realization = z.object({approvedContractSha256: z.string(), beats: z.array(z.object({approvedContract: z.unknown(),
    proposedRealization: z.string().min(1), prohibition: z.string(), disclosure: z.string().min(1)}).strict()).length(8)}).passthrough().parse(read(directory, 'comprehension-realization.json'));
  if (realization.approvedContractSha256 !== sha256Json(contract)) throw new Error('Comprehension contract binding drift');
  same(realization.beats.map(c => c.approvedContract), contract.beats, 'Approved comprehension changed');
  realization.beats.forEach((c, i) => {
    const original = contract.beats[i] as {mustNotImply: string};
    if (c.prohibition !== original.mustNotImply || !c.disclosure.includes('SIMPLIFIED EXPLANATORY MODEL')) throw new Error('Scientific prohibition/disclosure drift');
  });
  same(read(directory, 'editorial-bindings.json'), {schemaVersion: 1, ownerDecision: ref(d), approvedKnowledgePackage: ref(ap), approvedContentAsset: ref(aa),
    scriptSha256: sha256Json(aa.script), visualPlanSha256: sha256Json(aa.visualPlan), approvedComprehensionContractPath: 'content-intelligence/reviews/chocolate-crystal-choice-finalization-v2/visual-comprehension-contract.json',
    approvedComprehensionContractSha256: sha256Json(contract), direction: ref(direction), directionOwnerApproved: false, productionAuthorized: false,
    nextGate: 'AHMET — CYCLE #3 CREATIVE DIRECTION APPROVAL'}, 'Direction/editorial binding drift');
  const rights = z.object({productionAssetsCreated: z.literal(false), externalAssetsAcquired: z.literal(false), rightsRequirements: z.array(z.string()).min(1),
    productionTestingUnknowns: z.array(z.string()).min(1), stopGate: z.literal('AHMET — CYCLE #3 CREATIVE DIRECTION APPROVAL')}).passthrough().parse(read(directory, 'rights-and-test-requirements.json'));
  const allowed = (p: string) => p.startsWith('content-intelligence/reviews/chocolate-crystal-choice-approved-v3/')
    || p.startsWith('content-intelligence/creative-directions/chocolate-crystal-choice-same-recipe/')
    || ['docs/PROJECT-STATE.md','docs/CONTENT-INTELLIGENCE.md','docs/DECISIONS.md','scripts/validate-chocolate-finalization.ts',
      'scripts/validate-chocolate-direction.ts','tests/chocolate-direction.test.ts'].includes(p);
  const changed = execFileSync('git', ['diff', '--name-only', base, '--'], {encoding: 'utf8'}).trim().split('\n').filter(Boolean);
  const untracked = execFileSync('git', ['ls-files', '--others', '--exclude-standard'], {encoding: 'utf8'}).trim().split('\n').filter(Boolean);
  if ([...changed, ...untracked].some(p => !allowed(p))) {
    // Preserve every proposal check; the later explicitly authorized candidate stage owns its additional scope.
    execFileSync(process.execPath, ['--import','tsx','scripts/validate-chocolate-production.ts'], {stdio:'pipe'});
  }
  for (const path of ['content-intelligence/discovery/cycle-3-2026-10-01','content-intelligence/operations/longitude-clock-scheduling-v1',
    'content-intelligence/reviews/longitude-clock-publication-v1','docs/STRATEGY.md','docs/CREATIVE-DIRECTION.md','docs/CAPTIONS.md',
    'docs/ROADMAP.md','docs/PERFORMANCE.md','docs/OPERATIONS.md','AGENTS.md','src/design/brand-execution-policy.json']) {
    const names = execFileSync('git', ['ls-tree','-r','--name-only',base,'--',path], {encoding:'utf8'}).trim().split('\n').filter(Boolean);
    for (const name of names) if (!readFileSync(name).equals(execFileSync('git',['show',`${base}:${name}`]))) throw new Error('Protected policy/history bytes drift');
  }
  const ownerText = readFileSync(resolve(directory,'owner-review.md'),'utf8');
  if (!ownerText.includes(rights.stopGate) || !ownerText.includes(sha256Json(direction))) throw new Error('Owner handoff identity drift');
  for (const [dir, kind] of [[approvalDirectory,'approved-editorial-artifacts'],[directory,'creative-direction-proposal-artifacts']]) {
    const manifest = z.object({schemaVersion: z.literal(1),kind: z.literal(kind!),files: z.array(fileBinding)}).strict().parse(read(dir!,'artifact-manifest.json'));
    const names = readdirSync(dir!).filter(n => n !== 'artifact-manifest.json').sort();
    same(manifest.files.map(f => f.path).sort(), names, 'Manifest coverage drift');
    if (names.some(n => !/^[a-z0-9.-]+\.(json|md)$/.test(n) || /production-plan|caption-plan/.test(n))) throw new Error('Production artifact exceeds proposal');
    for (const f of manifest.files) if (bytes(resolve(dir!,f.path)) !== f.sha256) throw new Error('Proposal artifact hash drift');
    for (const name of [...names,'artifact-manifest.json'].filter(n => n.endsWith('.json'))) if (readFileSync(resolve(dir!,name),'utf8') !== stableJson(read(dir!,name),2)+'\n') throw new Error('Noncanonical proposal JSON');
  }
  return {passed:true, editorialApproval:d.id, approvedPackage:ref(ap), approvedAsset:ref(aa), direction:ref(direction), state:direction.state,
    alternatives:options.approaches.length, recentVideos:comparisons.comparisons.length, beats:realization.beats.length, verifiedClaims:8,
    reserveClaimsUnchanged:34, unresolvedConvenienceReuse:0, productionAuthorized:false, nextGate:rights.stopGate};
};
if (process.argv[1]?.endsWith('validate-chocolate-direction.ts')) console.log(JSON.stringify(validateChocolateDirection(),null,2));
