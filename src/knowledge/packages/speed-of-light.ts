import {knowledgePackageSchema} from '../schema';

export const speedOfLightSourceIds = {
  nistSiBaseUnits: 'source.nist.si-base-units',
  nasaEarthMoonNumbers: 'source.nasa.earth-moon-numbers',
  nasaSunLightTime: 'source.nasa.sun-light-time',
  nasaLightYear: 'source.nasa.light-year',
} as const;

export const speedOfLightClaimIds = {
  vacuumSpeed: 'speed-of-light.claim.vacuum-speed',
  earthCircumference: 'speed-of-light.claim.earth-equatorial-circumference',
  earthLapsPerSecond: 'speed-of-light.claim.earth-laps-per-second',
  moonDistance: 'speed-of-light.claim.earth-moon-average-distance',
  moonLightTime: 'speed-of-light.claim.earth-moon-light-time',
  sunLightTime: 'speed-of-light.claim.sun-earth-light-time',
  lightYearDistance: 'speed-of-light.claim.light-year-distance',
  proximaDistance: 'speed-of-light.claim.proxima-distance',
  lightYearIsDistance: 'speed-of-light.claim.light-year-is-distance',
} as const;

export const speedOfLightHookIds = {
  impossibleLaps: 'speed-of-light.hook.impossible-laps',
  cosmicContradiction: 'speed-of-light.hook.cosmic-contradiction',
  nearestStarQuestion: 'speed-of-light.hook.nearest-star-question',
  proximaScenario: 'speed-of-light.hook.proxima-scenario',
} as const;

const reviewed = {
  reviewedBy: 'Magnivis human editorial review',
  reviewedAt: '2026-09-26',
} as const;

export const speedOfLightKnowledgePackage = knowledgePackageSchema.parse({
  id: 'speed-of-light',
  revision: 1,
  topic: 'The speed of light across planetary and interstellar distances',
  centralQuestion: 'How fast is light, and why do cosmic distances still make it feel slow?',
  taxonomy: {
    pillar: 'science-reality',
    domains: ['physics', 'astronomy'],
    topics: ['speed-of-light', 'light-travel-time', 'cosmic-distance'],
  },
  timeliness: 'evergreen',
  thesis: 'Light crosses familiar planetary distances almost instantly, but the scale of space turns even nature’s speed limit into years of travel.',
  viewerPayoff: 'The viewer gains an intuitive ladder from Earth laps to the Moon, Sun, a light-year, and Proxima Centauri—and understands that a light-year measures distance.',
  sources: [
    {
      id: speedOfLightSourceIds.nistSiBaseUnits,
      organization: 'National Institute of Standards and Technology',
      title: 'Definitions of SI Base Units',
      sourceType: 'government',
      url: 'https://www.nist.gov/si-redefinition/definitions-si-base-units',
      retrieved: '2026-09-25',
    },
    {
      id: speedOfLightSourceIds.nasaEarthMoonNumbers,
      organization: 'NASA Science',
      title: 'Compare Earth and the Moon',
      sourceType: 'government',
      url: 'https://science.nasa.gov/moon/by-the-numbers/',
      retrieved: '2026-09-25',
    },
    {
      id: speedOfLightSourceIds.nasaSunLightTime,
      organization: 'NASA Science',
      title: 'All About the Sun',
      sourceType: 'government',
      url: 'https://spaceplace.nasa.gov/all-about-the-sun/en/',
      retrieved: '2026-09-25',
    },
    {
      id: speedOfLightSourceIds.nasaLightYear,
      organization: 'NASA Science',
      title: 'What Is a Light-Year?',
      sourceType: 'government',
      url: 'https://science.nasa.gov/exoplanets/what-is-a-light-year/',
      retrieved: '2026-09-25',
    },
  ],
  claims: [
    {
      id: speedOfLightClaimIds.vacuumSpeed,
      type: 'quantitative',
      statement: 'The speed of light in vacuum is exactly 299,792,458 metres per second.',
      quantity: {kind: 'scalar', value: 299_792_458, unit: 'm/s', precision: 'exact'},
      basis: 'defined',
      display: '299,792,458 m/s',
      evidence: [{
        sourceId: speedOfLightSourceIds.nistSiBaseUnits,
        notes: 'NIST states the exact numerical value used in the SI definition of the metre.',
      }],
      verificationStatus: 'verified',
      caveats: ['The exact value applies to propagation in vacuum.'],
      review: reviewed,
    },
    {
      id: speedOfLightClaimIds.earthCircumference,
      type: 'quantitative',
      statement: 'Earth’s equatorial circumference is 40,030.2 kilometres.',
      quantity: {kind: 'scalar', value: 40_030.2, unit: 'km', precision: 'rounded'},
      basis: 'measured',
      display: '40,030.2 km',
      evidence: [{
        sourceId: speedOfLightSourceIds.nasaEarthMoonNumbers,
        notes: 'NASA provides the equatorial circumference used for the lap comparison.',
      }],
      verificationStatus: 'verified',
      caveats: ['The comparison uses equatorial rather than meridional circumference.'],
      review: reviewed,
    },
    {
      id: speedOfLightClaimIds.earthLapsPerSecond,
      type: 'quantitative',
      statement: 'In one second, light in vacuum travels approximately 7.5 Earth equatorial circumferences.',
      quantity: {kind: 'scalar', value: (299_792_458 / 1000) / 40_030.2, unit: 'count', precision: 'approximate'},
      basis: 'derived',
      display: '≈7.5 times',
      evidence: [
        {
          sourceId: speedOfLightSourceIds.nistSiBaseUnits,
          notes: 'Provides the exact vacuum speed used in the numerator.',
        },
        {
          sourceId: speedOfLightSourceIds.nasaEarthMoonNumbers,
          notes: 'Provides Earth’s equatorial circumference used in the denominator.',
        },
      ],
      verificationStatus: 'verified',
      caveats: ['Derived as 299,792.458 km/s divided by 40,030.2 km; it is an illustrative vacuum-speed comparison.'],
      review: reviewed,
    },
    {
      id: speedOfLightClaimIds.moonDistance,
      type: 'quantitative',
      statement: 'The Moon’s average orbital distance from Earth is 384,400 kilometres.',
      quantity: {kind: 'scalar', value: 384_400, unit: 'km', precision: 'rounded'},
      basis: 'measured',
      display: '384,400 km',
      evidence: [{
        sourceId: speedOfLightSourceIds.nasaEarthMoonNumbers,
        notes: 'NASA provides the average orbital distance used by the production.',
      }],
      verificationStatus: 'verified',
      caveats: ['The instantaneous Earth–Moon distance varies through the Moon’s orbit.'],
      review: reviewed,
    },
    {
      id: speedOfLightClaimIds.moonLightTime,
      type: 'quantitative',
      statement: 'Light crosses the average Earth–Moon distance in approximately 1.28 seconds.',
      quantity: {kind: 'scalar', value: 384_400 / (299_792_458 / 1000), unit: 's', precision: 'approximate'},
      basis: 'derived',
      display: '≈1.28 seconds',
      evidence: [
        {
          sourceId: speedOfLightSourceIds.nistSiBaseUnits,
          notes: 'Provides the exact vacuum speed used in the derivation.',
        },
        {
          sourceId: speedOfLightSourceIds.nasaEarthMoonNumbers,
          notes: 'Provides the average Earth–Moon distance used in the derivation.',
        },
      ],
      verificationStatus: 'verified',
      caveats: ['This is a one-way time derived from an average orbital distance.'],
      review: reviewed,
    },
    {
      id: speedOfLightClaimIds.sunLightTime,
      type: 'quantitative',
      statement: 'Sunlight takes approximately 8 minutes 20 seconds to reach Earth.',
      quantity: {kind: 'scalar', value: 8 + 20 / 60, unit: 'minutes', precision: 'approximate'},
      basis: 'estimated',
      display: '≈8 min 20 sec',
      evidence: [{
        sourceId: speedOfLightSourceIds.nasaSunLightTime,
        notes: 'NASA gives the rounded educational light-travel time used in the production.',
      }],
      verificationStatus: 'verified',
      caveats: ['Earth–Sun distance varies through Earth’s orbit, so the displayed time is rounded.'],
      review: reviewed,
    },
    {
      id: speedOfLightClaimIds.lightYearDistance,
      type: 'quantitative',
      statement: 'One light-year is approximately 9.46 trillion kilometres.',
      quantity: {kind: 'scalar', value: 9.46e12, unit: 'km', precision: 'approximate'},
      basis: 'estimated',
      display: '≈9.46 trillion km',
      evidence: [{
        sourceId: speedOfLightSourceIds.nasaLightYear,
        notes: 'NASA provides the rounded distance represented by one light-year.',
      }],
      verificationStatus: 'verified',
      caveats: ['The production deliberately uses NASA’s rounded educational value.'],
      review: reviewed,
    },
    {
      id: speedOfLightClaimIds.proximaDistance,
      type: 'quantitative',
      statement: 'Proxima Centauri is approximately 4.25 light-years away.',
      quantity: {kind: 'scalar', value: 4.25, unit: 'light-years', precision: 'approximate'},
      basis: 'estimated',
      display: '≈4.25 light-years',
      evidence: [{
        sourceId: speedOfLightSourceIds.nasaLightYear,
        notes: 'NASA gives the rounded distance to the nearest neighboring star beyond the Sun.',
      }],
      verificationStatus: 'verified',
      caveats: ['The production uses the rounded NASA educational value rather than false extra precision.'],
      review: reviewed,
    },
    {
      id: speedOfLightClaimIds.lightYearIsDistance,
      type: 'qualitative',
      statement: 'A light-year is a measure of distance, not time.',
      evidence: [{
        sourceId: speedOfLightSourceIds.nasaLightYear,
        notes: 'NASA defines a light-year as the distance light travels in one Earth year.',
      }],
      verificationStatus: 'verified',
      caveats: [],
      review: reviewed,
    },
  ],
  caveats: [
    {
      id: 'speed-of-light.caveat.vacuum',
      statement: 'The exact SI speed used by the video is explicitly the speed of light in vacuum.',
      claimIds: [speedOfLightClaimIds.vacuumSpeed, speedOfLightClaimIds.earthLapsPerSecond],
    },
    {
      id: 'speed-of-light.caveat.variable-distances',
      statement: 'Earth–Moon and Earth–Sun distances vary; their displayed light-times are average or rounded educational comparisons.',
      claimIds: [speedOfLightClaimIds.moonDistance, speedOfLightClaimIds.moonLightTime, speedOfLightClaimIds.sunLightTime],
    },
    {
      id: 'speed-of-light.caveat.illustrative-layout',
      statement: 'The distance diagrams communicate sequence and comparison but are not drawn to a common spatial scale.',
      claimIds: [speedOfLightClaimIds.moonDistance, speedOfLightClaimIds.sunLightTime, speedOfLightClaimIds.proximaDistance],
    },
  ],
  hooks: [
    {
      id: speedOfLightHookIds.impossibleLaps,
      archetype: 'impossible-sounding-fact',
      text: 'In one second, light could circle Earth seven and a half times.',
      viewerPromise: 'Make an abstract universal constant physically intuitive using Earth as the reference.',
      claimIds: [speedOfLightClaimIds.earthLapsPerSecond],
    },
    {
      id: speedOfLightHookIds.cosmicContradiction,
      archetype: 'contradiction',
      text: 'Light is fast. Space is bigger.',
      viewerPromise: 'Resolve the contradiction by escalating from planetary to interstellar distance.',
      claimIds: [speedOfLightClaimIds.vacuumSpeed, speedOfLightClaimIds.proximaDistance],
    },
    {
      id: speedOfLightHookIds.nearestStarQuestion,
      archetype: 'question',
      text: 'Why does light still need more than four years to reach the nearest star?',
      viewerPromise: 'Explain why extreme speed does not make interstellar distance feel small.',
      claimIds: [speedOfLightClaimIds.vacuumSpeed, speedOfLightClaimIds.proximaDistance],
    },
    {
      id: speedOfLightHookIds.proximaScenario,
      archetype: 'scenario',
      text: 'Send a beam toward Proxima Centauri today. It will still be traveling four years from now.',
      viewerPromise: 'Turn a distance measurement into a concrete waiting-time scenario.',
      claimIds: [speedOfLightClaimIds.proximaDistance],
    },
  ],
  narrativeOpportunities: [
    {
      id: 'speed-of-light.narrative.familiar-to-cosmic',
      title: 'Familiar speed, unfamiliar distance',
      description: 'Begin with repeated Earth laps, then increase the travel interval from seconds to minutes, one year, and multiple years.',
      claimIds: [
        speedOfLightClaimIds.earthLapsPerSecond,
        speedOfLightClaimIds.moonLightTime,
        speedOfLightClaimIds.sunLightTime,
        speedOfLightClaimIds.lightYearDistance,
        speedOfLightClaimIds.proximaDistance,
      ],
    },
    {
      id: 'speed-of-light.narrative.unit-misconception',
      title: 'Resolve the light-year misconception',
      description: 'Use one year of travel to establish that a light-year names a distance before revealing the distance to Proxima Centauri.',
      claimIds: [speedOfLightClaimIds.lightYearDistance, speedOfLightClaimIds.lightYearIsDistance, speedOfLightClaimIds.proximaDistance],
    },
  ],
  visualOpportunities: [
    {
      id: 'speed-of-light.visual.earth-laps',
      title: 'Photon laps around Earth',
      description: 'Accumulate seven and a half orbital traces in one second around a familiar Earth reference.',
      claimIds: [speedOfLightClaimIds.earthCircumference, speedOfLightClaimIds.earthLapsPerSecond],
    },
    {
      id: 'speed-of-light.visual.light-time-ladder',
      title: 'Light-time ladder',
      description: 'Use beams and expanding spatial references to connect the Moon, Sun, one light-year, and Proxima Centauri.',
      claimIds: [speedOfLightClaimIds.moonLightTime, speedOfLightClaimIds.sunLightTime, speedOfLightClaimIds.lightYearDistance, speedOfLightClaimIds.proximaDistance],
    },
  ],
  relatedQuestions: [
    'Why does light travel more slowly through materials than through vacuum?',
    'How do astronomers measure distances to nearby stars?',
    'Why can we see distant objects as they existed in the past?',
  ],
  followUpOpportunities: [
    'Compare light-time across the full Solar System.',
    'Explain how radar ranging measures the distance to planets.',
    'Visualize the difference between a light-year and the size of the Solar System.',
  ],
  editorialStatus: 'approved',
  approval: {
    approvedBy: 'Magnivis human editorial review',
    approvedAt: '2026-09-26',
    notes: 'Retrospective package approval based on the completed research, private platform review, and publication of Video 004.',
  },
});
