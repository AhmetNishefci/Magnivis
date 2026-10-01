import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {describe, expect, it} from 'vitest';
import {trafficReviewDirectory, validateTrafficResearch} from '../scripts/validate-traffic-research';
import packageSnapshot from '../content-intelligence/reviews/phantom-traffic-v1/knowledge-package.review.json';
import {knowledgePackageSchema} from '../src/knowledge/schema';
import assetSnapshot from '../content-intelligence/reviews/phantom-traffic-v1/content-asset.review.json';
import {contentAssetSchema} from '../src/content-assets/schema';
import {validateClaimReviewBundle, type ClaimReviewBundle} from '../src/content-intelligence/claim-review';

const knowledgePackage = knowledgePackageSchema.parse(packageSnapshot);
const contentAsset = contentAssetSchema.parse(assetSnapshot);

const readReview = () => JSON.parse(readFileSync(resolve(trafficReviewDirectory, 'claim-review.json'), 'utf8')) as ClaimReviewBundle;

describe('Traffic-waves research/editorial boundary', () => {
  it('validates the complete evidence-ledger and deterministic owner handoff without granting approval', () => {
    expect(validateTrafficResearch()).toMatchObject({result: 'passed', claims: 30, selectedClaims: 6,
      excludedClaims: 11, packageState: 'review', assetState: 'editorial-review', reviewState: 'ready-for-owner-decision'});
    expect(knowledgePackage.claims.some((c) => c.verificationStatus === 'verified' || c.review)).toBe(false);
  });

  it('rejects a statement changed after evidence review', () => {
    const changed = structuredClone(knowledgePackage);
    changed.claims[0]!.statement = 'Every jam appears from nothing.';
    expect(() => validateClaimReviewBundle(readReview(), changed, contentAsset)).toThrow('wording is stale');
  });

  it('rejects an evidence locator changed after review', () => {
    const changed = structuredClone(knowledgePackage);
    changed.claims[0]!.evidence[0]!.locator = 'A nonexistent experiment';
    expect(() => validateClaimReviewBundle(readReview(), changed, contentAsset)).toThrow('evidence locator is not present');
  });

  it('rejects a rejected claim entering the recommended asset', () => {
    const changed = structuredClone(contentAsset);
    changed.selectedClaimIds.push('phantom-traffic.claim.from-nothing');
    expect(() => validateClaimReviewBundle(readReview(), knowledgePackage, changed)).toThrow('asset-use flag is inconsistent');
  });

  it('rejects inaccessible evidence and stale package/asset revisions', () => {
    const inaccessible = readReview();
    inaccessible.sourceInspections[0]!.accessStatus = 'inaccessible';
    expect(() => validateClaimReviewBundle(inaccessible, knowledgePackage, contentAsset)).toThrow('inaccessible');
    const stale = readReview();
    stale.assetRevision += 1;
    expect(() => validateClaimReviewBundle(stale, knowledgePackage, contentAsset)).toThrow('stale package or asset');
  });
});
