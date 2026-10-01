import {readFileSync} from 'node:fs';
import {ownerPresentationDecisionSchema,type OwnerPresentationDecision} from './owner-presentation';
import {ownerReportedPresentationSchema} from './owner-presentation-record';
import {sha256Json} from '../content-intelligence/run-schema';
import {fileSha256} from '../production/phantom-traffic-integrity';
export const trafficPresentationDecision=ownerPresentationDecisionSchema.parse(JSON.parse(readFileSync('content-intelligence/reviews/phantom-traffic-delivery-v1/owner-decision.json','utf8')));
export const trafficPlatformRequiredSurfaces={
 youtube:['youtube-shorts-viewer'],tiktok:['tiktok-feed'],instagram:['instagram-reels-playback','instagram-profile-grid'],facebook:['facebook-reels-viewer','facebook-page-feed'],
} as const;
export const ownerPresentationSupportsPlatform=(decision:OwnerPresentationDecision,platform:keyof typeof trafficPlatformRequiredSurfaces)=>{
 ownerPresentationDecisionSchema.parse(decision);
 return trafficPlatformRequiredSurfaces[platform].every(s=>decision.confirmedSurfaces.includes(s))
   &&(platform!=='instagram'||decision.cover.tested===true);
};
export const validateOwnerPresentationDecision=(input:unknown)=>{
 const d=ownerPresentationDecisionSchema.parse(input);
 if(fileSha256(d.master.path)!==d.master.sha256||fileSha256(d.cover.path)!==d.cover.sha256)throw new Error('Owner presentation file identities changed');
 return d;
};
export const createOwnerReportedPresentation=(d:OwnerPresentationDecision,surface:OwnerPresentationDecision['confirmedSurfaces'][number],variantId:string)=>{
 if(!d.confirmedSurfaces.includes(surface))throw new Error('Cannot claim an unconfirmed surface');
 return ownerReportedPresentationSchema.parse({id:`presentation-owner-report.phantom-traffic.${surface}.r${d.revision}`,platformVariantId:variantId,masterArtifactId:d.master.artifactId,surface,context:'mobile-app',state:'OWNER_REPORTED_PASSED',mediaSha256:d.master.sha256,coverSha256:surface==='instagram-profile-grid'&&d.cover.tested?d.cover.sha256:null,reviewer:d.owner,decision:{id:d.id,revision:d.revision,sha256:sha256Json(d)},evidenceBasis:'explicit-owner-statement',decisionEnteredAt:d.enteredAt,testedAt:null,device:null,os:null,appVersion:null,screenshots:[],notes:'Owner-reported real-device acceptance; device/app/time/screenshots/crop measurements unavailable. Not a measured profile or local-model promotion.'});
};
