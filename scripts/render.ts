import {mkdirSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import {earthToStars} from '../src/content/videos/earth-to-stars';

const videos = {
  [earthToStars.id]: {
    composition: earthToStars.compositionId,
    output: `output/${earthToStars.id}-narrated.mp4`,
  },
} as const;

const requestedId = process.argv[2] ?? earthToStars.id;
const target = videos[requestedId as keyof typeof videos];

if (!target) {
  console.error(`Unknown video id: ${requestedId}. Available: ${Object.keys(videos).join(', ')}`);
  process.exit(1);
}

mkdirSync('output', {recursive: true});

const result = spawnSync(
  process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm',
  [
    'exec',
    'remotion',
    'render',
    'src/index.ts',
    target.composition,
    target.output,
    '--codec=h264',
    '--audio-codec=aac',
    '--crf=17',
    '--pixel-format=yuv420p',
    '--overwrite',
  ],
  {stdio: 'inherit'},
);

if (result.error) throw result.error;
process.exit(result.status ?? 1);
