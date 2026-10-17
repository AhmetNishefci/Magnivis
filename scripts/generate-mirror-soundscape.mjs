import {Buffer} from 'node:buffer';
import {readFileSync,writeFileSync} from 'node:fs';
const meta=JSON.parse(readFileSync('src/production/narration/mirror-eyes.json','utf8')),rate=48000,count=Math.round(meta.format.durationSeconds*rate),buffer=Buffer.alloc(44+count*4);
buffer.write('RIFF');buffer.writeUInt32LE(36+count*4,4);buffer.write('WAVE',8);buffer.write('fmt ',12);buffer.writeUInt32LE(16,16);buffer.writeUInt16LE(1,20);buffer.writeUInt16LE(2,22);buffer.writeUInt32LE(rate,24);buffer.writeUInt32LE(rate*4,28);buffer.writeUInt16LE(4,32);buffer.writeUInt16LE(16,34);buffer.write('data',36);buffer.writeUInt32LE(count*4,40);
let seed=20261019,low=0;
for(let i=0;i<count;i++){
 const t=i/rate;seed=(1664525*seed+1013904223)>>>0;const noise=seed/2147483648-1;low=low*.995+noise*.005;
 const fade=Math.max(0,Math.min(1,t/1.2,(meta.format.durationSeconds-t)/1.4));
 const room=low*.08+.002*Math.sin(t*Math.PI*2*58);
 let accents=0;
 for(const index of [1,8]){const d=t-meta.cues[index].start-.35;if(d>=0&&d<.3)accents+=Math.exp(-d*30)*(Math.sin(2*Math.PI*440*d)*.1+noise*.04);}
 const d=t-meta.cues[4].start;const air=d>=0&&d<.8?noise*.016*Math.sin(Math.PI*d/.8):0;
 const value=(room+accents+air)*fade;
 for(let ch=0;ch<2;ch++)buffer.writeInt16LE(Math.round(Math.max(-1,Math.min(1,value*(ch?.97:1)))*32767),44+i*4+ch*2);
}
writeFileSync('public/audio/mirror-eyes/soundscape.wav',buffer,{flag:'wx'});
