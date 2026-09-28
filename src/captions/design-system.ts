import type {CSSProperties} from 'react';
import {safeAreaProfileRegistry} from '../design/safe-areas';
import type {CaptionPlacement} from './schema';

export const magnivisCaptionDesignSystem = Object.freeze({
  id: 'caption-design.magnivis-short-form.v1',
  revision: 1,
  maximumLines: 2,
  maximumCharactersPerLine: 38,
  regions: {
    'middle-lower': {left: 110, right: 216, top: 1030, height: 178},
    'lower-safe': {left: 110, right: 216, top: 1418, height: 166},
  } satisfies Record<CaptionPlacement, {
    left: number;
    right: number;
    top: number;
    height: number;
  }>,
  typography: {
    fontSize: 43,
    lineHeight: 1.13,
    fontWeight: 650,
    strongWeight: 800,
  },
  entryFrames: 6,
  exitFrames: 5,
});

export const assertCaptionRegionIsSafe = (
  placement: CaptionPlacement,
  safeAreaProfileId: string,
) => {
  const region = magnivisCaptionDesignSystem.regions[placement];
  const profile = safeAreaProfileRegistry.get(safeAreaProfileId);
  const rightEdge = profile.canvas.width - region.right;
  const bottomEdge = region.top + region.height;
  if (
    region.left < profile.insets.left
    || rightEdge > profile.canvas.width - profile.insets.right
    || region.top < profile.insets.top
    || bottomEdge > profile.canvas.height - profile.insets.bottom
  ) {
    throw new Error(`Caption placement ${placement} is outside ${safeAreaProfileId}`);
  }
  return region;
};

export const captionRegionStyle = (
  placement: CaptionPlacement,
  safeAreaProfileId: string,
): CSSProperties => {
  const region = assertCaptionRegionIsSafe(placement, safeAreaProfileId);
  return {
    position: 'absolute',
    left: region.left,
    right: region.right,
    top: region.top,
    height: region.height,
  };
};
