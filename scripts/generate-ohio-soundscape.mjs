import {Buffer} from 'node:buffer';
import {readFileSync,writeFileSync} from 'node:fs';
const meta=JSON.parse(readFileSync('src/production/narration/ohio.json','utf8')),rate=48000,count=Math.round(meta.format.durationSeconds*rate),buffer=Buffer.alloc(44+count*4);
buffer.write('RIFF');buffer.writeUInt32LE(36+count*4,4);buffer.write('WAVE',8);buffer.write('fmt ',12);buffer.writeUInt32LE(16,16);buffer.writeUInt16LE(1,20);buffer.writeUInt16LE(2,22);buffer.writeUInt32LE(rate,24);buffer.writeUInt32LE(rate*4,28);buffer.writeUInt16LE(4,32);buffer.writeUInt16LE(16,34);buffer.write('data',36);buffer.writeUInt32LE(count*4,40);
let seed=19420815,low=0;
for(let i=0;i<count;i++){
 const t=i/rate;seed=(1664525*seed+1013904223)>>>0;low=low*.994+(seed/2147483648-1)*.006;
 const fade=Math.min(1,t/1.5,(meta.format.durationSeconds-t)/1.6),release=t<meta.cues[6].start?1:.55;
 const sea=low*.7*(.65+.2*Math.sin(t*.7)),tone=.018*Math.sin(t*Math.PI*2*65.4)+.009*Math.sin(t*Math.PI*2*98);
 const value=(sea+tone)*fade*release;
 for(let ch=0;ch<2;ch++)buffer.writeInt16LE(Math.round(Math.max(-1,Math.min(1,value*(ch? .96:1)))*32767),44+i*4+ch*2);
}
writeFileSync('public/audio/ohio/soundscape.wav',buffer,{flag:'wx'});
