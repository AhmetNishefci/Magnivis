import {z} from 'zod';
import {contentAssetSchema, type ContentAsset} from '../content-assets/schema';
import {
  knowledgePackageSchema,
  stableKnowledgeIdSchema,
  verificationStatusSchema,
  type KnowledgePackage,
} from '../knowledge/schema';
import {sha256Json} from './run-schema';

export const claimReviewDecisionSchema = z.enum(['retain', 'revise', 'reject']);

const reviewedEvidenceSchema = z.object({
  sourceId: stableKnowledgeIdSchema,
  locator: z.string().min(1),
  assessment: z.string().min(1),
}).strict();

export const sourceInspectionSchema = z.object({
  sourceId: stableKnowledgeIdSchema,
  accessStatus: z.enum(['inspected', 'abstract-only', 'partially-inspected', 'inaccessible']),
  identityConfirmed: z.boolean(),
  evidenceLocations: z.array(z.string().min(1)),
  supportsClaimIds: z.array(stableKnowledgeIdSchema),
  limitations: z.array(z.string().min(1)),
}).strict();

export const claimReviewEntrySchema = z.object({
  claimId: stableKnowledgeIdSchema,
  statement: z.string().min(1),
  statementSha256: z.string().regex(/^[a-f0-9]{64}$/),
  decision: claimReviewDecisionSchema,
  priorStatement: z.string().min(1).optional(),
  recommendedVerificationStatus: verificationStatusSchema,
  rationale: z.string().min(1),
  evidence: z.array(reviewedEvidenceSchema).min(1),
  limitations: z.array(z.string().min(1)),
  useInRecommendedAsset: z.boolean(),
  ownerDecisionRequired: z.literal(true),
}).strict().superRefine((entry, context) => {
  if (entry.statementSha256 !== sha256Json(entry.statement)) {
    context.addIssue({
      code: 'custom',
      path: ['statementSha256'],
      message: 'Claim statement hash does not match the reviewed wording',
    });
  }
  if (entry.decision === 'revise' && !entry.priorStatement) {
    context.addIssue({
      code: 'custom',
      path: ['priorStatement'],
      message: 'Revised claims must preserve the prior wording',
    });
  }
  if (entry.decision === 'reject' && entry.useInRecommendedAsset) {
    context.addIssue({
      code: 'custom',
      path: ['useInRecommendedAsset'],
      message: 'Rejected claims cannot be used in the recommended asset',
    });
  }
});

export const claimReviewBundleSchema = z.object({
  schemaVersion: z.literal(1),
  id: stableKnowledgeIdSchema.refine((id) => id.startsWith('claim-review.')),
  packageId: stableKnowledgeIdSchema,
  packageRevision: z.number().int().positive(),
  assetId: stableKnowledgeIdSchema,
  assetRevision: z.number().int().positive(),
  preparedBy: z.object({
    kind: z.literal('ai-assisted-research'),
    name: z.string().min(1),
  }).strict(),
  preparedAt: z.iso.datetime(),
  status: z.literal('ready-for-owner-decision'),
  sourceInspections: z.array(sourceInspectionSchema).min(1),
  claimReviews: z.array(claimReviewEntrySchema).min(1),
  recommendedHookId: stableKnowledgeIdSchema,
  unresolvedResearch: z.array(z.string().min(1)),
}).strict();

const ownerClaimDecisionSchema = z.object({
  claimId: stableKnowledgeIdSchema,
  statementSha256: z.string().regex(/^[a-f0-9]{64}$/),
  decision: z.enum(['approve', 'reject']),
  notes: z.string().min(1),
}).strict();

export const ownerEditorialDecisionSchema = z.object({
  schemaVersion: z.literal(1),
  id: stableKnowledgeIdSchema.refine((id) => id.startsWith('owner-decision.')),
  reviewId: stableKnowledgeIdSchema,
  reviewer: z.string().min(1),
  reviewedAt: z.iso.datetime(),
  packageId: stableKnowledgeIdSchema,
  packageRevision: z.number().int().positive(),
  assetId: stableKnowledgeIdSchema,
  assetRevision: z.number().int().positive(),
  claimDecisions: z.array(ownerClaimDecisionSchema).min(1),
  approvedHookId: stableKnowledgeIdSchema,
  assetDecision: z.enum(['approve', 'reject']),
  notes: z.string().min(1),
  explicitConfirmation: z.literal('I reviewed the evidence and approve these editorial decisions.'),
}).strict();

const duplicateValues = (values: readonly string[]) => {
  const seen = new Set<string>();
  return [...new Set(values.filter((value) => {
    if (seen.has(value)) return true;
    seen.add(value);
    return false;
  }))];
};

export const validateClaimReviewBundle = (
  input: unknown,
  knowledgePackage: KnowledgePackage,
  contentAsset: ContentAsset,
) => {
  const review = claimReviewBundleSchema.parse(input);
  if (
    review.packageId !== knowledgePackage.id
    || review.packageRevision !== knowledgePackage.revision
    || review.assetId !== contentAsset.id
    || review.assetRevision !== contentAsset.revision
  ) {
    throw new Error('Claim review references a stale package or asset revision');
  }

  const sourceIds = new Set(knowledgePackage.sources.map(({id}) => id));
  const claimById = new Map(knowledgePackage.claims.map((claim) => [claim.id, claim]));
  const hookIds = new Set(knowledgePackage.hooks.map(({id}) => id));
  const selectedClaimIds = new Set(contentAsset.selectedClaimIds);

  for (const duplicate of duplicateValues(review.sourceInspections.map(({sourceId}) => sourceId))) {
    throw new Error(`Duplicate source inspection: ${duplicate}`);
  }
  for (const duplicate of duplicateValues(review.claimReviews.map(({claimId}) => claimId))) {
    throw new Error(`Duplicate claim review: ${duplicate}`);
  }
  if (review.sourceInspections.length !== sourceIds.size) {
    throw new Error('Claim review must record one inspection for every package source');
  }
  if (review.claimReviews.length !== claimById.size) {
    throw new Error('Claim review must record one decision for every package claim');
  }
  if (!hookIds.has(review.recommendedHookId)) {
    throw new Error(`Unknown recommended hook: ${review.recommendedHookId}`);
  }
  if (review.recommendedHookId !== contentAsset.hookId) {
    throw new Error('Reviewed ContentAsset must use the recommended hook');
  }

  const inspectionBySource = new Map(review.sourceInspections.map((inspection) => [inspection.sourceId, inspection]));
  review.sourceInspections.forEach((inspection) => {
    if (!sourceIds.has(inspection.sourceId)) {
      throw new Error(`Unknown inspected source: ${inspection.sourceId}`);
    }
    inspection.supportsClaimIds.forEach((claimId) => {
      const supportedClaim = claimById.get(claimId);
      if (!supportedClaim) throw new Error(`Source inspection references unknown claim: ${claimId}`);
      if (!supportedClaim.evidence.some(({sourceId}) => sourceId === inspection.sourceId)) {
        throw new Error(`Source inspection claims unsupported evidence linkage: ${inspection.sourceId} -> ${claimId}`);
      }
    });
    if (
      (!inspection.identityConfirmed || inspection.accessStatus === 'inaccessible')
      && inspection.supportsClaimIds.length > 0
    ) {
      throw new Error(`Unconfirmed or inaccessible source cannot support claims: ${inspection.sourceId}`);
    }
  });

  review.claimReviews.forEach((entry) => {
    const claim = claimById.get(entry.claimId);
    if (!claim) throw new Error(`Claim review references unknown claim: ${entry.claimId}`);
    if (claim.statement !== entry.statement || entry.statementSha256 !== sha256Json(claim.statement)) {
      throw new Error(`Claim review wording is stale: ${entry.claimId}`);
    }
    if (entry.useInRecommendedAsset !== selectedClaimIds.has(entry.claimId)) {
      throw new Error(`Claim review asset-use flag is inconsistent: ${entry.claimId}`);
    }
    const claimEvidence = new Set(claim.evidence.map(({sourceId, locator}) => `${sourceId}\n${locator ?? ''}`));
    entry.evidence.forEach(({sourceId, locator}) => {
      if (!sourceIds.has(sourceId)) throw new Error(`Claim review references unknown source: ${sourceId}`);
      if (!claimEvidence.has(`${sourceId}\n${locator}`)) {
        throw new Error(`Claim review evidence locator is not present on the claim: ${entry.claimId}`);
      }
      const inspection = inspectionBySource.get(sourceId);
      if (!inspection?.identityConfirmed || inspection.accessStatus === 'inaccessible') {
        throw new Error(`Claim review relies on unconfirmed or inaccessible evidence: ${sourceId}`);
      }
    });
    if (
      entry.recommendedVerificationStatus === 'verified'
      && !['supported', 'verified'].includes(claim.verificationStatus)
    ) {
      throw new Error(`Claim cannot be recommended verified from ${claim.verificationStatus}: ${entry.claimId}`);
    }
  });
  return review;
};

export const promoteReviewedEditorialPackage = ({
  review: reviewInput,
  decision: decisionInput,
  knowledgePackage,
  contentAsset,
}: {
  review: unknown;
  decision: unknown;
  knowledgePackage: KnowledgePackage;
  contentAsset: ContentAsset;
}) => {
  const review = validateClaimReviewBundle(reviewInput, knowledgePackage, contentAsset);
  const decision = ownerEditorialDecisionSchema.parse(decisionInput);
  if (
    decision.reviewId !== review.id
    || decision.packageId !== knowledgePackage.id
    || decision.packageRevision !== knowledgePackage.revision
    || decision.assetId !== contentAsset.id
    || decision.assetRevision !== contentAsset.revision
  ) {
    throw new Error('Owner decision references a stale or different review target');
  }

  const reviewByClaim = new Map(review.claimReviews.map((entry) => [entry.claimId, entry]));
  const decisions = new Map<string, z.infer<typeof ownerClaimDecisionSchema>>();
  decision.claimDecisions.forEach((entry) => {
    if (decisions.has(entry.claimId)) throw new Error(`Duplicate owner claim decision: ${entry.claimId}`);
    const reviewed = reviewByClaim.get(entry.claimId);
    if (!reviewed) throw new Error(`Owner decision references an unreviewed claim: ${entry.claimId}`);
    if (entry.statementSha256 !== reviewed.statementSha256) {
      throw new Error(`Owner decision uses stale claim wording: ${entry.claimId}`);
    }
    if (
      entry.decision === 'approve'
      && (reviewed.decision === 'reject' || reviewed.recommendedVerificationStatus !== 'verified')
    ) {
      throw new Error(`Claim is not eligible for verification: ${entry.claimId}`);
    }
    decisions.set(entry.claimId, entry);
  });
  if (decisions.size !== review.claimReviews.length) {
    throw new Error('Owner decision must explicitly decide every reviewed claim');
  }

  const approvedHook = knowledgePackage.hooks.find(({id}) => id === decision.approvedHookId);
  if (!approvedHook) throw new Error(`Owner decision references unknown hook: ${decision.approvedHookId}`);
  approvedHook.claimIds.forEach((claimId) => {
    if (decisions.get(claimId)?.decision !== 'approve') {
      throw new Error(`Approved hook references a rejected claim: ${claimId}`);
    }
  });
  if (decision.assetDecision === 'approve') {
    contentAsset.selectedClaimIds.forEach((claimId) => {
      if (decisions.get(claimId)?.decision !== 'approve') {
        throw new Error(`Rejected claim cannot appear in an approved asset: ${claimId}`);
      }
    });
    if (contentAsset.hookId !== decision.approvedHookId) {
      throw new Error('Owner-approved hook must match the reviewed ContentAsset hook');
    }
  }

  const reviewMetadata = {
    reviewedBy: decision.reviewer,
    reviewedAt: decision.reviewedAt.slice(0, 10),
    notes: `Approved through ${review.id}; ${decision.notes}`,
  };
  const approvalMetadata = {
    approvedBy: decision.reviewer,
    approvedAt: decision.reviewedAt.slice(0, 10),
    notes: `Approved through ${review.id}; ${decision.notes}`,
  };
  const promotedPackage = knowledgePackageSchema.parse({
    ...structuredClone(knowledgePackage),
    claims: knowledgePackage.claims.map((claim) => decisions.get(claim.id)?.decision === 'approve'
      ? {...claim, verificationStatus: 'verified', review: reviewMetadata}
      : claim),
    editorialStatus: decision.assetDecision === 'approve' ? 'approved' : 'review',
    ...(decision.assetDecision === 'approve' ? {approval: approvalMetadata} : {}),
  });
  const promotedAsset = contentAssetSchema.parse({
    ...structuredClone(contentAsset),
    editorialStatus: decision.assetDecision === 'approve' ? 'approved' : 'editorial-review',
    ...(decision.assetDecision === 'approve' ? {approval: approvalMetadata} : {}),
  });
  return {review, decision, knowledgePackage: promotedPackage, contentAsset: promotedAsset};
};

export type ClaimReviewBundle = z.infer<typeof claimReviewBundleSchema>;
export type OwnerEditorialDecision = z.infer<typeof ownerEditorialDecisionSchema>;
