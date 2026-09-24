import {videoSpecSchema} from '../schema';

export const billionDollars = videoSpecSchema.parse({
  id: 'billion-dollars',
  compositionId: 'Magnivis-Billion-Dollars',
  workingTitle: 'What $1 Billion Actually Looks Like',
  titleCandidates: [
    'This Is What $1 Billion Actually Looks Like',
    '$1 Billion Is Smaller — and Heavier — Than You Think',
    'How Big Is $1 Billion in Cash?',
  ],
  descriptionCandidates: [
    'One billion dollars in $100 notes means 10 million banknotes weighing roughly 10 metric tons. In one stack, those notes would rise about 1.1 kilometers.',
  ],
  hook: 'THIS BLOCK IS $1 BILLION.',
  pillar: 'numbers',
  status: 'rendered',
  language: 'en',
  captions: [
    {
      language: 'en',
      label: 'English',
      file: 'captions/billion-dollars.en.vtt',
    },
  ],
  format: {
    width: 1080,
    height: 1920,
    fps: 30,
    durationSeconds: 35,
  },
  scenes: [
    {id: 'hook', start: 0, end: 3.4, purpose: 'Show the complete billion-dollar block immediately.'},
    {id: 'note-count', start: 2.8, end: 8.2, purpose: 'Define the denomination and reveal the ten-million-note count.'},
    {id: 'million-stack', start: 7.4, end: 13.2, purpose: 'Build a physical one-million-dollar reference stack.'},
    {id: 'billion-block', start: 12.2, end: 21.2, purpose: 'Multiply the reference into one thousand million-dollar stacks.'},
    {id: 'weight', start: 19.2, end: 25.2, purpose: 'Reframe the compact block as roughly ten metric tons.'},
    {id: 'tower', start: 24.2, end: 33.5, purpose: 'Unpack the notes into a single stack and compare it with Burj Khalifa.'},
    {id: 'coda', start: 32.2, end: 35, purpose: 'End on the ten-million-note and one-billion-dollar equivalence.'},
  ],
  factIds: [
    'hundred-dollar-note-value-usd',
    'hundred-dollar-note-width-mm',
    'hundred-dollar-note-height-mm',
    'us-banknote-weight-g',
    'billion-in-hundreds-note-count',
    'billion-in-hundreds-weight-kg',
    'billion-single-stack-height-m',
    'burj-khalifa-height-m',
  ],
  audio: {
    file: 'audio/billion-dollars.wav',
    layers: ['ambient', 'transition', 'impact', 'narration'],
    narration: true,
    narrationCues: [
      {
        id: 'hook',
        file: 'audio/narration/billion-dollars/hook.wav',
        start: 0.05,
        transcript: 'This block is one billion dollars.',
      },
      {
        id: 'notes',
        file: 'audio/narration/billion-dollars/notes.wav',
        start: 3.05,
        transcript: 'In one-hundred-dollar bills, that means ten million notes.',
      },
      {
        id: 'million',
        file: 'audio/narration/billion-dollars/million.wav',
        start: 8.05,
        transcript: 'Ten thousand notes make one million dollars.',
      },
      {
        id: 'multiply',
        file: 'audio/narration/billion-dollars/multiply.wav',
        start: 12.8,
        transcript: 'A billion needs one thousand stacks like this.',
      },
      {
        id: 'weight',
        file: 'audio/narration/billion-dollars/weight.wav',
        start: 18.2,
        transcript: 'Together, they weigh about ten metric tons.',
      },
      {
        id: 'tower',
        file: 'audio/narration/billion-dollars/tower.wav',
        start: 23.2,
        transcript: 'Stack every note, and the column climbs roughly one point one kilometers, higher than the Burj Khalifa.',
      },
      {
        id: 'coda',
        file: 'audio/narration/billion-dollars/coda.wav',
        start: 31.4,
        transcript: 'Ten million pieces of paper. One billion dollars.',
      },
    ],
  },
});

export const billionDollarsFrames =
  billionDollars.format.fps * billionDollars.format.durationSeconds;
