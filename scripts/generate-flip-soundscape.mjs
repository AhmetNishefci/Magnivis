import console from 'node:console';
import {Buffer} from 'node:buffer';
import {existsSync,mkdirSync,readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
const n=JSON.parse(readFileSync('src/production/narration/flip.json','utf8')),path='public/audio/flip/ocean-process.wav';
if(existsSync(path))throw new Error('Preserve sound identity.');
const rate=48000,count=Math.round(n.format.durationSeconds*rate),b=Buffer.alloc(44+count*4);
b.write('RIFF',0);b.writeUInt32LE(b.length-8,4);b.write('WAVE',8);b.write('fmt ',12);b.writeUInt32LE(16,16);b.writeUInt16LE(1,20);b.writeUInt16LE(2,22);b.writeUInt32LE(rate,24);b.writeUInt32LE(rate*4,28);b.writeUInt16LE(4,32);b.writeUInt16LE(16,34);b.write('data',36);b.writeUInt32LE(count*4,40);
let seed=121962,lo=0,prev=0;
const smooth=x=>{const t=Math.max(0,Math.min(1,x));return t*t*(3-2*t);};
const events=[{start:n.cues[3].start+3.1,duration:1.6,kind:'illustrative-water-admission'},{start:n.cues[9].start+2.2,duration:1.6,kind:'illustrative-air-expulsion'}];
for(let i=0;i<count;i++){
 const t=i/rate;seed=(Math.imul(seed,1664525)+1013904223)>>>0;const noise=seed/2147483648-1;
 lo=.96*lo+.04*noise;
 const end=smooth(t/.6)*(1-smooth((t-n.format.durationSeconds+.65)/.65));
 const insight=t>=n.cues[5].start&&t<n.cues[7].start?.35:1;
 let s=lo*(.009+.002*Math.sin(t*.8))*insight;
 for(const e of events){const age=t-e.start;if(age>=0&&age<e.duration){const env=Math.sin(Math.PI*age/e.duration)**2;s+=(e.kind==='illustrative-air-expulsion'?(noise-prev)*.005:lo*.018)*env;}}
 prev=noise;s*=end;
 for(let c=0;c<2;c++)b.writeInt16LE(Math.round(s*(1+(c===0?1:-1)*.035*Math.sin(t*.27))*32767),44+i*4+c*2);
}
mkdirSync('public/audio/flip',{recursive:true});writeFileSync(path,b,{flag:'wx'});
writeFileSync('src/production/narration/flip-soundscape.json',JSON.stringify({schemaVersion:1,file:'audio/flip/ocean-process.wav',sampleRate:rate,channels:2,durationSeconds:n.format.durationSeconds,sha256:createHash('sha256').update(b).digest('hex'),generatorId:'generator.flip-ocean-process.v1',generatorVersion:1,events,method:'Deterministic seeded filtered noise, restrained sea wash and brief illustrative water/air cues, reduced ambience during geometry insight. No music or recorded ship/ocean asset.',rights:'Magnivis original procedural sound',mixIntent:'Very quiet below natural narration; no disaster effects or historical recording implication.'},null,2)+'\n',{flag:'wx'});console.log(path,b.length);
