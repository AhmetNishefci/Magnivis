import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {describe, expect, it} from 'vitest';
import packageSnapshot from '../content-intelligence/reviews/phantom-traffic-v1/knowledge-package.review.json';
import assetSnapshot from '../content-intelligence/reviews/phantom-traffic-v1/content-asset.review.json';
import reviewSnapshot from '../content-intelligence/reviews/phantom-traffic-v1/claim-review.json';
import {knowledgePackageSchema, claimSchema} from '../src/knowledge/schema';
import {contentAssetSchema} from '../src/content-assets/schema';
import {applyScopedOwnerDecision, scopedOwnerDecisionSchema, type ScopedOwnerDecision} from '../src/content-intelligence/scoped-owner-decision';
import {validateTrafficFinalization, trafficFinalizationDirectory} from '../scripts/validate-traffic-finalization';
import {knowledgePackageRegistry} from '../src/knowledge/registry';
import {contentAssetRegistry} from '../src/content-assets/registry';

const knowledgePackage = knowledgePackageSchema.parse(packageSnapshot);
const contentAsset = contentAssetSchema.parse(assetSnapshot);
const readDecision = () => scopedOwnerDecisionSchema.parse(JSON.parse(readFileSync(resolve(trafficFinalizationDirectory, 'owner-decision.json'), 'utf8')));
const apply = (decision: ScopedOwnerDecision, pkg = knowledgePackage, asset = contentAsset) => applyScopedOwnerDecision({
  decision, review: reviewSnapshot, knowledgePackage: pkg, contentAsset: asset,
});

describe('Scoped owner approval and final narration gate', () => {
  it('verifies exactly the selected claims, defers reserves, and leaves current package/asset unapproved', () => {
    expect(validateTrafficFinalization()).toMatchObject({result: 'passed', verifiedClaims: 6,
      supportedReserveClaims: 13, excludedClaims: 11, wordCount: 74, productionAuthorized: false});
    const pkg = knowledgePackageRegistry.get('phantom-traffic');
    expect(pkg.revision).toBe(2);
    expect(pkg.approval).toBeUndefined();
    expect(contentAssetRegistry.get(contentAsset.id).editorialStatus).toBe('editorial-review');
    expect(pkg.claims.filter((c) => c.verificationStatus === 'verified').every((c) =>
      c.review?.reviewedBy === 'Ahmet Nishefci' && c.review.reviewTimeBasis === 'decision-entry' && !c.review.reviewedAt)).toBe(true);
  });

  it('rejects evidence/package changes even when the claim statement is unchanged', () => {
    const changed = structuredClone(knowledgePackage);
    changed.claims[0]!.evidence[0]!.notes += ' Changed interpretation.';
    expect(() => apply(readDecision(), changed)).toThrow('stale research/package/asset state');
  });

  it('rejects a changed script and a changed review binding', () => {
    const changed = structuredClone(contentAsset);
    changed.script.segments[0]!.text = 'Cars move backward.';
    expect(() => apply(readDecision(), knowledgePackage, changed)).toThrow('stale research/package/asset state');
    const decision = readDecision();
    decision.reviewSha256 = '0'.repeat(64);
    expect(() => apply(decision)).toThrow('stale research/package/asset state');
  });

  it('rejects excluded-claim verification and incomplete or stale claim decisions', () => {
    const rejected = readDecision();
    rejected.claimDecisions.find((c) => c.decision === 'reject')!.decision = 'approve';
    expect(() => apply(rejected)).toThrow('ineligible claim');
    const incomplete = readDecision();
    incomplete.claimDecisions.pop();
    expect(() => apply(incomplete)).toThrow('every claim exactly once');
    const stale = readDecision();
    stale.claimDecisions[0]!.statementSha256 = '0'.repeat(64);
    expect(() => apply(stale)).toThrow('Stale scoped claim decision');
  });

  it('cannot grant full asset approval or production/publication authorization', () => {
    expect(scopedOwnerDecisionSchema.safeParse({...readDecision(), assetDecision: 'approve'}).success).toBe(false);
    expect(scopedOwnerDecisionSchema.safeParse({...readDecision(), productionAuthorized: true}).success).toBe(false);
    expect(scopedOwnerDecisionSchema.safeParse({...readDecision(), publicationAuthorized: true}).success).toBe(false);
  });

  it('requires truthful time metadata while preserving legacy supplied review dates', () => {
    const verified = apply(readDecision()).knowledgePackage.claims.find((c) => c.verificationStatus === 'verified')!;
    expect(claimSchema.safeParse({...verified, review: {...verified.review, reviewTimeBasis: undefined}}).success).toBe(false);
    expect(claimSchema.safeParse({...verified, review: {...verified.review, reviewedAt: '2026-10-01'}}).success).toBe(false);
    expect(claimSchema.safeParse({...verified, review: {reviewedBy: 'Ahmet Nishefci'}}).success).toBe(false);
    expect(claimSchema.safeParse({...verified, review: {reviewedBy: 'Ahmet Nishefci', reviewedAt: '2026-09-28'}}).success).toBe(true);
  });
});
