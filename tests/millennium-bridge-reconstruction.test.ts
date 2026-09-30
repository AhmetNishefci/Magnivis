import {mkdtempSync, readFileSync, rmSync, writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {resolve} from 'node:path';
import {afterEach, describe, expect, it} from 'vitest';
import {executeContentIntelligenceCommand} from '../scripts/content-intelligence';
import {millenniumBridgeContentAsset as asset} from '../src/content-assets/assets/millennium-bridge';
import {millenniumBridgeApprovedContentAsset} from '../src/content-assets/assets/millennium-bridge-approved';
import {contentAssetRegistry} from '../src/content-assets/registry';
import {ownerEditorialDecisionSchema, promoteReviewedEditorialPackage, validateClaimReviewBundle} from '../src/content-intelligence/claim-review';
import {
  historicalMillenniumBridgeNarration, millenniumBridgeClaimReview as review,
  millenniumBridgeExclusions, millenniumBridgeReviewArtifacts, reconstructedMillenniumBridgeNarration,
  validateMillenniumBridgeReviewArtifacts, writeMillenniumBridgeReviewArtifacts,
} from '../src/content-intelligence/reviews/millennium-bridge';
import {millenniumBridgeClaimIds as c, millenniumBridgeKnowledgePackage as knowledgePackage, millenniumBridgeSourceIds as s} from '../src/knowledge/packages/millennium-bridge';
import {knowledgePackageRegistry} from '../src/knowledge/registry';
import {millenniumBridgeApprovedKnowledgePackage} from '../src/knowledge/packages/millennium-bridge-approved';

const directories: string[] = [];
const temporaryDirectory = () => {
  const directory = mkdtempSync(resolve(tmpdir(), 'magnivis-bridge-review-'));
  directories.push(directory);
  return directory;
};
afterEach(() => directories.splice(0).forEach((directory) => rmSync(directory, {recursive: true, force: true})));

describe('Millennium Bridge evidence-bound reconstruction', () => {
  it('preserves Milestone 1 review snapshots separately from current approved registration', () => {
    expect(knowledgePackageRegistry.get('millennium-bridge')).toEqual(millenniumBridgeApprovedKnowledgePackage);
    expect(contentAssetRegistry.get(asset.id)).toEqual(millenniumBridgeApprovedContentAsset);
    expect(knowledgePackage.editorialStatus).toBe('review');
    expect(asset.editorialStatus).toBe('editorial-review');
    expect(knowledgePackage.approval).toBeUndefined();
    expect(knowledgePackage.claims).toHaveLength(18);
    expect(knowledgePackage.claims.every(({verificationStatus, review}) => verificationStatus === 'supported' && !review)).toBe(true);
  });

  it('retains actual abstract/mirror access limitations in all eight inspection records', () => {
    expect(review.sourceInspections).toHaveLength(8);
    expect(review.sourceInspections.find(({sourceId}) => sourceId === s.balance)?.accessStatus).toBe('abstract-only');
    expect(review.sourceInspections.find(({sourceId}) => sourceId === s.asce)?.accessStatus).toBe('abstract-only');
    expect(review.sourceInspections.find(({sourceId}) => sourceId === s.investigation)?.limitations.join(' ')).toContain('omits printed pages 22–23');
    expect(review.sourceInspections.find(({sourceId}) => sourceId === s.footPlacement)?.limitations.join(' ')).toContain('single participant');
  });

  it('matches independently recorded historical narration as exact UTF-8 text', () => {
    const expected = 'How can trying to keep your balance make a bridge sway more? On opening day, London’s Millennium Bridge moved sideways. When a walkway shifts, people adjust where they step to stay upright. In a crowd, those sideways forces can feed energy back into the bridge. Instead of dying away, the sway can grow. That can begin without everyone matching footsteps. Later coordination may change the motion; its exact role that day remains uncertain. Engineers added dampers to take energy out of the movement, suppressing the sway.';
    expect(Buffer.from(reconstructedMillenniumBridgeNarration).equals(Buffer.from(expected))).toBe(true);
    expect(historicalMillenniumBridgeNarration).toBe(expected);
    expect(asset.script.segments.every(({type}) => type === 'factual')).toBe(true);
  });

  it('binds all proposed factual segments to retained owner-review claims', () => {
    expect(validateClaimReviewBundle(review, knowledgePackage, asset)).toEqual(review);
    const selected = new Set(asset.selectedClaimIds);
    for (const segment of asset.script.segments) {
      if (segment.type !== 'factual') throw new Error('Unexpected editorial-only segment');
      for (const claimId of segment.claimIds) {
        expect(selected.has(claimId)).toBe(true);
        expect(review.claimReviews.find((entry) => entry.claimId === claimId)).toMatchObject({decision: 'retain', useInRecommendedAsset: true, ownerDecisionRequired: true});
      }
    }
  });

  it('keeps onset possibility, later coherence and event-attribution caveats together', () => {
    expect(asset.selectedClaimIds).toEqual(expect.arrayContaining([c.withoutSynchrony, c.laterCoherence, c.dayUncertainty]));
    expect(knowledgePackage.claims.find(({id}) => id === c.withoutSynchrony)?.caveats.join(' ')).toContain('not proof of an exclusive cause');
    expect(knowledgePackage.claims.find(({id}) => id === c.dayUncertainty)?.caveats.join(' ')).toContain('editorial inference');
  });

  it('does not convert injury uncertainty or absolute motion guarantees into claims', () => {
    expect(knowledgePackage.claims.some(({statement}) => /injur|never recur|physically impossible/i.test(statement))).toBe(false);
    expect(millenniumBridgeExclusions.find(({wording}) => wording === 'No one was injured.')?.result).toBe('exclude-unknown');
    expect(review.unresolvedResearch.join(' ')).toContain('Injury status not established');
  });

  it('retains estimates and prototype-testing scope instead of precise or final-test claims', () => {
    const crossings = knowledgePackage.claims.find(({id}) => id === c.crossings)!;
    expect(crossings.type).toBe('quantitative');
    if (crossings.type === 'quantitative') expect(crossings.quantity).toMatchObject({minimum: 80000, maximum: 100000, precision: 'approximate'});
    expect(knowledgePackage.claims.find(({id}) => id === c.prototypeValidation)?.caveats.join(' ')).toContain('not a claim to have inspected the final 2002');
  });

  it('provides six editorial visuals with disclosures and varied pedestrian phases', () => {
    expect(asset.narrativeStructure).toHaveLength(6);
    expect(asset.visualPlan).toHaveLength(6);
    expect(asset.visualPlan.every(({notes}) => notes?.includes('SIMPLIFIED EXPLANATORY MODEL') && notes.includes('MOTION EXAGGERATED'))).toBe(true);
    expect(asset.visualPlan.map(({objective}) => objective).join(' ')).toContain('varied pedestrian phases');
    expect(asset.visualPlan.map(({assetRequirements}) => assetRequirements?.join(' ')).join(' ')).toContain('no copied footage or scientific figures');
  });

  it('rejects stale revisions and edited claim wording', () => {
    const changed = structuredClone(knowledgePackage);
    changed.revision += 1;
    expect(() => validateClaimReviewBundle(review, changed, asset)).toThrow(/stale/);
    changed.revision -= 1;
    changed.claims[0]!.statement += ' Altered.';
    expect(() => validateClaimReviewBundle(review, changed, asset)).toThrow();
  });

  it('rejects evidentiary support from an inaccessible source', () => {
    const changed = structuredClone(review);
    changed.sourceInspections[0]!.accessStatus = 'inaccessible';
    expect(() => validateClaimReviewBundle(changed, knowledgePackage, asset)).toThrow();
  });

  it('generates deterministic new identities and detects artifact tampering', () => {
    const directory = temporaryDirectory();
    writeMillenniumBridgeReviewArtifacts(directory);
    const first = readFileSync(resolve(directory, 'artifact-manifest.json'), 'utf8');
    writeMillenniumBridgeReviewArtifacts(directory);
    expect(readFileSync(resolve(directory, 'artifact-manifest.json'), 'utf8')).toBe(first);
    expect(validateMillenniumBridgeReviewArtifacts(directory)).toEqual(review);
    writeFileSync(resolve(directory, 'content-asset.review.json'), '{}\n');
    expect(() => validateMillenniumBridgeReviewArtifacts(directory)).toThrow(/Stale or modified/);
  });

  it('keeps the template unusable as approval and production eligibility false', () => {
    const artifacts = millenniumBridgeReviewArtifacts();
    const decision: unknown = JSON.parse(artifacts['owner-decision.template.json']!);
    expect(ownerEditorialDecisionSchema.safeParse(decision).success).toBe(false);
    expect(() => promoteReviewedEditorialPackage({review, decision, knowledgePackage, contentAsset: asset})).toThrow();
    const provenance = JSON.parse(artifacts['reconstruction-provenance.json']!) as {productionAuthorized: boolean; freshOwnerApproval: string; exactLostGitObjectsRecovered: boolean};
    expect(provenance).toMatchObject({productionAuthorized: false, freshOwnerApproval: 'pending', exactLostGitObjectsRecovered: false});
    const ledger = JSON.parse(artifacts['claim-ledger.json']!) as {productionEligible: boolean}[];
    expect(ledger.every(({productionEligible}) => !productionEligible)).toBe(true);
  });

  it('allows local review/validation but rejects automatic approval and live stages', async () => {
    const directory = temporaryDirectory();
    const log = () => {};
    await executeContentIntelligenceCommand(['review', 'millennium-bridge', '--output', directory], {}, log);
    await executeContentIntelligenceCommand(['validate', 'millennium-bridge', '--output', directory], {}, log);
    await expect(executeContentIntelligenceCommand(['approve', 'millennium-bridge', '--output', directory], {}, log)).rejects.toThrow(/explicit --confirm-owner-approval/);
    for (const stage of ['trial', 'research', 'asset']) {
      await expect(executeContentIntelligenceCommand([stage, 'millennium-bridge', '--output', directory], {}, log)).rejects.toThrow(/explicit owner approval only/);
    }
  });
});
