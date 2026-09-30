import {validateRecoveryDecision} from '../src/artifacts/recovery';
import {readFileSync} from 'node:fs';
import {createPlatformVariantRegistry} from '../src/platform-variants/registry';
import {platformVariantSchema} from '../src/platform-variants/schema';
import {deliveryDependencies, validateDeliveryPackage} from './delivery-packages';
import {resolveVideoTarget} from './video-targets';
import {safePath, verifyArtifact} from '../src/artifacts/store';
import {parseManifests} from '../src/artifacts/schema';
import {presentationProfileSchema} from '../src/platform-variants/presentation';
import {z} from 'zod';
const manifests = parseManifests(JSON.parse(readFileSync('artifacts/manifests.json','utf8')));
validateRecoveryDecision(JSON.parse(readFileSync('artifacts/recovery-decision.json','utf8')),manifests);
const records = z.array(z.object({directory:z.string(),recoveryPlatformVariant:platformVariantSchema,historicalPackageSha256:z.null(),manifestSha256:z.string(),state:z.literal('draft-review'),provenance:z.literal('DERIVED_RECOVERY_ARTIFACT'),publicationAuthorized:z.literal(false)}).strict()).parse(JSON.parse(readFileSync('artifacts/deliveries.json','utf8')));
const variants = createPlatformVariantRegistry(records.map(r=>r.recoveryPlatformVariant));
const dependencies = {...deliveryDependencies,variantRegistry:variants,productionResolver:(variant:ReturnType<typeof variants.get>)=>{
 const spec=structuredClone(resolveVideoTarget(variant.productionIntent.videoSpecId).spec);
 if(spec.platformVariantId)spec.platformVariantId=variant.id;
 if(spec.production&&!variant.sourceMaster)spec.production.outputReviewState='visual-review-required';
 return {spec,sourceVideoPath:resolveVideoTarget(spec.id).output};
}};
// Validate immutable draft packages against restored operational bytes, never against private staging.
for(const r of records){
 const deps={...dependencies,productionResolver:(variant:ReturnType<typeof variants.get>)=>{
  const production=dependencies.productionResolver(variant);
  return {...production,sourceVideoPath:manifests.find(m=>m.artifactId===production.spec.id+'.recovered-master')!.localPath};
 }};
 validateDeliveryPackage(r.directory,deps);
}
for(const m of manifests.filter(m=>m.retention==='DURABLE_REQUIRED')) if((await verifyArtifact(await safePath(process.cwd(),m.localPath),m.identity)).state!=='VERIFIED')throw new Error(`Recovery bytes failed: ${m.artifactId}`);
z.array(presentationProfileSchema).parse(JSON.parse(readFileSync('artifacts/presentation-profiles.json','utf8')));
console.log(JSON.stringify({passed:true,restoredArtifacts:manifests.filter(m=>m.retention==='DURABLE_REQUIRED').length,deliveryPackages:records.length,historicalWoodFrog:'HASH_ONLY',publicationAuthorized:false}));
