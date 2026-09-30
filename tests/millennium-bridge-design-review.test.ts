import {cpSync, mkdtempSync, readFileSync, rmSync, writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {resolve} from 'node:path';
import sharp from 'sharp';
import {afterEach, describe, expect, it} from 'vitest';
import {millenniumBridgeContentAsset as draftAsset} from '../src/content-assets/assets/millennium-bridge';
import {millenniumBridgeApprovedContentAsset as asset} from '../src/content-assets/assets/millennium-bridge-approved';
import {millenniumBridgeApprovalArtifacts, millenniumBridgeReviewDirectory, validateMillenniumBridgeApprovalArtifacts} from '../src/content-intelligence/reviews/millennium-bridge-approval';
import {historicalMillenniumBridgeNarration, millenniumBridgeReviewArtifacts} from '../src/content-intelligence/reviews/millennium-bridge';
import {sha256Json} from '../src/content-intelligence/run-schema';
import {bridgeDesignFrames, bridgeFrameBeatIds, bridgeDisclosure, renderBridgeDesignSvg} from '../src/design-exploration/millennium-bridge/frames';
import {bridgeDesignReviewDirectory, bridgeFrameSafeAreaChecks, generateBridgeDesignArtifacts, validateBridgeDesignInputs, validateBridgeDesignReview} from '../src/design-exploration/millennium-bridge/review';
import {validateBridgeDesignInspection} from '../src/design-exploration/millennium-bridge/inspection';
import {millenniumBridgeApprovedKnowledgePackage as knowledgePackage} from '../src/knowledge/packages/millennium-bridge-approved';
import {millenniumBridgeTopicCandidate} from '../src/content-intelligence/candidates/millennium-bridge';

const directories: string[] = [];
const copyToTemporary = (source: string) => {
  const directory = mkdtempSync(resolve(tmpdir(), 'magnivis-design-test-'));
  directories.push(directory);
  cpSync(source, directory, {recursive: true});
  return directory;
};
afterEach(() => directories.splice(0).forEach((directory) => rmSync(directory, {recursive: true, force: true})));

describe('Owner-approved editorial source and Candidate 3 reconstructed design review', () => {
  it('records current owner approval of all exact claims with real entry time', () => {
    const {decision} = validateMillenniumBridgeApprovalArtifacts(millenniumBridgeReviewDirectory);
    expect(decision.reviewer).toBe('Ahmet Nishefci');
    expect(decision.reviewedAt).toBe('2026-09-30T15:49:09.000Z');
    expect(decision.claimDecisions).toHaveLength(18);
    expect(knowledgePackage.claims.every(({verificationStatus, review}) => verificationStatus === 'verified' && review?.reviewedBy === decision.reviewer)).toBe(true);
    expect(knowledgePackage.editorialStatus).toBe('approved');
    expect(asset.editorialStatus).toBe('approved');
    expect(millenniumBridgeTopicCandidate).toMatchObject({status: 'accepted', revision: 2, review: {reviewedBy: decision.reviewer}});
  });

  it('preserves approved script, six beats and VisualPlan without factual rewrites', () => {
    expect(asset.script.segments.map(({text}) => text).join(' ')).toBe(historicalMillenniumBridgeNarration);
    expect(asset.script).toEqual(draftAsset.script);
    expect(asset.narrativeStructure).toEqual(draftAsset.narrativeStructure);
    expect(asset.visualPlan).toEqual(draftAsset.visualPlan);
    expect(asset.revision).toBe(1);
    expect(knowledgePackage.revision).toBe(1);
  });

  it('hash-binds limitations, exclusions, hook, narration and editorial scope without design approval', () => {
    const {decision} = validateMillenniumBridgeApprovalArtifacts(millenniumBridgeReviewDirectory);
    const {files} = millenniumBridgeApprovalArtifacts(decision);
    const binding = JSON.parse(files['editorial-approval-binding.json']) as Record<string, unknown>;
    expect(binding.narrationSha256).toBe(sha256Json(historicalMillenniumBridgeNarration));
    expect(binding.visualPlanSha256).toBe(sha256Json(asset.visualPlan));
    expect(binding).toHaveProperty('sourceInspectionsSha256');
    expect(binding).toHaveProperty('exclusionsSha256');
    expect(binding.authority).toEqual({editorialApproved: true, productionPlanningAndDesignExploration: true, designFramesApproved: false, fullVideoRender: false, platformActivity: false, publication: false});
  });

  it('rejects stale approved snapshot bytes and blank/stale owner decisions', () => {
    const directory = copyToTemporary(millenniumBridgeReviewDirectory);
    writeFileSync(resolve(directory, 'content-asset.approved.json'), '{}\n');
    expect(() => validateMillenniumBridgeApprovalArtifacts(directory)).toThrow(/Stale or modified/);
    const {decision} = validateMillenniumBridgeApprovalArtifacts(millenniumBridgeReviewDirectory);
    const changed = structuredClone(decision);
    changed.claimDecisions[0]!.statementSha256 = '0'.repeat(64);
    expect(() => millenniumBridgeApprovalArtifacts(changed)).toThrow(/stale claim/);
    expect(() => millenniumBridgeApprovalArtifacts(JSON.parse(millenniumBridgeReviewArtifacts()['owner-decision.template.json']!))).toThrow();
  });

  it('maps five design frames to all six approved narrative beats and verified claims', () => {
    expect(validateBridgeDesignInputs()).toBeDefined();
    expect(bridgeDesignFrames).toHaveLength(5);
    const covered = new Set(bridgeDesignFrames.flatMap(bridgeFrameBeatIds));
    expect([...covered]).toEqual(asset.narrativeStructure.map(({id}) => id));
    for (const frame of bridgeDesignFrames) {
      expect(frame.claimIds.every((id) => knowledgePackage.claims.find((claim) => claim.id === id)?.verificationStatus === 'verified')).toBe(true);
    }
  });

  it('uses only surviving YouTube V1/TikTok V2 and catches out-of-region critical content', () => {
    for (const frame of bridgeDesignFrames) {
      const checks = bridgeFrameSafeAreaChecks(frame);
      expect(checks.map(({revision}) => revision)).toEqual([1, 2]);
      expect(checks.every(({passed}) => passed)).toBe(true);
      expect(checks.every(({profileId}) => !/instagram|facebook/.test(profileId))).toBe(true);
    }
    const unsafe = structuredClone(bridgeDesignFrames[0]!);
    unsafe.criticalRegions[0]!.y = 0;
    expect(bridgeFrameSafeAreaChecks(unsafe).every(({passed}) => passed)).toBe(false);
  });

  it('uses deterministic self-contained SVG with outlined disclosure and no external media', () => {
    for (const frame of bridgeDesignFrames) {
      const svg = renderBridgeDesignSvg(frame);
      expect(svg).toBe(renderBridgeDesignSvg(frame));
      expect(svg).toContain('width="1080" height="1920"');
      expect(svg).not.toMatch(/<text\b|<image\b|href="https?:\/\//);
      for (const text of bridgeDisclosure) expect(svg).toContain(`aria-label="${text}"`);
    }
  });

  it('regenerates exact PNG/source/manifest bytes and validates dimensions and honest provenance', async () => {
    const first = await generateBridgeDesignArtifacts();
    const second = await generateBridgeDesignArtifacts();
    for (const [path, bytes] of Object.entries(first.files)) expect(second.files[path]?.equals(bytes), path).toBe(true);
    for (const frame of first.manifest.frames) {
      expect(await sharp(first.files[frame.png.path]).metadata()).toMatchObject({width: 1080, height: 1920, format: 'png'});
    }
    expect(first.manifest.provenance).toMatchObject({recoveredOriginalBytes: false, identicalToLostFrames: false, designFramesApproved: false, fullProductionAuthorized: false, publicationAuthorized: false});
    expect(first.manifest.sanity.metaSurfaceGeometryReconstructed).toBe(false);
    expect(first.manifest.sanity.realDeviceOrPlatformQA).toBe(false);
  }, 20000);

  it('validates the committed design package and detects altered PNG bytes', async () => {
    await expect(validateBridgeDesignReview(bridgeDesignReviewDirectory)).resolves.toHaveProperty('status', 'ready-for-owner-design-review');
    const directory = copyToTemporary(bridgeDesignReviewDirectory);
    writeFileSync(resolve(directory, '01-balance-paradox.png'), 'altered');
    await expect(validateBridgeDesignReview(directory)).rejects.toThrow(/modified design-review artifact/);
  }, 20000);

  it('binds local visual inspection to exact rendered bytes without manufacturing human/device approval', () => {
    const inspection = validateBridgeDesignInspection(bridgeDesignReviewDirectory);
    expect(inspection.artifacts).toHaveLength(6);
    expect(inspection.ownerDesignApproval).toBe(false);
    expect(inspection.realDeviceEvidence).toBe(false);
    const directory = copyToTemporary(bridgeDesignReviewDirectory);
    writeFileSync(resolve(directory, 'contact-sheet.png'), readFileSync(resolve(directory, 'contact-sheet.png')).subarray(0, 64));
    expect(() => validateBridgeDesignInspection(directory)).toThrow(/inspection is stale/);
  });
});
