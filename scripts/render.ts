import {mkdirSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import {resolveVideoTarget} from './video-targets';

const requestedId = process.argv[2] ?? 'earth-to-stars';
let target;
try {
  target = resolveVideoTarget(requestedId);
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
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
    target.spec.compositionId,
    target.output,
    '--codec=h264',
    '--audio-codec=aac',
    '--video-bitrate=8M',
    '--audio-bitrate=192K',
    '--pixel-format=yuv420p',
    '--overwrite',
  ],
  {stdio: 'inherit'},
);

if (result.error) throw result.error;
process.exit(result.status ?? 1);
