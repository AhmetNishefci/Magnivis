import longitudeApproved from '../../content-intelligence/reviews/longitude-clock-approved-v3/content-asset.approved.json';
import {phantomTrafficContentAsset} from './assets/phantom-traffic';
import {
  speedOfLightCosmicDistanceAsset,
  speedOfLightPublishedShortAsset,
} from './assets/speed-of-light';
import {oceanDepthPublishedShortAsset} from './assets/ocean-depth';
import {woodFrogApprovedContentAsset} from './assets/wood-frog-approved';
import {contentAssetSchema, type ContentAsset} from './schema';
import {
  knowledgePackageRegistry,
  type KnowledgePackageRegistry,
} from '../knowledge/registry';

export const createContentAssetRegistry = (
  inputs: readonly unknown[],
  packageRegistry: KnowledgePackageRegistry = knowledgePackageRegistry,
) => {
  const assetMap = new Map<string, ContentAsset>();

  for (const input of inputs) {
    const asset = contentAssetSchema.parse(input);
    if (assetMap.has(asset.id)) {
      throw new Error(`Duplicate content asset ID: ${asset.id}`);
    }

    const knowledgePackage = packageRegistry.assertReference({
      packageId: asset.knowledgePackageId,
      claimIds: asset.selectedClaimIds,
      hookId: asset.hookId,
    });
    const hook = knowledgePackage.hooks.find(({id}) => id === asset.hookId);
    if (!hook) throw new Error(`Unknown hook ${asset.hookId}`);
    const selectedClaimIds = new Set(asset.selectedClaimIds);
    for (const claimId of hook.claimIds) {
      if (!selectedClaimIds.has(claimId)) {
        throw new Error(
          `Content asset ${asset.id} does not select hook claim ${claimId}`,
        );
      }
    }

    if (
      ['approved', 'production-ready'].includes(asset.editorialStatus)
      && !['approved', 'archived'].includes(knowledgePackage.editorialStatus)
    ) {
      throw new Error(
        `Content asset ${asset.id} cannot be ${asset.editorialStatus} while package ${knowledgePackage.id} is ${knowledgePackage.editorialStatus}`,
      );
    }

    assetMap.set(asset.id, asset);
  }

  const assets = [...assetMap.values()].sort((left, right) =>
    left.id.localeCompare(right.id));

  const get = (id: string) => {
    const asset = assetMap.get(id);
    if (!asset) throw new Error(`Unknown content asset: ${id}`);
    return asset;
  };

  return Object.freeze({
    get,
    list: () => [...assets],
    listByKnowledgePackage: (packageId: string) => assets.filter(
      ({knowledgePackageId}) => knowledgePackageId === packageId,
    ),
  });
};

export const contentAssetRegistry = createContentAssetRegistry([
  longitudeApproved,
  oceanDepthPublishedShortAsset,
  phantomTrafficContentAsset,
  speedOfLightPublishedShortAsset,
  speedOfLightCosmicDistanceAsset,
  woodFrogApprovedContentAsset,
]);

export type ContentAssetRegistry = ReturnType<typeof createContentAssetRegistry>;
