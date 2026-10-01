import {z} from 'zod';
import {verificationStatusSchema, knowledgePackageSchema, type KnowledgePackage} from '../knowledge/schema';
import {contentAssetSchema, type ContentAsset} from '../content-assets/schema';
import {sha256Json} from './run-schema';

const digest = z.string().regex(/^[a-f0-9]{64}$/);
/** Full editorial approval of an already claim-reviewed state, without inventing an owner date. */
export const editorialLockDecisionSchema = z.object({
  schemaVersion: z.literal(1), id: z.string().startsWith('owner-decision.'), revision: z.number().int().positive(),
  reviewer: z.string().min(1), authority: z.literal('explicit-owner-message'), ownerInstruction: z.string().min(1),
  enteredAt: z.iso.datetime(), timeBasis: z.literal('decision-entry'), ownerSuppliedReviewTimestamp: z.null(),
  approvedSourceCommit: z.string().regex(/^[a-f0-9]{40}$/),
  packageId: z.string(), packageRevision: z.number().int().positive(), packageSha256: digest,
  assetId: z.string(), assetRevision: z.number().int().positive(), assetSha256: digest,
  reviewId: z.string(), reviewSha256: digest, scriptSha256: digest, approvedHookId: z.string(),
  packageDecision: z.literal('approve'), assetDecision: z.literal('approve'),
  verifiedClaimIds: z.array(z.string()).min(1),
  claimStatementHashes: z.array(z.object({claimId: z.string(), statementSha256: digest,
    verificationStatus: verificationStatusSchema}).strict()).min(1),
  masterCandidateProductionAuthorized: z.literal(true), ownerMasterVisualApproval: z.literal(false),
  platformApprovalGranted: z.literal(false), publicationApprovalGranted: z.literal(false),
}).strict();

export const applyEditorialLock = (input: {
  decision: unknown; knowledgePackage: KnowledgePackage; contentAsset: ContentAsset; review: {id: string};
}) => {
  const d = editorialLockDecisionSchema.parse(input.decision);
  const {knowledgePackage: pkg, contentAsset: asset, review} = input;
  if (d.packageId !== pkg.id || d.packageRevision !== pkg.revision || d.packageSha256 !== sha256Json(pkg)
    || d.assetId !== asset.id || d.assetRevision !== asset.revision || d.assetSha256 !== sha256Json(asset)
    || d.reviewId !== review.id || d.reviewSha256 !== sha256Json(review)
    || d.scriptSha256 !== sha256Json(asset.script) || d.approvedHookId !== asset.hookId) {
    throw new Error('Editorial lock targets stale reviewed state');
  }
  if (d.claimStatementHashes.length !== pkg.claims.length || new Set(d.claimStatementHashes.map(c => c.claimId)).size !== pkg.claims.length) {
    throw new Error('Editorial lock must bind every claim exactly once');
  }
  for (const claim of pkg.claims) {
    const binding = d.claimStatementHashes.find(c => c.claimId === claim.id);
    if (!binding || binding.statementSha256 !== sha256Json(claim.statement) || binding.verificationStatus !== claim.verificationStatus) {
      throw new Error(`Stale editorial claim binding: ${claim.id}`);
    }
  }
  const verifiedIds = pkg.claims.filter(c => c.verificationStatus === 'verified').map(c => c.id).sort();
  if (sha256Json(verifiedIds) !== sha256Json([...d.verifiedClaimIds].sort())
    || sha256Json(verifiedIds) !== sha256Json([...asset.selectedClaimIds].sort())) {
    throw new Error('Editorial approval may use only the exact previously verified claims');
  }
  const approval = {approvedBy: d.reviewer, decisionEnteredAt: d.enteredAt, reviewTimeBasis: 'decision-entry' as const,
    notes: `Explicit editorial approval bound to commit ${d.approvedSourceCommit} through ${d.id}. Timestamp records decision entry, not a supplied review time. No master visual, platform or publication approval.`};
  return {
    decision: d,
    knowledgePackage: knowledgePackageSchema.parse({...pkg, revision: pkg.revision + 1, editorialStatus: 'approved', approval}),
    contentAsset: contentAssetSchema.parse({...asset, revision: asset.revision + 1, editorialStatus: 'approved', approval}),
  };
};
