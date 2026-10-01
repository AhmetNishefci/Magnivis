import {z} from 'zod';

const workflowModelConfigSchema = z.object({
  model: z.string().min(1),
  reasoningEffort: z.enum(['none', 'low', 'medium', 'high', 'xhigh']),
  maxOutputTokens: z.number().int().positive(),
  pricing: z.object({
    inputUsdPerMillionTokens: z.number().nonnegative(),
    outputUsdPerMillionTokens: z.number().nonnegative(),
    reviewedAt: z.iso.date(),
  }).strict().optional(),
}).strict();

export type WorkflowModelConfig = z.infer<typeof workflowModelConfigSchema>;

const defaultOpenAIModel = 'gpt-5.4-mini';

export const openAIWorkflowModelConfig = Object.freeze({
  'workflow.creative-direction': workflowModelConfigSchema.parse({
    model: defaultOpenAIModel, reasoningEffort: 'medium', maxOutputTokens: 6000,
  }),
  'workflow.topic-evaluation': workflowModelConfigSchema.parse({
    model: defaultOpenAIModel,
    reasoningEffort: 'low',
    maxOutputTokens: 3000,
    pricing: {
      inputUsdPerMillionTokens: 0.75,
      outputUsdPerMillionTokens: 4.5,
      reviewedAt: '2026-09-27',
    },
  }),
  'workflow.research-workspace': workflowModelConfigSchema.parse({
    model: defaultOpenAIModel,
    reasoningEffort: 'medium',
    maxOutputTokens: 6000,
    pricing: {
      inputUsdPerMillionTokens: 0.75,
      outputUsdPerMillionTokens: 4.5,
      reviewedAt: '2026-09-27',
    },
  }),
  'workflow.hook-generation': workflowModelConfigSchema.parse({
    model: defaultOpenAIModel,
    reasoningEffort: 'low',
    maxOutputTokens: 3000,
    pricing: {
      inputUsdPerMillionTokens: 0.75,
      outputUsdPerMillionTokens: 4.5,
      reviewedAt: '2026-09-27',
    },
  }),
  'workflow.hook-generation-review': workflowModelConfigSchema.parse({
    model: defaultOpenAIModel,
    reasoningEffort: 'low',
    maxOutputTokens: 3000,
    pricing: {
      inputUsdPerMillionTokens: 0.75,
      outputUsdPerMillionTokens: 4.5,
      reviewedAt: '2026-09-27',
    },
  }),
  'workflow.content-asset-drafting': workflowModelConfigSchema.parse({
    model: defaultOpenAIModel,
    reasoningEffort: 'medium',
    maxOutputTokens: 7000,
    pricing: {
      inputUsdPerMillionTokens: 0.75,
      outputUsdPerMillionTokens: 4.5,
      reviewedAt: '2026-09-27',
    },
  }),
  'workflow.content-asset-review-drafting': workflowModelConfigSchema.parse({
    model: defaultOpenAIModel,
    reasoningEffort: 'medium',
    maxOutputTokens: 7000,
    pricing: {
      inputUsdPerMillionTokens: 0.75,
      outputUsdPerMillionTokens: 4.5,
      reviewedAt: '2026-09-27',
    },
  }),
} satisfies Record<string, WorkflowModelConfig>);

export type OpenAIWorkflowId = keyof typeof openAIWorkflowModelConfig;

export const resolveOpenAIWorkflowModel = (
  workflowId: string,
  environment: NodeJS.ProcessEnv = process.env,
): WorkflowModelConfig => {
  const base = openAIWorkflowModelConfig[workflowId as OpenAIWorkflowId];
  if (!base) throw new Error(`No OpenAI model configuration for workflow: ${workflowId}`);
  const override = environment.OPENAI_MODEL?.trim();
  return override ? {...base, model: override} : base;
};
