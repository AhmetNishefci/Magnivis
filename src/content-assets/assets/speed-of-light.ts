import {
  speedOfLightClaimIds,
  speedOfLightHookIds,
  speedOfLightKnowledgePackage,
} from '../../knowledge/packages/speed-of-light';
import {contentAssetSchema} from '../schema';

export const speedOfLightContentAssetIds = {
  publishedShort: 'speed-of-light.asset.earth-to-proxima',
  cosmicDistanceShort: 'speed-of-light.asset.cosmic-distance',
} as const;

export const speedOfLightPublishedScriptSegmentIds = {
  hook: `${speedOfLightContentAssetIds.publishedShort}.script.hook`,
  speed: `${speedOfLightContentAssetIds.publishedShort}.script.speed`,
  moon: `${speedOfLightContentAssetIds.publishedShort}.script.moon`,
  sun: `${speedOfLightContentAssetIds.publishedShort}.script.sun`,
  year: `${speedOfLightContentAssetIds.publishedShort}.script.year`,
  proxima: `${speedOfLightContentAssetIds.publishedShort}.script.proxima`,
} as const;

const hookText = (hookId: string) => {
  const hook = speedOfLightKnowledgePackage.hooks.find(({id}) => id === hookId);
  if (!hook) throw new Error(`Missing Speed of Light hook: ${hookId}`);
  return hook.text;
};

const publishedBeatIds = {
  hook: `${speedOfLightContentAssetIds.publishedShort}.beat.hook`,
  anchor: `${speedOfLightContentAssetIds.publishedShort}.beat.anchor`,
  expand: `${speedOfLightContentAssetIds.publishedShort}.beat.expand`,
  explain: `${speedOfLightContentAssetIds.publishedShort}.beat.explain`,
  payoff: `${speedOfLightContentAssetIds.publishedShort}.beat.payoff`,
} as const;

export const speedOfLightPublishedShortAsset = contentAssetSchema.parse({
  id: speedOfLightContentAssetIds.publishedShort,
  revision: 1,
  knowledgePackageId: speedOfLightKnowledgePackage.id,
  assetType: 'short-form-video',
  editorialPurpose: 'Make the speed of light intuitive, then reveal that interstellar scale still overwhelms it.',
  storyAngle: 'Escalate from one-second laps around Earth through progressively larger distances until even light requires years.',
  hookId: speedOfLightHookIds.impossibleLaps,
  selectedClaimIds: Object.values(speedOfLightClaimIds),
  durationIntentSeconds: {minimum: 30, maximum: 35},
  script: {
    language: 'en',
    segments: [
      {
        id: speedOfLightPublishedScriptSegmentIds.hook,
        type: 'factual',
        text: hookText(speedOfLightHookIds.impossibleLaps),
        claimIds: [speedOfLightClaimIds.earthLapsPerSecond],
      },
      {
        id: speedOfLightPublishedScriptSegmentIds.speed,
        type: 'factual',
        text: 'In a vacuum, it travels nearly 300,000 kilometers every second.',
        claimIds: [speedOfLightClaimIds.vacuumSpeed],
      },
      {
        id: speedOfLightPublishedScriptSegmentIds.moon,
        type: 'factual',
        text: 'Earth to the Moon takes only about 1.28 seconds.',
        claimIds: [speedOfLightClaimIds.moonDistance, speedOfLightClaimIds.moonLightTime],
      },
      {
        id: speedOfLightPublishedScriptSegmentIds.sun,
        type: 'factual',
        text: 'Sunlight needs about eight minutes and twenty seconds to reach us.',
        claimIds: [speedOfLightClaimIds.sunLightTime],
      },
      {
        id: speedOfLightPublishedScriptSegmentIds.year,
        type: 'factual',
        text: 'In one year, light covers 9.46 trillion kilometers.',
        claimIds: [speedOfLightClaimIds.lightYearDistance, speedOfLightClaimIds.lightYearIsDistance],
      },
      {
        id: speedOfLightPublishedScriptSegmentIds.proxima,
        type: 'factual',
        text: 'Yet even at that speed, Proxima Centauri is still 4.25 years away.',
        claimIds: [speedOfLightClaimIds.proximaDistance],
      },
    ],
  },
  narrativeStructure: [
    {
      id: publishedBeatIds.hook,
      label: 'Hook',
      purpose: 'Make extraordinary speed tangible with one familiar planetary reference.',
      scriptSegmentIds: [speedOfLightPublishedScriptSegmentIds.hook],
    },
    {
      id: publishedBeatIds.anchor,
      label: 'Numerical anchor',
      purpose: 'Ground the opening comparison in the defined vacuum speed.',
      scriptSegmentIds: [speedOfLightPublishedScriptSegmentIds.speed],
    },
    {
      id: publishedBeatIds.expand,
      label: 'Distance escalation',
      purpose: 'Move from a second to seconds and then minutes as the reference distance grows.',
      scriptSegmentIds: [
        speedOfLightPublishedScriptSegmentIds.moon,
        speedOfLightPublishedScriptSegmentIds.sun,
      ],
    },
    {
      id: publishedBeatIds.explain,
      label: 'Unit explanation',
      purpose: 'Reframe one year of travel as a distance of 9.46 trillion kilometres.',
      scriptSegmentIds: [speedOfLightPublishedScriptSegmentIds.year],
    },
    {
      id: publishedBeatIds.payoff,
      label: 'Cosmic payoff',
      purpose: 'Reveal that the nearest neighboring star still requires years at light speed.',
      scriptSegmentIds: [speedOfLightPublishedScriptSegmentIds.proxima],
    },
  ],
  visualPlan: [
    {
      id: `${speedOfLightContentAssetIds.publishedShort}.visual.earth-laps`,
      narrativeBeatId: publishedBeatIds.hook,
      objective: 'Show seven and a half accumulated light paths around Earth in one second.',
      visualType: 'animation',
      scriptSegmentIds: [speedOfLightPublishedScriptSegmentIds.hook],
      claimIds: [speedOfLightClaimIds.earthCircumference, speedOfLightClaimIds.earthLapsPerSecond],
      notes: 'Treat the paths as an intuitive vacuum-speed comparison, not a literal atmospheric route.',
    },
    {
      id: `${speedOfLightContentAssetIds.publishedShort}.visual.speed-counter`,
      narrativeBeatId: publishedBeatIds.anchor,
      objective: 'Present the vacuum speed as an exact numerical anchor inside a velocity tunnel.',
      visualType: 'motion-typography',
      scriptSegmentIds: [speedOfLightPublishedScriptSegmentIds.speed],
      claimIds: [speedOfLightClaimIds.vacuumSpeed],
    },
    {
      id: `${speedOfLightContentAssetIds.publishedShort}.visual.moon-path`,
      narrativeBeatId: publishedBeatIds.expand,
      objective: 'Connect Earth and the Moon with a visible one-way light path and elapsed-time cue.',
      visualType: 'diagram',
      scriptSegmentIds: [speedOfLightPublishedScriptSegmentIds.moon],
      claimIds: [speedOfLightClaimIds.moonDistance, speedOfLightClaimIds.moonLightTime],
      notes: 'Use the average distance and identify the layout as illustrative rather than to scale.',
    },
    {
      id: `${speedOfLightContentAssetIds.publishedShort}.visual.sun-path`,
      narrativeBeatId: publishedBeatIds.expand,
      objective: 'Expand the same light-path language to the Sun–Earth travel time.',
      visualType: 'diagram',
      scriptSegmentIds: [speedOfLightPublishedScriptSegmentIds.sun],
      claimIds: [speedOfLightClaimIds.sunLightTime],
      notes: 'The displayed time is a rounded educational comparison because orbital distance varies.',
    },
    {
      id: `${speedOfLightContentAssetIds.publishedShort}.visual.light-year`,
      narrativeBeatId: publishedBeatIds.explain,
      objective: 'Turn one year of travel into a visible distance corridor and clarify the unit.',
      visualType: 'animation',
      scriptSegmentIds: [speedOfLightPublishedScriptSegmentIds.year],
      claimIds: [speedOfLightClaimIds.lightYearDistance, speedOfLightClaimIds.lightYearIsDistance],
    },
    {
      id: `${speedOfLightContentAssetIds.publishedShort}.visual.proxima`,
      narrativeBeatId: publishedBeatIds.payoff,
      objective: 'Extend the corridor to Proxima Centauri and make the multi-year travel time feel unresolved.',
      visualType: 'animation',
      scriptSegmentIds: [speedOfLightPublishedScriptSegmentIds.proxima],
      claimIds: [speedOfLightClaimIds.proximaDistance],
    },
  ],
  narrationPlan: {
    mode: 'narrated',
    voiceDirection: 'Measured and cinematic, with clean pauses as each distance scale expands.',
    pronunciationNotes: ['Pronounce Proxima Centauri as PROK-si-muh sen-TOR-eye.'],
  },
  editorialStatus: 'production-ready',
  approval: {
    approvedBy: 'Magnivis human editorial review',
    approvedAt: '2026-09-26',
    notes: 'Retrospective asset approval based on the reviewed and published Video 004 production.',
  },
});

const cosmicAssetId = speedOfLightContentAssetIds.cosmicDistanceShort;
const cosmicScriptIds = {
  hook: `${cosmicAssetId}.script.hook`,
  speed: `${cosmicAssetId}.script.speed`,
  sun: `${cosmicAssetId}.script.sun`,
  reframe: `${cosmicAssetId}.script.reframe`,
  lightYear: `${cosmicAssetId}.script.light-year`,
  proxima: `${cosmicAssetId}.script.proxima`,
  payoff: `${cosmicAssetId}.script.payoff`,
} as const;
const cosmicBeatIds = {
  hook: `${cosmicAssetId}.beat.hook`,
  establish: `${cosmicAssetId}.beat.establish`,
  contradiction: `${cosmicAssetId}.beat.contradiction`,
  explain: `${cosmicAssetId}.beat.explain`,
  payoff: `${cosmicAssetId}.beat.payoff`,
} as const;

export const speedOfLightCosmicDistanceAsset = contentAssetSchema.parse({
  id: cosmicAssetId,
  revision: 1,
  knowledgePackageId: speedOfLightKnowledgePackage.id,
  assetType: 'short-form-video',
  editorialPurpose: 'Explain why the universe still feels slow and inaccessible even when information travels at light speed.',
  storyAngle: 'Start at the nearest star and resolve the apparent contradiction between light’s extreme speed and the enormous scale of interstellar distance.',
  hookId: speedOfLightHookIds.nearestStarQuestion,
  selectedClaimIds: [
    speedOfLightClaimIds.vacuumSpeed,
    speedOfLightClaimIds.sunLightTime,
    speedOfLightClaimIds.lightYearDistance,
    speedOfLightClaimIds.lightYearIsDistance,
    speedOfLightClaimIds.proximaDistance,
  ],
  durationIntentSeconds: {minimum: 30, maximum: 40},
  script: {
    language: 'en',
    segments: [
      {
        id: cosmicScriptIds.hook,
        type: 'factual',
        text: hookText(speedOfLightHookIds.nearestStarQuestion),
        claimIds: [speedOfLightClaimIds.vacuumSpeed, speedOfLightClaimIds.proximaDistance],
      },
      {
        id: cosmicScriptIds.speed,
        type: 'factual',
        text: 'In a vacuum, light travels exactly 299,792,458 meters every second.',
        claimIds: [speedOfLightClaimIds.vacuumSpeed],
      },
      {
        id: cosmicScriptIds.sun,
        type: 'factual',
        text: 'That is fast enough for sunlight to reach Earth in about eight minutes and twenty seconds.',
        claimIds: [speedOfLightClaimIds.sunLightTime],
      },
      {
        id: cosmicScriptIds.reframe,
        type: 'editorial',
        text: 'The problem is not speed. It is scale.',
      },
      {
        id: cosmicScriptIds.lightYear,
        type: 'factual',
        text: 'A light-year is not a unit of time. It is about 9.46 trillion kilometers of distance.',
        claimIds: [speedOfLightClaimIds.lightYearIsDistance, speedOfLightClaimIds.lightYearDistance],
      },
      {
        id: cosmicScriptIds.proxima,
        type: 'factual',
        text: 'Proxima Centauri is still about 4.25 light-years away.',
        claimIds: [speedOfLightClaimIds.proximaDistance],
      },
      {
        id: cosmicScriptIds.payoff,
        type: 'editorial',
        text: 'Light is fast. Space is bigger.',
      },
    ],
  },
  narrativeStructure: [
    {
      id: cosmicBeatIds.hook,
      label: 'Nearest-star question',
      purpose: 'Open on the apparent impossibility that light still needs years to reach the nearest neighboring star.',
      scriptSegmentIds: [cosmicScriptIds.hook],
    },
    {
      id: cosmicBeatIds.establish,
      label: 'Establish the speed',
      purpose: 'Confirm light’s exact vacuum speed and make it tangible with Sun–Earth travel time.',
      scriptSegmentIds: [cosmicScriptIds.speed, cosmicScriptIds.sun],
    },
    {
      id: cosmicBeatIds.contradiction,
      label: 'Reframe the mystery',
      purpose: 'Shift the viewer from thinking about insufficient speed to thinking about enormous scale.',
      scriptSegmentIds: [cosmicScriptIds.reframe],
    },
    {
      id: cosmicBeatIds.explain,
      label: 'Explain the distance unit',
      purpose: 'Define the light-year as distance and reveal the size of a single unit.',
      scriptSegmentIds: [cosmicScriptIds.lightYear],
    },
    {
      id: cosmicBeatIds.payoff,
      label: 'Resolve the contradiction',
      purpose: 'Place Proxima more than four light-years away and land the scale-over-speed conclusion.',
      scriptSegmentIds: [cosmicScriptIds.proxima, cosmicScriptIds.payoff],
    },
  ],
  visualPlan: [
    {
      id: `${cosmicAssetId}.visual.unfinished-journey`,
      narrativeBeatId: cosmicBeatIds.hook,
      objective: 'Begin with a beam moving toward a barely visible star while a multi-year counter remains unfinished.',
      visualType: 'animation',
      scriptSegmentIds: [cosmicScriptIds.hook],
      claimIds: [speedOfLightClaimIds.proximaDistance],
      notes: 'Do not imply a scale-accurate star size; the visual represents travel time and distance.',
    },
    {
      id: `${cosmicAssetId}.visual.exact-speed`,
      narrativeBeatId: cosmicBeatIds.establish,
      objective: 'Use restrained motion typography to establish the exact vacuum speed.',
      visualType: 'motion-typography',
      scriptSegmentIds: [cosmicScriptIds.speed],
      claimIds: [speedOfLightClaimIds.vacuumSpeed],
    },
    {
      id: `${cosmicAssetId}.visual.sun-earth-clock`,
      narrativeBeatId: cosmicBeatIds.establish,
      objective: 'Compress the Sun–Earth path into an eight-minute clock to prove how fast light is locally.',
      visualType: 'diagram',
      scriptSegmentIds: [cosmicScriptIds.sun],
      claimIds: [speedOfLightClaimIds.sunLightTime],
      notes: 'Use the rounded educational value and avoid a scale-accurate layout claim.',
    },
    {
      id: `${cosmicAssetId}.visual.scale-reframe`,
      narrativeBeatId: cosmicBeatIds.contradiction,
      objective: 'Let the local solar-system diagram collapse into an almost invisible point inside a dark distance field.',
      visualType: 'animation',
      scriptSegmentIds: [cosmicScriptIds.reframe],
      claimIds: [],
    },
    {
      id: `${cosmicAssetId}.visual.light-year-ruler`,
      narrativeBeatId: cosmicBeatIds.explain,
      objective: 'Build one light-year as a distance ruler labeled 9.46 trillion kilometres rather than a clock.',
      visualType: 'diagram',
      scriptSegmentIds: [cosmicScriptIds.lightYear],
      claimIds: [speedOfLightClaimIds.lightYearIsDistance, speedOfLightClaimIds.lightYearDistance],
    },
    {
      id: `${cosmicAssetId}.visual.proxima-distance`,
      narrativeBeatId: cosmicBeatIds.payoff,
      objective: 'Stack more than four light-year rulers before revealing Proxima Centauri at the far endpoint.',
      visualType: 'animation',
      scriptSegmentIds: [cosmicScriptIds.proxima, cosmicScriptIds.payoff],
      claimIds: [speedOfLightClaimIds.proximaDistance],
    },
  ],
  narrationPlan: {
    mode: 'narrated',
    voiceDirection: 'Begin with quiet disbelief, become precise through the explanation, then leave a deliberate pause before the final line.',
    pronunciationNotes: ['Pronounce Proxima Centauri as PROK-si-muh sen-TOR-eye.'],
  },
  editorialStatus: 'draft',
});
