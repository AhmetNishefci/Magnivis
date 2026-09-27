import OpenAI from 'openai';
import {zodTextFormat} from 'openai/helpers/zod';
import type {AIProvider, StructuredGenerationRequest} from '../provider';
import type {StructuredGenerationProviderResult} from '../schema';
import {resolveOpenAIWorkflowModel} from '../model-config';

type ParsedResponse = {
  id: string;
  model: string;
  created_at: number;
  output_parsed: unknown;
  usage?: {
    input_tokens: number;
    output_tokens: number;
    total_tokens: number;
  } | null;
};

export type OpenAIResponsesClient = {
  parse: (request: unknown) => Promise<ParsedResponse>;
};

export class MissingOpenAICredentialsError extends Error {
  constructor() {
    super('OPENAI_API_KEY is required for the live OpenAI provider');
    this.name = 'MissingOpenAICredentialsError';
  }
}

const schemaName = (outputSchemaId: string) => outputSchemaId.replaceAll('.', '_');

export class OpenAIProvider implements AIProvider {
  readonly id = 'openai';

  constructor(
    private readonly responses: OpenAIResponsesClient,
    private readonly environment: NodeJS.ProcessEnv = process.env,
  ) {}

  async generateStructured(
    request: StructuredGenerationRequest,
  ): Promise<StructuredGenerationProviderResult> {
    const config = resolveOpenAIWorkflowModel(request.workflowId, this.environment);
    const response = await this.responses.parse({
      model: config.model,
      instructions: request.systemInstructions.join('\n'),
      input: request.userPrompt,
      max_output_tokens: config.maxOutputTokens,
      reasoning: {effort: config.reasoningEffort},
      store: false,
      text: {
        format: zodTextFormat(request.outputSchema, schemaName(request.outputSchemaId)),
      },
    });
    if (response.output_parsed === null || response.output_parsed === undefined) {
      throw new Error(`OpenAI returned no parsed output for ${request.workflowId}`);
    }
    const usage = response.usage ? {
      inputTokens: response.usage.input_tokens,
      outputTokens: response.usage.output_tokens,
      totalTokens: response.usage.total_tokens,
    } : undefined;
    const cost = usage && config.pricing ? {
      amount: (
        usage.inputTokens * config.pricing.inputUsdPerMillionTokens
        + usage.outputTokens * config.pricing.outputUsdPerMillionTokens
      ) / 1_000_000,
      currency: 'USD',
      estimated: true,
    } : undefined;
    return {
      output: response.output_parsed,
      model: response.model || config.model,
      providerResponseId: response.id,
      generatedAt: new Date(response.created_at * 1000).toISOString(),
      ...(usage ? {usage} : {}),
      ...(cost ? {cost} : {}),
    };
  }
}

export const createOpenAIProviderFromEnvironment = (
  environment: NodeJS.ProcessEnv = process.env,
) => {
  const apiKey = environment.OPENAI_API_KEY?.trim();
  if (!apiKey) throw new MissingOpenAICredentialsError();
  const client = new OpenAI({apiKey});
  return new OpenAIProvider(client.responses as unknown as OpenAIResponsesClient, environment);
};
