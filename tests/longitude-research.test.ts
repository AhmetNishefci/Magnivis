import {cpSync, mkdtempSync, readFileSync, rmSync, writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {resolve} from 'node:path';
import {describe, expect, it} from 'vitest';
import {longitudeReviewDirectory, validateLongitudeResearch} from '../scripts/validate-longitude-research';
import packageSnapshot from '../content-intelligence/reviews/longitude-clock-v1/knowledge-package.review.json';
import assetSnapshot from '../content-intelligence/reviews/longitude-clock-v1/content-asset.review.json';
import {knowledgePackageSchema} from '../src/knowledge/schema';
import {contentAssetSchema} from '../src/content-assets/schema';
import {validateClaimReviewBundle, type ClaimReviewBundle} from '../src/content-intelligence/claim-review';

const knowledgePackage = knowledgePackageSchema.parse(packageSnapshot);
const asset = contentAssetSchema.parse(assetSnapshot);
const readReview = () => JSON.parse(readFileSync(resolve(longitudeReviewDirectory, 'claim-review.json'), 'utf8')) as ClaimReviewBundle;

describe('Cycle #2 longitude bounded research', () => {
  it('preserves the historical discovery while validating review-only evidence, script and handoff', () => {
    expect(validateLongitudeResearch()).toMatchObject({result: 'passed', sources: 11, claims: 40,
      selectedClaims: 11, excludedClaims: 12, unknownClaims: 2, hookOptions: 6,
      packageState: 'review', assetState: 'editorial-review', reviewState: 'ready-for-owner-decision'});
  });

  it('rejects inaccessible evidence and claim wording changed after inspection', () => {
    const inaccessible = readReview();
    inaccessible.sourceInspections.find((s) => s.sourceId === 'source.longitude.equation-time')!.accessStatus = 'inaccessible';
    expect(() => validateClaimReviewBundle(inaccessible, knowledgePackage, asset)).toThrow(/inaccessible/);
    const changed = structuredClone(knowledgePackage);
    changed.claims.find((c) => c.id === 'longitude-clock.claim.east-example')!.statement = 'Two hours ahead means west.';
    expect(() => validateClaimReviewBundle(readReview(), changed, asset)).toThrow(/wording is stale/);
  });

  it('keeps rejected and unresolved formulations out of the selected asset', () => {
    for (const id of ['direct-position', 'raw-sundial', 'humidity-specific']) {
      const changed = structuredClone(asset);
      changed.selectedClaimIds.push(`longitude-clock.claim.${id}`);
      expect(() => validateClaimReviewBundle(readReview(), knowledgePackage, changed)).toThrow(/asset-use flag/);
    }
  });

  const withCopy = (operation: (directory: string) => void) => {
    const directory = mkdtempSync(resolve(tmpdir(), 'magnivis-longitude-review-'));
    try {cpSync(longitudeReviewDirectory, directory, {recursive: true}); operation(directory);}
    finally {rmSync(directory, {recursive: true, force: true});}
  };

  it('detects a reversed east/west example and a minutes-versus-seconds error', () => {
    for (const mutation of ['sign', 'units']) withCopy((directory) => {
      const path = resolve(directory, 'numerical-intuition.json');
      const numbers = JSON.parse(readFileSync(path, 'utf8'));
      if (mutation === 'sign') numbers.examples[0].direction = 'west';
      else numbers.errorExamples[1].longitudeErrorDegrees = 15;
      writeFileSync(path, JSON.stringify(numbers));
      expect(() => validateLongitudeResearch(directory)).toThrow(mutation === 'sign' ? /sign\/conversion/ : /Timing error conversion/);
    });
  });

  it('rejects inferred owner approval even if a claim supplies synthetic review metadata', () => withCopy((directory) => {
    const path = resolve(directory, 'knowledge-package.review.json');
    const changed = structuredClone(packageSnapshot);
    Object.assign(changed.claims[0]!, {verificationStatus: 'verified', review: {reviewedBy: 'Ahmet Nishefci', reviewedAt: '2026-10-01'}});
    writeFileSync(path, JSON.stringify(changed));
    expect(() => validateLongitudeResearch(directory)).toThrow(/Unverified intake drift|Owner editorial gate bypass/);
  }));

  it('detects missing owner artifacts and changed evidence bytes', () => withCopy((directory) => {
    writeFileSync(resolve(directory, 'validation.json'), '{}\n');
    expect(() => validateLongitudeResearch(directory)).toThrow(/Artifact hash drift/);
  }));
});
