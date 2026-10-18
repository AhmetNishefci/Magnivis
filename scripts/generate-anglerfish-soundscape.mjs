import {Buffer} from 'node:buffer';
import {readFileSync,writeFileSync} from 'node:fs';
const meta=JSON.parse(readFileSync('src/production/narration/anglerfish-fusion.json','utf8')),rate=48000,count=Math.round(meta.format.durationSeconds*rate),buffer=Buffer.alloc(44+count*4);
buffer.write('RIFF');buffer.writeUInt32LE(36+count*4,4);buffer.write('WAVE',8);buffer.write('fmt ',12);buffer.writeUInt32LE(16,16);buffer.writeUInt16LE(1,20);buffer.writeUInt16LE(2,22);buffer.writeUInt32LE(rate,24);buffer.writeUInt32LE(rate*4,28);buffer.writeUInt16LE(4,32);buffer.writeUInt16LE(16,34);buffer.write('data',36);buffer.writeUInt32LE(count*4,40);
let seed=20261022,low=0,slow=0;
for(let i=0;i<count;i++){
 const t=i/rate;seed=(1664525*seed+1013904223)>>>0;const noise=seed/2147483648-1;low=low*.997+noise*.003;slow=slow*.9997+noise*.0003;
 const fade=Math.max(0,Math.min(1,t/1.2,(meta.format.durationSeconds-t)/1.1));
 // Sparse deep-water ambience, no claim of real recorded habitat or biological sound.
 let value=low*.17+slow*.2+Math.sin(t*Math.PI*2*48.99)*.002;
 const approach=t-meta.cues[3].start;if(approach>0&&approach<2)value+=low*.09*Math.sin(approach/2*Math.PI);
 for(const idx of [4,5,10]){const d=t-meta.cues[idx].start;if(d>0){const env=Math.exp(-d/2.1)*Math.min(1,d/.7);value+=(Math.sin(2*Math.PI*146.83*d)*.004+Math.sin(2*Math.PI*220*d)*.003)*env;}}
 for(let ch=0;ch<2;ch++)buffer.writeInt16LE(Math.round(Math.max(-1,Math.min(1,value*fade*(ch?.96:1)))*32767),44+i*4+ch*2);
}
writeFileSync('public/audio/anglerfish-fusion/soundscape.wav',buffer,{flag:'wx'});
