import {videoSpecSchema} from '../schema';

export const earthToStars = videoSpecSchema.parse({
  id: 'earth-to-stars',
  compositionId: 'Magnivis-Earth-To-Stars',
  workingTitle: 'Earth Is Huge — Until You See This',
  titleCandidates: [
    'Earth Is Huge — Until You See This',
    'The Scale of Earth Stops Making Sense Here',
    'You Are Not Ready for the Size of These Stars',
  ],
  descriptionCandidates: [
    'Earth feels enormous—until Jupiter, the Sun, and giant stars reset the scale. A cinematic size comparison using sourced astronomical values.',
  ],
  hook: 'EARTH IS HUGE. UNTIL YOU SEE THIS.',
  pillar: 'universe',
  status: 'published',
  language: 'en',
  captions: [
    {
      language: 'en',
      label: 'English',
      file: 'captions/earth-to-stars.en.srt',
    },
  ],
  format: {
    width: 1080,
    height: 1920,
    fps: 30,
    durationSeconds: 42,
  },
  scenes: [
    {id: 'hook', start: 0, end: 2.5, purpose: 'State the familiar reference and promise a reframe.'},
    {id: 'earth', start: 2, end: 8, purpose: 'Establish Earth as a physically enormous baseline.'},
    {id: 'jupiter', start: 7, end: 15, purpose: 'Reduce Earth to a small object beside Jupiter.'},
    {id: 'sun', start: 14, end: 23, purpose: 'Reduce Jupiter to a small object beside the Sun.'},
    {id: 'rigel', start: 22, end: 30, purpose: 'Show that the Sun is not a large star.'},
    {id: 'betelgeuse', start: 29, end: 39, purpose: 'Reveal an uncertain but defensible red-supergiant scale.'},
    {id: 'coda', start: 38, end: 42, purpose: 'Turn the comparison into a concise final thought.'},
  ],
  factIds: [
    'earth-mean-radius-km',
    'jupiter-mean-radius-km',
    'sun-radius-km',
    'rigel-radius-solar',
    'betelgeuse-radius-solar',
  ],
  audio: {
    file: 'audio/earth-to-stars.wav',
    layers: ['ambient', 'transition', 'impact', 'narration'],
    narration: true,
    narrationCues: [
      {
        id: 'hook',
        file: 'audio/narration/hook.wav',
        start: 0.25,
        transcript: 'Earth is huge. Twelve thousand, seven hundred and forty-two kilometers across.',
      },
      {
        id: 'jupiter',
        file: 'audio/narration/jupiter.wav',
        start: 8.1,
        transcript: 'But Jupiter is nearly eleven Earths wide.',
      },
      {
        id: 'sun',
        file: 'audio/narration/sun.wav',
        start: 15.2,
        transcript: 'Our Sun is almost ten Jupiters across.',
      },
      {
        id: 'rigel',
        file: 'audio/narration/rigel.wav',
        start: 23,
        transcript: "Rigel is about fifty times the Sun's radius.",
      },
      {
        id: 'betelgeuse',
        file: 'audio/narration/betelgeuse.wav',
        start: 30,
        transcript: "And Betelgeuse? An estimated seven hundred and twenty-four times the Sun's radius.",
      },
      {
        id: 'coda',
        file: 'audio/narration/coda.wav',
        start: 39,
        transcript: "And that's just one star.",
      },
    ],
  },
});

export const earthToStarsFrames =
  earthToStars.format.fps * earthToStars.format.durationSeconds;
