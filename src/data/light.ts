import {factSchema, sourceSchema} from '../content/schema';
import {
  speedOfLightClaimIds,
  speedOfLightKnowledgePackage,
} from '../knowledge/packages/speed-of-light';
import type {QuantitativeClaim} from '../knowledge/schema';
import {speedOfLightPublishedShortAsset} from '../content-assets/assets/speed-of-light';

export const lightSources = sourceSchema.array().parse(
  speedOfLightKnowledgePackage.sources.map((source) => ({
    id: source.id,
    organization: source.organization,
    title: source.title,
    url: source.url,
    retrieved: source.retrieved,
  })),
);

const selectedClaimIds = new Set(speedOfLightPublishedShortAsset.selectedClaimIds);
const quantitativeClaims = speedOfLightKnowledgePackage.claims.filter(
  (claim): claim is QuantitativeClaim =>
    claim.type === 'quantitative' && selectedClaimIds.has(claim.id),
);

export const lightFacts = factSchema.array().parse(
  quantitativeClaims.map((claim) => ({
    id: claim.id,
    claim: claim.statement,
    value: claim.quantity.value,
    unit: claim.quantity.unit,
    basis: claim.basis,
    sourceIds: claim.evidence.map(({sourceId}) => sourceId),
    display: claim.display,
    notes: [...claim.caveats, ...claim.evidence.map(({notes}) => notes)].join(' '),
  })),
);

export const lightFactById = Object.fromEntries(
  lightFacts.map((fact) => [fact.id, fact]),
);

const value = (id: string) => {
  const fact = lightFactById[id];
  if (!fact) throw new Error(`Missing Speed of Light production fact: ${id}`);
  return fact.value;
};

export const lightScale = {
  speedMps: value(speedOfLightClaimIds.vacuumSpeed),
  earthCircumferenceKm: value(speedOfLightClaimIds.earthCircumference),
  earthLapsPerSecond: value(speedOfLightClaimIds.earthLapsPerSecond),
  moonDistanceKm: value(speedOfLightClaimIds.moonDistance),
  moonLightTimeSeconds: value(speedOfLightClaimIds.moonLightTime),
  sunLightTimeMinutes: value(speedOfLightClaimIds.sunLightTime),
  lightYearKm: value(speedOfLightClaimIds.lightYearDistance),
  proximaLightYears: value(speedOfLightClaimIds.proximaDistance),
} as const;
