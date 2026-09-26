import {describe, expect, it} from 'vitest';
import {
  speedOfLightClaimIds,
  speedOfLightHookIds,
  speedOfLightKnowledgePackage,
} from '../src/knowledge/packages/speed-of-light';
import {
  createKnowledgePackageRegistry,
  knowledgePackageRegistry,
} from '../src/knowledge/registry';
import {
  claimSchema,
  knowledgePackageSchema,
} from '../src/knowledge/schema';

const clonePackage = () => structuredClone(speedOfLightKnowledgePackage);

const reidentifyPackage = (newId: string) => {
  const candidate = clonePackage();
  const remapClaimId = (id: string) => id.replace('speed-of-light.claim.', `${newId}.claim.`);
  candidate.id = newId;
  candidate.claims.forEach((claim) => {
    claim.id = remapClaimId(claim.id);
  });
  candidate.hooks.forEach((hook) => {
    hook.id = hook.id.replace('speed-of-light.hook.', `${newId}.hook.`);
    hook.claimIds = hook.claimIds.map(remapClaimId);
  });
  for (const records of [
    candidate.caveats,
    candidate.narrativeOpportunities,
    candidate.visualOpportunities,
  ]) {
    records.forEach((record) => {
      record.claimIds = record.claimIds.map(remapClaimId);
    });
  }
  return candidate;
};

describe('Knowledge Package V1 schema', () => {
  it('validates the production Speed of Light package', () => {
    const parsed = knowledgePackageSchema.parse(speedOfLightKnowledgePackage);
    expect(parsed.id).toBe('speed-of-light');
    expect(parsed.revision).toBe(1);
    expect(parsed.editorialStatus).toBe('approved');
    expect(parsed.claims).toHaveLength(9);
    expect(parsed.sources).toHaveLength(4);
  });

  it('rejects an invalid pillar', () => {
    expect(knowledgePackageSchema.safeParse({
      ...speedOfLightKnowledgePackage,
      pillar: 'sports',
    }).success).toBe(false);
  });

  it('rejects an invalid timeliness classification', () => {
    expect(knowledgePackageSchema.safeParse({
      ...speedOfLightKnowledgePackage,
      timeliness: 'breaking-news',
    }).success).toBe(false);
  });

  it('rejects duplicate record IDs inside a package', () => {
    const candidate = clonePackage();
    candidate.claims.push(structuredClone(candidate.claims[0]!));
    expect(knowledgePackageSchema.safeParse(candidate).success).toBe(false);
  });

  it('rejects dangling source references from claims', () => {
    const candidate = clonePackage();
    candidate.claims[0]!.evidence[0]!.sourceId = 'source.missing.reference';
    expect(knowledgePackageSchema.safeParse(candidate).success).toBe(false);
  });

  it('rejects dangling claim references from editorial records', () => {
    const candidate = clonePackage();
    candidate.visualOpportunities[0]!.claimIds[0] = 'speed-of-light.claim.missing';
    expect(knowledgePackageSchema.safeParse(candidate).success).toBe(false);
  });

  it('rejects an invalid verification state', () => {
    const candidate = clonePackage();
    const invalid = {
      ...candidate,
      claims: candidate.claims.map((claim, index) => index === 0
        ? {...claim, verificationStatus: 'plausible'}
        : claim),
    };
    expect(knowledgePackageSchema.safeParse(invalid).success).toBe(false);
  });

  it('requires structured values for quantitative claims', () => {
    const quantitative = structuredClone(
      speedOfLightKnowledgePackage.claims.find(({type}) => type === 'quantitative')!,
    ) as Record<string, unknown>;
    delete quantitative.quantity;
    expect(claimSchema.safeParse(quantitative).success).toBe(false);
  });

  it('accepts qualitative claims without numeric assumptions', () => {
    const qualitative = speedOfLightKnowledgePackage.claims.find(
      ({type}) => type === 'qualitative',
    );
    expect(qualitative).toBeDefined();
    expect(claimSchema.safeParse(qualitative).success).toBe(true);
  });

  it('rejects quantitative values attached to qualitative claims', () => {
    const qualitative = speedOfLightKnowledgePackage.claims.find(
      ({type}) => type === 'qualitative',
    )!;
    expect(claimSchema.safeParse({
      ...qualitative,
      quantity: {value: 1, unit: 'count', precision: 'exact'},
    }).success).toBe(false);
  });

  it('distinguishes supported claims from reviewed verified claims', () => {
    const qualitative = structuredClone(
      speedOfLightKnowledgePackage.claims.find(({type}) => type === 'qualitative')!,
    );
    const supported = {...qualitative, verificationStatus: 'supported'};
    delete supported.review;
    expect(claimSchema.safeParse(supported).success).toBe(true);

    const unreviewedVerified = {...qualitative};
    delete unreviewedVerified.review;
    expect(claimSchema.safeParse(unreviewedVerified).success).toBe(false);
  });

  it('requires approval metadata for an approved package', () => {
    const candidate = clonePackage();
    const withoutApproval = {...candidate};
    delete withoutApproval.approval;
    expect(knowledgePackageSchema.safeParse(withoutApproval).success).toBe(false);
  });
});

describe('knowledge package registry', () => {
  it('provides deterministic lookup and sorted listing', () => {
    expect(knowledgePackageRegistry.get('speed-of-light')).toEqual(
      speedOfLightKnowledgePackage,
    );
    expect(knowledgePackageRegistry.list().map(({id}) => id)).toEqual([
      'speed-of-light',
    ]);
  });

  it('rejects duplicate package IDs', () => {
    expect(() => createKnowledgePackageRegistry([
      speedOfLightKnowledgePackage,
      structuredClone(speedOfLightKnowledgePackage),
    ])).toThrow('Duplicate knowledge package ID: speed-of-light');
  });

  it('rejects conflicting records that reuse a global source ID', () => {
    const conflicting = reidentifyPackage('speed-of-light-copy');
    conflicting.sources[0]!.title = 'A different source under the same ID';
    expect(() => createKnowledgePackageRegistry([
      speedOfLightKnowledgePackage,
      conflicting,
    ])).toThrow('Conflicting knowledge source ID');
  });

  it('rejects dangling claim and hook references from content assets', () => {
    expect(() => knowledgePackageRegistry.assertReference({
      packageId: 'speed-of-light',
      claimIds: ['speed-of-light.claim.missing'],
      hookId: speedOfLightHookIds.impossibleLaps,
    })).toThrow('Unknown claim');

    expect(() => knowledgePackageRegistry.assertReference({
      packageId: 'speed-of-light',
      claimIds: [speedOfLightClaimIds.vacuumSpeed],
      hookId: 'speed-of-light.hook.missing',
    })).toThrow('Unknown hook');
  });
});
