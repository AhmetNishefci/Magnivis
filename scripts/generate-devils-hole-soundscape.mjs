import console from 'node:console';
import {Buffer} from 'node:buffer';
import {existsSync,mkdirSync,readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
const n=JSON.parse(readFileSync('src/production/narration/devils-hole.json','utf8')),path='public/audio/devils-hole/local-water.wav';
if(existsSync(path))throw new Error('Preserve sound identity.');
const rate=48000,count=Math.round(n.format.durationSeconds*rate),b=Buffer.alloc(44+count*4);
b.write('RIFF',0);b.writeUInt32LE(b.length-8,4);b.write('WAVE',8);b.write('fmt ',12);b.writeUInt32LE(16,16);b.writeUInt16LE(1,20);b.writeUInt16LE(2,22);b.writeUInt32LE(rate,24);b.writeUInt32LE(rate*4,28);b.writeUInt16LE(4,32);b.writeUInt16LE(16,34);b.write('data',36);b.writeUInt32LE(count*4,40);
let seed=132025,lo=0;
const smooth=x=>{const t=Math.max(0,Math.min(1,x));return t*t*(3-2*t);};
const events=[{start:.12,duration:.8,kind:'connection-cue'},{start:n.cues[5].start+.4,duration:2,kind:'local-water'},{start:n.cues[9].start+.5,duration:1.4,kind:'local-water'}];
for(let i=0;i<count;i++){
 const t=i/rate;seed=(Math.imul(seed,1664525)+1013904223)>>>0;const noise=seed/2147483648-1;
 lo=.96*lo+.04*noise;
 const end=smooth(t/.6)*(1-smooth((t-n.format.durationSeconds+.65)/.65));
 const insight=t>=n.cues[5].start&&t<n.cues[7].start?.35:1;
 let s=lo*(.004+.001*Math.sin(t*2.2))*insight; 
 for(const e of events){const age=t-e.start;if(age>=0&&age<e.duration){const env=Math.sin(Math.PI*age/e.duration)**2;s+=(e.kind==='connection-cue'?Math.sin(2*Math.PI*(350-age*80)*t)*.006:lo*.016)*env;}}
 s*=end;
 for(let c=0;c<2;c++)b.writeInt16LE(Math.round(s*(1+(c===0?1:-1)*.035*Math.sin(t*.27))*32767),44+i*4+c*2);
}
mkdirSync('public/audio/devils-hole',{recursive:true});writeFileSync(path,b,{flag:'wx'});
writeFileSync('src/production/narration/devils-hole-soundscape.json',JSON.stringify({schemaVersion:1,file:'audio/devils-hole/local-water.wav',sampleRate:rate,channels:2,durationSeconds:n.format.durationSeconds,sha256:createHash('sha256').update(b).digest('hex'),generatorId:'generator.devils-hole-local-water.v1',generatorVersion:1,events,method:'Deterministic filtered noise for restrained local-water movement, one quiet connection cue. No music, earthquake recording, archival sound or disaster rumble.',rights:'Magnivis original procedural sound',mixIntent:'Sparse quiet illustrative sound below narration; no implication of audible Nevada shaking or historical recordings.'},null,2)+'\n',{flag:'wx'});console.log(path,b.length);
