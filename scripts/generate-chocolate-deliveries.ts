import {writeFileSync} from 'node:fs';
import {sha256Json,stableJson} from '../src/content-intelligence/run-schema';
import {generateDeliveryPackage,validateDeliveryPackage} from './delivery-packages';
import {chocolatePreparedDeliveryDependencies as dependencies} from './chocolate-prepared-delivery';
import {chocolateFileHash} from '../src/production/chocolate-master-integrity';
const root='content-intelligence/reviews/chocolate-crystal-choice-platform-v1';const packages=[];
for(const variant of dependencies.variantRegistry.list()){
 const {directory}=generateDeliveryPackage({variantId:variant.id,outputRoot:'artifacts/deliveries/chocolate-crystal-choice-v1',dependencies});const manifest=validateDeliveryPackage(directory,dependencies);
 packages.push({directory:directory.replace(process.cwd()+'/',''),deliveryId:manifest.deliveryId,platform:variant.platform,variant:{id:variant.id,revision:variant.revision,sha256:sha256Json(variant)},manifestFileSha256:chocolateFileHash(directory+'/manifest.json'),manifestSha256:sha256Json(manifest),videoSha256:chocolateFileHash(directory+'/video.mp4'),state:manifest.state,publishEligible:manifest.publishEligible});
}
writeFileSync(root+'/delivery-index.json',stableJson({packages,platformApproved:false,publicationAuthorized:false,masterBytesReused:true},2)+'\n');console.log(JSON.stringify(packages.map(p=>({platform:p.platform,path:p.directory,state:p.state})),null,2));
