import {z} from 'zod';
import {contentAssetSchema} from '../content-assets/schema';
import {
  claimSchema,
  hookArchetypeSchema,
  sourceTypeSchema,
  stableKnowledgeIdSchema,
  timelinessSchema,
} from '../knowledge/schema';
import {knowledgeTaxonomySchema} from '../knowledge/taxonomy';

const reviewMetadataSchema = z.object({
  reviewedBy: z.string().min(1),
  reviewedAt: z.iso.date(),
  notes: z.string().min(1).optional(),
}).strict();

export const topicCandidateStatusSchema = z.enum([
  'discovered',
  'evaluating',
  'researching',
  'accepted',
  'held',
  'rejected',
  'archived',
]);

export type TopicCandidateStatus = z.infer<typeof topicCandidateStatusSchema>;

const topicCandidateTransitions: Record<TopicCandidateStatus, readonly TopicCandidateStatus[]> = {
  discovered: ['evaluating', 'held', 'rejected', 'archived'],
  evaluating: ['researching', 'held', 'rejected', 'archived'],
  researching: ['accepted', 'held', 'rejected', 'archived'],
  accepted: ['archived'],
  held: ['evaluating', 'researching', 'rejected', 'archived'],
  rejected: ['archived'],
  archived: [],
};

export const assertTopicCandidateTransition = (
  from: TopicCandidateStatus,
  to: TopicCandidateStatus,
) => {
  if (!topicCandidateTransitions[from].includes(to)) {
    throw new Error(`Invalid TopicCandidate transition: ${from} -> ${to}`);
  }
};

export const topicCandidateSchema = z.object({
  id: stableKnowledgeIdSchema.refine((id) => id.startsWith('topic.'), {
    message: 'Topic candidate IDs must use the topic.* namespace',
  }),
  revision: z.number().int().positive(),
  proposedKnowledgePackageId: stableKnowledgeIdSchema,
  title: z.string().min(1),
  centralQuestion: z.string().min(1),
  discovery: z.object({
    kind: z.enum([
      'manual',
      'authoritative-source',
      'audience',
      'analytics',
      'trend',
      'legacy-migration',
    ]),
    recordedAt: z.iso.date(),
    sourceReference: z.string().min(1).optional(),
    notes: z.string().min(1),
  }).strict(),
  taxonomy: knowledgeTaxonomySchema,
  timeliness: timelinessSchema,
  whyInteresting: z.string().min(1),
  audienceRelevance: z.string().min(1),
  noveltyHypothesis: z.string().min(1),
  visualPotential: z.string().min(1),
  narrativePotential: z.string().min(1),
  status: topicCandidateStatusSchema,
  review: reviewMetadataSchema.optional(),
}).strict().superRefine((candidate, context) => {
  if (
    ['accepted', 'held', 'rejected', 'archived'].includes(candidate.status)
    && !candidate.review
  ) {
    context.addIssue({
      code: 'custom',
      path: ['review'],
      message: `${candidate.status} topic candidates require review metadata`,
    });
  }
});

const evaluationRatingSchema = z.enum(['weak', 'mixed', 'strong', 'unknown']);
const evaluationDimensionSchema = z.object({
  rating: evaluationRatingSchema,
  rationale: z.string().min(1),
  uncertainty: z.array(z.string().min(1)).default([]),
}).strict();

const evaluationDimensionsSchema = z.object({
  curiosityGap: evaluationDimensionSchema,
  surprise: evaluationDimensionSchema,
  usefulness: evaluationDimensionSchema,
  visualExplainability: evaluationDimensionSchema,
  narrativePotential: evaluationDimensionSchema,
  factualVerifiability: evaluationDimensionSchema,
  originality: evaluationDimensionSchema,
  brandFit: evaluationDimensionSchema,
  shortFormSuitability: evaluationDimensionSchema,
  longFormExpansion: evaluationDimensionSchema,
}).strict();

export const topicEvaluationDraftSchema = z.object({
  topicCandidateId: stableKnowledgeIdSchema,
  candidateRevision: z.number().int().positive(),
  summary: z.string().min(1),
  dimensions: evaluationDimensionsSchema,
  recommendation: z.enum(['research', 'hold', 'reject']),
  risks: z.array(z.string().min(1)),
  researchQuestions: z.array(z.string().min(1)).min(1),
}).strict();

export const sourceLeadSchema = z.object({
  id: stableKnowledgeIdSchema.refine((id) => id.startsWith('source.'), {
    message: 'Source lead IDs must use the global source.* namespace',
  }),
  organization: z.string().min(1),
  title: z.string().min(1),
  sourceType: sourceTypeSchema,
  url: z.url(),
  published: z.iso.date().optional(),
  notes: z.string().min(1).optional(),
  reviewStatus: z.enum(['unreviewed', 'retrieved', 'rejected']),
}).strict();

export const researchWorkspaceDraftSchema = z.object({
  id: stableKnowledgeIdSchema.refine((id) => id.startsWith('research.'), {
    message: 'Research workspace IDs must use the research.* namespace',
  }),
  revision: z.number().int().positive(),
  topicCandidateId: stableKnowledgeIdSchema,
  proposedKnowledgePackageId: stableKnowledgeIdSchema,
  sourceLeads: z.array(sourceLeadSchema).min(1),
  claimCandidates: z.array(claimSchema).min(1),
  openQuestions: z.array(z.string().min(1)),
  conflictNotes: z.array(z.string().min(1)),
  status: z.literal('draft'),
}).strict().superRefine((workspace, context) => {
  const sourceIds = new Set(workspace.sourceLeads.map(({id}) => id));
  if (sourceIds.size !== workspace.sourceLeads.length) {
    context.addIssue({
      code: 'custom',
      path: ['sourceLeads'],
      message: 'Research source lead IDs must be unique',
    });
  }
  const claimIds = new Set(workspace.claimCandidates.map(({id}) => id));
  if (claimIds.size !== workspace.claimCandidates.length) {
    context.addIssue({
      code: 'custom',
      path: ['claimCandidates'],
      message: 'Research claim candidate IDs must be unique',
    });
  }
  const expectedClaimPrefix = `${workspace.proposedKnowledgePackageId}.claim.`;
  workspace.sourceLeads.forEach((source, index) => {
    if (source.reviewStatus !== 'unreviewed') {
      context.addIssue({
        code: 'custom',
        path: ['sourceLeads', index, 'reviewStatus'],
        message: 'AI-assisted research source leads must begin unreviewed',
      });
    }
  });
  workspace.claimCandidates.forEach((claim, claimIndex) => {
    if (!claim.id.startsWith(expectedClaimPrefix)) {
      context.addIssue({
        code: 'custom',
        path: ['claimCandidates', claimIndex, 'id'],
        message: `Research claims must use the ${expectedClaimPrefix}* namespace`,
      });
    }
    if (claim.verificationStatus !== 'unverified' || claim.review) {
      context.addIssue({
        code: 'custom',
        path: ['claimCandidates', claimIndex, 'verificationStatus'],
        message: 'AI-assisted claim candidates must begin unverified and without review metadata',
      });
    }
    claim.evidence.forEach((evidence, evidenceIndex) => {
      if (!sourceIds.has(evidence.sourceId)) {
        context.addIssue({
          code: 'custom',
          path: ['claimCandidates', claimIndex, 'evidence', evidenceIndex, 'sourceId'],
          message: `Unknown source lead: ${evidence.sourceId}`,
        });
      }
    });
  });
});

export const hookProposalBatchSchema = z.object({
  knowledgePackageId: stableKnowledgeIdSchema,
  packageRevision: z.number().int().positive(),
  proposals: z.array(z.object({
    id: stableKnowledgeIdSchema,
    archetype: hookArchetypeSchema,
    text: z.string().min(1),
    viewerPromise: z.string().min(1),
    claimIds: z.array(stableKnowledgeIdSchema).min(1),
    rationale: z.string().min(1),
  }).strict()).min(2),
}).strict().superRefine((batch, context) => {
  const ids = new Set<string>();
  const archetypes = new Set<string>();
  const expectedPrefix = `${batch.knowledgePackageId}.hook-proposal.`;
  batch.proposals.forEach((proposal, index) => {
    if (!proposal.id.startsWith(expectedPrefix)) {
      context.addIssue({
        code: 'custom',
        path: ['proposals', index, 'id'],
        message: `Hook proposal IDs must use the ${expectedPrefix}* namespace`,
      });
    }
    if (ids.has(proposal.id)) {
      context.addIssue({
        code: 'custom',
        path: ['proposals', index, 'id'],
        message: `Duplicate hook proposal ID: ${proposal.id}`,
      });
    }
    if (archetypes.has(proposal.archetype)) {
      context.addIssue({
        code: 'custom',
        path: ['proposals', index, 'archetype'],
        message: `Hook proposals must use genuinely different archetypes: ${proposal.archetype}`,
      });
    }
    ids.add(proposal.id);
    archetypes.add(proposal.archetype);
  });
});

export const contentAssetDraftOutputSchema = contentAssetSchema.refine(
  ({editorialStatus, approval}) => editorialStatus === 'draft' && !approval,
  'AI-assisted ContentAsset output must remain an unapproved draft',
);

export type TopicCandidate = z.infer<typeof topicCandidateSchema>;
export type TopicEvaluationDraft = z.infer<typeof topicEvaluationDraftSchema>;
export type ResearchWorkspaceDraft = z.infer<typeof researchWorkspaceDraftSchema>;
export type HookProposalBatch = z.infer<typeof hookProposalBatchSchema>;
