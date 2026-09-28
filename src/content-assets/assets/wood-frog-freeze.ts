import {contentAssetSchema} from '../schema';
import {
  woodFrogFreezeClaimIds,
  woodFrogFreezeHookIds,
  woodFrogFreezeKnowledgePackage,
} from '../../knowledge/packages/wood-frog-freeze-tolerance';

export const woodFrogFreezeAssetId = 'wood-frog-freeze-tolerance.asset.how-freezing-works';

const scriptIds = {
  hook: `${woodFrogFreezeAssetId}.script.hook`,
  freeze: `${woodFrogFreezeAssetId}.script.freeze`,
  location: `${woodFrogFreezeAssetId}.script.location`,
  chemistry: `${woodFrogFreezeAssetId}.script.chemistry`,
  protection: `${woodFrogFreezeAssetId}.script.protection`,
  payoff: `${woodFrogFreezeAssetId}.script.payoff`,
} as const;

const beatIds = {
  hook: `${woodFrogFreezeAssetId}.beat.hook`,
  setup: `${woodFrogFreezeAssetId}.beat.setup`,
  physicalMechanism: `${woodFrogFreezeAssetId}.beat.physical-mechanism`,
  chemicalMechanism: `${woodFrogFreezeAssetId}.beat.chemical-mechanism`,
  payoff: `${woodFrogFreezeAssetId}.beat.payoff`,
} as const;

export const woodFrogFreezeDraftAsset = contentAssetSchema.parse({
  id: woodFrogFreezeAssetId,
  revision: 2,
  knowledgePackageId: woodFrogFreezeKnowledgePackage.id,
  assetType: 'short-form-video',
  editorialPurpose: 'Explain how extracellular ice, water redistribution and complementary cryoprotectants let a wood frog survive a reversible freeze.',
  storyAngle: 'Begin with reversible cardiac arrest, correct the “frozen solid” misconception, then reveal the physical and chemical defenses that permit staged recovery.',
  hookId: woodFrogFreezeHookIds.stoppedHeart,
  selectedClaimIds: [
    woodFrogFreezeClaimIds.freezeSurvival,
    woodFrogFreezeClaimIds.cardiacArrest,
    woodFrogFreezeClaimIds.thawRecovery,
    woodFrogFreezeClaimIds.glucoseCryoprotectant,
    woodFrogFreezeClaimIds.ureaAndGlucose,
    woodFrogFreezeClaimIds.iceRedistribution,
  ],
  durationIntentSeconds: {minimum: 30, maximum: 38},
  script: {
    language: 'en',
    segments: [
      {
        id: scriptIds.hook,
        type: 'factual',
        text: 'A wood frog can survive a freeze that stops its heartbeat—then thaw and recover.',
        claimIds: [woodFrogFreezeClaimIds.freezeSurvival, woodFrogFreezeClaimIds.cardiacArrest, woodFrogFreezeClaimIds.thawRecovery],
      },
      {
        id: scriptIds.freeze,
        type: 'factual',
        text: 'Much of its body water can turn to ice, mainly outside its cells.',
        claimIds: [woodFrogFreezeClaimIds.freezeSurvival, woodFrogFreezeClaimIds.iceRedistribution],
      },
      {
        id: scriptIds.location,
        type: 'factual',
        text: 'As extracellular ice grows, water leaves the cells. That dehydration helps keep dangerous ice crystals from forming inside them.',
        claimIds: [woodFrogFreezeClaimIds.iceRedistribution],
      },
      {
        id: scriptIds.chemistry,
        type: 'factual',
        text: 'Its liver rapidly releases glucose, while urea has already built up before freezing.',
        claimIds: [woodFrogFreezeClaimIds.glucoseCryoprotectant, woodFrogFreezeClaimIds.ureaAndGlucose],
      },
      {
        id: scriptIds.protection,
        type: 'factual',
        text: 'These cryoprotectants limit ice formation and help protect cells through freezing and thawing.',
        claimIds: [woodFrogFreezeClaimIds.glucoseCryoprotectant, woodFrogFreezeClaimIds.ureaAndGlucose],
      },
      {
        id: scriptIds.payoff,
        type: 'factual',
        text: 'As the frog thaws, its heart starts beating first; breathing and leg reflexes follow. It survived by controlling the freeze—not by staying unfrozen.',
        claimIds: [woodFrogFreezeClaimIds.freezeSurvival, woodFrogFreezeClaimIds.thawRecovery],
      },
    ],
  },
  narrativeStructure: [
    {id: beatIds.hook, label: 'Reversible cardiac arrest', purpose: 'Create immediate disbelief without implying death or resurrection.', scriptSegmentIds: [scriptIds.hook]},
    {id: beatIds.setup, label: 'Extracellular freeze', purpose: 'Establish substantial body-water freezing without depicting uniform intracellular ice.', scriptSegmentIds: [scriptIds.freeze]},
    {id: beatIds.physicalMechanism, label: 'Water leaves the cells', purpose: 'Show how extracellular ice, dehydration and extra-organ sequestration reduce dangerous ice inside tissues and cells.', scriptSegmentIds: [scriptIds.location]},
    {id: beatIds.chemicalMechanism, label: 'Two defenses, different timing', purpose: 'Distinguish freeze-triggered glucose mobilization from urea accumulated before freezing.', scriptSegmentIds: [scriptIds.chemistry, scriptIds.protection]},
    {id: beatIds.payoff, label: 'Ordered recovery', purpose: 'Show heart function returning before breathing and hindleg reflexes, then land the controlled-freeze distinction.', scriptSegmentIds: [scriptIds.payoff]},
  ],
  visualPlan: [
    {
      id: `${woodFrogFreezeAssetId}.visual.frozen-flatline`,
      narrativeBeatId: beatIds.hook,
      objective: 'Show a stylized wood frog freezing while a clearly labeled cardiac trace slows and ceases, then briefly preview recovery after thaw.',
      visualType: 'animation',
      timingIntentSeconds: {start: 0, end: 4},
      suggestedPrimitive: 'bespoke',
      assetRequirements: ['Original procedural or vector wood frog model', 'Original cardiac-trace and frost animation', 'On-screen “cardiac activity” label'],
      scriptSegmentIds: [scriptIds.hook],
      claimIds: [woodFrogFreezeClaimIds.freezeSurvival, woodFrogFreezeClaimIds.cardiacArrest, woodFrogFreezeClaimIds.thawRecovery],
      notes: 'A flat trace represents measured cardiac arrest, not death. Do not use a hospital death monitor, alarm, resurrection flash or medical-emergency language.',
    },
    {
      id: `${woodFrogFreezeAssetId}.visual.body-freeze`,
      narrativeBeatId: beatIds.setup,
      objective: 'Move from leaf litter into a simplified body view where extracellular and extra-organ ice grows while cells remain visibly unfrozen inside.',
      visualType: 'animation',
      timingIntentSeconds: {start: 4, end: 10},
      suggestedPrimitive: 'diagram',
      assetRequirements: ['Original forest-floor background', 'Simplified anatomical silhouette', 'Labeled extracellular-ice layer', 'No intracellular ice depiction'],
      scriptSegmentIds: [scriptIds.freeze],
      claimIds: [woodFrogFreezeClaimIds.freezeSurvival, woodFrogFreezeClaimIds.iceRedistribution],
      notes: 'Do not fill the frog or its cells with a uniform solid-ice texture. This is an explanatory diagram, not a literal scan.',
    },
    {
      id: `${woodFrogFreezeAssetId}.visual.ice-location`,
      narrativeBeatId: beatIds.physicalMechanism,
      objective: 'Show extracellular ice drawing water out of a cell, controlled cell shrinkage, and water accumulating in extra-organ spaces without showing survivable intracellular crystals.',
      visualType: 'diagram',
      timingIntentSeconds: {start: 10, end: 19},
      suggestedPrimitive: 'comparison',
      assetRequirements: ['Original cell and tissue cross-section', 'Animated water-flow and ice-crystal layers'],
      scriptSegmentIds: [scriptIds.location],
      claimIds: [woodFrogFreezeClaimIds.iceRedistribution],
      notes: 'Label extracellular space, cell membrane and water movement. Intracellular ice may appear only as a crossed-out danger example, never as the normal survivable state.',
    },
    {
      id: `${woodFrogFreezeAssetId}.visual.cryoprotectants`,
      narrativeBeatId: beatIds.chemicalMechanism,
      objective: 'Use a two-step timeline: urea is already elevated before freezing; after ice nucleation, liver glycogen becomes glucose that travels to tissues before advanced freezing impedes transport.',
      visualType: 'animation',
      timingIntentSeconds: {start: 19, end: 29},
      suggestedPrimitive: 'diagram',
      assetRequirements: ['Original pre-freeze urea panel', 'Original liver-to-tissue glucose pathway', 'Labeled unfrozen-fluid and cell-protection diagram'],
      scriptSegmentIds: [scriptIds.chemistry, scriptIds.protection],
      claimIds: [woodFrogFreezeClaimIds.glucoseCryoprotectant, woodFrogFreezeClaimIds.ureaAndGlucose],
    },
    {
      id: `${woodFrogFreezeAssetId}.visual.thaw-payoff`,
      narrativeBeatId: beatIds.payoff,
      objective: 'Thaw the extracellular ice, restore the cardiac trace first, then show breathing and a hindleg reflex returning without assigning unsupported exact times.',
      visualType: 'animation',
      timingIntentSeconds: {start: 29, end: 37},
      suggestedPrimitive: 'timeline',
      assetRequirements: ['Original thaw transition', 'Ordered heart → breathing → hindleg-reflex indicators', 'Original procedural or vector recovered frog visual'],
      scriptSegmentIds: [scriptIds.payoff],
      claimIds: [woodFrogFreezeClaimIds.freezeSurvival, woodFrogFreezeClaimIds.thawRecovery],
      notes: 'The order is supported, but exact recovery timing varies and must not be implied by an unlabeled stopwatch.',
    },
  ],
  narrationPlan: {
    mode: 'narrated',
    voiceDirection: 'Controlled wonder: open with quiet disbelief, become precise during the mechanism, and land the final distinction without triumphal exaggeration.',
    pronunciationNotes: ['cryoprotectant: CRY-oh-pro-TEK-tant'],
  },
  editorialStatus: 'draft',
});
