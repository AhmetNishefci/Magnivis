import {speedOfLightPublishedShortAsset} from '../../content-assets/assets/speed-of-light';
import {safeAreaProfileIds} from '../../design/safe-areas';
import {speedOfLightClaimIds} from '../../knowledge/packages/speed-of-light';
import {platformProfileIds} from '../platform-profiles';
import {platformVariantSchema} from '../schema';

const assetId = speedOfLightPublishedShortAsset.id;

export const speedOfLightPlatformVariantIds = {
  youtubeShorts: `${assetId}.variant.youtube-shorts`,
  tiktokFeed: `${assetId}.variant.tiktok-feed`,
  instagramReels: `${assetId}.variant.instagram-reels`,
  facebookReels: `${assetId}.variant.facebook-reels`,
} as const;

const commonDuration = {
  targetSeconds: 33,
  minimumSeconds: 30,
  maximumSeconds: 60,
} as const;

export const speedOfLightYoutubeShortsVariant = platformVariantSchema.parse({
  id: speedOfLightPlatformVariantIds.youtubeShorts,
  revision: 1,
  contentAssetId: assetId,
  platform: 'youtube',
  surface: 'youtube-shorts',
  platformProfileId: platformProfileIds.youtubeShorts,
  language: 'en',
  packaging: {
    title: 'Light Is Fast — Space Is Bigger',
    description: 'Light travels fast enough to circle Earth about 7.5 times in one second. Yet sunlight still needs about 8 minutes 20 seconds to reach us, and even light takes about 4.25 years to reach Proxima Centauri.\n\nSources: NIST and NASA.\n\nMagnivis — See the unimaginable.',
    hashtags: ['space', 'astronomy', 'science'],
    cta: 'What should Magnivis make visible next?',
    claimIds: [
      speedOfLightClaimIds.earthLapsPerSecond,
      speedOfLightClaimIds.sunLightTime,
      speedOfLightClaimIds.proximaDistance,
    ],
  },
  editorialAdaptationNotes: [
    'Lead with the contrast between familiar speed and interstellar scale.',
    'Keep the description source-aware because YouTube provides durable searchable metadata.',
  ],
  duration: commonDuration,
  aspectRatio: '9:16',
  safeAreaProfileId: safeAreaProfileIds.youtubeShorts,
  cover: {
    strategy: 'frame-selection',
    intent: 'Select the opening Earth-laps frame with LIGHT CIRCLES EARTH fully legible.',
  },
  captions: {
    behavior: 'external-track',
    language: 'en',
    sourceFile: 'captions/speed-of-light.en.vtt',
    humanReviewRequired: true,
  },
  productionIntent: {
    renderStrategy: 'reuse-existing-master',
    videoSpecId: 'speed-of-light',
    platformPreviewRequired: false,
    notes: 'The existing master and optional English WebVTT track already passed YouTube desktop and mobile review.',
  },
  status: 'production-ready',
  approval: {
    approvedBy: 'Magnivis human editorial review',
    approvedAt: '2026-09-26',
    notes: 'Retrospective representation of the reviewed and published YouTube Shorts packaging.',
  },
});

export const speedOfLightTiktokVariant = platformVariantSchema.parse({
  id: speedOfLightPlatformVariantIds.tiktokFeed,
  revision: 2,
  contentAssetId: assetId,
  platform: 'tiktok',
  surface: 'tiktok-feed',
  platformProfileId: platformProfileIds.tiktokFeed,
  language: 'en',
  packaging: {
    caption: 'Light can circle Earth 7.5 times in one second. Space still makes it look slow.',
    hashtags: ['space', 'physics', 'astronomy', 'learn-on-tiktok'],
    cta: 'What scale should we visualize next?',
    claimIds: [speedOfLightClaimIds.earthLapsPerSecond],
  },
  editorialAdaptationNotes: [
    'Use one compact caption because the first visual already carries the hook.',
    'Retain the question CTA as part of the caption rather than adding an outro to the video.',
  ],
  duration: commonDuration,
  aspectRatio: '9:16',
  safeAreaProfileId: safeAreaProfileIds.tiktokFeed,
  cover: {
    strategy: 'frame-selection',
    intent: 'Use the Earth-laps frame with the 7.5× metric visible and no extra cover copy.',
  },
  captions: {
    behavior: 'platform-generated',
    language: 'en',
    humanReviewRequired: true,
  },
  productionIntent: {
    renderStrategy: 'new-render',
    videoSpecId: 'speed-of-light-tiktok',
    platformPreviewRequired: false,
    notes: 'TikTok V1 failed private iPhone preview because its top navigation crowded the information block. The V2 TikTok-safe render passed private real-device visual/editorial QA on an iPhone 17 Pro Max, including navigation clearance, caption/UI-area safety, cover crop, interface occlusion, audio, animation, and the completed 7.5× counter.',
  },
  status: 'production-ready',
  approval: {
    approvedBy: 'Magnivis human real-device review',
    approvedAt: '2026-09-27',
    notes: 'TikTok Revision 2 passed private Only Me visual/editorial QA on an iPhone 17 Pro Max with the AI-generated-content label enabled. Approval makes this exact delivery eligible for a separately authorized manual upload; it is not approval to publish publicly.',
  },
});

export const speedOfLightInstagramVariant = platformVariantSchema.parse({
  id: speedOfLightPlatformVariantIds.instagramReels,
  revision: 1,
  contentAssetId: assetId,
  platform: 'instagram',
  surface: 'instagram-reels',
  platformProfileId: platformProfileIds.instagramReels,
  language: 'en',
  packaging: {
    caption: 'In one second, light could circle Earth about 7.5 times. But reaching the nearest star still takes about 4.25 years. Space is bigger than speed feels.',
    hashtags: ['space', 'science', 'astronomy', 'physics'],
    cta: 'Save this for the next time someone calls a light-year a unit of time.',
    claimIds: [
      speedOfLightClaimIds.earthLapsPerSecond,
      speedOfLightClaimIds.proximaDistance,
      speedOfLightClaimIds.lightYearIsDistance,
    ],
  },
  editorialAdaptationNotes: [
    'Use a save-oriented CTA that reinforces the light-year misconception resolved by the asset.',
    'Treat the cover as both a Reels frame and a profile-grid entry during manual review.',
  ],
  duration: commonDuration,
  aspectRatio: '9:16',
  safeAreaProfileId: safeAreaProfileIds.instagramReels,
  cover: {
    strategy: 'frame-selection',
    intent: 'Select a high-contrast Earth-laps frame whose headline remains legible in profile-grid cropping.',
  },
  captions: {
    behavior: 'platform-generated',
    language: 'en',
    humanReviewRequired: true,
  },
  productionIntent: {
    renderStrategy: 'reuse-existing-master',
    videoSpecId: 'speed-of-light',
    platformPreviewRequired: true,
    notes: 'Reuse the clean master; manually review Reels UI occlusion, generated captions, and the profile-grid cover crop.',
  },
  status: 'editorial-review',
});

export const speedOfLightFacebookVariant = platformVariantSchema.parse({
  id: speedOfLightPlatformVariantIds.facebookReels,
  revision: 1,
  contentAssetId: assetId,
  platform: 'facebook',
  surface: 'facebook-reels',
  platformProfileId: platformProfileIds.facebookReels,
  language: 'en',
  packaging: {
    caption: 'Light moves almost 300,000 kilometers every second—yet the nearest neighboring star is still about 4.25 light-years away.',
    hashtags: ['science', 'space', 'astronomy'],
    cta: 'Which impossible distance should Magnivis explain next?',
    claimIds: [
      speedOfLightClaimIds.vacuumSpeed,
      speedOfLightClaimIds.proximaDistance,
    ],
  },
  editorialAdaptationNotes: [
    'Use a self-contained explanatory caption for discovery outside an existing follower context.',
    'Keep the CTA conversational without adding engagement bait to the video itself.',
  ],
  duration: commonDuration,
  aspectRatio: '9:16',
  safeAreaProfileId: safeAreaProfileIds.facebookReels,
  cover: {
    strategy: 'frame-selection',
    intent: 'Use the opening Earth-laps frame with the core comparison readable before playback.',
  },
  captions: {
    behavior: 'platform-generated',
    language: 'en',
    humanReviewRequired: true,
  },
  productionIntent: {
    renderStrategy: 'reuse-existing-master',
    videoSpecId: 'speed-of-light',
    platformPreviewRequired: true,
    notes: 'Reuse the clean master and perform a manual Facebook Reels preview for captions and UI placement.',
  },
  status: 'editorial-review',
});

export const speedOfLightPlatformVariants = [
  speedOfLightYoutubeShortsVariant,
  speedOfLightTiktokVariant,
  speedOfLightInstagramVariant,
  speedOfLightFacebookVariant,
] as const;
