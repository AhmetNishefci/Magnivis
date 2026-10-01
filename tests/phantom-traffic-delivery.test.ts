import {readFileSync,writeFileSync,mkdtempSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {describe,it,expect} from 'vitest';
import {ownerPresentationDecisionSchema,platformApprovalSchema} from '../src/platform-variants/owner-presentation';
import {ownerReportedPresentationSchema} from '../src/platform-variants/owner-presentation-record';
import {trafficPresentationDecision as actual,ownerPresentationSupportsPlatform,createOwnerReportedPresentation} from '../src/platform-variants/phantom-traffic-presentation-approval';
import {phantomTrafficDeliveryVariants} from '../src/platform-variants/variants/phantom-traffic-delivery';
import {realDevicePassed} from '../src/platform-variants/presentation';
import {fileSha256} from '../src/production/phantom-traffic-integrity';
import {validatePhantomTrafficLockedMaster} from '../src/production/phantom-traffic-master-integrity';
import {generateDeliveryPackage,validateDeliveryPackage,deliveryDependencies,validateContentBoundsEvidence} from '../scripts/delivery-packages';
import {createPlatformVariantRegistry} from '../src/platform-variants/registry';
const fixture=()=>ownerPresentationDecisionSchema.parse({...actual,scopeConfirmation:'Synthetic test fixture: six surfaces and the exact PNG.',confirmedSurfaces:actual.requestedSurfaces,cover:{...actual.cover,tested:true}});
describe('Owner-reported presentation and delivery gates',()=>{
 it('preserves exact master bytes and never changes captions/audio to prepare delivery',()=>{
  expect(validatePhantomTrafficLockedMaster().artifact.sha256).toBe('bdf22d48b4fe1b873fd659a487954c09c1573dd5466795656128c08d03208d4b');
 });
 it('records entry time rather than inventing review time, device or screenshot evidence',()=>{
  expect(actual.ownerSuppliedReviewTimestamp).toBeNull();expect(actual.metadata).toEqual({device:null,os:null,appVersion:null,testedAt:null,screenshots:[],cropMeasurements:null});
  expect(ownerPresentationDecisionSchema.safeParse({...actual,metadata:{...actual.metadata,device:'Invented phone'}}).success).toBe(false);
  expect(platformApprovalSchema.safeParse({approvedBy:'Ahmet Nishefci',decisionEnteredAt:actual.enteredAt}).success).toBe(false);
 });
 it('cannot turn a generic statement into specific surface or cover passes',()=>{
  const unscoped={...actual,scopeConfirmation:null,confirmedSurfaces:[],cover:{...actual.cover,tested:null}};
  for(const platform of ['youtube','tiktok','instagram','facebook'] as const)expect(ownerPresentationSupportsPlatform(unscoped,platform)).toBe(false);
  expect(()=>createOwnerReportedPresentation(unscoped,'facebook-page-feed','test')).toThrow('unconfirmed');
 });
 it('requires Reel and grid plus exact cover independently for Instagram readiness',()=>{
  const d=fixture();expect(ownerPresentationSupportsPlatform(d,'instagram')).toBe(true);
  expect(ownerPresentationSupportsPlatform({...d,cover:{...d.cover,tested:false}},'instagram')).toBe(false);
  expect(()=>ownerPresentationSupportsPlatform({...d,confirmedSurfaces:d.confirmedSurfaces.filter(s=>s!=='instagram-profile-grid')},'instagram')).toThrow('grid scope');
 });
 it('requires both Facebook viewer and Page/feed, without assuming a derivative is necessary',()=>{
  const d=fixture();expect(ownerPresentationSupportsPlatform(d,'facebook')).toBe(true);
  expect(ownerPresentationSupportsPlatform({...d,confirmedSurfaces:d.confirmedSurfaces.filter(s=>s!=='facebook-page-feed')},'facebook')).toBe(false);
  expect(phantomTrafficDeliveryVariants.every(v=>v.sourceMaster?.relationship==='exact-master')).toBe(true);
 });
 it('keeps owner report evidence distinct from fully measured REAL_DEVICE_PASSED evidence',()=>{
  const d=fixture(),r=createOwnerReportedPresentation(d,'youtube-shorts-viewer','variant.test');
  expect(ownerReportedPresentationSchema.parse(r).state).toBe('OWNER_REPORTED_PASSED');
  const local=JSON.parse(readFileSync('artifacts/presentation-qa.json','utf8'));
  expect(realDevicePassed(local,'youtube-shorts-viewer',d.master.sha256)).toBe(false);
 });
 it('registers distinct platform copy and keeps final readiness conditional on confirmed scope',()=>{
  expect(createPlatformVariantRegistry(phantomTrafficDeliveryVariants).list()).toHaveLength(4);
  for(const v of phantomTrafficDeliveryVariants)expect(v.status==='production-ready').toBe(ownerPresentationSupportsPlatform(actual,v.platform));
  const copy=JSON.parse(readFileSync('content-intelligence/reviews/phantom-traffic-delivery-v1/platform-copy.json','utf8'));
  expect(new Set(Object.values(copy).map(v=>JSON.stringify(v))).size).toBe(4);
 });
 it('requires hash-bound actual content proof when destination insets exceed the authoring envelope',()=>{
  const v=phantomTrafficDeliveryVariants.find(v=>v.platform==='youtube')!;
  expect(()=>validateContentBoundsEvidence(v)).not.toThrow();
  expect(()=>validateContentBoundsEvidence({...v,sourceMaster:{...v.sourceMaster!,contentBoundsEvidence:undefined}})).toThrow('Missing');
  expect(()=>validateContentBoundsEvidence({...v,sourceMaster:{...v.sourceMaster!,contentBoundsEvidence:{...v.sourceMaster!.contentBoundsEvidence!,regions:{...v.sourceMaster!.contentBoundsEvidence!.regions,sha256:'0'.repeat(64)}}}})).toThrow('hash mismatch');
 });
 it('rejects critical-region collisions even when supplied evidence hashes are correct',()=>{
  const dir=mkdtempSync(join(tmpdir(),'magnivis-bounds-test-'));
  try{
   const v=phantomTrafficDeliveryVariants.find(v=>v.platform==='youtube')!;
   const e=v.sourceMaster!.contentBoundsEvidence!;
   const regions=JSON.parse(readFileSync(e.regions.path,'utf8'));regions.find((r:{kind:string})=>r.kind==='caption').bounds.y=1800;
   const path=join(dir,'regions.json');writeFileSync(path,JSON.stringify(regions));
   const bad={...v,sourceMaster:{...v.sourceMaster!,contentBoundsEvidence:{...e,regions:{path,sha256:fileSha256(path)}}}};
   expect(()=>validateContentBoundsEvidence(bad)).toThrow('outside destination');
   expect(()=>validateContentBoundsEvidence({...v,sourceMaster:{...v.sourceMaster!,artifact:{...v.sourceMaster!.artifact,sha256:'0'.repeat(64)}}})).toThrow('detached');
  }finally{rmSync(dir,{recursive:true,force:true});}
 });
 it('packages a registered cover with exact hashes and validates repeated deterministic handoffs',()=>{
  const dir=mkdtempSync(join(tmpdir(),'magnivis-delivery-test-'));
  try{
   const base=phantomTrafficDeliveryVariants.find(v=>v.platform==='instagram')!;
   const variant={...base,cover:{...base.cover,strategy:'custom-image',artifact:{id:'phantom-traffic.instagram-cover.v1',path:actual.cover.path,sha256:actual.cover.sha256}}};
   const dependencies={...deliveryDependencies,variantRegistry:createPlatformVariantRegistry([variant])};
   const args={variantId:variant.id,outputRoot:dir,generatedAt:'2026-10-01T00:00:00Z',dependencies};
   const first=generateDeliveryPackage(args),firstHash=fileSha256(join(first.directory,'manifest.json'));
   expect(first.manifest.artifacts.find(a=>a.role==='cover')?.sha256).toBe(actual.cover.sha256);
   expect(first.manifest.review.publicationAuthorized).toBe(false);
   expect(first.manifest.artifacts.find(a=>a.role==='video')?.sha256).toBe(actual.master.sha256);
   validateDeliveryPackage(first.directory,dependencies);
   const repeat=generateDeliveryPackage(args);expect(fileSha256(join(repeat.directory,'manifest.json'))).toBe(firstHash);
  }finally{rmSync(dir,{recursive:true,force:true});}
 });
});
