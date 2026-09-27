import {knowledgePackageSchema} from '../schema';

export const oceanDepthSourceIds = {
  noaaOceanDepth: 'source.noaa.ocean-depth',
  noaaOceanLight: 'source.noaa.ocean-light',
  nepalEverestGeology: 'source.nepal-dmg.everest-geology',
  noaaChallengerStudy: 'source.noaa.challenger-depth-2021',
} as const;

export const oceanDepthClaimIds = {
  lightZoneRange: 'ocean-depth.claim.light-zone-range',
  lightZoneContext: 'ocean-depth.claim.light-zone-context',
  averageDepth: 'ocean-depth.claim.global-average-depth',
  everestElevation: 'ocean-depth.claim.everest-elevation',
  challengerDepth: 'ocean-depth.claim.challenger-depth',
  everestClearance: 'ocean-depth.claim.everest-clearance',
  challengerDeepest: 'ocean-depth.claim.challenger-deepest',
} as const;

export const oceanDepthHookIds = {
  everestDisappears: 'ocean-depth.hook.everest-disappears',
  sunlightQuestion: 'ocean-depth.hook.sunlight-question',
  trenchScenario: 'ocean-depth.hook.trench-scenario',
  averageContrast: 'ocean-depth.hook.average-contrast',
} as const;

const reviewed = {
  reviewedBy: 'Magnivis human editorial review',
  reviewedAt: '2026-09-27',
} as const;

export const oceanDepthKnowledgePackage = knowledgePackageSchema.parse({
  id: 'ocean-depth',
  revision: 1,
  topic: 'Ocean light zones, average depth, and the scale of Challenger Deep',
  centralQuestion: 'How does the ocean change with depth, and how deep is its deepest observed point compared with Mount Everest?',
  taxonomy: {
    pillar: 'earth-nature',
    domains: ['oceanography', 'marine-science'],
    topics: ['ocean-light-zones', 'ocean-depth', 'challenger-deep', 'mount-everest'],
  },
  timeliness: 'evergreen',
  thesis: 'The ocean passes through conventional light zones long before the average seafloor, while Challenger Deep extends far enough below mean sea level to cover Mount Everest by roughly two kilometres.',
  viewerPayoff: 'The viewer gains an intuitive descent from diminishing sunlight to the average seafloor and finally a survey-aware Everest comparison at Challenger Deep.',
  sources: [
    {
      id: oceanDepthSourceIds.noaaOceanDepth,
      organization: 'NOAA National Ocean Service',
      title: 'How deep is the ocean?',
      sourceType: 'government',
      url: 'https://oceanservice.noaa.gov/facts/oceandepth.html',
      retrieved: '2026-09-24',
    },
    {
      id: oceanDepthSourceIds.noaaOceanLight,
      organization: 'NOAA National Ocean Service',
      title: 'How far does light travel in the ocean?',
      sourceType: 'government',
      url: 'https://oceanservice.noaa.gov/facts/light_travel.html',
      retrieved: '2026-09-24',
    },
    {
      id: oceanDepthSourceIds.nepalEverestGeology,
      organization: 'Government of Nepal, Department of Mines and Geology',
      title: 'General Geology — Nepal Himalaya',
      sourceType: 'government',
      url: 'https://dmgnepal.gov.np/en/pages/general-geology-4128',
      retrieved: '2026-09-24',
    },
    {
      id: oceanDepthSourceIds.noaaChallengerStudy,
      organization: 'Deep Sea Research Part I / NOAA Institutional Repository',
      title: 'Revised depth of the Challenger Deep from submersible transects; including a general method for precise, pressure-derived depths in the ocean',
      sourceType: 'peer-reviewed',
      url: 'https://repository.library.noaa.gov/view/noaa/33477',
      retrieved: '2026-09-27',
      notes: '2021 journal article reporting a pressure-derived depth estimate with a 95% confidence interval.',
    },
  ],
  claims: [
    {
      id: oceanDepthClaimIds.lightZoneRange,
      type: 'quantitative',
      statement: 'NOAA conventionally places the ocean twilight zone between approximately 200 and 1,000 metres deep.',
      quantity: {
        kind: 'range',
        minimum: 200,
        maximum: 1000,
        unit: 'm',
        precision: 'approximate',
      },
      basis: 'defined',
      display: '≈200–1,000 m',
      evidence: [{
        sourceId: oceanDepthSourceIds.noaaOceanLight,
        locator: 'Dysphotic Zone / infographic transcript',
        notes: 'NOAA identifies the dysphotic or twilight zone as the interval from 200 to 1,000 metres.',
      }],
      verificationStatus: 'verified',
      caveats: [
        'These are conventional zone boundaries rather than universal hard optical cutoffs.',
        'Actual light penetration varies with wavelength, water clarity, particles, season, and location.',
      ],
      review: reviewed,
    },
    {
      id: oceanDepthClaimIds.lightZoneContext,
      type: 'qualitative',
      statement: 'Significant surface sunlight is rare beyond roughly 200 metres, diminishes through the twilight zone, and does not penetrate below roughly 1,000 metres in NOAA’s generalized classification.',
      evidence: [{
        sourceId: oceanDepthSourceIds.noaaOceanLight,
        locator: 'Opening summary and zone descriptions',
        notes: 'NOAA states that significant light is rare beyond 200 metres, may be detectable to about 1,000 metres under the right conditions, and does not penetrate the aphotic zone below that boundary.',
      }],
      verificationStatus: 'verified',
      caveats: [
        'Sunlight attenuates continuously rather than disappearing at one exact depth.',
        'Aphotic means no surface sunlight; organisms can still produce bioluminescent light.',
      ],
      review: reviewed,
    },
    {
      id: oceanDepthClaimIds.averageDepth,
      type: 'quantitative',
      statement: 'The global average ocean depth is approximately 3,682 metres.',
      quantity: {
        kind: 'scalar',
        value: 3682,
        unit: 'm',
        precision: 'approximate',
      },
      basis: 'estimated',
      display: '≈3,682 m',
      evidence: [{
        sourceId: oceanDepthSourceIds.noaaOceanDepth,
        notes: 'NOAA reports the global average ocean depth as about 3,682 metres.',
      }],
      verificationStatus: 'verified',
      caveats: ['This is a global average; local seafloor depth varies widely.'],
      review: reviewed,
    },
    {
      id: oceanDepthClaimIds.everestElevation,
      type: 'quantitative',
      statement: 'Mount Everest’s official elevation is 8,848.86 metres above mean sea level.',
      quantity: {
        kind: 'scalar',
        value: 8848.86,
        unit: 'm',
        precision: 'rounded',
      },
      basis: 'measured',
      display: '8,848.86 m',
      evidence: [{
        sourceId: oceanDepthSourceIds.nepalEverestGeology,
        locator: 'Nepal Himalaya',
        notes: 'The Government of Nepal page states an elevation of 8,848.86 metres.',
      }],
      verificationStatus: 'verified',
      caveats: ['The production rounds the displayed mountain height where appropriate.'],
      review: reviewed,
    },
    {
      id: oceanDepthClaimIds.challengerDepth,
      type: 'quantitative',
      statement: 'A 2021 pressure-derived estimate placed the deepest observed Challenger Deep seafloor at 10,935 metres below mean sea level, with ±6 metres at 95% confidence.',
      quantity: {
        kind: 'scalar',
        value: 10935,
        unit: 'm',
        precision: 'approximate',
        uncertainty: {
          plusMinus: 6,
          confidence: '95% confidence interval',
        },
      },
      basis: 'estimated',
      display: '10,935 m ±6 m (95% CI)',
      evidence: [
        {
          sourceId: oceanDepthSourceIds.noaaOceanDepth,
          notes: 'NOAA’s public explainer uses approximately 10,935 metres for Challenger Deep.',
        },
        {
          sourceId: oceanDepthSourceIds.noaaChallengerStudy,
          locator: 'Abstract / Results',
          notes: 'The peer-reviewed 2021 study reports 10,935 metres with ±6 metres at 95% confidence from pressure-derived observations.',
        },
      ],
      verificationStatus: 'verified',
      caveats: [
        'This is a survey-specific estimate, not an immutable exact depth.',
        'Published Challenger Deep values vary with location, instrumentation, corrections, and survey method.',
      ],
      review: reviewed,
    },
    {
      id: oceanDepthClaimIds.everestClearance,
      type: 'quantitative',
      statement: 'Using the 10,935-metre Challenger Deep estimate and Everest’s 8,848.86-metre elevation, the hypothetical vertical clearance above Everest’s summit is approximately 2,086.14 metres.',
      quantity: {
        kind: 'scalar',
        value: 10935 - 8848.86,
        unit: 'm',
        precision: 'approximate',
        uncertainty: {
          plusMinus: 6,
          confidence: 'Inherited from the Challenger Deep estimate; Everest measurement uncertainty not propagated',
        },
      },
      basis: 'derived',
      display: '≈2.09 km',
      evidence: [
        {
          sourceId: oceanDepthSourceIds.noaaChallengerStudy,
          notes: 'Provides the 10,935-metre central depth estimate and its measurement uncertainty.',
        },
        {
          sourceId: oceanDepthSourceIds.nepalEverestGeology,
          notes: 'Provides the 8,848.86-metre Everest elevation used in the subtraction.',
        },
      ],
      verificationStatus: 'verified',
      caveats: [
        'This is a vertical scale comparison, not a claim that Everest could be physically relocated intact.',
        'The result depends on the selected Challenger Deep survey estimate and reference to mean sea level.',
      ],
      review: reviewed,
    },
    {
      id: oceanDepthClaimIds.challengerDeepest,
      type: 'qualitative',
      statement: 'Challenger Deep is generally considered the deepest observed area of the world ocean.',
      evidence: [
        {
          sourceId: oceanDepthSourceIds.noaaOceanDepth,
          notes: 'NOAA identifies Challenger Deep as the deepest part of the ocean.',
        },
        {
          sourceId: oceanDepthSourceIds.noaaChallengerStudy,
          notes: 'The study describes Challenger Deep as generally considered the deepest area of the world’s oceans.',
        },
      ],
      verificationStatus: 'verified',
      caveats: ['“Deepest ocean” in the production is shorthand for the deepest observed point/area, not the depth of the ocean as a whole.'],
      review: reviewed,
    },
  ],
  caveats: [
    {
      id: 'ocean-depth.caveat.light-boundaries',
      statement: 'The 200-metre and 1,000-metre markers are useful NOAA classification boundaries, but real light attenuation is continuous and context-dependent.',
      claimIds: [oceanDepthClaimIds.lightZoneRange, oceanDepthClaimIds.lightZoneContext],
    },
    {
      id: 'ocean-depth.caveat.biological-light',
      statement: 'The aphotic zone lacks surface sunlight, but bioluminescent organisms can produce light there.',
      claimIds: [oceanDepthClaimIds.lightZoneContext],
    },
    {
      id: 'ocean-depth.caveat.challenger-survey',
      statement: 'The production uses the NOAA-linked 10,935-metre central estimate; other authoritative surveys can report different values.',
      claimIds: [oceanDepthClaimIds.challengerDepth, oceanDepthClaimIds.everestClearance],
    },
    {
      id: 'ocean-depth.caveat.everest-comparison',
      statement: 'The Everest scene is an illustrative vertical-height comparison whose quantitative ratio uses one shared scale.',
      claimIds: [
        oceanDepthClaimIds.everestElevation,
        oceanDepthClaimIds.challengerDepth,
        oceanDepthClaimIds.everestClearance,
      ],
    },
  ],
  hooks: [
    {
      id: oceanDepthHookIds.everestDisappears,
      archetype: 'impossible-sounding-fact',
      text: 'The deepest ocean could swallow Mount Everest.',
      viewerPromise: 'Make the deepest observed ocean point intuitive using the world’s tallest mountain.',
      claimIds: [oceanDepthClaimIds.challengerDeepest, oceanDepthClaimIds.everestClearance],
    },
    {
      id: oceanDepthHookIds.sunlightQuestion,
      archetype: 'question',
      text: 'How deep can sunlight actually reach into the ocean?',
      viewerPromise: 'Descend through the conventional light zones and explain why their boundaries are approximate.',
      claimIds: [oceanDepthClaimIds.lightZoneRange, oceanDepthClaimIds.lightZoneContext],
    },
    {
      id: oceanDepthHookIds.trenchScenario,
      archetype: 'scenario',
      text: 'Put Mount Everest at Challenger Deep. Its summit is still underwater.',
      viewerPromise: 'Resolve the comparison with a source-backed vertical clearance.',
      claimIds: [
        oceanDepthClaimIds.everestElevation,
        oceanDepthClaimIds.challengerDepth,
        oceanDepthClaimIds.everestClearance,
      ],
    },
    {
      id: oceanDepthHookIds.averageContrast,
      archetype: 'comparison',
      text: 'The average ocean is deep. Challenger Deep is almost three times deeper.',
      viewerPromise: 'Contrast the global average with the exceptional depth of one trench.',
      claimIds: [oceanDepthClaimIds.averageDepth, oceanDepthClaimIds.challengerDepth],
    },
  ],
  narrativeOpportunities: [
    {
      id: 'ocean-depth.narrative.surface-to-trench',
      title: 'Surface-to-trench descent',
      description: 'Move from light-zone transitions to average depth before using Everest to reveal the exceptional scale of Challenger Deep.',
      claimIds: [
        oceanDepthClaimIds.lightZoneRange,
        oceanDepthClaimIds.lightZoneContext,
        oceanDepthClaimIds.averageDepth,
        oceanDepthClaimIds.challengerDepth,
        oceanDepthClaimIds.everestClearance,
      ],
    },
    {
      id: 'ocean-depth.narrative.boundaries-not-walls',
      title: 'Scientific boundaries are not walls',
      description: 'Use the light zones to explain how conventional classifications can be useful even when the underlying phenomenon changes continuously.',
      claimIds: [oceanDepthClaimIds.lightZoneRange, oceanDepthClaimIds.lightZoneContext],
    },
  ],
  visualOpportunities: [
    {
      id: 'ocean-depth.visual.light-column',
      title: 'Light attenuation column',
      description: 'Descend through a continuous light gradient while marking the conventional 200-metre and 1,000-metre boundaries.',
      claimIds: [oceanDepthClaimIds.lightZoneRange, oceanDepthClaimIds.lightZoneContext],
    },
    {
      id: 'ocean-depth.visual.everest-scale',
      title: 'Everest inside Challenger Deep',
      description: 'Use one vertical scale for the mountain and trench, preserving the approximate survey-dependent clearance.',
      claimIds: [
        oceanDepthClaimIds.everestElevation,
        oceanDepthClaimIds.challengerDepth,
        oceanDepthClaimIds.everestClearance,
      ],
    },
  ],
  relatedQuestions: [
    'Why do different wavelengths of light disappear at different ocean depths?',
    'How are extreme ocean depths measured from ships and submersibles?',
    'What is the difference between the midnight, abyssal, and hadal zones?',
  ],
  followUpOpportunities: [
    'Explain why Challenger Deep measurements differ between surveys.',
    'Visualize ocean pressure from the surface to the hadal zone.',
    'Compare the deepest ocean trenches with the average seafloor.',
  ],
  editorialStatus: 'approved',
  approval: {
    approvedBy: 'Magnivis human editorial review',
    approvedAt: '2026-09-27',
    notes: 'Retrospective package approval after auditing the published Video 002 research. The production is preserved, while package caveats record that light-zone boundaries are approximate and “total darkness” excludes surface sunlight but not bioluminescence.',
  },
});
