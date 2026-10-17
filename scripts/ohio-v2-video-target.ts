import {ohioV2} from '../src/content/videos/ohio-v2';
import captions from '../src/captions/plans/ohio-v2.json';
import plan from '../src/production/plans/ohio-v2.json';
const points=[0,...plan.beats.flatMap(b=>[b.frames.start,(b.frames.start+b.frames.end)/2,b.frames.end-1]),...captions.cues.map(c=>Math.floor((c.startFrame+c.endFrame)/2)),...plan.beats.filter((_,i)=>i>=2&&i<=5).flatMap(b=>[b.frames.start+25,b.frames.start+39,b.frames.start+40,b.frames.start+60,b.frames.start+94,b.frames.start+95,b.frames.start+100,b.frames.start+112,b.frames.start+150].filter(f=>f<b.frames.end))];
export const ohioV2Target={spec:ohioV2,entryPoint:'src/ohio-v2-index.tsx',output:'artifacts/masters/ohio-cycle17-candidate-v2.mp4',qaDirectory:'qa/ohio-v2',qaTimestamps:[...new Set(points.map(f=>Math.floor(f)/30))].sort((a,b)=>a-b)};
