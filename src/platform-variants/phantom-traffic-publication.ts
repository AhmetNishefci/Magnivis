import {z} from 'zod';
import {readFileSync} from 'node:fs';
import {digestSchema,relativePathSchema} from '../artifacts/schema';
import {fileSha256} from '../production/phantom-traffic-integrity';
const reference=z.object({path:relativePathSchema,sha256:digestSchema}).strict();
export const publicationAuthorizationSchema=z.object({schemaVersion:z.literal(1),id:z.string().startsWith('owner-decision.'),revision:z.number().int().positive(),owner:z.literal('Ahmet Nishefci'),authority:z.literal('explicit-owner-message'),decision:z.literal('PUBLICATION AUTHORIZED'),enteredAt:z.iso.datetime(),timeBasis:z.literal('decision-entry'),ownerSuppliedReviewTimestamp:z.null(),reviewedCommit:z.string().regex(/^[a-f0-9]{40}$/),ownerStatement:z.string().min(1),correctsPriorDecision:reference,master:reference,selectedInstagramCover:reference,preparedPackageIndex:reference,copy:reference,platforms:z.array(z.enum(['youtube','tiktok','instagram','facebook'])).length(4),presentationRiskAccepted:z.literal(true),realDevicePrepublicationReviewCompleted:z.literal(false),realDevicePassesGranted:z.array(z.never()).max(0),coverDeviceApprovalGranted:z.literal(false),metadata:z.object({device:z.null(),os:z.null(),appVersion:z.null(),testedAt:z.null(),screenshots:z.array(z.never()).max(0),measurements:z.null()}).strict(),execution:z.literal('owner-manual-only'),assistantUploadAuthorized:z.literal(false),publicationOccurred:z.literal(false),postPublicationReview:z.literal('pending-live-publication-evidence'),limitations:z.array(z.string()).min(1)}).strict().superRefine((d,c)=>{if(new Set(d.platforms).size!==4)c.addIssue({code:'custom',message:'Authorization must explicitly cover four distinct platforms'});});
export const trafficPublicationAuthorization=publicationAuthorizationSchema.parse(JSON.parse(readFileSync('content-intelligence/reviews/phantom-traffic-publication-v1/owner-decision.json','utf8')));
export const validateTrafficPublicationAuthorization=()=>{
 const d=trafficPublicationAuthorization;
 for(const r of [d.correctsPriorDecision,d.master,d.selectedInstagramCover,d.preparedPackageIndex,d.copy])if(fileSha256(r.path)!==r.sha256)throw new Error(`Publication decision identity changed: ${r.path}`);
 return d;
};
