import {z} from 'zod';

export const editorialPillarSchema = z.enum([
  'human-life',
  'society-culture',
  'science-reality',
  'earth-nature',
  'history-stories',
  'technology-built-world',
  'interdisciplinary',
]);

export const taxonomyTermSchema = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Taxonomy terms must be normalized lowercase slugs');

const duplicateValues = (values: readonly string[]) => {
  const seen = new Set<string>();
  return [...new Set(values.filter((value) => {
    if (seen.has(value)) return true;
    seen.add(value);
    return false;
  }))];
};

export const knowledgeTaxonomySchema = z.object({
  pillar: editorialPillarSchema,
  domains: z.array(taxonomyTermSchema).min(1).max(12),
  topics: z.array(taxonomyTermSchema).min(1).max(24),
}).strict().superRefine((taxonomy, context) => {
  for (const field of ['domains', 'topics'] as const) {
    for (const duplicate of duplicateValues(taxonomy[field])) {
      context.addIssue({
        code: 'custom',
        path: [field],
        message: `Duplicate taxonomy term: ${duplicate}`,
      });
    }
  }
});

export type EditorialPillar = z.infer<typeof editorialPillarSchema>;
export type KnowledgeTaxonomy = z.infer<typeof knowledgeTaxonomySchema>;
