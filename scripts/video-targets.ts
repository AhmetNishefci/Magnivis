import {earthToStars} from '../src/content/videos/earth-to-stars';
import {oceanDepth} from '../src/content/videos/ocean-depth';

export const videoTargets = {
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
} as const;

export type VideoId = keyof typeof videoTargets;

export const resolveVideoTarget = (requestedId: string) => {
  const target = videoTargets[requestedId as VideoId];
  if (!target) {
    throw new Error(`Unknown video id: ${requestedId}. Available: ${Object.keys(videoTargets).join(', ')}`);
  }
  return target;
};
