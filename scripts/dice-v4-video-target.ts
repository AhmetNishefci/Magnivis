import {diceV4} from '../src/content/videos/dice-v4';
import captions from '../src/captions/plans/dice-v4.json';
import plan from '../src/production/plans/dice-v4.json';
const mechanisms=plan.beats.flatMap((b,i)=>(i===4||i===5?[.15,.7,1.2,2.6,3.45,3.7,4.5,5.9,6.4,7.2]:i===0?[0,.35,.85,1.25,2.0,2.65,3.0]:[.15,.45,.85,1.3]).filter(t=>b.frames.start+Math.round(t*30)<b.frames.end).map(t=>(b.frames.start+Math.round(t*30))/30));
export const diceV4Target={spec:diceV4,entryPoint:'src/dice-v4-index.tsx',output:'artifacts/masters/dice-cycle14-candidate-v4.mp4',qaDirectory:'qa/dice-v4',qaTimestamps:[...new Set([0,...mechanisms,...plan.beats.flatMap(b=>[b.frames.start/30,...[.15,.5,.85].map(p=>(b.frames.start+Math.floor((b.frames.end-b.frames.start)*p))/30),(b.frames.end-1)/30]),...captions.cues.map(c=>Math.floor((c.startFrame+c.endFrame)/2)/30)])].sort((a,b)=>a-b)};
