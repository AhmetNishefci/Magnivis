import {interpolate} from 'remotion';

export const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

export const progress = (frame: number, from: number, to: number) =>
  clamp01((frame - from) / (to - from));

export const easeInOutCubic = (value: number) =>
  value < 0.5 ? 4 * value ** 3 : 1 - (-2 * value + 2) ** 3 / 2;

export const easeOutQuint = (value: number) => 1 - (1 - value) ** 5;

export const mix = (from: number, to: number, value: number) =>
  interpolate(value, [0, 1], [from, to]);

export const sceneOpacity = (
  frame: number,
  start: number,
  end: number,
  fadeIn = 14,
  fadeOut = 14,
) => {
  if (frame < start || frame >= end) return 0;
  const inOpacity = clamp01((frame - start) / fadeIn);
  const outOpacity = clamp01((end - frame) / fadeOut);
  return Math.min(inOpacity, outOpacity);
};

