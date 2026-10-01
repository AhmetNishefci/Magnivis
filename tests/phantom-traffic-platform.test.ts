import candidateBindings from '../content-intelligence/reviews/phantom-traffic-production-v1/candidate-bindings.json';
import {readFileSync} from 'node:fs';
import {describe,expect,it} from 'vitest';
import decisionData from '../content-intelligence/reviews/phantom-traffic-master-lock-v1/owner-decision.json';
import reviewedPlanData from '../src/production/plans/phantom-traffic.json';
import profilesData from '../artifacts/presentation-profiles.json';
import qaData from '../artifacts/presentation-qa.json';
import {productionPlanSchema,productionVisualApprovalSchema} from '../src/production/schema';
import {masterApprovalDecisionSchema,applyMasterVisualApproval} from '../src/production/master-approval';
import {validatePhantomTrafficLockedMaster} from '../src/production/phantom-traffic-master-integrity';
import {presentationQaSchema,presentationProfileSchema,realDevicePassed,validatePresentationRegions,coverAssetSchema} from '../src/platform-variants/presentation';
import {phantomTrafficRegions,assessPhantomTrafficSurface} from '../src/platform-variants/phantom-traffic-regions';
import {phantomTrafficPlatformVariants} from '../src/platform-variants/variants/phantom-traffic';
import {createPlatformVariantRegistry} from '../src/platform-variants/registry';
const reviewed=productionPlanSchema.parse(reviewedPlanData);
const profiles=profilesData.map(p=>presentationProfileSchema.parse(p));
const records=qaData.map(r=>presentationQaSchema.parse(r)).filter(r=>r.id.startsWith('presentation-qa.phantom-traffic.'));
describe('Exact Phantom Traffic master approval',()=>{
 it('locks identical bytes and immutable caption/script/audio bindings with truthful entry time',()=>{
  const result=validatePhantomTrafficLockedMaster();
  expect(result).toMatchObject({passed:true,ownerMasterVisualApproval:true,ownerSuppliedReviewTimestamp:null,platformApprovalGranted:false,publicationApprovalGranted:false});
  expect(result.artifact.sha256).toBe('bdf22d48b4fe1b873fd659a487954c09c1573dd5466795656128c08d03208d4b');
  const locked=applyMasterVisualApproval(decisionData,reviewed,candidateBindings);
  expect(locked.beats).toEqual(reviewed.beats);expect(locked.captions).toEqual(reviewed.captions);
  expect(locked.visualApproval?.reviewedAt).toBeUndefined();
 });
 it('rejects changed reviewed production/caption/script/evidence references',()=>{
  for(const key of ['approvedScriptSha256','narrationBundleSha256'] as const){
   const d=structuredClone(decisionData);d[key]='0'.repeat(64);
   expect(()=>applyMasterVisualApproval(d,reviewed,candidateBindings)).toThrow('stale');
  }
  const d=structuredClone(decisionData);d.captionPlan.sha256='0'.repeat(64);
  expect(()=>applyMasterVisualApproval(d,reviewed,candidateBindings)).toThrow('stale');
 });
 it('cannot invent an owner date or transfer master approval to platforms/publication',()=>{
  expect(masterApprovalDecisionSchema.safeParse({...decisionData,ownerSuppliedReviewTimestamp:decisionData.enteredAt}).success).toBe(false);
  expect(masterApprovalDecisionSchema.safeParse({...decisionData,platformApprovalGranted:true}).success).toBe(false);
  const approval=applyMasterVisualApproval(decisionData,reviewed,candidateBindings).visualApproval!;
  expect(productionVisualApprovalSchema.safeParse({...approval,reviewedAt:decisionData.enteredAt}).success).toBe(false);
  expect(productionVisualApprovalSchema.safeParse({...approval,reviewTimeBasis:undefined}).success).toBe(false);
 });
});
describe('Presentation surfaces and pending real-device gates',()=>{
 it('registers four exact-master variants with preview gates, preserving old YouTube V1 compatibility',()=>{
  expect(createPlatformVariantRegistry(phantomTrafficPlatformVariants).list()).toHaveLength(4);
  expect(phantomTrafficPlatformVariants.every(v=>v.status==='editorial-review'&&!v.approval&&v.productionIntent.platformPreviewRequired)).toBe(true);
  const youtube=phantomTrafficPlatformVariants.find(v=>v.platform==='youtube')!;
  expect(youtube.safeAreaProfileId).toBe('safe-area.youtube-shorts.v2');
  expect(createPlatformVariantRegistry([{...youtube,safeAreaProfileId:'safe-area.youtube-shorts.v1'}]).list()).toHaveLength(1);
  expect(()=>createPlatformVariantRegistry([{...youtube,safeAreaProfileId:'safe-area.tiktok-feed.v2'}])).toThrow('Invalid safe-area');
 });
 it('preserves seven independent surface/context records and never treats local evidence as mobile approval',()=>{
  expect(records).toHaveLength(7);
  expect(new Set(records.map(r=>`${r.surface}:${r.context}`)).size).toBe(7);
  expect(records.every(r=>!r.device&&!r.os&&!r.appVersion&&!r.testedAt&&!r.reviewer)).toBe(true);
  for(const r of records)expect(realDevicePassed(records,r.surface,r.mediaSha256,r.coverSha256)).toBe(false);
 });
 it('reports caption/native exclusion uncertainty separately despite geometric containment',()=>{
  for(const id of ['safe-area.youtube-shorts.v2','safe-area.tiktok-feed.v2','safe-area.instagram-reels.v1','safe-area.facebook-reels.v1']){
   const p=profiles.find(p=>p.id===id)!,a=assessPhantomTrafficSurface(p);
   expect(a.insetContainment?.every(r=>r.contained)).toBe(true);
   expect(a.nativeAssessment.state).toBe('INCOMPLETE');
   expect(a.nativeAssessment.unresolved).toEqual(['native exclusion zones','caption region']);
  }
 });
 it('keeps grid/feed crops unmeasured and creates no speculative Facebook derivative',()=>{
  for(const surface of ['instagram-profile-grid','facebook-page-feed']){
   const profile=profiles.find(p=>p.surface===surface)!;
   expect(profile.insets).toBeNull();expect(validatePresentationRegions(profile,phantomTrafficRegions).state).toBe('UNMEASURED');
  }
  const outputs=JSON.parse(readFileSync('content-intelligence/reviews/phantom-traffic-platform-v1/presentation-outputs.json','utf8')) as {derivativeArtifactId:string|null}[];
  expect(outputs.every(o=>o.derivativeArtifactId===null)).toBe(true);
 });
 it('binds the original cover candidate independently without inventing a grid crop or approval',()=>{
  const covers=JSON.parse(readFileSync('artifacts/cover-assets.json','utf8')) as unknown[];
  const cover=coverAssetSchema.parse(covers[0]);
  expect(cover).toMatchObject({status:'review',crop:null,approvalDecisionId:null,sourceVideoSha256:decisionData.artifact.sha256});
  expect(records.find(r=>r.surface==='instagram-profile-grid')?.coverSha256).toBe(cover.sha256);
 });
 it('rejects disclosure and critical-action overlap while allowing decorative clipping',()=>{
  const p={...profiles.find(p=>p.id==='safe-area.tiktok-feed.v2')!,exclusionZones:[{x:150,y:308,width:300,height:100}]};
  expect(validatePresentationRegions(p,phantomTrafficRegions).violations).toContain('disclosure');
  expect(validatePresentationRegions(p,phantomTrafficRegions).violations).toContain('critical-visual');
  expect(validatePresentationRegions(p,phantomTrafficRegions).violations).not.toContain('decorative');
 });
});
