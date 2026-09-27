import {z} from 'zod';
import {stableKnowledgeIdSchema} from '../knowledge/schema';
import {taxonomyTermSchema} from '../knowledge/taxonomy';

export const platformSchema = z.enum([
  'youtube',
  'tiktok',
  'instagram',
  'facebook',
]);

export const platformSurfaceSchema = z.enum([
  'youtube-shorts',
  'tiktok-feed',
  'instagram-reels',
  'facebook-reels',
]);

export const platformSurfaceByPlatform = {
  youtube: 'youtube-shorts',
  tiktok: 'tiktok-feed',
  instagram: 'instagram-reels',
  facebook: 'facebook-reels',
} as const;

export const platformVariantStatusSchema = z.enum([
  'draft',
  'editorial-review',
  'approved',
  'production-ready',
  'archived',
]);

const approvalSchema = z.object({
  approvedBy: z.string().min(1),
  approvedAt: z.iso.date(),
  notes: z.string().min(1).optional(),
}).strict();

export const platformVariantSchema = z.object({
  id: stableKnowledgeIdSchema,
  revision: z.number().int().positive(),
  contentAssetId: stableKnowledgeIdSchema,
  platform: platformSchema,
  surface: platformSurfaceSchema,
  platformProfileId: stableKnowledgeIdSchema,
  language: z.string().min(2),
  packaging: z.object({
    title: z.string().min(1).optional(),
    caption: z.string().min(1).optional(),
    description: z.string().min(1).optional(),
    hashtags: z.array(taxonomyTermSchema).max(12).default([]),
    cta: z.string().min(1).optional(),
    claimIds: z.array(stableKnowledgeIdSchema).default([]),
  }).strict(),
  editorialAdaptationNotes: z.array(z.string().min(1)).min(1),
  duration: z.object({
    targetSeconds: z.number().positive(),
    minimumSeconds: z.number().positive(),
    maximumSeconds: z.number().positive(),
  }).strict(),
  aspectRatio: z.enum(['9:16', '1:1', '16:9']),
  safeAreaProfileId: stableKnowledgeIdSchema,
  cover: z.object({
    strategy: z.enum(['frame-selection', 'custom-image', 'platform-default']),
    intent: z.string().min(1),
  }).strict(),
  captions: z.object({
    behavior: z.enum(['external-track', 'platform-generated', 'burned-in', 'none']),
    language: z.string().min(2),
    sourceFile: z.string().min(1).optional(),
    humanReviewRequired: z.boolean(),
  }).strict(),
  productionIntent: z.object({
    renderStrategy: z.enum(['reuse-existing-master', 'new-render']),
    platformPreviewRequired: z.boolean(),
    notes: z.string().min(1),
  }).strict(),
  status: platformVariantStatusSchema,
  approval: approvalSchema.optional(),
}).strict().superRefine((variant, context) => {
  const expectedPrefix = `${variant.contentAssetId}.variant.`;
  if (!variant.id.startsWith(expectedPrefix)) {
    context.addIssue({
      code: 'custom',
      path: ['id'],
      message: `Platform variant IDs must use the ${expectedPrefix}* namespace`,
    });
  }

  if (platformSurfaceByPlatform[variant.platform] !== variant.surface) {
    context.addIssue({
      code: 'custom',
      path: ['surface'],
      message: `${variant.surface} is not a valid surface for ${variant.platform}`,
    });
  }

  if (
    variant.duration.maximumSeconds < variant.duration.minimumSeconds
    || variant.duration.targetSeconds < variant.duration.minimumSeconds
    || variant.duration.targetSeconds > variant.duration.maximumSeconds
  ) {
    context.addIssue({
      code: 'custom',
      path: ['duration'],
      message: 'Target duration must fall within an ordered duration range',
    });
  }

  if (!variant.packaging.title && !variant.packaging.caption && !variant.packaging.description) {
    context.addIssue({
      code: 'custom',
      path: ['packaging'],
      message: 'Platform packaging requires a title, caption, or description',
    });
  }

  if (
    variant.captions.behavior === 'external-track'
    && !variant.captions.sourceFile
  ) {
    context.addIssue({
      code: 'custom',
      path: ['captions', 'sourceFile'],
      message: 'External caption tracks require a source file',
    });
  }

  if (
    variant.captions.behavior !== 'external-track'
    && variant.captions.sourceFile
  ) {
    context.addIssue({
      code: 'custom',
      path: ['captions', 'sourceFile'],
      message: 'Only external-track caption behavior may specify a source file',
    });
  }

  if (
    ['approved', 'production-ready', 'archived'].includes(variant.status)
    && !variant.approval
  ) {
    context.addIssue({
      code: 'custom',
      path: ['approval'],
      message: `${variant.status} variants require approval metadata`,
    });
  }
});

export type Platform = z.infer<typeof platformSchema>;
export type PlatformSurface = z.infer<typeof platformSurfaceSchema>;
export type PlatformVariant = z.infer<typeof platformVariantSchema>;
