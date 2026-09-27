import type {PromptWorkflow} from '../ai/provider';
import type {ContentAsset} from '../content-assets/schema';
import type {KnowledgePackage} from '../knowledge/schema';
import type {
  TopicCandidate,
  TopicEvaluationDraft,
} from './schema';

const evidenceRules = [
  'Never invent a source, locator, quotation, statistic, or claim.',
  'Treat every model-proposed source as an unreviewed lead until a human retrieves it.',
  'Treat every model-generated claim as unverified; generation is not verification.',
  'Represent conflicts, uncertainty, scope, and missing evidence explicitly.',
] as const;

const jsonInput = (value: unknown) => `INPUT_JSON\n${JSON.stringify(value, null, 2)}`;

export const topicEvaluationWorkflow: PromptWorkflow<TopicCandidate> = {
  id: 'workflow.topic-evaluation',
  version: 1,
  outputSchemaId: 'schema.topic-evaluation.v1',
  systemInstructions: [
    'Evaluate editorial opportunity for Magnivis without pretending to predict virality.',
    'Use categorical assessments with rationale and uncertainty, not a fake aggregate score.',
    'Magnivis discovers first and classifies second; taxonomy does not authorize a topic.',
    ...evidenceRules,
  ],
  buildUserPrompt: (candidate) => jsonInput(candidate),
};

export const researchWorkspaceWorkflow: PromptWorkflow<{
  candidate: TopicCandidate;
  evaluation: TopicEvaluationDraft;
}> = {
  id: 'workflow.research-workspace',
  version: 1,
  outputSchemaId: 'schema.research-workspace.v1',
  systemInstructions: [
    'Create a research workspace, not a finished KnowledgePackage.',
    'Separate source leads from claim candidates and link every claim to evidence leads.',
    ...evidenceRules,
    'Every source lead must have reviewStatus unreviewed.',
    'Every claim must have verificationStatus unverified and no review metadata.',
  ],
  buildUserPrompt: (input) => jsonInput(input),
};

export const hookProposalWorkflow: PromptWorkflow<KnowledgePackage> = {
  id: 'workflow.hook-generation',
  version: 1,
  outputSchemaId: 'schema.hook-proposals.v1',
  systemInstructions: [
    'Propose genuinely different hook strategies, not superficial sentence rewrites.',
    'Reference only supplied verified claims and preserve every material caveat.',
    'Do not trade factual accuracy for curiosity.',
  ],
  buildUserPrompt: (knowledgePackage) => jsonInput(knowledgePackage),
};

export type ContentAssetDraftRequest = {
  knowledgePackage: KnowledgePackage;
  assetId: string;
  assetType: ContentAsset['assetType'];
  hookId: string;
  selectedClaimIds: string[];
  editorialPurpose: string;
  storyAngle: string;
  durationIntentSeconds: {minimum: number; maximum: number};
};

export const contentAssetDraftWorkflow: PromptWorkflow<ContentAssetDraftRequest> = {
  id: 'workflow.content-asset-drafting',
  version: 1,
  outputSchemaId: 'schema.content-asset.v1',
  systemInstructions: [
    'Draft one platform-neutral ContentAsset from an approved KnowledgePackage.',
    'Use only the selected verified claims. Every material factual script segment must reference its claim IDs.',
    'Editorial connective language must not masquerade as a factual assertion.',
    'Describe visual objectives and narrative beats without frames, pixels, platform UI, or Remotion choreography.',
    'Return editorialStatus draft and omit approval metadata. A model cannot approve its own work.',
  ],
  buildUserPrompt: (request) => jsonInput(request),
};

export const contentIntelligencePromptRegistry = Object.freeze({
  get: (id: string) => {
    const workflows = [
      topicEvaluationWorkflow,
      researchWorkspaceWorkflow,
      hookProposalWorkflow,
      contentAssetDraftWorkflow,
    ];
    const workflow = workflows.find((candidate) => candidate.id === id);
    if (!workflow) throw new Error(`Unknown content-intelligence workflow: ${id}`);
    return workflow;
  },
  list: () => [
    topicEvaluationWorkflow,
    researchWorkspaceWorkflow,
    hookProposalWorkflow,
    contentAssetDraftWorkflow,
  ],
});
