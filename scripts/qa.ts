import {existsSync, mkdirSync, writeFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import {resolveVideoTarget} from './video-targets';
import {inspectMedia} from './media-inspection';

import {createRequire} from 'node:module';
const require = createRequire(import.meta.url);
const ffmpegPath = require('ffmpeg-static') as string;

const id = process.argv[2] ?? 'earth-to-stars';
let target;
try {
  target = resolveVideoTarget(id);
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}

const input = target.output;
const qaDirectory = target.qaDirectory;
if (!existsSync(input)) {
  console.error(`Missing ${input}. Run: pnpm render ${id}`);
  process.exit(1);
}
mkdirSync(qaDirectory, {recursive: true});

const media = inspectMedia(input);
const expected = target.spec.format;
const failures: string[] = [];

const volumeProbe = spawnSync(
  ffmpegPath,
  ['-i', input, '-af', 'volumedetect', '-vn', '-sn', '-dn', '-f', 'null', '-'],
  {encoding: 'utf8'},
);
if (volumeProbe.status !== 0) throw new Error(volumeProbe.stderr || 'Audio level inspection failed');
const meanVolume = Number(/mean_volume:\s*(-?[\d.]+) dB/.exec(volumeProbe.stderr)?.[1]);
const maxVolume = Number(/max_volume:\s*(-?[\d.]+) dB/.exec(volumeProbe.stderr)?.[1]);

if (media.width !== expected.width || media.height !== expected.height) {
  failures.push(`resolution ${media.width}x${media.height} != ${expected.width}x${expected.height}`);
}
if (media.fps !== expected.fps) failures.push(`frame rate ${media.fpsExpression} != ${expected.fps}/1`);
if (media.videoCodec !== 'h264') failures.push(`video codec ${media.videoCodec} != h264`);
if (media.audioCodec !== 'aac') failures.push(`audio codec ${media.audioCodec} != aac`);
if (Math.abs(media.durationSeconds - expected.durationSeconds) > 0.12) failures.push(`duration ${media.durationSeconds}s outside tolerance`);
if (!Number.isFinite(meanVolume) || meanVolume < -70) failures.push(`audio appears silent (mean ${meanVolume} dB)`);
if (!Number.isFinite(maxVolume) || maxVolume > 0) failures.push(`invalid/clipping audio peak (${maxVolume} dB)`);

const report = {
  checkedAt: new Date().toISOString(),
  input,
  expected,
  observed: {
    width: media.width,
    height: media.height,
    fps: media.fpsExpression,
    videoCodec: media.videoCodec,
    audioCodec: media.audioCodec,
    audioSampleRate: media.audioSampleRate,
    meanVolumeDb: meanVolume,
    maxVolumeDb: maxVolume,
    duration: media.durationSeconds,
    sizeBytes: media.sizeBytes,
    bitRate: media.bitRate,
  },
  passed: failures.length === 0,
  failures,
};
writeFileSync(`${qaDirectory}/report.json`, `${JSON.stringify(report, null, 2)}\n`);

const timestamps = target.qaTimestamps;
for (const [index, timestamp] of timestamps.entries()) {
  const filename = `${qaDirectory}/frame-${String(index + 1).padStart(2, '0')}-${timestamp.toFixed(1)}s.png`;
  const frameIndex = Math.min(
    Math.round(expected.durationSeconds * expected.fps) - 1,
    Math.round(timestamp * expected.fps),
  );
  const frame = spawnSync(
    ffmpegPath,
    [
      '-y',
      '-i', input,
      '-vf', `select=eq(n\\,${frameIndex})`,
      '-vsync', '0',
      '-frames:v', '1',
      '-compression_level', '3',
      filename,
    ],
    {encoding: 'utf8'},
  );
  if (frame.status !== 0) throw new Error(frame.stderr || `Failed to extract ${filename}`);
}

const contactColumns = timestamps.length > 6 ? 4 : 3;
const contactRows = Math.ceil(timestamps.length / contactColumns);
const selectedFrames = timestamps.map((timestamp) => Math.min(
  Math.round(expected.durationSeconds * expected.fps) - 1,
  Math.round(timestamp * expected.fps),
));
const selection = selectedFrames.map((frame) => `eq(n\\,${frame})`).join('+');
const contactSheet = spawnSync(
  ffmpegPath,
  [
    '-y',
    '-i',
    input,
    '-vf',
    `select=${selection},setpts=N/FRAME_RATE/TB,scale=270:480:force_original_aspect_ratio=decrease,pad=270:480:(ow-iw)/2:(oh-ih)/2:color=0x02030a,tile=${contactColumns}x${contactRows}:nb_frames=${timestamps.length}:padding=10:margin=10:color=0x02030a`,
    '-frames:v',
    '1',
    '-q:v',
    '2',
    `${qaDirectory}/contact-sheet.jpg`,
  ],
  {encoding: 'utf8'},
);
if (contactSheet.status !== 0) throw new Error(contactSheet.stderr || 'Contact sheet generation failed');

console.log(JSON.stringify(report, null, 2));
if (failures.length > 0) process.exit(1);
