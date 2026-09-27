import {z} from 'zod';
import {knowledgeTaxonomySchema} from './taxonomy';

export const stableKnowledgeIdSchema = z
  .string()
  .regex(/^[a-z0-9]+(?:[.-][a-z0-9]+)*$/);

export const timelinessSchema = z.enum([
  'evergreen',
  'trend-assisted',
  'timely',
]);

export const verificationStatusSchema = z.enum([
  'unverified',
  'supported',
  'conflicting',
  'uncertain',
  'verified',
]);

export const sourceTypeSchema = z.enum([
  'government',
  'scientific-organization',
  'peer-reviewed',
  'primary-source',
  'university',
  'museum',
  'technical-documentation',
  'reference',
]);

export const sourceRecordSchema = z.object({
  id: stableKnowledgeIdSchema.refine((id) => id.startsWith('source.'), {
    message: 'Source IDs must use the global source.* namespace',
  }),
  organization: z.string().min(1),
  title: z.string().min(1),
  sourceType: sourceTypeSchema,
  url: z.url(),
  retrieved: z.iso.date(),
  published: z.iso.date().optional(),
  notes: z.string().min(1).optional(),
}).strict();

const reviewMetadataSchema = z.object({
  reviewedBy: z.string().min(1),
  reviewedAt: z.iso.date(),
  notes: z.string().min(1).optional(),
}).strict();

const evidenceReferenceSchema = z.object({
  sourceId: stableKnowledgeIdSchema,
  locator: z.string().min(1).optional(),
  notes: z.string().min(1),
}).strict();

const claimBase = z.object({
  id: stableKnowledgeIdSchema,
  statement: z.string().min(1),
  evidence: z.array(evidenceReferenceSchema).min(1),
  verificationStatus: verificationStatusSchema,
  caveats: z.array(z.string().min(1)).default([]),
  review: reviewMetadataSchema.optional(),
});

const quantityPrecisionSchema = z.enum(['exact', 'rounded', 'approximate']);

export const scalarQuantitySchema = z.object({
  kind: z.literal('scalar'),
  value: z.number(),
  unit: z.string().min(1),
  precision: quantityPrecisionSchema,
  uncertainty: z.object({
    plusMinus: z.number().positive(),
    confidence: z.string().min(1).optional(),
  }).strict().optional(),
}).strict();

export const rangeQuantitySchema = z.object({
  kind: z.literal('range'),
  minimum: z.number(),
  maximum: z.number(),
  unit: z.string().min(1),
  precision: quantityPrecisionSchema,
}).strict().refine(
  ({minimum, maximum}) => maximum > minimum,
  'Range maximum must be greater than range minimum',
);

export const quantitySchema = z.discriminatedUnion('kind', [
  scalarQuantitySchema,
  rangeQuantitySchema,
]);

export const quantitativeClaimSchema = claimBase.extend({
  type: z.literal('quantitative'),
  quantity: quantitySchema,
  basis: z.enum(['measured', 'defined', 'estimated', 'derived']),
  display: z.string().min(1),
}).strict();

export const qualitativeClaimSchema = claimBase.extend({
  type: z.literal('qualitative'),
}).strict();

export const claimSchema = z
  .discriminatedUnion('type', [quantitativeClaimSchema, qualitativeClaimSchema])
  .superRefine((claim, context) => {
    if (claim.verificationStatus === 'verified' && !claim.review) {
      context.addIssue({
        code: 'custom',
        path: ['review'],
        message: 'Verified claims require review metadata',
      });
    }
  });

export const hookArchetypeSchema = z.enum([
  'surprising-statement',
  'question',
  'contradiction',
  'misconception',
  'impossible-sounding-fact',
  'scenario',
  'consequence',
  'mystery',
  'comparison',
]);

const hookVariantSchema = z.object({
  id: stableKnowledgeIdSchema,
  archetype: hookArchetypeSchema,
  text: z.string().min(1),
  viewerPromise: z.string().min(1),
  claimIds: z.array(stableKnowledgeIdSchema).min(1),
}).strict();

const opportunitySchema = z.object({
  id: stableKnowledgeIdSchema,
  title: z.string().min(1),
  description: z.string().min(1),
  claimIds: z.array(stableKnowledgeIdSchema).min(1),
}).strict();

const caveatSchema = z.object({
  id: stableKnowledgeIdSchema,
  statement: z.string().min(1),
  claimIds: z.array(stableKnowledgeIdSchema).min(1),
}).strict();

const approvalSchema = z.object({
  approvedBy: z.string().min(1),
  approvedAt: z.iso.date(),
  notes: z.string().min(1).optional(),
}).strict();

const duplicateValues = (values: readonly string[]) => {
  const seen = new Set<string>();
  return [...new Set(values.filter((value) => {
    if (seen.has(value)) return true;
    seen.add(value);
    return false;
  }))];
};

export const knowledgePackageSchema = z.object({
  id: stableKnowledgeIdSchema,
  revision: z.number().int().positive(),
  topic: z.string().min(1),
  centralQuestion: z.string().min(1),
  taxonomy: knowledgeTaxonomySchema,
  timeliness: timelinessSchema,
  thesis: z.string().min(1),
  viewerPayoff: z.string().min(1),
  sources: z.array(sourceRecordSchema).min(1),
  claims: z.array(claimSchema).min(1),
  caveats: z.array(caveatSchema),
  hooks: z.array(hookVariantSchema).min(2),
  narrativeOpportunities: z.array(opportunitySchema).min(1),
  visualOpportunities: z.array(opportunitySchema).min(1),
  relatedQuestions: z.array(z.string().min(1)),
  followUpOpportunities: z.array(z.string().min(1)),
  editorialStatus: z.enum(['draft', 'research', 'review', 'approved', 'archived']),
  approval: approvalSchema.optional(),
}).strict().superRefine((knowledgePackage, context) => {
  const collections = [
    ['sources', knowledgePackage.sources.map(({id}) => id)],
    ['claims', knowledgePackage.claims.map(({id}) => id)],
    ['hooks', knowledgePackage.hooks.map(({id}) => id)],
    ['caveats', knowledgePackage.caveats.map(({id}) => id)],
    ['narrativeOpportunities', knowledgePackage.narrativeOpportunities.map(({id}) => id)],
    ['visualOpportunities', knowledgePackage.visualOpportunities.map(({id}) => id)],
  ] as const;

  for (const [field, ids] of collections) {
    for (const duplicate of duplicateValues(ids)) {
      context.addIssue({
        code: 'custom',
        path: [field],
        message: `Duplicate ID: ${duplicate}`,
      });
    }
  }

  const sourceIds = new Set(knowledgePackage.sources.map(({id}) => id));
  const claimIds = new Set(knowledgePackage.claims.map(({id}) => id));
  const expectedClaimPrefix = `${knowledgePackage.id}.claim.`;
  const expectedHookPrefix = `${knowledgePackage.id}.hook.`;

  knowledgePackage.claims.forEach((claim, claimIndex) => {
    if (!claim.id.startsWith(expectedClaimPrefix)) {
      context.addIssue({
        code: 'custom',
        path: ['claims', claimIndex, 'id'],
        message: `Claim IDs must use the ${expectedClaimPrefix}* namespace`,
      });
    }
    claim.evidence.forEach((evidence, evidenceIndex) => {
      if (!sourceIds.has(evidence.sourceId)) {
        context.addIssue({
          code: 'custom',
          path: ['claims', claimIndex, 'evidence', evidenceIndex, 'sourceId'],
          message: `Unknown source reference: ${evidence.sourceId}`,
        });
      }
    });
  });

  const claimReferenceCollections = [
    ['hooks', knowledgePackage.hooks],
    ['caveats', knowledgePackage.caveats],
    ['narrativeOpportunities', knowledgePackage.narrativeOpportunities],
    ['visualOpportunities', knowledgePackage.visualOpportunities],
  ] as const;

  for (const [field, records] of claimReferenceCollections) {
    records.forEach((record, recordIndex) => {
      record.claimIds.forEach((claimId, claimIndex) => {
        if (!claimIds.has(claimId)) {
          context.addIssue({
            code: 'custom',
            path: [field, recordIndex, 'claimIds', claimIndex],
            message: `Unknown claim reference: ${claimId}`,
          });
        }
      });
    });
  }

  knowledgePackage.hooks.forEach((hook, hookIndex) => {
    if (!hook.id.startsWith(expectedHookPrefix)) {
      context.addIssue({
        code: 'custom',
        path: ['hooks', hookIndex, 'id'],
        message: `Hook IDs must use the ${expectedHookPrefix}* namespace`,
      });
    }
  });

  if (
    (knowledgePackage.editorialStatus === 'approved' || knowledgePackage.editorialStatus === 'archived')
    && !knowledgePackage.approval
  ) {
    context.addIssue({
      code: 'custom',
      path: ['approval'],
      message: `${knowledgePackage.editorialStatus} packages require approval metadata`,
    });
  }
});

export type KnowledgeSource = z.infer<typeof sourceRecordSchema>;
export type KnowledgeClaim = z.infer<typeof claimSchema>;
export type QuantitativeClaim = z.infer<typeof quantitativeClaimSchema>;
export type ScalarQuantity = z.infer<typeof scalarQuantitySchema>;
export type RangeQuantity = z.infer<typeof rangeQuantitySchema>;
export type QualitativeClaim = z.infer<typeof qualitativeClaimSchema>;
export type KnowledgePackage = z.infer<typeof knowledgePackageSchema>;
