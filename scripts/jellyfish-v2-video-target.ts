import {jellyfishReversalV2} from '../src/content/videos/jellyfish-reversal-v2';
import captions from '../src/captions/plans/jellyfish-reversal-v2.json';
import plan from '../src/production/plans/jellyfish-reversal-v2.json';
const points=[0,...plan.beats.flatMap(b=>[b.frames.start,(b.frames.start+b.frames.end)/2,b.frames.end-1]),...captions.cues.map(c=>Math.floor((c.startFrame+c.endFrame)/2)),...plan.beats.filter((_,i)=>[0,2,3,4,5,6,10].includes(i)).flatMap(b=>[b.frames.start+25,b.frames.start+39,b.frames.start+40,b.frames.start+60,b.frames.start+94,b.frames.start+95,b.frames.start+100,b.frames.start+112,b.frames.start+150].filter(f=>f<b.frames.end))];
export const jellyfishReversalV2Target={spec:jellyfishReversalV2,entryPoint:'src/jellyfish-v2-index.tsx',output:'artifacts/masters/jellyfish-reversal-cycle21-candidate-v2.mp4',qaDirectory:'qa/jellyfish-reversal-v2',qaTimestamps:[...new Set(points.map(f=>Math.floor(f)/30))].sort((a,b)=>a-b)};
