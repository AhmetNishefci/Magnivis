import {createHash} from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {
  mkdtempSync,
  readFileSync,
  rmSync,
  statSync,
  unlinkSync,
  writeFileSync,
} from 'node:fs';
import {tmpdir} from 'node:os';
import {join, resolve} from 'node:path';
import {afterEach, describe, expect, it} from 'vitest';
import {speedOfLightPublishedShortAsset} from '../src/content-assets/assets/speed-of-light';
import {woodFrogApprovedContentAsset} from '../src/content-assets/assets/wood-frog-approved';
import {speedOfLight} from '../src/content/videos/speed-of-light';
import {woodFrog, woodFrogTiktok} from '../src/content/videos/wood-frog';
import {safeAreaProfileIds} from '../src/design/safe-areas';
import {deliveryManifestSchema} from '../src/delivery/schema';
import {platformProfileIds} from '../src/platform-variants/platform-profiles';
import {createPlatformVariantRegistry} from '../src/platform-variants/registry';
import {
  speedOfLightFacebookVariant,
  speedOfLightInstagramVariant,
  speedOfLightTiktokVariant,
  speedOfLightYoutubeShortsVariant,
} from '../src/platform-variants/variants/speed-of-light';
import {woodFrogPlatformVariants} from '../src/platform-variants/variants/wood-frog';
import {
  createReviewChecklist,
  createUploadCopy,
  deliveryDependencies,
  generateDeliveryPackage,
  generateDeliveryPackagesForAsset,
  getDeliveryState,
  validateDeliveryPackage,
  type DeliveryDependencies,
} from '../scripts/delivery-packages';

const temporaryDirectories: string[] = [];
const generatedAt = '2026-09-27T12:00:00.000Z';
const media = {
  width: 1080,
  height: 1920,
  fps: 30,
  fpsExpression: '30/1',
  videoCodec: 'h264',
  audioCodec: 'aac',
  audioSampleRate: '48000',
  durationSeconds: 33.046,
  sizeBytes: 12,
  bitRate: 4_000_000,
};

const fixture = () => {
  const root = mkdtempSync(join(tmpdir(), 'magnivis-delivery-'));
  temporaryDirectories.push(root);
  const master = join(root, 'master.mp4');
  writeFileSync(master, 'master-video');
  const dependencies: DeliveryDependencies = {
    ...deliveryDependencies,
    productionResolver: () => ({
      spec: speedOfLight,
      sourceVideoPath: master,
    }),
    mediaInspector: () => media,
  };
  return {root, dependencies};
};

const fixtureWoodFrog = () => {
  const root = mkdtempSync(join(tmpdir(), 'magnivis-wood-frog-delivery-'));
  temporaryDirectories.push(root);
  const master = join(root, 'wood-frog-master.mp4');
  const derivative = join(root, 'wood-frog-tiktok.mp4');
  writeFileSync(master, 'locked-master-video');
  writeFileSync(derivative, 'tiktok-safe-area-video');
  const masterHash = createHash('sha256').update(readFileSync(master)).digest('hex');
  const variants = woodFrogPlatformVariants.map((variant) => ({
    ...structuredClone(variant),
    sourceMaster: {
      ...structuredClone(variant.sourceMaster!),
      artifact: {path: master, sha256: masterHash},
    },
  }));
  const variantRegistry = createPlatformVariantRegistry(variants);
  const dependencies: DeliveryDependencies = {
    ...deliveryDependencies,
    variantRegistry,
    productionResolver: (variant) => variant.platform === 'tiktok'
      ? {spec: woodFrogTiktok, sourceVideoPath: derivative}
      : {spec: woodFrog, sourceVideoPath: master},
    mediaInspector: () => ({...media, durationSeconds: 40.043}),
  };
  return {root, dependencies, masterHash};
};

afterEach(() => {
  for (const directory of temporaryDirectories.splice(0)) {
    rmSync(directory, {recursive: true, force: true});
  }
});

describe('Platform Delivery Package V1', () => {
  it('generates and validates a production-ready YouTube package', () => {
    const {root, dependencies} = fixture();
    const result = generateDeliveryPackage({
      variantId: speedOfLightYoutubeShortsVariant.id,
      outputRoot: join(root, 'deliveries'),
      generatedAt,
      dependencies,
    });

    expect(deliveryManifestSchema.parse(result.manifest)).toEqual(result.manifest);
    expect(result.manifest.state).toBe('ready-for-manual-upload');
    expect(result.manifest.publishEligible).toBe(true);
    expect(result.manifest.captions.artifactPath).toBe('captions.en.vtt');
    expect(validateDeliveryPackage(result.directory, dependencies)).toEqual(result.manifest);
  });

  it('generates the approved TikTok package without granting publication authority', () => {
    const {root, dependencies} = fixture();
    const result = generateDeliveryPackage({
      variantId: speedOfLightTiktokVariant.id,
      outputRoot: join(root, 'deliveries'),
      generatedAt,
      dependencies,
    });

    expect(result.manifest.state).toBe('ready-for-manual-upload');
    expect(result.manifest.publishEligible).toBe(true);
    expect(result.manifest.review.platformPreviewRequired).toBe(false);
    expect(result.manifest.review.approval?.notes).toMatch(/iPhone 17 Pro Max/);
    expect(result.manifest.captions.behavior).toBe('platform-generated');
    expect(result.manifest.artifacts.some(({role}) => role === 'captions')).toBe(false);
    expect(readFileSync(resolve(result.directory, 'review.md'), 'utf8')).toContain(
      'explicit human publication approval',
    );
  });

  it('supports draft, approved-review, and ready states without promotion', () => {
    expect(getDeliveryState('draft')).toBe('draft-review');
    expect(getDeliveryState('editorial-review')).toBe('draft-review');
    expect(getDeliveryState('approved')).toBe('approved-review');
    expect(getDeliveryState('production-ready')).toBe('ready-for-manual-upload');
  });

  it('rejects an invalid PlatformVariant reference', () => {
    const {root, dependencies} = fixture();
    expect(() => generateDeliveryPackage({
      variantId: 'speed-of-light.asset.earth-to-proxima.variant.missing',
      outputRoot: join(root, 'deliveries'),
      generatedAt,
      dependencies,
    })).toThrow('Unknown platform variant');
  });

  it('rejects a missing artifact', () => {
    const {root, dependencies} = fixture();
    const {directory} = generateDeliveryPackage({
      variantId: speedOfLightYoutubeShortsVariant.id,
      outputRoot: join(root, 'deliveries'),
      generatedAt,
      dependencies,
    });
    unlinkSync(resolve(directory, 'video.mp4'));
    expect(() => validateDeliveryPackage(directory, dependencies)).toThrow(
      'Missing delivery artifact: video.mp4',
    );
  });

  it('rejects a same-size artifact hash mismatch', () => {
    const {root, dependencies} = fixture();
    const {directory} = generateDeliveryPackage({
      variantId: speedOfLightYoutubeShortsVariant.id,
      outputRoot: join(root, 'deliveries'),
      generatedAt,
      dependencies,
    });
    const video = resolve(directory, 'video.mp4');
    writeFileSync(video, Buffer.alloc(statSync(video).size, 1));
    expect(() => validateDeliveryPackage(directory, dependencies)).toThrow(
      'Artifact SHA-256 mismatch: video.mp4',
    );
  });

  it('validates platform-profile and safe-area references against registries', () => {
    const {root, dependencies} = fixture();
    const first = generateDeliveryPackage({
      variantId: speedOfLightYoutubeShortsVariant.id,
      outputRoot: join(root, 'deliveries'),
      generatedAt,
      dependencies,
    });
    const platformMismatch = structuredClone(first.manifest);
    platformMismatch.destination.platformProfile.id = platformProfileIds.tiktokFeed;
    writeFileSync(
      resolve(first.directory, 'manifest.json'),
      `${JSON.stringify(platformMismatch, null, 2)}\n`,
    );
    expect(() => validateDeliveryPackage(first.directory, dependencies)).toThrow(
      'Platform profile reference does not match registered source data',
    );

    const second = generateDeliveryPackage({
      variantId: speedOfLightYoutubeShortsVariant.id,
      outputRoot: join(root, 'deliveries'),
      generatedAt,
      dependencies,
    });
    const safeAreaMismatch = structuredClone(second.manifest);
    safeAreaMismatch.destination.safeAreaProfile.id = safeAreaProfileIds.tiktokFeed;
    writeFileSync(
      resolve(second.directory, 'manifest.json'),
      `${JSON.stringify(safeAreaMismatch, null, 2)}\n`,
    );
    expect(() => validateDeliveryPackage(second.directory, dependencies)).toThrow(
      'Safe-area profile reference does not match registered source data',
    );
  });

  it('rejects delivery identity and review-gate drift from the registered variant', () => {
    const {root, dependencies} = fixture();
    const first = generateDeliveryPackage({
      variantId: speedOfLightTiktokVariant.id,
      outputRoot: join(root, 'deliveries'),
      generatedAt,
      dependencies,
    });
    const identityMismatch = structuredClone(first.manifest);
    identityMismatch.deliveryId = 'delivery.speed-of-light.asset.earth-to-proxima.variant.instagram-reels.r1';
    writeFileSync(
      resolve(first.directory, 'manifest.json'),
      `${JSON.stringify(identityMismatch, null, 2)}\n`,
    );
    expect(() => validateDeliveryPackage(first.directory, dependencies)).toThrow(
      'Delivery ID does not match the registered PlatformVariant revision',
    );

    const second = generateDeliveryPackage({
      variantId: speedOfLightTiktokVariant.id,
      outputRoot: join(root, 'deliveries'),
      generatedAt,
      dependencies,
    });
    const reviewMismatch = structuredClone(second.manifest);
    reviewMismatch.review.platformPreviewRequired = true;
    writeFileSync(
      resolve(second.directory, 'manifest.json'),
      `${JSON.stringify(reviewMismatch, null, 2)}\n`,
    );
    expect(() => validateDeliveryPackage(second.directory, dependencies)).toThrow(
      'Delivery platform-preview gate does not match the PlatformVariant',
    );
  });

  it('rejects caption behavior drift from the registered variant', () => {
    const {root, dependencies} = fixture();
    const {directory, manifest} = generateDeliveryPackage({
      variantId: speedOfLightTiktokVariant.id,
      outputRoot: join(root, 'deliveries'),
      generatedAt,
      dependencies,
    });
    const captionMismatch = structuredClone(manifest);
    captionMismatch.captions.humanReviewRequired = false;
    writeFileSync(
      resolve(directory, 'manifest.json'),
      `${JSON.stringify(captionMismatch, null, 2)}\n`,
    );
    expect(() => validateDeliveryPackage(directory, dependencies)).toThrow(
      'Delivery caption settings does not match registered source data',
    );
  });

  it('creates platform-relevant upload copy and concise review guidance', () => {
    const youtubeCopy = createUploadCopy(speedOfLightYoutubeShortsVariant);
    expect(youtubeCopy).toContain('TITLE\nLight Is Fast — Space Is Bigger');
    expect(youtubeCopy).toContain('DESCRIPTION\nLight travels fast enough');
    expect(youtubeCopy).toContain('#space #astronomy #science');

    const tiktokCopy = createUploadCopy(speedOfLightTiktokVariant);
    expect(tiktokCopy).toContain('CAPTION\nLight can circle Earth');
    expect(tiktokCopy).not.toContain('\nTITLE\n');
    expect(tiktokCopy).toContain('COPY/PASTE BODY');
    expect(createReviewChecklist(speedOfLightTiktokVariant)).toContain(
      'Enable platform-generated captions',
    );
  });

  it('generates four packages from one ContentAsset', () => {
    const {root, dependencies} = fixture();
    const results = generateDeliveryPackagesForAsset(
      speedOfLightPublishedShortAsset.id,
      {
        outputRoot: join(root, 'deliveries'),
        generatedAt,
        dependencies,
      },
    );
    expect(results.map(({manifest}) => manifest.destination.platform).sort()).toEqual([
      'facebook',
      'instagram',
      'tiktok',
      'youtube',
    ]);
    expect(results.every(({manifest}) => manifest.generatedAt === generatedAt)).toBe(true);
  });

  it('is deterministic for the same sources and generation timestamp', () => {
    const {root, dependencies} = fixture();
    const options = {
      variantId: speedOfLightInstagramVariant.id,
      outputRoot: join(root, 'deliveries'),
      generatedAt,
      dependencies,
    };
    const first = generateDeliveryPackage(options).manifest;
    const second = generateDeliveryPackage(options).manifest;
    expect(second).toEqual(first);
  });

  it('keeps generated delivery outputs excluded from Git', () => {
    const ignored = spawnSync(
      'git',
      ['check-ignore', '--quiet', 'deliveries/speed-of-light/youtube-shorts/video.mp4'],
    );
    expect(ignored.status).toBe(0);
  });

  it('keeps only previewed variants ready and unreviewed variants in draft review', () => {
    expect(getDeliveryState(speedOfLightTiktokVariant.status)).toBe(
      'ready-for-manual-upload',
    );
    for (const variant of [speedOfLightInstagramVariant, speedOfLightFacebookVariant]) {
      expect(getDeliveryState(variant.status)).toBe('draft-review');
    }
  });

  it('resolves the TikTok variant to its dedicated render and other surfaces to the master', () => {
    expect(
      deliveryDependencies.productionResolver(speedOfLightTiktokVariant).spec.id,
    ).toBe('speed-of-light-tiktok');
    for (const variant of [
      speedOfLightYoutubeShortsVariant,
      speedOfLightInstagramVariant,
      speedOfLightFacebookVariant,
    ]) {
      expect(deliveryDependencies.productionResolver(variant).spec.id).toBe(
        'speed-of-light',
      );
    }
  });

  it('builds four private-preview Wood Frog packages on one locked source chain', () => {
    const {root, dependencies, masterHash} = fixtureWoodFrog();
    const results = generateDeliveryPackagesForAsset(
      woodFrogApprovedContentAsset.id,
      {outputRoot: join(root, 'deliveries'), generatedAt, dependencies},
    );
    expect(results).toHaveLength(4);
    expect(results.map(({manifest}) => manifest.destination.platform).sort()).toEqual([
      'facebook', 'instagram', 'tiktok', 'youtube',
    ]);
    for (const {directory, manifest} of results) {
      expect(manifest.schemaVersion).toBe(2);
      expect(manifest.state).toBe('draft-review');
      expect(manifest.publishEligible).toBe(false);
      expect(manifest.review).toMatchObject({
        previewStatus: 'ready-for-private-preview',
        platformPreviewRequired: true,
        publicationAuthorized: false,
      });
      expect(manifest.source.productionChain?.lockedMaster.sha256).toBe(masterHash);
      expect(manifest.source.productionChain?.captionPlan.id).toBe('caption-plan.wood-frog.v1');
      expect(manifest.operatorGuidance?.visibility).toBe('private-preview');
      expect(readFileSync(resolve(directory, 'upload-copy.txt'), 'utf8')).toContain(
        'OPERATOR SETTINGS',
      );
      expect(validateDeliveryPackage(directory, dependencies)).toEqual(manifest);
    }
    const youtube = results.find(({manifest}) => manifest.destination.platform === 'youtube')!;
    const tiktok = results.find(({manifest}) => manifest.destination.platform === 'tiktok')!;
    expect(youtube.manifest.captions.artifactPath).toBe('captions.en.vtt');
    expect(tiktok.manifest.captions.behavior).toBe('burned-in');
    expect(tiktok.manifest.artifacts.find(({role}) => role === 'video')?.sha256)
      .not.toBe(masterHash);
  });

  it('rejects Wood Frog delivery source-chain drift', () => {
    const {root, dependencies} = fixtureWoodFrog();
    const [variant] = dependencies.variantRegistry.listByContentAsset(
      woodFrogApprovedContentAsset.id,
    );
    if (!variant) throw new Error('Expected Wood Frog variant fixture');
    const result = generateDeliveryPackage({
      variantId: variant.id,
      outputRoot: join(root, 'deliveries'),
      generatedAt,
      dependencies,
    });
    const changed = structuredClone(result.manifest);
    changed.source.productionChain!.captionPlan.revision += 1;
    writeFileSync(
      resolve(result.directory, 'manifest.json'),
      `${JSON.stringify(changed, null, 2)}\n`,
    );
    expect(() => validateDeliveryPackage(result.directory, dependencies)).toThrow(
      'Production source chain does not match registered source data',
    );
  });
});
