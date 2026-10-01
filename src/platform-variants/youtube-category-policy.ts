import {z} from 'zod';

/** Distribution category follows the story and available live UI, never a brand-wide default. */
export const youtubeCategoryPolicySchema = z.object({
  scope: z.literal('story-specific'), defaultCategory: z.null(),
  currentUiConfirmationRequired: z.literal(true),
}).strict();
export const youtubeCategoryPolicy = youtubeCategoryPolicySchema.parse({scope: 'story-specific', defaultCategory: null, currentUiConfirmationRequired: true});
