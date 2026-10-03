import {Buffer} from 'node:buffer';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
const meta=JSON.parse(readFileSync('src/production/narration/tally.json','utf8'));
const rate=48000,count=Math.ceil(meta.format.durationSeconds*rate),bytes=Buffer.alloc(44+count*4);
bytes.write('RIFF');bytes.writeUInt32LE(bytes.length-8,4);bytes.write('WAVE',8);bytes.write('fmt ',12);bytes.writeUInt32LE(16,16);bytes.writeUInt16LE(1,20);bytes.writeUInt16LE(2,22);bytes.writeUInt32LE(rate,24);bytes.writeUInt32LE(rate*4,28);bytes.writeUInt16LE(4,32);bytes.writeUInt16LE(16,34);bytes.write('data',36);bytes.writeUInt32LE(count*4,40);
const start=meta.cues.find(c=>c.beatIndex===4).start,end=meta.cues.find(c=>c.beatIndex===7).start;
for(let i=0;i<count;i++){const t=i/rate;const envelope=t>=start&&t<end?Math.min(1,(t-start)/.5,(end-t)/.6):0;const rumble=.011*envelope*(Math.sin(t*2*Math.PI*73)+.4*Math.sin(t*2*Math.PI*109));const tick=[meta.cues[3].start,meta.cues[6].start].reduce((s,x)=>{const d=t-x;return s+(d>=0&&d<.09?.018*Math.exp(-d*60)*Math.sin(d*2*Math.PI*1300):0);},0);const v=Math.round(Math.max(-1,Math.min(1,rumble+tick))*32767);bytes.writeInt16LE(v,44+i*4);bytes.writeInt16LE(v,46+i*4);}
mkdirSync('public/audio/tally',{recursive:true});writeFileSync('public/audio/tally/illustrative-sound.wav',bytes,{flag:'wx'});
writeFileSync('content-intelligence/cycles/cycle-6/sound-provenance.json',JSON.stringify({method:'Original deterministic sinusoids with time envelopes; no sampled audio/music.',sampleRate:rate,channels:2,purpose:'Sparse fictional furnace rumble/wood ticks; not historical sound evidence.'},null,2)+'\n',{flag:'wx'});
