import {resolveVideoTarget as resolveHistoricalTarget} from './video-targets';
import {longitudeClock} from '../src/content/videos/longitude-clock';
import captions from '../src/captions/plans/longitude-clock.json';
import plan from '../src/production/plans/longitude-clock.json';
export const longitudeTarget={spec:longitudeClock,entryPoint:'src/longitude-index.tsx',output:'output/longitude-clock-narrated.mp4',qaDirectory:'qa/longitude-clock-narrated',qaTimestamps:[...new Set([0,0.5,...plan.beats.flatMap(b=>[b.frames.start/30+0.1,(b.frames.start+b.frames.end)/60,(b.frames.end-1)/30]),...captions.cues.map(c=>(c.startFrame+c.endFrame)/60)])].sort((a,b)=>a-b)};
export const resolveProductionVideoTarget=(id:string)=>id==='longitude-clock'?longitudeTarget:resolveHistoricalTarget(id);
