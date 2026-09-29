import {woodFrogApprovedContentAsset} from '../../content-assets/assets/wood-frog-approved';
import {safeAreaProfileIds} from '../../design/safe-areas';
import {woodFrogFreezeClaimIds} from '../../knowledge/packages/wood-frog-freeze-tolerance';
import {woodFrogProductionPlan} from '../../production/plans/wood-frog';
import {platformProfileIds} from '../platform-profiles';
import {platformVariantSchema, type PlatformVariant} from '../schema';

const assetId = woodFrogApprovedContentAsset.id;
const visualApproval = woodFrogProductionPlan.visualApproval;
if (!visualApproval) throw new Error('Wood Frog platform variants require the locked owner-approved master');

export const woodFrogPlatformVariantIds = {
  youtubeShorts: `${assetId}.variant.youtube-shorts`,
  tiktokFeed: `${assetId}.variant.tiktok-feed`,
  instagramReels: `${assetId}.variant.instagram-reels`,
  facebookReels: `${assetId}.variant.facebook-reels`,
} as const;

const commonDuration = {targetSeconds: 40, minimumSeconds: 30, maximumSeconds: 60} as const;
const commonClaims = [
  woodFrogFreezeClaimIds.freezeSurvival,
  woodFrogFreezeClaimIds.cardiacArrest,
  woodFrogFreezeClaimIds.iceRedistribution,
  woodFrogFreezeClaimIds.glucoseCryoprotectant,
  woodFrogFreezeClaimIds.ureaAndGlucose,
  woodFrogFreezeClaimIds.thawRecovery,
] as const;

const sourceMaster = (relationship: 'exact-master' | 'platform-safe-area-derivative') => ({
  videoSpecId: 'wood-frog',
  artifact: visualApproval.artifact,
  productionPlan: {id: woodFrogProductionPlan.id, revision: woodFrogProductionPlan.revision},
  captionPlan: {
    id: woodFrogProductionPlan.captions.captionPlanId,
    revision: woodFrogProductionPlan.captions.captionPlanRevision,
    sha256: woodFrogProductionPlan.captions.captionPlanSha256,
  },
  relationship,
}) as const;

const createGuidance = ({
  aiRecommendation,
  aiRationale,
  nativeCaptionRationale,
}: {
  aiRecommendation: 'enable' | 'disable' | 'operator-confirmation-required';
  aiRationale: string;
  nativeCaptionRationale: string;
}) => ({
  visibility: 'private-preview',
  originalAudio: 'preserve',
  aiGeneratedContentDisclosure: {
    recommendation: aiRecommendation,
    currentPolicyConfirmationRequired: true,
    rationale: aiRationale,
  },
  commercialContentDisclosure: {
    recommendation: 'disable',
    rationale: 'This Magnivis production contains no paid promotion, product placement, or branded-content relationship.',
  },
  nativeCaptions: {
    recommendation: 'evaluate-during-private-preview',
    rationale: nativeCaptionRationale,
  },
  location: 'none',
  link: 'none',
  notes: [
    'Do not schedule or publish during this review pass.',
    'Keep the original rendered audio; do not add platform music.',
    'The designed burned-in captions must remain visible.',
  ],
}) as const;

export const woodFrogYoutubeReviewVariant = platformVariantSchema.parse({
  id: woodFrogPlatformVariantIds.youtubeShorts,
  revision: 4,
  contentAssetId: assetId,
  platform: 'youtube',
  surface: 'youtube-shorts',
  platformProfileId: platformProfileIds.youtubeShorts,
  language: 'en',
  packaging: {
    title: 'How a Wood Frog Survives Freezing',
    description: 'A wood frog can survive a freeze that stops its heartbeat—then thaw and recover. Ice forms mainly outside its cells, while water movement, glucose, and urea help protect those cells through freezing and thawing.\n\nMagnivis — understand something fascinating every day.',
    hashtags: ['woodfrog', 'biology', 'nature', 'science'],
    cta: 'What remarkable survival adaptation should Magnivis explain next?',
    claimIds: [...commonClaims],
  },
  editorialAdaptationNotes: [
    'Reuse the exact locked master; this variant changes packaging only.',
    'The WebVTT is optional accessibility metadata and must be previewed with captions on and off because designed captions are already burned in.',
    'Private Shorts UI, cover, disclosure, and optional-track review remain required.',
  ],
  duration: commonDuration,
  aspectRatio: '9:16',
  safeAreaProfileId: safeAreaProfileIds.youtubeShorts,
  cover: {
    strategy: 'frame-selection',
    intent: 'Select the opening frog-and-cardiac-trace frame around 3.1 seconds, with ITS HEARTBEAT CAN STOP readable and the frog immediately recognizable.',
  },
  captions: {
    behavior: 'external-track',
    designedBurnedIn: true,
    language: 'en',
    sourceFile: 'captions/wood-frog.en.vtt',
    humanReviewRequired: true,
  },
  productionIntent: {
    renderStrategy: 'reuse-existing-master',
    videoSpecId: 'wood-frog',
    platformPreviewRequired: true,
    notes: 'Use the byte-locked owner-approved master. A private YouTube Shorts preview must confirm interface clearance and whether the optional WebVTT causes distracting duplicate visible text.',
  },
  previewStatus: 'ready-for-private-preview',
  sourceMaster: sourceMaster('exact-master'),
  operatorGuidance: createGuidance({
    aiRecommendation: 'operator-confirmation-required',
    aiRationale: 'The production uses local synthetic narration and original procedural/vector visuals. Confirm the current YouTube altered/synthetic-content wording in the upload UI; this repository does not claim mutable policy is timeless.',
    nativeCaptionRationale: 'The reviewed WebVTT can provide toggleable accessibility, but captions-on playback must be checked for duplication with the permanent designed captions.',
  }),
  status: 'editorial-review',
});

export const woodFrogTiktokReviewVariant = platformVariantSchema.parse({
  id: woodFrogPlatformVariantIds.tiktokFeed,
  revision: 1,
  contentAssetId: assetId,
  platform: 'tiktok',
  surface: 'tiktok-feed',
  platformProfileId: platformProfileIds.tiktokFeed,
  language: 'en',
  packaging: {
    caption: 'A wood frog can survive a freeze that stops its heartbeat—then thaw and recover. It survives by controlling the freeze, not by staying unfrozen.',
    hashtags: ['biology', 'nature', 'science', 'woodfrog'],
    cta: 'What survival adaptation should we explain next?',
    claimIds: [woodFrogFreezeClaimIds.freezeSurvival, woodFrogFreezeClaimIds.cardiacArrest, woodFrogFreezeClaimIds.thawRecovery],
  },
  editorialAdaptationNotes: [
    'Use a dedicated TikTok V2 safe-area render; the owner-approved master remains immutable.',
    'The top information region moves down 90 px, matching the real-device lesson from Speed of Light Revision 2.',
    'No script, narration, timing, scientific content, diagram meaning, audio, caption wording, emphasis, or caption design changes.',
  ],
  duration: commonDuration,
  aspectRatio: '9:16',
  safeAreaProfileId: safeAreaProfileIds.tiktokFeed,
  cover: {
    strategy: 'frame-selection',
    intent: 'Evaluate the TikTok-safe opening frog-and-cardiac-trace frame around 3.1 seconds; keep the frog and ITS HEARTBEAT CAN STOP clear of top navigation and the profile crop.',
  },
  captions: {behavior: 'burned-in', designedBurnedIn: true, language: 'en', humanReviewRequired: true},
  productionIntent: {
    renderStrategy: 'new-render',
    videoSpecId: 'wood-frog-tiktok',
    platformPreviewRequired: true,
    notes: 'This render applies only safe-area.tiktok-feed.v2 to the locked creative source. It requires an Only Me/private real-device preview before platform approval.',
  },
  previewStatus: 'ready-for-private-preview',
  sourceMaster: sourceMaster('platform-safe-area-derivative'),
  operatorGuidance: createGuidance({
    aiRecommendation: 'enable',
    aiRationale: 'Enable the TikTok AI-generated-content label for this synthetic-narration, procedural-visual production, consistent with the prior Magnivis TikTok private-review workflow; still confirm the current label wording in the UI.',
    nativeCaptionRationale: 'Do not enable a second visible auto-caption layer by default. Test privately only if TikTok offers an accessibility mode that does not duplicate the burned-in captions.',
  }),
  status: 'editorial-review',
});

export const woodFrogInstagramReviewVariant = platformVariantSchema.parse({
  id: woodFrogPlatformVariantIds.instagramReels,
  revision: 1,
  contentAssetId: assetId,
  platform: 'instagram',
  surface: 'instagram-reels',
  platformProfileId: platformProfileIds.instagramReels,
  language: 'en',
  packaging: {
    caption: 'A wood frog can survive a freeze that stops its heartbeat—then thaw and recover.\n\nThe key is not avoiding ice. Much of its body water freezes mainly outside its cells, while glucose and urea help protect them through freezing and thawing.',
    hashtags: ['biology', 'nature', 'science', 'wildlife'],
    cta: 'Save this for the next time nature seems impossible.',
    claimIds: [...commonClaims],
  },
  editorialAdaptationNotes: [
    'Reuse the exact locked master; this variant changes packaging only.',
    'Review the opening frame as both a Reels cover and an Instagram profile-grid crop.',
    'Private Reels UI, caption duplication, disclosure, and cover review remain required for @magnivis.media.',
  ],
  duration: commonDuration,
  aspectRatio: '9:16',
  safeAreaProfileId: safeAreaProfileIds.instagramReels,
  cover: {strategy: 'frame-selection', intent: 'Use the opening frog-and-cardiac-trace frame around 3.1 seconds if ITS HEARTBEAT CAN STOP remains legible in both Reels and profile-grid crops.'},
  captions: {behavior: 'burned-in', designedBurnedIn: true, language: 'en', humanReviewRequired: true},
  productionIntent: {
    renderStrategy: 'reuse-existing-master',
    videoSpecId: 'wood-frog',
    platformPreviewRequired: true,
    notes: 'Use the byte-locked owner-approved master and perform a private/draft Instagram Reels preview for UI clearance, grid crop, audio, captions, and disclosure controls.',
  },
  previewStatus: 'ready-for-private-preview',
  sourceMaster: sourceMaster('exact-master'),
  operatorGuidance: createGuidance({
    aiRecommendation: 'operator-confirmation-required',
    aiRationale: 'The production uses local synthetic narration and procedural visuals. Confirm the current Instagram disclosure control during private upload because the repository profile does not encode mutable Meta policy as a fact.',
    nativeCaptionRationale: 'Keep designed captions visible and test whether Instagram native captions visibly duplicate them before enabling any additional layer.',
  }),
  status: 'editorial-review',
});

export const woodFrogFacebookReviewVariant = platformVariantSchema.parse({
  id: woodFrogPlatformVariantIds.facebookReels,
  revision: 1,
  contentAssetId: assetId,
  platform: 'facebook',
  surface: 'facebook-reels',
  platformProfileId: platformProfileIds.facebookReels,
  language: 'en',
  packaging: {
    caption: 'A wood frog can survive a freeze that stops its heartbeat. Ice forms mainly outside its cells, while glucose and urea help protect those cells through freezing and thawing.',
    hashtags: ['biology', 'nature', 'science'],
    cta: 'Which remarkable adaptation should Magnivis explain next?',
    claimIds: [...commonClaims],
  },
  editorialAdaptationNotes: [
    'Reuse the exact locked master; this variant changes packaging only.',
    'Use self-contained copy for viewers discovering Magnivis outside an existing follower context.',
    'The Facebook account identity is not recorded; the operator must confirm the destination account during private/draft review.',
  ],
  duration: commonDuration,
  aspectRatio: '9:16',
  safeAreaProfileId: safeAreaProfileIds.facebookReels,
  cover: {strategy: 'frame-selection', intent: 'Evaluate the opening frog-and-cardiac-trace frame around 3.1 seconds with the core hook readable at feed thumbnail size.'},
  captions: {behavior: 'burned-in', designedBurnedIn: true, language: 'en', humanReviewRequired: true},
  productionIntent: {
    renderStrategy: 'reuse-existing-master',
    videoSpecId: 'wood-frog',
    platformPreviewRequired: true,
    notes: 'Use the byte-locked owner-approved master and perform a private/draft Facebook Reels preview for UI clearance, captions, cover, audio, and disclosure controls.',
  },
  previewStatus: 'ready-for-private-preview',
  sourceMaster: sourceMaster('exact-master'),
  operatorGuidance: createGuidance({
    aiRecommendation: 'operator-confirmation-required',
    aiRationale: 'The production uses local synthetic narration and procedural visuals. Confirm the current Facebook disclosure control during private upload because the repository profile does not encode mutable Meta policy as a fact.',
    nativeCaptionRationale: 'Keep designed captions visible and test whether Facebook native captions visibly duplicate them before enabling any additional layer.',
  }),
  status: 'editorial-review',
});

export const woodFrogPlatformVariants = [
  woodFrogYoutubeReviewVariant,
  woodFrogTiktokReviewVariant,
  woodFrogInstagramReviewVariant,
  woodFrogFacebookReviewVariant,
] as const satisfies readonly PlatformVariant[];
