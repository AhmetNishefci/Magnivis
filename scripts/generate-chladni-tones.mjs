import {Buffer} from 'node:buffer';
import {readFileSync,mkdirSync,writeFileSync,existsSync} from 'node:fs';
const narration=JSON.parse(readFileSync('src/production/narration/chladni.json','utf8'));
const path='public/audio/chladni/illustrative-tones.wav';
if(existsSync(path))throw new Error('Preserve original synthesized audio.');
const rate=48000,samples=Math.ceil(narration.durationFrames/30*rate),pcm=Buffer.alloc(samples*2);
const modeStart=narration.cues.find(c=>c.beatIndex===5).start;
const events=[{start:.10,duration:1.55,hz:196},{start:modeStart+.15,duration:1.3,hz:294}];
for(let i=0;i<samples;i++){let value=0;const time=i/rate;for(const e of events){const t=time-e.start;if(t>=0&&t<e.duration){const envelope=Math.min(1,t/.08,(e.duration-t)/.16);value+=.035*envelope*Math.sin(2*Math.PI*e.hz*t);}}pcm.writeInt16LE(Math.round(value*32767),i*2);}
const header=Buffer.alloc(44);header.write('RIFF',0);header.writeUInt32LE(36+pcm.length,4);header.write('WAVEfmt ',8);header.writeUInt32LE(16,16);header.writeUInt16LE(1,20);header.writeUInt16LE(1,22);header.writeUInt32LE(rate,24);header.writeUInt32LE(rate*2,28);header.writeUInt16LE(2,32);header.writeUInt16LE(16,34);header.write('data',36);header.writeUInt32LE(pcm.length,40);
mkdirSync('public/audio/chladni',{recursive:true});writeFileSync(path,Buffer.concat([header,pcm]),{flag:'wx'});
writeFileSync('content-intelligence/cycles/cycle-5/tone-provenance.json',JSON.stringify({generatedAt:new Date().toISOString(),path,sampleRate:rate,events,interpretation:'Original illustrative excitation tones only; no hertz-to-pattern or measured plate correspondence.',license:'Project-owned original synthesis; no samples/music.'},null,2)+'\n',{flag:'wx'});
