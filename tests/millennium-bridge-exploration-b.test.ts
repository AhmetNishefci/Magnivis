import {mkdtempSync, readFileSync, writeFileSync, cpSync, rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {resolve, join} from 'node:path';
import sharp from 'sharp';
import {describe, it, expect} from 'vitest';
import {fileSha256, rasterSourceSchema, validateRasterSource} from '../src/design-exploration/raster-source';
import {explorationBShots} from '../src/design-exploration/millennium-bridge-b/shots';
import {explorationBDirectory, explorationBSafeAreaChecks, validateExplorationARejection, validateExplorationBEditorial, generateExplorationB, validateExplorationB} from '../src/design-exploration/millennium-bridge-b/review';
import {validateExplorationBInspection} from '../src/design-exploration/millennium-bridge-b/inspection';

const directory = resolve(explorationBDirectory);
const sourceInputs: unknown[] = JSON.parse(readFileSync(join(directory, 'source-assets.json'), 'utf8'));
const sources = sourceInputs.map((input) => rasterSourceSchema.parse(input));

describe('Millennium Bridge Exploration B provenance and review boundary', () => {
  it('preserves exact rejected A identities and visual-only scope', () => {
    const decision = validateExplorationARejection();
    expect(decision.frames).toHaveLength(5);
    expect(decision.feedback).toHaveLength(10);
    expect(decision.fullProductionAuthorized).toBe(false);
    expect(() => validateExplorationARejection({...decision, manifestFileSha256: '0'.repeat(64)})).toThrow('manifest identity');
    expect(() => validateExplorationARejection({...decision, frames: decision.frames.map((frame, i) => i === 0 ? {...frame, sha256: '0'.repeat(64)} : frame)})).toThrow('frame coverage');
    expect(() => validateExplorationARejection({...decision, scope: 'Research rejected'})).toThrow();
  });
  it('keeps all 18 claims and unchanged owner-approved package/asset source bindings', () => {
    const approval = validateExplorationBEditorial();
    expect(approval.knowledgePackage.claims).toHaveLength(18);
    expect(approval.knowledgePackage.claims.every((claim) => claim.verificationStatus === 'verified')).toBe(true);
    expect(approval.decision.reviewedAt).toBe('2026-09-30T15:49:09.000Z');
  });
  it('records real source dimensions, unknown provider metadata, usage and terms without inventing identities', async () => {
    for (const source of sources) {
      await validateRasterSource(directory, source);
      expect([source.width, source.height]).toEqual([941, 1672]);
      expect(source.generation.model).toBeNull();
      expect(source.generation.seed).toBeNull();
      expect(source.generation.providerResponseId).toBeNull();
      expect(source.externalReferenceImages).toEqual([]);
      expect(source.termsReferences).toContain('https://openai.com/policies/terms-of-use/');
      expect(source.usageStatus).toContain('final production selection pending');
      expect(readFileSync('docs/ASSET-LICENSES.md', 'utf8')).toContain(source.id);
    }
  });
  it('rejects changed source bytes, dimensions and exact prompts', async () => {
    const source = sources[0]!;
    await expect(validateRasterSource(directory, {...source, sha256: '0'.repeat(64)})).rejects.toThrow('source identity');
    await expect(validateRasterSource(directory, {...source, width: 1080})).rejects.toThrow('dimensions');
    await expect(validateRasterSource(directory, {...source, generation: {...source.generation, prompt: `${source.generation.prompt} changed`}})).rejects.toThrow('Prompt identity');
  });
  it('forbids made-up seeds and missing usage provenance', () => {
    const source = sources[0]!;
    expect(() => rasterSourceSchema.parse({...source, generation: {...source.generation, seed: 123}})).toThrow();
    expect(() => rasterSourceSchema.parse({...source, usageStatus: 'production-approved'})).toThrow();
    expect(() => rasterSourceSchema.parse({...source, licenseStatus: ''})).toThrow();
  });
  it('binds all six semantic beats and checks only surviving profiles', () => {
    expect(new Set(explorationBShots.flatMap((shot) => shot.beatSuffixes)).size).toBe(6);
    for (const shot of explorationBShots) {
      const checks = explorationBSafeAreaChecks(shot);
      expect(checks.every((check) => check.passed)).toBe(true);
      expect(checks.map((check) => check.revision)).toEqual([1, 2]);
      expect(checks.map((check) => check.profileId).join(' ')).not.toMatch(/instagram|facebook/i);
    }
    const unsafe = {...explorationBShots[0], criticalRegions: [{...explorationBShots[0].criticalRegions[0], x: 0}]};
    expect(explorationBSafeAreaChecks(unsafe).every((check) => check.passed)).toBe(false);
  });
  it('reproduces committed downstream bytes and valid dimensions from frozen inputs', async () => {
    const checked = await validateExplorationB(directory);
    const second = await generateExplorationB(directory);
    for (const [path, bytes] of Object.entries(second.files)) expect(bytes.equals(readFileSync(join(directory, path))), path).toBe(true);
    for (const frame of checked.frames) {
      const metadata = await sharp(second.files[frame.png.path]).metadata();
      expect([metadata.width, metadata.height]).toEqual([1080, 1920]);
      expect(fileSha256(second.files[frame.png.path]!)).toBe(frame.png.sha256);
    }
    expect(checked.provenance.ownerDesignApproval).toBe(false);
    expect(checked.provenance.fullProductionAuthorized).toBe(false);
    expect(checked.qa.metaGeometryReconstructed).toBe(false);
    expect(checked.generation.sourceDimensions).toEqual({width: 941, height: 1672});
  }, 20000);
  it('binds an actual local inspection to all current frames, without owner/device approval', () => {
    const inspection = validateExplorationBInspection(directory);
    expect(inspection.artifacts).toHaveLength(6);
    expect(inspection.ownerDesignApproval).toBe(false);
    expect(inspection.realDeviceEvidence).toBe(false);
    const temp = mkdtempSync(join(tmpdir(), 'magnivis-b-inspection-'));
    try {
      cpSync(directory, temp, {recursive: true});
      writeFileSync(join(temp, '01-opening.png'), 'changed');
      expect(() => validateExplorationBInspection(temp)).toThrow('inspection is stale');
    } finally {rmSync(temp, {recursive: true, force: true});}
  });
});
