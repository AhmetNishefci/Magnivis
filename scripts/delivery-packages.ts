import {createHash} from 'node:crypto';
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import {resolve, sep} from 'node:path';
import {
  contentAssetRegistry,
  type ContentAssetRegistry,
} from '../src/content-assets/registry';
import type {VideoSpec} from '../src/content/schema';
import {
  safeAreaProfileRegistry,
} from '../src/design/safe-areas';
import {
  deliveryManifestSchema,
  type DeliveryManifest,
  type DeliveryPackageState,
} from '../src/delivery/schema';
import {
  knowledgePackageRegistry,
  type KnowledgePackageRegistry,
} from '../src/knowledge/registry';
import {platformProfileRegistry} from '../src/platform-variants/platform-profiles';
import {
  platformVariantRegistry,
  type PlatformVariantRegistry,
} from '../src/platform-variants/registry';
import type {PlatformVariant} from '../src/platform-variants/schema';
import {
  inspectMedia,
  type MediaInspection,
} from './media-inspection';
import {resolveVideoTarget} from './video-targets';

export type DeliveryProduction = {
  spec: VideoSpec;
  sourceVideoPath: string;
};

export type DeliveryDependencies = {
  variantRegistry: PlatformVariantRegistry;
  assetRegistry: ContentAssetRegistry;
  packageRegistry: KnowledgePackageRegistry;
  productionResolver: (variant: PlatformVariant) => DeliveryProduction;
  mediaInspector: (path: string) => MediaInspection;
};

const defaultProductionResolver = (variant: PlatformVariant): DeliveryProduction => {
  const target = resolveVideoTarget(variant.productionIntent.videoSpecId);
  const productionAssetId = target.spec.contentAssetId
    ?? (target.spec.platformVariantId
      ? platformVariantRegistry.get(target.spec.platformVariantId).contentAssetId
      : undefined);
  if (productionAssetId !== variant.contentAssetId) {
    throw new Error(
      `VideoSpec ${target.spec.id} does not represent ${variant.contentAssetId}`,
    );
  }
  if (
    variant.productionIntent.renderStrategy === 'new-render'
    && target.spec.platformVariantId !== variant.id
  ) {
    throw new Error(`New-render variant ${variant.id} requires its own VideoSpec`);
  }
  return {spec: target.spec, sourceVideoPath: target.output};
};

const defaultDependencies: DeliveryDependencies = {
  variantRegistry: platformVariantRegistry,
  assetRegistry: contentAssetRegistry,
  packageRegistry: knowledgePackageRegistry,
  productionResolver: defaultProductionResolver,
  mediaInspector: inspectMedia,
};

const sha256 = (path: string) => createHash('sha256')
  .update(readFileSync(path))
  .digest('hex');

const unresolvedPlaceholder = /\{\{[^}]+\}\}|__PLACEHOLDER__|<PLACEHOLDER>|\b(?:TODO|TBD)\b/i;

const deliveryStateForVariant = (
  status: PlatformVariant['status'],
): DeliveryPackageState => {
  if (status === 'production-ready') return 'ready-for-manual-upload';
  if (status === 'approved') return 'approved-review';
  return 'draft-review';
};

export const getDeliveryState = deliveryStateForVariant;

const formatHashtags = (hashtags: readonly string[]) => hashtags.map((tag) => `#${tag}`);

const section = (heading: string, value: string | undefined) => value
  ? `${heading}\n${value}`
  : undefined;

export const createUploadCopy = (variant: PlatformVariant) => {
  const hashtags = formatHashtags(variant.packaging.hashtags).join(' ');
  const body = [
    variant.packaging.caption ?? variant.packaging.description,
    variant.packaging.cta,
    hashtags || undefined,
  ].filter((value): value is string => Boolean(value)).join('\n\n');
  return [
    `PLATFORM\n${variant.platform} / ${variant.surface}`,
    section('TITLE', variant.packaging.title),
    section('CAPTION', variant.packaging.caption),
    section('DESCRIPTION', variant.packaging.description),
    section('HASHTAGS', hashtags || undefined),
    section('CTA', variant.packaging.cta),
    section('COPY/PASTE BODY', body),
    `COVER GUIDANCE\n${variant.cover.intent}`,
    `CAPTION HANDLING\nDesigned burned-in: ${variant.captions.designedBurnedIn ? 'yes' : 'no'}\nAccessibility/native track: ${variant.captions.behavior}`,
    `PLATFORM NOTES\n${[
      ...variant.editorialAdaptationNotes,
      variant.productionIntent.notes,
    ].map((note) => `- ${note}`).join('\n')}`,
  ].filter((value): value is string => Boolean(value)).join('\n\n') + '\n';
};

export const createReviewChecklist = (variant: PlatformVariant) => {
  const state = deliveryStateForVariant(variant.status);
  const readinessNotice = state === 'ready-for-manual-upload'
    ? '**READY FOR MANUAL UPLOAD after every applicable check below passes.**'
    : state === 'approved-review'
      ? '**NOT READY FOR UPLOAD: editorial approval exists, but production readiness is not recorded.**'
      : `**DRAFT REVIEW PACKAGE: ${variant.id} remains ${variant.status}. Do not publish it publicly. Use only a private/draft platform upload when required for preview.**`;
  const captionCheck = variant.captions.behavior === 'external-track'
    ? `- [ ] Upload \`captions.${variant.captions.language}.vtt\`; preview every cue with captions on and off.`
    : variant.captions.behavior === 'platform-generated'
      ? '- [ ] Enable platform-generated captions and inspect every generated line before posting.'
      : '- [ ] Confirm the configured caption behavior is correct in the final preview.';
  const burnedInCheck = variant.captions.designedBurnedIn
    ? '- [ ] Designed burned-in captions are readable, synchronized, scene-safe, and free of platform-UI collisions.'
    : '- [ ] Confirm whether this legacy artifact predates the designed burned-in caption policy.';
  const previewCheck = variant.productionIntent.platformPreviewRequired
    ? '- [ ] Preview on the actual target platform/device; this variant has not passed that gate.'
    : '- [ ] Confirm the existing platform preview remains applicable to this exact artifact hash.';

  return `# Manual delivery review — ${variant.surface}

${readinessNotice}

Variant status: \`${variant.status}\`

## Video

- [ ] \`video.mp4\` is the intended master and plays from beginning to end.
- [ ] Duration, orientation, audio, typography, and motion are correct.
- [ ] No rendering artifacts or unexpected crop are visible.
- [ ] Important content remains clear of the platform interface.
${burnedInCheck}
${captionCheck}

## Copy and cover

- [ ] Copy the relevant fields from \`upload-copy.txt\`; do not retype them from memory.
- [ ] Title/caption/description, hashtags, and CTA contain no placeholders.
- [ ] Cover selection follows: ${variant.cover.intent}

## Facts and provenance

- [ ] Manifest references the intended KnowledgePackage, ContentAsset, PlatformVariant, and revisions.
- [ ] Packaging claims remain within the approved ContentAsset claim selection.
- [ ] Artifact hashes in \`manifest.json\` validate before upload.

## Platform

${previewCheck}
- [ ] Confirm audio is enabled and sounds correct in the platform preview.
- [ ] Confirm the final account, audience, and visibility setting before any upload or publication.
- [ ] Obtain explicit human publication approval; package generation is not publication approval.
`;
};

const assertSafeDeliveryDirectory = (
  outputRoot: string,
  videoId: string,
  surface: string,
) => {
  const root = resolve(outputRoot);
  const directory = resolve(root, videoId, surface);
  if (!directory.startsWith(`${root}${sep}`) || directory === root) {
    throw new Error(`Unsafe delivery directory: ${directory}`);
  }
  return directory;
};

const artifactRecord = (
  directory: string,
  role: DeliveryManifest['artifacts'][number]['role'],
  path: string,
  mediaType: string,
): DeliveryManifest['artifacts'][number] => {
  const absolutePath = resolve(directory, path);
  return {
    role,
    path,
    mediaType,
    bytes: statSync(absolutePath).size,
    sha256: sha256(absolutePath),
  };
};

const expectedReadinessStatement = (variant: PlatformVariant) => {
  const state = deliveryStateForVariant(variant.status);
  if (state === 'ready-for-manual-upload') {
    return 'Variant is production-ready; manual upload still requires completion of review.md and explicit human publication approval.';
  }
  if (state === 'approved-review') {
    return 'Variant is editorially approved but not production-ready; this package is for review only.';
  }
  return `Variant remains ${variant.status}; this package is for review and private/draft platform preview only, not public publication.`;
};

const metadataFileForVariant = (variant: PlatformVariant) => ({
  platform: variant.platform,
  surface: variant.surface,
  language: variant.language,
  ...(variant.packaging.title ? {title: variant.packaging.title} : {}),
  ...(variant.packaging.caption ? {caption: variant.packaging.caption} : {}),
  ...(variant.packaging.description ? {description: variant.packaging.description} : {}),
  hashtags: formatHashtags(variant.packaging.hashtags),
  ...(variant.packaging.cta ? {cta: variant.packaging.cta} : {}),
  cover: variant.cover,
  captionBehavior: variant.captions.behavior,
  designedBurnedInCaptions: variant.captions.designedBurnedIn,
  platformNotes: [
    ...variant.editorialAdaptationNotes,
    variant.productionIntent.notes,
  ],
});

const assertMediaMatches = (
  media: MediaInspection,
  production: DeliveryProduction,
  variant: PlatformVariant,
) => {
  const {format} = production.spec;
  if (media.width !== format.width || media.height !== format.height) {
    throw new Error(`Media dimensions ${media.width}x${media.height} do not match VideoSpec ${format.width}x${format.height}`);
  }
  if (media.fps !== format.fps) {
    throw new Error(`Media frame rate ${media.fps} does not match VideoSpec ${format.fps}`);
  }
  if (Math.abs(media.durationSeconds - format.durationSeconds) > 0.12) {
    throw new Error(`Media duration ${media.durationSeconds}s does not match VideoSpec ${format.durationSeconds}s`);
  }
  if (
    media.durationSeconds < variant.duration.minimumSeconds
    || media.durationSeconds > variant.duration.maximumSeconds
  ) {
    throw new Error(`Media duration ${media.durationSeconds}s is outside the PlatformVariant range`);
  }
  const profile = platformProfileRegistry.get(variant.platformProfileId);
  if (
    media.width !== profile.validatedEnvelope.width
    || media.height !== profile.validatedEnvelope.height
    || media.fps !== profile.validatedEnvelope.fps
    || media.videoCodec !== profile.validatedEnvelope.videoCodec
    || media.audioCodec !== profile.validatedEnvelope.audioCodec
  ) {
    throw new Error(`Media is outside platform profile ${profile.id}`);
  }
};

export type GenerateDeliveryOptions = {
  variantId: string;
  outputRoot?: string;
  generatedAt?: string;
  dependencies?: DeliveryDependencies;
};

export const generateDeliveryPackage = ({
  variantId,
  outputRoot = 'deliveries',
  generatedAt = new Date().toISOString(),
  dependencies = defaultDependencies,
}: GenerateDeliveryOptions) => {
  const variant = dependencies.variantRegistry.get(variantId);
  if (variant.status === 'archived') {
    throw new Error(`Archived PlatformVariant cannot produce a delivery package: ${variant.id}`);
  }
  const asset = dependencies.assetRegistry.get(variant.contentAssetId);
  const knowledgePackage = dependencies.packageRegistry.get(asset.knowledgePackageId);
  const platformProfile = platformProfileRegistry.get(variant.platformProfileId);
  const safeAreaProfile = safeAreaProfileRegistry.get(variant.safeAreaProfileId);
  const production = dependencies.productionResolver(variant);
  if (!existsSync(production.sourceVideoPath)) {
    throw new Error(
      `Missing production master ${production.sourceVideoPath}. Run: pnpm render ${production.spec.id}`,
    );
  }

  const sourceMedia = dependencies.mediaInspector(production.sourceVideoPath);
  assertMediaMatches(sourceMedia, production, variant);
  const directory = assertSafeDeliveryDirectory(
    outputRoot,
    production.spec.id,
    variant.surface,
  );
  const captionSourcePath = variant.captions.behavior === 'external-track'
    ? variant.captions.sourceFile
    : undefined;
  if (variant.captions.behavior === 'external-track') {
    if (!captionSourcePath || !existsSync(captionSourcePath)) {
      throw new Error(
        `Missing external caption source for ${variant.id}: ${captionSourcePath ?? 'undefined'}`,
      );
    }
  }
  rmSync(directory, {recursive: true, force: true});
  mkdirSync(directory, {recursive: true});

  copyFileSync(production.sourceVideoPath, resolve(directory, 'video.mp4'));
  let captionArtifactPath: string | undefined;
  if (variant.captions.behavior === 'external-track') {
    captionArtifactPath = `captions.${variant.captions.language}.vtt`;
    copyFileSync(captionSourcePath!, resolve(directory, captionArtifactPath));
  }

  const hashtags = formatHashtags(variant.packaging.hashtags);
  const metadata = metadataFileForVariant(variant);
  writeFileSync(
    resolve(directory, 'metadata.json'),
    `${JSON.stringify(metadata, null, 2)}\n`,
  );
  writeFileSync(resolve(directory, 'upload-copy.txt'), createUploadCopy(variant));
  writeFileSync(resolve(directory, 'review.md'), createReviewChecklist(variant));

  const artifacts: DeliveryManifest['artifacts'] = [
    artifactRecord(directory, 'video', 'video.mp4', 'video/mp4'),
    ...(captionArtifactPath
      ? [artifactRecord(directory, 'captions', captionArtifactPath, 'text/vtt')]
      : []),
    artifactRecord(directory, 'metadata', 'metadata.json', 'application/json'),
    artifactRecord(directory, 'upload-copy', 'upload-copy.txt', 'text/plain'),
    artifactRecord(directory, 'review', 'review.md', 'text/markdown'),
  ];
  const state = deliveryStateForVariant(variant.status);
  const manifest = deliveryManifestSchema.parse({
    schemaVersion: 1,
    deliveryId: `delivery.${variant.id}.r${variant.revision}`,
    generatedAt,
    state,
    publishEligible: state === 'ready-for-manual-upload',
    source: {
      platformVariant: {
        id: variant.id,
        revision: variant.revision,
        status: variant.status,
      },
      contentAsset: {id: asset.id, revision: asset.revision},
      knowledgePackage: {
        id: knowledgePackage.id,
        revision: knowledgePackage.revision,
      },
      videoSpec: {
        id: production.spec.id,
        compositionId: production.spec.compositionId,
      },
    },
    destination: {
      platform: variant.platform,
      surface: variant.surface,
      language: variant.language,
      aspectRatio: variant.aspectRatio,
      platformProfile: {
        id: platformProfile.id,
        revision: platformProfile.revision,
        reviewedAt: platformProfile.reviewedAt,
      },
      safeAreaProfile: {
        id: safeAreaProfile.id,
        revision: safeAreaProfile.revision,
        reviewedAt: safeAreaProfile.reviewedAt,
      },
    },
    media: {
      width: sourceMedia.width,
      height: sourceMedia.height,
      fps: sourceMedia.fps,
      durationSeconds: sourceMedia.durationSeconds,
      videoCodec: sourceMedia.videoCodec,
      audioCodec: sourceMedia.audioCodec,
    },
    metadata: {
      ...(variant.packaging.title ? {title: variant.packaging.title} : {}),
      ...(variant.packaging.caption ? {caption: variant.packaging.caption} : {}),
      ...(variant.packaging.description ? {description: variant.packaging.description} : {}),
      hashtags,
      ...(variant.packaging.cta ? {cta: variant.packaging.cta} : {}),
      claimIds: variant.packaging.claimIds,
      cover: variant.cover,
    },
    captions: {
      behavior: variant.captions.behavior,
      designedBurnedIn: variant.captions.designedBurnedIn,
      language: variant.captions.language,
      ...(captionArtifactPath ? {artifactPath: captionArtifactPath} : {}),
      humanReviewRequired: variant.captions.humanReviewRequired,
    },
    review: {
      platformPreviewRequired: variant.productionIntent.platformPreviewRequired,
      statement: expectedReadinessStatement(variant),
      ...(variant.approval ? {approval: variant.approval} : {}),
    },
    artifacts,
  });
  writeFileSync(
    resolve(directory, 'manifest.json'),
    `${JSON.stringify(manifest, null, 2)}\n`,
  );

  validateDeliveryPackage(directory, dependencies);
  return {directory, manifest};
};

const assertExact = (actual: unknown, expected: unknown, label: string) => {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error(`${label} does not match registered source data`);
  }
};

export const validateDeliveryPackage = (
  directory: string,
  dependencies: DeliveryDependencies = defaultDependencies,
) => {
  const manifestPath = resolve(directory, 'manifest.json');
  if (!existsSync(manifestPath)) throw new Error(`Missing delivery manifest: ${manifestPath}`);
  const manifest = deliveryManifestSchema.parse(
    JSON.parse(readFileSync(manifestPath, 'utf8')),
  );
  const variant = dependencies.variantRegistry.get(manifest.source.platformVariant.id);
  const asset = dependencies.assetRegistry.get(manifest.source.contentAsset.id);
  const knowledgePackage = dependencies.packageRegistry.get(
    manifest.source.knowledgePackage.id,
  );
  const platformProfile = platformProfileRegistry.get(
    manifest.destination.platformProfile.id,
  );
  const safeAreaProfile = safeAreaProfileRegistry.get(
    manifest.destination.safeAreaProfile.id,
  );
  const production = dependencies.productionResolver(variant);

  if (manifest.deliveryId !== `delivery.${variant.id}.r${variant.revision}`) {
    throw new Error('Delivery ID does not match the registered PlatformVariant revision');
  }
  if (platformProfile.id !== variant.platformProfileId) {
    throw new Error('Platform profile reference does not match registered source data');
  }
  if (safeAreaProfile.id !== variant.safeAreaProfileId) {
    throw new Error('Safe-area profile reference does not match registered source data');
  }

  assertExact(manifest.source.platformVariant, {
    id: variant.id,
    revision: variant.revision,
    status: variant.status,
  }, 'PlatformVariant reference');
  assertExact(manifest.source.contentAsset, {
    id: asset.id,
    revision: asset.revision,
  }, 'ContentAsset reference');
  assertExact(manifest.source.knowledgePackage, {
    id: knowledgePackage.id,
    revision: knowledgePackage.revision,
  }, 'KnowledgePackage reference');
  if (asset.knowledgePackageId !== knowledgePackage.id) {
    throw new Error('ContentAsset does not reference the manifest KnowledgePackage');
  }
  if (variant.contentAssetId !== asset.id) {
    throw new Error('PlatformVariant does not reference the manifest ContentAsset');
  }
  assertExact(manifest.source.videoSpec, {
    id: production.spec.id,
    compositionId: production.spec.compositionId,
  }, 'VideoSpec reference');
  assertExact(manifest.destination.platformProfile, {
    id: platformProfile.id,
    revision: platformProfile.revision,
    reviewedAt: platformProfile.reviewedAt,
  }, 'Platform profile reference');
  assertExact(manifest.destination.safeAreaProfile, {
    id: safeAreaProfile.id,
    revision: safeAreaProfile.revision,
    reviewedAt: safeAreaProfile.reviewedAt,
  }, 'Safe-area profile reference');
  assertExact({
    platform: manifest.destination.platform,
    surface: manifest.destination.surface,
    language: manifest.destination.language,
    aspectRatio: manifest.destination.aspectRatio,
  }, {
    platform: variant.platform,
    surface: variant.surface,
    language: variant.language,
    aspectRatio: variant.aspectRatio,
  }, 'Delivery destination');
  assertExact(manifest.metadata, {
    ...(variant.packaging.title ? {title: variant.packaging.title} : {}),
    ...(variant.packaging.caption ? {caption: variant.packaging.caption} : {}),
    ...(variant.packaging.description ? {description: variant.packaging.description} : {}),
    hashtags: formatHashtags(variant.packaging.hashtags),
    ...(variant.packaging.cta ? {cta: variant.packaging.cta} : {}),
    claimIds: variant.packaging.claimIds,
    cover: variant.cover,
  }, 'Delivery metadata');
  assertExact(manifest.captions, {
    behavior: variant.captions.behavior,
    designedBurnedIn: variant.captions.designedBurnedIn,
    language: variant.captions.language,
    ...(variant.captions.behavior === 'external-track'
      ? {artifactPath: `captions.${variant.captions.language}.vtt`}
      : {}),
    humanReviewRequired: variant.captions.humanReviewRequired,
  }, 'Delivery caption settings');

  const state = deliveryStateForVariant(variant.status);
  if (manifest.state !== state || manifest.publishEligible !== (state === 'ready-for-manual-upload')) {
    throw new Error('Delivery readiness does not match PlatformVariant status');
  }
  if (manifest.review.statement !== expectedReadinessStatement(variant)) {
    throw new Error('Delivery review statement does not match PlatformVariant status');
  }
  if (
    manifest.review.platformPreviewRequired
    !== variant.productionIntent.platformPreviewRequired
  ) {
    throw new Error('Delivery platform-preview gate does not match the PlatformVariant');
  }
  assertExact(manifest.review.approval, variant.approval, 'Delivery approval');

  const expectedFiles = new Set(['manifest.json', ...manifest.artifacts.map(({path}) => path)]);
  const actualFiles = readdirSync(directory);
  for (const expectedFile of expectedFiles) {
    if (!actualFiles.includes(expectedFile)) {
      throw new Error(`Missing delivery artifact: ${expectedFile}`);
    }
  }
  for (const actualFile of actualFiles) {
    if (!expectedFiles.has(actualFile)) {
      throw new Error(`Unexpected delivery artifact: ${actualFile}`);
    }
  }
  for (const artifact of manifest.artifacts) {
    const path = resolve(directory, artifact.path);
    if (statSync(path).size !== artifact.bytes) {
      throw new Error(`Artifact size mismatch: ${artifact.path}`);
    }
    if (sha256(path) !== artifact.sha256) {
      throw new Error(`Artifact SHA-256 mismatch: ${artifact.path}`);
    }
    if (artifact.role !== 'video') {
      const contents = readFileSync(path, 'utf8');
      if (unresolvedPlaceholder.test(contents)) {
        throw new Error(`Unresolved placeholder in ${artifact.path}`);
      }
    }
  }

  const videoArtifact = manifest.artifacts.find(({role}) => role === 'video');
  if (!videoArtifact || videoArtifact.sha256 !== sha256(production.sourceVideoPath)) {
    throw new Error('Delivered video does not match the resolved production master');
  }
  if (variant.captions.behavior === 'external-track') {
    const captionArtifact = manifest.artifacts.find(({role}) => role === 'captions');
    const sourceFile = variant.captions.sourceFile;
    if (!captionArtifact || !sourceFile || captionArtifact.sha256 !== sha256(sourceFile)) {
      throw new Error('Delivered captions do not match the registered caption source');
    }
  }
  assertExact(
    JSON.parse(readFileSync(resolve(directory, 'metadata.json'), 'utf8')),
    metadataFileForVariant(variant),
    'Metadata artifact',
  );
  if (readFileSync(resolve(directory, 'upload-copy.txt'), 'utf8') !== createUploadCopy(variant)) {
    throw new Error('Upload-copy artifact does not match the PlatformVariant');
  }
  if (readFileSync(resolve(directory, 'review.md'), 'utf8') !== createReviewChecklist(variant)) {
    throw new Error('Review artifact does not match the PlatformVariant');
  }

  const deliveredMedia = dependencies.mediaInspector(resolve(directory, 'video.mp4'));
  assertMediaMatches(deliveredMedia, production, variant);
  assertExact(manifest.media, {
    width: deliveredMedia.width,
    height: deliveredMedia.height,
    fps: deliveredMedia.fps,
    durationSeconds: deliveredMedia.durationSeconds,
    videoCodec: deliveredMedia.videoCodec,
    audioCodec: deliveredMedia.audioCodec,
  }, 'Delivered media metadata');

  return manifest;
};

export const generateDeliveryPackagesForAsset = (
  contentAssetId: string,
  options: Omit<GenerateDeliveryOptions, 'variantId'> = {},
) => {
  const dependencies = options.dependencies ?? defaultDependencies;
  const variants = dependencies.variantRegistry.listByContentAsset(contentAssetId);
  if (variants.length === 0) {
    throw new Error(`No PlatformVariants registered for ContentAsset: ${contentAssetId}`);
  }
  const generatedAt = options.generatedAt ?? new Date().toISOString();
  return variants.map(({id}) => generateDeliveryPackage({
    ...options,
    variantId: id,
    dependencies,
    generatedAt,
  }));
};

export const deliveryDependencies = defaultDependencies;
