import {readFileSync} from 'node:fs';
import {describe,it,expect} from 'vitest';
import {eastLongitudeDegrees,eastLongitudePoint,longitudeArc} from '../src/production/longitude-geometry';
import {validateLongitudeProduction,longitudeProductionDecisionSchema} from '../src/production/longitude-integrity';
import {validateAdaptiveCaptionPlan} from '../src/captions/adaptive-plan';
import {creativeDirectionSchema} from '../src/content-assets/creative-direction';
import {contentAssetSchema} from '../src/content-assets/schema';
import captions from '../src/captions/plans/longitude-clock.json';
import metadata from '../src/production/narration/longitude-clock.json';
const read=(p:string):unknown=>JSON.parse(readFileSync(p,'utf8'));
const direction=creativeDirectionSchema.parse(read('content-intelligence/creative-directions/longitude-clock-time-to-position-approved-v2/direction.json'));
const asset=contentAssetSchema.parse(read('content-intelligence/reviews/longitude-clock-approved-v3/content-asset.approved.json'));
describe('Longitude original candidate production',()=>{
 it('binds owner-approved direction, exact eight claims, narration, fonts and V2 captions without visual approval',()=>{
  expect(validateLongitudeProduction()).toMatchObject({passed:true,verifiedClaims:8,captionCues:24,ownerMasterApproved:false,platformApproved:false,publicationAuthorized:false});
 });
 it('maps an ahead local reading eastward counterclockwise in a north-pole view, and a behind reading westward',()=>{
  expect(eastLongitudeDegrees(14,12)).toBe(30);expect(eastLongitudeDegrees(10,12)).toBe(-30);
  const east=eastLongitudePoint(30,100);const west=eastLongitudePoint(-30,100);
  expect(east.x).toBeCloseTo(310);expect(west.x).toBeCloseTo(410);expect(east.y).toBeCloseTo(340-100*Math.cos(Math.PI/6));
  expect(longitudeArc(30,100)).toContain(' 0 0 0 ');expect(longitudeArc(-30,100)).toContain(' 0 0 1 ');
 });
 it('rejects caption wording/timing drift while preserving narration phrases and qualifiers',()=>{
  expect(validateAdaptiveCaptionPlan(captions,metadata.cues,{width:1080,height:1920},direction,asset).status).toBe('review-required');
  const wrong=structuredClone(captions);wrong.cues[0]!.lines=['The clock displays position.'];
  expect(()=>validateAdaptiveCaptionPlan(wrong,metadata.cues,{width:1080,height:1920},direction,asset)).toThrow(/fidelity/);
  const late=structuredClone(captions);late.cues[0]!.endFrame=metadata.durationFrames;
  expect(()=>validateAdaptiveCaptionPlan(late,metadata.cues,{width:1080,height:1920},direction,asset)).toThrow(/timing/);
 });
 it('does not accept master/platform/upload/publication approval or an invented supplied review time',()=>{
  const owner=read('content-intelligence/creative-directions/longitude-clock-time-to-position-approved-v2/owner-decision.json') as Record<string,unknown>;
  for(const field of ['ownerMasterApproval','platformApprovalGranted','uploadAuthorized','publicationApprovalGranted'])expect(longitudeProductionDecisionSchema.safeParse({...owner,[field]:true}).success).toBe(false);
  expect(longitudeProductionDecisionSchema.safeParse({...owner,ownerSuppliedReviewTimestamp:owner.enteredAt}).success).toBe(false);
 });
});
