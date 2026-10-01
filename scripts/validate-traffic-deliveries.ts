import {readFileSync,existsSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {sha256Json} from '../src/content-intelligence/run-schema';
import {validatePhantomTrafficLockedMaster} from '../src/production/phantom-traffic-master-integrity';
import {validateWoodFrogProductionPlan} from '../src/production/integrity';
import {fileSha256} from '../src/production/phantom-traffic-integrity';
import {trafficPresentationDecision as decision,validateOwnerPresentationDecision,ownerPresentationSupportsPlatform} from '../src/platform-variants/phantom-traffic-presentation-approval';
import {phantomTrafficDeliveryVariants as variants} from '../src/platform-variants/variants/phantom-traffic-delivery';
import {phantomTrafficPlatformVariants as reviewed} from '../src/platform-variants/variants/phantom-traffic';
import {validateDeliveryPackage} from './delivery-packages';
import {parseManifests} from '../src/artifacts/schema';
import baseline from '../system-audits/adaptive-creative-direction-v1/historical-baseline.json';
const dir='content-intelligence/reviews/phantom-traffic-delivery-v1';
validateOwnerPresentationDecision(decision);const master=validatePhantomTrafficLockedMaster();validateWoodFrogProductionPlan();
for(const binding of decision.reviewedVariants){const variant=reviewed.find(v=>v.id===binding.id);if(!variant||variant.revision!==binding.revision||sha256Json(variant)!==binding.sha256)throw new Error('Owner decision detached from reviewed variant');}
const snapshot=JSON.parse(readFileSync(`${dir}/platform-variants.json`,'utf8'));
if(sha256Json(snapshot)!==sha256Json(variants))throw new Error('Stale variant snapshot');
const index=JSON.parse(readFileSync(`${dir}/delivery-index.json`,'utf8'));
if(index.ownerDecision.sha256!==sha256Json(decision)||index.publicationAuthorized!==false||index.packages.length!==4)throw new Error('Invalid delivery handoff decision');
for(const entry of index.packages){const p=validateDeliveryPackage(entry.directory);const v=variants.find(v=>v.platform===entry.platform)!;
 if(sha256Json(p)!==entry.manifestSha256||p.review.publicationAuthorized)throw new Error('Invalid final manifest binding');
 if((v.status==='production-ready')!==ownerPresentationSupportsPlatform(decision,v.platform))throw new Error('Unsupported platform readiness');
 if(p.artifacts.find(a=>a.role==='video')?.sha256!==master.artifact.sha256)throw new Error('Changed master in delivery');
}
// ACD V1 is an immutable milestone audit. Only the append-only artifact registry
// and current project-state journal may change here; its creative system is intact.
const mutable=new Set(['artifacts/manifests.json']);
for(const f of baseline.files)if(!mutable.has(f.path)&&fileSha256(f.path)!==f.sha256)throw new Error(`Historical regression: ${f.path}`);
const previous=parseManifests(JSON.parse(execFileSync('git',['show','fb7c6ebafa5c2a9fbcfde961a1a4a08124e28582:artifacts/manifests.json'],{encoding:'utf8'})));
const current=parseManifests(JSON.parse(readFileSync('artifacts/manifests.json','utf8')));
for(const record of previous)if(sha256Json(current.find(r=>r.artifactId===record.artifactId))!==sha256Json(record))throw new Error('Historical artifact record changed');
for(const path of ['AGENTS.md','docs/CREATIVE-DIRECTION.md','src/production/creative-direction.ts']){
 if(!existsSync(path))continue;
 const old=execFileSync('git',['show',`fb7c6ebafa5c2a9fbcfde961a1a4a08124e28582:${path}`]);
 if(createHash('sha256').update(old).digest('hex')!==fileSha256(path))throw new Error('Adaptive creative authority changed');
}
for(const route of readFileSync('AGENTS.md','utf8').matchAll(/`((?:docs|recovery-audit)\/[^`]+\.md)`/g))if(!existsSync(route[1]!))throw new Error('Missing brain route');
console.log(JSON.stringify({passed:true,packages:4,states:index.packages.map((p:{state:string})=>p.state),confirmedSurfaceCount:decision.confirmedSurfaces.length,ownerReportRecorded:true,unknownMetadataPreserved:true,historicalFilesChecked:baseline.files.length,historicalArtifactRecordsUnchanged:previous.length,adaptiveCreativeDirectionUnchanged:true,lockedMaster:master.artifact,publicationAuthorized:false},null,2));
