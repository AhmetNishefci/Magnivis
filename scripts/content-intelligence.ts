import {existsSync, readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import type {AIProvider} from '../src/ai/provider';
import {createOpenAIProviderFromEnvironment} from '../src/ai/providers/openai';
import {createContentAssetRegistry} from '../src/content-assets/registry';
import {contentAssetSchema} from '../src/content-assets/schema';
import {woodFrogFreezeTopicCandidate} from '../src/content-intelligence/candidates/wood-frog-freeze';
import {
  contentAssetReviewDraftWorkflow,
  hookReviewProposalWorkflow,
  researchWorkspaceWorkflow,
  topicEvaluationWorkflow,
} from '../src/content-intelligence/prompts';
import {readWorkflowRun, createWorkflowRun, writeWorkflowRun} from '../src/content-intelligence/run-store';
import {topicEvaluationDraftSchema} from '../src/content-intelligence/schema';
import {
  createWoodFrogFixtureProvider,
  validateWoodFrogTrialArtifacts,
  woodFrogAssetDraftRequest,
  woodFrogTrialRunFilenames,
  writeWoodFrogTrialArtifacts,
} from '../src/content-intelligence/trials/wood-frog-freeze';
import {
  draftContentAssetForReview,
  draftResearchWorkspace,
  evaluateTopicCandidate,
  proposeHooksForReview,
} from '../src/content-intelligence/workflow';
import {knowledgePackageSchema} from '../src/knowledge/schema';
import {createKnowledgePackageRegistry} from '../src/knowledge/registry';
import {woodFrogFreezeKnowledgePackage} from '../src/knowledge/packages/wood-frog-freeze-tolerance';

type Stage = 'trial' | 'evaluate' | 'research' | 'hooks' | 'asset' | 'validate';
type ProviderName = 'fixture' | 'openai';

const defaultOutput = 'content-intelligence/runs/wood-frog-freeze-fixture-v1';

const optionValue = (args: readonly string[], name: string) => {
  const index = args.indexOf(name);
  return index === -1 ? undefined : args[index + 1];
};

const usage = () => [
  'Usage:',
  '  pnpm content:intelligence -- trial wood-frog-freeze --provider fixture [--output <directory>]',
  '  pnpm content:intelligence -- evaluate wood-frog-freeze --provider openai --output <directory>',
  '  pnpm content:intelligence -- research wood-frog-freeze --provider openai --output <directory> [--input <evaluation-run>]',
  '  pnpm content:intelligence -- hooks wood-frog-freeze --provider openai --output <directory>',
  '  pnpm content:intelligence -- asset wood-frog-freeze --provider openai --output <directory>',
  '  pnpm content:intelligence -- validate wood-frog-freeze [--output <directory>]',
].join('\n');

const providerFor = (
  name: ProviderName,
  environment: NodeJS.ProcessEnv,
): AIProvider => name === 'openai'
  ? createOpenAIProviderFromEnvironment(environment)
  : createWoodFrogFixtureProvider();

const runId = (provider: ProviderName, stage: Exclude<Stage, 'trial' | 'validate'>) =>
  `run.wood-frog-freeze.${provider}.${stage}.v1`;

const parseJsonFile = (path: string) => JSON.parse(readFileSync(path, 'utf8')) as unknown;

export const executeContentIntelligenceCommand = async (
  rawArgs: readonly string[],
  environment: NodeJS.ProcessEnv = process.env,
  log: (message: string) => void = console.log,
) => {
  const args = rawArgs[0] === '--' ? rawArgs.slice(1) : rawArgs;
  const stage = args[0] as Stage | undefined;
  const topic = args[1];
  if (!stage || !['trial', 'evaluate', 'research', 'hooks', 'asset', 'validate'].includes(stage)) {
    throw new Error(usage());
  }
  if (topic !== 'wood-frog-freeze') throw new Error(`Unknown trial topic: ${topic ?? '(missing)'}`);
  const outputDirectory = resolve(optionValue(args, '--output') ?? defaultOutput);
  if (stage === 'validate') {
    const runs = woodFrogTrialRunFilenames.map((filename) =>
      readWorkflowRun(resolve(outputDirectory, filename)));
    validateWoodFrogTrialArtifacts(runs);
    const knowledgePackage = knowledgePackageSchema.parse(
      parseJsonFile(resolve(outputDirectory, 'knowledge-package.review.json')),
    );
    const contentAsset = contentAssetSchema.parse(
      parseJsonFile(resolve(outputDirectory, 'content-asset.draft.json')),
    );
    const packageRegistry = createKnowledgePackageRegistry([knowledgePackage]);
    createContentAssetRegistry([contentAsset], packageRegistry);
    if (!existsSync(resolve(outputDirectory, 'review.md'))) throw new Error('Missing review.md');
    log(`valid content-intelligence trial: ${outputDirectory}`);
    return;
  }

  const providerName = (optionValue(args, '--provider') ?? 'fixture') as ProviderName;
  if (!['fixture', 'openai'].includes(providerName)) throw new Error(`Unsupported provider: ${providerName}`);
  if (stage === 'trial') {
    if (providerName !== 'fixture') {
      throw new Error('The all-stage trial command is fixture-only because live research requires a human verification pause');
    }
    await writeWoodFrogTrialArtifacts(outputDirectory);
    log(`wrote fixture trial: ${outputDirectory}`);
    return;
  }

  const provider = providerFor(providerName, environment);
  const validatedAt = new Date().toISOString();
  if (stage === 'evaluate') {
    const generated = await evaluateTopicCandidate(provider, woodFrogFreezeTopicCandidate);
    writeWorkflowRun(resolve(outputDirectory, woodFrogTrialRunFilenames[0]), createWorkflowRun({
      id: runId(providerName, stage),
      stage: 'topic-evaluation',
      candidate: woodFrogFreezeTopicCandidate,
      workflow: topicEvaluationWorkflow,
      input: woodFrogFreezeTopicCandidate,
      inputReferences: [woodFrogFreezeTopicCandidate.id],
      generated,
      validatedAt,
      derivedArtifacts: [{kind: 'topic-evaluation', id: 'evaluation.wood-frog-freeze.v1', revision: 1}],
    }));
  } else if (stage === 'research') {
    const evaluationPath = resolve(
      optionValue(args, '--input') ?? resolve(outputDirectory, woodFrogTrialRunFilenames[0]),
    );
    const evaluationRun = readWorkflowRun(evaluationPath);
    const evaluation = topicEvaluationDraftSchema.parse(evaluationRun.response.output);
    const generated = await draftResearchWorkspace(provider, woodFrogFreezeTopicCandidate, evaluation);
    writeWorkflowRun(resolve(outputDirectory, woodFrogTrialRunFilenames[1]), createWorkflowRun({
      id: runId(providerName, stage),
      stage: 'research-workspace',
      candidate: woodFrogFreezeTopicCandidate,
      workflow: researchWorkspaceWorkflow,
      input: {candidate: woodFrogFreezeTopicCandidate, evaluation},
      inputReferences: [woodFrogFreezeTopicCandidate.id],
      generated,
      validatedAt,
      knowledgePackageId: woodFrogFreezeKnowledgePackage.id,
      derivedArtifacts: [{kind: 'research-workspace', id: generated.artifact.id, revision: generated.artifact.revision}],
    }));
  } else if (stage === 'hooks') {
    const generated = await proposeHooksForReview(provider, woodFrogFreezeKnowledgePackage);
    writeWorkflowRun(resolve(outputDirectory, woodFrogTrialRunFilenames[2]), createWorkflowRun({
      id: runId(providerName, stage),
      stage: 'hook-generation-review',
      candidate: woodFrogFreezeTopicCandidate,
      workflow: hookReviewProposalWorkflow,
      input: woodFrogFreezeKnowledgePackage,
      inputReferences: generated.provenance.inputReferences,
      generated,
      validatedAt,
      knowledgePackageId: woodFrogFreezeKnowledgePackage.id,
      derivedArtifacts: [{kind: 'hook-batch', id: 'hook-batch.wood-frog-freeze.v1', revision: 1}],
    }));
  } else {
    const generated = await draftContentAssetForReview(provider, woodFrogAssetDraftRequest);
    writeWorkflowRun(resolve(outputDirectory, woodFrogTrialRunFilenames[3]), createWorkflowRun({
      id: runId(providerName, stage),
      stage: 'content-asset-review-drafting',
      candidate: woodFrogFreezeTopicCandidate,
      workflow: contentAssetReviewDraftWorkflow,
      input: woodFrogAssetDraftRequest,
      inputReferences: generated.provenance.inputReferences,
      generated,
      validatedAt,
      knowledgePackageId: woodFrogFreezeKnowledgePackage.id,
      contentAssetId: generated.artifact.id,
      derivedArtifacts: [{kind: 'content-asset', id: generated.artifact.id, revision: generated.artifact.revision}],
    }));
  }
  log(`wrote ${stage} workflow run: ${outputDirectory}`);
};

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  executeContentIntelligenceCommand(process.argv.slice(2)).catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  });
}
