import {cpSync, mkdtempSync, readFileSync, rmSync, writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {resolve} from 'node:path';
import {describe, expect, it} from 'vitest';
import {chocolateReviewDirectory, validateChocolateResearch} from '../scripts/validate-chocolate-research';
import packageSnapshot from '../content-intelligence/reviews/chocolate-crystal-choice-v1/knowledge-package.review.json';
import assetSnapshot from '../content-intelligence/reviews/chocolate-crystal-choice-v1/content-asset.review.json';
import {knowledgePackageSchema} from '../src/knowledge/schema';
import {contentAssetSchema} from '../src/content-assets/schema';
import {validateClaimReviewBundle, type ClaimReviewBundle} from '../src/content-intelligence/claim-review';
const knowledgePackage = knowledgePackageSchema.parse(packageSnapshot);
const asset = contentAssetSchema.parse(assetSnapshot);
const review = () => JSON.parse(readFileSync(resolve(chocolateReviewDirectory, 'claim-review.json'), 'utf8')) as ClaimReviewBundle;
const withCopy = (operation: (directory: string) => void) => {
  const directory = mkdtempSync(resolve(tmpdir(), 'magnivis-chocolate-review-'));
  try {cpSync(chocolateReviewDirectory, directory, {recursive: true}); operation(directory);}
  finally {rmSync(directory, {recursive: true, force: true});}
};
describe('Cycle #3 chocolate research gate', () => {
  it('preserves discovery and policies with native review-only identities', () => {
    expect(validateChocolateResearch()).toMatchObject({result: 'passed', sources: 11, claims: 42,
      selectedClaims: 9, excludedClaims: 10, unknownClaims: 2, hookOptions: 5, wordCount: 87,
      packageState: 'review', assetState: 'editorial-review', historicalPreservation: 'passed'});
  });
  it('rejects inaccessible source evidence and altered exact statements', () => {
    const changed = review();
    changed.sourceInspections.find((s) => s.sourceId === 'source.chocolate.chen-2021')!.accessStatus = 'inaccessible';
    expect(() => validateClaimReviewBundle(changed, knowledgePackage, asset)).toThrow(/inaccessible/);
    const pkg = structuredClone(knowledgePackage);
    pkg.claims[0]!.statement = 'All melted chocolate has the wrong crystal form.';
    expect(() => validateClaimReviewBundle(review(), pkg, asset)).toThrow(/wording is stale/);
  });
  it('rejects owner verification inferred from topic selection', () => withCopy((directory) => {
    const pkg = structuredClone(packageSnapshot);
    Object.assign(pkg.claims[0]!, {verificationStatus: 'verified', review: {reviewedBy: 'Ahmet Nishefci', reviewedAt: '2026-10-02'}});
    writeFileSync(resolve(directory, 'knowledge-package.review.json'), JSON.stringify(pkg));
    expect(() => validateChocolateResearch(directory)).toThrow(/Owner editorial gate|Unverified intake/);
  }));
  it('keeps excluded mechanisms and unobserved demonstration results out of narration', () => {
    for (const key of ['grainy-always', 'demo-result']) {
      const changed = structuredClone(asset); changed.selectedClaimIds.push(`chocolate-crystal-choice.claim.${key}`);
      expect(() => validateClaimReviewBundle(review(), knowledgePackage, changed)).toThrow(/asset-use flag/);
    }
  });
  it('rejects invented runtime evidence or narrowed source access accounting', () => withCopy((directory) => {
    const path = resolve(directory, 'editorial-proposal.json');
    const proposal = JSON.parse(readFileSync(path, 'utf8')); proposal.wordCount = 60;
    writeFileSync(path, JSON.stringify(proposal));
    expect(() => validateChocolateResearch(directory)).toThrow(/Narration\/count\/runtime drift/);
  }));
  it('rejects premature art direction and unbound handoff bytes', () => withCopy((directory) => {
    const path = resolve(directory, 'content-asset.review.json');
    const changed = structuredClone(assetSnapshot); changed.visualPlan[0]!.visualType = 'animation';
    writeFileSync(path, JSON.stringify(changed));
    expect(() => validateChocolateResearch(directory)).toThrow(/Premature creative execution/);
  }));
  it('detects incomplete access accounting even when native claim records are intact', () => withCopy((directory) => {
    const path = resolve(directory, 'source-access-accounting.json');
    const access = JSON.parse(readFileSync(path, 'utf8')); access.inventory.pop();
    writeFileSync(path, JSON.stringify(access));
    expect(() => validateChocolateResearch(directory)).toThrow(/Access inventory incomplete/);
  }));
});
