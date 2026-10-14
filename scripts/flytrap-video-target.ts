import {flytrap} from '../src/content/videos/flytrap';
import captions from '../src/captions/plans/flytrap.json';
import plan from '../src/production/plans/flytrap.json';
const mechanism=plan.beats.flatMap((b,i)=>(i===4?[.2,.85,1.5,2.5,5.4,6.05,6.35,7.3]:i===5?[.1,.65,1.4,1.85,2.2,2.7,3.3,3.8,4.4]:i===6?[.85,1.5,2.2,2.75,3.55,4.2,4.65]:[.15,.8,1.5,3]).filter(t=>b.frames.start+t*30<b.frames.end).map(t=>(b.frames.start+Math.round(t*30))/30));
export const flytrapTarget={spec:flytrap,entryPoint:'src/flytrap-index.tsx',output:'artifacts/masters/flytrap-cycle15-candidate-v1.mp4',qaDirectory:'qa/flytrap',qaTimestamps:[...new Set([0,...mechanism,...plan.beats.flatMap(b=>[b.frames.start/30,(b.frames.end-1)/30]),...captions.cues.map(c=>Math.floor((c.startFrame+c.endFrame)/2)/30)])].sort((a,b)=>a-b)};
