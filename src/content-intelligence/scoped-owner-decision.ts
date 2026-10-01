import {z} from 'zod';
import {knowledgePackageSchema, stableKnowledgeIdSchema, type KnowledgePackage} from '../knowledge/schema';
import type {ContentAsset} from '../content-assets/schema';
import {validateClaimReviewBundle} from './claim-review';
import {sha256Json} from './run-schema';

const hashSchema = z.string().regex(/^[a-f0-9]{64}$/);
// A component decision does not imply approval of the complete script or asset.
export const scopedOwnerDecisionSchema = z.object({
  schemaVersion: z.literal(1),
  id: stableKnowledgeIdSchema.refine((id) => id.startsWith('owner-decision.')),
  kind: z.literal('claims-and-concept-editorial-finalization'),
  reviewer: z.string().min(1),
  enteredAt: z.iso.datetime(),
  timeBasis: z.literal('decision-entry'),
  ownerSuppliedReviewTimestamp: z.null(),
  authority: z.literal('explicit-owner-message'),
  ownerInstruction: z.string().min(1),
  reviewId: stableKnowledgeIdSchema,
  reviewSha256: hashSchema,
  packageId: stableKnowledgeIdSchema,
  packageRevision: z.number().int().positive(),
  packageSha256: hashSchema,
  assetId: stableKnowledgeIdSchema,
  assetRevision: z.number().int().positive(),
  assetSha256: hashSchema,
  researchArtifactHashes: z.array(z.object({path: z.string().min(1), sha256: hashSchema}).strict()).min(1),
  claimDecisions: z.array(z.object({
    claimId: stableKnowledgeIdSchema, statementSha256: hashSchema,
    decision: z.enum(['approve', 'reject', 'defer']), notes: z.string().min(1),
  }).strict()).min(1),
  approvedHookId: stableKnowledgeIdSchema,
  approvedComponents: z.array(z.enum([
    'qualifications', 'exclusions', 'source-limitations', 'narrative-structure',
    'conceptual-visual-plan', 'caption-direction', 'reconstruction-disclosures',
  ])).min(1),
  assetDecision: z.literal('pending-final-narration'),
  authorizedNextStep: z.literal('editorial-finalization-only'),
  productionAuthorized: z.literal(false),
  publicationAuthorized: z.literal(false),
}).strict();

export const applyScopedOwnerDecision = ({decision: input, review: reviewInput, knowledgePackage, contentAsset}: {
  decision: unknown; review: unknown; knowledgePackage: KnowledgePackage; contentAsset: ContentAsset;
}) => {
  const review = validateClaimReviewBundle(reviewInput, knowledgePackage, contentAsset);
  const decision = scopedOwnerDecisionSchema.parse(input);
  if (decision.reviewId !== review.id || decision.reviewSha256 !== sha256Json(review)
    || decision.packageId !== knowledgePackage.id || decision.packageRevision !== knowledgePackage.revision
    || decision.packageSha256 !== sha256Json(knowledgePackage)
    || decision.assetId !== contentAsset.id || decision.assetRevision !== contentAsset.revision
    || decision.assetSha256 !== sha256Json(contentAsset)) throw new Error('Scoped owner decision targets stale research/package/asset state');
  if (new Set(decision.approvedComponents).size !== decision.approvedComponents.length
    || new Set(decision.researchArtifactHashes.map(({path}) => path)).size !== decision.researchArtifactHashes.length) {
    throw new Error('Duplicate scoped approval component or research binding');
  }
  const byId = new Map(decision.claimDecisions.map((c) => [c.claimId, c]));
  if (byId.size !== decision.claimDecisions.length || byId.size !== knowledgePackage.claims.length) {
    throw new Error('Scoped decision must account for every claim exactly once');
  }
  review.claimReviews.forEach((entry) => {
    const claimDecision = byId.get(entry.claimId);
    if (!claimDecision || claimDecision.statementSha256 !== entry.statementSha256) throw new Error('Stale scoped claim decision');
    if (claimDecision.decision === 'approve' && (entry.decision === 'reject' || entry.recommendedVerificationStatus !== 'verified')) {
      throw new Error('Excluded or ineligible claim cannot be verified');
    }
    if (entry.useInRecommendedAsset && claimDecision.decision !== 'approve') throw new Error('Selected narration claim lacks owner approval');
    if (entry.decision === 'reject' && claimDecision.decision !== 'reject') throw new Error('Documented exclusion must remain rejected');
  });
  if (decision.approvedHookId !== contentAsset.hookId) throw new Error('Selected hook differs from reviewed hook');
  const hook = knowledgePackage.hooks.find(({id}) => id === decision.approvedHookId);
  if (!hook || hook.claimIds.some((id) => byId.get(id)?.decision !== 'approve')) throw new Error('Hook depends on an unapproved claim');
  const packageWithApprovedClaims = knowledgePackageSchema.parse({
    ...structuredClone(knowledgePackage), revision: knowledgePackage.revision + 1,
    editorialStatus: 'review',
    claims: knowledgePackage.claims.map((claim) => byId.get(claim.id)?.decision === 'approve' ? {
      ...claim, verificationStatus: 'verified', review: {
        reviewedBy: decision.reviewer, decisionEnteredAt: decision.enteredAt, reviewTimeBasis: 'decision-entry',
        notes: `Explicit owner approval recorded through ${decision.id}. Entry time is not a supplied review timestamp. Exact claim wording and evidence unchanged.`,
      },
    } : claim),
  });
  return {decision, knowledgePackage: packageWithApprovedClaims};
};

export type ScopedOwnerDecision = z.infer<typeof scopedOwnerDecisionSchema>;
