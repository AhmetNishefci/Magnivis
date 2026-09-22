import {Buffer} from 'node:buffer';
import console from 'node:console';
import {mkdirSync, writeFileSync} from 'node:fs';

const sampleRate = 48000;
const duration = 42;
const channels = 2;
const sampleCount = sampleRate * duration;
const dataBytes = sampleCount * channels * 2;
const buffer = Buffer.alloc(44 + dataBytes);

buffer.write('RIFF', 0);
buffer.writeUInt32LE(36 + dataBytes, 4);
buffer.write('WAVE', 8);
buffer.write('fmt ', 12);
buffer.writeUInt32LE(16, 16);
buffer.writeUInt16LE(1, 20);
buffer.writeUInt16LE(channels, 22);
buffer.writeUInt32LE(sampleRate, 24);
buffer.writeUInt32LE(sampleRate * channels * 2, 28);
buffer.writeUInt16LE(channels * 2, 32);
buffer.writeUInt16LE(16, 34);
buffer.write('data', 36);
buffer.writeUInt32LE(dataBytes, 40);

const impacts = [0.15, 2.15, 7.2, 14.2, 22.2, 29.15, 38.15];
const sweeps = [6.25, 13.2, 21.1, 28.1, 37.1];
const smoothstep = (value) => {
  const x = Math.max(0, Math.min(1, value));
  return x * x * (3 - 2 * x);
};
const hashNoise = (index) => {
  const value = Math.sin(index * 12.9898 + 78.233) * 43758.5453;
  return (value - Math.floor(value)) * 2 - 1;
};

for (let index = 0; index < sampleCount; index += 1) {
  const t = index / sampleRate;
  const rise = smoothstep(t / 3);
  const fall = 1 - smoothstep((t - 40.6) / 1.4);
  let signal =
    Math.sin(Math.PI * 2 * 41.2 * t) * 0.052 +
    Math.sin(Math.PI * 2 * 61.8 * t + 0.4) * 0.031 +
    Math.sin(Math.PI * 2 * 82.4 * t + Math.sin(t * 0.23) * 0.7) * 0.017;

  for (const impact of impacts) {
    const age = t - impact;
    if (age >= 0 && age < 2.2) {
      const envelope = Math.exp(-age * 2.75);
      const pitch = 76 - age * 23;
      signal += Math.sin(Math.PI * 2 * pitch * age) * envelope * 0.19;
      signal += hashNoise(index + Math.round(impact * 1000)) * Math.exp(-age * 14) * 0.055;
    }
  }

  for (const sweep of sweeps) {
    const age = t - sweep;
    if (age >= 0 && age < 1.25) {
      const envelope = Math.sin(Math.PI * age / 1.25) ** 2;
      const frequency = 150 + age * 760;
      signal += Math.sin(Math.PI * 2 * frequency * age) * envelope * 0.024;
      signal += hashNoise(index + Math.round(sweep * 100)) * envelope * 0.018;
    }
  }

  const shimmer = Math.sin(Math.PI * 2 * (164.8 + Math.sin(t * 0.17) * 2.1) * t) * 0.007;
  signal = (signal + shimmer) * rise * fall;
  const left = Math.max(-1, Math.min(1, signal * (0.97 + Math.sin(t * 0.31) * 0.03)));
  const right = Math.max(-1, Math.min(1, signal * (0.97 - Math.sin(t * 0.31) * 0.03)));
  buffer.writeInt16LE(Math.round(left * 32767), 44 + index * 4);
  buffer.writeInt16LE(Math.round(right * 32767), 46 + index * 4);
}

mkdirSync('public/audio', {recursive: true});
writeFileSync('public/audio/earth-to-stars.wav', buffer);
console.log(`Generated public/audio/earth-to-stars.wav (${duration}s, ${sampleRate} Hz stereo PCM)`);
