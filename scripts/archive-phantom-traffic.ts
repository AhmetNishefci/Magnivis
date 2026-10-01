import {resolveVideoTarget} from './video-targets';
import {copyFileSync,existsSync,mkdirSync,readFileSync,statSync,writeFileSync} from 'node:fs';
import {basename,extname} from 'node:path';
import {createHash} from 'node:crypto';
import {artifactManifestSchema,parseManifests} from '../src/artifacts/schema';
import {stableJson,sha256Json} from '../src/content-intelligence/run-schema';
import {validatePhantomTrafficProduction,fileSha256} from '../src/production/phantom-traffic-integrity';
import {phantomTrafficProductionPlan as plan} from '../src/production/plans/phantom-traffic';
import metadata from '../src/production/narration/phantom-traffic.json';
import decision from '../content-intelligence/reviews/phantom-traffic-approved-v3/owner-decision.json';
const validation=validatePhantomTrafficProduction();
const qa='qa/phantom-traffic-narrated',archive='artifacts/qa-evidence/phantom-traffic-candidate-v1';
const master='artifacts/masters/phantom-traffic-candidate-v1.mp4';
const input='output/phantom-traffic-narrated.mp4';
const report=JSON.parse(readFileSync(`${qa}/report.json`,'utf8')) as {passed:boolean;input:string};
if(!report.passed||report.input!==input)throw new Error('Fresh candidate media QA is required');
const copy=(from:string,to:string)=>{
 if(existsSync(to)&&fileSha256(from)!==fileSha256(to))throw new Error(`Preserve existing candidate revision: ${to}`);
 copyFileSync(from,to);
};
mkdirSync('artifacts/masters',{recursive:true});mkdirSync(archive,{recursive:true});copy(input,master);
const qaFiles=['report.json','contact-sheet.jpg',...resolveVideoTarget('phantom-traffic').qaTimestamps.map((t,i)=>`frame-${String(i+1).padStart(2,'0')}-${t.toFixed(1)}s.png`)];
for(const file of qaFiles)copy(`${qa}/${file}`,`${archive}/${file}`);
const paths=[master,...metadata.cues.map(c=>`public/${c.file}`),'public/audio/phantom-traffic.wav',...qaFiles.map(f=>`${archive}/${f}`)];
const manifestPath='artifacts/manifests.json',originalManifestText=readFileSync(manifestPath,'utf8'),existing=parseManifests(JSON.parse(originalManifestText));
const newRecords: unknown[]=[];
const now=new Date().toISOString();
for(const path of paths){
 const ext=extname(path),isMaster=path===master,isAudio=ext==='.wav';
 const artifactId=`phantom-traffic.candidate-v1.${isMaster?'master':isAudio?'audio-'+basename(path,'.wav'):basename(path).replace(/\./g,'-')}`;
 const m=artifactManifestSchema.parse({schemaVersion:1,artifactId,contentId:'phantom-traffic',artifactType:isMaster?'video-master':isAudio?path.includes('/narration/')?'narration-audio':'soundscape-audio':'qa-evidence',revision:1,
  identity:{sha256:fileSha256(path),bytes:statSync(path).size,mimeType:ext==='.mp4'?'video/mp4':ext==='.wav'?'audio/wav':ext==='.png'?'image/png':ext==='.jpg'?'image/jpeg':'application/json'},
  createdAt:null,creationUnknownReason:'Original generation instant not separately recorded here; audio completion/QA measurement times are in bound provenance. This record uses archive-entry time.',recordedAt:now,
  sourceCommit:decision.approvedSourceCommit,productionPlanId:plan.id,captionPlanId:plan.captions.captionPlanId,platformVariantId:null,approvalDecisionId:null,approvalScope:'none',publication:'not-authorized',
  localPath:path,locations:[{provider:'git',key:path,durability:'git-tracked'}],provenance:'ORIGINAL_PRODUCTION',retention:'DURABLE_REQUIRED',historicalSha256:null,historicalStatus:'new-production',replacesArtifactId:null,parentArtifactIds:isMaster||isAudio?[]:['phantom-traffic.candidate-v1.master'],exactBytesMatter:true,
  reproducibility:{status:isAudio?path.includes('/narration/')?'unknown':'derived':isMaster?'unknown':'derived',recipe:isAudio?path.includes('/narration/')?['node scripts/generate-narration.mjs phantom-traffic; retain exact approved candidate WAVs; regeneration does not inherit approval']:['node scripts/generate-traffic-audio.mjs']:['pnpm render phantom-traffic','pnpm qa phantom-traffic'],
   evidence:['sourceCommit identifies the approved editorial base; production implementation file hashes are in the candidate bindings receipt.','Exact original candidate bytes are retained in Git; full MP4 byte-for-byte re-encoding is not claimed.','Owner master visual approval, renewed device QA and publication authorization remain pending.']}});
 const prior=existing.find(r=>r.artifactId===artifactId);
 if(prior){if(sha256Json(prior.identity)!==sha256Json(m.identity))throw new Error('Artifact identity cannot be overwritten');}else {existing.push(m);newRecords.push(m);}
}
parseManifests(existing);
if(newRecords.length)writeFileSync(manifestPath,originalManifestText.replace(/\s*\]\s*$/, '')+`,\n${newRecords.map(record=>JSON.stringify(record,null,2).split('\n').map(line=>'  '+line).join('\n')).join(',\n')}\n]\n`);
const sourcePaths=[
 'src/components/TrafficWorld.tsx','src/compositions/PhantomTraffic.tsx','src/production/traffic-motion.ts',
 'src/captions/plans/phantom-traffic.ts','src/production/narration/phantom-traffic-caption-plan.json','src/production/narration/phantom-traffic.json','src/production/narration/phantom-traffic-soundscape.json',
 'src/production/plans/phantom-traffic.json','src/content/videos/phantom-traffic.ts','src/components/MagnivisCaptionRenderer.tsx',
 'src/captions/plan.ts','src/captions/design-system.ts','src/captions/schema.ts','src/design/tokens.ts','src/design/safe-areas.ts','src/Root.tsx','src/index.ts',
 'package.json','pnpm-lock.yaml','remotion.config.ts','scripts/render.ts','scripts/video-targets.ts','scripts/generate-traffic-audio.mjs',
 'captions/phantom-traffic.en.vtt',...['owner-decision.json','knowledge-package.approved.json','content-asset.approved.json'].map(f=>`content-intelligence/reviews/phantom-traffic-approved-v3/${f}`),
];
const receipt={schemaVersion:1,id:'production-review.phantom-traffic.candidate-v1',recordedAt:now,timeBasis:'archive-and-QA-entry',
 ownerEditorialDecision:plan.ownerDecision,knowledgePackage:plan.knowledgePackage,contentAsset:plan.contentAsset,approvedScriptSha256:plan.approvedScriptSha256,
 productionPlan:{id:plan.id,revision:plan.revision,sha256:sha256Json(plan)},captionPlan:{id:plan.captions.captionPlanId,revision:plan.captions.captionPlanRevision,sha256:plan.captions.captionPlanSha256},
 candidate:{path:master,workingPath:input,sha256:fileSha256(master),bytes:statSync(master).size},
 narration:{measuredSeconds:metadata.measuredNarrationSeconds,bundleSha256:sha256Json(metadata.provenance.cueArtifacts),cueArtifacts:metadata.provenance.cueArtifacts},
 sources:sourcePaths.map(path=>({path,sha256:fileSha256(path)})),qaEvidence:qaFiles.map(f=>({path:`${archive}/${f}`,sha256:fileSha256(`${archive}/${f}`)})),
 deterministicFrame:{frame:768,renderA:createHash('sha256').update(readFileSync('/tmp/traffic-determinism-a.png')).digest('hex'),renderB:fileSha256('/tmp/traffic-determinism-b.png'),scope:'Two independent renders of the same payoff frame; no claim of full MP4 byte reproducibility'},
 status:'owner-master-visual-review-required',automatedSourceValidation:validation,ownerMasterVisualApproval:false,platformApprovalGranted:false,publicationApprovalGranted:false,
 retention:{candidate:'DURABLE_REQUIRED',narration:'DURABLE_REQUIRED',soundscape:'DURABLE_REQUIRED',boundedQaEvidence:'DURABLE_REQUIRED',smokeAndCaches:'TEMPORARY'},
};
if(receipt.deterministicFrame.renderA!==receipt.deterministicFrame.renderB)throw new Error('Nondeterministic payoff frame');
mkdirSync('content-intelligence/reviews/phantom-traffic-production-v1',{recursive:true});
writeFileSync('content-intelligence/reviews/phantom-traffic-production-v1/candidate-bindings.json',`${stableJson(receipt,2)}\n`);
console.log(JSON.stringify({candidate:receipt.candidate,newProductionArtifactCount:paths.length,qaCaptures:qaFiles.length-2,passed:true},null,2));
