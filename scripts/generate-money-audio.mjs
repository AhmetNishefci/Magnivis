import {Buffer} from 'node:buffer';
import console from 'node:console';
import {mkdirSync, writeFileSync} from 'node:fs';

const sampleRate = 48000;
const duration = 35;
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

const impacts = [0.06, 3.05, 8.05, 12.8, 18.2, 23.2, 31.4];
const rises = [2.55, 7.45, 11.9, 22.8];
const ticks = [3.25, 3.55, 3.9, 4.3, 4.8, 5.4, 6.1, 12.9, 13.15, 13.4, 13.7, 14.05, 14.45];
const clamp = (value) => Math.max(-1, Math.min(1, value));
const smoothstep = (value) => {
  const x = Math.max(0, Math.min(1, value));
  return x * x * (3 - 2 * x);
};
const hashNoise = (index) => {
  const value = Math.sin(index * 13.771 + 47.311) * 43758.5453;
  return (value - Math.floor(value)) * 2 - 1;
};

for (let index = 0; index < sampleCount; index += 1) {
  const t = index / sampleRate;
  const rise = smoothstep(t / 0.28);
  const fall = 1 - smoothstep((t - 34.15) / 0.85);
  let signal =
    Math.sin(Math.PI * 2 * 46 * t + Math.sin(t * 0.17) * 0.3) * 0.038 +
    Math.sin(Math.PI * 2 * 92 * t + 0.9) * 0.018 +
    Math.sin(Math.PI * 2 * 184 * t + Math.sin(t * 0.09)) * 0.006;

  signal += hashNoise(index) * 0.006;

  for (const impact of impacts) {
    const age = t - impact;
    if (age >= 0 && age < 1.4) {
      const envelope = Math.exp(-age * 4.1);
      signal += Math.sin(Math.PI * 2 * (78 - age * 22) * age) * envelope * 0.15;
      signal += hashNoise(index + Math.round(impact * 1000)) * Math.exp(-age * 22) * 0.034;
    }
  }

  for (const start of rises) {
    const age = t - start;
    if (age >= 0 && age < 1.8) {
      const envelope = Math.sin(Math.PI * age / 1.8) ** 2;
      signal += Math.sin(Math.PI * 2 * (170 + age * 240) * age) * envelope * 0.014;
      signal += hashNoise(index + Math.round(start * 100)) * envelope * 0.012;
    }
  }

  for (const tick of ticks) {
    const age = t - tick;
    if (age >= 0 && age < 0.09) {
      signal += Math.sin(Math.PI * 2 * 920 * age) * Math.exp(-age * 55) * 0.032;
    }
  }

  signal *= rise * fall;
  const pan = Math.sin(t * 0.41) * 0.06;
  const left = clamp(signal * (1 + pan));
  const right = clamp(signal * (1 - pan));
  buffer.writeInt16LE(Math.round(left * 32767), 44 + index * 4);
  buffer.writeInt16LE(Math.round(right * 32767), 46 + index * 4);
}

mkdirSync('public/audio', {recursive: true});
writeFileSync('public/audio/billion-dollars.wav', buffer);
console.log(`Generated public/audio/billion-dollars.wav (${duration}s, ${sampleRate} Hz stereo PCM)`);
