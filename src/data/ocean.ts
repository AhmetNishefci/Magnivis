import {factSchema, sourceSchema} from '../content/schema';
import {oceanDepthPublishedShortAsset} from '../content-assets/assets/ocean-depth';
import {
  oceanDepthClaimIds,
  oceanDepthKnowledgePackage,
} from '../knowledge/packages/ocean-depth';
import type {KnowledgeClaim, QuantitativeClaim} from '../knowledge/schema';

export const oceanSources = sourceSchema.array().parse(
  oceanDepthKnowledgePackage.sources.map((source) => ({
    id: source.id,
    organization: source.organization,
    title: source.title,
    url: source.url,
    retrieved: source.retrieved,
  })),
);

const selectedClaimIds = new Set(oceanDepthPublishedShortAsset.selectedClaimIds);
const scalarClaims = oceanDepthKnowledgePackage.claims.filter(
  (claim): claim is QuantitativeClaim =>
    claim.type === 'quantitative'
    && claim.quantity.kind === 'scalar'
    && selectedClaimIds.has(claim.id),
);

const scalarClaimValue = (claim: QuantitativeClaim) => {
  if (claim.quantity.kind !== 'scalar') {
    throw new Error(`Ocean Depth production requires a scalar claim: ${claim.id}`);
  }
  return claim.quantity.value;
};

export const oceanFacts = factSchema.array().parse(
  scalarClaims.map((claim) => ({
    id: claim.id,
    claim: claim.statement,
    value: scalarClaimValue(claim),
    unit: claim.quantity.unit,
    basis: claim.basis,
    sourceIds: claim.evidence.map(({sourceId}) => sourceId),
    display: claim.display,
    notes: [...claim.caveats, ...claim.evidence.map(({notes}) => notes)].join(' '),
  })),
);

export const oceanFactById = Object.fromEntries(
  oceanFacts.map((fact) => [fact.id, fact]),
);

const claim = (id: string): KnowledgeClaim => {
  const result = oceanDepthKnowledgePackage.claims.find((item) => item.id === id);
  if (!result) throw new Error(`Missing Ocean Depth knowledge claim: ${id}`);
  return result;
};

const scalarValue = (id: string) => {
  const result = claim(id);
  if (result.type !== 'quantitative' || result.quantity.kind !== 'scalar') {
    throw new Error(`Ocean Depth production requires a scalar claim: ${id}`);
  }
  return result.quantity.value;
};

const rangeValue = (id: string) => {
  const result = claim(id);
  if (result.type !== 'quantitative' || result.quantity.kind !== 'range') {
    throw new Error(`Ocean Depth production requires a range claim: ${id}`);
  }
  return result.quantity;
};

const lightZoneRange = rangeValue(oceanDepthClaimIds.lightZoneRange);

export const oceanScale = {
  significantLightBoundary: lightZoneRange.minimum,
  noSurfaceLightBoundary: lightZoneRange.maximum,
  averageDepth: scalarValue(oceanDepthClaimIds.averageDepth),
  challengerDepth: scalarValue(oceanDepthClaimIds.challengerDepth),
  everestHeight: scalarValue(oceanDepthClaimIds.everestElevation),
  summitClearance: scalarValue(oceanDepthClaimIds.everestClearance),
  everestFractionOfChallenger:
    scalarValue(oceanDepthClaimIds.everestElevation)
    / scalarValue(oceanDepthClaimIds.challengerDepth),
} as const;
