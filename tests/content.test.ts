import {describe, expect, it} from 'vitest';
import {billionDollars, billionDollarsFrames} from '../src/content/videos/billion-dollars';
import {earthToStars, earthToStarsFrames} from '../src/content/videos/earth-to-stars';
import {oceanDepth, oceanDepthFrames} from '../src/content/videos/ocean-depth';
import {speedOfLight, speedOfLightFrames} from '../src/content/videos/speed-of-light';
import {astronomyFacts, astronomySources, scaleRatios} from '../src/data/astronomy';
import {moneyFacts, moneyScale, moneySources} from '../src/data/money';
import {oceanFacts, oceanScale, oceanSources} from '../src/data/ocean';
import {lightFacts, lightScale, lightSources} from '../src/data/light';

describe('earth-to-stars specification', () => {
  it('has an exact frame count', () => {
    expect(earthToStarsFrames).toBe(1260);
    expect(earthToStars.format.durationSeconds).toBe(42);
  });

  it('keeps scenes within the composition', () => {
    for (const scene of earthToStars.scenes) {
      expect(scene.start).toBeGreaterThanOrEqual(0);
      expect(scene.end).toBeLessThanOrEqual(earthToStars.format.durationSeconds);
      expect(scene.end).toBeGreaterThan(scene.start);
    }
  });

  it('references only committed facts', () => {
    const factIds = new Set(astronomyFacts.map((fact) => fact.id));
    expect(earthToStars.factIds.every((id) => factIds.has(id))).toBe(true);
  });

  it('keeps narration cues ordered and inside the composition', () => {
    expect(earthToStars.audio.narration).toBe(true);
    const starts = earthToStars.audio.narrationCues.map((cue) => cue.start);
    expect(starts).toEqual([...starts].sort((a, b) => a - b));
    expect(starts.every((start) => start < earthToStars.format.durationSeconds)).toBe(true);
  });

  it('declares a caption track matching the video language', () => {
    expect(earthToStars.captions).toContainEqual({
      language: earthToStars.language,
      label: 'English',
      file: 'captions/earth-to-stars.en.vtt',
    });
  });

  it('records the canonical publication when published', () => {
    expect(earthToStars.status).toBe('published');
    expect(earthToStars.publication).toEqual({
      platform: 'youtube',
      videoId: 'bvgmCR2Dtcs',
      publicUrl: 'https://www.youtube.com/shorts/bvgmCR2Dtcs',
      publishedDate: '2026-09-22',
    });
  });
});

describe('ocean-depth specification', () => {
  it('has the faster approved frame count', () => {
    expect(oceanDepthFrames).toBe(960);
    expect(oceanDepth.format.durationSeconds).toBe(32);
  });

  it('keeps scenes and narration inside the composition', () => {
    for (const scene of oceanDepth.scenes) {
      expect(scene.start).toBeGreaterThanOrEqual(0);
      expect(scene.end).toBeLessThanOrEqual(oceanDepth.format.durationSeconds);
      expect(scene.end).toBeGreaterThan(scene.start);
    }
    const starts = oceanDepth.audio.narrationCues.map((cue) => cue.start);
    expect(starts).toEqual([...starts].sort((a, b) => a - b));
    expect(starts.every((start) => start < oceanDepth.format.durationSeconds)).toBe(true);
  });

  it('references only committed ocean facts', () => {
    const factIds = new Set(oceanFacts.map((fact) => fact.id));
    expect(oceanDepth.factIds.every((id) => factIds.has(id))).toBe(true);
  });

  it('derives the Everest comparison from authoritative base values', () => {
    expect(oceanScale.challengerDepth).toBe(10935);
    expect(oceanScale.everestHeight).toBe(8848.86);
    expect(oceanScale.summitClearance).toBeCloseTo(2086.14, 2);
    expect(oceanScale.everestFractionOfChallenger).toBeCloseTo(0.8092, 4);
  });

  it('declares its English timed caption track', () => {
    expect(oceanDepth.captions).toContainEqual({
      language: 'en',
      label: 'English',
      file: 'captions/ocean-depth.en.vtt',
    });
  });
});

describe('billion-dollars specification', () => {
  it('has the intended short frame count', () => {
    expect(billionDollarsFrames).toBe(1050);
    expect(billionDollars.format.durationSeconds).toBe(35);
  });

  it('keeps scenes and narration inside the composition', () => {
    for (const scene of billionDollars.scenes) {
      expect(scene.start).toBeGreaterThanOrEqual(0);
      expect(scene.end).toBeLessThanOrEqual(billionDollars.format.durationSeconds);
      expect(scene.end).toBeGreaterThan(scene.start);
    }
    const starts = billionDollars.audio.narrationCues.map((cue) => cue.start);
    expect(starts).toEqual([...starts].sort((a, b) => a - b));
    expect(starts.every((start) => start < billionDollars.format.durationSeconds)).toBe(true);
  });

  it('references only committed money facts', () => {
    const factIds = new Set(moneyFacts.map((fact) => fact.id));
    expect(billionDollars.factIds.every((id) => factIds.has(id))).toBe(true);
  });

  it('derives the physical billion-dollar comparisons', () => {
    expect(moneyScale.billionNoteCount).toBe(10000000);
    expect(moneyScale.billionWeightKg).toBe(10000);
    expect(moneyScale.blockColumns * moneyScale.blockRows).toBe(1000);
    expect(moneyScale.billionStackHeightM).toBeCloseTo(1109.89, 1);
    expect(moneyScale.billionStackHeightM).toBeGreaterThan(moneyScale.burjHeightM);
  });

  it('declares positioned English captions', () => {
    expect(billionDollars.captions).toContainEqual({
      language: 'en',
      label: 'English',
      file: 'captions/billion-dollars.en.vtt',
    });
  });
});

describe('speed-of-light specification', () => {
  it('has the intended fast frame count', () => {
    expect(speedOfLightFrames).toBe(990);
    expect(speedOfLight.format.durationSeconds).toBe(33);
  });

  it('keeps scenes and narration inside the composition', () => {
    for (const scene of speedOfLight.scenes) {
      expect(scene.start).toBeGreaterThanOrEqual(0);
      expect(scene.end).toBeLessThanOrEqual(speedOfLight.format.durationSeconds);
      expect(scene.end).toBeGreaterThan(scene.start);
    }
    const starts = speedOfLight.audio.narrationCues.map((cue) => cue.start);
    expect(starts).toEqual([...starts].sort((a, b) => a - b));
    expect(starts.every((start) => start < speedOfLight.format.durationSeconds)).toBe(true);
  });

  it('references only committed light facts', () => {
    const factIds = new Set(lightFacts.map((fact) => fact.id));
    expect(speedOfLight.factIds.every((id) => factIds.has(id))).toBe(true);
  });

  it('derives the familiar light-time comparisons', () => {
    expect(lightScale.speedMps).toBe(299792458);
    expect(lightScale.earthLapsPerSecond).toBeCloseTo(7.489, 3);
    expect(lightScale.moonLightTimeSeconds).toBeCloseTo(1.2822, 4);
    expect(lightScale.sunLightTimeMinutes).toBeCloseTo(8.3333, 4);
    expect(lightScale.lightYearKm).toBe(9.46e12);
    expect(lightScale.proximaLightYears).toBe(4.25);
  });

  it('declares positioned English captions', () => {
    expect(speedOfLight.captions).toContainEqual({
      language: 'en',
      label: 'English',
      file: 'captions/speed-of-light.en.vtt',
    });
  });
});

describe('research records', () => {
  it('links every fact to a known authoritative source', () => {
    const sourceIds = new Set(astronomySources.map((source) => source.id));
    for (const fact of astronomyFacts) {
      expect(fact.sourceIds.every((id) => sourceIds.has(id))).toBe(true);
    }
  });

  it('derives expected scale ratios from base values', () => {
    expect(scaleRatios.jupiterToEarth).toBeCloseTo(10.973, 3);
    expect(scaleRatios.sunToJupiter).toBeCloseTo(9.951, 3);
    expect(scaleRatios.rigelToSun).toBe(50);
    expect(scaleRatios.betelgeuseToSun).toBe(724);
  });

  it('labels uncertain stellar sizes as estimates', () => {
    const stars = astronomyFacts.filter((fact) => fact.unit === 'solar-radii');
    expect(stars.every((fact) => fact.basis === 'estimated' && fact.display.includes('≈'))).toBe(true);
  });

  it('links every ocean fact to a known authoritative source', () => {
    const sourceIds = new Set(oceanSources.map((source) => source.id));
    for (const fact of oceanFacts) {
      expect(fact.sourceIds.every((id) => sourceIds.has(id))).toBe(true);
    }
  });

  it('links every money fact to a known authoritative source', () => {
    const sourceIds = new Set(moneySources.map((source) => source.id));
    for (const fact of moneyFacts) {
      expect(fact.sourceIds.every((id) => sourceIds.has(id))).toBe(true);
    }
  });

  it('links every light fact to a known authoritative source', () => {
    const sourceIds = new Set(lightSources.map((source) => source.id));
    for (const fact of lightFacts) {
      expect(fact.sourceIds.every((id) => sourceIds.has(id))).toBe(true);
    }
  });
});
