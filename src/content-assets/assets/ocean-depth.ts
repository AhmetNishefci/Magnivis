import {
  oceanDepthClaimIds,
  oceanDepthHookIds,
  oceanDepthKnowledgePackage,
} from '../../knowledge/packages/ocean-depth';
import {contentAssetSchema} from '../schema';

export const oceanDepthContentAssetIds = {
  publishedShort: 'ocean-depth.asset.everest-descent',
} as const;

export const oceanDepthPublishedScriptSegmentIds = {
  hook: `${oceanDepthContentAssetIds.publishedShort}.script.hook`,
  light: `${oceanDepthContentAssetIds.publishedShort}.script.light`,
  dark: `${oceanDepthContentAssetIds.publishedShort}.script.dark`,
  average: `${oceanDepthContentAssetIds.publishedShort}.script.average`,
  everest: `${oceanDepthContentAssetIds.publishedShort}.script.everest`,
  clearance: `${oceanDepthContentAssetIds.publishedShort}.script.clearance`,
  coda: `${oceanDepthContentAssetIds.publishedShort}.script.coda`,
} as const;

const hookText = (hookId: string) => {
  const hook = oceanDepthKnowledgePackage.hooks.find(({id}) => id === hookId);
  if (!hook) throw new Error(`Missing Ocean Depth hook: ${hookId}`);
  return hook.text;
};

const assetId = oceanDepthContentAssetIds.publishedShort;
const beatIds = {
  hook: `${assetId}.beat.hook`,
  light: `${assetId}.beat.light-zones`,
  average: `${assetId}.beat.average-depth`,
  comparison: `${assetId}.beat.everest-comparison`,
  payoff: `${assetId}.beat.challenger-payoff`,
} as const;

export const oceanDepthPublishedShortAsset = contentAssetSchema.parse({
  id: assetId,
  revision: 1,
  knowledgePackageId: oceanDepthKnowledgePackage.id,
  assetType: 'short-form-video',
  editorialPurpose: 'Make the ocean’s depth intuitive by descending through light zones and placing Mount Everest inside Challenger Deep.',
  storyAngle: 'Begin with the impossible-sounding Everest comparison, descend from fading sunlight to the average seafloor, then resolve the opening with a shared-scale Challenger Deep comparison.',
  hookId: oceanDepthHookIds.everestDisappears,
  selectedClaimIds: Object.values(oceanDepthClaimIds),
  durationIntentSeconds: {minimum: 30, maximum: 33},
  script: {
    language: 'en',
    segments: [
      {
        id: oceanDepthPublishedScriptSegmentIds.hook,
        type: 'factual',
        text: hookText(oceanDepthHookIds.everestDisappears),
        claimIds: [
          oceanDepthClaimIds.challengerDeepest,
          oceanDepthClaimIds.everestClearance,
        ],
      },
      {
        id: oceanDepthPublishedScriptSegmentIds.light,
        type: 'factual',
        text: 'After two hundred meters, sunlight is already fading.',
        claimIds: [
          oceanDepthClaimIds.lightZoneRange,
          oceanDepthClaimIds.lightZoneContext,
        ],
      },
      {
        id: oceanDepthPublishedScriptSegmentIds.dark,
        type: 'factual',
        text: 'At one thousand meters, it disappears.',
        claimIds: [
          oceanDepthClaimIds.lightZoneRange,
          oceanDepthClaimIds.lightZoneContext,
        ],
      },
      {
        id: oceanDepthPublishedScriptSegmentIds.average,
        type: 'factual',
        text: 'The average ocean is nearly three point seven kilometers deep.',
        claimIds: [oceanDepthClaimIds.averageDepth],
      },
      {
        id: oceanDepthPublishedScriptSegmentIds.everest,
        type: 'editorial',
        text: 'Now place Mount Everest on the bottom.',
      },
      {
        id: oceanDepthPublishedScriptSegmentIds.clearance,
        type: 'factual',
        text: 'Its summit would still be more than two kilometers underwater.',
        claimIds: [
          oceanDepthClaimIds.everestElevation,
          oceanDepthClaimIds.challengerDepth,
          oceanDepthClaimIds.everestClearance,
        ],
      },
      {
        id: oceanDepthPublishedScriptSegmentIds.coda,
        type: 'factual',
        text: 'Challenger Deep. Nearly eleven kilometers below the surface.',
        claimIds: [
          oceanDepthClaimIds.challengerDepth,
          oceanDepthClaimIds.challengerDeepest,
        ],
      },
    ],
  },
  narrativeStructure: [
    {
      id: beatIds.hook,
      label: 'Hook',
      purpose: 'Open on the complete Everest contradiction before explaining the scale.',
      scriptSegmentIds: [oceanDepthPublishedScriptSegmentIds.hook],
    },
    {
      id: beatIds.light,
      label: 'Light-zone descent',
      purpose: 'Use conventional scientific boundaries to make the first kilometre of descent legible.',
      scriptSegmentIds: [
        oceanDepthPublishedScriptSegmentIds.light,
        oceanDepthPublishedScriptSegmentIds.dark,
      ],
    },
    {
      id: beatIds.average,
      label: 'Average-depth anchor',
      purpose: 'Establish the ordinary global scale before the extreme comparison.',
      scriptSegmentIds: [oceanDepthPublishedScriptSegmentIds.average],
    },
    {
      id: beatIds.comparison,
      label: 'Everest comparison',
      purpose: 'Place Everest on the same vertical scale and reveal the remaining water above its summit.',
      scriptSegmentIds: [
        oceanDepthPublishedScriptSegmentIds.everest,
        oceanDepthPublishedScriptSegmentIds.clearance,
      ],
    },
    {
      id: beatIds.payoff,
      label: 'Named payoff',
      purpose: 'Name Challenger Deep and end on its approximately eleven-kilometre depth.',
      scriptSegmentIds: [oceanDepthPublishedScriptSegmentIds.coda],
    },
  ],
  visualPlan: [
    {
      id: `${assetId}.visual.opening-comparison`,
      narrativeBeatId: beatIds.hook,
      objective: 'Show Everest fully submerged inside a stylized Challenger Deep cross-section.',
      visualType: 'diagram',
      scriptSegmentIds: [oceanDepthPublishedScriptSegmentIds.hook],
      claimIds: [
        oceanDepthClaimIds.challengerDeepest,
        oceanDepthClaimIds.everestClearance,
      ],
      notes: 'This is a vertical scale comparison, not a literal relocation scenario.',
    },
    {
      id: `${assetId}.visual.light-descent`,
      narrativeBeatId: beatIds.light,
      objective: 'Move through a continuous light gradient while marking the conventional 200- and 1,000-metre boundaries.',
      visualType: 'animation',
      scriptSegmentIds: [
        oceanDepthPublishedScriptSegmentIds.light,
        oceanDepthPublishedScriptSegmentIds.dark,
      ],
      claimIds: [
        oceanDepthClaimIds.lightZoneRange,
        oceanDepthClaimIds.lightZoneContext,
      ],
      notes: 'The published “total darkness” headline means no surface sunlight; it does not exclude bioluminescence or imply an instantaneous optical cutoff.',
    },
    {
      id: `${assetId}.visual.average-depth`,
      narrativeBeatId: beatIds.average,
      objective: 'Continue the depth gauge to the approximate global-average seafloor.',
      visualType: 'motion-typography',
      scriptSegmentIds: [oceanDepthPublishedScriptSegmentIds.average],
      claimIds: [oceanDepthClaimIds.averageDepth],
    },
    {
      id: `${assetId}.visual.everest-scale`,
      narrativeBeatId: beatIds.comparison,
      objective: 'Place Everest and Challenger Deep on one shared vertical scale and reveal the approximate summit clearance.',
      visualType: 'diagram',
      scriptSegmentIds: [
        oceanDepthPublishedScriptSegmentIds.everest,
        oceanDepthPublishedScriptSegmentIds.clearance,
      ],
      claimIds: [
        oceanDepthClaimIds.everestElevation,
        oceanDepthClaimIds.challengerDepth,
        oceanDepthClaimIds.everestClearance,
      ],
      notes: 'The clearance inherits the uncertainty and survey context of the selected Challenger Deep estimate.',
    },
    {
      id: `${assetId}.visual.challenger-label`,
      narrativeBeatId: beatIds.payoff,
      objective: 'Name the deepest observed ocean area and display the rounded NOAA-linked depth estimate.',
      visualType: 'motion-typography',
      scriptSegmentIds: [oceanDepthPublishedScriptSegmentIds.coda],
      claimIds: [
        oceanDepthClaimIds.challengerDepth,
        oceanDepthClaimIds.challengerDeepest,
      ],
      notes: 'Present 10,935 metres as approximate and survey-dependent, even though the existing production uses a concise display.',
    },
  ],
  narrationPlan: {
    mode: 'narrated',
    voiceDirection: 'Calm and cinematic, increasing weight as the descent moves from light zones to Challenger Deep.',
    pronunciationNotes: ['Pronounce Challenger as CHAL-in-jer.'],
  },
  editorialStatus: 'production-ready',
  approval: {
    approvedBy: 'Magnivis human editorial review',
    approvedAt: '2026-09-24',
    notes: 'Retrospective asset representation of the reviewed and published Video 002 production; source caveats are preserved without changing its narration.',
  },
});
