import {
  contentAssetRegistry,
  type ContentAssetRegistry,
} from '../content-assets/registry';
import {
  safeAreaProfileIds,
  safeAreaProfileRegistry,
} from '../design/safe-areas';
import {
  platformProfileRegistry,
} from './platform-profiles';
import {
  platformVariantSchema,
  type PlatformSurface,
  type PlatformVariant,
} from './schema';
import {speedOfLightPlatformVariants} from './variants/speed-of-light';
import {woodFrogYoutubeReviewVariant} from './variants/wood-frog';

const safeAreaBySurface: Record<PlatformSurface, string> = {
  'youtube-shorts': safeAreaProfileIds.youtubeShorts,
  'tiktok-feed': safeAreaProfileIds.tiktokFeed,
  'instagram-reels': safeAreaProfileIds.instagramReels,
  'facebook-reels': safeAreaProfileIds.facebookReels,
};

export const createPlatformVariantRegistry = (
  inputs: readonly unknown[],
  assetRegistry: ContentAssetRegistry = contentAssetRegistry,
) => {
  const variantMap = new Map<string, PlatformVariant>();
  const surfaceKeys = new Set<string>();

  for (const input of inputs) {
    const variant = platformVariantSchema.parse(input);
    if (variantMap.has(variant.id)) {
      throw new Error(`Duplicate platform variant ID: ${variant.id}`);
    }

    const surfaceKey = `${variant.contentAssetId}:${variant.platform}:${variant.surface}`;
    if (surfaceKeys.has(surfaceKey)) {
      throw new Error(`Duplicate platform variant surface: ${surfaceKey}`);
    }

    const asset = assetRegistry.get(variant.contentAssetId);
    const selectedClaimIds = new Set(asset.selectedClaimIds);
    for (const claimId of variant.packaging.claimIds) {
      if (!selectedClaimIds.has(claimId)) {
        throw new Error(
          `Platform variant ${variant.id} references an unselected asset claim: ${claimId}`,
        );
      }
    }

    const platformProfile = platformProfileRegistry.get(variant.platformProfileId);
    if (
      platformProfile.platform !== variant.platform
      || platformProfile.surface !== variant.surface
    ) {
      throw new Error(`Platform profile does not match variant surface: ${variant.id}`);
    }

    const expectedSafeArea = safeAreaBySurface[variant.surface];
    if (variant.safeAreaProfileId !== expectedSafeArea) {
      throw new Error(
        `Invalid safe-area profile ${variant.safeAreaProfileId} for ${variant.surface}`,
      );
    }
    const safeArea = safeAreaProfileRegistry.get(variant.safeAreaProfileId);
    const envelope = platformProfile.validatedEnvelope;
    if (
      safeArea.canvas.width !== envelope.width
      || safeArea.canvas.height !== envelope.height
    ) {
      throw new Error(`Safe-area canvas does not match platform profile: ${variant.id}`);
    }
    if (!envelope.aspectRatios.includes(variant.aspectRatio)) {
      throw new Error(`Aspect ratio is outside the platform profile: ${variant.id}`);
    }
    if (
      variant.duration.minimumSeconds < envelope.durationSeconds.minimum
      || variant.duration.maximumSeconds > envelope.durationSeconds.maximum
    ) {
      throw new Error(`Duration range is outside the platform profile: ${variant.id}`);
    }

    if (
      ['approved', 'production-ready'].includes(variant.status)
      && !['approved', 'production-ready', 'archived'].includes(asset.editorialStatus)
    ) {
      throw new Error(
        `Platform variant ${variant.id} cannot be ${variant.status} while asset ${asset.id} is ${asset.editorialStatus}`,
      );
    }

    variantMap.set(variant.id, variant);
    surfaceKeys.add(surfaceKey);
  }

  const variants = [...variantMap.values()].sort((left, right) =>
    left.id.localeCompare(right.id));

  return Object.freeze({
    get: (id: string) => {
      const variant = variantMap.get(id);
      if (!variant) throw new Error(`Unknown platform variant: ${id}`);
      return variant;
    },
    list: () => [...variants],
    listByContentAsset: (contentAssetId: string) => variants.filter(
      (variant) => variant.contentAssetId === contentAssetId,
    ),
  });
};

export type PlatformVariantRegistry = ReturnType<typeof createPlatformVariantRegistry>;

export const platformVariantRegistry = createPlatformVariantRegistry(
  [...speedOfLightPlatformVariants, woodFrogYoutubeReviewVariant],
);
