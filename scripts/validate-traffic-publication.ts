import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {validateTrafficPublicationAuthorization} from '../src/platform-variants/phantom-traffic-publication';
import {phantomTrafficPublicationVariants as variants} from '../src/platform-variants/variants/phantom-traffic-publication';
import {sha256Json} from '../src/content-intelligence/run-schema';
import {fileSha256} from '../src/production/phantom-traffic-integrity';
import {validatePhantomTrafficLockedMaster} from '../src/production/phantom-traffic-master-integrity';
import {validateDeliveryPackage} from './delivery-packages';
import {parseManifests} from '../src/artifacts/schema';
const dir='content-intelligence/reviews/phantom-traffic-publication-v1';const d=validateTrafficPublicationAuthorization(),master=validatePhantomTrafficLockedMaster();
const b=JSON.parse(readFileSync(`${dir}/final-bindings.json`,'utf8'));
if(b.decision.sha256!==sha256Json(d)||b.publicationAuthorized!==true||b.publicationOccurred!==false||b.assistantUploadAuthorized!==false||b.packages.length!==4)throw new Error('Invalid explicit publication bindings');
if(sha256Json(JSON.parse(readFileSync(`${dir}/platform-variants.json`,'utf8')))!==sha256Json(variants))throw new Error('Stale final variants');
if(fileSha256(`${dir}/platform-copy.json`)!==d.copy.sha256)throw new Error('Publication copy changed');
for(const p of b.packages){
 const v=variants.find(v=>v.platform===p.platform)!;const m=validateDeliveryPackage(p.directory);
 if(m.state!=='ready-for-manual-upload'||!m.publishEligible||m.review.previewStatus!=='owner-risk-accepted'||m.review.publicationAuthorized!==false)throw new Error('Invalid delivery/authority separation');
 if(sha256Json(m)!==p.manifestSha256||fileSha256(`${p.directory}/manifest.json`)!==p.manifestFileSha256||sha256Json(v)!==p.variantSha256||fileSha256(p.uploadFile)!==d.master.sha256)throw new Error('Final authorized package identity mismatch');
 if(v.approval?.ownerDecision?.sha256!==sha256Json(d)||v.presentationRiskAcceptance?.decision.sha256!==sha256Json(d))throw new Error('Unsupported release risk acceptance');
 if(v.platform==='instagram'&&fileSha256(`${p.directory}/cover.png`)!==d.selectedInstagramCover.sha256)throw new Error('Changed selected cover');
}
const before=parseManifests(JSON.parse(execFileSync('git',['show',`${d.reviewedCommit}:artifacts/manifests.json`],{encoding:'utf8'}))),after=parseManifests(JSON.parse(readFileSync('artifacts/manifests.json','utf8')));
for(const m of before)if(sha256Json(after.find(a=>a.artifactId===m.artifactId))!==sha256Json(m))throw new Error('Historical artifact overwritten');
// Preserve the existing adaptive system and historical QA bytes exactly.
for(const p of ['AGENTS.md','docs/CREATIVE-DIRECTION.md','artifacts/presentation-profiles.json','artifacts/presentation-qa.json','artifacts/cover-assets.json']){
 const original=execFileSync('git',['show',`${d.reviewedCommit}:${p}`]);if(!original.equals(readFileSync(p)))throw new Error(`Authority/evidence changed: ${p}`);
}
const post=JSON.parse(readFileSync(`${dir}/post-publication-review.json`,'utf8'));
if(post.releaseBlocked||post.publicationOccurred||post.surfaces.some((s:{state:string})=>s.state!=='NOT_TESTED'))throw new Error('Fabricated postpublication evidence');
console.log(JSON.stringify({passed:true,publicationAuthorized:true,publicationOccurred:false,assistantUploadAuthorized:false,finalPackages:4,realDevicePassesGranted:0,selectedCoverDeviceTested:false,historicalArtifactRecordsPreserved:before.length,adaptiveCreativeDirectionUnchanged:true,lockedMaster:master.artifact,postPublicationReview:post.state},null,2));
