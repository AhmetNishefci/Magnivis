import {woodFrogApprovedContentAsset} from '../../content-assets/assets/wood-frog-approved';
import {safeAreaProfileIds} from '../../design/safe-areas';
import {woodFrogFreezeClaimIds} from '../../knowledge/packages/wood-frog-freeze-tolerance';
import {platformProfileIds} from '../platform-profiles';
import {platformVariantSchema} from '../schema';

export const woodFrogYoutubeReviewVariant = platformVariantSchema.parse({
  id: `${woodFrogApprovedContentAsset.id}.variant.youtube-shorts`,
  revision: 1,
  contentAssetId: woodFrogApprovedContentAsset.id,
  platform: 'youtube',
  surface: 'youtube-shorts',
  platformProfileId: platformProfileIds.youtubeShorts,
  language: 'en',
  packaging: {
    title: 'How a Wood Frog Survives Freezing',
    description: 'A wood frog can survive nonlethal freezing that stops its heartbeat. Ice forms mainly outside its cells while water movement, glucose, and urea help limit injury through freezing and thawing.',
    hashtags: ['nature', 'biology', 'science'],
    cta: 'What survival adaptation should Magnivis explain next?',
    claimIds: [
      woodFrogFreezeClaimIds.freezeSurvival,
      woodFrogFreezeClaimIds.cardiacArrest,
      woodFrogFreezeClaimIds.iceRedistribution,
      woodFrogFreezeClaimIds.glucoseCryoprotectant,
      woodFrogFreezeClaimIds.ureaAndGlucose,
    ],
  },
  editorialAdaptationNotes: [
    'Use this variant only to package the master for human visual and private platform review.',
    'Do not publish until the exact render, optional caption track, cover and platform UI have passed separate human review.',
  ],
  duration: {targetSeconds: 40, minimumSeconds: 30, maximumSeconds: 60},
  aspectRatio: '9:16',
  safeAreaProfileId: safeAreaProfileIds.youtubeShorts,
  cover: {
    strategy: 'frame-selection',
    intent: 'Evaluate the opening frog-and-cardiac-trace hero frame after the master visual review; no cover is approved yet.',
  },
  captions: {
    behavior: 'external-track',
    language: 'en',
    sourceFile: 'captions/wood-frog.en.vtt',
    humanReviewRequired: true,
  },
  productionIntent: {
    renderStrategy: 'reuse-existing-master',
    videoSpecId: 'wood-frog',
    platformPreviewRequired: true,
    notes: 'The editorial package is approved, but this first production render requires full-resolution visual QA and a private YouTube Shorts preview before production readiness.',
  },
  status: 'editorial-review',
});
