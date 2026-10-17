import {roadster} from '../src/content/videos/roadster';
import captions from '../src/captions/plans/roadster.json';
import plan from '../src/production/plans/roadster.json';
const points=[0,...plan.beats.flatMap(b=>[b.frames.start,(b.frames.start+b.frames.end)/2,b.frames.end-1]),...captions.cues.map(c=>Math.floor((c.startFrame+c.endFrame)/2)),...plan.beats.filter((_,i)=>i>=2&&i<=5).flatMap(b=>[b.frames.start+25,b.frames.start+39,b.frames.start+40,b.frames.start+60,b.frames.start+94,b.frames.start+95,b.frames.start+100,b.frames.start+112,b.frames.start+150].filter(f=>f<b.frames.end))];
export const roadsterTarget={spec:roadster,entryPoint:'src/roadster-index.tsx',output:'artifacts/masters/roadster-cycle18-candidate-v1.mp4',qaDirectory:'qa/roadster',qaTimestamps:[...new Set(points.map(f=>Math.floor(f)/30))].sort((a,b)=>a-b)};
