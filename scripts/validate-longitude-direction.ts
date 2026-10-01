import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {readFileSync, readdirSync} from 'node:fs';
import {resolve} from 'node:path';
import {z} from 'zod';
import {applyCreativeStageApproval} from '../src/content-intelligence/creative-stage-approval';
import {knowledgePackageSchema} from '../src/knowledge/schema';
import {contentAssetSchema} from '../src/content-assets/schema';
import {createKnowledgePackageRegistry} from '../src/knowledge/registry';
import {contentAssetRegistry, createContentAssetRegistry} from '../src/content-assets/registry';
import {creativeDirectionDraftSchema} from '../src/content-assets/creative-direction';
import {validateCreativeDirection} from '../src/content-assets/creative-direction-integrity';
import {sha256Json, stableJson} from '../src/content-intelligence/run-schema';
import {validateLongitudeFinalization, longitudeFinalizationDirectory as prior} from './validate-longitude-finalization';

export const longitudeApprovalDirectory = resolve('content-intelligence/reviews/longitude-clock-approved-v3');
export const longitudeDirectionDirectory = resolve('content-intelligence/creative-directions/longitude-clock-time-to-position');
const read = (folder: string, name: string): unknown => JSON.parse(readFileSync(resolve(folder, name), 'utf8'));
const bytes = (path: string) => createHash('sha256').update(readFileSync(path)).digest('hex');
const digest = z.string().regex(/^[a-f0-9]{64}$/);
const fileBinding = z.object({path:z.string(), sha256:digest}).strict();
const assertSame = (a: unknown, b: unknown, message: string) => {if (stableJson(a) !== stableJson(b)) throw new Error(message);};

export const validateLongitudeDirection = () => {
  validateLongitudeFinalization();
  const pkg = knowledgePackageSchema.parse(read(prior, 'knowledge-package.review.json'));
  const asset = contentAssetSchema.parse(read(prior, 'content-asset.review.json'));
  const contract = read(prior, 'visual-comprehension-contract.json');
  const approved = applyCreativeStageApproval({decision:read(longitudeApprovalDirectory, 'owner-decision.json'),
    knowledgePackage:pkg, contentAsset:asset, claimReview:read(prior, 'claim-review.json'), comprehensionContract:contract});
  const approvedPkg = knowledgePackageSchema.parse(read(longitudeApprovalDirectory, 'knowledge-package.approved.json'));
  const approvedAsset = contentAssetSchema.parse(read(longitudeApprovalDirectory, 'content-asset.approved.json'));
  assertSame(approvedPkg, approved.knowledgePackage, 'Approved package differs from exact owner decision');
  assertSame(approvedAsset, approved.contentAsset, 'Approved asset differs from exact owner decision');
  createContentAssetRegistry([approvedAsset], createKnowledgePackageRegistry([approvedPkg]));
  for (const f of approved.decision.reviewedArtifacts) {
    if (bytes(f.path) !== f.sha256) throw new Error(`Reviewed file drift: ${f.path}`);
    const historical = execFileSync('git', ['show', `${approved.decision.approvedSourceCommit}:${f.path}`]);
    if (createHash('sha256').update(historical).digest('hex') !== f.sha256) throw new Error(`Owner source commit mismatch: ${f.path}`);
  }
  const expectedInputs = ['longitude-clock-v1', 'longitude-clock-finalization-v2'].flatMap(folder => {
    const directory = `content-intelligence/reviews/${folder}`;
    return readdirSync(directory).sort().map(name => ({path:`${directory}/${name}`, sha256:bytes(`${directory}/${name}`)}));
  });
  assertSame(approved.decision.reviewedArtifacts, expectedInputs, 'Incomplete reviewed input coverage');
  const claims = z.object({verifiedClaims:z.array(z.object({claimId:z.string(), statement:z.string(), statementSha256:digest,
    evidence:z.array(z.unknown()), caveats:z.array(z.string())}).strict()).length(8)}).passthrough().parse(read(longitudeApprovalDirectory, 'approved-claim-bindings.json'));
  assertSame(claims.verifiedClaims, pkg.claims.filter(c => asset.selectedClaimIds.includes(c.id)).map(c => ({claimId:c.id,
    statement:c.statement, statementSha256:sha256Json(c.statement), evidence:c.evidence, caveats:c.caveats})), 'Claim handoff changed');
  const direction = creativeDirectionDraftSchema.parse(validateCreativeDirection(read(longitudeDirectionDirectory, 'direction-v1.json'), approvedPkg, approvedAsset));
  if (!direction.ownerReview.required || direction.convergenceReview.unresolvedConvenienceReuse.length) throw new Error('Direction owner/convergence gate bypass');
  const options = z.object({state:z.literal('owner-review'), selectedProposalId:z.literal('crafted-object-theatre'), approaches:z.array(z.object({
    id:z.string(), thesis:z.string().min(1), visualLanguage:z.string().min(1), strengths:z.array(z.string()).min(1),
    weaknesses:z.array(z.string()).min(1), factualProvenanceRisks:z.array(z.string()).min(1), feasibility:z.string().min(1),
  }).passthrough()).min(3)}).passthrough().parse(read(longitudeDirectionDirectory, 'creative-options.json'));
  if (new Set(options.approaches.map(a => a.id)).size !== options.approaches.length || new Set(options.approaches.map(a => a.visualLanguage)).size !== options.approaches.length) throw new Error('Creative alternatives repeat one treatment');
  const comparisons = z.object({comparisons:z.array(z.object({videoId:z.string(), recordKind:z.enum(['content-asset','legacy-video-spec']),
    contentAsset:z.object({id:z.string(),revision:z.number(),sha256:digest}).nullable(), inputs:z.array(fileBinding).min(2),
  }).passthrough()).length(7), sharedInputBindings:z.array(fileBinding)}).passthrough().parse(read(longitudeDirectionDirectory, 'recent-content-comparison.json'));
  assertSame(comparisons.comparisons.map(c=>c.videoId).sort(), ['earth-to-stars','ocean-depth','billion-dollars','speed-of-light','human-engineering','wood-frog','phantom-traffic'].sort(), 'Missing historical comparison');
  for (const c of comparisons.comparisons) {
    if (c.recordKind === 'legacy-video-spec' && c.contentAsset) throw new Error('Invented legacy ContentAsset');
    if (c.recordKind === 'content-asset') {
      if (!c.contentAsset) throw new Error('Missing native comparison');
      const actual = contentAssetRegistry.get(c.contentAsset.id);
      assertSame(c.contentAsset, {id:actual.id,revision:actual.revision,sha256:sha256Json(actual)}, 'Stale native precedent');
    }
  }
  assertSame(direction.convergenceReview.recentAssets.map(r=>r.contentAsset), comparisons.comparisons.flatMap(c=>c.contentAsset?[c.contentAsset]:[]), 'Convergence reference drift');
  for (const f of [...comparisons.comparisons.flatMap(c=>c.inputs), ...comparisons.sharedInputBindings]) if (bytes(f.path) !== f.sha256) throw new Error(`Historical creative input drift: ${f.path}`);
  const realization = z.object({approvedContractSha256:digest, beats:z.array(z.object({approvedContract:z.unknown(),
    proposedRealization:z.string().min(1), prohibition:z.string().min(1)}).passthrough()).length(10)}).passthrough().parse(read(longitudeDirectionDirectory, 'comprehension-realization.json'));
  if (realization.approvedContractSha256 !== sha256Json(contract)) throw new Error('Approved comprehension contract drift');
  assertSame(realization.beats.map(b=>b.approvedContract), z.object({beats:z.array(z.unknown())}).passthrough().parse(contract).beats, 'Comprehension coverage changed');
  const safeguards = realization.beats.map(b=>b.proposedRealization).join('\n');
  for (const text of ['BOTH MEAN SOLAR TIME','SAME INSTANT','12:00','14:00','+2 HOURS','30° EAST','H4 · EXPLANATORY RECONSTRUCTION']) if (!safeguards.includes(text)) throw new Error(`Missing safeguard: ${text}`);
  const bindings = z.object({ownerDecision:z.object({id:z.string(),revision:z.number(),sha256:digest}), direction:z.object({id:z.string(),revision:z.number(),sha256:digest}),
    directionOwnerApproved:z.literal(false), productionAuthorized:z.literal(false), nextGate:z.literal('AHMET — CYCLE #2 CREATIVE DIRECTION APPROVAL')}).passthrough().parse(read(longitudeDirectionDirectory, 'editorial-bindings.json'));
  assertSame(bindings.ownerDecision,{id:approved.decision.id,revision:approved.decision.revision,sha256:sha256Json(approved.decision)},'Decision reference drift');
  assertSame(bindings.direction,{id:direction.id,revision:direction.revision,sha256:sha256Json(direction)},'Direction reference drift');
  assertSame(read(longitudeDirectionDirectory, 'editorial-bindings.json'), {
    schemaVersion:1, ownerDecision:bindings.ownerDecision,
    approvedKnowledgePackage:{id:approvedPkg.id,revision:approvedPkg.revision,sha256:sha256Json(approvedPkg)},
    approvedContentAsset:{id:approvedAsset.id,revision:approvedAsset.revision,sha256:sha256Json(approvedAsset)},
    scriptSha256:sha256Json(approvedAsset.script), visualPlanSha256:sha256Json(approvedAsset.visualPlan),
    approvedComprehensionContractPath:'content-intelligence/reviews/longitude-clock-finalization-v2/visual-comprehension-contract.json',
    approvedComprehensionContractSha256:sha256Json(contract), direction:bindings.direction,
    directionOwnerApproved:false,productionAuthorized:false,nextGate:bindings.nextGate,
  }, 'Incomplete or stale editorial binding record');
  const ownerText = readFileSync(resolve(longitudeDirectionDirectory,'owner-review.md'),'utf8');
  if (!ownerText.includes(approved.decision.finalExactNarration) || !ownerText.includes(bindings.nextGate)) throw new Error('Owner report narration/gate drift');
  for (const directory of [longitudeApprovalDirectory, longitudeDirectionDirectory]) {
    const manifest = z.object({schemaVersion:z.literal(1),kind:z.literal('editorial-approval-creative-proposal-artifacts'),files:z.array(fileBinding)}).strict().parse(read(directory,'artifact-manifest.json'));
    const names = readdirSync(directory).filter(n=>n!=='artifact-manifest.json').sort();
    assertSame(manifest.files.map(f=>f.path).sort(), names, 'Incomplete artifact manifest');
    if (names.some(n=>!/^[a-z0-9.-]+\.(json|md)$/.test(n) || /production-plan|caption-plan/.test(n))) throw new Error('Unauthorized production artifacts');
    for (const f of manifest.files) if (bytes(resolve(directory,f.path))!==f.sha256) throw new Error(`Creative artifact drift: ${f.path}`);
    for (const name of [...names,'artifact-manifest.json'].filter(n=>n.endsWith('.json'))) if (readFileSync(resolve(directory,name),'utf8')!==stableJson(read(directory,name),2)+'\n') throw new Error(`Noncanonical JSON: ${name}`);
  }
  return {result:'passed',approvedSourceCommit:approved.decision.approvedSourceCommit,decisionEnteredAt:approved.decision.enteredAt,
    packageRevision:approvedPkg.revision,assetRevision:approvedAsset.revision,verifiedClaims:8,preservedReserveClaims:32,
    creativeDirectionState:direction.state,creativeApproaches:options.approaches.length,recentComparisons:7,
    approvedScriptSha256:direction.approvedScriptSha256,directionSha256:sha256Json(direction),productionAuthorized:false,publicationAuthorized:false};
};
if (process.argv[1]?.endsWith('validate-longitude-direction.ts')) console.log(JSON.stringify(validateLongitudeDirection(),null,2));
