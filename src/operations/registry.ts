import {loadMediaRegistry, type MediaRegistry} from '../artifacts/media';
import {contentAssetRegistry, type ContentAssetRegistry} from '../content-assets/registry';
import {knowledgePackageRegistry, type KnowledgePackageRegistry} from '../knowledge/registry';
import {platformVariantRegistry, type PlatformVariantRegistry} from '../platform-variants/registry';
import {platformAccounts} from './platform-accounts';
import {publicationRecords} from './publications';
import {
  metricSnapshotSchema,
  platformAccountSchema,
  publicationRecordSchema,
  type MetricSnapshot,
  type PlatformAccount,
  type PublicationRecord,
} from './schema';

export const createPlatformAccountRegistry = (inputs: readonly unknown[]) => {
  const accountMap = new Map<string, PlatformAccount>();
  const handles = new Set<string>();
  for (const input of inputs) {
    const account = platformAccountSchema.parse(input);
    if (accountMap.has(account.id)) throw new Error(`Duplicate platform account ID: ${account.id}`);
    if (account.handle) {
      const key = `${account.platform}:${account.handle.toLowerCase()}`;
      if (handles.has(key)) throw new Error(`Duplicate platform account handle: ${key}`);
      handles.add(key);
    }
    accountMap.set(account.id, account);
  }
  const accounts = [...accountMap.values()].sort((left, right) => left.id.localeCompare(right.id));
  return Object.freeze({
    get: (id: string) => {
      const account = accountMap.get(id);
      if (!account) throw new Error(`Unknown platform account: ${id}`);
      return account;
    },
    list: () => [...accounts],
  });
};

export type PlatformAccountRegistry = ReturnType<typeof createPlatformAccountRegistry>;

export const createPublicationRegistry = (
  inputs: readonly unknown[],
  accounts: PlatformAccountRegistry,
  variants: PlatformVariantRegistry = platformVariantRegistry,
  assets: ContentAssetRegistry = contentAssetRegistry,
  packages: KnowledgePackageRegistry = knowledgePackageRegistry,
  media?: MediaRegistry,
) => {
  const publicationMap = new Map<string, PublicationRecord>();
  const remoteKeys = new Set<string>();
  for (const input of inputs) {
    const publication = publicationRecordSchema.parse(input);
    if (publicationMap.has(publication.id)) throw new Error(`Duplicate publication ID: ${publication.id}`);
    const account = accounts.get(publication.platformAccountId);
    if (account.platform !== publication.platform) throw new Error(`Publication account platform mismatch: ${publication.id}`);
    const variant = variants.get(publication.source.platformVariant.id);
    const asset = assets.get(publication.source.contentAsset.id);
    const knowledgePackage = packages.get(publication.source.knowledgePackage.id);
    if (variant.mediaArtifact || publication.source.mediaArtifact) {
      if (!variant.mediaArtifact || !publication.source.mediaArtifact || variant.mediaArtifact.id !== publication.source.mediaArtifact.id || variant.mediaArtifact.sha256 !== publication.source.videoSha256) throw new Error('Publication must identify exactly the media used by its PlatformVariant');
      (media ?? loadMediaRegistry()).resolveFile(publication.source.mediaArtifact);
    }
    const expectedDeliveryId = `delivery.${variant.id}.r${variant.revision}`;
    if (
      variant.revision !== publication.source.platformVariant.revision
      || variant.platform !== publication.platform
      || variant.contentAssetId !== asset.id
      || asset.revision !== publication.source.contentAsset.revision
      || asset.knowledgePackageId !== knowledgePackage.id
      || knowledgePackage.revision !== publication.source.knowledgePackage.revision
      || variant.productionIntent.videoSpecId !== publication.source.videoSpecId
      || publication.source.delivery.id !== expectedDeliveryId
    ) {
      throw new Error(`Publication source chain mismatch: ${publication.id}`);
    }
    if (publication.remote) {
      const key = `${publication.platform}:${publication.remote.postId}`;
      if (remoteKeys.has(key)) throw new Error(`Duplicate remote publication: ${key}`);
      remoteKeys.add(key);
    }
    publicationMap.set(publication.id, publication);
  }
  const publications = [...publicationMap.values()].sort((left, right) => left.id.localeCompare(right.id));
  return Object.freeze({
    get: (id: string) => {
      const publication = publicationMap.get(id);
      if (!publication) throw new Error(`Unknown publication: ${id}`);
      return publication;
    },
    list: () => [...publications],
  });
};

export type PublicationRegistry = ReturnType<typeof createPublicationRegistry>;

export const createMetricSnapshotRegistry = (
  inputs: readonly unknown[],
  publications: PublicationRegistry,
) => {
  const snapshotMap = new Map<string, MetricSnapshot>();
  for (const input of inputs) {
    const snapshot = metricSnapshotSchema.parse(input);
    if (snapshotMap.has(snapshot.id)) throw new Error(`Duplicate metric snapshot ID: ${snapshot.id}`);
    publications.get(snapshot.publicationId);
    snapshotMap.set(snapshot.id, snapshot);
  }
  const snapshots = [...snapshotMap.values()].sort((left, right) => left.id.localeCompare(right.id));
  return Object.freeze({
    get: (id: string) => {
      const snapshot = snapshotMap.get(id);
      if (!snapshot) throw new Error(`Unknown metric snapshot: ${id}`);
      return snapshot;
    },
    list: () => [...snapshots],
    listByPublication: (publicationId: string) => snapshots.filter(
      (snapshot) => snapshot.publicationId === publicationId,
    ),
  });
};

export const platformAccountRegistry = createPlatformAccountRegistry(platformAccounts);
export const publicationRegistry = createPublicationRegistry(
  publicationRecords,
  platformAccountRegistry,
);
export const metricSnapshotRegistry = createMetricSnapshotRegistry([], publicationRegistry);
