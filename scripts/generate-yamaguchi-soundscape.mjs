import {Buffer} from 'node:buffer';
import {readFileSync,writeFileSync} from 'node:fs';
const meta=JSON.parse(readFileSync('src/production/narration/yamaguchi-two-bombs.json','utf8')),rate=48000,count=Math.round(meta.format.durationSeconds*rate),buffer=Buffer.alloc(44+count*4);
buffer.write('RIFF');buffer.writeUInt32LE(36+count*4,4);buffer.write('WAVE',8);buffer.write('fmt ',12);buffer.writeUInt32LE(16,16);buffer.writeUInt16LE(1,20);buffer.writeUInt16LE(2,22);buffer.writeUInt32LE(rate,24);buffer.writeUInt32LE(rate*4,28);buffer.writeUInt16LE(4,32);buffer.writeUInt16LE(16,34);buffer.write('data',36);buffer.writeUInt32LE(count*4,40);
let seed=19450806,low=0,slow=0;
for(let i=0;i<count;i++){
 const t=i/rate;seed=(1664525*seed+1013904223)>>>0;const noise=seed/2147483648-1;low=low*.994+noise*.006;slow=slow*.9995+noise*.0005;
 const fade=Math.max(0,Math.min(1,t/1.2,(meta.format.durationSeconds-t)/1.2));
 let value=low*.1+slow*.15;
 // Quiet illustrative rail rhythm during the travel passage; no actual field recording.
 if(t>23.3&&t<27.5){const d=t-23.3,env=Math.min(1,d/.6,(27.5-t)/.6),pulse=Math.pow(Math.max(0,Math.sin(d*2*Math.PI*2.3)),18);value+=(low*.16+pulse*.011)*env;}
 // Briefly withdraw the ambience around the light events. No blast or impact effects.
 for(const event of [16.2,34.4])value*=1-.8*Math.exp(-Math.pow((t-event)/.7,2));
 for(let ch=0;ch<2;ch++)buffer.writeInt16LE(Math.round(Math.max(-1,Math.min(1,value*fade*(ch?.97:1)))*32767),44+i*4+ch*2);
}
writeFileSync('public/audio/yamaguchi-two-bombs/soundscape.wav',buffer,{flag:'wx'});
