import {z} from 'zod';
import {stableKnowledgeIdSchema} from '../knowledge/schema';

export const captionPlacementSchema = z.enum([
  'middle-lower',
  'lower-safe',
]);

export const captionAnimationSchema = z.enum([
  'fade-slide',
  'soft-scale',
  'focus-highlight',
]);

export const captionEmphasisLevelSchema = z.enum(['concept', 'strong']);
export const captionEmphasisToneSchema = z.enum(['ice', 'gold']);

const captionEmphasisSchema = z.object({
  text: z.string().min(1),
  level: captionEmphasisLevelSchema,
  tone: captionEmphasisToneSchema,
}).strict();

export const captionSourceBoundarySchema = z.object({
  sourceText: z.string().refine(
    (value) => /^[ \t]*[—–][ \t]*$/u.test(value),
    'Caption source boundaries may only represent one rhetorical em or en dash',
  ),
  treatment: z.literal('phrase-transition'),
  rationale: z.string().min(1),
}).strict();

export const captionCueSchema = z.object({
  id: stableKnowledgeIdSchema,
  sourceNarrationCueId: stableKnowledgeIdSchema,
  startFrame: z.number().int().nonnegative(),
  endFrame: z.number().int().positive(),
  lines: z.array(z.string().min(1).max(38)).min(1).max(2),
  sourceBoundaryBefore: captionSourceBoundarySchema.optional(),
  emphasis: z.array(captionEmphasisSchema).max(3).default([]),
  placement: captionPlacementSchema,
  animation: captionAnimationSchema,
  presentationIntent: z.string().min(1),
}).strict().superRefine((cue, context) => {
  if (cue.endFrame <= cue.startFrame) {
    context.addIssue({code: 'custom', path: ['endFrame'], message: 'Caption cue must have positive duration'});
  }
  for (const [index, emphasis] of cue.emphasis.entries()) {
    if (!cue.lines.some((line) => line.includes(emphasis.text))) {
      context.addIssue({
        code: 'custom',
        path: ['emphasis', index, 'text'],
        message: 'Caption emphasis text must occur exactly inside one caption line',
      });
    }
  }
});

export const captionPlanSchema = z.object({
  schemaVersion: z.literal(1),
  id: stableKnowledgeIdSchema.refine((id) => id.startsWith('caption-plan.')),
  revision: z.number().int().positive(),
  status: z.enum(['draft', 'review-required', 'approved']),
  contentAsset: z.object({
    id: stableKnowledgeIdSchema,
    revision: z.number().int().positive(),
  }).strict(),
  approvedScriptSha256: z.string().regex(/^[a-f0-9]{64}$/),
  designSystem: z.object({
    id: stableKnowledgeIdSchema,
    revision: z.number().int().positive(),
  }).strict(),
  safeAreaProfileId: stableKnowledgeIdSchema,
  fps: z.number().int().positive(),
  coverage: z.literal('complete-narration'),
  cues: z.array(captionCueSchema).min(1),
  provenance: z.object({
    method: z.enum(['manual-editorial', 'ai-assisted-editorial']),
    generatedAt: z.iso.datetime(),
    workflowId: stableKnowledgeIdSchema.optional(),
    workflowVersion: z.number().int().positive().optional(),
    notes: z.string().min(1),
  }).strict(),
}).strict().superRefine((plan, context) => {
  const ids = plan.cues.map(({id}) => id);
  if (new Set(ids).size !== ids.length) {
    context.addIssue({code: 'custom', path: ['cues'], message: 'Caption cue IDs must be unique'});
  }
  for (let index = 1; index < plan.cues.length; index += 1) {
    const previous = plan.cues[index - 1];
    const current = plan.cues[index];
    if (previous && current && current.startFrame < previous.endFrame) {
      context.addIssue({
        code: 'custom',
        path: ['cues', index, 'startFrame'],
        message: 'Caption cues must be ordered and non-overlapping',
      });
    }
  }
  const seenNarrationCueIds = new Set<string>();
  plan.cues.forEach((cue, index) => {
    if (!seenNarrationCueIds.has(cue.sourceNarrationCueId)) {
      seenNarrationCueIds.add(cue.sourceNarrationCueId);
      if (cue.sourceBoundaryBefore) {
        context.addIssue({
          code: 'custom',
          path: ['cues', index, 'sourceBoundaryBefore'],
          message: 'The first caption chunk in a narration cue cannot have a source boundary before it',
        });
      }
    }
  });
});

export type CaptionCue = z.infer<typeof captionCueSchema>;
export type CaptionPlan = z.infer<typeof captionPlanSchema>;
export type CaptionPlacement = z.infer<typeof captionPlacementSchema>;
export type CaptionAnimation = z.infer<typeof captionAnimationSchema>;
