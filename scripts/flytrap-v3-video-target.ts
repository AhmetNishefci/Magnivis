import {flytrapV3} from '../src/content/videos/flytrap-v3';
import captions from '../src/captions/plans/flytrap-v3.json';
import plan from '../src/production/plans/flytrap-v3.json';
const mechanism=plan.beats.flatMap((b,i)=>(i===4?[.2,.95,1.5,2.5,5.4,6.45,6.6,6.75,6.9,7.3]:i===5?[.1,.65,1.4,1.85,2.2,2.7,3.3,3.8,4.4]:i===6?[.85,1.4,2.2,2.7,3.5,4.2,4.65,4.85,5.0,5.2]:[.15,.8,1.5,3]).filter(t=>b.frames.start+t*30<b.frames.end).map(t=>(b.frames.start+Math.round(t*30))/30));
export const flytrapV3Target={spec:flytrapV3,entryPoint:'src/flytrap-v3-index.tsx',output:'artifacts/masters/flytrap-cycle15-candidate-v3.mp4',qaDirectory:'qa/flytrap-v3',qaTimestamps:[...new Set([0,...mechanism,...plan.beats.flatMap(b=>[b.frames.start/30,(b.frames.end-1)/30]),...captions.cues.map(c=>Math.floor((c.startFrame+c.endFrame)/2)/30)])].sort((a,b)=>a-b)};
