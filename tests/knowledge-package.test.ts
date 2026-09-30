import {describe, expect, it} from 'vitest';
import {
  speedOfLightClaimIds,
  speedOfLightHookIds,
  speedOfLightKnowledgePackage,
} from '../src/knowledge/packages/speed-of-light';
import {
  oceanDepthClaimIds,
  oceanDepthKnowledgePackage,
} from '../src/knowledge/packages/ocean-depth';
import {
  createKnowledgePackageRegistry,
  knowledgePackageRegistry,
} from '../src/knowledge/registry';
import {
  claimSchema,
  knowledgePackageSchema,
  sourceRecordSchema,
} from '../src/knowledge/schema';
import {knowledgeTaxonomySchema} from '../src/knowledge/taxonomy';

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
      taxonomy: {
        ...speedOfLightKnowledgePackage.taxonomy,
        pillar: 'sports',
      },
    }).success).toBe(false);
  });

  it.each([
    {
      name: 'philosophy',
      taxonomy: {
        pillar: 'society-culture',
        domains: ['philosophy', 'ethics'],
        topics: ['utilitarianism', 'moral-reasoning', 'trolley-problem'],
      },
    },
    {
      name: 'medicine and anatomy',
      taxonomy: {
        pillar: 'human-life',
        domains: ['medicine', 'anatomy', 'neuroscience'],
        topics: ['anesthesia', 'consciousness', 'nervous-system'],
      },
    },
    {
      name: 'biology',
      taxonomy: {
        pillar: 'earth-nature',
        domains: ['biology', 'genetics', 'evolution'],
        topics: ['natural-selection', 'genetic-variation'],
      },
    },
    {
      name: 'movie and physics analysis',
      taxonomy: {
        pillar: 'interdisciplinary',
        domains: ['film-studies', 'physics', 'astronomy'],
        topics: ['interstellar', 'time-dilation', 'relativity'],
      },
    },
  ])('accepts open-ended $name classification without a domain enum', ({taxonomy}) => {
    expect(knowledgePackageSchema.safeParse({
      ...speedOfLightKnowledgePackage,
      taxonomy,
    }).success).toBe(true);
  });

  it('requires normalized, unique open taxonomy terms', () => {
    expect(knowledgeTaxonomySchema.safeParse({
      pillar: 'human-life',
      domains: ['Human Biology'],
      topics: ['heart'],
    }).success).toBe(false);
    expect(knowledgeTaxonomySchema.safeParse({
      pillar: 'human-life',
      domains: ['biology', 'biology'],
      topics: ['heart'],
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

  it('accepts bounded ranges without pretending they are scalar values', () => {
    const claim = oceanDepthKnowledgePackage.claims.find(
      ({id}) => id === oceanDepthClaimIds.lightZoneRange,
    );
    expect(claimSchema.safeParse(claim).success).toBe(true);
    if (claim?.type !== 'quantitative' || claim.quantity.kind !== 'range') {
      throw new Error('Expected the light-zone range claim');
    }
    expect(claim.quantity).toEqual({
      kind: 'range',
      minimum: 200,
      maximum: 1000,
      unit: 'm',
      precision: 'approximate',
    });
  });

  it('rejects reversed or empty quantitative ranges', () => {
    const claim = structuredClone(oceanDepthKnowledgePackage.claims.find(
      ({id}) => id === oceanDepthClaimIds.lightZoneRange,
    )!);
    if (claim.type !== 'quantitative' || claim.quantity.kind !== 'range') {
      throw new Error('Expected the light-zone range claim');
    }
    claim.quantity.maximum = claim.quantity.minimum;
    expect(claimSchema.safeParse(claim).success).toBe(false);
  });

  it('accepts positive scalar measurement uncertainty and rejects invalid uncertainty', () => {
    const claim = structuredClone(oceanDepthKnowledgePackage.claims.find(
      ({id}) => id === oceanDepthClaimIds.challengerDepth,
    )!);
    expect(claimSchema.safeParse(claim).success).toBe(true);
    if (claim.type !== 'quantitative' || claim.quantity.kind !== 'scalar') {
      throw new Error('Expected the Challenger Deep scalar claim');
    }
    expect(claim.quantity.uncertainty).toEqual({
      plusMinus: 6,
      confidence: '95% confidence interval',
    });
    claim.quantity.uncertainty = {plusMinus: 0};
    expect(claimSchema.safeParse(claim).success).toBe(false);
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

  it('records source identity metadata without inventing an exact publication day', () => {
    const source = sourceRecordSchema.parse({
      id: 'source.example.month-only',
      organization: 'Example Journal',
      title: 'Example study',
      sourceType: 'peer-reviewed',
      url: 'https://example.org/study',
      retrieved: '2026-09-27',
      publicationLabel: 'July 1991',
      authors: ['A. Researcher'],
      identifiers: [{scheme: 'DOI', value: '10.1000/example'}],
    });
    expect(source.publicationLabel).toBe('July 1991');
    expect(source.published).toBeUndefined();

    expect(sourceRecordSchema.safeParse({
      ...source,
      identifiers: [
        {scheme: 'DOI', value: '10.1000/example'},
        {scheme: 'DOI', value: '10.1000/example'},
      ],
    }).success).toBe(false);
  });
});

describe('knowledge package registry', () => {
  it('provides deterministic lookup and sorted listing', () => {
    expect(knowledgePackageRegistry.get('speed-of-light')).toEqual(
      speedOfLightKnowledgePackage,
    );
    expect(knowledgePackageRegistry.list().map(({id}) => id)).toEqual([
      'millennium-bridge',
      'ocean-depth',
      'speed-of-light',
      'wood-frog-freeze-tolerance',
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
