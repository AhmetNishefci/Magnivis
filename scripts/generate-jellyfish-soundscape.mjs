import {Buffer} from 'node:buffer';
import {readFileSync,writeFileSync} from 'node:fs';
const meta=JSON.parse(readFileSync('src/production/narration/jellyfish-reversal.json','utf8')),rate=48000,count=Math.round(meta.format.durationSeconds*rate),buffer=Buffer.alloc(44+count*4);
buffer.write('RIFF');buffer.writeUInt32LE(36+count*4,4);buffer.write('WAVE',8);buffer.write('fmt ',12);buffer.writeUInt32LE(16,16);buffer.writeUInt16LE(1,20);buffer.writeUInt16LE(2,22);buffer.writeUInt32LE(rate,24);buffer.writeUInt32LE(rate*4,28);buffer.writeUInt16LE(4,32);buffer.writeUInt16LE(16,34);buffer.write('data',36);buffer.writeUInt32LE(count*4,40);
let seed=20261021,low=0;
for(let i=0;i<count;i++){
 const t=i/rate;seed=(1664525*seed+1013904223)>>>0;const noise=seed/2147483648-1;low=low*.998+noise*.002;
 const fade=Math.max(0,Math.min(1,t/1.5,(meta.format.durationSeconds-t)/1.4)),collapse=1-.75*Math.exp(-(((t-meta.cues[4].start-2)/3)**2));
 const air=low*.23+Math.sin(t*Math.PI*2*43.65)*.004;
 let bloom=0;for(const idx of [5,6,10]){const d=t-meta.cues[idx].start;if(d>0){const envelope=Math.exp(-d/2.6)*Math.min(1,d/.4);bloom+=(Math.sin(2*Math.PI*174.61*d)*.009+Math.sin(2*Math.PI*261.63*d)*.005+Math.sin(2*Math.PI*349.23*d)*.003)*envelope;}}
 for(let ch=0;ch<2;ch++){const value=(air*collapse+bloom)*fade*(ch?.97:1);buffer.writeInt16LE(Math.round(Math.max(-1,Math.min(1,value))*32767),44+i*4+ch*2);}
}
writeFileSync('public/audio/jellyfish-reversal/soundscape.wav',buffer,{flag:'wx'});
