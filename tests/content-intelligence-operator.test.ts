import {readFileSync, readdirSync, rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {describe, expect, it} from 'vitest';
import {executeContentIntelligenceCommand} from '../scripts/content-intelligence';
import {resolveOpenAIWorkflowModel} from '../src/ai/model-config';
import {
  createOpenAIProviderFromEnvironment,
  MissingOpenAICredentialsError,
  OpenAIProvider,
  type OpenAIResponsesClient,
} from '../src/ai/providers/openai';
import {createContentAssetRegistry} from '../src/content-assets/registry';
import {contentAssetSchema} from '../src/content-assets/schema';
import {woodFrogFreezeDraftAsset} from '../src/content-assets/assets/wood-frog-freeze';
import {createWorkflowRun, readWorkflowRun, writeWorkflowRun} from '../src/content-intelligence/run-store';
import {
  sha256Json,
  validateWorkflowRunEnvelope,
} from '../src/content-intelligence/run-schema';
import {
  createWoodFrogFixtureProvider,
  runWoodFrogFixtureTrial,
  woodFrogAssetDraftRequest,
  woodFrogTopicEvaluation,
  woodFrogTrialRunFilenames,
} from '../src/content-intelligence/trials/wood-frog-freeze';
import {
  draftContentAssetForReview,
  evaluateTopicCandidate,
  proposeHooks,
  proposeHooksForReview,
} from '../src/content-intelligence/workflow';
import {woodFrogFreezeTopicCandidate} from '../src/content-intelligence/candidates/wood-frog-freeze';
import {topicEvaluationWorkflow} from '../src/content-intelligence/prompts';
import {createKnowledgePackageRegistry} from '../src/knowledge/registry';
import {
  woodFrogFreezeClaimIds,
  woodFrogFreezeKnowledgePackage,
} from '../src/knowledge/packages/wood-frog-freeze-tolerance';
import {HttpSourceRetriever} from '../src/research/source-retriever';

const temporaryDirectory = (name: string) => join(
  tmpdir(),
  `magnivis-${name}-${process.pid}-${Math.random().toString(16).slice(2)}`,
);

describe('OpenAI provider boundary and model configuration', () => {
  it('fails clearly without credentials and never invents a key', () => {
    expect(() => createOpenAIProviderFromEnvironment({})).toThrow(MissingOpenAICredentialsError);
  });

  it('uses Responses structured parsing, records provenance and estimates cost', async () => {
    let request: Record<string, unknown> | undefined;
    const client: OpenAIResponsesClient = {
      parse: async (input) => {
        request = input as Record<string, unknown>;
        return {
          id: 'resp_fixture_1',
          model: 'gpt-5.4-mini-2026-03-17',
          created_at: 1_799_900_000,
          output_parsed: woodFrogTopicEvaluation,
          usage: {input_tokens: 1000, output_tokens: 500, total_tokens: 1500},
        };
      },
    };
    const provider = new OpenAIProvider(client, {});
    const result = await evaluateTopicCandidate(provider, woodFrogFreezeTopicCandidate);

    expect(request).toMatchObject({
      model: 'gpt-5.4-mini',
      store: false,
      reasoning: {effort: 'low'},
    });
    expect(request?.text).toHaveProperty('format');
    expect(result.provenance).toMatchObject({
      provider: 'openai',
      providerResponseId: 'resp_fixture_1',
      model: 'gpt-5.4-mini-2026-03-17',
      usage: {inputTokens: 1000, outputTokens: 500, totalTokens: 1500},
      cost: {amount: 0.003, currency: 'USD', estimated: true},
    });
  });

  it('keeps workflow model choice explicit and supports one environment override', () => {
    expect(resolveOpenAIWorkflowModel('workflow.research-workspace', {}).model)
      .toBe('gpt-5.4-mini');
    expect(resolveOpenAIWorkflowModel('workflow.research-workspace', {OPENAI_MODEL: 'gpt-test'}).model)
      .toBe('gpt-test');
    expect(() => resolveOpenAIWorkflowModel('workflow.unknown', {})).toThrow(/No OpenAI model/);
  });
});

describe('source retrieval provenance', () => {
  it('normalizes a real-shaped HTTP document while hashing the full response', async () => {
    const raw = '<html><head><title>Wood Frog Study</title></head><body><script>ignore()</script><p>Ice &amp; glucose.</p></body></html>';
    const fetchImplementation = (async () => new Response(raw, {
      status: 200,
      headers: {'content-type': 'text/html; charset=utf-8'},
    })) as typeof fetch;
    const retriever = new HttpSourceRetriever(
      fetchImplementation,
      () => new Date('2026-09-27T20:30:00.000Z'),
    );
    const result = await retriever.retrieve({
      sourceId: 'source.example.wood-frog',
      url: 'https://example.org/wood-frog',
    });

    expect(result).toMatchObject({
      sourceId: 'source.example.wood-frog',
      title: 'Wood Frog Study',
      retrievedAt: '2026-09-27T20:30:00.000Z',
      statusCode: 200,
      normalizedText: 'Wood Frog Study Ice & glucose.',
      truncated: false,
    });
    expect(result.contentSha256).toMatch(/^[a-f0-9]{64}$/);
  });

  it('rejects non-text evidence instead of pretending it was inspected', async () => {
    const fetchImplementation = (async () => new Response('binary', {
      status: 200,
      headers: {'content-type': 'application/pdf'},
    })) as typeof fetch;
    const retriever = new HttpSourceRetriever(fetchImplementation);
    await expect(retriever.retrieve({
      sourceId: 'source.example.pdf',
      url: 'https://example.org/paper.pdf',
    })).rejects.toThrow(/Unsupported source content type/);
  });
});

describe('workflow-run persistence and review trust boundaries', () => {
  it('round-trips a validated run with deterministic hashes', async () => {
    const generated = await evaluateTopicCandidate(
      createWoodFrogFixtureProvider(),
      woodFrogFreezeTopicCandidate,
    );
    const run = createWorkflowRun({
      id: 'run.wood-frog-freeze.test.topic-evaluation.v1',
      stage: 'topic-evaluation',
      candidate: woodFrogFreezeTopicCandidate,
      workflow: topicEvaluationWorkflow,
      input: woodFrogFreezeTopicCandidate,
      inputReferences: [woodFrogFreezeTopicCandidate.id],
      generated,
      validatedAt: '2026-09-27T20:30:00.000Z',
    });
    const directory = temporaryDirectory('workflow-run');
    const path = join(directory, 'run.json');
    try {
      writeWorkflowRun(path, run);
      expect(readWorkflowRun(path)).toEqual(run);
      expect(readFileSync(path, 'utf8')).toBe(`${JSON.stringify(JSON.parse(readFileSync(path, 'utf8')), null, 2)}\n`);
    } finally {
      rmSync(directory, {recursive: true, force: true});
    }
  });

  it('rejects tampering, provenance drift and schema-invalid persisted output', async () => {
    const {runs} = await runWoodFrogFixtureTrial();
    const tampered = structuredClone(runs[0]!);
    (tampered.response.output as {summary: string}).summary = 'tampered';
    expect(() => validateWorkflowRunEnvelope(tampered)).toThrow(/output hash mismatch/);

    const provenanceDrift = structuredClone(runs[0]!);
    provenanceDrift.provenance.workflowVersion = 99;
    expect(() => validateWorkflowRunEnvelope(provenanceDrift)).toThrow(/provenance mismatch/);

    const stageDrift = structuredClone(runs[0]!);
    stageDrift.stage = 'research-workspace';
    expect(() => validateWorkflowRunEnvelope(stageDrift)).toThrow(/stage mismatch/);

    const invalidOutput = structuredClone(runs[0]!);
    delete (invalidOutput.response.output as {summary?: string}).summary;
    invalidOutput.response.outputSha256 = sha256Json(invalidOutput.response.output);
    expect(() => validateWorkflowRunEnvelope(invalidOutput)).toThrow();
  });

  it('requires real reviewer metadata before a run can be approved', async () => {
    const {runs} = await runWoodFrogFixtureTrial();
    const fakeApproval = structuredClone(runs[0]!);
    fakeApproval.review = {status: 'approved'};
    expect(() => validateWorkflowRunEnvelope(fakeApproval)).toThrow(/reviewer identity and time/);
  });

  it('allows supported evidence only in review drafts, never the strict production path', async () => {
    const provider = createWoodFrogFixtureProvider();
    const hooks = await proposeHooksForReview(provider, woodFrogFreezeKnowledgePackage);
    const asset = await draftContentAssetForReview(provider, woodFrogAssetDraftRequest);
    expect(hooks.artifact.proposals).toHaveLength(4);
    expect(asset.artifact.editorialStatus).toBe('draft');
    expect(() => proposeHooks(provider, woodFrogFreezeKnowledgePackage)).toThrow(/must be approved/);

    const unverified = structuredClone(woodFrogFreezeKnowledgePackage);
    unverified.claims[0]!.verificationStatus = 'unverified';
    await expect(proposeHooksForReview(provider, unverified)).rejects.toThrow(/unsupported claim/);
  });

  it('rejects unsupported script and visual-plan claim references', () => {
    const packageRegistry = createKnowledgePackageRegistry([woodFrogFreezeKnowledgePackage]);
    const unsupportedScript = structuredClone(woodFrogFreezeDraftAsset);
    const firstSegment = unsupportedScript.script.segments[0]!;
    if (firstSegment.type !== 'factual') throw new Error('Expected factual fixture segment');
    firstSegment.claimIds = [woodFrogFreezeClaimIds.alaskaTemperature];
    expect(() => createContentAssetRegistry([unsupportedScript], packageRegistry))
      .toThrow(/unselected/);

    const unsupportedVisual = structuredClone(woodFrogFreezeDraftAsset);
    unsupportedVisual.visualPlan[0]!.claimIds = ['wood-frog-freeze-tolerance.claim.unknown'];
    expect(() => createContentAssetRegistry([unsupportedVisual], packageRegistry))
      .toThrow(/unselected claim/);
  });

  it('rejects visual timing beyond the platform-neutral duration intent', () => {
    const invalid = structuredClone(woodFrogFreezeDraftAsset);
    invalid.visualPlan[0]!.timingIntentSeconds = {start: 0, end: 41};
    expect(contentAssetSchema.safeParse(invalid).success).toBe(false);
  });
});

describe('operator command', () => {
  it('writes and validates a deterministic, human-readable fixture trial', async () => {
    const first = temporaryDirectory('operator-first');
    const second = temporaryDirectory('operator-second');
    try {
      await executeContentIntelligenceCommand([
        'trial', 'wood-frog-freeze', '--provider', 'fixture', '--output', first,
      ], {}, () => undefined);
      await executeContentIntelligenceCommand([
        'trial', 'wood-frog-freeze', '--provider', 'fixture', '--output', second,
      ], {}, () => undefined);
      await executeContentIntelligenceCommand([
        'validate', 'wood-frog-freeze', '--output', first,
      ], {}, () => undefined);

      const filenames = readdirSync(first).sort();
      expect(filenames).toEqual([
        ...woodFrogTrialRunFilenames,
        'content-asset.draft.json',
        'knowledge-package.review.json',
        'review.md',
      ].sort());
      for (const filename of filenames) {
        expect(readFileSync(join(first, filename), 'utf8'))
          .toBe(readFileSync(join(second, filename), 'utf8'));
      }
      expect(readFileSync(join(first, 'review.md'), 'utf8')).toContain('## Human approval required');
    } finally {
      rmSync(first, {recursive: true, force: true});
      rmSync(second, {recursive: true, force: true});
    }
  });

  it('does not run a live all-stage workflow across the human verification pause', async () => {
    await expect(executeContentIntelligenceCommand([
      'trial', 'wood-frog-freeze', '--provider', 'openai', '--output', temporaryDirectory('blocked'),
    ], {OPENAI_API_KEY: 'not-used'}, () => undefined)).rejects.toThrow(/human verification pause/);
  });
});
