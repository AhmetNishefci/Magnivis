import {z} from 'zod';
import {digestSchema,relativePathSchema} from '../artifacts/schema';
const reference=z.object({id:z.string(),revision:z.number().int().positive(),sha256:digestSchema}).strict();
export const masterApprovalDecisionSchema=z.object({
 schemaVersion:z.literal(1),id:z.string().startsWith('owner-decision.'),revision:z.number().int().positive(),
 reviewer:z.string().min(1),authority:z.literal('explicit-owner-message'),ownerInstruction:z.string().min(1),
 enteredAt:z.iso.datetime(),timeBasis:z.literal('decision-entry'),ownerSuppliedReviewTimestamp:z.null(),
 reviewedCommit:z.string().regex(/^[a-f0-9]{40}$/),candidateArtifactId:z.string(),masterArtifactId:z.string(),
 artifact:z.object({path:relativePathSchema,sha256:digestSchema,bytes:z.number().int().positive()}).strict(),
 knowledgePackage:reference,contentAsset:reference,editorialApproval:reference,approvedScriptSha256:digestSchema,
 reviewedProductionPlan:reference,captionPlan:reference,narrationBundleSha256:digestSchema,
 candidateBindings:z.object({path:relativePathSchema,sha256:digestSchema}).strict(),
 platformPresentationQaAuthorized:z.literal(true),platformApprovalGranted:z.literal(false),publicationApprovalGranted:z.literal(false),
}).strict();
