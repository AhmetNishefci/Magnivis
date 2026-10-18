import {createRequire} from 'node:module';
import {spawnSync} from 'node:child_process';
import {mkdirSync,writeFileSync} from 'node:fs';
import {mediaHash} from '../src/artifacts/media';
import {selfTickleV2Target as target} from './tickle-v2-video-target';
import captions from '../src/captions/plans/self-tickle-v2.json';
import plan from '../src/production/plans/self-tickle-v2.json';
const ffmpeg=createRequire(import.meta.url)('ffmpeg-static') as string,base='qa/self-tickle-v2';mkdirSync(base,{recursive:true});
const sheet=(name:string,frames:number[],columns:number,width:number)=>{const selection=frames.map(f=>`eq(n\\,${f})`).join('+'),rows=Math.ceil(frames.length/columns),r=spawnSync(ffmpeg,['-y','-v','error','-i',target.output,'-vf',`select=${selection},setpts=N/FRAME_RATE/TB,scale=${width}:${Math.round(width*1920/1080)},tile=${columns}x${rows}:nb_frames=${frames.length}:padding=6:margin=6:color=0x102C3B`,'-frames:v','1','-q:v','2',`${base}/${name}.jpg`],{encoding:'utf8'});if(r.status!==0)throw new Error(r.stderr);return {path:`${base}/${name}.jpg`,sha256:mediaHash(`${base}/${name}.jpg`),frames};};
const midpoints=captions.cues.map(c=>Math.floor((c.startFrame+c.endFrame)/2)),captionSheets=[];
for(let i=0;i<midpoints.length;i+=12)captionSheets.push(sheet(`captions-${i/12+1}`,midpoints.slice(i,i+12),3,270));
const overview=sheet('scene-overview',plan.beats.map(b=>b.frames.start+Math.floor((b.frames.end-b.frames.start)*.5)),4,270);
const motion=sheet('motion-progression',[1,2,3,4,5,6].flatMap(i=>[.15,.45,.7,.95].map(p=>plan.beats[i]!.frames.start+Math.floor((plan.beats[i]!.frames.end-plan.beats[i]!.frames.start)*p))).sort((a,b)=>a-b),4,270);
const sequenceFrames=Array.from({length:Math.ceil(plan.format.durationSeconds)},(_,i)=>Math.min(i*30,Math.round(plan.format.durationSeconds*30)-1)),chronological=[];
for(let i=0;i<sequenceFrames.length;i+=16)chronological.push(sheet(`sequence-${i/16+1}`,sequenceFrames.slice(i,i+16),4,270));
const phone=sheet('phone-readability',[30,...[1,2,3,4,5,6,7,8,9].map(i=>plan.beats[i]!.frames.start+Math.floor((plan.beats[i]!.frames.end-plan.beats[i]!.frames.start)*.65))],3,360);
writeFileSync(`${base}/sheet-bindings.json`,JSON.stringify({enteredAt:new Date().toISOString(),masterSha256:mediaHash(target.output),method:'All images decoded from exact mastered MP4; every caption midpoint, chronological1s samples, selected mechanism progressions and360px phone simulation. No continuous watching/listening or actual mobile/native evidence.',captionSheets,sceneOverview:overview,motionProgression:motion,chronologicalSequence:chronological,phoneScale:phone},null,2)+'\n');
console.log('Decoded QA sheets prepared.');

// Two columns per selected timestamp: exact V1 left, exact V2 right.
const comparisons=[35,80,270,320,430,740,800,1380,1430];
const beforeAfter=[];
for(let page=0;page<3;page++){const frames=comparisons.slice(page*3,page*3+3),selection=frames.map(f=>`eq(n\\,${f})`).join('+'),name=`before-after-${page+1}.jpg`;const args=['-y','-v','error','-i','artifacts/masters/self-tickle-cycle20-candidate-v1.mp4','-i',target.output,'-filter_complex',`[0:v]select=${selection},setpts=N/FRAME_RATE/TB,scale=360:640[a];[1:v]select=${selection},setpts=N/FRAME_RATE/TB,scale=360:640[b];[a][b]hstack,tile=1x3:nb_frames=3:padding=6:margin=6:color=0x142127`,'-frames:v','1','-q:v','2',`${base}/${name}`];const result=spawnSync(ffmpeg,args,{encoding:'utf8'});if(result.status!==0)throw Error(result.stderr);beforeAfter.push({path:`${base}/${name}`,sha256:mediaHash(`${base}/${name}`),frames,columnOrder:['V1','V2']});}
writeFileSync(`${base}/comparison-bindings.json`,JSON.stringify({masterSha256:mediaHash(target.output),v1Sha256:mediaHash('artifacts/masters/self-tickle-cycle20-candidate-v1.mp4'),beforeAfter},null,2)+'\n');
