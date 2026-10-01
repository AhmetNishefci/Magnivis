import {z} from 'zod';
import {productionPlanSchema,type ProductionPlan} from './schema';
import {sha256Json} from '../content-intelligence/run-schema';
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
export type MasterApprovalDecision=z.infer<typeof masterApprovalDecisionSchema>;
type ReviewedCandidateBindings={candidate:{path:string;sha256:string;bytes:number};narration:{bundleSha256:string}};
export const applyMasterVisualApproval=(input:unknown, reviewed:ProductionPlan, bindings:ReviewedCandidateBindings, platformReviewRequirement='Exact master visually approved; immutable bytes. Phantom Traffic-specific real-device platform review remains required.')=>{
 const decision=masterApprovalDecisionSchema.parse(input);
 if(sha256Json(bindings)!==decision.candidateBindings.sha256||decision.artifact.path!==bindings.candidate.path||decision.artifact.sha256!==bindings.candidate.sha256||decision.artifact.bytes!==bindings.candidate.bytes||decision.narrationBundleSha256!==bindings.narration.bundleSha256)throw new Error('Master decision targets stale candidate/audio/evidence identity');
 const matches=(ref:z.infer<typeof reference>,actual:z.infer<typeof reference>)=>sha256Json(ref)===sha256Json(actual);
 if(!matches(decision.reviewedProductionPlan,{id:reviewed.id,revision:reviewed.revision,sha256:sha256Json(reviewed)})
   || !matches(decision.knowledgePackage,reviewed.knowledgePackage)||!matches(decision.contentAsset,reviewed.contentAsset)
   || !matches(decision.editorialApproval,reviewed.ownerDecision)||decision.approvedScriptSha256!==reviewed.approvedScriptSha256
   || !matches(decision.captionPlan,{id:reviewed.captions.captionPlanId,revision:reviewed.captions.captionPlanRevision,sha256:reviewed.captions.captionPlanSha256}))throw new Error('Master decision targets stale reviewed source bindings');
 if(reviewed.status!=='rendered-candidate-visual-review-required'||reviewed.visualApproval)throw new Error('Master approval requires the exact unapproved candidate state');
 return productionPlanSchema.parse({...reviewed,revision:reviewed.revision+1,status:'owner-visual-approved',
  visualApproval:{decision:'approved',reviewedBy:decision.reviewer,decisionEnteredAt:decision.enteredAt,reviewTimeBasis:'decision-entry',
   ownerDecision:{id:decision.id,revision:decision.revision,sha256:sha256Json(decision)},artifact:{path:decision.artifact.path,sha256:decision.artifact.sha256},captionPlan:decision.captionPlan,
   notes:'Owner approved only the exact rendered master. Entry time is not a supplied review timestamp. CaptionPlan is approved in this exact master binding; original render inputs remain immutable.',platformVariantApprovalGranted:false,publicationApprovalGranted:false},
  reviewRequirements:[platformReviewRequirement,...reviewed.reviewRequirements.slice(1)]});
};
