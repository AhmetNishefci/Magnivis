import {renderMatchedComparison} from './lib/decoded-comparison';
import {createRequire} from 'node:module';
import {spawnSync} from 'node:child_process';
import {mkdirSync,writeFileSync} from 'node:fs';
import {mediaHash} from '../src/artifacts/media';
import {anglerfishFusionV2Target as target} from './anglerfish-v2-video-target';
import captions from '../src/captions/plans/anglerfish-fusion-v2.json';
import plan from '../src/production/plans/anglerfish-fusion-v2.json';
const ffmpeg=createRequire(import.meta.url)('ffmpeg-static') as string,base='qa/anglerfish-fusion-v2';mkdirSync(base,{recursive:true});
const sheet=(name:string,frames:number[],columns:number,width:number)=>{const selection=frames.map(f=>`eq(n\\,${f})`).join('+'),rows=Math.ceil(frames.length/columns),r=spawnSync(ffmpeg,['-y','-v','error','-i',target.output,'-vf',`select=${selection},setpts=N/FRAME_RATE/TB,scale=${width}:${Math.round(width*1920/1080)},tile=${columns}x${rows}:nb_frames=${frames.length}:padding=6:margin=6:color=0x102C3B`,'-frames:v','1','-q:v','2',`${base}/${name}.jpg`],{encoding:'utf8'});if(r.status!==0)throw new Error(r.stderr);return {path:`${base}/${name}.jpg`,sha256:mediaHash(`${base}/${name}.jpg`),frames};};
const midpoints=captions.cues.map(c=>Math.floor((c.startFrame+c.endFrame)/2)),captionSheets=[];
for(let i=0;i<midpoints.length;i+=12)captionSheets.push(sheet(`captions-${i/12+1}`,midpoints.slice(i,i+12),3,270));
const overview=sheet('scene-overview',plan.beats.map(b=>b.frames.start+Math.floor((b.frames.end-b.frames.start)*.5)),4,270);
const motion=sheet('motion-progression',[0,3,4,5,6,10].flatMap(i=>[.15,.45,.7,.95].map(p=>plan.beats[i]!.frames.start+Math.floor((plan.beats[i]!.frames.end-plan.beats[i]!.frames.start)*p))).sort((a,b)=>a-b),4,270);
const sequenceFrames=Array.from({length:Math.ceil(plan.format.durationSeconds)},(_,i)=>Math.min(i*30,Math.round(plan.format.durationSeconds*30)-1)),chronological=[];
for(let i=0;i<sequenceFrames.length;i+=16)chronological.push(sheet(`sequence-${i/16+1}`,sequenceFrames.slice(i,i+16),4,270));
const phone=sheet('phone-readability',[30,...[1,2,3,4,5,6,7,8,9,10].map(i=>plan.beats[i]!.frames.start+Math.floor((plan.beats[i]!.frames.end-plan.beats[i]!.frames.start)*.65))],3,360);
writeFileSync(`${base}/sheet-bindings.json`,JSON.stringify({enteredAt:new Date().toISOString(),masterSha256:mediaHash(target.output),method:'All images decoded from exact mastered MP4; every caption midpoint, chronological1s samples, selected mechanism progressions and360px phone simulation. No continuous watching/listening or actual mobile/native evidence.',captionSheets,sceneOverview:overview,motionProgression:motion,chronologicalSequence:chronological,phoneScale:phone},null,2)+'\n');
console.log('Decoded QA sheets prepared.');

// Timestamp-matched decoded views: V1 left, V2 right; bindings include exact frames.
const comparisons=[30,65,150,205,330,420,478,510,548,580,650,750,880,950,1200,1380];
const beforeAfter=[];
for(let page=0;page<4;page++)beforeAfter.push(renderMatchedComparison({before:'artifacts/masters/anglerfish-fusion-cycle22-candidate-v1.mp4',after:target.output,frames:comparisons.slice(page*4,page*4+4),fps:30,output:`${base}/before-after-${page+1}.jpg`,width:360}));
writeFileSync(`${base}/comparison-bindings.json`,JSON.stringify({masterSha256:mediaHash(target.output),v1Sha256:mediaHash('artifacts/masters/anglerfish-fusion-cycle22-candidate-v1.mp4'),beforeAfter},null,2)+'\n');
