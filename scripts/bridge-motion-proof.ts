import {spawn, spawnSync} from 'node:child_process';
import {createRequire} from 'node:module';
import {once} from 'node:events';
import {mkdirSync, readFileSync, writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import sharp from 'sharp';
import {stableJson, sha256Json} from '../src/content-intelligence/run-schema';
import {fileSha256 as hash} from '../src/design-exploration/raster-source';
import {outlinedText} from '../src/design-exploration/millennium-bridge/frames';
import {bApprovalPath, validateBApproval} from '../src/motion-proof/millennium-bridge/approval';
import {prepareProofInputs, renderProofFrame} from '../src/motion-proof/millennium-bridge/composition';
import {validateMotionInspection} from '../src/motion-proof/millennium-bridge/inspection';
import {proofSize, proofSamples, maskSvgs, maskSvg, type ProofMask} from '../src/motion-proof/millennium-bridge/model';

const require = createRequire(import.meta.url);
const ffmpeg = require('ffmpeg-static') as string;
const ffprobe = (require('ffprobe-static') as {path:string}).path;
const args = process.argv.slice(2).filter((arg)=>arg!=='--');
const stage=args[0];
if (!['generate','validate','frames'].includes(stage ?? '')) throw new Error('Usage: pnpm motion:bridge <generate|frames|validate> [directory]');
const directory=resolve(args[1]??'motion-reviews/millennium-bridge-opening-proof-v1');
const decision=validateBApproval();
const inputs=await prepareProofInputs();
const json=(v:unknown)=>`${stableJson(v,2)}\n`;
const files:Record<string,Buffer>={};
for (const id of Object.keys(maskSvgs) as ProofMask[]) {
  files[`masks/${id}.svg`]=Buffer.from(maskSvg(id));
  files[`masks/${id}.png`]=await sharp(inputs.masks[id],{raw:{width:1080,height:1920,channels:1}}).png({compressionLevel:9}).toBuffer();
}
files['disclosure.svg']=Buffer.from(inputs.disclosureSvg);
files['composition.json']=Buffer.from(json({kind:'controlled-continuous-raster-motion-proof',...proofSize,temporalGeneration:false,newGeneratedSources:false,decisionId:decision.id,sourceAssetIds:inputs.selected.map(({source})=>source.id),timeline:[{seconds:[0,.28],action:'Support/deck motion begins; person initially follows support.'},{seconds:[.28,.92],action:'Torso and arm compensate after support displacement.'},{seconds:[.75,1.5],action:'Free-foot search, slight lift and lateral placement.'},{seconds:[2.75,4.1],action:'Camera follows planted foot into close view.'},{seconds:[3.95,4.25],action:'Short scale-matched optical dissolve into frozen macro shot.'},{seconds:[4.25,6],action:'Macro deck/foot controlled relative motion.'}],maskMeaning:'Feathered semantic influence fields, not alpha-separated clean plates or recovered depth.',exactMasks:maskSvgs,spatialInterpolation:'24 px deformation grid, bilinear inverse UV sampling; bounded authored transforms.',noFinalCaptions:true,noAudio:true}));
for (const sample of proofSamples) {
  const pixels=renderProofFrame(inputs,sample.frame);
  files[`frames/frame-${String(sample.frame).padStart(3,'0')}.png`]=await sharp(pixels,{raw:{width:1080,height:1920,channels:4}}).png({compressionLevel:9,adaptiveFiltering:false}).toBuffer();
}
if (stage==='frames') {
  for (const [path,bytes] of Object.entries(files)){mkdirSync(resolve(directory,path,'..'),{recursive:true});writeFileSync(resolve(directory,path),bytes);}
  console.log('Authored mask/source samples generated; no video yet.');process.exit(0);
}
const encode=async(output:string)=>{
  const encoder=spawn(ffmpeg,['-y','-v','error','-f','rawvideo','-pixel_format','rgba','-video_size','1080x1920','-framerate','30','-i','pipe:0','-an','-map_metadata','-1','-c:v','libx264','-preset','medium','-crf','18','-pix_fmt','yuv420p','-threads','1','-fflags','+bitexact','-flags:v','+bitexact','-movflags','+faststart',output],{stdio:['pipe','ignore','pipe']});
  let error='';encoder.stderr.on('data',(b:Buffer)=>error+=b.toString());
  const completion=once(encoder,'close');
  for(let frame=0;frame<proofSize.frames;frame++){
    if(!encoder.stdin.write(renderProofFrame(inputs,frame)))await once(encoder.stdin,'drain');
    if(frame%30===0)console.log(`Rendered ${frame}/${proofSize.frames} controlled frames`);
  }
  encoder.stdin.end();const [code]=await completion;if(code!==0)throw new Error(error||'Proof encoder failed');
};
mkdirSync(directory,{recursive:true});
const moviePath=resolve(directory,'opening-proof.mp4');
if(stage==='generate')await encode(moviePath);
const metadata=spawnSync(ffprobe,['-v','error','-count_frames','-show_streams','-show_format','-of','json',moviePath],{encoding:'utf8'});
if(metadata.status!==0)throw new Error(metadata.stderr);
const media=JSON.parse(metadata.stdout) as {streams:Array<{codec_type:string;codec_name:string;width:number;height:number;r_frame_rate:string;nb_read_frames:string;pix_fmt:string}>;format:{duration:string;size:string;filename?:string}};
delete media.format.filename;
const video=media.streams.find((s)=>s.codec_type==='video');
if(!video||video.width!==1080||video.height!==1920||video.r_frame_rate!=='30/1'||video.codec_name!=='h264'||Number(video.nb_read_frames)!==180||Number(media.format.duration)!==6||media.streams.some((s)=>s.codec_type==='audio'))throw new Error('Motion proof media mismatch');
const decode=spawnSync(ffmpeg,['-v','error','-i',moviePath,'-f','null','-'],{encoding:'utf8'});
if(decode.status!==0)throw new Error('Full decode failed');
files['media-report.json']=Buffer.from(json({passed:true,scope:'Silent six-second local prototype; not production/release QA.',observed:media,fullDecodePassed:true,audio:'Intentionally absent; no complete narration/audio reconstructed.'}));
for (const sample of proofSamples) {
  const decoded=spawnSync(ffmpeg,['-v','error','-i',moviePath,'-vf',`select=eq(n\\,${sample.frame})`,'-frames:v','1','-c:v','mjpeg','-q:v','2','-threads','1','-f','image2pipe','-'],{maxBuffer:10*1024*1024});
  if(decoded.status!==0)throw new Error(decoded.stderr.toString());
  files[`decoded/frame-${String(sample.frame).padStart(3,'0')}.jpg`]=decoded.stdout;
}
const cellW=270,cellH=480,header=64,gap=34,sheetH=header+3*(cellH+gap);
const sheetSvg=`<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="${sheetH}"><rect width="1080" height="${sheetH}" fill="#07111f"/>${outlinedText('OPENING MOTION PROOF / SIX SECONDS / OWNER REVIEW',20,32,19)}${proofSamples.map((sample,i)=>{const x=i%4*cellW,y=header+Math.floor(i/4)*(cellH+gap);return `<image x="${x}" y="${y}" width="270" height="480" href="data:image/jpeg;base64,${files[`decoded/frame-${String(sample.frame).padStart(3,'0')}.jpg`]!.toString('base64')}"/>${outlinedText(`F${sample.frame} / ${(sample.frame/30).toFixed(3)}s`,x+10,y+503,17)}`;}).join('')}</svg>`;
files['contact-sheet.png']=await sharp(Buffer.from(sheetSvg)).png({compressionLevel:9}).toBuffer();
const sourcePaths=['src/motion-proof/continuous-raster.ts','src/motion-proof/millennium-bridge/model.ts','src/motion-proof/millennium-bridge/composition.ts','src/motion-proof/millennium-bridge/approval.ts','src/motion-proof/millennium-bridge/inspection.ts','scripts/bridge-motion-proof.ts'];
const notes=['damping-accuracy.md','motion-design.md','pipeline-assessment.md'];
files['manifest.json']=Buffer.from(json({id:'motion-review.millennium-bridge.opening-proof.v1',revision:1,status:'ready-for-owner-motion-review',startingCommit:'317ea9d1b89f0e6cf6fe2c482c53835516c8b191',approval:{path:bApprovalPath,fileSha256:hash(readFileSync(bApprovalPath)),decisionSha256:sha256Json(decision)},format:proofSize,mp4:{path:'opening-proof.mp4',sha256:hash(readFileSync(moviePath))},sourceAssets:inputs.selected.map(({source})=>({id:source.id,path:`design-reviews/millennium-bridge-exploration-b-v1/${source.path}`,sha256:source.sha256})),sourceImplementation:sourcePaths.map((path)=>({path,sha256:hash(readFileSync(path))})),supportingNotes:notes.map((path)=>({path,sha256:hash(readFileSync(resolve(directory,path)))})),representativeFrames:proofSamples.map((s)=>({...s,timeSeconds:s.frame/30,path:`decoded/frame-${String(s.frame).padStart(3,'0')}.jpg`,sha256:hash(files[`decoded/frame-${String(s.frame).padStart(3,'0')}.jpg`]!),sourceRenderPath:`frames/frame-${String(s.frame).padStart(3,'0')}.png`})),contactSheet:{path:'contact-sheet.png',sha256:hash(files['contact-sheet.png']!),width:1080,height:sheetH},provenance:{newGeneratedAssets:false,independentAIFrames:false,sourceBytesFrozen:true,maskOrigin:'Original hand-authored SVG influence masks rasterized/feathered deterministically; no generative segmentation or inpainting.',motionOrigin:'Authored timing and continuous inverse-UV fields; illustrative, not mocap or measured bridge biomechanics.',renderer:{sharp:sharp.versions,ffmpegBinarySha256:hash(readFileSync(ffmpeg)),ffprobeBinarySha256:hash(readFileSync(ffprobe))},reproducibility:'No clocks, network or randomness in renderer/encoder; exact MP4 identity verified by a second complete encode on recorded stack. Other stacks must verify, not assume byte identity.'},authority:{bArtDirectionApproved:true,motionProofApproved:false,completeVideo:false,lockedMaster:false,finalCaptionPlan:false,metaReconstruction:false,platformActivity:false,publication:false},qa:{mediaPassed:true,localInspection:'local-qa.json recorded independently after inspecting decoded MP4 frames.',limitations:'Continuous image-space deformation is not a recovered 3D scene; occlusion, rotations and pose changes are deliberately small. Macro cross-shot continuity and physical plausibility require owner review.'}}));
files['hashes.json']=Buffer.from(json({algorithm:'SHA-256',files:[...Object.entries(files).map(([path,bytes])=>({path,sha256:hash(bytes)})),{path:'opening-proof.mp4',sha256:hash(readFileSync(moviePath))}]}));
for(const[path,bytes]of Object.entries(files)){
  if(stage==='validate'){if(!readFileSync(resolve(directory,path)).equals(bytes))throw new Error(`Stale motion-review artifact: ${path}`);}
  else{mkdirSync(resolve(directory,path,'..'),{recursive:true});writeFileSync(resolve(directory,path),bytes);}
}
if(stage==='validate')validateMotionInspection(directory);
console.log(`${stage}: six-second motion proof media, sources and hashes passed.`);
