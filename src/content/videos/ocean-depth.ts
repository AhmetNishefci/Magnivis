import {videoSpecSchema} from '../schema';

export const oceanDepth = videoSpecSchema.parse({
  id: 'ocean-depth',
  compositionId: 'Magnivis-Ocean-Depth',
  workingTitle: 'How Deep Is the Ocean, Really?',
  titleCandidates: [
    'Mount Everest Would Disappear Here',
    'The Ocean Is Deeper Than Everest Is Tall',
    'How Deep Is the Ocean, Really?',
  ],
  descriptionCandidates: [
    'Mount Everest is 8,848.86 meters tall. Challenger Deep reaches approximately 10,935 meters below the ocean surface—enough to leave Everest’s summit more than two kilometers underwater.',
  ],
  hook: 'EVEREST WOULD DISAPPEAR.',
  pillar: 'earth',
  status: 'rendered',
  language: 'en',
  captions: [
    {
      language: 'en',
      label: 'English',
      file: 'captions/ocean-depth.en.srt',
    },
  ],
  format: {
    width: 1080,
    height: 1920,
    fps: 30,
    durationSeconds: 32,
  },
  scenes: [
    {id: 'hook', start: 0, end: 3.2, purpose: 'Show the entire contradiction in frame one.'},
    {id: 'sunlight', start: 2.7, end: 7.2, purpose: 'Descend past the zone where significant sunlight becomes rare.'},
    {id: 'darkness', start: 6.7, end: 11.2, purpose: 'Cross into the aphotic ocean below about 1,000 meters.'},
    {id: 'average-depth', start: 10.7, end: 16.2, purpose: 'Pass the approximate global average ocean depth.'},
    {id: 'everest', start: 15.7, end: 24.2, purpose: 'Place Everest on the trench floor using one shared vertical scale.'},
    {id: 'challenger-deep', start: 23.7, end: 29.5, purpose: 'Name the deepest point and reveal the remaining water above Everest.'},
    {id: 'coda', start: 29, end: 32, purpose: 'End immediately on the 2.1-kilometer clearance reframe.'},
  ],
  factIds: [
    'ocean-significant-light-depth-m',
    'ocean-no-sunlight-depth-m',
    'ocean-average-depth-m',
    'everest-elevation-m',
    'challenger-deep-depth-m',
    'everest-summit-clearance-m',
  ],
  audio: {
    file: 'audio/ocean-depth.wav',
    layers: ['ambient', 'transition', 'impact', 'narration'],
    narration: true,
    narrationCues: [
      {
        id: 'hook',
        file: 'audio/narration/ocean-depth/hook.wav',
        start: 0.05,
        transcript: 'The deepest ocean could swallow Mount Everest.',
      },
      {
        id: 'light',
        file: 'audio/narration/ocean-depth/light.wav',
        start: 3.15,
        transcript: 'After two hundred meters, sunlight is already fading.',
      },
      {
        id: 'dark',
        file: 'audio/narration/ocean-depth/dark.wav',
        start: 7.35,
        transcript: 'At one thousand meters, it disappears.',
      },
      {
        id: 'average',
        file: 'audio/narration/ocean-depth/average.wav',
        start: 11.1,
        transcript: 'The average ocean is nearly three point seven kilometers deep.',
      },
      {
        id: 'everest',
        file: 'audio/narration/ocean-depth/everest.wav',
        start: 16.25,
        transcript: 'Now place Mount Everest on the bottom.',
      },
      {
        id: 'clearance',
        file: 'audio/narration/ocean-depth/clearance.wav',
        start: 20.15,
        transcript: 'Its summit would still be more than two kilometers underwater.',
      },
      {
        id: 'coda',
        file: 'audio/narration/ocean-depth/coda.wav',
        start: 26.2,
        transcript: 'Challenger Deep. Nearly eleven kilometers below the surface.',
      },
    ],
  },
});

export const oceanDepthFrames =
  oceanDepth.format.fps * oceanDepth.format.durationSeconds;
