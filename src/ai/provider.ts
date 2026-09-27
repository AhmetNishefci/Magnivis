import type {ZodType} from 'zod';
import {
  aiGenerationProvenanceSchema,
  type AIGenerationProvenance,
  type StructuredGenerationProviderResult,
} from './schema';

export type PromptWorkflow<Input, Output = unknown> = {
  id: string;
  version: number;
  outputSchemaId: string;
  outputSchema: ZodType<Output>;
  systemInstructions: readonly string[];
  buildUserPrompt: (input: Input) => string;
};

export type StructuredGenerationRequest = {
  workflowId: string;
  workflowVersion: number;
  outputSchemaId: string;
  outputSchema: ZodType;
  systemInstructions: readonly string[];
  userPrompt: string;
};

export interface AIProvider {
  readonly id: string;
  generateStructured(request: StructuredGenerationRequest): Promise<StructuredGenerationProviderResult>;
}

export type GeneratedArtifact<Output> = {
  artifact: Output;
  provenance: AIGenerationProvenance;
};

export const generateStructured = async <Input, Output>({
  provider,
  workflow,
  input,
  inputReferences,
  schema,
}: {
  provider: AIProvider;
  workflow: PromptWorkflow<Input, Output>;
  input: Input;
  inputReferences: readonly string[];
  schema: ZodType<Output>;
}): Promise<GeneratedArtifact<Output>> => {
  const result = await provider.generateStructured({
    workflowId: workflow.id,
    workflowVersion: workflow.version,
    outputSchemaId: workflow.outputSchemaId,
    outputSchema: schema,
    systemInstructions: workflow.systemInstructions,
    userPrompt: workflow.buildUserPrompt(input),
  });
  const artifact = schema.parse(result.output);
  const provenance = aiGenerationProvenanceSchema.parse({
    provider: provider.id,
    model: result.model,
    ...(result.providerResponseId ? {providerResponseId: result.providerResponseId} : {}),
    generatedAt: result.generatedAt,
    workflowId: workflow.id,
    workflowVersion: workflow.version,
    outputSchemaId: workflow.outputSchemaId,
    inputReferences: [...inputReferences],
    ...(result.usage ? {usage: result.usage} : {}),
    ...(result.cost ? {cost: result.cost} : {}),
  });
  return {artifact, provenance};
};
