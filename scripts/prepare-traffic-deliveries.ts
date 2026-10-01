import {writeFileSync,readFileSync,existsSync,mkdirSync} from 'node:fs';
import {validatePhantomTrafficLockedMaster} from '../src/production/phantom-traffic-master-integrity';
import {generateDeliveryPackage,validateDeliveryPackage} from './delivery-packages';
import {phantomTrafficDeliveryVariants} from '../src/platform-variants/variants/phantom-traffic-delivery';
import {trafficPresentationDecision,validateOwnerPresentationDecision,createOwnerReportedPresentation} from '../src/platform-variants/phantom-traffic-presentation-approval';
import {sha256Json} from '../src/content-intelligence/run-schema';
const master=validatePhantomTrafficLockedMaster();const d=validateOwnerPresentationDecision(trafficPresentationDecision);
const dir='content-intelligence/reviews/phantom-traffic-delivery-v1';const outputRoot='artifacts/deliveries/phantom-traffic-v1';
if(existsSync(`${dir}/delivery-index.json`))throw new Error('Use a new delivery revision instead of overwriting a durable handoff');
const generatedAt=new Date().toISOString();mkdirSync(dir,{recursive:true});
const packages=phantomTrafficDeliveryVariants.map(v=>generateDeliveryPackage({variantId:v.id,outputRoot,generatedAt}));
for(const p of packages)validateDeliveryPackage(p.directory);
writeFileSync(`${dir}/platform-variants.json`,JSON.stringify(phantomTrafficDeliveryVariants,null,2)+'\n');
writeFileSync(`${dir}/delivery-index.json`,JSON.stringify({schemaVersion:1,generatedAt,ownerDecision:{id:d.id,revision:d.revision,sha256:sha256Json(d)},master:master.artifact,packages:packages.map(p=>({directory:p.directory.replace(`${process.cwd()}/`,''),deliveryId:p.manifest.deliveryId,state:p.manifest.state,platform:p.manifest.destination.platform,manifestSha256:sha256Json(p.manifest)})),publicationAuthorized:false},null,2)+'\n');
const records=d.confirmedSurfaces.map(s=>{
 const platform=s.startsWith('youtube')?'youtube':s.startsWith('tiktok')?'tiktok':s.startsWith('instagram')?'instagram':'facebook';
 const variant=phantomTrafficDeliveryVariants.find(v=>v.platform===platform)!;
 return createOwnerReportedPresentation(d,s,variant.id);
});
writeFileSync(`${dir}/owner-reported-surfaces.json`,JSON.stringify(records,null,2)+'\n');
// Keep local model records and surviving measured profiles unchanged.
if(d.cover.tested===true){const file='artifacts/cover-assets.json';const covers=JSON.parse(readFileSync(file,'utf8'));const cover=covers.find((c:{id:string})=>c.id==='phantom-traffic.instagram-cover.v1');cover.status='approved';cover.approvalDecisionId=d.id;writeFileSync(file,JSON.stringify(covers,null,2)+'\n');}
console.log(JSON.stringify({packages:packages.map(p=>({directory:p.directory,state:p.manifest.state})),ownerReportedSurfaces:records.length,lockedMasterUnchanged:validatePhantomTrafficLockedMaster().artifact.sha256,publicationAuthorized:false},null,2));
