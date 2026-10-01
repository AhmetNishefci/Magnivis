import {z} from 'zod';
import {digestSchema,relativePathSchema} from '../artifacts/schema';
import {presentationSurfaceSchema} from './presentation';
export const presentationDecisionReferenceSchema=z.object({id:z.string().startsWith('owner-decision.'),revision:z.number().int().positive(),sha256:digestSchema}).strict();
export const platformApprovalSchema=z.object({
 approvedBy:z.string().min(1),approvedAt:z.iso.date().optional(),
 decisionEnteredAt:z.iso.datetime().optional(),reviewTimeBasis:z.literal('decision-entry').optional(),
 ownerDecision:presentationDecisionReferenceSchema.optional(),notes:z.string().min(1).optional(),
}).strict().superRefine((a,c)=>{
 if(!a.approvedAt&&!a.decisionEnteredAt)c.addIssue({code:'custom',message:'Approval requires supplied review date or labeled decision-entry time'});
 if(a.decisionEnteredAt&&(a.approvedAt||a.reviewTimeBasis!=='decision-entry'||!a.ownerDecision))c.addIssue({code:'custom',message:'Decision-entry approval requires exact decision and cannot invent an owner review date'});
 if(a.reviewTimeBasis&&!a.decisionEnteredAt)c.addIssue({code:'custom',message:'Decision-entry basis requires entry time'});
});
export const ownerPresentationDecisionSchema=z.object({
 schemaVersion:z.literal(1),id:z.string().startsWith('owner-decision.'),revision:z.number().int().positive(),
 owner:z.literal('Ahmet Nishefci'),authority:z.literal('explicit-owner-message'),
 enteredAt:z.iso.datetime(),timeBasis:z.literal('decision-entry'),ownerSuppliedReviewTimestamp:z.null(),
 ownerStatement:z.string().min(1),scopeConfirmation:z.string().nullable(),
 master:z.object({artifactId:z.string(),path:relativePathSchema,sha256:digestSchema}).strict(),
 reviewedVariants:z.array(z.object({id:z.string(),revision:z.number().int().positive(),sha256:digestSchema}).strict()),
 requestedSurfaces:z.array(presentationSurfaceSchema).min(1),confirmedSurfaces:z.array(presentationSurfaceSchema),
 cover:z.object({path:relativePathSchema,sha256:digestSchema,tested:z.boolean().nullable()}).strict(),
 metadata:z.object({device:z.null(),os:z.null(),appVersion:z.null(),testedAt:z.null(),screenshots:z.array(z.string()).max(0),cropMeasurements:z.null()}).strict(),
 limitations:z.array(z.string().min(1)).min(1),publicationAuthorized:z.literal(false),
}).strict().superRefine((d,c)=>{
 if(new Set(d.confirmedSurfaces).size!==d.confirmedSurfaces.length||d.confirmedSurfaces.some(s=>!d.requestedSurfaces.includes(s)))c.addIssue({code:'custom',message:'Confirmed surfaces must be distinct and requested'});
 if(d.confirmedSurfaces.length&&!d.scopeConfirmation)c.addIssue({code:'custom',message:'Surface-specific approval requires explicit scope confirmation'});
 if(d.cover.tested===true&&(!d.scopeConfirmation||!d.confirmedSurfaces.includes('instagram-profile-grid')))c.addIssue({code:'custom',message:'Exact cover approval needs confirmed grid scope'});
});
export type OwnerPresentationDecision=z.infer<typeof ownerPresentationDecisionSchema>;
