import {describe, expect, it} from 'vitest';
import {earthToStars, earthToStarsFrames} from '../src/content/videos/earth-to-stars';
import {astronomyFacts, astronomySources, scaleRatios} from '../src/data/astronomy';

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
});

