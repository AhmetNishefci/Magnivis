import {fileSha256} from '../../production/phantom-traffic-integrity';
import {phantomTrafficPlatformVariants as reviewed} from './phantom-traffic';
import {platformVariantSchema} from '../schema';
import {trafficPresentationDecision as decision,ownerPresentationSupportsPlatform} from '../phantom-traffic-presentation-approval';
import {sha256Json} from '../../content-intelligence/run-schema';
import copy from '../../../content-intelligence/reviews/phantom-traffic-delivery-v1/platform-copy.json';
export const phantomTrafficDeliveryVariants=reviewed.map(v=>{
 const accepted=ownerPresentationSupportsPlatform(decision,v.platform);
 const {firstComment: _firstComment,...platformCopy}=copy[v.platform];
 void _firstComment;
 const cover=v.platform==='instagram'&&decision.cover.tested===true?{strategy:'custom-image',intent:'Use the exact owner-approved original Instagram cover; its crop coordinates remain unknown.',artifact:{id:'phantom-traffic.instagram-cover.v1',path:decision.cover.path,sha256:decision.cover.sha256}}:v.cover;
 const reportPath=`artifacts/qa-evidence/phantom-traffic-platform-v1/${v.platform==='youtube'?'youtube':v.platform==='tiktok'?'tiktok':v.platform==='instagram'?'instagram-reel':'facebook-reel'}${v.platform==='youtube'||v.platform==='tiktok'?'-mobile':''}.json`;
 const regionsPath='content-intelligence/reviews/phantom-traffic-platform-v1/critical-regions.json';
 return platformVariantSchema.parse({...v,revision:2,sourceMaster:{...v.sourceMaster,contentBoundsEvidence:{regions:{path:regionsPath,sha256:fileSha256(regionsPath)},report:{path:reportPath,sha256:fileSha256(reportPath)}}},packaging:{...platformCopy,claimIds:v.packaging.claimIds},cover,
  editorialAdaptationNotes:['Exact locked master reused; narration, designed captions, sound, visual meaning and disclosures unchanged.',
   accepted?'Owner explicitly confirms the relevant mobile presentation surfaces; this is owner-reported acceptance with device/app/time and measurements unknown.':'Owner reports real-device approval, but the specific surface/cover scope remains unconfirmed. No platform pass inferred.',
   'Publication copy is a recommendation prepared after the reviewed presentation; it remains subject to publication authorization. No measured profile geometry is created.'],
  status:accepted?'production-ready':'editorial-review',previewStatus:accepted?'private-preview-passed':'ready-for-private-preview',
  productionIntent:{...v.productionIntent,platformPreviewRequired:!accepted,notes:accepted?'Exact master accepted on the confirmed surfaces. No derivative needed; publication requires a separate owner instruction.':'Delivery preparation only. Await exact surface/cover scope confirmation; do not upload or publish.'},
  ...(accepted?{approval:{approvedBy:decision.owner,decisionEnteredAt:decision.enteredAt,reviewTimeBasis:'decision-entry',ownerDecision:{id:decision.id,revision:decision.revision,sha256:sha256Json(decision)},notes:'Owner-reported real-device approval for confirmed surfaces; unknown device/app/test time/screenshots. Publication not authorized.'}}:{}),
 });
});
