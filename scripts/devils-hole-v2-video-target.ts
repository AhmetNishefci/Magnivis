import {devilsHoleV2} from '../src/content/videos/devils-hole-v2';
import devilsHoleV2Captions from '../src/captions/plans/devils-hole-v2.json';
import devilsHoleV2Plan from '../src/production/plans/devils-hole-v2.json';
export const devilsHoleV2Target={spec:devilsHoleV2,entryPoint:'src/devils-hole-v2-index.tsx',output:'artifacts/masters/devils-hole-cycle13-candidate-v2.mp4',qaDirectory:'qa/devils-hole-v2',qaTimestamps:[...new Set([0,.5,1,2,50.4,50.6,...devilsHoleV2Plan.beats.flatMap(b=>[b.frames.start/30,...[.15,.5,.85].map(p=>(b.frames.start+Math.floor((b.frames.end-b.frames.start)*p))/30),(b.frames.end-1)/30]),...devilsHoleV2Captions.cues.map(c=>Math.floor((c.startFrame+c.endFrame)/2)/30)])].sort((a,b)=>a-b)};
