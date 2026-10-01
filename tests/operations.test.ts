import {describe, expect, it} from 'vitest';
import {
  instagramPrimaryAccount,
  youtubePrimaryAccount,
} from '../src/operations/platform-accounts';
import {speedOfLightYoutubePublication} from '../src/operations/publications';
import {
  createMetricSnapshotRegistry,
  createPlatformAccountRegistry,
  createPublicationRegistry,
  metricSnapshotRegistry,
  platformAccountRegistry,
  publicationRegistry,
} from '../src/operations/registry';
import {
  metricSnapshotSchema,
  platformAccountSchema,
  publicationRecordSchema,
} from '../src/operations/schema';

const snapshot = {
  id: 'metric-snapshot.youtube.speed-of-light.initial',
  revision: 1,
  publicationId: speedOfLightYoutubePublication.id,
  capturedAt: '2026-09-28T18:00:00.000Z',
  source: {
    kind: 'manual-entry' as const,
    notes: 'Fixture copied from a platform-native analytics view.',
  },
  observationWindow: {
    kind: 'since-publication' as const,
    label: 'First 48 hours',
  },
  metrics: [{
    key: 'views',
    nativeName: 'Views',
    value: 100,
    unit: 'count' as const,
    definition: 'Platform-reported views since publication.',
  }],
};

describe('nonsecret platform account state', () => {
  it('records the confirmed Instagram identity without guessing other handles', () => {
    expect(instagramPrimaryAccount).toMatchObject({
      platform: 'instagram',
      handle: '@magnivis.media',
      bio: 'Understand something fascinating every day. 🌍🧠✨',
      status: 'configured',
    });
    expect(youtubePrimaryAccount.handle).toBeUndefined();
    expect(platformAccountRegistry.list().map(({id}) => id)).toEqual([
      'account.facebook.primary',
      instagramPrimaryAccount.id,
      'account.tiktok.primary',
      youtubePrimaryAccount.id,
    ]);
  });

  it('rejects secret-shaped or otherwise undeclared account fields', () => {
    expect(platformAccountSchema.safeParse({
      ...instagramPrimaryAccount,
      accessToken: 'must-not-be-stored',
    }).success).toBe(false);
  });

  it('rejects duplicate account IDs and platform handles', () => {
    expect(() => createPlatformAccountRegistry([
      instagramPrimaryAccount,
      structuredClone(instagramPrimaryAccount),
    ])).toThrow(/Duplicate platform account ID/);
  });
});

describe('manual publication records', () => {
  it('validates the generalized Speed of Light YouTube publication chain', () => {
    expect(publicationRegistry.get(speedOfLightYoutubePublication.id))
      .toEqual(speedOfLightYoutubePublication);
    expect(speedOfLightYoutubePublication.settings).toMatchObject({
      visibility: 'public',
      aiGeneratedContentDisclosure: 'unknown',
      commercialContentDisclosure: 'unknown',
      captions: 'external-track',
    });
  });

  it('requires remote identity, date and ready delivery for published state', () => {
    const missingRemote = structuredClone(speedOfLightYoutubePublication) as Record<string, unknown>;
    delete missingRemote.remote;
    expect(publicationRecordSchema.safeParse(missingRemote).success).toBe(false);

    expect(publicationRecordSchema.safeParse({
      ...speedOfLightYoutubePublication,
      source: {
        ...speedOfLightYoutubePublication.source,
        delivery: {
          ...speedOfLightYoutubePublication.source.delivery,
          relationship: 'used-for-upload',
          state: 'draft-review',
        },
      },
    }).success).toBe(false);
  });

  it('rejects mismatched account and source references', () => {
    const accounts = createPlatformAccountRegistry([
      instagramPrimaryAccount,
      youtubePrimaryAccount,
    ]);
    expect(() => createPublicationRegistry([{
      ...speedOfLightYoutubePublication,
      platformAccountId: instagramPrimaryAccount.id,
    }], accounts)).toThrow(/account platform mismatch/);
    expect(() => createPublicationRegistry([{
      ...speedOfLightYoutubePublication,
      source: {
        ...speedOfLightYoutubePublication.source,
        contentAsset: {
          ...speedOfLightYoutubePublication.source.contentAsset,
          revision: 999,
        },
      },
    }], accounts)).toThrow(/source chain mismatch/);
    expect(() => createPublicationRegistry([{
      ...speedOfLightYoutubePublication,
      source: {
        ...speedOfLightYoutubePublication.source,
        delivery: {
          ...speedOfLightYoutubePublication.source.delivery,
          id: 'delivery.speed-of-light.asset.earth-to-proxima.variant.youtube-shorts.r999',
        },
      },
    }], accounts)).toThrow(/source chain mismatch/);
  });
});

describe('raw MetricSnapshot foundation', () => {
  it('accepts platform-native manual metrics without normalization', () => {
    expect(metricSnapshotSchema.parse(snapshot).metrics[0]).toMatchObject({
      nativeName: 'Views',
      unit: 'count',
      value: 100,
    });
    const registry = createMetricSnapshotRegistry([snapshot], publicationRegistry);
    expect(registry.listByPublication(speedOfLightYoutubePublication.id)).toEqual([snapshot]);
  });

  it('rejects dangling publications, duplicate metric keys and invalid windows', () => {
    expect(() => createMetricSnapshotRegistry([{
      ...snapshot,
      publicationId: 'publication.youtube.missing',
    }], publicationRegistry)).toThrow(/Unknown publication/);

    expect(metricSnapshotSchema.safeParse({
      ...snapshot,
      metrics: [snapshot.metrics[0], snapshot.metrics[0]],
    }).success).toBe(false);
    expect(metricSnapshotSchema.safeParse({
      ...snapshot,
      observationWindow: {
        kind: 'custom',
        label: 'Broken window',
        start: '2026-09-29T00:00:00.000Z',
        end: '2026-09-28T00:00:00.000Z',
      },
    }).success).toBe(false);
  });

  it('does not fabricate production metric snapshots', () => {
    expect(metricSnapshotRegistry.list()).toEqual([]);
  });
});
