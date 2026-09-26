import {videoSpecSchema} from '../schema';

export const humanEngineering = videoSpecSchema.parse({
  id: 'human-engineering',
  compositionId: 'Magnivis-Human-Engineering',
  workingTitle: 'The Tallest Building Is Only the Beginning',
  titleCandidates: [
    'The Tallest Building Is Only the Beginning',
    'How Big Human Engineering Really Gets',
    'The Biggest Things We Build Are Underground',
  ],
  descriptionCandidates: [
    'Burj Khalifa reaches 828 meters—but human engineering stretches much farther. From the Three Gorges Dam to CERN’s LHC and the Gotthard Base Tunnel, this is scale measured along each structure’s longest stated dimension.',
  ],
  hook: 'THE TALLEST BUILDING IS ONLY THE START.',
  pillar: 'engineering',
  status: 'rendered',
  language: 'en',
  captions: [{language: 'en', label: 'English', file: 'captions/human-engineering.en.vtt'}],
  format: {width: 1080, height: 1920, fps: 30, durationSeconds: 31},
  scenes: [
    {id: 'hook', start: 0, end: 4.5, purpose: 'Begin on a familiar record and immediately promise a larger scale.'},
    {id: 'burj', start: 3.6, end: 8.3, purpose: 'Establish the 828 m architectural reference.'},
    {id: 'dam', start: 7.1, end: 13.9, purpose: 'Rotate the comparison from height into a 2.3 km horizontal structure.'},
    {id: 'lhc', start: 12.9, end: 20.1, purpose: 'Reveal the 26.7 km machine as an underground ring.'},
    {id: 'gotthard', start: 19.1, end: 26.2, purpose: 'Accelerate through the 57.1 km railway tunnel.'},
    {id: 'coda', start: 25.3, end: 31, purpose: 'Translate the tunnel back into almost 69 familiar Burj Khalifas.'},
  ],
  factIds: [
    'burj-khalifa-height-m',
    'three-gorges-dam-axis-length-m',
    'lhc-circumference-km',
    'gotthard-base-tunnel-length-km',
    'gotthard-burj-count',
  ],
  audio: {
    file: 'audio/human-engineering.wav',
    layers: ['ambient', 'transition', 'impact', 'narration'],
    narration: true,
    narrationCues: [
      {id: 'hook', file: 'audio/narration/human-engineering/hook.wav', start: 0.05, transcript: 'The tallest building on Earth is only the beginning.'},
      {id: 'burj', file: 'audio/narration/human-engineering/burj.wav', start: 3.75, transcript: 'Burj Khalifa rises 828 meters.'},
      {id: 'dam', file: 'audio/narration/human-engineering/dam.wav', start: 7.45, transcript: 'The Three Gorges Dam stretches about 2.3 kilometers, nearly three Burj Khalifas.'},
      {id: 'lhc', file: 'audio/narration/human-engineering/lhc.wav', start: 13.6, transcript: "CERN's Large Hadron Collider forms a 26.7-kilometer ring underground."},
      {id: 'gotthard', file: 'audio/narration/human-engineering/gotthard.wav', start: 19.55, transcript: "But Switzerland's Gotthard Base Tunnel runs 57.1 kilometers through the Alps."},
      {id: 'coda', file: 'audio/narration/human-engineering/coda.wav', start: 25.75, transcript: 'End to end, almost 69 Burj Khalifas would fit inside it.'},
    ],
  },
});

export const humanEngineeringFrames = humanEngineering.format.fps * humanEngineering.format.durationSeconds;
