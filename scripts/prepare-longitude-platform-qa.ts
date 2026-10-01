import {readFileSync,writeFileSync,mkdirSync,statSync} from 'node:fs';
import {createRequire} from 'node:module';
import {execFileSync} from 'node:child_process';
import {z} from 'zod';
import {presentationProfileSchema,presentationQaSchema,presentationOutputSchema,coverAssetSchema,validatePresentationRegions} from '../src/platform-variants/presentation';
import {safeAreaProfileRegistry} from '../src/design/safe-areas';
import {validateLongitudeLockedMaster} from '../src/production/longitude-master-integrity';
import {longitudeFileHash} from '../src/production/longitude-integrity';
import {stableJson} from '../src/content-intelligence/run-schema';
const require=createRequire(import.meta.url);const ffmpeg=require('ffmpeg-static');
const dir='content-intelligence/reviews/longitude-clock-platform-v1';const qaDir='artifacts/qa-evidence/longitude-clock-platform-v1';mkdirSync(qaDir,{recursive:true});
const read=(p:string)=>JSON.parse(readFileSync(p,'utf8'));const write=(p:string,d:unknown)=>writeFileSync(p,stableJson(d,2)+'\n');
const master=validateLongitudeLockedMaster();
const typography=read('artifacts/qa-evidence/longitude-clock-candidate-v2/typography-report.json');
const regions=[{kind:'brand',bounds:{x:140,y:281,width:700,height:40}},{kind:'critical-visual',bounds:{x:140,y:359,width:730,height:145}},{kind:'critical-visual',bounds:{x:135,y:573,width:720,height:750}},{kind:'caption',bounds:{x:140,y:1450,width:710,height:132}},{kind:'disclosure',bounds:{x:190,y:1235,width:630,height:80}},...typography.observations.flatMap((o:{labels:{x:number;y:number;width:number;height:number}[]})=>o.labels.map(l=>({kind:'number',bounds:{x:l.x,y:l.y,width:l.width,height:l.height}})))];
write(dir+'/critical-regions.json',regions);
const profiles=z.array(presentationProfileSchema).parse(read('artifacts/presentation-profiles.json'));
const models=[['youtube-mobile','youtube','safe-area.youtube-shorts.v2','mobile-app'],['youtube-desktop','youtube','safe-area.youtube-shorts.v2','desktop-web'],['tiktok-mobile','tiktok','safe-area.tiktok-feed.v2','mobile-app'],['tiktok-cover','tiktok','tiktok-cover.pending','mobile-app'],['youtube-cover','youtube','youtube-shorts-cover.pending','desktop-web'],['instagram-reel','instagram','safe-area.instagram-reels.v1','mobile-app'],['instagram-grid','instagram','instagram-profile-grid.pending','mobile-app'],['facebook-reel','facebook','safe-area.facebook-reels.v1','mobile-app'],['facebook-feed','facebook','facebook-page-feed.pending','mobile-app']] as const;
const coverPath='artifacts/covers/longitude-clock-instagram-cover-v1.png';const coverHash=longitudeFileHash(coverPath);
if(coverHash!==longitudeFileHash('/private/tmp/longitude-cover-repeat.png'))throw new Error('Cover determinism drift');
const cover=coverAssetSchema.parse({id:'longitude-clock.instagram-cover.v1',platform:'instagram',surface:'instagram-profile-grid',sourceArtifactId:master.masterArtifactId,sourceVideoSha256:master.artifact.sha256,frame:21,crop:null,headlineRegion:{x:200,y:670,width:680,height:285},artifactId:'longitude-clock.instagram-cover.v1',sha256:coverHash,provenance:'Original explanatory object-theatre cover, not a literal extracted frame. Same approved question/type/assets; centered for grid review, with actual grid crop unknown. Source frame 21 is concept reference only.',approvalDecisionId:null,status:'review'});
write('artifacts/longitude-clock-cover-assets.json',[cover]);
const records=[],outputs=[],reports=[];
for(const [key,platform,id,context] of models){
 const profile=profiles.find(p=>p.id===id);if(!profile)throw new Error('Unknown surviving profile '+id);
 const known=context==='mobile-app'&&profile.insets!==null;
 const assessment=known?validatePresentationRegions(profile,regions as Parameters<typeof validatePresentationRegions>[1]):{state:'UNMEASURED',violations:[],unresolved:['Actual surface/player geometry unmeasured']};
 const variantId=`longitude-clock.asset.time-to-position.variant.${platform==='youtube'?'youtube-shorts':platform==='tiktok'?'tiktok-feed':platform==='instagram'?'instagram-reels':'facebook-reels'}`;
 const record=presentationQaSchema.parse({id:`presentation-qa.longitude-clock.${key}.v1`,platformVariantId:variantId,masterArtifactId:master.masterArtifactId,profileId:id,surface:profile.surface,context,state:known?'LOCAL_APPROXIMATION':'PRIVATE_PREVIEW_PENDING',mediaSha256:master.artifact.sha256,coverSha256:key==='instagram-grid'?coverHash:null,device:null,os:null,appVersion:null,testedAt:null,reviewer:null,evidence:[`${qaDir}/${key}.json`,'artifacts/qa-evidence/longitude-clock-candidate-v2/contact-sheet.jpg'],notes:known?'Exact decoded master and measured source bounds clear known inset model. Native exclusions/caption geometry remain incomplete; no device pass.':'Full-frame reference only; no guessed desktop/grid/feed/cover crop or device pass.'});
 const insetModel=known?safeAreaProfileRegistry.get(id):null;
 const report={assessment:{...assessment,profileId:id,insets:insetModel?.insets??null,localKnownInsets:known?'VERIFIED BY LOCAL MODEL':'UNMEASURED',evidenceQualification:known?(profile.evidenceLevel==='git-survivor'?'Surviving inset model; still requires this-media real-device review':'PROVISIONAL reconstructed/owner model'):'UNMEASURED',realDeviceReviewRequired:true},qa:record,sourceFrames:'artifacts/qa-evidence/longitude-clock-candidate-v2',decodedCaptionMidpoints:24,actualBrowserFontBoundsPassed:typography.passed,derivativeCreated:false,platformApprovalGranted:false,publicationApprovalGranted:false};
 write(`${qaDir}/${key}.json`,report);records.push(record);reports.push(report);
 outputs.push(presentationOutputSchema.parse({masterArtifactId:master.masterArtifactId,platformVariantId:variantId,surface:profile.surface,strategy:key==='instagram-grid'?'MASTER_PLUS_COVER':'ONE_MASTER',coverArtifactId:key==='instagram-grid'?cover.id:null,derivativeArtifactId:null,evidence:record.evidence}));
}
write(dir+'/presentation-qa.json',records);write(dir+'/presentation-outputs.json',outputs);write(dir+'/surface-reports.json',reports);
// Exact decoded representative frames; no changes to the approved video.
for(const [platform,seconds] of [['youtube',.7],['tiktok',1.6],['facebook',29.1]] as const){const path=`${qaDir}/${platform}-representative.png`;execFileSync(ffmpeg,['-y','-v','error','-ss',String(seconds),'-i',master.artifact.path,'-frames:v','1',path]);}
write(dir+'/cover-evaluation.json',{youtube:{strategy:'frame-selection',time:.7,path:`${qaDir}/youtube-representative.png`,reason:'Opening clock/ship object study complements the question title. Current official desktop custom-thumbnail option may exist, but account/live UI confirmation required; no bespoke artwork needed.'},tiktok:{strategy:'frame-selection',time:1.6,path:`${qaDir}/tiktok-representative.png`,reason:'Clock/ship opening introduces the object mystery; choose this native frame, do not add template text.'},instagram:{strategy:'custom-image',path:coverPath,sha256:coverHash,reason:'Center the complete approved question/objects for profile/grid review; crop remains unknown, cover approval pending.'},facebook:{strategy:'frame-selection',time:29.1,path:`${qaDir}/facebook-representative.png`,reason:'The same-instant comparison and angular payoff support self-contained feed discovery. Native Page/feed crop remains unknown; no speculative derivative.'}});
console.log({masterUnchanged:longitudeFileHash(master.artifact.path)===master.artifact.sha256,surfaces:records.length,coverBytes:statSync(coverPath).size,realDevicePasses:0});
