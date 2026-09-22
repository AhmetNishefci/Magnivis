import {createRequire} from 'node:module';
import {existsSync, mkdirSync, writeFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import {earthToStars} from '../src/content/videos/earth-to-stars';

const require = createRequire(import.meta.url);
const ffmpegPath = require('ffmpeg-static') as string;
const ffprobePath = (require('ffprobe-static') as {path: string}).path;

const id = process.argv[2] ?? earthToStars.id;
if (id !== earthToStars.id) {
  console.error(`Unknown video id: ${id}. Available: ${earthToStars.id}`);
  process.exit(1);
}

const input = `output/${id}-narrated.mp4`;
const qaDirectory = `qa/${id}-narrated`;
if (!existsSync(input)) {
  console.error(`Missing ${input}. Run: pnpm render ${id}`);
  process.exit(1);
}
mkdirSync(qaDirectory, {recursive: true});

const probe = spawnSync(
  ffprobePath,
  ['-v', 'error', '-show_streams', '-show_format', '-of', 'json', input],
  {encoding: 'utf8'},
);
if (probe.status !== 0) throw new Error(probe.stderr || 'ffprobe failed');

const metadata = JSON.parse(probe.stdout) as {
  streams: Array<{
    codec_type?: string;
    codec_name?: string;
    width?: number;
    height?: number;
    r_frame_rate?: string;
    sample_rate?: string;
  }>;
  format: {duration?: string; size?: string; bit_rate?: string};
};
const video = metadata.streams.find((stream) => stream.codec_type === 'video');
const audio = metadata.streams.find((stream) => stream.codec_type === 'audio');
const duration = Number(metadata.format.duration);
const expected = earthToStars.format;
const failures: string[] = [];

const volumeProbe = spawnSync(
  ffmpegPath,
  ['-i', input, '-af', 'volumedetect', '-vn', '-sn', '-dn', '-f', 'null', '-'],
  {encoding: 'utf8'},
);
if (volumeProbe.status !== 0) throw new Error(volumeProbe.stderr || 'Audio level inspection failed');
const meanVolume = Number(/mean_volume:\s*(-?[\d.]+) dB/.exec(volumeProbe.stderr)?.[1]);
const maxVolume = Number(/max_volume:\s*(-?[\d.]+) dB/.exec(volumeProbe.stderr)?.[1]);

if (!video) failures.push('video stream missing');
if (!audio) failures.push('audio stream missing');
if (video?.width !== expected.width || video?.height !== expected.height) {
  failures.push(`resolution ${video?.width ?? '?'}x${video?.height ?? '?'} != ${expected.width}x${expected.height}`);
}
if (video?.r_frame_rate !== `${expected.fps}/1`) failures.push(`frame rate ${video?.r_frame_rate ?? '?'} != ${expected.fps}/1`);
if (video?.codec_name !== 'h264') failures.push(`video codec ${video?.codec_name ?? '?'} != h264`);
if (audio?.codec_name !== 'aac') failures.push(`audio codec ${audio?.codec_name ?? '?'} != aac`);
if (Math.abs(duration - expected.durationSeconds) > 0.12) failures.push(`duration ${duration}s outside tolerance`);
if (!Number.isFinite(meanVolume) || meanVolume < -70) failures.push(`audio appears silent (mean ${meanVolume} dB)`);
if (!Number.isFinite(maxVolume) || maxVolume > 0) failures.push(`invalid/clipping audio peak (${maxVolume} dB)`);

const report = {
  checkedAt: new Date().toISOString(),
  input,
  expected,
  observed: {
    width: video?.width,
    height: video?.height,
    fps: video?.r_frame_rate,
    videoCodec: video?.codec_name,
    audioCodec: audio?.codec_name,
    audioSampleRate: audio?.sample_rate,
    meanVolumeDb: meanVolume,
    maxVolumeDb: maxVolume,
    duration,
    sizeBytes: Number(metadata.format.size),
    bitRate: Number(metadata.format.bit_rate),
  },
  passed: failures.length === 0,
  failures,
};
writeFileSync(`${qaDirectory}/report.json`, `${JSON.stringify(report, null, 2)}\n`);

const timestamps = [0.7, 9.8, 17.8, 25.7, 34.8, 40.7];
for (const [index, timestamp] of timestamps.entries()) {
  const filename = `${qaDirectory}/frame-${String(index + 1).padStart(2, '0')}-${timestamp.toFixed(1)}s.png`;
  const frame = spawnSync(
    ffmpegPath,
    ['-y', '-ss', timestamp.toString(), '-i', input, '-frames:v', '1', '-compression_level', '3', filename],
    {encoding: 'utf8'},
  );
  if (frame.status !== 0) throw new Error(frame.stderr || `Failed to extract ${filename}`);
}

const contactSheet = spawnSync(
  ffmpegPath,
  [
    '-y',
    '-i',
    input,
    '-vf',
    "fps=1/7,scale=270:480:force_original_aspect_ratio=decrease,pad=270:480:(ow-iw)/2:(oh-ih)/2:color=0x02030a,tile=3x2:padding=10:margin=10:color=0x02030a",
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
