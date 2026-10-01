import {z} from 'zod';
import {platformApprovalSchema} from './owner-presentation';
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

export const platformPreviewStatusSchema = z.enum([
  'not-ready',
  'ready-for-private-preview',
  'private-preview-passed',
]);

const sourceMasterSchema = z.object({
  videoSpecId: z.string().regex(/^[a-z0-9-]+$/),
  artifact: z.object({
    path: z.string().min(1),
    sha256: z.string().regex(/^[a-f0-9]{64}$/),
  }).strict(),
  productionPlan: z.object({
    id: stableKnowledgeIdSchema,
    revision: z.number().int().positive(),
  }).strict(),
  captionPlan: z.object({
    id: stableKnowledgeIdSchema,
    revision: z.number().int().positive(),
    sha256: z.string().regex(/^[a-f0-9]{64}$/),
  }).strict(),
  relationship: z.enum(['exact-master', 'platform-safe-area-derivative']),
  contentBoundsEvidence: z.object({
    regions: z.object({path: z.string().min(1), sha256: z.string().regex(/^[a-f0-9]{64}$/)}).strict(),
    report: z.object({path: z.string().min(1), sha256: z.string().regex(/^[a-f0-9]{64}$/)}).strict(),
  }).strict().optional(),
}).strict();

const operatorGuidanceSchema = z.object({
  visibility: z.literal('private-preview'),
  originalAudio: z.literal('preserve'),
  aiGeneratedContentDisclosure: z.object({
    recommendation: z.enum(['enable', 'disable', 'operator-confirmation-required']),
    currentPolicyConfirmationRequired: z.boolean(),
    rationale: z.string().min(1),
  }).strict(),
  commercialContentDisclosure: z.object({
    recommendation: z.enum(['enable', 'disable', 'operator-confirmation-required']),
    rationale: z.string().min(1),
  }).strict(),
  nativeCaptions: z.object({
    recommendation: z.enum([
      'enable-if-no-visible-duplication',
      'disable-to-avoid-visible-duplication',
      'evaluate-during-private-preview',
    ]),
    rationale: z.string().min(1),
  }).strict(),
  location: z.enum(['none', 'operator-choice']),
  link: z.enum(['none', 'operator-choice']),
  notes: z.array(z.string().min(1)).default([]),
}).strict();

const approvalSchema = platformApprovalSchema;

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
    artifact: z.object({id:z.string().min(1),path:z.string().min(1),sha256:z.string().regex(/^[a-f0-9]{64}$/)}).strict().optional(),
  }).strict(),
  captions: z.object({
    behavior: z.enum(['external-track', 'platform-generated', 'burned-in', 'none']),
    designedBurnedIn: z.boolean().default(false),
    language: z.string().min(2),
    sourceFile: z.string().min(1).optional(),
    humanReviewRequired: z.boolean(),
  }).strict(),
  productionIntent: z.object({
    renderStrategy: z.enum(['reuse-existing-master', 'new-render']),
    videoSpecId: z.string().regex(/^[a-z0-9-]+$/),
    platformPreviewRequired: z.boolean(),
    notes: z.string().min(1),
  }).strict(),
  previewStatus: platformPreviewStatusSchema.optional(),
  sourceMaster: sourceMasterSchema.optional(),
  operatorGuidance: operatorGuidanceSchema.optional(),
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

  if (
    variant.previewStatus === 'private-preview-passed'
    && variant.productionIntent.platformPreviewRequired
  ) {
    context.addIssue({
      code: 'custom',
      path: ['productionIntent', 'platformPreviewRequired'],
      message: 'A passed private preview cannot still be marked as required',
    });
  }

  if (
    variant.previewStatus === 'ready-for-private-preview'
    && !variant.productionIntent.platformPreviewRequired
  ) {
    context.addIssue({
      code: 'custom',
      path: ['previewStatus'],
      message: 'Ready-for-private-preview variants must retain the platform preview gate',
    });
  }

  if (variant.sourceMaster) {
    const expectedRelationship = variant.productionIntent.renderStrategy === 'new-render'
      ? 'platform-safe-area-derivative'
      : 'exact-master';
    if (variant.sourceMaster.relationship !== expectedRelationship) {
      context.addIssue({
        code: 'custom',
        path: ['sourceMaster', 'relationship'],
        message: `${variant.productionIntent.renderStrategy} requires ${expectedRelationship}`,
      });
    }
  }
});

export type Platform = z.infer<typeof platformSchema>;
export type PlatformSurface = z.infer<typeof platformSurfaceSchema>;
export type PlatformVariant = z.infer<typeof platformVariantSchema>;
