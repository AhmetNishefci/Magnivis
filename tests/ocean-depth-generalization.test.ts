import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {describe, expect, it} from 'vitest';
import {
  oceanDepthContentAssetIds,
  oceanDepthPublishedScriptSegmentIds,
  oceanDepthPublishedShortAsset,
} from '../src/content-assets/assets/ocean-depth';
import {contentAssetRegistry} from '../src/content-assets/registry';
import {contentAssetSchema} from '../src/content-assets/schema';
import {oceanDepth, oceanDepthFrames} from '../src/content/videos/ocean-depth';
import {oceanScale} from '../src/data/ocean';
import {
  oceanDepthClaimIds,
  oceanDepthHookIds,
  oceanDepthKnowledgePackage,
} from '../src/knowledge/packages/ocean-depth';
import {knowledgePackageRegistry} from '../src/knowledge/registry';
import {knowledgePackageSchema} from '../src/knowledge/schema';

const sha256 = (file: string) => createHash('sha256')
  .update(readFileSync(file))
  .digest('hex');

describe('Ocean Depth production KnowledgePackage', () => {
  it('validates authoritative mixed quantitative and qualitative research', () => {
    const parsed = knowledgePackageSchema.parse(oceanDepthKnowledgePackage);
    expect(parsed.id).toBe('ocean-depth');
    expect(parsed.taxonomy).toEqual({
      pillar: 'earth-nature',
      domains: ['oceanography', 'marine-science'],
      topics: ['ocean-light-zones', 'ocean-depth', 'challenger-deep', 'mount-everest'],
    });
    expect(parsed.timeliness).toBe('evergreen');
    expect(parsed.editorialStatus).toBe('approved');
    expect(parsed.sources).toHaveLength(4);
    expect(parsed.claims).toHaveLength(7);
    expect(parsed.claims.filter(({type}) => type === 'quantitative')).toHaveLength(5);
    expect(parsed.claims.filter(({type}) => type === 'qualitative')).toHaveLength(2);
  });

  it('keeps numeric precision separate from verification status', () => {
    const range = oceanDepthKnowledgePackage.claims.find(
      ({id}) => id === oceanDepthClaimIds.lightZoneRange,
    );
    const challenger = oceanDepthKnowledgePackage.claims.find(
      ({id}) => id === oceanDepthClaimIds.challengerDepth,
    );
    expect(range?.verificationStatus).toBe('verified');
    expect(challenger?.verificationStatus).toBe('verified');
    if (range?.type !== 'quantitative' || range.quantity.kind !== 'range') {
      throw new Error('Expected light-zone range');
    }
    if (challenger?.type !== 'quantitative' || challenger.quantity.kind !== 'scalar') {
      throw new Error('Expected Challenger Deep scalar');
    }
    expect(range.quantity.precision).toBe('approximate');
    expect(challenger.quantity.precision).toBe('approximate');
    expect(challenger.quantity.uncertainty?.plusMinus).toBe(6);
  });

  it('preserves scientific context and the published-production discrepancy', () => {
    const light = oceanDepthKnowledgePackage.claims.find(
      ({id}) => id === oceanDepthClaimIds.lightZoneContext,
    );
    const challenger = oceanDepthKnowledgePackage.claims.find(
      ({id}) => id === oceanDepthClaimIds.challengerDepth,
    );
    expect(light?.caveats.join(' ')).toMatch(/continuously/);
    expect(light?.caveats.join(' ')).toMatch(/bioluminescent/);
    expect(challenger?.caveats.join(' ')).toMatch(/survey-specific/);
    expect(oceanDepthKnowledgePackage.approval?.notes).toMatch(/total darkness/i);
  });

  it('coexists deterministically with Speed of Light without source collisions', () => {
    expect(knowledgePackageRegistry.list().map(({id}) => id)).toEqual([
      'ocean-depth',
      'phantom-traffic',
      'speed-of-light',
      'wood-frog-freeze-tolerance',
    ]);
    const sourceIds = knowledgePackageRegistry.listSources().map(({id}) => id);
    expect(new Set(sourceIds).size).toBe(sourceIds.length);
    expect(sourceIds.every((id) => id.startsWith('source.'))).toBe(true);
  });
});

describe('Ocean Depth production ContentAsset', () => {
  it('validates its hook, claims, script traceability and visual plan', () => {
    const parsed = contentAssetSchema.parse(oceanDepthPublishedShortAsset);
    expect(parsed.id).toBe(oceanDepthContentAssetIds.publishedShort);
    expect(parsed.knowledgePackageId).toBe(oceanDepthKnowledgePackage.id);
    expect(parsed.hookId).toBe(oceanDepthHookIds.everestDisappears);
    expect(parsed.editorialStatus).toBe('production-ready');
    expect(parsed.script.segments.filter(({type}) => type === 'factual'))
      .toHaveLength(6);
    expect(parsed.visualPlan).toHaveLength(5);
  });

  it('maps every production narration line to one stable script segment', () => {
    const expected = [
      [oceanDepthPublishedScriptSegmentIds.hook, 'The deepest ocean could swallow Mount Everest.'],
      [oceanDepthPublishedScriptSegmentIds.light, 'After two hundred meters, sunlight is already fading.'],
      [oceanDepthPublishedScriptSegmentIds.dark, 'At one thousand meters, it disappears.'],
      [oceanDepthPublishedScriptSegmentIds.average, 'The average ocean is nearly three point seven kilometers deep.'],
      [oceanDepthPublishedScriptSegmentIds.everest, 'Now place Mount Everest on the bottom.'],
      [oceanDepthPublishedScriptSegmentIds.clearance, 'Its summit would still be more than two kilometers underwater.'],
      [oceanDepthPublishedScriptSegmentIds.coda, 'Challenger Deep. Nearly eleven kilometers below the surface.'],
    ];
    expect(oceanDepthPublishedShortAsset.script.segments.map(({id, text}) => [id, text]))
      .toEqual(expected);
  });

  it('is registered against the Ocean Depth package with valid references', () => {
    expect(contentAssetRegistry.get(oceanDepthContentAssetIds.publishedShort))
      .toEqual(oceanDepthPublishedShortAsset);
    expect(contentAssetRegistry.listByKnowledgePackage('ocean-depth')).toEqual([
      oceanDepthPublishedShortAsset,
    ]);
  });
});

describe('published Ocean Depth production regression', () => {
  it('preserves composition, format, scenes, captions, publication and runtime', () => {
    expect({
      compositionId: oceanDepth.compositionId,
      hook: oceanDepth.hook,
      format: oceanDepth.format,
      scenes: oceanDepth.scenes,
      captions: oceanDepth.captions,
      publication: oceanDepth.publication,
      frames: oceanDepthFrames,
    }).toEqual({
      compositionId: 'Magnivis-Ocean-Depth',
      hook: 'EVEREST WOULD DISAPPEAR.',
      format: {width: 1080, height: 1920, fps: 30, durationSeconds: 32},
      scenes: [
        {id: 'hook', start: 0, end: 3.2, purpose: 'Show the entire contradiction in frame one.'},
        {id: 'sunlight', start: 2.7, end: 7.2, purpose: 'Descend past the zone where significant sunlight becomes rare.'},
        {id: 'darkness', start: 6.7, end: 11.2, purpose: 'Cross into the aphotic ocean below about 1,000 meters.'},
        {id: 'average-depth', start: 10.7, end: 16.2, purpose: 'Pass the approximate global average ocean depth.'},
        {id: 'everest', start: 15.7, end: 24.2, purpose: 'Place Everest on the trench floor using one shared vertical scale.'},
        {id: 'challenger-deep', start: 23.7, end: 29.5, purpose: 'Name the deepest point and reveal the remaining water above Everest.'},
        {id: 'coda', start: 29, end: 32, purpose: 'End immediately on the 2.1-kilometer clearance reframe.'},
      ],
      captions: [{
        language: 'en',
        label: 'English',
        file: 'captions/ocean-depth.en.vtt',
      }],
      publication: {
        platform: 'youtube',
        videoId: 'rfVe_wqDKAQ',
        publicUrl: 'https://www.youtube.com/shorts/rfVe_wqDKAQ',
        publishedDate: '2026-09-24',
      },
      frames: 960,
    });
  });

  it('preserves every narration cue and audio input', () => {
    expect(oceanDepth.audio).toEqual({
      file: 'audio/ocean-depth.wav',
      layers: ['ambient', 'transition', 'impact', 'narration'],
      narration: true,
      narrationCues: [
        {id: 'hook', file: 'audio/narration/ocean-depth/hook.wav', start: 0.05, transcript: 'The deepest ocean could swallow Mount Everest.'},
        {id: 'light', file: 'audio/narration/ocean-depth/light.wav', start: 3.15, transcript: 'After two hundred meters, sunlight is already fading.'},
        {id: 'dark', file: 'audio/narration/ocean-depth/dark.wav', start: 7.35, transcript: 'At one thousand meters, it disappears.'},
        {id: 'average', file: 'audio/narration/ocean-depth/average.wav', start: 11.1, transcript: 'The average ocean is nearly three point seven kilometers deep.'},
        {id: 'everest', file: 'audio/narration/ocean-depth/everest.wav', start: 16.25, transcript: 'Now place Mount Everest on the bottom.'},
        {id: 'clearance', file: 'audio/narration/ocean-depth/clearance.wav', start: 20.15, transcript: 'Its summit would still be more than two kilometers underwater.'},
        {id: 'coda', file: 'audio/narration/ocean-depth/coda.wav', start: 26.2, transcript: 'Challenger Deep. Nearly eleven kilometers below the surface.'},
      ],
    });
  });

  it('preserves every numeric composition input while deriving it from claims', () => {
    expect(oceanScale).toEqual({
      significantLightBoundary: 200,
      noSurfaceLightBoundary: 1000,
      averageDepth: 3682,
      challengerDepth: 10935,
      everestHeight: 8848.86,
      summitClearance: 10935 - 8848.86,
      everestFractionOfChallenger: 8848.86 / 10935,
    });
  });

  it('links Video 002 to its content asset without retaining legacy fact IDs', () => {
    expect(oceanDepth.factIds).toEqual([]);
    expect(oceanDepth.contentAssetId).toBe(oceanDepthContentAssetIds.publishedShort);
  });

  it('preserves the reviewed caption and soundscape source artifacts', () => {
    expect(sha256('captions/ocean-depth.en.vtt')).toBe(
      'c2bea098fd431e9656c021dc380d6f642ea5bcafca786d4ffb8b713536c99d83',
    );
    expect(sha256('public/audio/ocean-depth.wav')).toBe(
      '3f08f9a2e5289332de985876284f54d2c81353d457a7cfd174c8711e9704cfcc',
    );
  });
});
