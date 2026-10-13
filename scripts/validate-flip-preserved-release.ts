import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {mediaHash,loadMediaRegistry} from '../src/artifacts/media';
import {sha256Json} from '../src/content-intelligence/run-schema';
import {knowledgePackageSchema} from '../src/knowledge/schema';
import {contentAssetSchema} from '../src/content-assets/schema';
import {creativeDirectionSchema} from '../src/content-assets/creative-direction';
import {validateInternalProductionPlanReferences} from '../src/production/schema';
import {validateAdaptiveCaptionPlan} from '../src/captions/adaptive-plan';
import {verifyInternalEditorial} from '../src/workflow/editorial';
import {loadCycle} from '../src/workflow/store';
import {cycleReleaseSchema,inspectCycleRelease} from '../src/workflow/release';
import {inspectMedia} from '../src/artifacts/inspection';
import metadata from '../src/production/narration/flip.json';
import sound from '../src/production/narration/flip-soundscape.json';
const base='content-intelligence/cycles/cycle-12/production-v1',ed='content-intelligence/cycles/cycle-12/development-v1';
const read=(p:string):unknown=>JSON.parse(readFileSync(p,'utf8'));
const pkg=knowledgePackageSchema.parse(read(`${ed}/knowledge-package.ready.json`)),asset=contentAssetSchema.parse(read(`${ed}/content-asset.ready.json`)),direction=creativeDirectionSchema.parse(read(`${ed}/direction-v1.json`));
const receipt=read(`${ed}/editorial-receipt.json`) as {draftPackage:unknown;draftAsset:unknown;review:unknown};
const verified=verifyInternalEditorial(receipt.review,knowledgePackageSchema.parse(receipt.draftPackage),contentAssetSchema.parse(receipt.draftAsset));
if(sha256Json(verified.knowledgePackage)!==sha256Json(pkg)||sha256Json(verified.contentAsset)!==sha256Json(asset))throw new Error('Current package differs from native verified editorial output');
const plan=validateInternalProductionPlanReferences(read('src/production/plans/flip.json'),pkg,asset,direction);
const captions=validateAdaptiveCaptionPlan(read('src/captions/plans/flip.json'),metadata.cues,metadata.format,direction,asset);
if(plan.captions.captionPlanSha256!==sha256Json(captions)||metadata.provenance.approvedScriptSha256!==sha256Json(asset.script))throw new Error('Detached narration/caption plan');
for(const c of metadata.cues){const source=metadata.provenance.cueArtifacts.find(s=>s.id===c.id);if(source?.sha256!==mediaHash(`public/${c.file}`))throw new Error('Changed narration bytes');}
if(sound.sha256!==mediaHash(`public/${sound.file}`))throw new Error('Changed soundscape');
const bindings=read(`${base}/implementation-bindings.json`) as {files:{path:string;sha256:string}[]};for(const f of bindings.files)if(mediaHash(f.path)!==f.sha256)throw new Error('Changed implementation input: '+f.path);
const registry=loadMediaRegistry(),cycle=loadCycle(process.cwd(),'cycle.12',registry);
if(!['presentation','publication-review'].includes(cycle.stage)||!cycle.masterDecision||cycle.publicationDecision)throw new Error('Expected approved master, no publication authorization');
const approval=read(cycle.masterDecision.path) as {decision:string;targetSha256:string};
const candidate=read(cycle.candidate!.path) as {media:{id:string;sha256:string}};
if(approval.decision!=='approve'||approval.targetSha256!==sha256Json(candidate)||candidate.media.sha256!=='71cc87c2794de9096569dd6759ad29c6a53b9c027d43b0ef95794bd14a6a45e5')throw new Error('Approval not bound to exact V1');
const publication='content-intelligence/cycles/cycle-12/publication';
const baseline=read(`${publication}/preservation-baseline-v1.json`) as {files:{path:string;sha256:string}[];allowedExistingChanges:string[]};
const digestBytes=(b:Buffer)=>createHash('sha256').update(b).digest('hex');
const catalog=read('artifacts/media-catalog.json') as {schemaVersion:number;artifacts:{canonicalPath:string}[]};
const firstCycle13=catalog.artifacts.findIndex(a=>a.canonicalPath.includes('devils-hole'));
if(firstCycle13<0)throw new Error('Cycle13 append boundary missing');
let licensePrefixBytes=0;
for(const f of baseline.files){
 if(baseline.allowedExistingChanges.includes(f.path))continue;
 if(f.path==='artifacts/media-catalog.json'){
  const original=Buffer.from(JSON.stringify({...catalog,artifacts:catalog.artifacts.slice(0,firstCycle13)},null,2)+'\n');
  if(digestBytes(original)!==f.sha256)throw new Error('Historical catalog records changed rather than appended');
 }else if(f.path==='docs/ASSET-LICENSES.md'){
  const bytes=readFileSync(f.path);let end=bytes.indexOf(10);
  while(end>=0){if(digestBytes(bytes.subarray(0,end+1))===f.sha256){licensePrefixBytes=end+1;break;}end=bytes.indexOf(10,end+1);}
  if(!licensePrefixBytes)throw new Error('Historical license bytes changed rather than appended');
 }else if(mediaHash(f.path)!==f.sha256)throw new Error('Protected input/history/analytics changed: '+f.path);
}

const release=cycleReleaseSchema.parse(read(`${publication}/release-v1.json`)),inspection=inspectCycleRelease(release,registry,new Date().toISOString());
if([...new Set(release.deliveries.map(d=>d.variant.platform))].sort().join(',')!=='facebook,instagram,tiktok,youtube')throw new Error('Incomplete target platforms');
const captionMidpoints=captions.cues.map(c=>Math.floor((c.startFrame+c.endFrame)/2));
for(const d of release.deliveries){
 if(d.variant.relationship!=='exact-master'||d.variant.media.sha256!==candidate.media.sha256)throw new Error('Unapproved media replacement');
 const evidence=read(d.variant.presentation.path) as {coverage:{captionMidpoints:number[]};device:{state:string}};
 if(captionMidpoints.some(f=>!evidence.coverage.captionMidpoints.includes(f))||evidence.device.state!=='not-tested')throw new Error('Missing captions or invented native pass');
 const profile=read(d.variant.profile.path) as {export:{duration:{maximum:number}}};
 if(profile.export.duration.maximum!==180)throw new Error('Wrong fresh envelope');
}
const risk=read(`${publication}/risk-register-v1.json`) as {requiredExactPresentationUnknowns:string[];acceptedByOwner:boolean};
if(risk.acceptedByOwner||sha256Json(risk.requiredExactPresentationUnknowns)!==sha256Json(inspection.unknowns))throw new Error('Risk register altered or owner acceptance invented');
const words=asset.script.segments.map(s=>s.text).join(' ').split(/\s+/).length;
if(words!==149||sha256Json(asset.script)!=='a1cc265cfe1f8ca836170094ab9692cd942c1886d5b8cb8c38a7c28287dd75ea')throw new Error('Approved script changed');
const media=registry.get(candidate.media);
console.log(JSON.stringify({passed:true,stage:cycle.stage,revision:cycle.revision,masterPath:media.canonicalPath,masterSha256:media.sha256,actualMedia:inspectMedia(media.canonicalPath),scriptWords:words,scriptSha256:sha256Json(asset.script),protectedFilesChecked:baseline.files.length-baseline.allowedExistingChanges.length,historicalCatalogEntries:firstCycle13,subsequentCycle13CatalogAdditions:catalog.artifacts.length-firstCycle13,historicalLicensePrefixBytes:licensePrefixBytes,validationScope:'Current preservation of Cycle12 release, with exact-hash prefix proof for subsequent catalog/license additions; original checkpoint validator preserved',platforms:inspection.uploads,captionMidpointsPerPlatform:captionMidpoints.length,unknowns:inspection.unknowns.length,knownCollisions:0,ownerCreativeApproval:true,publicationAuthorized:false,limitations:'Local checks and completed owner creative review do not certify native device, crop, processing or account acceptance. TikTok current help body inaccessible; indexed official instructions only.'},null,2));
