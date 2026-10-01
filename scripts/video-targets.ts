import {phantomTraffic} from '../src/content/videos/phantom-traffic';
import {phantomTrafficCaptionPlan} from '../src/captions/plans/phantom-traffic';
import {billionDollars} from '../src/content/videos/billion-dollars';
import {earthToStars} from '../src/content/videos/earth-to-stars';
import {humanEngineering} from '../src/content/videos/human-engineering';
import {oceanDepth} from '../src/content/videos/ocean-depth';
import {
  speedOfLight,
  speedOfLightTiktok,
} from '../src/content/videos/speed-of-light';
import {woodFrog, woodFrogTiktok} from '../src/content/videos/wood-frog';
import {woodFrogCaptionPlan} from '../src/captions/plans/wood-frog';

const woodFrogCaptionQaTimestamps = woodFrogCaptionPlan.cues.map(({startFrame, endFrame}) => (
  Number((((startFrame + endFrame) / 2) / woodFrogCaptionPlan.fps).toFixed(3))
));

export const videoTargets = {
  [phantomTraffic.id]: {spec:phantomTraffic,output:'output/phantom-traffic-narrated.mp4',qaDirectory:'qa/phantom-traffic-narrated',qaTimestamps:[...new Set([0,0.5,1,1.5,6,8,10.5,13.5,16.5,19.5,21.5,24.5,26.8,29.5,33.8,...phantomTrafficCaptionPlan.cues.map(c=>Number(((c.startFrame+c.endFrame)/60).toFixed(3)))])].sort((a,b)=>a-b)},
  [earthToStars.id]: {
    spec: earthToStars,
    output: `output/${earthToStars.id}-narrated.mp4`,
    qaDirectory: `qa/${earthToStars.id}-narrated`,
    qaTimestamps: [0.7, 9.8, 17.8, 25.7, 34.8, 40.7],
  },
  [oceanDepth.id]: {
    spec: oceanDepth,
    output: `output/${oceanDepth.id}-narrated.mp4`,
    qaDirectory: `qa/${oceanDepth.id}-narrated`,
    qaTimestamps: [0.4, 4.8, 8.8, 13.2, 18.2, 22.2, 27.2, 30.5],
  },
  [billionDollars.id]: {
    spec: billionDollars,
    output: `output/${billionDollars.id}-narrated.mp4`,
    qaDirectory: `qa/${billionDollars.id}-narrated`,
    qaTimestamps: [0.4, 4.8, 9.8, 14.8, 20.4, 27.7, 32.6, 34.2],
  },
  [speedOfLight.id]: {
    spec: speedOfLight,
    output: `output/${speedOfLight.id}-narrated.mp4`,
    qaDirectory: `qa/${speedOfLight.id}-narrated`,
    qaTimestamps: [0.25, 2.8, 5.9, 10.8, 15.8, 21.8, 27.8, 32.1],
  },
  [speedOfLightTiktok.id]: {
    spec: speedOfLightTiktok,
    output: `output/${speedOfLightTiktok.id}-narrated.mp4`,
    qaDirectory: `qa/${speedOfLightTiktok.id}-narrated`,
    qaTimestamps: [0.25, 2.8, 5.9, 10.8, 15.8, 21.8, 27.8, 32.1],
  },
  [humanEngineering.id]: {
    spec: humanEngineering,
    output: `output/${humanEngineering.id}-narrated.mp4`,
    qaDirectory: `qa/${humanEngineering.id}-narrated`,
    qaTimestamps: [0.3, 2.8, 4.8, 8.8, 13.8, 19.8, 25.8, 30.2],
  },
  [woodFrog.id]: {
    spec: woodFrog,
    output: `output/${woodFrog.id}-narrated.mp4`,
    qaDirectory: `qa/${woodFrog.id}-narrated`,
    qaTimestamps: woodFrogCaptionQaTimestamps,
  },
  [woodFrogTiktok.id]: {
    spec: woodFrogTiktok,
    output: `output/${woodFrogTiktok.id}-narrated.mp4`,
    qaDirectory: `qa/${woodFrogTiktok.id}-narrated`,
    qaTimestamps: woodFrogCaptionQaTimestamps,
  },
} as const;

export type VideoId = keyof typeof videoTargets;

export const resolveVideoTarget = (requestedId: string) => {
  const target = videoTargets[requestedId as VideoId];
  if (!target) {
    throw new Error(`Unknown video id: ${requestedId}. Available: ${Object.keys(videoTargets).join(', ')}`);
  }
  return target;
};
