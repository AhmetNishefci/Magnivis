import {createRequire} from 'node:module';
import {execFileSync} from 'node:child_process';
import {readFileSync,writeFileSync} from 'node:fs';
import {validateChocolateLockedMaster,chocolateFileHash as hash} from '../src/production/chocolate-master-integrity';
import {sha256Json,stableJson} from '../src/content-intelligence/run-schema';
import {inspectMedia} from './media-inspection';
const require=createRequire(import.meta.url);const ffmpeg:string=require('ffmpeg-static');
const master=validateChocolateLockedMaster();const root='artifacts/qa-evidence/chocolate-crystal-choice-platform-v1';
const captions=JSON.parse(readFileSync('src/captions/plans/chocolate.json','utf8'));
execFileSync(ffmpeg,['-v','error','-xerror','-i',master.artifact.path,'-f','null','-'],{stdio:'pipe'});
const beats=[['hook',2.1],['fat-solids',7],['melting',11],['arrangement',14.25],['network',19.5],['possible-softness',22.5],['tempering',27],['snap-gloss',34.9],['ending',38.5]] as const;
const observations=[];
for(const key of ['youtube-mobile','tiktok-mobile','instagram-reel','facebook-reel']){
 const report=JSON.parse(readFileSync(`${root}/${key}.json`,'utf8'));const {left,right,top,bottom}=report.assessment.insets;const paths=[];
 for(const [name,time] of beats){const path=`${root}/${key}-${name}-local-model.png`;execFileSync(ffmpeg,['-y','-v','error','-ss',String(time),'-i',master.artifact.path,'-frames:v','1','-vf',`drawbox=x=${left}:y=${top}:w=${1080-left-right}:h=${1920-top-bottom}:color=0xC23A65:t=3,scale=270:480`,path]);paths.push(path);observations.push({surface:key,beat:name,seconds:time,path,sha256:hash(path),overlay:'Known historical/provisional inset outline only. No native UI geometry or device screenshot.'});}
 const filter=paths.map((_,i)=>`[${i}:v]`).join('')+'xstack=inputs=9:layout=0_0|270_0|540_0|0_480|270_480|540_480|0_960|270_960|540_960[out]';
 execFileSync(ffmpeg,['-y','-v','error',...paths.flatMap(p=>['-i',p]),'-filter_complex',filter,'-map','[out]','-frames:v','1',`${root}/${key}-local-contact-sheet.png`]);
}
const sheets=[];
for(let page=0;page<3;page++){const cues=captions.cues.slice(page*10,(page+1)*10);const frames=cues.map((c:{startFrame:number;endFrame:number})=>Math.round((c.startFrame+c.endFrame)/2));const path=`${root}/caption-midpoints-${page+1}.jpg`;execFileSync(ffmpeg,['-y','-v','error','-i',master.artifact.path,'-vf',`select='${frames.map((f:number)=>`eq(n,${f})`).join('+')}',setpts=N/FRAME_RATE/TB,scale=360:640,tile=5x2:nb_frames=${cues.length}:padding=8:margin=8:color=0xD6D0DF`,'-frames:v','1',path]);sheets.push({path,sha256:hash(path),observations:cues.map((c:{id:string;lines:string[]},i:number)=>({cueId:c.id,frame:frames[i],lines:c.lines}))});}
execFileSync(ffmpeg,['-y','-v','error','-i','artifacts/covers/chocolate-crystal-choice-instagram-cover-v1.png','-vf','scale=360:640','-frames:v','1',`${root}/instagram-cover-phone.png`]);
writeFileSync(`${root}/caption-midpoints.json`,stableJson({passed:true,mediaSha256:master.artifact.sha256,captionPlanSha256:sha256Json(captions),inspectedCaptionMidpoints:captions.cues.length,sheets,realDevicePasses:0,scope:'Decoded actual MP4 at every semantic caption midpoint, 360x640 local scale. Existing approved browser bounds are retained; mobile app layout remains unmeasured.'},2)+'\n');
writeFileSync(`${root}/media-decode.json`,stableJson({passed:true,checkedAt:new Date().toISOString(),mediaSha256:hash(master.artifact.path),fullVideoAndAudioDecode:true,masterModified:false,media:inspectMedia(master.artifact.path),sourceCaptionMidpointCount:28,sourceDecodedFrameCount:58,originalContactSheet:'artifacts/qa/chocolate-crystal-choice/contact-sheet.jpg',localModelObservations:observations,realDevicePasses:0,limitation:'Known inset outlines only. No native exclusion zones, caption region, grid/feed crop, desktop or device approval inferred. The explicit owner review resolves master visual/audio acceptance, not platform behavior.'},2)+'\n');
console.log(JSON.stringify({passed:true,fullDecode:true,overlays:observations.length,captionMidpoints:28,masterUnchanged:true}));
