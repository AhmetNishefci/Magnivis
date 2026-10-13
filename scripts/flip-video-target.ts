import {flipLaboratory} from '../src/content/videos/flip';
import flipCaptions from '../src/captions/plans/flip.json';
import flipPlan from '../src/production/plans/flip.json';
export const flipTarget={spec:flipLaboratory,entryPoint:'src/flip-index.tsx',output:'artifacts/masters/flip-cycle12-candidate-v1.mp4',qaDirectory:'qa/flip',qaTimestamps:[...new Set([0,.5,1,2,...flipPlan.beats.flatMap(b=>[b.frames.start/30,...[.15,.5,.85].map(p=>(b.frames.start+Math.floor((b.frames.end-b.frames.start)*p))/30),(b.frames.end-1)/30]),...flipCaptions.cues.map(c=>Math.floor((c.startFrame+c.endFrame)/2)/30)])].sort((a,b)=>a-b)};
