import {Buffer} from 'node:buffer';
import {readFileSync,writeFileSync} from 'node:fs';
const meta=JSON.parse(readFileSync('src/production/narration/voyager.json','utf8')),sr=48000,n=Math.round(meta.format.durationSeconds*sr),b=Buffer.alloc(44+n*4);
b.write('RIFF');b.writeUInt32LE(b.length-8,4);b.write('WAVEfmt ',8);b.writeUInt32LE(16,16);b.writeUInt16LE(1,20);b.writeUInt16LE(2,22);b.writeUInt32LE(sr,24);b.writeUInt32LE(sr*4,28);b.writeUInt16LE(4,32);b.writeUInt16LE(16,34);b.write('data',36);b.writeUInt32LE(n*4,40);
let state=1762026,noise=0;
for(let i=0;i<n;i++){const t=i/sr;state=(Math.imul(state,1664525)+1013904223)>>>0;noise=noise*.995+((state/4294967296)*2-1)*.005;const envelope=Math.min(1,t/1.5,(meta.format.durationSeconds-t)/1.8),mechanism=t>meta.cues[1].start&&t<meta.cues[5].start?.55:1;const base=(Math.sin(t*Math.PI*2*55)*.014+Math.sin(t*Math.PI*2*82.41)*.009+noise*.11)*envelope*mechanism;
const events=[{t:meta.cues[4].start+4.6,hz:330},{t:meta.cues[6].start+.35,hz:440},{t:meta.cues[6].start+.7,hz:554.37},{t:meta.cues[6].start+1.05,hz:659.25}];let cue=0;for(const e of events){const d=t-e.t;if(d>=0&&d<1.4)cue+=Math.sin(d*2*Math.PI*e.hz)*Math.exp(-d*5)*Math.min(1,d/.025)*.07;}
const left=Math.max(-1,Math.min(1,base+cue)),right=Math.max(-1,Math.min(1,base*.96+cue*.9));b.writeInt16LE(Math.round(left*32767),44+i*4);b.writeInt16LE(Math.round(right*32767),46+i*4);}
writeFileSync('public/audio/voyager/soundscape.wav',b,{flag:'wx'});
