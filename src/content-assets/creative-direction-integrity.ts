import type {ContentAsset} from './schema';
import type {KnowledgePackage} from '../knowledge/schema';
import {creativeDirectionSchema} from './creative-direction';
import {sha256Json} from '../content-intelligence/run-schema';

export const validateCreativeDirection = (input: unknown, pkg: KnowledgePackage, asset: ContentAsset) => {
  const direction = creativeDirectionSchema.parse(input);
  const matches = (ref: {id:string;revision:number;sha256:string}, actual: {id:string;revision:number}) =>
    ref.id === actual.id && ref.revision === actual.revision && ref.sha256 === sha256Json(actual);
  if (!matches(direction.knowledgePackage, pkg) || !matches(direction.contentAsset, asset)
    || asset.knowledgePackageId !== pkg.id || direction.approvedScriptSha256 !== sha256Json(asset.script)) {
    throw new Error('Creative direction changed or targets stale editorial authority');
  }
  if (pkg.editorialStatus !== 'approved' || !['approved','production-ready'].includes(asset.editorialStatus)) {
    throw new Error('Creative direction requires approved editorial sources');
  }
  if (asset.selectedClaimIds.some(id => pkg.claims.find(c => c.id === id)?.verificationStatus !== 'verified')) {
    throw new Error('Creative direction cannot promote non-verified claims');
  }
  return direction;
};
