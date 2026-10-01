import {longitudePlatformVariants} from '../src/platform-variants/variants/longitude-clock';
import {phantomTrafficPlatformVariants} from '../src/platform-variants/variants/phantom-traffic';
import {describe, expect, it} from 'vitest';
import {speedOfLightPublishedShortAsset} from '../src/content-assets/assets/speed-of-light';
import {woodFrogApprovedContentAsset} from '../src/content-assets/assets/wood-frog-approved';
import {videoSpecSchema} from '../src/content/schema';
import {
  speedOfLight,
  speedOfLightTiktok,
} from '../src/content/videos/speed-of-light';
import {
  safeAreaContains,
  safeAreaProfileIds,
  safeAreaProfileRegistry,
} from '../src/design/safe-areas';
import {
  platformProfileIds,
  platformProfileRegistry,
} from '../src/platform-variants/platform-profiles';
import {
  createPlatformVariantRegistry,
  platformVariantRegistry,
} from '../src/platform-variants/registry';
import {platformVariantSchema} from '../src/platform-variants/schema';
import {
  speedOfLightFacebookVariant,
  speedOfLightInstagramVariant,
  speedOfLightPlatformVariants,
  speedOfLightTiktokVariant,
  speedOfLightYoutubeShortsVariant,
} from '../src/platform-variants/variants/speed-of-light';
import {
  woodFrogFacebookReviewVariant,
  woodFrogInstagramReviewVariant,
  woodFrogPlatformVariants,
  woodFrogTiktokReviewVariant,
  woodFrogYoutubeReviewVariant,
} from '../src/platform-variants/variants/wood-frog';

const cloneYoutubeVariant = () => structuredClone(speedOfLightYoutubeShortsVariant);

describe('PlatformVariant V1 schema and registry', () => {
  it('validates the production Speed of Light YouTube variant', () => {
    expect(platformVariantSchema.parse(speedOfLightYoutubeShortsVariant)).toEqual(
      speedOfLightYoutubeShortsVariant,
    );
  });

  it('rejects an invalid ContentAsset reference', () => {
    const candidate = cloneYoutubeVariant();
    candidate.contentAssetId = 'speed-of-light.asset.missing';
    candidate.id = `${candidate.contentAssetId}.variant.youtube-shorts`;
    expect(() => createPlatformVariantRegistry([candidate])).toThrow(
      'Unknown content asset: speed-of-light.asset.missing',
    );
  });

  it('rejects duplicate variant IDs', () => {
    expect(() => createPlatformVariantRegistry([
      speedOfLightYoutubeShortsVariant,
      structuredClone(speedOfLightYoutubeShortsVariant),
    ])).toThrow(`Duplicate platform variant ID: ${speedOfLightYoutubeShortsVariant.id}`);
  });

  it('rejects unsupported platforms', () => {
    expect(platformVariantSchema.safeParse({
      ...speedOfLightYoutubeShortsVariant,
      platform: 'snapchat',
    }).success).toBe(false);
  });

  it('rejects an invalid safe-area reference', () => {
    expect(() => createPlatformVariantRegistry([{
      ...speedOfLightYoutubeShortsVariant,
      safeAreaProfileId: safeAreaProfileIds.tiktokFeed,
    }])).toThrow('Invalid safe-area profile');
  });

  it('requires approval metadata for approved and production-ready variants', () => {
    const candidate = cloneYoutubeVariant() as Record<string, unknown>;
    delete candidate.approval;
    expect(platformVariantSchema.safeParse(candidate).success).toBe(false);

    expect(platformVariantSchema.safeParse({
      ...speedOfLightTiktokVariant,
      status: 'draft',
    }).success).toBe(true);
  });

  it('rejects packaging claims not selected by the ContentAsset', () => {
    expect(() => createPlatformVariantRegistry([{
      ...speedOfLightYoutubeShortsVariant,
      packaging: {
        ...speedOfLightYoutubeShortsVariant.packaging,
        claimIds: ['speed-of-light.claim.not-selected'],
      },
    }])).toThrow('references an unselected asset claim');
  });

  it('supports four adaptations from one ContentAsset', () => {
    expect(speedOfLightPlatformVariants).toHaveLength(4);
    expect(new Set(speedOfLightPlatformVariants.map(({contentAssetId}) => contentAssetId))).toEqual(
      new Set([speedOfLightPublishedShortAsset.id]),
    );
    expect(new Set(speedOfLightPlatformVariants.map(({platform}) => platform))).toEqual(
      new Set(['youtube', 'tiktok', 'instagram', 'facebook']),
    );
  });

  it('provides deterministic lookup and sorted listing', () => {
    expect(platformVariantRegistry.get(speedOfLightYoutubeShortsVariant.id)).toEqual(
      speedOfLightYoutubeShortsVariant,
    );
    expect(platformVariantRegistry.list().map(({id}) => id)).toEqual(
      [...speedOfLightPlatformVariants, ...woodFrogPlatformVariants, ...phantomTrafficPlatformVariants, ...longitudePlatformVariants].map(({id}) => id).sort(),
    );
    expect(platformVariantRegistry.listByContentAsset(
      speedOfLightPublishedShortAsset.id,
    )).toHaveLength(4);
  });

  it('registers four Wood Frog variants without granting publication approval', () => {
    expect(woodFrogPlatformVariants).toHaveLength(4);
    expect(platformVariantRegistry.listByContentAsset(woodFrogApprovedContentAsset.id)).toHaveLength(4);
    expect(new Set(woodFrogPlatformVariants.map(({platform}) => platform))).toEqual(
      new Set(['youtube', 'tiktok', 'instagram', 'facebook']),
    );
    for (const variant of woodFrogPlatformVariants) {
      expect(variant.previewStatus).toBe('ready-for-private-preview');
      expect(variant.status).toBe('editorial-review');
      expect(variant.productionIntent.platformPreviewRequired).toBe(true);
      expect(variant.captions.designedBurnedIn).toBe(true);
      expect(variant.sourceMaster?.artifact.sha256).toBe(
        '4c5354d9368908f11f5f9b5767371694c2e51ad895786b2c31f7e329b83eaac2',
      );
    }
  });

  it('isolates TikTok safe-area rendering while other Wood Frog surfaces reuse the lock', () => {
    expect(woodFrogTiktokReviewVariant).toMatchObject({
      safeAreaProfileId: safeAreaProfileIds.tiktokFeed,
      productionIntent: {renderStrategy: 'new-render', videoSpecId: 'wood-frog-tiktok'},
      sourceMaster: {relationship: 'platform-safe-area-derivative'},
    });
    for (const variant of [
      woodFrogYoutubeReviewVariant,
      woodFrogInstagramReviewVariant,
      woodFrogFacebookReviewVariant,
    ]) {
      expect(variant.productionIntent.renderStrategy).toBe('reuse-existing-master');
      expect(variant.sourceMaster?.relationship).toBe('exact-master');
    }
  });

  it('keeps production references mutually exclusive', () => {
    expect(videoSpecSchema.safeParse({
      ...speedOfLight,
      contentAssetId: speedOfLightPublishedShortAsset.id,
    }).success).toBe(false);
    expect(videoSpecSchema.safeParse({
      ...speedOfLight,
      platformVariantId: undefined,
    }).success).toBe(false);
  });

  it('preserves meaningful packaging and review differences', () => {
    expect(speedOfLightYoutubeShortsVariant.packaging.title).toBeDefined();
    expect(speedOfLightYoutubeShortsVariant.captions.behavior).toBe('external-track');
    expect(speedOfLightYoutubeShortsVariant.status).toBe('production-ready');

    for (const variant of [speedOfLightInstagramVariant, speedOfLightFacebookVariant]) {
      expect(variant.packaging.caption).toBeDefined();
      expect(variant.captions.behavior).toBe('platform-generated');
      expect(variant.productionIntent.platformPreviewRequired).toBe(true);
      expect(variant.status).toBe('editorial-review');
    }
    expect(speedOfLightTiktokVariant.packaging.caption).toBeDefined();
    expect(speedOfLightTiktokVariant.captions.behavior).toBe('platform-generated');
    expect(speedOfLightTiktokVariant.packaging.caption).not.toBe(
      speedOfLightInstagramVariant.packaging.caption,
    );
    expect(speedOfLightInstagramVariant.packaging.cta).not.toBe(
      speedOfLightFacebookVariant.packaging.cta,
    );
    expect(speedOfLightTiktokVariant).toMatchObject({
      revision: 2,
      status: 'production-ready',
      safeAreaProfileId: safeAreaProfileIds.tiktokFeed,
      productionIntent: {
        renderStrategy: 'new-render',
        videoSpecId: speedOfLightTiktok.id,
        platformPreviewRequired: false,
      },
      approval: {
        approvedBy: 'Magnivis human real-device review',
        approvedAt: '2026-09-27',
      },
    });
    expect(speedOfLightYoutubeShortsVariant.productionIntent.videoSpecId).toBe(
      speedOfLight.id,
    );
  });
});

describe('versioned platform and safe-area profiles', () => {
  it('registers one dated constraint profile for each V1 surface', () => {
    expect(platformProfileRegistry.list().map(({id}) => id)).toEqual(
      Object.values(platformProfileIds).sort(),
    );
    expect(platformProfileRegistry.list().every(
      ({reviewedAt, sourceUrls}) => reviewedAt === '2026-09-27' && sourceUrls.length > 0,
    )).toBe(true);
  });

  it('keeps the reviewed master inside unchanged surfaces and isolates TikTok V2', () => {
    const master = safeAreaProfileRegistry.get(safeAreaProfileIds.verticalShortMaster);
    for (const id of [
      safeAreaProfileIds.youtubeShorts,
      safeAreaProfileIds.instagramReels,
      safeAreaProfileIds.facebookReels,
    ]) {
      expect(safeAreaContains(safeAreaProfileRegistry.get(id), master)).toBe(true);
    }

    const tiktokV1 = safeAreaProfileRegistry.get(safeAreaProfileIds.tiktokFeedV1);
    const tiktokV2 = safeAreaProfileRegistry.get(safeAreaProfileIds.tiktokFeed);
    expect(tiktokV1.insets).toEqual({top: 140, right: 190, bottom: 300, left: 72});
    expect(tiktokV1.notes).toMatch(/superseded/i);
    expect(tiktokV2).toMatchObject({
      revision: 2,
      insets: {top: 240, right: 190, bottom: 310, left: 84},
    });
    expect(tiktokV2.notes).toMatch(/passed private real-device QA/i);
    expect(safeAreaContains(tiktokV2, master)).toBe(false);
    expect(tiktokV2.insets.top - master.insets.top).toBe(90);
    expect({...tiktokV2.insets, top: master.insets.top}).toEqual(master.insets);
  });
});
