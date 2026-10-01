import {Buffer} from 'node:buffer';
import console from 'node:console';
import {readFileSync,writeFileSync} from 'node:fs';
const timing=JSON.parse(readFileSync('src/production/narration/phantom-traffic.json','utf8'));
const sr=48000,n=Math.ceil(timing.format.durationSeconds*sr),data=Buffer.alloc(n*4);
let seed=72341,lp=0;const starts=timing.cues.map(c=>c.start);
for(let i=0;i<n;i++){
 const t=i/sr;seed=(Math.imul(seed,1664525)+1013904223)>>>0;const noise=seed/4294967296*2-1;lp=lp*.985+noise*.015;
 let val=lp*.045 + Math.sin(t*2*Math.PI*72)*.003 + Math.sin(t*2*Math.PI*118)*.0015;
 for(const s of starts.slice(1)){const dt=t-s;if(dt>=-.3&&dt<.65)val+=Math.sin(dt*2*Math.PI*(100+35*dt))*.011*Math.exp(-Math.pow(dt/.3,2));}
 const fade=Math.min(1,t/.45,(timing.format.durationSeconds-t)/.8);val*=Math.max(0,fade);
 data.writeInt16LE(Math.round(Math.max(-1,Math.min(1,val))*32767),i*4);data.writeInt16LE(Math.round(Math.max(-1,Math.min(1,val*.97+lp*.002))*32767),i*4+2);
}
const header=Buffer.alloc(44);header.write('RIFF');header.writeUInt32LE(36+data.length,4);header.write('WAVEfmt ',8);header.writeUInt32LE(16,16);header.writeUInt16LE(1,20);header.writeUInt16LE(2,22);header.writeUInt32LE(sr,24);header.writeUInt32LE(sr*4,28);header.writeUInt16LE(4,32);header.writeUInt16LE(16,34);header.write('data',36);header.writeUInt32LE(data.length,40);
writeFileSync('public/audio/phantom-traffic.wav',Buffer.concat([header,data]));console.log('Original deterministic stereo road-texture bed and restrained transition accents generated.');
