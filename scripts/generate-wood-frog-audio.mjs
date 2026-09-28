import {Buffer} from 'node:buffer';
import console from 'node:console';
import {mkdirSync, writeFileSync} from 'node:fs';

const sampleRate = 48000;
const duration = 39;
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

const transitions = [4.55, 10.15, 18.8, 28.8];
const coldPulses = [0.18, 1.02, 2.02, 3.22];
const recoveredPulses = [30.4, 31.25, 32.04, 32.8, 33.54, 34.27, 34.98, 35.68, 36.37, 37.05];
const clamp = (value) => Math.max(-1, Math.min(1, value));
const smoothstep = (value) => {
  const x = Math.max(0, Math.min(1, value));
  return x * x * (3 - 2 * x);
};
const noise = (index) => {
  const value = Math.sin(index * 19.173 + 47.121) * 43758.5453;
  return (value - Math.floor(value)) * 2 - 1;
};

for (let index = 0; index < sampleCount; index += 1) {
  const t = index / sampleRate;
  const fadeIn = smoothstep(t / 0.35);
  const fadeOut = 1 - smoothstep((t - 38.15) / 0.85);
  const thaw = smoothstep((t - 28.5) / 6.5);
  const cold = 1 - thaw;
  let signal =
    Math.sin(Math.PI * 2 * 47 * t) * 0.018
    + Math.sin(Math.PI * 2 * 94 * t + 0.8) * 0.009
    + Math.sin(Math.PI * 2 * (176 + thaw * 42) * t + 1.7) * (0.004 + thaw * 0.004);

  signal += noise(index) * (0.0032 + cold * 0.0024);

  for (const transition of transitions) {
    const age = t - transition;
    if (age >= 0 && age < 1.25) {
      const envelope = Math.sin(Math.PI * age / 1.25) ** 2;
      signal += Math.sin(Math.PI * 2 * (310 + age * 280) * age) * envelope * 0.011;
      signal += noise(index + Math.round(transition * 1000)) * envelope * 0.006;
    }
  }

  for (const pulse of coldPulses) {
    const age = t - pulse;
    if (age >= 0 && age < 0.34) {
      signal += Math.sin(Math.PI * 2 * (70 - age * 20) * age) * Math.exp(-age * 13) * 0.065;
    }
  }
  for (const pulse of recoveredPulses) {
    const age = t - pulse;
    if (age >= 0 && age < 0.3) {
      signal += Math.sin(Math.PI * 2 * 73 * age) * Math.exp(-age * 14) * 0.048;
    }
  }

  const protection = Math.sin(Math.PI * 2 * 264 * t + Math.sin(t * 0.4)) * 0.0045
    * smoothstep((t - 19) / 2) * (1 - smoothstep((t - 29) / 1.2));
  signal = (signal + protection) * fadeIn * fadeOut;
  const pan = Math.sin(t * 0.37) * 0.09;
  buffer.writeInt16LE(Math.round(clamp(signal * (1 + pan)) * 32767), 44 + index * 4);
  buffer.writeInt16LE(Math.round(clamp(signal * (1 - pan)) * 32767), 46 + index * 4);
}

mkdirSync('public/audio', {recursive: true});
writeFileSync('public/audio/wood-frog.wav', buffer);
console.log(`Generated public/audio/wood-frog.wav (${duration}s, ${sampleRate} Hz stereo PCM)`);
