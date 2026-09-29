import {woodFrogApprovedContentAsset} from '../../content-assets/assets/wood-frog-approved';
import {woodFrogCaptionPlan} from '../../captions/plans/wood-frog';
import {contentAssetRegistry} from '../../content-assets/registry';
import {
  woodFrogNarrationCues,
  woodFrogNarrationProvenance,
} from '../../production/narration/wood-frog';
import {woodFrogProductionPlan, woodFrogProductionFrames} from '../../production/plans/wood-frog';
import {videoSpecSchema} from '../schema';

export const woodFrog = videoSpecSchema.parse({
  id: 'wood-frog',
  compositionId: 'Magnivis-Wood-Frog',
  workingTitle: 'How a Wood Frog Survives Freezing',
  titleCandidates: [
    'This Frog Can Survive a Stopped Heart',
    'How a Wood Frog Survives Freezing',
    'The Frog That Controls Where Ice Forms',
  ],
  descriptionCandidates: [
    'A wood frog can survive nonlethal freezing that stops its heartbeat. The key is where ice forms, how water moves, and when glucose and urea protect its cells.',
  ],
  hook: 'A WOOD FROG CAN SURVIVE A FREEZE THAT STOPS ITS HEARTBEAT.',
  pillar: 'earth',
  status: 'reviewed',
  language: 'en',
  captions: [{language: 'en', label: 'English', file: woodFrogProductionPlan.captions.file}],
  format: woodFrogProductionPlan.format,
  scenes: woodFrogProductionPlan.beats.map((beat) => ({
    id: beat.id.split('.').at(-1) ?? beat.id,
    start: beat.frames.start / woodFrogProductionPlan.format.fps,
    end: beat.frames.end / woodFrogProductionPlan.format.fps,
    purpose: beat.objective,
  })),
  contentAssetId: woodFrogApprovedContentAsset.id,
  production: {
    productionPlanId: woodFrogProductionPlan.id,
    productionPlanRevision: woodFrogProductionPlan.revision,
    knowledgePackageRevision: woodFrogProductionPlan.knowledgePackage.revision,
    contentAssetRevision: woodFrogProductionPlan.contentAsset.revision,
    approvedPackageSha256: woodFrogProductionPlan.knowledgePackage.sha256,
    approvedContentAssetSha256: woodFrogProductionPlan.contentAsset.sha256,
    ownerDecisionSha256: woodFrogProductionPlan.ownerDecision.sha256,
    approvedScriptSha256: woodFrogProductionPlan.approvedScriptSha256,
    captionPlanId: woodFrogCaptionPlan.id,
    captionPlanRevision: woodFrogCaptionPlan.revision,
    captionPlanSha256: woodFrogProductionPlan.captions.captionPlanSha256,
    safeAreaProfileId: woodFrogProductionPlan.safeAreaProfileId,
    outputReviewState: 'owner-visual-approved',
  },
  audio: {
    file: 'audio/wood-frog.wav',
    layers: ['ambient', 'transition', 'impact', 'narration'],
    narration: true,
    narrationCues: woodFrogNarrationCues,
    provenance: {
      soundscape: {
        generatorId: 'audio-generator.wood-frog.v1',
        generatorVersion: 1,
        sha256: '62ee7908811e144bb34b15649620665fbc47243d180560db702ec51f1e7e003b',
      },
      narration: woodFrogNarrationProvenance,
    },
  },
});

contentAssetRegistry.get(woodFrogApprovedContentAsset.id);

export const woodFrogFrames = woodFrogProductionFrames;
