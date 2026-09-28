import {mkdirSync, writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {DeterministicFixtureProvider} from '../../ai/providers/fixture';
import {woodFrogFreezeDraftAsset} from '../../content-assets/assets/wood-frog-freeze';
import {woodFrogFreezeKnowledgePackage} from '../../knowledge/packages/wood-frog-freeze-tolerance';
import {woodFrogFreezeTopicCandidate} from '../candidates/wood-frog-freeze';
import {
  contentAssetReviewDraftWorkflow,
  hookReviewProposalWorkflow,
  researchWorkspaceWorkflow,
  topicEvaluationWorkflow,
  type ContentAssetDraftRequest,
} from '../prompts';
import {createWorkflowRun, writeWorkflowRun} from '../run-store';
import {stableJson, validateWorkflowRunEnvelope, type WorkflowRun} from '../run-schema';
import type {TopicEvaluationDraft} from '../schema';
import {
  draftContentAssetForReview,
  draftResearchWorkspace,
  evaluateTopicCandidate,
  proposeHooksForReview,
} from '../workflow';

export const woodFrogTopicEvaluation: TopicEvaluationDraft = {
  topicCandidateId: woodFrogFreezeTopicCandidate.id,
  candidateRevision: woodFrogFreezeTopicCandidate.revision,
  summary: 'A strong evergreen Magnivis topic with an immediate contradiction, a clear mechanism, authoritative evidence, and multiple visual layers.',
  dimensions: {
    curiosityGap: {rating: 'strong', rationale: 'Reversible cardiac arrest during extensive extracellular freezing appears impossible without an explanation.', uncertainty: []},
    surprise: {rating: 'strong', rationale: 'The animal survives by controlling a freeze rather than avoiding it.', uncertainty: []},
    usefulness: {rating: 'strong', rationale: 'The mechanism teaches cryoprotection, water movement, and why ice location matters.', uncertainty: []},
    visualExplainability: {rating: 'strong', rationale: 'Freeze progression, pulse, cell diagrams, glucose movement, and thawing can each carry a beat.', uncertainty: ['Actual wood-frog footage requires rights review or an original depiction.']},
    narrativePotential: {rating: 'strong', rationale: 'The story naturally moves from reversible cardiac arrest to physical protection, chemical protection, and ordered recovery.', uncertainty: []},
    factualVerifiability: {rating: 'strong', rationale: 'Primary ECG, ventilation, thaw-recovery and cryobiology studies cover the core claims.', uncertainty: ['Every supported claim still requires explicit owner verification before promotion.']},
    originality: {rating: 'mixed', rationale: 'The frozen-frog headline is known, but explaining ice placement plus two cryoprotectants adds depth.', uncertainty: ['Current platform saturation was not measured in this trial.']},
    brandFit: {rating: 'strong', rationale: 'It delivers an immediate “wait—really?” premise followed by a mechanism viewers can understand.', uncertainty: []},
    shortFormSuitability: {rating: 'strong', rationale: 'One question and two complementary mechanisms fit a focused 32–40 second explanation.', uncertainty: []},
    longFormExpansion: {rating: 'mixed', rationale: 'Population variation and organ preservation could support depth, but the core mechanism is strongest as a short.', uncertainty: ['A long-form expansion would require broader comparative research.']},
  },
  recommendation: 'research',
  risks: [
    'Do not describe reversible physiological arrest as death or resurrection.',
    'Do not generalize Alaska-specific temperature limits to all wood frogs.',
    'Do not imply that every cell freezes internally when using the phrase “frozen solid.”',
  ],
  researchQuestions: [
    'Which body compartments hold ice during a survivable freeze?',
    'What distinct roles do glucose and urea play?',
    'What primary evidence supports heartbeat and breathing cessation?',
    'How strongly do temperature and duration limits vary by population?',
  ],
};

const unverifiedClaims = woodFrogFreezeKnowledgePackage.claims.map((claim) => ({
  ...structuredClone(claim),
  verificationStatus: 'unverified' as const,
  review: undefined,
})).map(({review: _review, ...claim}) => claim);

export const woodFrogResearchWorkspace = {
  id: 'research.wood-frog-freeze-tolerance',
  revision: 1,
  topicCandidateId: woodFrogFreezeTopicCandidate.id,
  proposedKnowledgePackageId: woodFrogFreezeKnowledgePackage.id,
  sourceLeads: woodFrogFreezeKnowledgePackage.sources.map((source) => ({
    id: source.id,
    organization: source.organization,
    title: source.title,
    sourceType: source.sourceType,
    url: source.url,
    ...(source.published ? {published: source.published} : {}),
    notes: source.notes,
    reviewStatus: 'unreviewed' as const,
  })),
  claimCandidates: unverifiedClaims,
  openQuestions: [
    'Obtain explicit owner decisions for every claim and the recommended hook/script/VisualPlan.',
    'Keep circulation cessation excluded unless directly reviewed primary blood-flow evidence is added.',
    'Determine rights-cleared visual sourcing for the animal and freeze/thaw behavior.',
  ],
  conflictNotes: [
    'Authoritative sources report different cold limits because wood-frog populations and experimental conditions differ; no universal threshold should be stated.',
    'The 2013 study summary says frogs endured two months at −4°C, while the detailed results show only two of four met the survival criterion after eight weeks; use the detailed outcome.',
  ],
  status: 'draft' as const,
};

export const woodFrogHookProposals = {
  knowledgePackageId: woodFrogFreezeKnowledgePackage.id,
  packageRevision: woodFrogFreezeKnowledgePackage.revision,
  proposals: woodFrogFreezeKnowledgePackage.hooks.map((hook) => ({
    id: hook.id.replace('.hook.', '.hook-proposal.'),
    archetype: hook.archetype,
    text: hook.text,
    viewerPromise: hook.viewerPromise,
    claimIds: hook.claimIds,
    rationale: hook.id.endsWith('stopped-heart')
      ? 'The reversible flatline is immediate, visual, and supported without relying on a population-specific temperature record.'
      : 'This angle offers a materially different entry point while remaining inside the supported evidence.',
  })),
};

export const woodFrogAssetDraftRequest: ContentAssetDraftRequest = {
  knowledgePackage: woodFrogFreezeKnowledgePackage,
  assetId: woodFrogFreezeDraftAsset.id,
  assetType: woodFrogFreezeDraftAsset.assetType,
  hookId: woodFrogFreezeDraftAsset.hookId,
  selectedClaimIds: [...woodFrogFreezeDraftAsset.selectedClaimIds],
  editorialPurpose: woodFrogFreezeDraftAsset.editorialPurpose,
  storyAngle: woodFrogFreezeDraftAsset.storyAngle,
  durationIntentSeconds: woodFrogFreezeDraftAsset.durationIntentSeconds,
};

export const createWoodFrogFixtureProvider = () => new DeterministicFixtureProvider({
  [topicEvaluationWorkflow.id]: woodFrogTopicEvaluation,
  [researchWorkspaceWorkflow.id]: woodFrogResearchWorkspace,
  [hookReviewProposalWorkflow.id]: woodFrogHookProposals,
  [contentAssetReviewDraftWorkflow.id]: woodFrogFreezeDraftAsset,
});

const validationTime = '2026-09-27T20:00:00.000Z';

export const runWoodFrogFixtureTrial = async () => {
  const provider = createWoodFrogFixtureProvider();
  const evaluation = await evaluateTopicCandidate(provider, woodFrogFreezeTopicCandidate);
  const research = await draftResearchWorkspace(
    provider,
    woodFrogFreezeTopicCandidate,
    evaluation.artifact,
  );
  const hooks = await proposeHooksForReview(provider, woodFrogFreezeKnowledgePackage);
  const asset = await draftContentAssetForReview(provider, woodFrogAssetDraftRequest);

  const runs: WorkflowRun[] = [
    createWorkflowRun({
      id: 'run.wood-frog-freeze.fixture.topic-evaluation.v1',
      stage: 'topic-evaluation',
      candidate: woodFrogFreezeTopicCandidate,
      workflow: topicEvaluationWorkflow,
      input: woodFrogFreezeTopicCandidate,
      inputReferences: [woodFrogFreezeTopicCandidate.id],
      generated: evaluation,
      validatedAt: validationTime,
      derivedArtifacts: [{kind: 'topic-evaluation', id: 'evaluation.wood-frog-freeze.v1', revision: 1}],
    }),
    createWorkflowRun({
      id: 'run.wood-frog-freeze.fixture.research-workspace.v1',
      stage: 'research-workspace',
      candidate: woodFrogFreezeTopicCandidate,
      workflow: researchWorkspaceWorkflow,
      input: {candidate: woodFrogFreezeTopicCandidate, evaluation: evaluation.artifact},
      inputReferences: [woodFrogFreezeTopicCandidate.id],
      generated: research,
      validatedAt: validationTime,
      knowledgePackageId: woodFrogFreezeKnowledgePackage.id,
      derivedArtifacts: [{kind: 'research-workspace', id: research.artifact.id, revision: research.artifact.revision}],
    }),
    createWorkflowRun({
      id: 'run.wood-frog-freeze.fixture.hook-generation-review.v1',
      stage: 'hook-generation-review',
      candidate: woodFrogFreezeTopicCandidate,
      workflow: hookReviewProposalWorkflow,
      input: woodFrogFreezeKnowledgePackage,
      inputReferences: hooks.provenance.inputReferences,
      generated: hooks,
      validatedAt: validationTime,
      knowledgePackageId: woodFrogFreezeKnowledgePackage.id,
      derivedArtifacts: [{kind: 'hook-batch', id: 'hook-batch.wood-frog-freeze.v1', revision: 1}],
    }),
    createWorkflowRun({
      id: 'run.wood-frog-freeze.fixture.content-asset-review-drafting.v1',
      stage: 'content-asset-review-drafting',
      candidate: woodFrogFreezeTopicCandidate,
      workflow: contentAssetReviewDraftWorkflow,
      input: woodFrogAssetDraftRequest,
      inputReferences: asset.provenance.inputReferences,
      generated: asset,
      validatedAt: validationTime,
      knowledgePackageId: woodFrogFreezeKnowledgePackage.id,
      contentAssetId: woodFrogFreezeDraftAsset.id,
      derivedArtifacts: [{kind: 'content-asset', id: asset.artifact.id, revision: asset.artifact.revision}],
    }),
  ];
  return {evaluation, research, hooks, asset, runs};
};

const bullets = (values: readonly string[]) => values.map((value) => `- ${value}`).join('\n');

export const createWoodFrogReviewReport = () => {
  const packageClaims = woodFrogFreezeKnowledgePackage.claims;
  const script = woodFrogFreezeDraftAsset.script.segments
    .map((segment) => `- ${segment.text}\n  Claims: ${segment.type === 'factual' ? segment.claimIds.join(', ') : 'none'}`)
    .join('\n');
  const narrative = woodFrogFreezeDraftAsset.narrativeStructure
    .map((beat) => `- **${beat.label}:** ${beat.purpose}`)
    .join('\n');
  const visuals = woodFrogFreezeDraftAsset.visualPlan
    .map((visual) => `- **${visual.timingIntentSeconds?.start ?? '?'}–${visual.timingIntentSeconds?.end ?? '?'}s · ${visual.suggestedPrimitive ?? visual.visualType}:** ${visual.objective}\n  Required: ${(visual.assetRequirements ?? []).join('; ')}\n  Claims: ${visual.claimIds.join(', ')}`)
    .join('\n');
  return `# Wood frog freeze tolerance — Content Intelligence review\n\n## Topic\n\n${woodFrogFreezeTopicCandidate.title}\n\n## Why it was selected\n\n${woodFrogFreezeTopicCandidate.discovery.notes}\n\n## Sources\n\n${woodFrogFreezeKnowledgePackage.sources.map((source) => `- **${source.organization}:** [${source.title}](${source.url}) — retrieved ${source.retrieved}; ${source.sourceType}`).join('\n')}\n\n## Claims awaiting human verification\n\n${packageClaims.map((claim) => `- **${claim.verificationStatus.toUpperCase()}:** ${claim.statement}\n  Evidence: ${claim.evidence.map(({sourceId, locator}) => `${sourceId}${locator ? ` (${locator})` : ''}`).join('; ')}\n  Caveats: ${claim.caveats.length ? claim.caveats.join('; ') : 'none recorded'}`).join('\n')}\n\nNo claim is marked VERIFIED. SUPPORTED means the retrieved evidence aligns with the claim, but an owner/editor has not completed the human verification gate.\n\n## Hook options\n\n${woodFrogFreezeKnowledgePackage.hooks.map((hook) => `- **${hook.archetype}:** ${hook.text}\n  Claims: ${hook.claimIds.join(', ')}`).join('\n')}\n\n## Recommended draft hook\n\n${woodFrogFreezeKnowledgePackage.hooks[0]!.text}\n\nThis is an editorial suggestion, not an approved hook. It avoids the population-specific temperature result while delivering the strongest visual contradiction.\n\n## Script draft\n\n${script}\n\n## Narrative structure\n\n${narrative}\n\n## Visual plan\n\n${visuals}\n\n## Unresolved questions\n\n${bullets(woodFrogResearchWorkspace.openQuestions)}\n\n## Human approval required\n\n- Retrieve and inspect every linked source independently.\n- Verify or revise every supported claim, especially stopped heartbeat and breathing.\n- Decide whether “freeze until its heart stops” is precise enough for publication.\n- Approve one hook and the final script.\n- Review rights/provenance for every visual asset.\n- Perform final visual, audio, caption, disclosure, platform-preview, and public-release approval.\n`;
};

const filenames = [
  '01-topic-evaluation.run.json',
  '02-research-workspace.run.json',
  '03-hook-proposals.run.json',
  '04-content-asset.run.json',
] as const;

export const writeWoodFrogTrialArtifacts = async (directory: string) => {
  const result = await runWoodFrogFixtureTrial();
  mkdirSync(directory, {recursive: true});
  result.runs.forEach((run, index) => writeWorkflowRun(resolve(directory, filenames[index]!), run));
  writeFileSync(
    resolve(directory, 'knowledge-package.review.json'),
    `${stableJson(woodFrogFreezeKnowledgePackage, 2)}\n`,
    'utf8',
  );
  writeFileSync(
    resolve(directory, 'content-asset.draft.json'),
    `${stableJson(woodFrogFreezeDraftAsset, 2)}\n`,
    'utf8',
  );
  writeFileSync(resolve(directory, 'review.md'), createWoodFrogReviewReport(), 'utf8');
  return result;
};

export const validateWoodFrogTrialArtifacts = (runs: readonly unknown[]) => {
  if (runs.length !== filenames.length) throw new Error('Wood frog trial requires four workflow runs');
  return runs.map(validateWorkflowRunEnvelope);
};

export const woodFrogTrialRunFilenames = filenames;
