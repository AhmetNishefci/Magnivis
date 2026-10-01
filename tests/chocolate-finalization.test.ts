import {cpSync, mkdtempSync, readFileSync, rmSync, writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {resolve} from 'node:path';
import {describe, expect, it} from 'vitest';
import {chocolateFinalizationDirectory, validateChocolateFinalization} from '../scripts/validate-chocolate-finalization';
const withCopy = (operation: (directory: string) => void) => {
  const directory = mkdtempSync(resolve(tmpdir(), 'magnivis-chocolate-final-'));
  try {cpSync(chocolateFinalizationDirectory, directory, {recursive: true}); operation(directory);}
  finally {rmSync(directory, {recursive: true, force: true});}
};
const mutate = (directory: string, name: string, operation: (value: Record<string, unknown>) => void) => {
  const path = resolve(directory, name); const value = JSON.parse(readFileSync(path, 'utf8')) as Record<string, unknown>;
  operation(value); writeFileSync(path, JSON.stringify(value));
};
describe('Chocolate editorial finalization scope', () => {
  it('verifies only eight needed statements and retains final asset approval gate', () => {
    expect(validateChocolateFinalization()).toMatchObject({passed: true, words: 80, verifiedClaims: 8,
      preservedReserveClaims: 34, conceptualBeats: 8, packageState: 'review', assetState: 'editorial-review', productionAuthorized: false});
  });
  it('rejects unnecessary verification of valid seed reserve', () => withCopy((directory) => {
    mutate(directory, 'knowledge-package.review.json', (value) => {
      const claims = value.claims as Array<Record<string, unknown>>;
      const seed = claims.find((c) => String(c.id).endsWith('.claim.seed'))!;
      Object.assign(seed, {verificationStatus: 'verified', review: claims[0]!.review});
    });
    expect(() => validateChocolateFinalization(directory)).toThrow(/Research statement\/evidence\/reserve/);
  }));
  it('rejects changed evidence even if the statement stays identical', () => withCopy((directory) => {
    mutate(directory, 'knowledge-package.review.json', (value) => {
      const claims = value.claims as Array<{evidence: Array<{locator: string}>}>;
      claims[0]!.evidence[0]!.locator = 'Uninspected experiment';
    });
    expect(() => validateChocolateFinalization(directory)).toThrow(/Research statement\/evidence\/reserve/);
  }));
  it('rejects final approval inferred from approval intent', () => withCopy((directory) => {
    mutate(directory, 'owner-decision.json', (value) => {value.finalEditorialApproved = true;});
    expect(() => validateChocolateFinalization(directory)).toThrow();
  }));
  it('rejects a universal failure formulation', () => withCopy((directory) => {
    mutate(directory, 'content-asset.review.json', (value) => {
      const script = value.script as {segments: Array<{text: string}>};
      script.segments[4]!.text = 'The result is always ruined chocolate.';
    });
    expect(() => validateChocolateFinalization(directory)).toThrow(/Final exact narration drift/);
  }));
  it('rejects art direction and loss of the microscopic disclosure', () => withCopy((directory) => {
    mutate(directory, 'content-asset.review.json', (value) => {
      const visuals = value.visualPlan as Array<{visualType: string}>; visuals[0]!.visualType = 'animation';
    });
    expect(() => validateChocolateFinalization(directory)).toThrow(/Conceptual visual scope/);
  }));
  it('rejects changes to exclusions and statement bindings', () => withCopy((directory) => {
    mutate(directory, 'reserve-research.json', (value) => {
      const claims = value.excludedFromFinalShort as unknown[]; claims.pop();
    });
    expect(() => validateChocolateFinalization(directory)).toThrow(/Reserve exclusion drift/);
  }));
});
