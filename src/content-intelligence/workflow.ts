import {generateStructured, type AIProvider} from '../ai/provider';
import {createContentAssetRegistry} from '../content-assets/registry';
import type {ContentAsset} from '../content-assets/schema';
import {createKnowledgePackageRegistry} from '../knowledge/registry';
import type {KnowledgePackage} from '../knowledge/schema';
import {
  contentAssetDraftOutputSchema,
  hookProposalBatchSchema,
  researchWorkspaceDraftSchema,
  topicEvaluationDraftSchema,
  type TopicCandidate,
  type TopicEvaluationDraft,
} from './schema';
import {
  contentAssetDraftWorkflow,
  hookProposalWorkflow,
  researchWorkspaceWorkflow,
  topicEvaluationWorkflow,
  type ContentAssetDraftRequest,
} from './prompts';

const assertApprovedVerifiedInputs = (
  knowledgePackage: KnowledgePackage,
  claimIds: readonly string[],
) => {
  if (knowledgePackage.editorialStatus !== 'approved') {
    throw new Error(`Knowledge package ${knowledgePackage.id} must be approved before AI-assisted editorial drafting`);
  }
  const claims = new Map(knowledgePackage.claims.map((claim) => [claim.id, claim]));
  for (const claimId of claimIds) {
    const claim = claims.get(claimId);
    if (!claim) throw new Error(`Unknown claim ${claimId} in ${knowledgePackage.id}`);
    if (claim.verificationStatus !== 'verified') {
      throw new Error(`Claim ${claimId} must be verified before AI-assisted editorial drafting`);
    }
  }
};

export const evaluateTopicCandidate = (
  provider: AIProvider,
  candidate: TopicCandidate,
) => generateStructured({
  provider,
  workflow: topicEvaluationWorkflow,
  input: candidate,
  inputReferences: [candidate.id],
  schema: topicEvaluationDraftSchema,
}).then((generated) => {
  if (
    generated.artifact.topicCandidateId !== candidate.id
    || generated.artifact.candidateRevision !== candidate.revision
  ) {
    throw new Error('Topic evaluation does not match its candidate input');
  }
  return generated;
});

export const draftResearchWorkspace = (
  provider: AIProvider,
  candidate: TopicCandidate,
  evaluation: TopicEvaluationDraft,
) => {
  if (evaluation.topicCandidateId !== candidate.id) {
    throw new Error('Research evaluation does not reference the supplied topic candidate');
  }
  if (evaluation.recommendation !== 'research') {
    throw new Error(`Topic evaluation recommendation is ${evaluation.recommendation}, not research`);
  }
  return generateStructured({
    provider,
    workflow: researchWorkspaceWorkflow,
    input: {candidate, evaluation},
    inputReferences: [candidate.id],
    schema: researchWorkspaceDraftSchema,
  }).then((generated) => {
    if (
      generated.artifact.topicCandidateId !== candidate.id
      || generated.artifact.proposedKnowledgePackageId !== candidate.proposedKnowledgePackageId
    ) {
      throw new Error('Research workspace does not match its topic candidate input');
    }
    return generated;
  });
};

export const proposeHooks = (
  provider: AIProvider,
  knowledgePackage: KnowledgePackage,
) => {
  const verifiedClaimIds = knowledgePackage.claims
    .filter(({verificationStatus}) => verificationStatus === 'verified')
    .map(({id}) => id);
  assertApprovedVerifiedInputs(knowledgePackage, verifiedClaimIds);
  return generateStructured({
    provider,
    workflow: hookProposalWorkflow,
    input: knowledgePackage,
    inputReferences: [knowledgePackage.id, ...verifiedClaimIds],
    schema: hookProposalBatchSchema,
  }).then((generated) => {
    if (
      generated.artifact.knowledgePackageId !== knowledgePackage.id
      || generated.artifact.packageRevision !== knowledgePackage.revision
    ) {
      throw new Error('Hook proposals do not match their KnowledgePackage input');
    }
    const verified = new Set(verifiedClaimIds);
    for (const proposal of generated.artifact.proposals) {
      for (const claimId of proposal.claimIds) {
        if (!verified.has(claimId)) {
          throw new Error(`Hook proposal ${proposal.id} references a non-verified claim: ${claimId}`);
        }
      }
    }
    return generated;
  });
};

export const draftContentAsset = async (
  provider: AIProvider,
  request: ContentAssetDraftRequest,
) => {
  const {knowledgePackage, selectedClaimIds, hookId} = request;
  assertApprovedVerifiedInputs(knowledgePackage, selectedClaimIds);
  const hook = knowledgePackage.hooks.find(({id}) => id === hookId);
  if (!hook) throw new Error(`Unknown hook ${hookId} in ${knowledgePackage.id}`);
  for (const claimId of hook.claimIds) {
    if (!selectedClaimIds.includes(claimId)) {
      throw new Error(`Draft request does not select hook claim ${claimId}`);
    }
  }

  const generated = await generateStructured({
    provider,
    workflow: contentAssetDraftWorkflow,
    input: request,
    inputReferences: [knowledgePackage.id, hookId, ...selectedClaimIds],
    schema: contentAssetDraftOutputSchema,
  });
  const asset = generated.artifact;
  if (
    asset.id !== request.assetId
    || asset.knowledgePackageId !== knowledgePackage.id
    || asset.assetType !== request.assetType
    || asset.editorialPurpose !== request.editorialPurpose
    || asset.storyAngle !== request.storyAngle
    || asset.hookId !== hookId
    || JSON.stringify(asset.selectedClaimIds) !== JSON.stringify(selectedClaimIds)
    || JSON.stringify(asset.durationIntentSeconds) !== JSON.stringify(request.durationIntentSeconds)
  ) {
    throw new Error('ContentAsset draft changed locked workflow references');
  }

  const packageRegistry = createKnowledgePackageRegistry([knowledgePackage]);
  createContentAssetRegistry([asset], packageRegistry);
  return generated as {artifact: ContentAsset; provenance: typeof generated.provenance};
};
