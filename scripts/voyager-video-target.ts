import {voyager} from '../src/content/videos/voyager';
import captions from '../src/captions/plans/voyager.json';
import plan from '../src/production/plans/voyager.json';
const points=[0,...plan.beats.flatMap(b=>[b.frames.start,(b.frames.start+b.frames.end)/2,b.frames.end-1]),...captions.cues.map(c=>Math.floor((c.startFrame+c.endFrame)/2)),...plan.beats.filter((_,i)=>i>=2&&i<=4).flatMap(b=>[b.frames.start+25,b.frames.start+60,b.frames.start+100,b.frames.start+150].filter(f=>f<b.frames.end))];
export const voyagerTarget={spec:voyager,entryPoint:'src/voyager-index.tsx',output:'artifacts/masters/voyager-cycle16-candidate-v1.mp4',qaDirectory:'qa/voyager',qaTimestamps:[...new Set(points.map(f=>Math.floor(f)/30))].sort((a,b)=>a-b)};
