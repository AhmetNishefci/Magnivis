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
  revision: 1,
  knowledgePackageId: woodFrogFreezeKnowledgePackage.id,
  assetType: 'short-form-video',
  editorialPurpose: 'Explain the physical and chemical mechanisms that let a wood frog survive a reversible whole-body freeze.',
  storyAngle: 'Begin with stopped heartbeat and breathing, then reveal that controlled ice placement plus cryoprotectants preserve the cells needed for thawing.',
  hookId: woodFrogFreezeHookIds.stoppedHeart,
  selectedClaimIds: [
    woodFrogFreezeClaimIds.freezeSurvival,
    woodFrogFreezeClaimIds.heartbeatBreathing,
    woodFrogFreezeClaimIds.glucoseCryoprotectant,
    woodFrogFreezeClaimIds.ureaAndGlucose,
    woodFrogFreezeClaimIds.iceRedistribution,
  ],
  durationIntentSeconds: {minimum: 32, maximum: 40},
  script: {
    language: 'en',
    segments: [
      {
        id: scriptIds.hook,
        type: 'factual',
        text: 'This frog can freeze until its heart stops—then thaw and move again.',
        claimIds: [woodFrogFreezeClaimIds.freezeSurvival, woodFrogFreezeClaimIds.heartbeatBreathing],
      },
      {
        id: scriptIds.freeze,
        type: 'factual',
        text: 'In winter, a wood frog can stop breathing as ice spreads through much of its body.',
        claimIds: [woodFrogFreezeClaimIds.freezeSurvival, woodFrogFreezeClaimIds.heartbeatBreathing],
      },
      {
        id: scriptIds.location,
        type: 'factual',
        text: 'The trick is not stopping every crystal. Water is redirected so more ice forms in compartments where it does less damage.',
        claimIds: [woodFrogFreezeClaimIds.iceRedistribution],
      },
      {
        id: scriptIds.chemistry,
        type: 'factual',
        text: 'At the same time, its liver releases a surge of glucose, while urea adds another layer of protection.',
        claimIds: [woodFrogFreezeClaimIds.glucoseCryoprotectant, woodFrogFreezeClaimIds.ureaAndGlucose],
      },
      {
        id: scriptIds.protection,
        type: 'factual',
        text: 'Together, those defenses limit ice formation and help protect membranes and other cell structures.',
        claimIds: [woodFrogFreezeClaimIds.ureaAndGlucose, woodFrogFreezeClaimIds.iceRedistribution],
      },
      {
        id: scriptIds.payoff,
        type: 'factual',
        text: 'When spring warms the frog, its heart and breathing return. It did not defeat freezing—it controlled where the damage could happen.',
        claimIds: [woodFrogFreezeClaimIds.heartbeatBreathing, woodFrogFreezeClaimIds.iceRedistribution],
      },
    ],
  },
  narrativeStructure: [
    {id: beatIds.hook, label: 'Impossible opening', purpose: 'Create immediate disbelief with a reversible biological flatline.', scriptSegmentIds: [scriptIds.hook]},
    {id: beatIds.setup, label: 'The freeze', purpose: 'Establish that this is real body freezing rather than ordinary hibernation.', scriptSegmentIds: [scriptIds.freeze]},
    {id: beatIds.physicalMechanism, label: 'Put ice in safer places', purpose: 'Replace the misleading frozen-solid mental model with spatially managed ice.', scriptSegmentIds: [scriptIds.location]},
    {id: beatIds.chemicalMechanism, label: 'Protect the cells', purpose: 'Reveal glucose and urea as complementary cryoprotective defenses.', scriptSegmentIds: [scriptIds.chemistry, scriptIds.protection]},
    {id: beatIds.payoff, label: 'Controlled, not invincible', purpose: 'Resolve the apparent resurrection and restate the deeper idea.', scriptSegmentIds: [scriptIds.payoff]},
  ],
  visualPlan: [
    {
      id: `${woodFrogFreezeAssetId}.visual.frozen-flatline`,
      narrativeBeatId: beatIds.hook,
      objective: 'Show a wood frog progressively freezing while a pulse trace falls flat, then briefly preview movement after thaw.',
      visualType: 'animation',
      timingIntentSeconds: {start: 0, end: 4},
      suggestedPrimitive: 'bespoke',
      assetRequirements: ['Rights-cleared wood frog reference or original stylized frog model', 'Original pulse and frost animation'],
      scriptSegmentIds: [scriptIds.hook],
      claimIds: [woodFrogFreezeClaimIds.freezeSurvival, woodFrogFreezeClaimIds.heartbeatBreathing],
      notes: 'Avoid horror imagery and do not imply death or literal resurrection.',
    },
    {
      id: `${woodFrogFreezeAssetId}.visual.body-freeze`,
      narrativeBeatId: beatIds.setup,
      objective: 'Move from leaf litter into a translucent body view as ice advances and breathing/pulse indicators stop.',
      visualType: 'animation',
      timingIntentSeconds: {start: 4, end: 10},
      suggestedPrimitive: 'diagram',
      assetRequirements: ['Original forest-floor background', 'Simplified anatomical silhouette', 'Temperature and vital-sign indicators'],
      scriptSegmentIds: [scriptIds.freeze],
      claimIds: [woodFrogFreezeClaimIds.freezeSurvival, woodFrogFreezeClaimIds.heartbeatBreathing],
    },
    {
      id: `${woodFrogFreezeAssetId}.visual.ice-location`,
      narrativeBeatId: beatIds.physicalMechanism,
      objective: 'Contrast damaging intracellular ice with water shifting toward compartments where extracellular ice can be sequestered.',
      visualType: 'diagram',
      timingIntentSeconds: {start: 10, end: 19},
      suggestedPrimitive: 'comparison',
      assetRequirements: ['Original cell and tissue cross-section', 'Animated water-flow and ice-crystal layers'],
      scriptSegmentIds: [scriptIds.location],
      claimIds: [woodFrogFreezeClaimIds.iceRedistribution],
      notes: 'Illustrative mechanism, not a literal microscopic recording; label the diagram accordingly.',
    },
    {
      id: `${woodFrogFreezeAssetId}.visual.cryoprotectants`,
      narrativeBeatId: beatIds.chemicalMechanism,
      objective: 'Trace glucose from liver glycogen into tissues, then add urea as a second protective system around vulnerable cells.',
      visualType: 'animation',
      timingIntentSeconds: {start: 19, end: 29},
      suggestedPrimitive: 'diagram',
      assetRequirements: ['Original liver-to-tissue pathway diagram', 'Glucose and urea labels', 'Cell-membrane protection animation'],
      scriptSegmentIds: [scriptIds.chemistry, scriptIds.protection],
      claimIds: [woodFrogFreezeClaimIds.glucoseCryoprotectant, woodFrogFreezeClaimIds.ureaAndGlucose],
    },
    {
      id: `${woodFrogFreezeAssetId}.visual.thaw-payoff`,
      narrativeBeatId: beatIds.payoff,
      objective: 'Reverse the temperature and frost animation, restart the pulse, and end on the frog moving through thawing leaf litter.',
      visualType: 'animation',
      timingIntentSeconds: {start: 29, end: 37},
      suggestedPrimitive: 'timeline',
      assetRequirements: ['Original thaw transition', 'Pulse restart animation', 'Rights-cleared or original moving wood frog visual'],
      scriptSegmentIds: [scriptIds.payoff],
      claimIds: [woodFrogFreezeClaimIds.heartbeatBreathing, woodFrogFreezeClaimIds.iceRedistribution],
    },
  ],
  narrationPlan: {
    mode: 'narrated',
    voiceDirection: 'Controlled wonder: open with quiet disbelief, become precise during the mechanism, and land the final distinction without triumphal exaggeration.',
    pronunciationNotes: ['cryoprotectant: CRY-oh-pro-TEK-tant'],
  },
  editorialStatus: 'draft',
});
