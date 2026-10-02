import {z} from 'zod';
import {mediaReferenceSchema, loadMediaRegistry, type MediaRegistry, mediaHash} from '../artifacts/media';
import {deliveryManifestSchema, type DeliveryManifest} from './schema';
import type {PlatformVariant} from '../platform-variants/schema';
import {sha256Json} from '../content-intelligence/run-schema';
import type {PublicationRecord} from '../operations/schema';

/** Exact authority binding, separate from media, delivery readiness and publication evidence. */
export const publicationMediaAuthorizationSchema = z.object({
  schemaVersion: z.literal(2),
  id: z.string().startsWith('publication-authorization.'),
  enteredAt: z.iso.datetime(),
  ownerDecision: z.object({id: z.string().startsWith('owner-decision.'), revision: z.number().int().positive(), sha256: z.string().regex(/^[a-f0-9]{64}$/)}).strict(),
  platformVariant: z.object({id: z.string().min(1), revision: z.number().int().positive(), sha256: z.string().regex(/^[a-f0-9]{64}$/)}).strict(),
  delivery: z.object({id: z.string().startsWith('delivery.'), sha256: z.string().regex(/^[a-f0-9]{64}$/)}).strict(),
  mediaArtifact: mediaReferenceSchema,
  execution: z.literal('owner-manual-only'),
}).strict();
export const validatePublicationMediaAuthorization = (input: unknown, manifest: DeliveryManifest, variant: PlatformVariant, registry: MediaRegistry = loadMediaRegistry()) => {
  const authorization = publicationMediaAuthorizationSchema.parse(input);
  const approval = variant.approval?.ownerDecision;
  const releaseAuthority = variant.operatorGuidance?.manualPublication?.authorization;
  if (manifest.schemaVersion !== 3 || manifest.state !== 'ready-for-manual-upload' || !manifest.publishEligible || variant.status !== 'production-ready'
    || !releaseAuthority || sha256Json(releaseAuthority) !== sha256Json(authorization.ownerDecision)
    || !approval || sha256Json(approval) !== sha256Json(authorization.ownerDecision)
    || authorization.platformVariant.id !== variant.id || authorization.platformVariant.revision !== variant.revision || authorization.platformVariant.sha256 !== sha256Json(variant)
    || manifest.source.platformVariant.id !== variant.id || manifest.source.platformVariant.revision !== variant.revision
    || authorization.delivery.id !== manifest.deliveryId || authorization.delivery.sha256 !== sha256Json(manifest)
    || authorization.mediaArtifact.id !== manifest.source.mediaArtifact?.id || authorization.mediaArtifact.sha256 !== manifest.source.mediaArtifact?.sha256
    || authorization.mediaArtifact.id !== variant.mediaArtifact?.id || authorization.mediaArtifact.sha256 !== variant.mediaArtifact?.sha256) throw new Error('Publication authorization does not bind the exact reviewed ready delivery/variant/media');
  registry.resolveFile(authorization.mediaArtifact);
  return authorization;
};
/** Read-only upload resolution for both frozen portable packages and prospective V3. */
export const resolveDeliveryUpload = (input: unknown, registry: MediaRegistry = loadMediaRegistry()) => {
  const manifest = deliveryManifestSchema.parse(input);
  const video = manifest.artifacts.find(a => a.role === 'video')!;
  const artifact = video.mediaArtifact ? registry.get(video.mediaArtifact) : registry.byHash(video.sha256);
  if (!artifact || artifact.sha256 !== video.sha256 || artifact.bytes !== video.bytes) throw new Error('Delivery media is not catalogued or exact');
  const ref = {id: artifact.id, sha256: artifact.sha256};
  const path = registry.resolveFile(ref);
  if (mediaHash(path) !== video.sha256) throw new Error('Upload byte identity mismatch');
  return {mediaArtifact: ref, uploadFile: artifact.canonicalPath, absoluteUploadFile: path, bytes: artifact.bytes, legacyPackage: manifest.schemaVersion < 3};
};
/** After actual evidence exists, bind a native PublicationRecord to the actual upload. No records are generated here. */
export const validatePublishedMediaBinding = (record: PublicationRecord, manifest: DeliveryManifest, registry: MediaRegistry = loadMediaRegistry(), manifestFileSha256?: string) => {
  const upload = resolveDeliveryUpload(manifest, registry);
  if (!record.source.mediaArtifact || record.source.mediaArtifact.id !== upload.mediaArtifact.id || record.source.videoSha256 !== upload.mediaArtifact.sha256 || record.source.mediaArtifact.sha256 !== upload.mediaArtifact.sha256
    || record.source.delivery.id !== manifest.deliveryId || record.source.delivery.manifestSha256 !== (manifestFileSha256 ?? sha256Json(manifest))
    || record.source.platformVariant.id !== manifest.source.platformVariant.id || record.source.platformVariant.revision !== manifest.source.platformVariant.revision) throw new Error('Published identity differs from the actual delivery media');
  return upload;
};
