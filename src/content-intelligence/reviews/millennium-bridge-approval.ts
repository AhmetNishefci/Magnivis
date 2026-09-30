import {readFileSync, writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {millenniumBridgeContentAsset as asset} from '../../content-assets/assets/millennium-bridge';
import {millenniumBridgeKnowledgePackage as knowledgePackage} from '../../knowledge/packages/millennium-bridge';
import {promoteReviewedEditorialPackage} from '../claim-review';
import {sha256Json, stableJson} from '../run-schema';
import {millenniumBridgeClaimReview as review, millenniumBridgeExclusions, validateMillenniumBridgeReviewArtifacts} from './millennium-bridge';

export const millenniumBridgeReviewDirectory = 'content-intelligence/reviews/millennium-bridge-reconstruction-v1';
const json = (value: unknown) => `${stableJson(value, 2)}\n`;

export const millenniumBridgeApprovalArtifacts = (decision: unknown) => {
  const promotion = promoteReviewedEditorialPackage({review, decision, knowledgePackage, contentAsset: asset});
  if (promotion.decision.assetDecision !== 'approve') throw new Error('Design exploration requires editorial approval');
  const binding = {
    kind: 'current-owner-reconstruction-editorial-approval',
    reviewedCommit: '8be2020c4a0f82b5567f6af41a83282e6c0c051b',
    decisionId: promotion.decision.id, reviewedAt: promotion.decision.reviewedAt,
    timestampMeaning: 'Actual current decision-entry time recording explicit owner approval in the Milestone 2 instruction; not a historical review timestamp.',
    reviewer: promotion.decision.reviewer,
    reviewedPackageSha256: sha256Json(knowledgePackage), reviewedAssetSha256: sha256Json(asset),
    approvedPackageSha256: sha256Json(promotion.knowledgePackage), approvedAssetSha256: sha256Json(promotion.contentAsset),
    ownerDecisionSha256: sha256Json(promotion.decision), hookSha256: sha256Json(knowledgePackage.hooks.find(({id}) => id === asset.hookId)),
    narrationSha256: sha256Json(asset.script.segments.map(({text}) => text).join(' ')),
    narrativeBeatsSha256: sha256Json(asset.narrativeStructure), visualPlanSha256: sha256Json(asset.visualPlan),
    sourceInspectionsSha256: sha256Json(review.sourceInspections), exclusionsSha256: sha256Json(millenniumBridgeExclusions),
    claimReviewSha256: sha256Json(review),
    authority: {editorialApproved: true, productionPlanningAndDesignExploration: true, designFramesApproved: false, fullVideoRender: false, platformActivity: false, publication: false},
  };
  return {
    promotion,
    files: {
      'owner-decision.json': json(promotion.decision),
      'knowledge-package.approved.json': json(promotion.knowledgePackage),
      'content-asset.approved.json': json(promotion.contentAsset),
      'editorial-approval-binding.json': json(binding),
    },
  };
};

export const writeMillenniumBridgeApprovalArtifacts = (directory: string, decision: unknown) => {
  validateMillenniumBridgeReviewArtifacts(directory);
  const {files} = millenniumBridgeApprovalArtifacts(decision);
  for (const [filename, text] of Object.entries(files)) writeFileSync(resolve(directory, filename), text, 'utf8');
};

export const validateMillenniumBridgeApprovalArtifacts = (directory: string) => {
  validateMillenniumBridgeReviewArtifacts(directory);
  const decision: unknown = JSON.parse(readFileSync(resolve(directory, 'owner-decision.json'), 'utf8'));
  const {files, promotion} = millenniumBridgeApprovalArtifacts(decision);
  for (const [filename, expected] of Object.entries(files)) {
    if (readFileSync(resolve(directory, filename), 'utf8') !== expected) throw new Error(`Stale or modified editorial approval artifact: ${filename}`);
  }
  return promotion;
};
