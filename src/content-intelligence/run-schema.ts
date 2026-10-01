import {createHash} from 'node:crypto';
import {z} from 'zod';
import {aiGenerationProvenanceSchema} from '../ai/schema';
import {stableKnowledgeIdSchema} from '../knowledge/schema';
import {contentIntelligencePromptRegistry} from './prompts';

const jsonValueSchema = z.json();

const reviewSchema = z.object({
  status: z.enum(['awaiting-human', 'approved', 'rejected']),
  reviewedBy: z.string().min(1).optional(),
  reviewedAt: z.iso.datetime().optional(),
  notes: z.string().min(1).optional(),
}).strict().superRefine((review, context) => {
  if (review.status !== 'awaiting-human' && (!review.reviewedBy || !review.reviewedAt)) {
    context.addIssue({
      code: 'custom',
      message: `${review.status} workflow runs require reviewer identity and time`,
    });
  }
});

export const workflowRunSchema = z.object({
  schemaVersion: z.literal(1),
  id: stableKnowledgeIdSchema.refine((id) => id.startsWith('run.')),
  revision: z.number().int().positive(),
  stage: z.enum([
    'creative-direction',
    'topic-evaluation',
    'research-workspace',
    'hook-generation-review',
    'content-asset-review-drafting',
  ]),
  topicCandidateId: stableKnowledgeIdSchema,
  knowledgePackageId: stableKnowledgeIdSchema.optional(),
  contentAssetId: stableKnowledgeIdSchema.optional(),
  request: z.object({
    workflowId: stableKnowledgeIdSchema,
    workflowVersion: z.number().int().positive(),
    outputSchemaId: stableKnowledgeIdSchema,
    inputReferences: z.array(stableKnowledgeIdSchema),
    input: jsonValueSchema,
    inputSha256: z.string().regex(/^[a-f0-9]{64}$/),
  }).strict(),
  response: z.object({
    output: jsonValueSchema,
    outputSha256: z.string().regex(/^[a-f0-9]{64}$/),
    validation: z.object({
      status: z.literal('passed'),
      schemaId: stableKnowledgeIdSchema,
      validatedAt: z.iso.datetime(),
    }).strict(),
  }).strict(),
  provenance: aiGenerationProvenanceSchema,
  review: reviewSchema,
  derivedArtifacts: z.array(z.object({
    kind: z.enum(['topic-evaluation', 'research-workspace', 'knowledge-package', 'hook-batch', 'content-asset', 'creative-direction']),
    id: stableKnowledgeIdSchema,
    revision: z.number().int().positive(),
  }).strict()),
}).strict();

export type WorkflowRun = z.infer<typeof workflowRunSchema>;

const normalizeJson = (value: unknown): unknown => {
  if (Array.isArray(value)) return value.map(normalizeJson);
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value)
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([key, child]) => [key, normalizeJson(child)]),
    );
  }
  return value;
};

export const stableJson = (value: unknown, indentation?: number) =>
  JSON.stringify(normalizeJson(value), null, indentation);

export const sha256Json = (value: unknown) => createHash('sha256')
  .update(stableJson(value))
  .digest('hex');

const workflowByStage: Record<WorkflowRun['stage'], string> = {
  'creative-direction': 'workflow.creative-direction',
  'topic-evaluation': 'workflow.topic-evaluation',
  'research-workspace': 'workflow.research-workspace',
  'hook-generation-review': 'workflow.hook-generation-review',
  'content-asset-review-drafting': 'workflow.content-asset-review-drafting',
};

export const validateWorkflowRunEnvelope = (input: unknown) => {
  const run = workflowRunSchema.parse(input);
  if (run.request.workflowId !== workflowByStage[run.stage]) {
    throw new Error(`Workflow stage mismatch: ${run.id}`);
  }
  const workflow = contentIntelligencePromptRegistry.get(run.request.workflowId);
  if (
    workflow.version !== run.request.workflowVersion
    || workflow.outputSchemaId !== run.request.outputSchemaId
    || run.response.validation.schemaId !== run.request.outputSchemaId
  ) {
    throw new Error(`Workflow metadata mismatch: ${run.id}`);
  }
  if (
    run.provenance.workflowId !== run.request.workflowId
    || run.provenance.workflowVersion !== run.request.workflowVersion
    || run.provenance.outputSchemaId !== run.request.outputSchemaId
    || JSON.stringify(run.provenance.inputReferences) !== JSON.stringify(run.request.inputReferences)
  ) {
    throw new Error(`Workflow provenance mismatch: ${run.id}`);
  }
  if (sha256Json(run.request.input) !== run.request.inputSha256) {
    throw new Error(`Workflow input hash mismatch: ${run.id}`);
  }
  if (sha256Json(run.response.output) !== run.response.outputSha256) {
    throw new Error(`Workflow output hash mismatch: ${run.id}`);
  }
  workflow.outputSchema.parse(run.response.output);
  return run;
};
