import {mkdtempSync, writeFileSync, readdirSync, rmSync, readFileSync, existsSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {afterEach, describe, expect, it} from 'vitest';
import {createMediaRegistry, mediaHash, mediaReference, registerMediaArtifact, type MediaArtifact} from '../src/artifacts/media';
import {speedOfLightPlatformVariants} from '../src/platform-variants/variants/speed-of-light';
import {createPlatformVariantRegistry} from '../src/platform-variants/registry';
import {speedOfLight} from '../src/content/videos/speed-of-light';
import {woodFrog} from '../src/content/videos/wood-frog';
import {woodFrogPlatformVariants} from '../src/platform-variants/variants/wood-frog';
import {deliveryDependencies, generateDeliveryPackage, validateDeliveryPackage} from '../scripts/delivery-packages';
import {resolveDeliveryUpload, validatePublicationMediaAuthorization, validatePublishedMediaBinding} from '../src/delivery/media-bindings';
import {sha256Json} from '../src/content-intelligence/run-schema';
import {speedOfLightYoutubePublication} from '../src/operations/publications';
import {publicationRecordSchema} from '../src/operations/schema';
import {platformVariantSchema} from '../src/platform-variants/schema';
import {deliveryManifestSchema} from '../src/delivery/schema';

const temporary: string[] = [];
afterEach(() => temporary.splice(0).forEach(p => rmSync(p, {recursive: true, force: true})));
const fixture = (different = false, shareTransform = false, covers = false) => {
  const root = mkdtempSync(join(tmpdir(), 'magnivis-reference-delivery-')); temporary.push(root);
  writeFileSync(join(root, 'recipe.json'), JSON.stringify({testOnly: true, mediaInspection: 'stubbed; these are synthetic byte fixtures, not video evidence'}));
  const make = (path: string, bytes: string, mediaType = 'video/mp4'): MediaArtifact => {
    writeFileSync(join(root, path), bytes);
    const sha256 = mediaHash(join(root, path));
    return {id: `media.${sha256}`, sha256, canonicalPath: path, mediaType, bytes: Buffer.byteLength(bytes), provenance: {kind: 'original-production', sourceCommit: 'f7525176463b4e80045fb6d5d1e84de8de160569', sourceRecords: ['recipe.json'], createdAt: null, creationTimeUnknownReason: 'Synthetic test fixture.'}, parents: []};
  };
  const master = make('master.mp4', 'synthetic master');
  const transformed = different ? {...make('transformed.mp4', 'synthetic presentation change'), provenance: {...master.provenance, kind: 'platform-adaptation' as const}, parents: [mediaReference(master)]} : undefined;
  const cover = covers ? make('cover.png', 'synthetic original cover', 'image/png') : undefined;
  const registry = createMediaRegistry([master, ...(transformed ? [transformed] : []), ...(cover ? [cover] : [])], root);
  const variants = speedOfLightPlatformVariants.map(v => {
    const media = transformed && (v.platform === 'tiktok' || shareTransform && v.platform === 'instagram') ? transformed : master;
    return platformVariantSchema.parse({...structuredClone(v), mediaArtifact: mediaReference(media), captions: {...v.captions, behavior: 'burned-in', designedBurnedIn: true, sourceFile: undefined},
      ...(cover && ['instagram', 'tiktok'].includes(v.platform) ? {cover: {strategy: 'custom-image', intent: 'Synthetic shared cover', artifact: {id: cover.id, path: join(root, cover.canonicalPath), sha256: cover.sha256}}} : {})});
  });
  const dependencies = {...deliveryDependencies, variantRegistry: createPlatformVariantRegistry(variants, deliveryDependencies.assetRegistry, registry), mediaRegistry: registry,
    productionResolver: (v: typeof variants[number]) => ({spec: speedOfLight, sourceVideoPath: registry.resolveFile(v.mediaArtifact!)}),
    mediaInspector: () => ({width: 1080, height: 1920, fps: 30, fpsExpression: '30/1', videoCodec: 'h264', audioCodec: 'aac', audioSampleRate: '48000', durationSeconds: 33.046, sizeBytes: 16, bitRate: 4000000})};
  const generate = (variant: typeof variants[number], stage = 'review') => generateDeliveryPackage({variantId: variant.id, outputRoot: join(root, stage), generatedAt: '2026-10-02T11:00:00.000Z', dependencies});
  return {root, master, transformed, cover, registry, variants, dependencies, generate, make};
};

describe('Canonical media platform/delivery lifecycle', () => {
  it('serves all four platforms from one canonical binary with no package copies', () => {
    const f = fixture();
    const packages = f.variants.map(v => f.generate(v));
    expect(f.registry.list()).toHaveLength(1);
    for (const p of packages) {
      expect(p.manifest.schemaVersion).toBe(3);
      expect(readdirSync(p.directory).sort()).toEqual(['manifest.json', 'metadata.json', 'review.md', 'upload-copy.txt']);
      expect(resolveDeliveryUpload(p.manifest, f.registry).uploadFile).toBe('master.mp4');
      expect(validateDeliveryPackage(p.directory, f.dependencies)).toEqual(p.manifest);
    }
  });
  it('permits a different TikTok payload for a presentation requirement', () => {
    const f = fixture(true); const tt = f.variants.find(v => v.platform === 'tiktok')!;
    const p = f.generate(tt); expect(p.manifest.source.mediaArtifact).toEqual(mediaReference(f.transformed!));
    expect(resolveDeliveryUpload(p.manifest, f.registry).uploadFile).toBe('transformed.mp4');
    expect(f.registry.list()).toHaveLength(2);
  });
  it('shares identical transformed bytes across Instagram and TikTok', () => {
    const f = fixture(true, true);
    const a = f.generate(f.variants.find(v => v.platform === 'instagram')!);
    const b = f.generate(f.variants.find(v => v.platform === 'tiktok')!);
    expect(a.manifest.source.mediaArtifact).toEqual(b.manifest.source.mediaArtifact);
    expect(f.registry.list()).toHaveLength(2);
  });
  it('moves review to readiness without copying media and retains the earlier handoff', () => {
    const f = fixture(); const v = f.variants[0]!;
    const reviewVariant = platformVariantSchema.parse({...v, status: 'editorial-review', revision: 91, approval: undefined});
    const dependencies = {...f.dependencies, variantRegistry: createPlatformVariantRegistry([reviewVariant], deliveryDependencies.assetRegistry, f.registry)};
    const review = generateDeliveryPackage({variantId: v.id, dependencies, outputRoot: join(f.root, 'initial')});
    const readyVariant = platformVariantSchema.parse({...v, status: 'production-ready', revision: 92, approval: speedOfLightPlatformVariants.find(v => v.platform === 'youtube')!.approval});
    const ready = generateDeliveryPackage({variantId: v.id, dependencies: {...f.dependencies, variantRegistry: createPlatformVariantRegistry([readyVariant], deliveryDependencies.assetRegistry, f.registry)}, outputRoot: join(f.root, 'ready')});
    expect(review.manifest.state).toBe('draft-review'); expect(ready.manifest.state).toBe('ready-for-manual-upload');
    expect(review.manifest.source.mediaArtifact).toEqual(ready.manifest.source.mediaArtifact);
    expect(existsSync(join(review.directory, 'video.mp4'))).toBe(false); expect(existsSync(join(ready.directory, 'video.mp4'))).toBe(false);
    expect(readFileSync(join(review.directory, 'manifest.json'), 'utf8')).toContain('draft-review');
    expect(() => f.generate(v)).not.toThrow(); expect(() => f.generate(v)).toThrow(/already exists/);
  });
  it('binds publication authorization to exact identities with no binary writes', () => {
    const f = fixture(); const base = f.variants.find(v => v.platform === 'youtube')!;
    const ownerDecision = {id: 'owner-decision.synthetic.fixture', revision: 1, sha256: '1'.repeat(64)};
    const v = platformVariantSchema.parse({...base, approval: {...base.approval, ownerDecision}, operatorGuidance: {visibility: 'private-preview', originalAudio: 'preserve', aiGeneratedContentDisclosure: {recommendation: 'operator-confirmation-required', currentPolicyConfirmationRequired: true, rationale: 'Synthetic unit-test guidance.'}, commercialContentDisclosure: {recommendation: 'disable', rationale: 'Synthetic unit-test guidance.'}, nativeCaptions: {recommendation: 'evaluate-during-private-preview', rationale: 'Synthetic unit-test guidance.'}, location: 'none', link: 'none', notes: [], manualPublication: {visibility: 'public', authorization: ownerDecision}}});
    const p = generateDeliveryPackage({variantId: v.id, outputRoot: join(f.root, 'auth'), dependencies: {...f.dependencies, variantRegistry: createPlatformVariantRegistry([v], deliveryDependencies.assetRegistry, f.registry)}});
    const before = readdirSync(f.root);
    const auth = {schemaVersion: 2, id: 'publication-authorization.synthetic.fixture', enteredAt: '2026-10-02T11:00:00.000Z', ownerDecision, platformVariant: {id: v.id, revision: v.revision, sha256: sha256Json(v)}, delivery: {id: p.manifest.deliveryId, sha256: sha256Json(p.manifest)}, mediaArtifact: v.mediaArtifact, execution: 'owner-manual-only'};
    expect(validatePublicationMediaAuthorization(auth, p.manifest, v, f.registry).mediaArtifact).toEqual(v.mediaArtifact);
    expect(readdirSync(f.root)).toEqual(before);
    expect(() => validatePublicationMediaAuthorization({...auth, mediaArtifact: {...v.mediaArtifact, sha256: '0'.repeat(64)}}, p.manifest, v, f.registry)).toThrow();
  });
  it('records exact published media/hash and rejects a different artifact', () => {
    const f = fixture(true); const v = f.variants.find(v => v.platform === 'youtube')!; const p = f.generate(v);
    const record = publicationRecordSchema.parse({...speedOfLightYoutubePublication, source: {...speedOfLightYoutubePublication.source, platformVariant: {id: v.id, revision: v.revision}, delivery: {...speedOfLightYoutubePublication.source.delivery, id: p.manifest.deliveryId, manifestSha256: sha256Json(p.manifest)}, videoSha256: f.master.sha256, mediaArtifact: mediaReference(f.master)}});
    expect(validatePublishedMediaBinding(record, p.manifest, f.registry).uploadFile).toBe('master.mp4');
    expect(() => validatePublishedMediaBinding({...record, source: {...record.source, mediaArtifact: mediaReference(f.transformed!), videoSha256: f.transformed!.sha256}}, p.manifest, f.registry)).toThrow();
    expect(() => publicationRecordSchema.parse({...record, source: {...record.source, videoSha256: '0'.repeat(64)}})).toThrow();
  });
  it('shares a cover across surfaces but permits independent artwork', () => {
    const f = fixture(false, false, true);
    for (const v of f.variants.filter(v => ['instagram', 'tiktok'].includes(v.platform))) {
      const p = f.generate(v); expect(p.manifest.artifacts.find(a => a.role === 'cover')?.mediaArtifact).toEqual(mediaReference(f.cover!));
      expect(existsSync(join(p.directory, 'cover.png'))).toBe(false);
    }
    const different = f.make('different-cover.png', 'genuinely different composition', 'image/png');
    expect(registerMediaArtifact(f.registry, different, f.root).list()).toHaveLength(3);
  });
  it('allows arbitrary presentation-specific changes without storage-based selection rules', () => {
    const f = fixture();
    for (const reason of ['UI overlap', 'crop', 'encoding', 'readability', 'new requirement not in a whitelist']) {
      const artifact = {...f.make(`variant-${reason.replaceAll(' ', '-')}.mp4`, `different payload: ${reason}`), parents: [mediaReference(f.master)]};
      expect(registerMediaArtifact(f.registry, artifact, f.root).get(mediaReference(artifact)).sha256).not.toBe(f.master.sha256);
    }
  });
  it('binds a general platform encoding derivative to the locked source without requiring a different story spec', () => {
    const f = fixture(true);
    const original = woodFrogPlatformVariants.find(v => v.platform === 'youtube')!;
    const v = platformVariantSchema.parse({...original,
      mediaArtifact: mediaReference(f.transformed!),
      sourceMaster: {...original.sourceMaster!, artifact: {path: join(f.root, 'master.mp4'), sha256: f.master.sha256}, relationship: 'platform-specific-derivative'},
      productionIntent: {...original.productionIntent, renderStrategy: 'new-render', notes: 'Synthetic encoding adaptation fixture; story and layout remain unchanged.'},
      captions: {...original.captions, behavior: 'burned-in', sourceFile: undefined}});
    const regionsPath = join(f.root, 'derivative-regions.json');
    const reportPath = join(f.root, 'derivative-report.json');
    writeFileSync(regionsPath, JSON.stringify(['disclosure','critical-visual','caption'].map(kind=>({kind,bounds:{x:300,y:400,width:100,height:100}}))));
    writeFileSync(reportPath, JSON.stringify({qa:{mediaSha256:f.transformed!.sha256,platformVariantId:v.id},assessment:{profileId:v.safeAreaProfileId,insets:{top:150,right:190,bottom:310,left:84}}}));
    const evaluated = platformVariantSchema.parse({...v,sourceMaster:{...v.sourceMaster!,contentBoundsEvidence:{regions:{path:regionsPath,sha256:mediaHash(regionsPath)},report:{path:reportPath,sha256:mediaHash(reportPath)}}}});
    const dependencies = {...f.dependencies, variantRegistry: createPlatformVariantRegistry([evaluated], deliveryDependencies.assetRegistry, f.registry),
      productionResolver: () => ({spec: woodFrog, sourceVideoPath: f.registry.resolveFile(v.mediaArtifact!)}),
      mediaInspector: () => ({...f.dependencies.mediaInspector(), durationSeconds: 40.043})};
    const p = generateDeliveryPackage({variantId: v.id, dependencies, outputRoot: join(f.root, 'encoding')});
    expect(p.manifest.source.productionChain?.lockedMaster.relationship).toBe('platform-specific-derivative');
    expect(resolveDeliveryUpload(p.manifest, f.registry).uploadFile).toBe('transformed.mp4');
    writeFileSync(reportPath, JSON.stringify({qa:{mediaSha256:f.master.sha256,platformVariantId:v.id},assessment:{profileId:v.safeAreaProfileId,insets:{top:150,right:190,bottom:310,left:84}}}));
    const stale = platformVariantSchema.parse({...evaluated,sourceMaster:{...evaluated.sourceMaster!,contentBoundsEvidence:{...evaluated.sourceMaster!.contentBoundsEvidence!,report:{path:reportPath,sha256:mediaHash(reportPath)}}}});
    expect(()=>generateDeliveryPackage({variantId:v.id,outputRoot:join(f.root,'stale-master-evidence'),dependencies:{...dependencies,variantRegistry:createPlatformVariantRegistry([stale],deliveryDependencies.assetRegistry,f.registry)}})).toThrow(/detached from media/);
    const unrelated = f.make('unrelated.mp4', 'unrelated synthetic material');
    const registry = registerMediaArtifact(f.registry, unrelated, f.root);
    writeFileSync(reportPath, JSON.stringify({qa:{mediaSha256:unrelated.sha256,platformVariantId:v.id},assessment:{profileId:v.safeAreaProfileId,insets:{top:150,right:190,bottom:310,left:84}}}));
    const detached = {...evaluated, mediaArtifact: mediaReference(unrelated),sourceMaster:{...evaluated.sourceMaster!,contentBoundsEvidence:{...evaluated.sourceMaster!.contentBoundsEvidence!,report:{path:reportPath,sha256:mediaHash(reportPath)}}}};
    expect(() => generateDeliveryPackage({variantId: v.id, outputRoot: join(f.root, 'detached'), dependencies: {...dependencies, mediaRegistry: registry, variantRegistry: createPlatformVariantRegistry([detached], deliveryDependencies.assetRegistry, registry), productionResolver: () => ({spec: woodFrog, sourceVideoPath: registry.resolveFile(mediaReference(unrelated))})}})).toThrow(/approved source master/);
  });
  it('rejects tampered references, canonical paths, extra copied payloads and legacy reference injection', () => {
    const f = fixture(); const p = f.generate(f.variants[0]!);
    const bad = structuredClone(p.manifest); bad.artifacts[0]!.path = 'different.mp4';
    writeFileSync(join(p.directory, 'manifest.json'), JSON.stringify(bad));
    expect(() => validateDeliveryPackage(p.directory, f.dependencies)).toThrow();
    writeFileSync(join(p.directory, 'manifest.json'), JSON.stringify(p.manifest)); writeFileSync(join(p.directory, 'video.mp4'), 'duplicate');
    expect(() => validateDeliveryPackage(p.directory, f.dependencies)).toThrow(/Unexpected/);
    expect(() => deliveryManifestSchema.parse({...p.manifest, schemaVersion: 2})).toThrow();
  });
});
