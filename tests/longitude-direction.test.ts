import {readFileSync} from 'node:fs';
import {describe, expect, it} from 'vitest';
import {applyCreativeStageApproval, creativeStageApprovalSchema} from '../src/content-intelligence/creative-stage-approval';
import {knowledgePackageSchema} from '../src/knowledge/schema';
import {contentAssetSchema} from '../src/content-assets/schema';
import {creativeDirectionSchema} from '../src/content-assets/creative-direction';
import {validateCreativeDirection} from '../src/content-assets/creative-direction-integrity';
import {sha256Json} from '../src/content-intelligence/run-schema';
import {validateLongitudeDirection} from '../scripts/validate-longitude-direction';

const read = (directory: string, name: string): unknown => JSON.parse(readFileSync(`${directory}/${name}`, 'utf8'));
const prior = 'content-intelligence/reviews/longitude-clock-finalization-v2';
const approved = 'content-intelligence/reviews/longitude-clock-approved-v3';
const directionFolder = 'content-intelligence/creative-directions/longitude-clock-time-to-position';
const fixture = () => ({decision:creativeStageApprovalSchema.parse(read(approved,'owner-decision.json')),
  knowledgePackage:knowledgePackageSchema.parse(read(prior,'knowledge-package.review.json')),
  contentAsset:contentAssetSchema.parse(read(prior,'content-asset.review.json')),
  claimReview:read(prior,'claim-review.json'), comprehensionContract:read(prior,'visual-comprehension-contract.json')});

describe('Longitude Clock editorial approval and bounded creative proposal', () => {
  it('validates exact owner commit, all statement/evidence bindings, seven precedents and historical snapshots', () => {
    expect(validateLongitudeDirection()).toMatchObject({result:'passed',verifiedClaims:8,preservedReserveClaims:32,
      creativeApproaches:3,recentComparisons:7,creativeDirectionState:'proposal',productionAuthorized:false});
  });
  it('verifies only eight claims and preserves every reserve byte and every selected evidence/caveat', () => {
    const input=fixture(); const result=applyCreativeStageApproval(input);
    for (const original of input.knowledgePackage.claims) {
      const actual=result.knowledgePackage.claims.find(c=>c.id===original.id)!;
      if (!input.contentAsset.selectedClaimIds.includes(original.id)) expect(actual).toEqual(original);
      else {
        expect(actual.verificationStatus).toBe('verified');
        expect(actual.review).toMatchObject({reviewedBy:'Ahmet Nishefci',reviewTimeBasis:'decision-entry',decisionEnteredAt:input.decision.enteredAt});
        expect({...actual,review:undefined,verificationStatus:original.verificationStatus}).toEqual({...original,review:undefined});
      }
    }
    expect(result.contentAsset.script).toEqual(input.contentAsset.script);
    expect(result.contentAsset.visualPlan).toEqual(input.contentAsset.visualPlan);
    expect(result.contentAsset.approval?.approvedAt).toBeUndefined();
  });
  it('rejects changed statement even when its artifact digest is rebound', () => {
    const input=fixture(); input.knowledgePackage.claims[0]!.statement+=' Changed.';
    input.decision.knowledgePackage.sha256=sha256Json(input.knowledgePackage);
    expect(()=>applyCreativeStageApproval(input)).toThrow();
  });
  it('rejects changed evidence or narration or approved comprehension contract', () => {
    const evidence=fixture(); evidence.knowledgePackage.claims[0]!.evidence[0]!.notes+=' Changed.';
    expect(()=>applyCreativeStageApproval(evidence)).toThrow(/stale/);
    const narration=fixture(); narration.contentAsset.script.segments[0]!.text='The clock displays your position.';
    expect(()=>applyCreativeStageApproval(narration)).toThrow(/stale/);
    const contract=fixture(); contract.comprehensionContract={changed:true};
    expect(()=>applyCreativeStageApproval(contract)).toThrow(/stale/);
  });
  it('rejects extra verification, duplicated claim bindings, production authority and invented supplied review time', () => {
    const extra=fixture(); extra.decision.claimDecisions.find(c=>c.action==='preserve-research-state')!.action='verify';
    expect(()=>applyCreativeStageApproval(extra)).toThrow(/selected set/);
    const duplicate=fixture(); duplicate.decision.claimDecisions[1]=duplicate.decision.claimDecisions[0]!;
    expect(()=>applyCreativeStageApproval(duplicate)).toThrow(/exactly once/);
    expect(creativeStageApprovalSchema.safeParse({...fixture().decision,productionAuthorized:true}).success).toBe(false);
    expect(creativeStageApprovalSchema.safeParse({...fixture().decision,ownerSuppliedReviewTimestamp:fixture().decision.enteredAt}).success).toBe(false);
  });
  it('keeps direction in required owner review and rejects readiness without direction decision', () => {
    const sources=applyCreativeStageApproval(fixture());
    const direction=validateCreativeDirection(read(directionFolder,'direction-v1.json'),sources.knowledgePackage,sources.contentAsset);
    expect(direction.state).toBe('proposal'); expect(direction.ownerReview.decision).toBeUndefined();
    expect(creativeDirectionSchema.safeParse({...direction,state:'ready-for-production-planning'}).success).toBe(false);
    expect(()=>validateCreativeDirection(direction,{...sources.knowledgePackage,revision:4},sources.contentAsset)).toThrow(/stale/);
  });
});
