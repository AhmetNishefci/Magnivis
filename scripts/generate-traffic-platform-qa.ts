import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {sha256Json,stableJson} from '../src/content-intelligence/run-schema';
import {fileSha256} from '../src/production/phantom-traffic-integrity';
import {validatePhantomTrafficLockedMaster} from '../src/production/phantom-traffic-master-integrity';
import {presentationProfileSchema,presentationQaSchema,presentationOutputSchema,coverAssetSchema,type PresentationQa,type PresentationOutput} from '../src/platform-variants/presentation';
import {assessPhantomTrafficSurface,phantomTrafficRegions} from '../src/platform-variants/phantom-traffic-regions';
import {phantomTrafficPlatformVariantId,phantomTrafficPlatformVariants} from '../src/platform-variants/variants/phantom-traffic';
import profilesData from '../artifacts/presentation-profiles.json';
const master=validatePhantomTrafficLockedMaster();
const profiles=profilesData.map(p=>presentationProfileSchema.parse(p));
const dir='artifacts/qa-evidence/phantom-traffic-platform-v1';mkdirSync(dir,{recursive:true});
const review='content-intelligence/reviews/phantom-traffic-platform-v1';mkdirSync(review,{recursive:true});
const coverPath='artifacts/covers/phantom-traffic-instagram-cover-v1.png',coverHash=fileSha256(coverPath);
if(coverHash!==fileSha256('/tmp/phantom-traffic-cover-repeat.png'))throw new Error('Cover candidate determinism failed');
const coverArtifactId='phantom-traffic.instagram-cover.v1';
const cover=coverAssetSchema.parse({id:coverArtifactId,platform:'instagram',surface:'instagram-profile-grid',sourceArtifactId:master.masterArtifactId,sourceVideoSha256:master.artifact.sha256,frame:0,crop:null,headlineRegion:{x:155,y:625,width:770,height:220},artifactId:coverArtifactId,sha256:coverHash,provenance:'Original Magnivis procedural still. Source frame 0 is the opening concept reference, not a literal extracted frame. Crop geometry is unknown; no measured grid crop is implied.',approvalDecisionId:null,status:'review'});
writeFileSync('artifacts/cover-assets.json',stableJson([cover],2)+'\n');
const frameDir='artifacts/qa-evidence/phantom-traffic-candidate-v1';
const frameRefs=[['frame-01-0.0s.png','Opening · 0.0 s'],['frame-02-0.5s.png','Opening · 0.5 s'],['frame-04-1.0s.png','Opening · 1.0 s'],['frame-13-10.5s.png','22-car experiment · 10.5 s'],['frame-15-13.5s.png','Conditional-growth caption · 13.5 s'],['frame-20-20.1s.png','Membership turnover · 20.1 s'],['frame-25-25.6s.png','Backward-pattern payoff · 25.6 s'],['frame-29-31.6s.png','Qualified ending · 31.6 s']];
const models=[
 {key:'youtube-mobile',label:'YouTube Shorts mobile',id:'safe-area.youtube-shorts.v2',context:'mobile-app' as const},
 {key:'youtube-desktop',label:'YouTube desktop/web',id:'safe-area.youtube-shorts.v2',context:'desktop-web' as const},
 {key:'tiktok-mobile',label:'TikTok mobile feed',id:'safe-area.tiktok-feed.v2',context:'mobile-app' as const},
 {key:'instagram-reel',label:'Instagram Reel playback',id:'safe-area.instagram-reels.v1',context:'mobile-app' as const},
 {key:'instagram-grid',label:'Instagram profile/grid',id:'instagram-profile-grid.pending',context:'mobile-app' as const},
 {key:'facebook-reel',label:'Facebook dedicated Reel viewer',id:'safe-area.facebook-reels.v1',context:'mobile-app' as const},
 {key:'facebook-feed',label:'Facebook Page/feed',id:'facebook-page-feed.pending',context:'mobile-app' as const},
];
const records:PresentationQa[]=[],outputs:PresentationOutput[]=[],reports:unknown[]=[];
for(const m of models){
 const profile=profiles.find(p=>p.id===m.id)!;
 const desktop=m.context==='desktop-web';
 const insets=desktop?null:profile.insets;
 const geometryNote=desktop?'Intrinsic portrait-frame reference only; actual web-player/UI geometry unmeasured.':insets?'Existing profile inset model only; not measured Phantom Traffic device behavior.':'CROP UNKNOWN — full 9:16 reference only. No guessed grid/feed crop.';
 const props={label:m.label,surface:profile.surface,geometryNote,insets,frames:frameRefs.map(([file,label])=>({image:`data:image/png;base64,${readFileSync(`${frameDir}/${file}`).toString('base64')}`,label})),cover:m.key==='instagram-grid'?`data:image/png;base64,${readFileSync(coverPath).toString('base64')}`:null};
 const temporary=`/tmp/magnivis-${m.key}-model-props.json`;writeFileSync(temporary,JSON.stringify(props));
 const path=`${dir}/${m.key}.png`;
 execFileSync('pnpm',['exec','remotion','still','src/platform-variants/PhantomTrafficPresentationRoot.tsx','PhantomTraffic-Presentation-Model',path,'--frame=0',`--props=${temporary}`,'--log=error'],{stdio:'inherit'});
 if(m.key==='tiktok-mobile'){
  execFileSync('pnpm',['exec','remotion','still','src/platform-variants/PhantomTrafficPresentationRoot.tsx','PhantomTraffic-Presentation-Model','/tmp/phantom-traffic-model-repeat.png','--frame=0',`--props=${temporary}`,'--log=error'],{stdio:'inherit'});
  if(fileSha256(path)!==fileSha256('/tmp/phantom-traffic-model-repeat.png'))throw new Error('Model render determinism failed');
 }
 const record=presentationQaSchema.parse({id:`presentation-qa.phantom-traffic.${m.key}.local.v1`,platformVariantId:phantomTrafficPlatformVariantId(profile.platform),masterArtifactId:master.masterArtifactId,profileId:profile.id,surface:profile.surface,context:m.context,state:insets||desktop?'LOCAL_APPROXIMATION':'PRIVATE_PREVIEW_PENDING',mediaSha256:master.artifact.sha256,coverSha256:m.key==='instagram-grid'?coverHash:null,device:null,os:null,appVersion:null,testedAt:null,reviewer:null,evidence:[path],notes:`LOCAL MODEL / PROVISIONAL / REAL-DEVICE REQUIRED. ${geometryNote} Context identifies the intended surface, not an actual device session. No upload, native UI screenshot or platform pass. Caption regions and exact native exclusion zones remain unmeasured.`});
 const output=presentationOutputSchema.parse({strategy:m.key==='instagram-grid'?'MASTER_PLUS_COVER':'ONE_MASTER',masterArtifactId:master.masterArtifactId,platformVariantId:record.platformVariantId,surface:profile.surface,coverArtifactId:m.key==='instagram-grid'?coverArtifactId:null,derivativeArtifactId:null,evidence:[path]});
 const report={schemaVersion:1,recordedAt:new Date().toISOString(),timeBasis:'local-model-generation-entry',label:'LOCAL MODEL / PROVISIONAL / REAL-DEVICE REQUIRED',model:m.key,qa:record,output,
  assessment:desktop?{geometryStatus:'desktop-web-unmeasured',insets:null,captionRegion:null,exclusionZones:null,realDeviceReviewRequired:true,platformApprovalGranted:false}:assessPhantomTrafficSurface(profile),
  profileSnapshotSha256:sha256Json(profile),sourceFrames:frameRefs.map(([file,label])=>({path:`${frameDir}/${file}`,sha256:fileSha256(`${frameDir}/${file}`),label})),
  preview:{path,sha256:fileSha256(path)},cover:m.key==='instagram-grid'?{...cover,path:coverPath,claimIds:['phantom-traffic.claim.no-obstruction'],headline:'A JAM. NO BLOCKED ROAD.'}:null,
  derivativeCreated:false,realDeviceEvidence:null,platformApprovalGranted:false,publicationApprovalGranted:false};
 writeFileSync(`${dir}/${m.key}.json`,stableJson(report,2)+'\n');records.push(record);outputs.push(output);reports.push(report);
}
const prior=JSON.parse(readFileSync('artifacts/presentation-qa.json','utf8')) as {id:string}[];
if(prior.some(p=>records.some(r=>r.id===p.id)))throw new Error('Preserve previous presentation evidence; use a new revision for reruns');
writeFileSync('artifacts/presentation-qa.json',stableJson([...prior,...records],2)+'\n');
writeFileSync(`${review}/platform-variants.json`,stableJson(phantomTrafficPlatformVariants,2)+'\n');
writeFileSync(`${review}/surface-reports.json`,stableJson(reports,2)+'\n');
writeFileSync(`${review}/presentation-outputs.json`,stableJson(outputs,2)+'\n');
writeFileSync(`${review}/critical-regions.json`,stableJson(phantomTrafficRegions,2)+'\n');
writeFileSync(`${review}/preview-inputs.json`,stableJson({entrypoint:'src/platform-variants/PhantomTrafficPresentationRoot.tsx',sourceFrames:frameRefs,profiles:models,coverPath,coverHash,masterHash:master.artifact.sha256},2)+'\n');
console.log(JSON.stringify({localSurfaceCount:reports.length,cover:{path:coverPath,sha256:coverHash},masterBytesUnchanged:fileSha256(master.artifact.path)===master.artifact.sha256,realDevicePasses:0,derivativesCreated:0},null,2));
