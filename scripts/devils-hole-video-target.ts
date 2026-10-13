import {devilsHole} from '../src/content/videos/devils-hole';
import devilsHoleCaptions from '../src/captions/plans/devils-hole.json';
import devilsHolePlan from '../src/production/plans/devils-hole.json';
export const devilsHoleTarget={spec:devilsHole,entryPoint:'src/devils-hole-index.tsx',output:'artifacts/masters/devils-hole-cycle13-candidate-v1.mp4',qaDirectory:'qa/devils-hole',qaTimestamps:[...new Set([0,.5,1,2,...devilsHolePlan.beats.flatMap(b=>[b.frames.start/30,...[.15,.5,.85].map(p=>(b.frames.start+Math.floor((b.frames.end-b.frames.start)*p))/30),(b.frames.end-1)/30]),...devilsHoleCaptions.cues.map(c=>Math.floor((c.startFrame+c.endFrame)/2)/30)])].sort((a,b)=>a-b)};
