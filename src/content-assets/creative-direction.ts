import {z} from 'zod';
import {stableKnowledgeIdSchema} from '../knowledge/schema';

export const creativeReferenceSchema = z.object({
  id: stableKnowledgeIdSchema, revision: z.number().int().positive(),
  sha256: z.string().regex(/^[a-f0-9]{64}$/),
}).strict();
const text = z.string().trim().min(1);
const decisionSchema = z.object({
  dimension: z.string().regex(/^[a-z]+(?:-[a-z]+)*$/),
  treatment: text, rationale: text,
  alternativesConsidered: z.array(text).optional(),
}).strict();

// Decision dimensions describe responsibilities, never domain styles or media menus.
export const creativeDirectionSchema = z.object({
  schemaVersion: z.literal(1),
  id: stableKnowledgeIdSchema.refine(id => id.startsWith('creative-direction.')),
  revision: z.number().int().positive(),
  state: z.enum(['proposal', 'ready-for-production-planning']),
  knowledgePackage: creativeReferenceSchema, contentAsset: creativeReferenceSchema,
  approvedScriptSha256: z.string().regex(/^[a-f0-9]{64}$/),
  creativeThesis: text, viewerExperience: text, emotionalTarget: text, visualThesis: text,
  decisions: z.array(decisionSchema).min(1),
  convergenceReview: z.object({
    recentAssets: z.array(z.object({
      contentAsset: creativeReferenceSchema,
      learnedPrinciple: text, applicability: text,
      similarities: z.array(text), differences: z.array(text),
      assessment: z.enum(['justified-reuse', 'distinct-execution', 'reconsidered']),
      rationale: text,
    }).strict()),
    noRecentAssetsReason: text.optional(),
    unresolvedConvenienceReuse: z.array(text),
    conclusion: text,
  }).strict(),
  ownerReview: z.object({
    required: z.boolean(), rationale: text,
    decision: creativeReferenceSchema.optional(),
  }).strict(),
  risks: z.array(text),
  provenance: z.object({
    method: z.enum(['manual-editorial', 'ai-assisted-editorial']),
    enteredAt: z.iso.datetime(), notes: text,
  }).strict(),
  platformApprovalGranted: z.literal(false), publicationApprovalGranted: z.literal(false),
}).strict().superRefine((direction, ctx) => {
  const dimensions = direction.decisions.map(d => d.dimension);
  if (new Set(dimensions).size !== dimensions.length) ctx.addIssue({code:'custom',message:'Creative decision dimensions must be unique'});
  for (const dimension of ['visual-medium','art-direction','narration','captions','sound','pacing','hook','platform-presentation']) {
    if (!dimensions.includes(dimension)) ctx.addIssue({code:'custom',message:`Evaluate ${dimension}; explicit none/not-applicable with rationale is valid`});
  }
  if (!direction.convergenceReview.recentAssets.length && !direction.convergenceReview.noRecentAssetsReason) ctx.addIssue({code:'custom',message:'Convergence review requires precedents or an explicit reason none exist'});
  if (direction.convergenceReview.recentAssets.some(p => p.contentAsset.id === direction.contentAsset.id)) ctx.addIssue({code:'custom',message:'A direction cannot use itself as its recent-content comparison'});
  if (direction.state === 'ready-for-production-planning') {
    if (direction.convergenceReview.unresolvedConvenienceReuse.length) ctx.addIssue({code:'custom',message:'Reconsider unresolved convenience reuse before production planning'});
    if (direction.ownerReview.required && !direction.ownerReview.decision) ctx.addIssue({code:'custom',message:'Significant direction requiring owner review needs its exact decision reference'});
  }
});
export type CreativeDirection = z.infer<typeof creativeDirectionSchema>;
export const creativeDirectionDraftSchema = creativeDirectionSchema.refine(
  d => d.state === 'proposal' && !d.ownerReview.decision,
  'AI direction remains a proposal and cannot invent an owner decision',
);
