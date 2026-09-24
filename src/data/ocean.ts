import {factSchema, sourceSchema} from '../content/schema';

export const oceanSources = sourceSchema.array().parse([
  {
    id: 'noaa-ocean-depth',
    organization: 'NOAA National Ocean Service',
    title: 'How deep is the ocean?',
    url: 'https://oceanservice.noaa.gov/facts/oceandepth.html',
    retrieved: '2026-09-24',
  },
  {
    id: 'noaa-ocean-light',
    organization: 'NOAA National Ocean Service',
    title: 'How far does light travel in the ocean?',
    url: 'https://oceanservice.noaa.gov/facts/light_travel.html',
    retrieved: '2026-09-24',
  },
  {
    id: 'nepal-dmg-everest',
    organization: 'Government of Nepal, Department of Mines and Geology',
    title: 'General Geology — Nepal Himalaya',
    url: 'https://dmgnepal.gov.np/en/pages/general-geology-4128',
    retrieved: '2026-09-24',
  },
]);

export const oceanFacts = factSchema.array().parse([
  {
    id: 'ocean-significant-light-depth-m',
    claim: 'Depth beyond which significant sunlight is rare',
    value: 200,
    unit: 'm',
    basis: 'estimated',
    sourceIds: ['noaa-ocean-light'],
    display: '≈200 m',
    notes: 'NOAA says significant light is rare beyond 200 m; this is not a hard optical boundary.',
  },
  {
    id: 'ocean-no-sunlight-depth-m',
    claim: 'Depth below which sunlight does not penetrate',
    value: 1000,
    unit: 'm',
    basis: 'estimated',
    sourceIds: ['noaa-ocean-light'],
    display: '≈1,000 m',
    notes: 'NOAA describes depths below about 1,000 m as aphotic and bathed in darkness.',
  },
  {
    id: 'ocean-average-depth-m',
    claim: 'Global average ocean depth',
    value: 3682,
    unit: 'm',
    basis: 'estimated',
    sourceIds: ['noaa-ocean-depth'],
    display: '≈3,682 m',
    notes: 'NOAA reports an average depth of about 3,682 m; local seafloor depth varies widely.',
  },
  {
    id: 'everest-elevation-m',
    claim: 'Mount Everest elevation above mean sea level',
    value: 8848.86,
    unit: 'm',
    basis: 'measured',
    sourceIds: ['nepal-dmg-everest'],
    display: '8,848.86 m',
    notes: 'Official Nepal government value. The video rounds this to 8,849 m for display.',
  },
  {
    id: 'challenger-deep-depth-m',
    claim: 'Approximate depth of Challenger Deep below sea level',
    value: 10935,
    unit: 'm',
    basis: 'estimated',
    sourceIds: ['noaa-ocean-depth'],
    display: '≈10,935 m',
    notes: 'NOAA reports an approximate depth; measurements vary slightly by survey and method.',
  },
  {
    id: 'everest-summit-clearance-m',
    claim: 'Water above Everest summit if its base were placed at Challenger Deep',
    value: 2086.14,
    unit: 'm',
    basis: 'derived',
    sourceIds: ['noaa-ocean-depth', 'nepal-dmg-everest'],
    display: '≈2.09 km',
    notes: 'Derived as 10,935 m minus 8,848.86 m. This is a vertical scale comparison, not a claim that the mountain could literally be relocated intact.',
  },
]);

export const oceanFactById = Object.fromEntries(
  oceanFacts.map((fact) => [fact.id, fact]),
);

export const oceanScale = {
  challengerDepth: oceanFactById['challenger-deep-depth-m']!.value,
  everestHeight: oceanFactById['everest-elevation-m']!.value,
  summitClearance: oceanFactById['everest-summit-clearance-m']!.value,
  everestFractionOfChallenger:
    oceanFactById['everest-elevation-m']!.value /
    oceanFactById['challenger-deep-depth-m']!.value,
} as const;
