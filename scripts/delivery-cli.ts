import {contentAssetRegistry} from '../src/content-assets/registry';
import {platformVariantRegistry} from '../src/platform-variants/registry';
import type {PlatformVariant} from '../src/platform-variants/schema';
import {resolveVideoTarget} from './video-targets';

const usage = `Usage:
  pnpm delivery --variant <platform-variant-id>
  pnpm delivery --asset <content-asset-id>
  pnpm delivery <video-id> [platform-or-surface]

Examples:
  pnpm delivery speed-of-light
  pnpm delivery speed-of-light youtube-shorts
  pnpm delivery speed-of-light tiktok
`;

const assetIdForVideo = (videoId: string) => {
  const {spec} = resolveVideoTarget(videoId);
  if (spec.contentAssetId) return spec.contentAssetId;
  if (spec.platformVariantId) {
    return platformVariantRegistry.get(spec.platformVariantId).contentAssetId;
  }
  throw new Error(`Video ${videoId} has no ContentAsset or PlatformVariant delivery path`);
};

const variantsForAsset = (assetId: string) => {
  contentAssetRegistry.get(assetId);
  const variants = platformVariantRegistry.listByContentAsset(assetId);
  if (variants.length === 0) throw new Error(`No PlatformVariants registered for ${assetId}`);
  return variants;
};

export const selectDeliveryVariants = (args: readonly string[]): PlatformVariant[] => {
  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    throw new Error(usage);
  }
  if (args[0] === '--variant') {
    if (args.length !== 2 || !args[1]) throw new Error(usage);
    return [platformVariantRegistry.get(args[1])];
  }
  if (args[0] === '--asset') {
    if (args.length !== 2 || !args[1]) throw new Error(usage);
    return variantsForAsset(args[1]);
  }
  if (args.length > 2) throw new Error(usage);

  const assetId = assetIdForVideo(args[0]!);
  const variants = variantsForAsset(assetId);
  const destination = args[1];
  if (!destination) return variants;
  const matches = variants.filter(
    ({platform, surface}) => platform === destination || surface === destination,
  );
  if (matches.length !== 1) {
    throw new Error(
      `No unique ${destination} PlatformVariant for ${args[0]}. Available: ${variants.map(({surface}) => surface).join(', ')}`,
    );
  }
  return matches;
};

export const deliveryUsage = usage;
