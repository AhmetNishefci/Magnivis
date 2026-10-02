import {describe, expect, it} from 'vitest';
import type {AIProvider, StructuredGenerationRequest} from '../src/ai/provider';
import type {StructuredGenerationProviderResult} from '../src/ai/schema';
import {
  speedOfLightContentAssetIds,
  speedOfLightCosmicDistanceAsset,
} from '../src/content-assets/assets/speed-of-light';
import {speedOfLightTopicCandidate} from '../src/content-intelligence/candidates/speed-of-light';
import {woodFrogFreezeTopicCandidate} from '../src/content-intelligence/candidates/wood-frog-freeze';
import {
  contentIntelligencePromptRegistry,
  contentAssetDraftWorkflow,
} from '../src/content-intelligence/prompts';
import {createTopicCandidateRegistry, topicCandidateRegistry} from '../src/content-intelligence/registry';
import {
  assertTopicCandidateTransition,
  researchWorkspaceDraftSchema,
  topicCandidateSchema,
  type TopicEvaluationDraft,
} from '../src/content-intelligence/schema';
import {
  draftContentAsset,
  draftResearchWorkspace,
  evaluateTopicCandidate,
  proposeHooks,
} from '../src/content-intelligence/workflow';
import {
  speedOfLightClaimIds,
  speedOfLightHookIds,
  speedOfLightKnowledgePackage,
} from '../src/knowledge/packages/speed-of-light';

const evaluation: TopicEvaluationDraft = {
  topicCandidateId: speedOfLightTopicCandidate.id,
  candidateRevision: speedOfLightTopicCandidate.revision,
  summary: 'A strong visual contradiction with authoritative sources and reusable depth.',
  dimensions: {
    curiosityGap: {rating: 'strong', rationale: 'Fast light still feels slow across space.', uncertainty: []},
    surprise: {rating: 'strong', rationale: 'The scale reversal is counterintuitive.', uncertainty: []},
    usefulness: {rating: 'strong', rationale: 'It builds an accurate mental model.', uncertainty: []},
    visualExplainability: {rating: 'strong', rationale: 'Distance ladders can show the idea.', uncertainty: []},
    narrativePotential: {rating: 'strong', rationale: 'The references escalate naturally.', uncertainty: []},
    factualVerifiability: {rating: 'strong', rationale: 'NIST and NASA sources are available.', uncertainty: []},
    originality: {rating: 'mixed', rationale: 'The fact is known, but the visual ladder can be distinct.', uncertainty: ['Saturation requires current review.']},
    brandFit: {rating: 'strong', rationale: 'It turns abstraction into understanding.', uncertainty: []},
    shortFormSuitability: {rating: 'strong', rationale: 'One central contrast fits a short.', uncertainty: []},
    longFormExpansion: {rating: 'strong', rationale: 'Relativity and cosmic distance offer depth.', uncertainty: []},
  },
  recommendation: 'research',
  risks: ['Avoid implying the diagrams are spatially proportional.'],
  researchQuestions: ['Which reference distances are both authoritative and intuitive?'],
};

const unverifiedVacuumClaim = (() => {
  const claim = structuredClone(speedOfLightKnowledgePackage.claims.find(
    ({id}) => id === speedOfLightClaimIds.vacuumSpeed,
  ));
  if (!claim) throw new Error('Missing fixture claim');
  claim.verificationStatus = 'unverified';
  delete claim.review;
  return claim;
})();

const nistSource = speedOfLightKnowledgePackage.sources[0]!;

const researchWorkspace = {
  id: 'research.speed-of-light',
  revision: 1,
  topicCandidateId: speedOfLightTopicCandidate.id,
  proposedKnowledgePackageId: speedOfLightKnowledgePackage.id,
  sourceLeads: [{
    id: nistSource.id,
    organization: nistSource.organization,
    title: nistSource.title,
    sourceType: nistSource.sourceType,
    url: nistSource.url,
    ...(nistSource.published ? {published: nistSource.published} : {}),
    ...(nistSource.notes ? {notes: nistSource.notes} : {}),
    reviewStatus: 'unreviewed' as const,
  }],
  claimCandidates: [unverifiedVacuumClaim],
  openQuestions: ['Which comparisons should be derived from the exact SI value?'],
  conflictNotes: [],
  status: 'draft' as const,
};

class FixtureProvider implements AIProvider {
  readonly id = 'fixture';
  readonly requests: StructuredGenerationRequest[] = [];

  constructor(private readonly outputs: Record<string, unknown>) {}

  async generateStructured(request: StructuredGenerationRequest): Promise<StructuredGenerationProviderResult> {
    this.requests.push(request);
    return {
      output: structuredClone(this.outputs[request.workflowId]),
      model: 'fixture-v1',
      generatedAt: '2026-09-27T18:00:00.000Z',
      usage: {inputTokens: 10, outputTokens: 20, totalTokens: 30},
      cost: {amount: 0, currency: 'USD', estimated: false},
    };
  }
}

describe('Content Intelligence V1 topic candidates and prompts', () => {
  it('registers the retrospective Speed of Light candidate deterministically', () => {
    expect(topicCandidateRegistry.list()).toEqual([
      speedOfLightTopicCandidate,
      woodFrogFreezeTopicCandidate,
    ]);
    expect(topicCandidateRegistry.get(speedOfLightTopicCandidate.id))
      .toEqual(speedOfLightTopicCandidate);
  });

  it('keeps domains open-ended and requires review for accepted candidates', () => {
    const philosophyCandidate = structuredClone(speedOfLightTopicCandidate);
    philosophyCandidate.id = 'topic.trolley-problem';
    philosophyCandidate.proposedKnowledgePackageId = 'trolley-problem';
    philosophyCandidate.status = 'discovered';
    delete philosophyCandidate.review;
    philosophyCandidate.taxonomy = {
      pillar: 'society-culture',
      domains: ['philosophy', 'ethics'],
      topics: ['trolley-problem'],
    };
    expect(topicCandidateSchema.parse(philosophyCandidate).taxonomy.domains)
      .toEqual(['philosophy', 'ethics']);

    philosophyCandidate.status = 'accepted';
    expect(topicCandidateSchema.safeParse(philosophyCandidate).success).toBe(false);
  });

  it('rejects duplicate candidate and proposed package identities', () => {
    expect(() => createTopicCandidateRegistry([
      speedOfLightTopicCandidate,
      structuredClone(speedOfLightTopicCandidate),
    ])).toThrow(/Duplicate topic candidate ID/);
  });

  it('enforces deliberate topic workflow transitions', () => {
    expect(() => assertTopicCandidateTransition('discovered', 'evaluating')).not.toThrow();
    expect(() => assertTopicCandidateTransition('evaluating', 'accepted'))
      .toThrow(/Invalid TopicCandidate transition/);
    expect(() => assertTopicCandidateTransition('accepted', 'researching'))
      .toThrow(/Invalid TopicCandidate transition/);
  });

  it('keeps prompts versioned, discoverable and explicit about trust boundaries', () => {
    const workflows = contentIntelligencePromptRegistry.list();
    expect(workflows.map(({id}) => id)).toEqual([
      'workflow.creative-direction',
      'workflow.topic-evaluation',
      'workflow.research-workspace',
      'workflow.hook-generation',
      'workflow.hook-generation-review',
      'workflow.content-asset-drafting',
      'workflow.content-asset-review-drafting',
    ]);
    expect(new Set(workflows.map(({id}) => id)).size).toBe(workflows.length);
    expect(workflows.every(({id, version, outputSchemaId}) =>
      version === (id === 'workflow.creative-direction' ? 3 : id === 'workflow.topic-evaluation' ? 2 : 1) && outputSchemaId.endsWith('.v1'))).toBe(true);
    expect(contentAssetDraftWorkflow.systemInstructions.join(' ')).toMatch(/cannot approve/i);
  });
});

describe('Content Intelligence V1 AI-assisted workflow', () => {
  it('validates an evaluation and records provider/workflow provenance', async () => {
    const provider = new FixtureProvider({'workflow.topic-evaluation': evaluation});
    const generated = await evaluateTopicCandidate(provider, speedOfLightTopicCandidate);
    expect(generated.artifact).toEqual(evaluation);
    expect(generated.provenance).toMatchObject({
      provider: 'fixture',
      model: 'fixture-v1',
      workflowId: 'workflow.topic-evaluation',
      workflowVersion: 2,
      inputReferences: [speedOfLightTopicCandidate.id],
      cost: {amount: 0, currency: 'USD', estimated: false},
    });
  });

  it('rejects provider output that drifts from the candidate identity', async () => {
    const provider = new FixtureProvider({
      'workflow.topic-evaluation': {...evaluation, topicCandidateId: 'topic.other'},
    });
    await expect(evaluateTopicCandidate(provider, speedOfLightTopicCandidate))
      .rejects.toThrow(/does not match/);
  });

  it('accepts an AI research draft only while sources and claims remain unreviewed', async () => {
    const provider = new FixtureProvider({'workflow.research-workspace': researchWorkspace});
    const generated = await draftResearchWorkspace(
      provider,
      speedOfLightTopicCandidate,
      evaluation,
    );
    expect(generated.artifact.claimCandidates[0]!.verificationStatus).toBe('unverified');
    expect(generated.artifact.sourceLeads[0]!.reviewStatus).toBe('unreviewed');
  });

  it('rejects AI output that promotes its own claim or cites a dangling source', () => {
    const selfVerified = structuredClone(researchWorkspace);
    selfVerified.claimCandidates[0]!.verificationStatus = 'verified';
    selfVerified.claimCandidates[0]!.review = {
      reviewedBy: 'model',
      reviewedAt: '2026-09-27',
    };
    expect(researchWorkspaceDraftSchema.safeParse(selfVerified).success).toBe(false);

    const dangling = structuredClone(researchWorkspace);
    dangling.claimCandidates[0]!.evidence[0]!.sourceId = 'source.missing';
    expect(researchWorkspaceDraftSchema.safeParse(dangling).success).toBe(false);
  });

  it('does not start research for a held topic evaluation', () => {
    const provider = new FixtureProvider({'workflow.research-workspace': researchWorkspace});
    expect(() => draftResearchWorkspace(
      provider,
      speedOfLightTopicCandidate,
      {...evaluation, recommendation: 'hold'},
    )).toThrow(/not research/);
  });

  it('generates claim-safe hook proposals without mutating the package', async () => {
    const batch = {
      knowledgePackageId: speedOfLightKnowledgePackage.id,
      packageRevision: speedOfLightKnowledgePackage.revision,
      proposals: [
        {
          id: 'speed-of-light.hook-proposal.earth-laps',
          archetype: 'impossible-sounding-fact',
          text: 'Light can circle Earth about seven and a half times before one second passes.',
          viewerPromise: 'Make light speed tangible using Earth.',
          claimIds: [speedOfLightClaimIds.earthLapsPerSecond],
          rationale: 'It starts with a familiar object and visible motion.',
        },
        {
          id: 'speed-of-light.hook-proposal.nearest-star',
          archetype: 'contradiction',
          text: 'Light is the fastest thing we know—so why does the nearest star still take years?',
          viewerPromise: 'Resolve the contradiction between speed and distance.',
          claimIds: [speedOfLightClaimIds.proximaDistance],
          rationale: 'It opens a question the payoff can directly resolve.',
        },
      ],
    };
    const provider = new FixtureProvider({'workflow.hook-generation': batch});
    const generated = await proposeHooks(provider, speedOfLightKnowledgePackage);
    expect(generated.artifact.proposals).toHaveLength(2);
    expect(speedOfLightKnowledgePackage.hooks.some(
      ({id}) => id === batch.proposals[0]!.id,
    )).toBe(false);
  });

  it('rejects hook proposals that cite a non-verified or unknown claim', async () => {
    const provider = new FixtureProvider({
      'workflow.hook-generation': {
        knowledgePackageId: speedOfLightKnowledgePackage.id,
        packageRevision: 1,
        proposals: [
          {
            id: 'speed-of-light.hook-proposal.one',
            archetype: 'question',
            text: 'Question one?',
            viewerPromise: 'Promise one.',
            claimIds: ['speed-of-light.claim.unknown'],
            rationale: 'Rationale one.',
          },
          {
            id: 'speed-of-light.hook-proposal.two',
            archetype: 'comparison',
            text: 'Question two?',
            viewerPromise: 'Promise two.',
            claimIds: [speedOfLightClaimIds.proximaDistance],
            rationale: 'Rationale two.',
          },
        ],
      },
    });
    await expect(proposeHooks(provider, speedOfLightKnowledgePackage))
      .rejects.toThrow(/non-verified claim/);
  });

  it('drafts a valid platform-neutral ContentAsset from approved verified inputs', async () => {
    const provider = new FixtureProvider({
      'workflow.content-asset-drafting': speedOfLightCosmicDistanceAsset,
    });
    const generated = await draftContentAsset(provider, {
      knowledgePackage: speedOfLightKnowledgePackage,
      assetId: speedOfLightContentAssetIds.cosmicDistanceShort,
      assetType: 'short-form-video',
      hookId: speedOfLightHookIds.nearestStarQuestion,
      selectedClaimIds: [...speedOfLightCosmicDistanceAsset.selectedClaimIds],
      editorialPurpose: speedOfLightCosmicDistanceAsset.editorialPurpose,
      storyAngle: speedOfLightCosmicDistanceAsset.storyAngle,
      durationIntentSeconds: speedOfLightCosmicDistanceAsset.durationIntentSeconds,
    });
    expect(generated.artifact).toEqual(speedOfLightCosmicDistanceAsset);
    expect(generated.artifact.editorialStatus).toBe('draft');
  });

  it('rejects content drafts that drift locked references', async () => {
    const drifted = structuredClone(speedOfLightCosmicDistanceAsset);
    drifted.id = 'speed-of-light.asset.unrequested';
    drifted.script.segments.forEach((segment) => {
      segment.id = segment.id.replace(
        speedOfLightContentAssetIds.cosmicDistanceShort,
        drifted.id,
      );
    });
    drifted.narrativeStructure.forEach((beat) => {
      beat.id = beat.id.replace(speedOfLightContentAssetIds.cosmicDistanceShort, drifted.id);
      beat.scriptSegmentIds = beat.scriptSegmentIds.map((id) =>
        id.replace(speedOfLightContentAssetIds.cosmicDistanceShort, drifted.id));
    });
    drifted.visualPlan.forEach((visual) => {
      visual.id = visual.id.replace(speedOfLightContentAssetIds.cosmicDistanceShort, drifted.id);
      visual.narrativeBeatId = visual.narrativeBeatId.replace(
        speedOfLightContentAssetIds.cosmicDistanceShort,
        drifted.id,
      );
      visual.scriptSegmentIds = visual.scriptSegmentIds.map((id) =>
        id.replace(speedOfLightContentAssetIds.cosmicDistanceShort, drifted.id));
    });
    const provider = new FixtureProvider({'workflow.content-asset-drafting': drifted});
    await expect(draftContentAsset(provider, {
      knowledgePackage: speedOfLightKnowledgePackage,
      assetId: speedOfLightContentAssetIds.cosmicDistanceShort,
      assetType: 'short-form-video',
      hookId: speedOfLightHookIds.nearestStarQuestion,
      selectedClaimIds: [...speedOfLightCosmicDistanceAsset.selectedClaimIds],
      editorialPurpose: speedOfLightCosmicDistanceAsset.editorialPurpose,
      storyAngle: speedOfLightCosmicDistanceAsset.storyAngle,
      durationIntentSeconds: speedOfLightCosmicDistanceAsset.durationIntentSeconds,
    })).rejects.toThrow(/locked workflow references/);
  });
});
