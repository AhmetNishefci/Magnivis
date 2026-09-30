import {speedOfLightKnowledgePackage} from './packages/speed-of-light';
import {millenniumBridgeApprovedKnowledgePackage} from './packages/millennium-bridge-approved';
import {oceanDepthKnowledgePackage} from './packages/ocean-depth';
import {woodFrogApprovedKnowledgePackage} from './packages/wood-frog-approved';
import {
  knowledgePackageSchema,
  type KnowledgePackage,
  type KnowledgeSource,
} from './schema';

export type KnowledgeReference = {
  packageId: string;
  claimIds: readonly string[];
  hookId: string;
};

const sameSource = (left: KnowledgeSource, right: KnowledgeSource) =>
  JSON.stringify(left) === JSON.stringify(right);

export const createKnowledgePackageRegistry = (
  inputs: readonly unknown[],
) => {
  const packageMap = new Map<string, KnowledgePackage>();
  const sourceMap = new Map<string, KnowledgeSource>();

  for (const input of inputs) {
    const knowledgePackage = knowledgePackageSchema.parse(input);
    if (packageMap.has(knowledgePackage.id)) {
      throw new Error(`Duplicate knowledge package ID: ${knowledgePackage.id}`);
    }
    packageMap.set(knowledgePackage.id, knowledgePackage);

    for (const source of knowledgePackage.sources) {
      const existing = sourceMap.get(source.id);
      if (existing && !sameSource(existing, source)) {
        throw new Error(`Conflicting knowledge source ID: ${source.id}`);
      }
      sourceMap.set(source.id, source);
    }
  }

  const packages = [...packageMap.values()].sort((left, right) =>
    left.id.localeCompare(right.id));
  const sources = [...sourceMap.values()].sort((left, right) =>
    left.id.localeCompare(right.id));

  const get = (id: string) => {
    const knowledgePackage = packageMap.get(id);
    if (!knowledgePackage) throw new Error(`Unknown knowledge package: ${id}`);
    return knowledgePackage;
  };

  const assertReference = (reference: KnowledgeReference) => {
    const knowledgePackage = get(reference.packageId);
    const claimIds = new Set(knowledgePackage.claims.map(({id}) => id));
    const hookIds = new Set(knowledgePackage.hooks.map(({id}) => id));

    for (const claimId of reference.claimIds) {
      if (!claimIds.has(claimId)) {
        throw new Error(
          `Unknown claim ${claimId} in knowledge package ${reference.packageId}`,
        );
      }
    }
    if (!hookIds.has(reference.hookId)) {
      throw new Error(
        `Unknown hook ${reference.hookId} in knowledge package ${reference.packageId}`,
      );
    }
    return knowledgePackage;
  };

  return Object.freeze({
    get,
    assertReference,
    list: () => [...packages],
    listSources: () => [...sources],
  });
};

export type KnowledgePackageRegistry = ReturnType<typeof createKnowledgePackageRegistry>;

export const knowledgePackageRegistry = createKnowledgePackageRegistry([
  millenniumBridgeApprovedKnowledgePackage,
  oceanDepthKnowledgePackage,
  speedOfLightKnowledgePackage,
  woodFrogApprovedKnowledgePackage,
]);
