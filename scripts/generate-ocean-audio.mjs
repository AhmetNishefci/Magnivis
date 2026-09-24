import {Buffer} from 'node:buffer';
import console from 'node:console';
import {mkdirSync, writeFileSync} from 'node:fs';

const sampleRate = 48000;
const duration = 32;
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

const impacts = [0.08, 2.8, 6.8, 10.8, 15.8, 20.1, 23.8, 29.1];
const descents = [2.4, 6.35, 10.25, 15.2, 23.2];
const clamp = (value) => Math.max(-1, Math.min(1, value));
const smoothstep = (value) => {
  const x = Math.max(0, Math.min(1, value));
  return x * x * (3 - 2 * x);
};
const hashNoise = (index) => {
  const value = Math.sin(index * 12.9898 + 31.517) * 43758.5453;
  return (value - Math.floor(value)) * 2 - 1;
};

for (let index = 0; index < sampleCount; index += 1) {
  const t = index / sampleRate;
  const depth = smoothstep(t / 27);
  const rise = smoothstep(t / 0.35);
  const fall = 1 - smoothstep((t - 31.1) / 0.9);
  const lowFrequency = 48 - depth * 16;
  let signal =
    Math.sin(Math.PI * 2 * lowFrequency * t + Math.sin(t * 0.12) * 0.45) * 0.055 +
    Math.sin(Math.PI * 2 * (lowFrequency * 1.5) * t + 1.2) * 0.026 +
    Math.sin(Math.PI * 2 * 108 * t + Math.sin(t * 0.19) * 1.1) * 0.008;

  const currentNoise = hashNoise(index) * (0.009 + depth * 0.007);
  signal += currentNoise;

  for (const impact of impacts) {
    const age = t - impact;
    if (age >= 0 && age < 1.8) {
      const envelope = Math.exp(-age * 3.3);
      const pitch = 72 - age * 25;
      signal += Math.sin(Math.PI * 2 * pitch * age) * envelope * 0.16;
      signal += hashNoise(index + Math.round(impact * 1000)) * Math.exp(-age * 18) * 0.04;
    }
  }

  for (const descent of descents) {
    const age = t - descent;
    if (age >= 0 && age < 1.6) {
      const envelope = Math.sin(Math.PI * age / 1.6) ** 2;
      const frequency = 330 - age * 155;
      signal += Math.sin(Math.PI * 2 * frequency * age) * envelope * 0.018;
      signal += hashNoise(index + Math.round(descent * 100)) * envelope * 0.014;
    }
  }

  for (const ping of [4.7, 8.8, 13.3, 18.5, 25.4]) {
    const age = t - ping;
    if (age >= 0 && age < 1.4) {
      signal += Math.sin(Math.PI * 2 * 430 * age) * Math.exp(-age * 5.4) * 0.018;
    }
  }

  signal *= rise * fall;
  const pan = Math.sin(t * 0.37) * 0.04;
  const left = clamp(signal * (1 + pan));
  const right = clamp(signal * (1 - pan));
  buffer.writeInt16LE(Math.round(left * 32767), 44 + index * 4);
  buffer.writeInt16LE(Math.round(right * 32767), 46 + index * 4);
}

mkdirSync('public/audio', {recursive: true});
writeFileSync('public/audio/ocean-depth.wav', buffer);
console.log(`Generated public/audio/ocean-depth.wav (${duration}s, ${sampleRate} Hz stereo PCM)`);
