import {speedOfLightPublishedShortAsset} from '../content-assets/assets/speed-of-light';
import {speedOfLight} from '../content/videos/speed-of-light';
import {speedOfLightKnowledgePackage} from '../knowledge/packages/speed-of-light';
import {speedOfLightYoutubeShortsVariant} from '../platform-variants/variants/speed-of-light';
import {publicationRecordSchema} from './schema';

export const speedOfLightYoutubePublication = publicationRecordSchema.parse({
  id: 'publication.youtube.speed-of-light',
  revision: 1,
  platformAccountId: 'account.youtube.primary',
  platform: 'youtube',
  source: {
    platformVariant: {
      id: speedOfLightYoutubeShortsVariant.id,
      revision: speedOfLightYoutubeShortsVariant.revision,
    },
    contentAsset: {
      id: speedOfLightPublishedShortAsset.id,
      revision: speedOfLightPublishedShortAsset.revision,
    },
    knowledgePackage: {
      id: speedOfLightKnowledgePackage.id,
      revision: speedOfLightKnowledgePackage.revision,
    },
    videoSpecId: speedOfLight.id,
    delivery: {
      id: `delivery.${speedOfLightYoutubeShortsVariant.id}.r${speedOfLightYoutubeShortsVariant.revision}`,
      state: 'ready-for-manual-upload',
      relationship: 'retrospective-match',
    },
    videoSha256: 'f157f7ef91740ecd7c679156c6a227318b462fe33d13018ff39ab708ef480f24',
  },
  state: 'published',
  remote: {
    postId: 'ATPAdRdrRRw',
    url: 'https://www.youtube.com/shorts/ATPAdRdrRRw',
  },
  publishedOn: '2026-09-26',
  recordedAt: '2026-09-27',
  settings: {
    visibility: 'public',
    comments: 'unknown',
    reuse: 'unknown',
    aiGeneratedContentDisclosure: 'unknown',
    commercialContentDisclosure: 'unknown',
    captions: 'external-track',
    notes: [
      'Only settings supported by durable repository evidence are asserted; unknown settings must not be reconstructed from memory.',
    ],
  },
  approval: {
    approvedBy: 'Magnivis human publication review',
    approvedAt: '2026-09-26',
    notes: 'Retrospective generalized record of the existing manually published YouTube Short.',
  },
});

export const publicationRecords = [speedOfLightYoutubePublication] as const;
