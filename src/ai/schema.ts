import {z} from 'zod';
import {stableKnowledgeIdSchema} from '../knowledge/schema';

export const aiUsageSchema = z.object({
  inputTokens: z.number().int().nonnegative().optional(),
  outputTokens: z.number().int().nonnegative().optional(),
  totalTokens: z.number().int().nonnegative().optional(),
}).strict();

export const aiCostSchema = z.object({
  amount: z.number().nonnegative(),
  currency: z.string().regex(/^[A-Z]{3}$/),
  estimated: z.boolean(),
}).strict();

export const aiGenerationProvenanceSchema = z.object({
  provider: z.string().min(1),
  model: z.string().min(1),
  providerResponseId: z.string().min(1).optional(),
  generatedAt: z.iso.datetime(),
  workflowId: stableKnowledgeIdSchema,
  workflowVersion: z.number().int().positive(),
  outputSchemaId: stableKnowledgeIdSchema,
  inputReferences: z.array(stableKnowledgeIdSchema),
  usage: aiUsageSchema.optional(),
  cost: aiCostSchema.optional(),
}).strict();

export type AIGenerationProvenance = z.infer<typeof aiGenerationProvenanceSchema>;

export type StructuredGenerationProviderResult = {
  output: unknown;
  model: string;
  providerResponseId?: string;
  generatedAt: string;
  usage?: z.input<typeof aiUsageSchema>;
  cost?: z.input<typeof aiCostSchema>;
};
