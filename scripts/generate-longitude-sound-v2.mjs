import {Buffer} from 'node:buffer';
import {readFileSync,writeFileSync,existsSync} from 'node:fs';
import {createHash} from 'node:crypto';
if(existsSync('artifacts/masters/longitude-clock-candidate-v2.mp4'))throw new Error('Preserve retained candidate sound.');
const meta=JSON.parse(readFileSync('src/production/narration/longitude-clock-v2.json','utf8'));
const sampleRate=24000,count=Math.round(meta.format.durationSeconds*sampleRate),data=Buffer.alloc(44+count*2);
data.write('RIFF');data.writeUInt32LE(data.length-8,4);data.write('WAVEfmt ',8);data.writeUInt32LE(16,16);data.writeUInt16LE(1,20);data.writeUInt16LE(1,22);data.writeUInt32LE(sampleRate,24);data.writeUInt32LE(sampleRate*2,28);data.writeUInt16LE(2,32);data.writeUInt16LE(16,34);data.write('data',36);data.writeUInt32LE(count*2,40);
let seed=2048,filtered=0;
const taps=[0.18,meta.cues[1].start-0.1,meta.cues[7].start-0.1];
for(let i=0;i<count;i++){
 const t=i/sampleRate;seed=(1664525*seed+1013904223)>>>0;const noise=seed/4294967296*2-1;filtered+=0.025*(noise-filtered);
 const atmosphere=t<meta.cues[2].start?Math.min(1,t/0.8)*0.04:t>meta.cues[9].start?Math.min(1,(t-meta.cues[9].start)/0.6)*Math.min(1,(meta.format.durationSeconds-t)/0.7)*0.025:0;
 let sound=filtered*atmosphere;
 for(const tap of taps){const age=t-tap;if(age>=0&&age<0.025)sound+=noise*0.022*Math.exp(-age*170);}
 data.writeInt16LE(Math.round(Math.max(-1,Math.min(1,sound))*32767),44+i*2);
}
const path='public/audio/longitude-clock/v2/soundscape.wav';writeFileSync(path,data);
writeFileSync('src/production/narration/longitude-clock-v2-soundscape.json',JSON.stringify({generatorId:'audio-generator.longitude-clock.v1',generatorVersion:1,sha256:createHash('sha256').update(data).digest('hex'),path,method:'Seeded low-pass ocean texture and three original dry noise taps. No music; explicit silence through solar correction/comparison/numerical proof.',sampleRate,durationSeconds:count/sampleRate,seed:2048},null,2)+'\n');
