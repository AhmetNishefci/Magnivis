import {readFileSync} from 'node:fs';
import {z} from 'zod';
import {publicationRecordSchema,platformAccountSchema} from './schema';
import {sha256Json} from '../content-intelligence/run-schema';
import {trafficPublicationAuthorization as authorization} from '../platform-variants/phantom-traffic-publication';
import {phantomTrafficPublicationVariants as variants} from '../platform-variants/variants/phantom-traffic-publication';
const dir='content-intelligence/reviews/phantom-traffic-closure-v1';
export const phantomTrafficClosureDecision=JSON.parse(readFileSync(`${dir}/owner-decision.json`,'utf8'));
const decision=phantomTrafficClosureDecision;
export const closureDecisionReference={id:decision.id,revision:decision.revision,sha256:sha256Json(decision)};
const approvalReference={id:authorization.id,revision:authorization.revision,sha256:sha256Json(authorization)};
const bindings=JSON.parse(readFileSync('content-intelligence/reviews/phantom-traffic-publication-v1/final-bindings.json','utf8'));
const copy=JSON.parse(readFileSync('content-intelligence/reviews/phantom-traffic-publication-v1/platform-copy.json','utf8'));
const accounts={youtube:'account.youtube.primary',instagram:'account.instagram.magnivis-media',tiktok:'account.tiktok.primary',facebook:'account.facebook.primary'};
export const phantomTrafficReportedAccounts=(['tiktok','facebook'] as const).map(platform=>platformAccountSchema.parse({id:accounts[platform],revision:1,platform,displayName:'Magnivis',status:'active',recordedAt:decision.enteredAt.slice(0,10),notes:['Owner reports actual Phantom Traffic publication. Exact handle/account ID remains unknown; this is a logical operations identity, not an invented platform identity.']}));
export const phantomTrafficPublicationRecords=variants.map(v=>{
 const remote=decision.platforms[v.platform];const delivery=bindings.packages.find((p:{platform:string})=>p.platform===v.platform);
 return publicationRecordSchema.parse({id:`publication.${v.platform}.phantom-traffic`,revision:1,platformAccountId:accounts[v.platform],platform:v.platform,
 source:{platformVariant:{id:v.id,revision:v.revision},contentAsset:{id:'phantom-traffic.asset.backward-wave',revision:3},knowledgePackage:{id:'phantom-traffic',revision:3},videoSpecId:'phantom-traffic',delivery:{id:delivery.deliveryId,state:delivery.state,relationship:'used-for-upload',manifestSha256:delivery.manifestFileSha256},videoSha256:decision.master.sha256},
 state:'published-owner-reported',...(remote.url?{remote:{url:remote.url,postId:remote.postId}}:{}),publishedOn:decision.publishedOn,recordedAt:decision.enteredAt.slice(0,10),
 ownerReport:{decision:closureDecisionReference,evidenceBasis:'explicit-owner-message',enteredAt:decision.enteredAt,timeBasis:'decision-entry',publishedAt:null,...(remote.managementUrl?{managementUrl:remote.managementUrl}:{}),missingPublicPermalink:!remote.url,uploadIdentityBasis:'owner-reported-prepared-file',limitations:decision.limitations},
 settings:{visibility:'unknown',comments:'unknown',reuse:'unknown',aiGeneratedContentDisclosure:'unknown',commercialContentDisclosure:'unknown',captions:'burned-in',notes:['Actual native settings unknown; prepared-file caption identity is known. Posted first comment does not establish general comment/reuse/privacy settings. Owner reports using the prepared media; no uploaded/transcoded bytes independently retrieved.']},
 firstComment:{state:'owner-reported-posted',text:copy[v.platform].firstComment,commentId:null,postedAt:null,pinState:'unknown',engagement:null,decision:closureDecisionReference},
 approval:{approvedBy:authorization.owner,decisionEnteredAt:authorization.enteredAt,reviewTimeBasis:'decision-entry',ownerDecision:approvalReference,notes:'Exact release publication authorization; actual posting/inspection reported later in separate closure decision.'},
 });
});
export const liveOwnerPresentationSchema=z.object({id:z.string(),platform:z.enum(['youtube','tiktok','instagram','facebook']),publicationId:z.string(),variantId:z.string(),variantRevision:z.literal(3),masterSha256:z.string().regex(/^[a-f0-9]{64}$/),state:z.literal('OWNER_REPORTED_POST_PUBLICATION_APPROVED'),contexts:z.tuple([z.literal('desktop/web where applicable'),z.literal('mobile where applicable')]),individuallyNamedSurfaces:z.array(z.never()).max(0),decision:z.object({id:z.string(),revision:z.number(),sha256:z.string()}),observedAt:z.null(),device:z.null(),os:z.null(),appVersion:z.null(),viewport:z.null(),measurements:z.null(),screenshots:z.array(z.never()).max(0),evidenceBasis:z.literal('explicit-owner-message')}).strict();
export const phantomTrafficLivePresentation=phantomTrafficPublicationRecords.map(p=>liveOwnerPresentationSchema.parse({id:`presentation-live-owner-report.phantom-traffic.${p.platform}.v1`,platform:p.platform,publicationId:p.id,variantId:p.source.platformVariant.id,variantRevision:3,masterSha256:decision.master.sha256,state:'OWNER_REPORTED_POST_PUBLICATION_APPROVED',contexts:decision.presentationScope.contexts,individuallyNamedSurfaces:[],decision:closureDecisionReference,observedAt:null,device:null,os:null,appVersion:null,viewport:null,measurements:null,screenshots:[],evidenceBasis:'explicit-owner-message'}));
