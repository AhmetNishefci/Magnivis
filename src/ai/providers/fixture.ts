import type {AIProvider, StructuredGenerationRequest} from '../provider';
import type {StructuredGenerationProviderResult} from '../schema';

export class DeterministicFixtureProvider implements AIProvider {
  readonly id = 'fixture';

  constructor(
    private readonly outputs: Readonly<Record<string, unknown>>,
    private readonly generatedAt = '2026-09-27T20:00:00.000Z',
  ) {}

  async generateStructured(
    request: StructuredGenerationRequest,
  ): Promise<StructuredGenerationProviderResult> {
    if (!(request.workflowId in this.outputs)) {
      throw new Error(`Missing fixture output for workflow: ${request.workflowId}`);
    }
    return {
      output: structuredClone(this.outputs[request.workflowId]),
      model: 'deterministic-content-intelligence-v1',
      generatedAt: this.generatedAt,
      usage: {inputTokens: 0, outputTokens: 0, totalTokens: 0},
      cost: {amount: 0, currency: 'USD', estimated: false},
    };
  }
}
