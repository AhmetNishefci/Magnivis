import {Buffer} from 'node:buffer';
import console from 'node:console';
import {mkdirSync, writeFileSync} from 'node:fs';

const sampleRate = 48000;
const duration = 31;
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

const impacts = [0.05, 3.75, 7.45, 13.6, 19.55, 25.75];
const sweeps = [3.1, 6.95, 12.8, 18.75, 25.05];
const railTicks = Array.from({length: 44}, (_, index) => 19.65 + index * 0.105);
const clamp = (value) => Math.max(-1, Math.min(1, value));
const smoothstep = (value) => {
  const x = Math.max(0, Math.min(1, value));
  return x * x * (3 - 2 * x);
};
const noise = (index) => {
  const value = Math.sin(index * 13.771 + 41.933) * 43758.5453;
  return (value - Math.floor(value)) * 2 - 1;
};

for (let index = 0; index < sampleCount; index += 1) {
  const t = index / sampleRate;
  const rise = smoothstep(t / 0.25);
  const fall = 1 - smoothstep((t - 30.2) / 0.8);
  const drift = Math.sin(t * 0.23) * 1.2;
  let signal =
    Math.sin(Math.PI * 2 * (43 + drift) * t) * 0.032 +
    Math.sin(Math.PI * 2 * 86 * t + 0.9) * 0.012 +
    Math.sin(Math.PI * 2 * 172 * t + 1.7) * 0.004;

  signal += noise(index) * 0.0035;

  for (const impact of impacts) {
    const age = t - impact;
    if (age >= 0 && age < 1.1) {
      signal += Math.sin(Math.PI * 2 * (82 - age * 21) * age) * Math.exp(-age * 4.2) * 0.12;
      signal += noise(index + Math.round(impact * 1000)) * Math.exp(-age * 32) * 0.022;
    }
  }

  for (const start of sweeps) {
    const age = t - start;
    if (age >= 0 && age < 1.35) {
      const envelope = Math.sin(Math.PI * age / 1.35) ** 2;
      signal += Math.sin(Math.PI * 2 * (120 + age * 480) * age) * envelope * 0.016;
      signal += noise(index + Math.round(start * 100)) * envelope * 0.008;
    }
  }

  for (const tick of railTicks) {
    const age = t - tick;
    if (age >= 0 && age < 0.045) {
      signal += Math.sin(Math.PI * 2 * 720 * age) * Math.exp(-age * 92) * 0.027;
    }
  }

  signal *= rise * fall;
  const pan = Math.sin(t * 0.51) * 0.09;
  buffer.writeInt16LE(Math.round(clamp(signal * (1 + pan)) * 32767), 44 + index * 4);
  buffer.writeInt16LE(Math.round(clamp(signal * (1 - pan)) * 32767), 46 + index * 4);
}

mkdirSync('public/audio', {recursive: true});
writeFileSync('public/audio/human-engineering.wav', buffer);
console.log(`Generated public/audio/human-engineering.wav (${duration}s, ${sampleRate} Hz stereo PCM)`);
