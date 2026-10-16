import {voyagerV2} from '../src/content/videos/voyager-v2';
import captions from '../src/captions/plans/voyager-v2.json';
import plan from '../src/production/plans/voyager-v2.json';
const points=[0,1142,1143,1144,1216,1345,...plan.beats.flatMap(b=>[b.frames.start,b.frames.start+1,(b.frames.start+b.frames.end)/2,b.frames.end-1]),...captions.cues.map(c=>Math.floor((c.startFrame+c.endFrame)/2)),...Array.from({length:134},(_,i)=>i*10).filter(f=>f<402||(f>=402&&f<=829)||(f>=1130&&f<=1160))];
export const voyagerV2Target={spec:voyagerV2,entryPoint:'src/voyager-v2-index.tsx',output:'artifacts/masters/voyager-cycle16-candidate-v2.mp4',qaDirectory:'qa/voyager-v2',qaTimestamps:[...new Set(points.map(f=>Math.floor(f)/30))].sort((a,b)=>a-b)};
