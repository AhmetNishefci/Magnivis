import {cpSync, mkdtempSync, readFileSync, rmSync, writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {resolve} from 'node:path';
import {describe, expect, it} from 'vitest';
import {longitudeFinalizationDirectory, validateLongitudeFinalization} from '../scripts/validate-longitude-finalization';
import assetSnapshot from '../content-intelligence/reviews/longitude-clock-finalization-v2/content-asset.review.json';
import packageSnapshot from '../content-intelligence/reviews/longitude-clock-finalization-v2/knowledge-package.review.json';

const withCopy = (operation: (directory: string) => void) => {
  const directory = mkdtempSync(resolve(tmpdir(), 'magnivis-longitude-final-'));
  try {cpSync(longitudeFinalizationDirectory, directory, {recursive: true}); operation(directory);}
  finally {rmSync(directory, {recursive: true, force: true});}
};

describe('Longitude finalization preserves research and pending owner verification', () => {
  it('validates the tighter exact proposal and all eight narration/visual claims without approval', () => {
    expect(validateLongitudeFinalization()).toMatchObject({result: 'passed', wordCount: 89, researchClaimsPreserved: 40,
      ownerVerificationRequired: 8, verifiedClaims: 0, packageState: 'review', assetState: 'editorial-review', productionAuthorized: false});
  });

  it('does not turn acceptance of the evidence basis into verification or alter reserve claims', () => {
    for (const promoted of [true, false]) withCopy((directory) => {
      const pkg = structuredClone(packageSnapshot);
      if (promoted) Object.assign(pkg.claims[0]!, {verificationStatus: 'verified', review: {reviewedBy: 'Ahmet Nishefci', reviewedAt: '2026-10-01'}});
      else pkg.claims.find((c) => c.id === 'longitude-clock.claim.minute-error')!.caveats.push('A fabricated new qualification');
      writeFileSync(resolve(directory, 'knowledge-package.review.json'), JSON.stringify(pkg));
      expect(() => validateLongitudeFinalization(directory)).toThrow(/Research truth\/status changed/);
    });
  });

  it('rejects removal of spoken correction/simultaneity or reversal of the eastward payoff', () => {
    for (const edit of ['correction', 'moment', 'east']) withCopy((directory) => {
      const asset = structuredClone(assetSnapshot);
      const segment = asset.script.segments.find((s) => s.text.includes(edit === 'correction' ? 'corrected' : edit === 'moment' ? 'same moment' : 'Thirty degrees east'))!;
      segment.text = edit === 'correction' ? 'Sailors use raw sundial time.' : edit === 'moment' ? 'Compare them later.' : 'Two hours ahead. Thirty degrees west.';
      writeFileSync(resolve(directory, 'content-asset.review.json'), JSON.stringify(asset));
      expect(() => validateLongitudeFinalization(directory)).toThrow(/Required correction/);
    });
  });

  it('rejects an incomplete owner-verification queue or stale statement hash', () => {
    for (const stale of [true, false]) withCopy((directory) => {
      const path = resolve(directory, 'owner-verification-queue.json');
      const queue = JSON.parse(readFileSync(path, 'utf8'));
      if (stale) queue.selectedClaims[0].statementSha256 = '0'.repeat(64);
      else queue.selectedClaims.pop();
      writeFileSync(path, JSON.stringify(queue));
      expect(() => validateLongitudeFinalization(directory)).toThrow();
    });
  });

  it('rejects production parameters or self-approved narration', () => {
    withCopy((directory) => {
      const asset = structuredClone(assetSnapshot);
      Object.assign(asset.visualPlan[0]!, {timingIntentSeconds: {start: 0, end: 4}});
      writeFileSync(resolve(directory, 'content-asset.review.json'), JSON.stringify(asset));
      expect(() => validateLongitudeFinalization(directory)).toThrow(/Conceptual comprehension\/scope drift/);
    });
    withCopy((directory) => {
      const path = resolve(directory, 'owner-instruction.json');
      const instruction = JSON.parse(readFileSync(path, 'utf8')); instruction.narrationApproved = true;
      writeFileSync(path, JSON.stringify(instruction));
      expect(() => validateLongitudeFinalization(directory)).toThrow();
    });
  });

  it('rejects stale script/visual-plan bindings after otherwise valid edits', () => withCopy((directory) => {
    const path = resolve(directory, 'editorial-finalization.json');
    const report = JSON.parse(readFileSync(path, 'utf8')); report.visualPlanSha256 = '0'.repeat(64);
    writeFileSync(path, JSON.stringify(report));
    expect(() => validateLongitudeFinalization(directory)).toThrow(/Final editorial binding drift/);
  }));
});
