import {videoSpecSchema} from '../schema';

export const speedOfLight = videoSpecSchema.parse({
  id: 'speed-of-light',
  compositionId: 'Magnivis-Speed-Of-Light',
  workingTitle: 'How Fast Is the Speed of Light?',
  titleCandidates: [
    'Light Is Fast — Space Is Bigger',
    'This Is How Fast Light Really Is',
    'How Far Does Light Travel in One Second?',
  ],
  descriptionCandidates: [
    'Light crosses nearly 300,000 kilometers every second—enough to circle Earth about 7.5 times. Yet even light needs 4.25 years to reach our nearest neighboring star.',
  ],
  hook: 'ONE SECOND. 7.5 TRIPS AROUND EARTH.',
  pillar: 'universe',
  status: 'rendered',
  language: 'en',
  captions: [{
    language: 'en',
    label: 'English',
    file: 'captions/speed-of-light.en.vtt',
    burnInCues: [
      {start: 0.03, end: 3.8, lines: ['In one second, light could circle Earth', 'seven and a half times.']},
      {start: 4.15, end: 9.2, lines: ['In a vacuum, it travels nearly', '300,000 kilometers every second.']},
      {start: 9.75, end: 13.6, lines: ['Earth to the Moon takes only', 'about 1.28 seconds.']},
      {start: 14.75, end: 19.5, lines: ['Sunlight needs about 8 minutes', 'and 20 seconds to reach us.']},
      {start: 20.5, end: 24.8, lines: ['In one year, light covers', '9.46 trillion kilometers.']},
      {start: 26, end: 32.3, lines: ['Yet even at that speed, Proxima', 'Centauri is still 4.25 years away.']},
    ],
  }],
  format: {width: 1080, height: 1920, fps: 30, durationSeconds: 33},
  scenes: [
    {id: 'hook', start: 0, end: 4.4, purpose: 'Prove the speed immediately with laps around a familiar Earth.'},
    {id: 'exact-speed', start: 3.7, end: 10.1, purpose: 'Anchor the visual claim to the exact SI-defined speed in vacuum.'},
    {id: 'moon', start: 9.2, end: 15.3, purpose: 'Translate speed into the familiar Earth–Moon distance.'},
    {id: 'sun', start: 14.1, end: 21.2, purpose: 'Expand the reference to sunlight crossing the inner solar system.'},
    {id: 'light-year', start: 20, end: 26.6, purpose: 'Define a light-year as distance rather than time.'},
    {id: 'proxima', start: 25.4, end: 33, purpose: 'End by making even light feel slow against interstellar distance.'},
  ],
  factIds: [
    'light-speed-vacuum-mps',
    'earth-equatorial-circumference-km',
    'light-earth-laps-per-second',
    'earth-moon-average-distance-km',
    'earth-moon-light-time-s',
    'sun-earth-light-time-minutes',
    'light-year-distance-km',
    'proxima-centauri-distance-light-years',
  ],
  audio: {
    file: 'audio/speed-of-light.wav',
    layers: ['ambient', 'transition', 'impact', 'narration'],
    narration: true,
    narrationCues: [
      {id: 'hook', file: 'audio/narration/speed-of-light/hook.wav', start: 0.03, transcript: 'In one second, light could circle Earth seven and a half times.'},
      {id: 'speed', file: 'audio/narration/speed-of-light/speed.wav', start: 4.15, transcript: 'In a vacuum, it travels nearly 300,000 kilometers every second.'},
      {id: 'moon', file: 'audio/narration/speed-of-light/moon.wav', start: 9.75, transcript: 'Earth to the Moon takes only about 1.28 seconds.'},
      {id: 'sun', file: 'audio/narration/speed-of-light/sun.wav', start: 14.75, transcript: 'Sunlight needs about eight minutes and twenty seconds to reach us.'},
      {id: 'year', file: 'audio/narration/speed-of-light/year.wav', start: 20.5, transcript: 'In one year, light covers 9.46 trillion kilometers.'},
      {id: 'proxima', file: 'audio/narration/speed-of-light/proxima.wav', start: 26, transcript: 'Yet even at that speed, Proxima Centauri is still 4.25 years away.'},
    ],
  },
});

export const speedOfLightFrames = speedOfLight.format.fps * speedOfLight.format.durationSeconds;
