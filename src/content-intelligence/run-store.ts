import {mkdirSync, readFileSync, writeFileSync} from 'node:fs';
import {dirname} from 'node:path';
import type {GeneratedArtifact, PromptWorkflow} from '../ai/provider';
import type {TopicCandidate} from './schema';
import {
  sha256Json,
  stableJson,
  validateWorkflowRunEnvelope,
  type WorkflowRun,
} from './run-schema';

export const createWorkflowRun = <Input, Output>({
  id,
  stage,
  candidate,
  workflow,
  input,
  inputReferences,
  generated,
  validatedAt,
  knowledgePackageId,
  contentAssetId,
  derivedArtifacts = [],
}: {
  id: string;
  stage: WorkflowRun['stage'];
  candidate: TopicCandidate;
  workflow: PromptWorkflow<Input, Output>;
  input: Input;
  inputReferences: readonly string[];
  generated: GeneratedArtifact<Output>;
  validatedAt: string;
  knowledgePackageId?: string;
  contentAssetId?: string;
  derivedArtifacts?: WorkflowRun['derivedArtifacts'];
}) => validateWorkflowRunEnvelope({
  schemaVersion: 1,
  id,
  revision: 1,
  stage,
  topicCandidateId: candidate.id,
  ...(knowledgePackageId ? {knowledgePackageId} : {}),
  ...(contentAssetId ? {contentAssetId} : {}),
  request: {
    workflowId: workflow.id,
    workflowVersion: workflow.version,
    outputSchemaId: workflow.outputSchemaId,
    inputReferences: [...inputReferences],
    input,
    inputSha256: sha256Json(input),
  },
  response: {
    output: generated.artifact,
    outputSha256: sha256Json(generated.artifact),
    validation: {
      status: 'passed',
      schemaId: workflow.outputSchemaId,
      validatedAt,
    },
  },
  provenance: generated.provenance,
  review: {status: 'awaiting-human'},
  derivedArtifacts,
});

export const writeWorkflowRun = (path: string, run: WorkflowRun) => {
  const validated = validateWorkflowRunEnvelope(run);
  mkdirSync(dirname(path), {recursive: true});
  writeFileSync(path, `${stableJson(validated, 2)}\n`, 'utf8');
};

export const readWorkflowRun = (path: string) => validateWorkflowRunEnvelope(
  JSON.parse(readFileSync(path, 'utf8')),
);
