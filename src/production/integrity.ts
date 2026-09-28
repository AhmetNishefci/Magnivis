import {createHash} from 'node:crypto';
import approvedAssetSnapshot from '../../content-intelligence/reviews/wood-frog-freeze-v1/content-asset.approved.json';
import approvedPackageSnapshot from '../../content-intelligence/reviews/wood-frog-freeze-v1/knowledge-package.approved.json';
import ownerDecisionSnapshot from '../../content-intelligence/reviews/wood-frog-freeze-v1/owner-decision.json';
import type {VideoSpec} from '../content/schema';
import {woodFrogApprovedContentAsset} from '../content-assets/assets/wood-frog-approved';
import {stableJson} from '../content-intelligence/run-schema';
import {woodFrogApprovedKnowledgePackage} from '../knowledge/packages/wood-frog-approved';
import {woodFrogFreezeClaimIds} from '../knowledge/packages/wood-frog-freeze-tolerance';
import {woodFrogProductionPlan} from './plans/wood-frog';
import {validateProductionPlanReferences} from './schema';

const sha256Json = (value: unknown) => createHash('sha256')
  .update(stableJson(value))
  .digest('hex');

export const woodFrogApprovalHashes = Object.freeze({
  knowledgePackage: sha256Json(approvedPackageSnapshot),
  contentAsset: sha256Json(approvedAssetSnapshot),
  ownerDecision: sha256Json(ownerDecisionSnapshot),
  script: sha256Json(woodFrogApprovedContentAsset.script),
});

export const validateWoodFrogProductionPlan = () => {
  const plan = validateProductionPlanReferences(
    woodFrogProductionPlan,
    woodFrogApprovedKnowledgePackage,
    woodFrogApprovedContentAsset,
  );
  if (
    plan.knowledgePackage.sha256 !== woodFrogApprovalHashes.knowledgePackage
    || plan.contentAsset.sha256 !== woodFrogApprovalHashes.contentAsset
    || plan.ownerDecision.sha256 !== woodFrogApprovalHashes.ownerDecision
    || plan.approvedScriptSha256 !== woodFrogApprovalHashes.script
  ) {
    throw new Error('Wood Frog ProductionPlan approval hash mismatch');
  }

  const verifiedClaimIds = new Set(
    woodFrogApprovedKnowledgePackage.claims
      .filter(({verificationStatus}) => verificationStatus === 'verified')
      .map(({id}) => id),
  );
  woodFrogApprovedContentAsset.selectedClaimIds.forEach((claimId) => {
    if (!verifiedClaimIds.has(claimId)) {
      throw new Error(`Approved Wood Frog asset selects an unverified claim: ${claimId}`);
    }
  });
  if (!plan.excludedClaimIds.includes(woodFrogFreezeClaimIds.circulationCessation)) {
    throw new Error('Wood Frog ProductionPlan must explicitly exclude circulation cessation');
  }
  if (stableJson(woodFrogApprovedContentAsset).includes(woodFrogFreezeClaimIds.circulationCessation)) {
    throw new Error('Uncertain circulation claim entered the approved Wood Frog asset');
  }
  return plan;
};
export const validateWoodFrogVideoSpec = (video: VideoSpec) => {
  const plan = validateWoodFrogProductionPlan();
  if (video.contentAssetId !== woodFrogApprovedContentAsset.id || video.platformVariantId) {
    throw new Error('Wood Frog VideoSpec must directly reference its approved ContentAsset');
  }
  const production = video.production;
  if (!production) throw new Error('Wood Frog VideoSpec requires a production reference');
  if (
    production.productionPlanId !== plan.id
    || production.productionPlanRevision !== plan.revision
    || production.knowledgePackageRevision !== woodFrogApprovedKnowledgePackage.revision
    || production.contentAssetRevision !== woodFrogApprovedContentAsset.revision
    || production.approvedPackageSha256 !== woodFrogApprovalHashes.knowledgePackage
    || production.approvedContentAssetSha256 !== woodFrogApprovalHashes.contentAsset
    || production.ownerDecisionSha256 !== woodFrogApprovalHashes.ownerDecision
    || production.approvedScriptSha256 !== woodFrogApprovalHashes.script
    || production.safeAreaProfileId !== plan.safeAreaProfileId
  ) {
    throw new Error('Wood Frog VideoSpec source chain is stale or inconsistent');
  }
  if (
    video.format.width !== plan.format.width
    || video.format.height !== plan.format.height
    || video.format.fps !== plan.format.fps
    || video.format.durationSeconds !== plan.format.durationSeconds
  ) {
    throw new Error('Wood Frog VideoSpec format does not match its ProductionPlan');
  }

  const approvedSegments = woodFrogApprovedContentAsset.script.segments;
  if (
    video.audio.narrationCues.length !== approvedSegments.length
    || video.audio.narrationCues.some((cue, index) => cue.transcript !== approvedSegments[index]?.text)
  ) {
    throw new Error('Wood Frog narration does not exactly preserve the approved script');
  }
  if (video.audio.provenance?.narration.approvedScriptSha256 !== woodFrogApprovalHashes.script) {
    throw new Error('Wood Frog narration provenance does not match the approved script hash');
  }
  return video;
};
