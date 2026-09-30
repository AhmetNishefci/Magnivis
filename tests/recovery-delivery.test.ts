import {createHash} from 'node:crypto';
import {mkdtempSync, rmSync, writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {afterEach, describe, expect, it} from 'vitest';
import {speedOfLightPlatformVariants} from '../src/platform-variants/variants/speed-of-light';
import {woodFrogPlatformVariants} from '../src/platform-variants/variants/wood-frog';
import {createRecoveryDeliveryContext, recoveryMediaPath} from '../scripts/recovery-delivery-support';

const scratch: string[] = [];
afterEach(() => scratch.splice(0).forEach((path) => rmSync(path, {recursive: true, force: true})));

describe('isolated recovery delivery context', () => {
  it('removes locked-master authority when the staged Wood Frog bytes differ', () => {
    const dir = mkdtempSync(join(tmpdir(), 'magnivis-recovery-'));
    scratch.push(dir);
    const path = join(dir, 'candidate.mp4');
    writeFileSync(path, 'new bytes, no historical approval');
    const before = JSON.stringify(woodFrogPlatformVariants);
    const {variants, dependencies} = createRecoveryDeliveryContext(woodFrogPlatformVariants, path);
    expect(variants.every((v) => !v.sourceMaster && !v.approval)).toBe(true);
    expect(dependencies.productionResolver(variants[0]!).spec.production?.outputReviewState)
      .toBe('visual-review-required');
    expect(JSON.stringify(woodFrogPlatformVariants)).toBe(before);
  });

  it('relocates exact source bytes while preserving the trusted hash check', () => {
    const dir = mkdtempSync(join(tmpdir(), 'magnivis-recovery-'));
    scratch.push(dir);
    const path = join(dir, 'master.mp4');
    writeFileSync(path, 'fixture original');
    const hash = createHash('sha256').update('fixture original').digest('hex');
    const originals = woodFrogPlatformVariants.map((v) => ({
      ...structuredClone(v),
      sourceMaster: {...structuredClone(v.sourceMaster!), artifact: {path: 'historical.mp4', sha256: hash}},
    }));
    const {variants} = createRecoveryDeliveryContext(originals, path);
    expect(variants.every((v) => v.sourceMaster?.artifact.path === path)).toBe(true);
    expect(variants.every((v) => v.sourceMaster?.artifact.sha256 === hash)).toBe(true);
    expect(variants.every((v) => !v.approval && v.status === 'editorial-review')).toBe(true);
  });

  it('does not transfer historical platform approval or readiness to regenerated media', () => {
    const before = JSON.stringify(speedOfLightPlatformVariants);
    const {variants} = createRecoveryDeliveryContext(speedOfLightPlatformVariants);
    for (const variant of variants) {
      expect(variant.id).toMatch(/\.recovery-phase-1$/);
      expect(variant.status).toBe('editorial-review');
      expect(variant.approval).toBeUndefined();
      expect(variant.previewStatus).toBe('not-ready');
      expect(variant.productionIntent.platformPreviewRequired).toBe(true);
      const original = speedOfLightPlatformVariants.find((v) => `${v.id}.recovery-phase-1` === variant.id)!;
      expect(variant.packaging).toEqual(original.packaging);
      expect(variant.captions).toEqual(original.captions);
      expect(variant.safeAreaProfileId).toBe(original.safeAreaProfileId);
    }
    expect(JSON.stringify(speedOfLightPlatformVariants)).toBe(before);
  });

  it('resolves the proven TikTok derivative into staging without changing the canonical registry', () => {
    const {variants, dependencies} = createRecoveryDeliveryContext(speedOfLightPlatformVariants);
    const tiktok = variants.find((v) => v.platform === 'tiktok')!;
    const production = dependencies.productionResolver(tiktok);
    expect(production.spec.id).toBe('speed-of-light-tiktok');
    expect(production.spec.platformVariantId).toBe(tiktok.id);
    expect(production.sourceVideoPath).toBe(recoveryMediaPath('speed-of-light-tiktok'));
    expect(production.sourceVideoPath).toContain('/recovery-work/');
    expect(() => recoveryMediaPath('../output')).toThrow('Unknown video id');
  });
});
