import {describe, expect, it} from 'vitest';
import {
  speedOfLightContentAssetIds,
  speedOfLightCosmicDistanceAsset,
  speedOfLightPublishedShortAsset,
} from '../src/content-assets/assets/speed-of-light';
import {
  contentAssetRegistry,
  createContentAssetRegistry,
} from '../src/content-assets/registry';
import {contentAssetSchema} from '../src/content-assets/schema';
import {speedOfLightClaimIds, speedOfLightHookIds} from '../src/knowledge/packages/speed-of-light';
import {
  oceanDepthContentAssetIds,
  oceanDepthPublishedShortAsset,
} from '../src/content-assets/assets/ocean-depth';

const clonePublishedAsset = () => structuredClone(speedOfLightPublishedShortAsset);

const reidentifyAsset = (
  asset: ReturnType<typeof clonePublishedAsset>,
  newId: string,
  packageId = asset.knowledgePackageId,
) => {
  const oldId = asset.id;
  const replaceId = (id: string) => id.replace(oldId, newId);
  asset.id = newId;
  asset.knowledgePackageId = packageId;
  asset.script.segments.forEach((segment) => {
    segment.id = replaceId(segment.id);
  });
  asset.narrativeStructure.forEach((beat) => {
    beat.id = replaceId(beat.id);
    beat.scriptSegmentIds = beat.scriptSegmentIds.map(replaceId);
  });
  asset.visualPlan.forEach((visual) => {
    visual.id = replaceId(visual.id);
    visual.narrativeBeatId = replaceId(visual.narrativeBeatId);
    visual.scriptSegmentIds = visual.scriptSegmentIds.map(replaceId);
  });
  return asset;
};

describe('Content Asset V1 schema', () => {
  it('validates the published Speed of Light asset', () => {
    const parsed = contentAssetSchema.parse(speedOfLightPublishedShortAsset);
    expect(parsed.id).toBe(speedOfLightContentAssetIds.publishedShort);
    expect(parsed.assetType).toBe('short-form-video');
    expect(parsed.editorialStatus).toBe('production-ready');
  });

  it('rejects unsupported asset types', () => {
    expect(contentAssetSchema.safeParse({
      ...speedOfLightPublishedShortAsset,
      assetType: 'article',
    }).success).toBe(false);
  });

  it('rejects factual script references outside the selected claim set', () => {
    const candidate = clonePublishedAsset();
    const firstSegment = candidate.script.segments[0]!;
    if (firstSegment.type !== 'factual') throw new Error('Expected factual segment');
    firstSegment.claimIds = ['speed-of-light.claim.missing'];
    expect(contentAssetSchema.safeParse(candidate).success).toBe(false);
  });

  it('validates a structured visual plan linked to beats, script and claims', () => {
    const parsed = contentAssetSchema.parse(speedOfLightCosmicDistanceAsset);
    const beatIds = new Set(parsed.narrativeStructure.map(({id}) => id));
    const scriptIds = new Set(parsed.script.segments.map(({id}) => id));
    expect(parsed.visualPlan.every(({narrativeBeatId}) =>
      beatIds.has(narrativeBeatId))).toBe(true);
    expect(parsed.visualPlan.flatMap(({scriptSegmentIds}) => scriptSegmentIds)
      .every((id) => scriptIds.has(id))).toBe(true);
  });

  it('validates the distinct second Speed of Light asset', () => {
    const parsed = contentAssetSchema.parse(speedOfLightCosmicDistanceAsset);
    expect(parsed.id).toBe(speedOfLightContentAssetIds.cosmicDistanceShort);
    expect(parsed.hookId).toBe(speedOfLightHookIds.nearestStarQuestion);
    expect(parsed.hookId).not.toBe(speedOfLightPublishedShortAsset.hookId);
    expect(parsed.editorialStatus).toBe('draft');
    expect(parsed.selectedClaimIds).not.toContain(speedOfLightClaimIds.earthLapsPerSecond);
    expect(parsed.selectedClaimIds).not.toContain(speedOfLightClaimIds.moonLightTime);
  });

  it('requires approval metadata before production readiness', () => {
    const candidate = clonePublishedAsset();
    const withoutApproval = {...candidate};
    delete withoutApproval.approval;
    expect(contentAssetSchema.safeParse(withoutApproval).success).toBe(false);
  });
});

describe('content asset registry', () => {
  it('supports multiple assets backed by one KnowledgePackage', () => {
    const assets = contentAssetRegistry.listByKnowledgePackage('speed-of-light');
    expect(assets.map(({id}) => id)).toEqual([
      speedOfLightContentAssetIds.cosmicDistanceShort,
      speedOfLightContentAssetIds.publishedShort,
    ]);
    expect(new Set(assets.map(({knowledgePackageId}) => knowledgePackageId)).size).toBe(1);
  });

  it('rejects duplicate asset IDs', () => {
    expect(() => createContentAssetRegistry([
      speedOfLightPublishedShortAsset,
      structuredClone(speedOfLightPublishedShortAsset),
    ])).toThrow(`Duplicate content asset ID: ${speedOfLightContentAssetIds.publishedShort}`);
  });

  it('rejects an invalid KnowledgePackage reference', () => {
    const candidate = reidentifyAsset(
      clonePublishedAsset(),
      'missing-package.asset.test',
      'missing-package',
    );
    expect(() => createContentAssetRegistry([candidate])).toThrow(
      'Unknown knowledge package: missing-package',
    );
  });

  it('rejects an invalid selected claim reference', () => {
    const candidate = clonePublishedAsset();
    candidate.selectedClaimIds.push('speed-of-light.claim.missing');
    candidate.visualPlan[0]!.claimIds.push('speed-of-light.claim.missing');
    expect(() => createContentAssetRegistry([candidate])).toThrow(
      'Unknown claim speed-of-light.claim.missing',
    );
  });

  it('rejects an invalid hook reference', () => {
    const candidate = clonePublishedAsset();
    candidate.hookId = 'speed-of-light.hook.missing';
    expect(() => createContentAssetRegistry([candidate])).toThrow(
      'Unknown hook speed-of-light.hook.missing',
    );
  });

  it('provides deterministic lookup and listing', () => {
    expect(contentAssetRegistry.get(speedOfLightContentAssetIds.publishedShort))
      .toEqual(speedOfLightPublishedShortAsset);
    expect(contentAssetRegistry.list().map(({id}) => id)).toEqual([
      oceanDepthContentAssetIds.publishedShort,
      speedOfLightContentAssetIds.cosmicDistanceShort,
      speedOfLightContentAssetIds.publishedShort,
      'wood-frog-freeze-tolerance.asset.how-freezing-works',
    ]);
    expect(contentAssetRegistry.get(oceanDepthContentAssetIds.publishedShort))
      .toEqual(oceanDepthPublishedShortAsset);
  });

  it('selects every claim required by the chosen package hook', () => {
    const asset = contentAssetRegistry.get(speedOfLightContentAssetIds.cosmicDistanceShort);
    expect(asset.selectedClaimIds).toEqual(expect.arrayContaining([
      speedOfLightClaimIds.vacuumSpeed,
      speedOfLightClaimIds.proximaDistance,
    ]));
  });
});
