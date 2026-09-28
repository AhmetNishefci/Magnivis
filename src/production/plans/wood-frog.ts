import {woodFrogApprovedContentAsset} from '../../content-assets/assets/wood-frog-approved';
import {safeAreaProfileIds} from '../../design/safe-areas';
import {woodFrogApprovedKnowledgePackage} from '../../knowledge/packages/wood-frog-approved';
import {woodFrogFreezeClaimIds} from '../../knowledge/packages/wood-frog-freeze-tolerance';
import {productionPlanSchema} from '../schema';

const asset = woodFrogApprovedContentAsset;
const visualIds = asset.visualPlan.map(({id}) => id);
const beatIds = asset.narrativeStructure.map(({id}) => id);
const scriptIds = asset.script.segments.map(({id}) => id);

export const woodFrogProductionPlan = productionPlanSchema.parse({
  schemaVersion: 1,
  id: 'production-plan.wood-frog-freeze.v1',
  revision: 1,
  status: 'rendered-candidate-visual-review-required',
  knowledgePackage: {
    id: woodFrogApprovedKnowledgePackage.id,
    revision: woodFrogApprovedKnowledgePackage.revision,
    sha256: '098f6efe9930ee2b6424d7431efd03944c8378288588756c761229792f7bd403',
  },
  contentAsset: {
    id: asset.id,
    revision: asset.revision,
    sha256: '44a7674b0b5016cedddeb535e6ef5ca3ed190467002b5b0fec75b35c9e904ae7',
  },
  ownerDecision: {
    id: 'owner-decision.wood-frog-freeze.v1',
    revision: 1,
    sha256: 'edb5f6a0d4d49c10fd9cd86d2d57c544970553cb0fa6fcf924b372fab6833424',
  },
  approvedScriptSha256: 'a2ea7e39fe6409c13b1a2102b403187f222995d52100f25b6ec9a1876cb859bb',
  excludedClaimIds: [woodFrogFreezeClaimIds.circulationCessation],
  format: {width: 1080, height: 1920, fps: 30, durationSeconds: 40},
  safeAreaProfileId: safeAreaProfileIds.verticalShortMaster,
  beats: [
    {
      id: 'production-plan.wood-frog-freeze.v1.beat.cardiac-hook',
      sourceVisualPlanId: visualIds[0],
      narrativeBeatId: beatIds[0],
      scriptSegmentIds: [scriptIds[0]],
      claimIds: [woodFrogFreezeClaimIds.freezeSurvival, woodFrogFreezeClaimIds.cardiacArrest, woodFrogFreezeClaimIds.thawRecovery],
      frames: {start: 0, end: 156},
      sceneType: 'hook',
      objective: 'Introduce a recognizable wood frog and show labeled cardiac activity slowing to a reversible stop during freezing.',
      onScreenText: [
        {text: 'HEART ACTIVITY', claimIds: [woodFrogFreezeClaimIds.cardiacArrest]},
        {text: 'STOPS', claimIds: [woodFrogFreezeClaimIds.cardiacArrest]},
      ],
      animationIntent: 'Frost advances across the original frog silhouette while a non-medical cardiac trace slows and settles into a quiet line.',
      transitionIntent: 'Camera follows a luminous contour into a simplified tissue cross-section.',
      audioIntent: 'Restrained organic pulses decelerate without alarms or death cues.',
    },
    {
      id: 'production-plan.wood-frog-freeze.v1.beat.extracellular-ice',
      sourceVisualPlanId: visualIds[1],
      narrativeBeatId: beatIds[1],
      scriptSegmentIds: [scriptIds[1]],
      claimIds: [woodFrogFreezeClaimIds.freezeSurvival, woodFrogFreezeClaimIds.iceRedistribution],
      frames: {start: 156, end: 282},
      sceneType: 'anatomical-overview',
      objective: 'Reveal that survivable ice accumulates around tissues and outside cells rather than uniformly filling them.',
      onScreenText: [
        {text: 'ICE FORMS', claimIds: [woodFrogFreezeClaimIds.iceRedistribution]},
        {text: 'OUTSIDE CELLS', claimIds: [woodFrogFreezeClaimIds.iceRedistribution]},
      ],
      animationIntent: 'A diagrammatic cutaway reveals warm cell islands surrounded by branching extracellular ice channels.',
      transitionIntent: 'Magnify one protected cell while preserving its spatial relationship to the surrounding ice.',
      audioIntent: 'Crystalline textures widen as the diagram opens.',
    },
    {
      id: 'production-plan.wood-frog-freeze.v1.beat.cell-dehydration',
      sourceVisualPlanId: visualIds[2],
      narrativeBeatId: beatIds[2],
      scriptSegmentIds: [scriptIds[2]],
      claimIds: [woodFrogFreezeClaimIds.iceRedistribution],
      frames: {start: 282, end: 534},
      sceneType: 'cell-diagram',
      objective: 'Show water moving out of a cell as extracellular ice grows, with intracellular ice presented only as the avoided danger.',
      onScreenText: [
        {text: 'WATER MOVES OUT', claimIds: [woodFrogFreezeClaimIds.iceRedistribution]},
        {text: 'INTRACELLULAR ICE · AVOIDED', claimIds: [woodFrogFreezeClaimIds.iceRedistribution]},
      ],
      animationIntent: 'Water particles cross the membrane outward, the cell contracts modestly, and a separate crossed-out inset labels internal ice as danger—not a normal stage.',
      transitionIntent: 'Water particles reorganize into a left-to-right biological phase timeline.',
      audioIntent: 'Fine droplets and a muted protective tone replace the colder freeze texture.',
    },
    {
      id: 'production-plan.wood-frog-freeze.v1.beat.cryoprotectants',
      sourceVisualPlanId: visualIds[3],
      narrativeBeatId: beatIds[3],
      scriptSegmentIds: [scriptIds[3], scriptIds[4]],
      claimIds: [woodFrogFreezeClaimIds.glucoseCryoprotectant, woodFrogFreezeClaimIds.ureaAndGlucose],
      frames: {start: 534, end: 858},
      sceneType: 'phase-diagram',
      objective: 'Separate pre-freeze urea accumulation from freeze-triggered liver glucose mobilization, then show their combined protective contribution.',
      onScreenText: [
        {text: 'BEFORE FREEZING · UREA BUILDS', claimIds: [woodFrogFreezeClaimIds.ureaAndGlucose]},
        {text: 'FREEZING BEGINS · LIVER RELEASES GLUCOSE', claimIds: [woodFrogFreezeClaimIds.glucoseCryoprotectant]},
        {text: 'CRYOPROTECTION', claimIds: [woodFrogFreezeClaimIds.glucoseCryoprotectant, woodFrogFreezeClaimIds.ureaAndGlucose]},
      ],
      animationIntent: 'A phase rail activates urea first, then ice nucleation triggers a liver-to-tissue glucose path; both finish around a protected cell without molecular overclaiming.',
      transitionIntent: 'The phase rail reverses direction as cold blue shifts toward thawed green-gold.',
      audioIntent: 'Two distinct restrained tonal motifs merge under the protection state.',
    },
    {
      id: 'production-plan.wood-frog-freeze.v1.beat.ordered-recovery',
      sourceVisualPlanId: visualIds[4],
      narrativeBeatId: beatIds[4],
      scriptSegmentIds: [scriptIds[5]],
      claimIds: [woodFrogFreezeClaimIds.freezeSurvival, woodFrogFreezeClaimIds.thawRecovery],
      frames: {start: 858, end: 1200},
      sceneType: 'recovery-sequence',
      objective: 'Resolve the thaw in the supported order: heart activity, breathing, then hindleg reflex, ending on survival through managed freezing.',
      onScreenText: [
        {text: 'HEART → BREATHING → LEG REFLEX', claimIds: [woodFrogFreezeClaimIds.thawRecovery]},
        {text: 'IT CONTROLLED THE FREEZE', claimIds: [woodFrogFreezeClaimIds.freezeSurvival, woodFrogFreezeClaimIds.thawRecovery]},
      ],
      animationIntent: 'Thaw the frog, illuminate three ordered recovery indicators without timestamps, and finish on a subtle hindleg movement.',
      transitionIntent: 'Resolve to a clean hero frame with the controlled-freeze payoff and Magnivis mark.',
      audioIntent: 'Heart tone returns first, followed by breath-like air and a quiet warm resolution.',
    },
  ],
  assets: [
    {id: 'asset.wood-frog.procedural-visuals.v1', kind: 'procedural-code', provenance: {origin: 'original-procedural', rights: 'magnivis-original', notes: 'All frog, tissue, cell, molecule, ice and trace visuals are original code-native SVG/CSS geometry.'}},
    {id: 'asset.wood-frog.soundscape.v1', kind: 'generated-audio', path: 'audio/wood-frog.wav', provenance: {origin: 'original-procedural', rights: 'magnivis-original', notes: 'Deterministically synthesized locally from code; no samples or external music.'}},
    {id: 'asset.wood-frog.narration.v1', kind: 'generated-narration', path: 'audio/narration/wood-frog', provenance: {origin: 'local-synthetic-voice', rights: 'kokoro-apache-2.0-model-output', notes: 'Generated locally with the repository Kokoro model/voice from the approved script only.'}},
    {id: 'asset.wood-frog.captions.v1', kind: 'caption-track', path: 'captions/wood-frog.en.vtt', provenance: {origin: 'derived-from-approved-script', rights: 'magnivis-original', notes: 'Deterministically derived from approved narration cue text and timing; no transcription service.'}},
  ],
  captions: {
    file: 'captions/wood-frog.en.vtt',
    generatorId: 'caption-generator.narration-cues.v1',
    generatorVersion: 1,
    source: 'approved-narration-cues',
    placement: 'optional-platform-track-lower-center',
  },
  reviewRequirements: [
    'Inspect scientific meaning and visual hierarchy at full resolution.',
    'Confirm no interface or optional-caption collision on each future platform variant.',
    'Confirm narration, soundscape and captions against the approved script.',
    'Record human visual approval before any PlatformVariant becomes production-ready.',
  ],
});

export const woodFrogProductionFrames = Math.round(
  woodFrogProductionPlan.format.durationSeconds * woodFrogProductionPlan.format.fps,
);
