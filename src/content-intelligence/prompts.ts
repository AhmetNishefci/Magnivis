import {creativeDirectionWorkflow} from './creative-direction';
import type {PromptWorkflow} from '../ai/provider';
import type {ContentAsset} from '../content-assets/schema';
import type {KnowledgePackage} from '../knowledge/schema';
import type {
  TopicCandidate,
  TopicEvaluationDraft,
  ResearchWorkspaceDraft,
  HookProposalBatch,
} from './schema';
import {
  contentAssetDraftOutputSchema,
  hookProposalBatchSchema,
  researchWorkspaceDraftSchema,
  topicEvaluationDraftSchema,
} from './schema';

const evidenceRules = [
  'Never invent a source, locator, quotation, statistic, or claim.',
  'Treat every model-proposed source as an unreviewed lead until a human retrieves it.',
  'Treat every model-generated claim as unverified; generation is not verification.',
  'Represent conflicts, uncertainty, scope, and missing evidence explicitly.',
] as const;

const jsonInput = (value: unknown) => `INPUT_JSON\n${JSON.stringify(value, null, 2)}`;

export const topicEvaluationWorkflowV1: PromptWorkflow<TopicCandidate, TopicEvaluationDraft> = {
  id: 'workflow.topic-evaluation',
  version: 1,
  outputSchemaId: 'schema.topic-evaluation.v1',
  outputSchema: topicEvaluationDraftSchema,
  systemInstructions: [
    'Evaluate editorial opportunity for Magnivis without pretending to predict virality.',
    'Use categorical assessments with rationale and uncertainty, not a fake aggregate score.',
    'Magnivis discovers first and classifies second; taxonomy does not authorize a topic.',
    ...evidenceRules,
  ],
  buildUserPrompt: (candidate) => jsonInput(candidate),
};

export const topicEvaluationWorkflowV2: typeof topicEvaluationWorkflowV1 = {
  ...topicEvaluationWorkflowV1,
  version: 2,
  systemInstructions: [
    ...topicEvaluationWorkflowV1.systemInstructions.map(rule => rule.replace('until a human retrieves it', 'until actual evidence is retrieved and inspected under V3')),
    'Magnivis builds trust that each appearance is worth watching: an honest compelling premise leads to rigorous understanding.',
    'In curiosityGap rationale ask why a cold viewer with zero domain interest would want the answer. Distinguish premise-led curiosity from interest created only after explaining importance; generally prefer stronger legitimate premise-led opportunities, without banning subtle or abstract subjects.',
    'In narrativePotential consider the story on its own terms: mechanisms, documented events, decisions, discovery, consequences and other defensible forms remain eligible.',
    'Reject misleading viral framing, unsupported superlatives and fake mysteries. A truthful underlying story may remain compelling after reframing; source leads still require inspection.',
    'Shareability is an optional qualitative signal, never a requirement or numerical virality prediction. A merely acceptable fixed pool need not produce a selection.',
    'Domains and owner calibration examples are not a whitelist, preference or candidate bank. Fresh open-world discovery remains necessary; retained leads are reconsiderable, never mandatory queue items.',
    'Only provenance-bearing native metrics may inform cautious story, hook or execution hypotheses with definitions and observation windows preserved; scheduling and qualitative feedback are not analytics. Do not infer a preferred domain from performance.',
  ],
};

// Operational projection of STRATEGY's editorial calibration; old versions remain immutable.
export const topicEvaluationWorkflow: typeof topicEvaluationWorkflowV1 = {
  ...topicEvaluationWorkflowV2,
  version: 3,
  systemInstructions: [
    ...topicEvaluationWorkflowV2.systemInstructions,
    'STRATEGY owns editorial calibration. The subject need not be extraordinary; evaluate the underlying story or question, not domain drama.',
    'In curiosityGap strip away production polish and provocative wording: explain the plain premise and its pre-answer pull. Educational validity, interest and surprise alone do not earn a publishing slot.',
    'In narrativePotential explain post-answer value and assess it together with pre-answer pull: a strong hook with a trivial payoff is insufficient, as is depth without enough cold-audience pull. Production potential alone cannot rescue a weak premise; continued discovery may be appropriate.',
    'Every owner calibration example remains fully eligible, with no avoidance penalty, automatic preference or novelty bonus. Examples are not a finite backlog or training-only topics. Generalize transferable curiosity properties, not semantic similarity; unfamiliar domains and story forms remain eligible.',
    'Extraordinary claims, alleged conspiracies and disputed events remain investigable without a predetermined verdict. Separate evidence of an allegation from evidence for or against it; evidence determines the permitted conclusion, with medical care standards preserved.',
    'Hooks must be truthful independently; later caveats cannot repair a misleading opening. Do not manufacture uncertainty or false balance, promote correlation to causation, or generalize specific misconduct to broad identity groups.',
  ],
};

export const researchWorkspaceWorkflow: PromptWorkflow<{
  candidate: TopicCandidate;
  evaluation: TopicEvaluationDraft;
}, ResearchWorkspaceDraft> = {
  id: 'workflow.research-workspace',
  version: 1,
  outputSchemaId: 'schema.research-workspace.v1',
  outputSchema: researchWorkspaceDraftSchema,
  systemInstructions: [
    'Create a research workspace, not a finished KnowledgePackage.',
    'Separate source leads from claim candidates and link every claim to evidence leads.',
    ...evidenceRules,
    'Every source lead must have reviewStatus unreviewed.',
    'Every claim must have verificationStatus unverified and no review metadata.',
  ],
  buildUserPrompt: (input) => jsonInput(input),
};

export const hookProposalWorkflow: PromptWorkflow<KnowledgePackage, HookProposalBatch> = {
  id: 'workflow.hook-generation',
  version: 1,
  outputSchemaId: 'schema.hook-proposals.v1',
  outputSchema: hookProposalBatchSchema,
  systemInstructions: [
    'Propose genuinely different hook strategies, not superficial sentence rewrites.',
    'Reference only supplied verified claims and preserve every material caveat.',
    'Do not trade factual accuracy for curiosity.',
  ],
  buildUserPrompt: (knowledgePackage) => jsonInput(knowledgePackage),
};

export const hookReviewProposalWorkflow: PromptWorkflow<KnowledgePackage, HookProposalBatch> = {
  id: 'workflow.hook-generation-review',
  version: 1,
  outputSchemaId: 'schema.hook-proposals.v1',
  outputSchema: hookProposalBatchSchema,
  systemInstructions: [
    'Propose genuinely different hook strategies for human editorial review.',
    'Reference only supplied supported or verified claims and preserve every material caveat.',
    'The KnowledgePackage is still under review. Do not imply that a hook or claim has human approval.',
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

export const contentAssetDraftWorkflow: PromptWorkflow<ContentAssetDraftRequest, ContentAsset> = {
  id: 'workflow.content-asset-drafting',
  version: 1,
  outputSchemaId: 'schema.content-asset.v1',
  outputSchema: contentAssetDraftOutputSchema,
  systemInstructions: [
    'Draft one platform-neutral ContentAsset from an approved KnowledgePackage.',
    'Use only the selected verified claims. Every material factual script segment must reference its claim IDs.',
    'Editorial connective language must not masquerade as a factual assertion.',
    'Describe visual objectives and narrative beats without frames, pixels, platform UI, or Remotion choreography.',
    'Return editorialStatus draft and omit approval metadata. A model cannot approve its own work.',
  ],
  buildUserPrompt: (request) => jsonInput(request),
};

export const contentAssetReviewDraftWorkflow: PromptWorkflow<ContentAssetDraftRequest, ContentAsset> = {
  id: 'workflow.content-asset-review-drafting',
  version: 1,
  outputSchemaId: 'schema.content-asset.v1',
  outputSchema: contentAssetDraftOutputSchema,
  systemInstructions: [
    'Draft one platform-neutral ContentAsset for human review from a KnowledgePackage that is still under review.',
    'Use only selected supported or verified claims. Every material factual script segment must reference its claim IDs.',
    'Preserve caveats and do not describe a supported claim as human-verified.',
    'Describe visual objectives and narrative beats without frames, pixels, platform UI, or Remotion choreography.',
    'Return editorialStatus draft and omit approval metadata. A model cannot approve its own work.',
  ],
  buildUserPrompt: (request) => jsonInput(request),
};

const workflows = [
  creativeDirectionWorkflow,
  topicEvaluationWorkflow,
  researchWorkspaceWorkflow,
  hookProposalWorkflow,
  hookReviewProposalWorkflow,
  contentAssetDraftWorkflow,
  contentAssetReviewDraftWorkflow,
] as const;

export const contentIntelligencePromptRegistry = Object.freeze({
  get: (id: string, version?: number) => {
    if (id === topicEvaluationWorkflowV1.id && version === 1) return topicEvaluationWorkflowV1;
    if (id === topicEvaluationWorkflowV2.id && version === 2) return topicEvaluationWorkflowV2;
    const workflow = workflows.find((candidate) => candidate.id === id);
    if (!workflow || (version !== undefined && workflow.version !== version)) throw new Error(`Unknown content-intelligence workflow: ${id}`);
    return workflow;
  },
  list: () => [...workflows],
});
