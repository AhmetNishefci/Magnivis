import {describe,it,expect} from 'vitest';
import {readFileSync} from 'node:fs';
import {validateLongitudeV2,narratorRevisionDecisionSchema} from '../src/production/longitude-v2-integrity';
import {validateProductionPlanReferences} from '../src/production/schema';
import {knowledgePackageSchema} from '../src/knowledge/schema';
import {contentAssetSchema} from '../src/content-assets/schema';
import plan from '../src/production/plans/longitude-clock-v2.json';
import direction from '../content-intelligence/reviews/longitude-clock-production-v2/creative-direction.revision-3.json';
const read=(p:string)=>JSON.parse(readFileSync(p,'utf8'));
describe('Longitude V2 synchronization-only narrator revision',()=>{
 it('preserves v1 and exact editorial/design while binding af_heart and measured timeline',()=>expect(validateLongitudeV2()).toMatchObject({passed:true,narrator:'af_heart',verifiedClaims:8,v1Preserved:true,materialVisualChange:false,masterApproved:false}));
 it('rejects an invented master/publication approval or owner-supplied timestamp',()=>{
  const owner=read('content-intelligence/reviews/longitude-clock-production-v2/owner-decision.json');
  for(const field of ['masterApproved','platformApproved','uploadAuthorized','publicationAuthorized','materialVisualRedesignAuthorized'])expect(narratorRevisionDecisionSchema.safeParse({...owner,[field]:true}).success).toBe(false);
  expect(narratorRevisionDecisionSchema.safeParse({...owner,ownerSuppliedReviewTimestamp:owner.enteredAt}).success).toBe(false);
 });
 it('enforces policy on future/native plans, including omission and unjustified narrator deviation',()=>{
  const pkg=knowledgePackageSchema.parse(read('content-intelligence/reviews/longitude-clock-approved-v3/knowledge-package.approved.json'));
  const asset=contentAssetSchema.parse(read('content-intelligence/reviews/longitude-clock-approved-v3/content-asset.approved.json'));
  expect(()=>validateProductionPlanReferences({...plan,executionPolicy:undefined},pkg,asset,direction)).toThrow();
  expect(()=>validateProductionPlanReferences({...plan,executionPolicy:{...plan.executionPolicy,narrator:{provider:'kokoro-local',voiceId:'bf_emma',deviationRationale:null}}},pkg,asset,direction)).toThrow('rationale');
 });
});
