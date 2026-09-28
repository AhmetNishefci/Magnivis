import {woodFrogApprovedContentAsset} from '../../content-assets/assets/wood-frog-approved';
import {contentAssetRegistry} from '../../content-assets/registry';
import {woodFrogProductionPlan, woodFrogProductionFrames} from '../../production/plans/wood-frog';
import {videoSpecSchema} from '../schema';

const segmentText = (index: number) => {
  const segment = woodFrogApprovedContentAsset.script.segments[index];
  if (!segment) throw new Error(`Missing approved Wood Frog script segment ${index}`);
  return segment.text;
};

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
  status: 'rendered',
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
    safeAreaProfileId: woodFrogProductionPlan.safeAreaProfileId,
    outputReviewState: 'visual-review-required',
  },
  audio: {
    file: 'audio/wood-frog.wav',
    layers: ['ambient', 'transition', 'impact', 'narration'],
    narration: true,
    narrationCues: [
      {id: 'hook', file: 'audio/narration/wood-frog/hook.wav', start: 0.05, duration: 5.3, transcript: segmentText(0)},
      {id: 'freeze', file: 'audio/narration/wood-frog/freeze.wav', start: 5.18, duration: 4.275, transcript: segmentText(1)},
      {id: 'location', file: 'audio/narration/wood-frog/location.wav', start: 9.3, duration: 8.55, transcript: segmentText(2)},
      {id: 'chemistry', file: 'audio/narration/wood-frog/chemistry.wav', start: 17.7, duration: 5.35, transcript: segmentText(3)},
      {id: 'protection', file: 'audio/narration/wood-frog/protection.wav', start: 22.9, duration: 5.75, transcript: segmentText(4)},
      {id: 'payoff', file: 'audio/narration/wood-frog/payoff.wav', start: 28.5, duration: 10.125, transcript: segmentText(5)},
    ],
    provenance: {
      soundscape: {
        generatorId: 'audio-generator.wood-frog.v1',
        generatorVersion: 1,
        sha256: '62ee7908811e144bb34b15649620665fbc47243d180560db702ec51f1e7e003b',
      },
      narration: {
        provider: 'kokoro-local',
        modelId: 'onnx-community/Kokoro-82M-v1.0-ONNX',
        voiceId: 'af_heart',
        speed: 1.06,
        generatedAt: '2026-09-28T09:34:41Z',
        approvedScriptSha256: woodFrogProductionPlan.approvedScriptSha256,
        cueArtifacts: [
          {id: 'hook', sha256: '95dfed9847e04539a3fff9e996d8e188aee137e24ea75c3ba668ecd8ebe91028'},
          {id: 'freeze', sha256: '709839201ea34ef58c033160c97270e1c037bfb37f8e212bacc33f6c7e040db1'},
          {id: 'location', sha256: '08963b8235bff0fc15ab45ed6e572507fed8a008d217fd5302a375e8803e62c3'},
          {id: 'chemistry', sha256: 'a01da3297645d2f537593997c5d83f51a100c20210ff98720d86caab51d5ccc3'},
          {id: 'protection', sha256: 'b1db781f477e4d1c11079f6d6ff4a4b5e82902ae9837a3f6bcf0349f92ed50a2'},
          {id: 'payoff', sha256: '19072c2a76284d7622435495c197aab6d625591bd3d3ba68fcd90a35cf4cecd9'},
        ],
      },
    },
  },
});

contentAssetRegistry.get(woodFrogApprovedContentAsset.id);

export const woodFrogFrames = woodFrogProductionFrames;
