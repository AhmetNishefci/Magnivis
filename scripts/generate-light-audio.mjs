import {Buffer} from 'node:buffer';
import console from 'node:console';
import {mkdirSync, writeFileSync} from 'node:fs';

const sampleRate = 48000;
const duration = 33;
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

const impacts = [0.03, 4.15, 9.75, 14.75, 20.5, 26];
const sweeps = [3.25, 8.9, 13.9, 19.6, 25.1];
const orbitTicks = [0.08, 0.18, 0.28, 0.38, 0.48, 0.58, 0.7, 0.84];
const clamp = (value) => Math.max(-1, Math.min(1, value));
const smoothstep = (value) => {
  const x = Math.max(0, Math.min(1, value));
  return x * x * (3 - 2 * x);
};
const noise = (index) => {
  const value = Math.sin(index * 17.133 + 91.771) * 43758.5453;
  return (value - Math.floor(value)) * 2 - 1;
};

for (let index = 0; index < sampleCount; index += 1) {
  const t = index / sampleRate;
  const rise = smoothstep(t / 0.22);
  const fall = 1 - smoothstep((t - 32.25) / 0.75);
  const drift = Math.sin(t * 0.19) * 0.8;
  let signal =
    Math.sin(Math.PI * 2 * (54 + drift) * t) * 0.028 +
    Math.sin(Math.PI * 2 * 108 * t + 0.7) * 0.014 +
    Math.sin(Math.PI * 2 * 216 * t + 1.5) * 0.005;

  signal += noise(index) * 0.0045;

  for (const impact of impacts) {
    const age = t - impact;
    if (age >= 0 && age < 1.2) {
      signal += Math.sin(Math.PI * 2 * (96 - age * 25) * age) * Math.exp(-age * 4.5) * 0.11;
      signal += noise(index + Math.round(impact * 1000)) * Math.exp(-age * 28) * 0.025;
    }
  }

  for (const start of sweeps) {
    const age = t - start;
    if (age >= 0 && age < 1.3) {
      const envelope = Math.sin(Math.PI * age / 1.3) ** 2;
      signal += Math.sin(Math.PI * 2 * (230 + age * 520) * age) * envelope * 0.014;
      signal += noise(index + Math.round(start * 100)) * envelope * 0.009;
    }
  }

  for (const tick of orbitTicks) {
    const age = t - tick;
    if (age >= 0 && age < 0.08) {
      signal += Math.sin(Math.PI * 2 * 1150 * age) * Math.exp(-age * 72) * 0.04;
    }
  }

  signal *= rise * fall;
  const pan = Math.sin(t * 0.68) * 0.08;
  buffer.writeInt16LE(Math.round(clamp(signal * (1 + pan)) * 32767), 44 + index * 4);
  buffer.writeInt16LE(Math.round(clamp(signal * (1 - pan)) * 32767), 46 + index * 4);
}

mkdirSync('public/audio', {recursive: true});
writeFileSync('public/audio/speed-of-light.wav', buffer);
console.log(`Generated public/audio/speed-of-light.wav (${duration}s, ${sampleRate} Hz stereo PCM)`);
