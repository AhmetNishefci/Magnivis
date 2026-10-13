import {diceLaboratory} from '../src/content/videos/dice';
import diceCaptions from '../src/captions/plans/dice.json';
import dicePlan from '../src/production/plans/dice.json';
export const diceTarget={spec:diceLaboratory,entryPoint:'src/dice-index.tsx',output:'artifacts/masters/dice-cycle14-candidate-v3.mp4',qaDirectory:'qa/dice-v3',qaTimestamps:[...new Set([0,.5,1,2,...dicePlan.beats.flatMap(b=>[b.frames.start/30,...[.15,.5,.85].map(p=>(b.frames.start+Math.floor((b.frames.end-b.frames.start)*p))/30),(b.frames.end-1)/30]),...diceCaptions.cues.map(c=>Math.floor((c.startFrame+c.endFrame)/2)/30)])].sort((a,b)=>a-b)};
