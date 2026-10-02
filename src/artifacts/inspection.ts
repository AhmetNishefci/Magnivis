import {spawnSync} from 'node:child_process';
import {createRequire} from 'node:module';

const require = createRequire(import.meta.url);
const ffprobePath = (require('ffprobe-static') as {path: string}).path;

export type MediaInspection = {
  width: number;
  height: number;
  fps: number;
  fpsExpression: string;
  videoCodec: string;
  audioCodec: string;
  audioSampleRate?: string;
  durationSeconds: number;
  sizeBytes: number;
  bitRate?: number;
};

const parseFrameRate = (expression: string) => {
  const [numerator, denominator] = expression.split('/').map(Number);
  if (!numerator || !denominator) throw new Error(`Invalid frame-rate expression: ${expression}`);
  return numerator / denominator;
};

export const inspectMedia = (input: string): MediaInspection => {
  const probe = spawnSync(
    ffprobePath,
    ['-v', 'error', '-show_streams', '-show_format', '-of', 'json', input],
    {encoding: 'utf8'},
  );
  if (probe.status !== 0) throw new Error(probe.stderr || `ffprobe failed for ${input}`);

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
  if (!video) throw new Error(`Video stream missing from ${input}`);
  if (!audio) throw new Error(`Audio stream missing from ${input}`);
  if (!video.width || !video.height || !video.r_frame_rate || !video.codec_name) {
    throw new Error(`Incomplete video metadata for ${input}`);
  }
  if (!audio.codec_name) throw new Error(`Incomplete audio metadata for ${input}`);

  const durationSeconds = Number(metadata.format.duration);
  const sizeBytes = Number(metadata.format.size);
  if (!Number.isFinite(durationSeconds) || !Number.isFinite(sizeBytes)) {
    throw new Error(`Invalid container metadata for ${input}`);
  }

  const bitRate = Number(metadata.format.bit_rate);
  return {
    width: video.width,
    height: video.height,
    fps: parseFrameRate(video.r_frame_rate),
    fpsExpression: video.r_frame_rate,
    videoCodec: video.codec_name,
    audioCodec: audio.codec_name,
    ...(audio.sample_rate ? {audioSampleRate: audio.sample_rate} : {}),
    durationSeconds,
    sizeBytes,
    ...(Number.isFinite(bitRate) ? {bitRate} : {}),
  };
};

export const inspectImage = (input: string) => {
  const probe=spawnSync(ffprobePath,['-v','error','-show_streams','-of','json',input],{encoding:'utf8'});
  if(probe.status!==0)throw new Error(probe.stderr||'Image probe failed');
  const metadata=JSON.parse(probe.stdout) as {streams:{width?:number;height?:number}[]};
  const image=metadata.streams[0];
  if(!image?.width||!image.height)throw new Error('Image dimensions missing');
  return {width:image.width,height:image.height};
};
