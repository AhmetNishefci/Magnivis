import {describe,it,expect} from 'vitest';
import {readFileSync} from 'node:fs';
import {publicationAuthorizationSchema,validateTrafficPublicationAuthorization} from '../src/platform-variants/phantom-traffic-publication';
import {phantomTrafficPublicationVariants as variants} from '../src/platform-variants/variants/phantom-traffic-publication';
import {phantomTrafficDeliveryVariants as prepared} from '../src/platform-variants/variants/phantom-traffic-delivery';
import {platformVariantSchema} from '../src/platform-variants/schema';
import {realDevicePassed} from '../src/platform-variants/presentation';
import {createReviewChecklist} from '../scripts/delivery-packages';
import {sha256Json} from '../src/content-intelligence/run-schema';
describe('Phantom Traffic explicit publication risk acceptance',()=>{
 it('binds the exact master, prior handoffs, copy and cover without asserting publication',()=>{
  const d=validateTrafficPublicationAuthorization();expect(d.decision).toBe('PUBLICATION AUTHORIZED');expect(d.publicationOccurred).toBe(false);expect(d.assistantUploadAuthorized).toBe(false);
  expect(d.master.sha256).toBe('bdf22d48b4fe1b873fd659a487954c09c1573dd5466795656128c08d03208d4b');
 });
 it('cannot manufacture prepublication surface or cover approval in the release decision',()=>{
  const d=validateTrafficPublicationAuthorization();expect(d.realDevicePrepublicationReviewCompleted).toBe(false);expect(d.realDevicePassesGranted).toEqual([]);
  expect(publicationAuthorizationSchema.safeParse({...d,realDevicePrepublicationReviewCompleted:true}).success).toBe(false);
  expect(publicationAuthorizationSchema.safeParse({...d,metadata:{...d.metadata,device:'Invented phone'}}).success).toBe(false);
 });
 it('allows release readiness only with explicit matching owner acceptance and keeps preview distinct from a pass',()=>{
  for(const v of variants){expect(v.status).toBe('production-ready');expect(v.previewStatus).toBe('owner-risk-accepted');expect(v.productionIntent.platformPreviewRequired).toBe(false);
   expect(platformVariantSchema.safeParse({...v,presentationRiskAcceptance:undefined}).success).toBe(false);
   expect(platformVariantSchema.safeParse({...v,approval:{...v.approval!,ownerDecision:{...v.approval!.ownerDecision!,sha256:'0'.repeat(64)}}}).success).toBe(false);
   expect(createReviewChecklist(v)).toContain('not a real-device pass');
  }
 });
 it('preserves exact platform copy, source master and production bindings with no new derivative',()=>{
  for(const v of variants){const old=prepared.find(p=>p.id===v.id)!;expect(sha256Json(v.packaging)).toBe(sha256Json(old.packaging));expect(v.sourceMaster).toEqual(old.sourceMaster);expect(v.productionIntent.renderStrategy).toBe('reuse-existing-master');}
 });
 it('selects the existing Instagram cover without altering historical QA or declaring crop measurements',()=>{
  const d=validateTrafficPublicationAuthorization();expect(variants.find(v=>v.platform==='instagram')?.cover.artifact?.sha256).toBe(d.selectedInstagramCover.sha256);
  const records=JSON.parse(readFileSync('artifacts/presentation-qa.json','utf8'));for(const v of variants)expect(realDevicePassed(records,v.platform==='youtube'?'youtube-shorts-viewer':v.platform==='tiktok'?'tiktok-feed':v.platform==='instagram'?'instagram-reels-playback':'facebook-reels-viewer',d.master.sha256)).toBe(false);
  const cover=JSON.parse(readFileSync('artifacts/cover-assets.json','utf8')).find((c:{id:string})=>c.id==='phantom-traffic.instagram-cover.v1');expect(cover.status).toBe('review');expect(cover.crop).toBeNull();
 });
});
