import {yamaguchiTwoBombs} from '../src/content/videos/yamaguchi-two-bombs';
import captions from '../src/captions/plans/yamaguchi-two-bombs.json';
import plan from '../src/production/plans/yamaguchi-two-bombs.json';
const points=[0,...plan.beats.flatMap(b=>[b.frames.start,Math.floor((b.frames.start+b.frames.end)/2),b.frames.end-1]),...captions.cues.map(c=>Math.floor((c.startFrame+c.endFrame)/2)),...Array.from({length:10},(_,i)=>450+i*7),...Array.from({length:15},(_,i)=>670+i*12),...Array.from({length:10},(_,i)=>1014+i*12)];
export const yamaguchiTarget={spec:yamaguchiTwoBombs,entryPoint:'src/yamaguchi-index.tsx',output:'artifacts/masters/yamaguchi-two-bombs-cycle23-candidate-v1.mp4',qaDirectory:'qa/yamaguchi-two-bombs',qaTimestamps:[...new Set(points.map(f=>Math.floor(f)/30))].sort((a,b)=>a-b)};
