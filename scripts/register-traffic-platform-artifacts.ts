import {readFileSync,writeFileSync,statSync,readdirSync} from 'node:fs';
import {basename,extname} from 'node:path';
import {artifactManifestSchema,parseManifests} from '../src/artifacts/schema';
import {fileSha256} from '../src/production/phantom-traffic-integrity';
import {validatePhantomTrafficLockedMaster} from '../src/production/phantom-traffic-master-integrity';
import {stableJson,sha256Json} from '../src/content-intelligence/run-schema';
import decision from '../content-intelligence/reviews/phantom-traffic-master-lock-v1/owner-decision.json';
const master=validatePhantomTrafficLockedMaster();
const file='artifacts/manifests.json',original=readFileSync(file,'utf8'),registry=parseManifests(JSON.parse(original));
const candidate=registry.find(m=>m.artifactId===decision.candidateArtifactId)!;
const now=new Date().toISOString();
const locked=artifactManifestSchema.parse({...candidate,artifactId:master.masterArtifactId,recordedAt:now,sourceCommit:decision.reviewedCommit,
 approvalScope:'owner-visual',approvalDecisionId:decision.id,parentArtifactIds:[decision.candidateArtifactId],
 reproducibility:{...candidate.reproducibility,evidence:[...candidate.reproducibility.evidence,'Logical locked-master identity aliases the same exact candidate path/blob; no copy, rename or re-encoding.',`Exact owner visual decision ${decision.id}; platform/publication gates remain pending.`]}});
const added=[locked];
const dir='artifacts/qa-evidence/phantom-traffic-platform-v1';
const paths=['artifacts/covers/phantom-traffic-instagram-cover-v1.png',...readdirSync(dir).filter(f=>/\.(png|json)$/.test(f)).map(f=>`${dir}/${f}`)];
for(const path of paths){
 const cover=path.includes('/covers/'),ext=extname(path);
 added.push(artifactManifestSchema.parse({schemaVersion:1,artifactId:cover?'phantom-traffic.instagram-cover.v1':`phantom-traffic.platform-qa-v1.${basename(path).replace(/\./g,'-')}`,contentId:'phantom-traffic',artifactType:cover?'cover-image':'qa-evidence',revision:1,
  identity:{sha256:fileSha256(path),bytes:statSync(path).size,mimeType:ext==='.png'?'image/png':'application/json'},
  createdAt:null,creationUnknownReason:'Native QA reports record local generation-entry time; no device test/owner review time is claimed.',recordedAt:now,sourceCommit:decision.reviewedCommit,
  productionPlanId:master.productionPlan.id,captionPlanId:master.captionPlan.id,platformVariantId:cover?'phantom-traffic.asset.backward-wave.variant.instagram-reels':null,approvalDecisionId:null,approvalScope:'none',publication:'not-authorized',
  localPath:path,locations:[{provider:'git',key:path,durability:'git-tracked'}],provenance:'ORIGINAL_PRODUCTION',retention:'DURABLE_REQUIRED',historicalSha256:null,historicalStatus:'new-production',replacesArtifactId:null,parentArtifactIds:[master.masterArtifactId],exactBytesMatter:true,
  reproducibility:{status:'derived',recipe:cover?['pnpm exec remotion still src/platform-variants/PhantomTrafficCoverRoot.tsx PhantomTraffic-Instagram-Cover <new-path> --frame=0']:['node --import tsx scripts/generate-traffic-platform-qa.ts; use a new evidence revision rather than overwriting records'],evidence:['Original code/model preview; never a real device screenshot or measured crop.',`Source master exact hash ${master.artifact.sha256}`,'Decision/variant/profile/model-source bindings are recorded in platform-bindings.json.']}}));
}
const newRecords=added.filter(m=>{
 const old=registry.find(r=>r.artifactId===m.artifactId);
 if(old&&sha256Json(old.identity)!==sha256Json(m.identity))throw new Error('Do not overwrite evidence identity');
 return !old;
});
parseManifests([...registry,...newRecords]);
if(newRecords.length)writeFileSync(file,original.replace(/\s*\]\s*$/,'')+`,\n${newRecords.map(r=>JSON.stringify(r,null,2).split('\n').map(l=>'  '+l).join('\n')).join(',\n')}\n]\n`);
const sources=['src/platform-variants/PhantomTrafficCoverRoot.tsx','src/platform-variants/PhantomTrafficPresentationRoot.tsx','src/platform-variants/phantom-traffic-regions.ts','src/platform-variants/variants/phantom-traffic.ts',
 'artifacts/presentation-profiles.json','artifacts/presentation-qa.json','artifacts/cover-assets.json',
 'content-intelligence/reviews/phantom-traffic-master-lock-v1/owner-decision.json','content-intelligence/reviews/phantom-traffic-master-lock-v1/production-plan.locked.json',
 'content-intelligence/reviews/phantom-traffic-platform-v1/platform-variants.json','content-intelligence/reviews/phantom-traffic-platform-v1/surface-reports.json','content-intelligence/reviews/phantom-traffic-platform-v1/presentation-outputs.json','content-intelligence/reviews/phantom-traffic-platform-v1/critical-regions.json'];
const receipt={schemaVersion:1,id:'platform-bindings.phantom-traffic.v1',recordedAt:now,timeBasis:'binding-entry',masterDecision:{id:decision.id,sha256:sha256Json(decision)},master,
 artifacts:newRecords.map(m=>({artifactId:m.artifactId,path:m.localPath,sha256:m.identity.sha256,bytes:m.identity.bytes,retention:m.retention})),
 sources:sources.map(path=>({path,sha256:fileSha256(path)})),coverDeterminism:{sha256:fileSha256(paths[0]!),repeatSha256:fileSha256('/tmp/phantom-traffic-cover-repeat.png')},
 modelDeterminism:{sha256:fileSha256(`${dir}/tiktok-mobile.png`),repeatSha256:fileSha256('/tmp/phantom-traffic-model-repeat.png')},
 ownerMasterVisualApproval:true,realDevicePasses:0,platformApprovalGranted:false,publicationApprovalGranted:false};
writeFileSync('content-intelligence/reviews/phantom-traffic-platform-v1/platform-bindings.json',stableJson(receipt,2)+'\n');
console.log(JSON.stringify({passed:true,newArtifactRecords:newRecords.length,lockedMasterBytesUnchanged:master.artifact.sha256,coverCandidates:1,videoDerivatives:0},null,2));
