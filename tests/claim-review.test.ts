import {readFileSync, rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {describe, expect, it} from 'vitest';
import {executeContentIntelligenceCommand} from '../scripts/content-intelligence';
import {woodFrogFreezeDraftAsset} from '../src/content-assets/assets/wood-frog-freeze';
import {
  claimReviewBundleSchema,
  ownerEditorialDecisionSchema,
  promoteReviewedEditorialPackage,
  validateClaimReviewBundle,
} from '../src/content-intelligence/claim-review';
import {woodFrogClaimReview} from '../src/content-intelligence/reviews/wood-frog-freeze';
import {stableJson} from '../src/content-intelligence/run-schema';
import {
  woodFrogFreezeClaimIds,
  woodFrogFreezeKnowledgePackage,
} from '../src/knowledge/packages/wood-frog-freeze-tolerance';

const temporaryDirectory = (name: string) => join(
  tmpdir(),
  `magnivis-${name}-${process.pid}-${Math.random().toString(16).slice(2)}`,
);

const ownerDecision = () => ownerEditorialDecisionSchema.parse({
  schemaVersion: 1,
  id: 'owner-decision.wood-frog-freeze.test',
  reviewId: woodFrogClaimReview.id,
  reviewer: 'Test Owner',
  reviewedAt: '2026-09-27T22:00:00.000Z',
  packageId: woodFrogFreezeKnowledgePackage.id,
  packageRevision: woodFrogFreezeKnowledgePackage.revision,
  assetId: woodFrogFreezeDraftAsset.id,
  assetRevision: woodFrogFreezeDraftAsset.revision,
  claimDecisions: woodFrogClaimReview.claimReviews.map((review) => ({
    claimId: review.claimId,
    statementSha256: review.statementSha256,
    decision: review.recommendedVerificationStatus === 'verified' ? 'approve' as const : 'reject' as const,
    notes: review.recommendedVerificationStatus === 'verified'
      ? 'Evidence and caveats reviewed for this test.'
      : 'Excluded because the reviewed evidence is not sufficient for verification.',
  })),
  approvedHookId: woodFrogClaimReview.recommendedHookId,
  assetDecision: 'approve',
  notes: 'Explicit test-only owner decision.',
  explicitConfirmation: 'I reviewed the evidence and approve these editorial decisions.',
});

describe('Wood Frog claim review integrity', () => {
  it('covers every source and claim with valid evidence locators', () => {
    const review = validateClaimReviewBundle(
      woodFrogClaimReview,
      woodFrogFreezeKnowledgePackage,
      woodFrogFreezeDraftAsset,
    );
    expect(review.sourceInspections).toHaveLength(woodFrogFreezeKnowledgePackage.sources.length);
    expect(review.claimReviews).toHaveLength(woodFrogFreezeKnowledgePackage.claims.length);
  });

  it('cannot recommend verification without evidence', () => {
    const invalid = structuredClone(woodFrogClaimReview);
    invalid.claimReviews[0]!.evidence = [];
    expect(() => claimReviewBundleSchema.parse(invalid)).toThrow();
  });

  it('rejects dangling evidence locators and duplicate review state', () => {
    const dangling = structuredClone(woodFrogClaimReview);
    dangling.claimReviews[0]!.evidence[0]!.locator = 'A locator not recorded on the claim';
    expect(() => validateClaimReviewBundle(
      dangling,
      woodFrogFreezeKnowledgePackage,
      woodFrogFreezeDraftAsset,
    )).toThrow(/locator is not present/);

    const duplicate = structuredClone(woodFrogClaimReview);
    duplicate.claimReviews[1] = duplicate.claimReviews[0]!;
    expect(() => validateClaimReviewBundle(
      duplicate,
      woodFrogFreezeKnowledgePackage,
      woodFrogFreezeDraftAsset,
    )).toThrow(/Duplicate claim review/);

    const inaccessible = structuredClone(woodFrogClaimReview);
    inaccessible.sourceInspections[0]!.accessStatus = 'inaccessible';
    expect(() => validateClaimReviewBundle(
      inaccessible,
      woodFrogFreezeKnowledgePackage,
      woodFrogFreezeDraftAsset,
    )).toThrow(/inaccessible source cannot support claims/);
  });

  it('requires reviewer metadata and explicit owner confirmation', () => {
    const missingReviewer = structuredClone(ownerDecision()) as Record<string, unknown>;
    delete missingReviewer.reviewer;
    expect(() => ownerEditorialDecisionSchema.parse(missingReviewer)).toThrow();

    const missingConfirmation = structuredClone(ownerDecision()) as Record<string, unknown>;
    delete missingConfirmation.explicitConfirmation;
    expect(() => ownerEditorialDecisionSchema.parse(missingConfirmation)).toThrow();
  });

  it('does not allow an uncertain claim to silently become verified', () => {
    const decision = structuredClone(ownerDecision());
    const circulation = decision.claimDecisions.find(
      ({claimId}) => claimId === woodFrogFreezeClaimIds.circulationCessation,
    );
    if (!circulation) throw new Error('Missing circulation decision');
    circulation.decision = 'approve';
    expect(() => promoteReviewedEditorialPackage({
      review: woodFrogClaimReview,
      decision,
      knowledgePackage: woodFrogFreezeKnowledgePackage,
      contentAsset: woodFrogFreezeDraftAsset,
    })).toThrow(/not eligible for verification/);
  });

  it('does not allow a rejected claim in an approved script', () => {
    const decision = structuredClone(ownerDecision());
    const selected = decision.claimDecisions.find(
      ({claimId}) => claimId === woodFrogFreezeClaimIds.cardiacArrest,
    );
    if (!selected) throw new Error('Missing selected decision');
    selected.decision = 'reject';
    expect(() => promoteReviewedEditorialPackage({
      review: woodFrogClaimReview,
      decision,
      knowledgePackage: woodFrogFreezeKnowledgePackage,
      contentAsset: woodFrogFreezeDraftAsset,
    })).toThrow(/Approved hook references a rejected claim|Rejected claim cannot appear/);
  });

  it('invalidates owner decisions when reviewed wording changes', () => {
    const decision = structuredClone(ownerDecision());
    decision.claimDecisions[0]!.statementSha256 = '0'.repeat(64);
    expect(() => promoteReviewedEditorialPackage({
      review: woodFrogClaimReview,
      decision,
      knowledgePackage: woodFrogFreezeKnowledgePackage,
      contentAsset: woodFrogFreezeDraftAsset,
    })).toThrow(/stale claim wording/);
  });

  it('promotes only explicitly approved claims and preserves excluded uncertainty', () => {
    const promoted = promoteReviewedEditorialPackage({
      review: woodFrogClaimReview,
      decision: ownerDecision(),
      knowledgePackage: woodFrogFreezeKnowledgePackage,
      contentAsset: woodFrogFreezeDraftAsset,
    });
    expect(promoted.knowledgePackage.editorialStatus).toBe('approved');
    expect(promoted.contentAsset.editorialStatus).toBe('approved');
    expect(promoted.knowledgePackage.claims.find(
      ({id}) => id === woodFrogFreezeClaimIds.cardiacArrest,
    )?.verificationStatus).toBe('verified');
    expect(promoted.knowledgePackage.claims.find(
      ({id}) => id === woodFrogFreezeClaimIds.circulationCessation,
    )?.verificationStatus).toBe('uncertain');
    expect(promoted.knowledgePackage.claims.every((claim) =>
      claim.verificationStatus !== 'verified' || Boolean(claim.review))).toBe(true);
  });

  it('serializes the review deterministically', () => {
    expect(stableJson(woodFrogClaimReview, 2)).toBe(stableJson(structuredClone(woodFrogClaimReview), 2));
  });
});

describe('claim-review operator command', () => {
  it('writes a human-readable review but never marks it approved', async () => {
    const output = temporaryDirectory('claim-review');
    try {
      await executeContentIntelligenceCommand([
        'review', 'wood-frog-freeze', '--output', output,
      ], {}, () => undefined);
      expect(readFileSync(join(output, 'owner-review.md'), 'utf8'))
        .toContain('READY FOR OWNER EDITORIAL APPROVAL');
      expect(JSON.parse(readFileSync(join(output, 'claim-review.json'), 'utf8')))
        .toMatchObject({status: 'ready-for-owner-decision'});
      expect(() => ownerEditorialDecisionSchema.parse(
        JSON.parse(readFileSync(join(output, 'owner-decision.template.json'), 'utf8')),
      )).toThrow();
    } finally {
      rmSync(output, {recursive: true, force: true});
    }
  });

  it('refuses approval without explicit operator confirmation', async () => {
    await expect(executeContentIntelligenceCommand([
      'approve', 'wood-frog-freeze', '--decision', 'not-read.json', '--output', temporaryDirectory('claim-approval'),
    ], {}, () => undefined)).rejects.toThrow(/explicit --confirm-owner-approval/);
  });
});
