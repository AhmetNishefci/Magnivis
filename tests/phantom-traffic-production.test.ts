import {describe,expect,it} from 'vitest';
import decision from '../content-intelligence/reviews/phantom-traffic-approved-v3/owner-decision.json';
import reviewedPackage from '../content-intelligence/reviews/phantom-traffic-finalization-v2/knowledge-package.review.json';
import reviewedAsset from '../content-intelligence/reviews/phantom-traffic-finalization-v2/content-asset.review.json';
import review from '../content-intelligence/reviews/phantom-traffic-finalization-v2/claim-review.json';
import {applyEditorialLock,editorialLockDecisionSchema} from '../src/content-intelligence/editorial-lock';
import {knowledgePackageSchema} from '../src/knowledge/schema';
import {contentAssetSchema} from '../src/content-assets/schema';
import {validatePhantomTrafficProduction} from '../src/production/phantom-traffic-integrity';
import {vehicleState,roadTraffic,ringTraffic,growthEnvelope,minimumSeparation,congestionPosition,mechanismVehicleState} from '../src/production/traffic-motion';
import {phantomTrafficCaptionPlan as captions} from '../src/captions/plans/phantom-traffic';
import metadata from '../src/production/narration/phantom-traffic.json';
import {reconstructCanonicalNarration} from '../src/captions/plan';

const pkg=knowledgePackageSchema.parse(reviewedPackage),asset=contentAssetSchema.parse(reviewedAsset);
const apply=(d:unknown=decision,p=pkg,a=asset)=>applyEditorialLock({decision:d,knowledgePackage:p,contentAsset:a,review});
describe('Phantom Traffic exact editorial lock and master candidate',()=>{
 it('replays approval without altering claims, evidence or narration and retains the next gate',()=>{
  const locked=apply();
  expect(locked.knowledgePackage.claims).toEqual(pkg.claims);
  expect(locked.knowledgePackage.sources).toEqual(pkg.sources);
  expect(locked.contentAsset.script).toEqual(asset.script);
  expect(locked.contentAsset.visualPlan).toEqual(asset.visualPlan);
  expect(locked.contentAsset.approval).toMatchObject({decisionEnteredAt:decision.enteredAt,reviewTimeBasis:'decision-entry'});
  expect(locked.contentAsset.approval?.approvedAt).toBeUndefined();
  expect(validatePhantomTrafficProduction()).toMatchObject({passed:true,verifiedClaims:6,excludedClaims:11,captionCueCount:15,ownerMasterVisualApproval:false,platformApprovalGranted:false,publicationApprovalGranted:false});
 });
 it('rejects stale research, script, evidence or claim approval bindings',()=>{
  const changed=structuredClone(pkg);changed.claims[0]!.evidence[0]!.notes+=' altered';
  expect(()=>apply(decision,changed)).toThrow('stale reviewed state');
  const changedAsset=structuredClone(asset);changedAsset.script.segments[0]!.text='Cars reverse.';
  expect(()=>apply(decision,pkg,changedAsset)).toThrow('stale reviewed state');
  const d=structuredClone(decision);d.claimStatementHashes[0]!.statementSha256='0'.repeat(64);
  expect(()=>apply(d)).toThrow('Stale editorial claim');
 });
 it('cannot invent owner timestamps, promote reserves or grant visual/publication approval',()=>{
  expect(editorialLockDecisionSchema.safeParse({...decision,ownerSuppliedReviewTimestamp:decision.enteredAt}).success).toBe(false);
  expect(editorialLockDecisionSchema.safeParse({...decision,ownerMasterVisualApproval:true}).success).toBe(false);
  expect(editorialLockDecisionSchema.safeParse({...decision,publicationApprovalGranted:true}).success).toBe(false);
  expect(()=>apply({...decision,verifiedClaimIds:[...decision.verifiedClaimIds,'phantom-traffic.claim.universal-speed']})).toThrow('previously verified claims');
 });
 it('requires labeled entry time while retaining valid legacy approval dates',()=>{
  const approved=apply().contentAsset;
  expect(contentAssetSchema.safeParse({...approved,approval:{approvedBy:'Ahmet Nishefci',decisionEnteredAt:decision.enteredAt}}).success).toBe(false);
  expect(contentAssetSchema.safeParse({...approved,approval:{...approved.approval,approvedAt:'2026-10-01'}}).success).toBe(false);
  expect(contentAssetSchema.safeParse({...approved,approval:{approvedBy:'Ahmet Nishefci',approvedAt:'2026-10-01'}}).success).toBe(true);
 });
 it('reconstructs every exact spoken segment and preserves conditional qualifiers',()=>{
  metadata.cues.forEach(cue=>expect(reconstructCanonicalNarration(captions.cues.filter(c=>c.sourceNarrationCueId===cue.id))).toBe(cue.transcript));
  expect(captions.cues.some(c=>c.lines.join(' ').includes('can sometimes grow'))).toBe(true);
  expect(captions.cues.every(c=>c.placement==='lower-safe'&&c.endFrame<=metadata.durationFrames)).toBe(true);
 });
});
describe('Original explanatory traffic kinematics',()=>{
 it('keeps cars forward or stopped, preserves ordering, and gives the pattern negative road velocity',()=>{
  for(const p of [roadTraffic,ringTraffic]){
   expect(congestionPosition(2,p)).toBeLessThan(congestionPosition(1,p));
   expect(minimumSeparation(p)).toBeGreaterThan(p===roadTraffic?84:49);
   for(let t=0;t<40;t+=0.05)for(let id=0;id<p.count;id++){
    const c=vehicleState(id,t,p),next=vehicleState(id+1,t,p);
    expect(c.speed).toBeGreaterThanOrEqual(-1e-10);
    expect(next.position-c.position).toBeGreaterThanOrEqual(minimumSeparation(p)-1e-10);
   }
  }
 });
 it('shows 22 initially uniform cars and forward-only motion while the ring cluster develops',()=>{
  expect(ringTraffic.count).toBe(22);
  for(let t=0;t<8;t+=.02)for(let id=0;id<22;id++){
   const growth=growthEnvelope(Math.max(0,t-.7)),c=vehicleState(id,t,ringTraffic,growth);
   expect(c.speed).toBeGreaterThanOrEqual(-1e-10);
   if(t===0)expect(c.speed).toBe(ringTraffic.speed);
  }
  expect(Array.from({length:22},(_,i)=>vehicleState(i,6,ringTraffic).slow).some(Boolean)).toBe(true);
 });
 it('changes slow-region membership while each car continues downstream',()=>{
  const members=(t:number)=>Array.from({length:roadTraffic.count},(_,i)=>vehicleState(i,t)).filter(c=>c.slow).map(c=>c.id);
  expect(members(4)).not.toEqual(members(12));
  for(let id=0;id<roadTraffic.count;id++)expect(vehicleState(id,12).position).toBeGreaterThan(vehicleState(id,4).position);
 });
 it('keeps illustrative follower responses collision-free without monotonically stronger braking',()=>{
  const depths=Array.from({length:13},(_,id)=>60-mechanismVehicleState(id,.55+id*.48).speed);
  expect(depths.some((depth,id)=>id>0&&depth<depths[id-1]!)).toBe(true);
  expect(depths.at(-1)).toBeGreaterThan(depths[0]!);
  for(let t=0;t<7;t+=.02)for(let id=0;id<12;id++){
   const c=mechanismVehicleState(id,t),behind=mechanismVehicleState(id+1,t);
   expect(c.speed).toBeGreaterThan(0);
   expect(c.position-behind.position).toBeGreaterThan(67.2);
  }
 });
 it('evaluates the same frame without randomness or mutable simulation state',()=>{
  const before=vehicleState(5,9.25);vehicleState(14,200);
  expect(vehicleState(5,9.25)).toEqual(before);
  expect(mechanismVehicleState(4,3.1)).toEqual(mechanismVehicleState(4,3.1));
 });
});
