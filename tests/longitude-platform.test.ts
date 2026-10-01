import {longitudePreparedDeliveryDependencies} from '../scripts/longitude-prepared-delivery';
import {describe, expect, it} from 'vitest';
import {cpSync, mkdtempSync, readFileSync, rmSync, writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {longitudeMasterDecision, longitudeLockedPlan, validateLongitudeLockedMaster} from '../src/production/longitude-master-integrity';
import {applyMasterVisualApproval, masterApprovalDecisionSchema} from '../src/production/master-approval';
import {productionPlanSchema} from '../src/production/schema';
import {longitudePlatformVariants} from '../src/platform-variants/variants/longitude-clock';
import {platformVariantSchema} from '../src/platform-variants/schema';
import {validateDeliveryPackage} from '../scripts/delivery-packages';
import {sha256Json} from '../src/content-intelligence/run-schema';

const root = 'content-intelligence/reviews/longitude-clock-master-lock-v1';
const read = (path: string) => JSON.parse(readFileSync(path, 'utf8'));
const reviewed = productionPlanSchema.parse(read(`${root}/production-plan.reviewed.json`));
const bindings = read(`${root}/reviewed-bindings.json`);

describe('Longitude exact master lock and pending platform handoffs', () => {
  it('promotes exact V2 without changing original inputs or inventing a review timestamp', () => {
    expect(validateLongitudeLockedMaster()).toMatchObject({passed: true, ownerMasterApproved: true, productionPlanRevision: 5, platformApproved: false, publicationAuthorized: false});
    expect(longitudeMasterDecision).toMatchObject({timeBasis: 'decision-entry', ownerSuppliedReviewTimestamp: null, candidateArtifactId: 'longitude-clock.candidate-v2.0', masterArtifactId: 'longitude-clock.locked-master.v2'});
    expect(longitudeMasterDecision.artifact).toEqual(read(bindings.reviewedCandidateReceipt.path).master);
    expect(sha256Json(applyMasterVisualApproval(longitudeMasterDecision, reviewed, bindings, longitudeLockedPlan.reviewRequirements[0]))).toBe(sha256Json(longitudeLockedPlan));
  });
  it('rejects approval transfer to another encode, audio identity or script', () => {
    for (const decision of [
      {...longitudeMasterDecision, artifact: {...longitudeMasterDecision.artifact, sha256: '0'.repeat(64)}},
      {...longitudeMasterDecision, narrationBundleSha256: '0'.repeat(64)},
      {...longitudeMasterDecision, approvedScriptSha256: '0'.repeat(64)},
    ]) expect(() => applyMasterVisualApproval(decision, reviewed, bindings)).toThrow('stale');
  });
  it('rejects inferred platform/publication approval and a fabricated owner timestamp', () => {
    for (const field of ['platformApprovalGranted', 'publicationApprovalGranted']) expect(masterApprovalDecisionSchema.safeParse({...longitudeMasterDecision, [field]: true}).success).toBe(false);
    expect(masterApprovalDecisionSchema.safeParse({...longitudeMasterDecision, ownerSuppliedReviewTimestamp: longitudeMasterDecision.enteredAt}).success).toBe(false);
  });
  it('requires a new decision if any exact candidate binding changes', () => {
    expect(() => applyMasterVisualApproval(longitudeMasterDecision, reviewed, {...bindings, candidate: {...bindings.candidate, bytes: bindings.candidate.bytes+1}})).toThrow('stale');
    expect(() => applyMasterVisualApproval(longitudeMasterDecision, {...reviewed, revision: reviewed.revision+1}, bindings)).toThrow('stale');
  });
  it('keeps four variants pending and uses the same master without runtime padding', () => {
    expect(longitudePlatformVariants).toHaveLength(4);
    for (const variant of longitudePlatformVariants) {
      expect(variant.sourceMaster?.artifact).toEqual({path: longitudeMasterDecision.artifact.path, sha256: longitudeMasterDecision.artifact.sha256});
      expect(variant).toMatchObject({status: 'editorial-review', previewStatus: 'ready-for-private-preview', duration: {targetSeconds: 47}, productionIntent: {renderStrategy: 'reuse-existing-master'}});
      expect(variant.packaging.claimIds).toHaveLength(8);
      expect(platformVariantSchema.safeParse({...variant, status: 'production-ready'}).success).toBe(false);
    }
  });
  it('does not turn unknown surfaces or a new cover into device approvals', () => {
    const qas = read('content-intelligence/reviews/longitude-clock-platform-v1/presentation-qa.json');
    expect(qas).toHaveLength(9);
    for (const qa of qas) expect(qa).toMatchObject({device: null, testedAt: null, reviewer: null});
    const [cover] = read('artifacts/longitude-clock-cover-assets.json');
    expect(cover).toMatchObject({crop: null, status: 'review', approvalDecisionId: null});
  });
  it('validates portable delivery bytes and rejects a damaged upload file', () => {
    const source = 'artifacts/deliveries/longitude-clock-v1/longitude-clock-locked/youtube-shorts';
    const directory = mkdtempSync(join(tmpdir(), 'magnivis-longitude-delivery-test-'));
    try {
      cpSync(source, directory, {recursive: true});
      expect(validateDeliveryPackage(directory, longitudePreparedDeliveryDependencies)).toMatchObject({state: 'draft-review', publishEligible: false});
      const video = join(directory, 'video.mp4');
      const bytes = readFileSync(video); bytes[bytes.length-1] = bytes[bytes.length-1]! ^ 1; writeFileSync(video, bytes);
      expect(() => validateDeliveryPackage(directory, longitudePreparedDeliveryDependencies)).toThrow();
    } finally { rmSync(directory, {recursive: true}); }
  });
});
