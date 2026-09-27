import {z} from 'zod';
import {stableKnowledgeIdSchema} from '../knowledge/schema';
import {
  platformSchema,
  platformSurfaceSchema,
  platformVariantStatusSchema,
} from '../platform-variants/schema';

export const deliveryPackageStateSchema = z.enum([
  'draft-review',
  'approved-review',
  'ready-for-manual-upload',
]);

const revisionReferenceSchema = z.object({
  id: stableKnowledgeIdSchema,
  revision: z.number().int().positive(),
}).strict();

const artifactSchema = z.object({
  role: z.enum(['video', 'captions', 'metadata', 'upload-copy', 'review']),
  path: z.string().regex(/^[a-z0-9][a-z0-9._-]*$/),
  mediaType: z.string().min(1),
  bytes: z.number().int().nonnegative(),
  sha256: z.string().regex(/^[a-f0-9]{64}$/),
}).strict();

const approvalSchema = z.object({
  approvedBy: z.string().min(1),
  approvedAt: z.iso.date(),
  notes: z.string().min(1).optional(),
}).strict();

export const deliveryManifestSchema = z.object({
  schemaVersion: z.literal(1),
  deliveryId: z.string().regex(/^delivery\.[a-z0-9]+(?:[.-][a-z0-9]+)*\.r[1-9][0-9]*$/),
  generatedAt: z.iso.datetime(),
  state: deliveryPackageStateSchema,
  publishEligible: z.boolean(),
  source: z.object({
    platformVariant: revisionReferenceSchema.extend({
      status: platformVariantStatusSchema,
    }).strict(),
    contentAsset: revisionReferenceSchema,
    knowledgePackage: revisionReferenceSchema,
    videoSpec: z.object({
      id: z.string().min(1),
      compositionId: z.string().min(1),
    }).strict(),
  }).strict(),
  destination: z.object({
    platform: platformSchema,
    surface: platformSurfaceSchema,
    language: z.string().min(2),
    aspectRatio: z.enum(['9:16', '1:1', '16:9']),
    platformProfile: revisionReferenceSchema.extend({
      reviewedAt: z.iso.date(),
    }).strict(),
    safeAreaProfile: revisionReferenceSchema.extend({
      reviewedAt: z.iso.date(),
    }).strict(),
  }).strict(),
  media: z.object({
    width: z.number().int().positive(),
    height: z.number().int().positive(),
    fps: z.number().positive(),
    durationSeconds: z.number().positive(),
    videoCodec: z.string().min(1),
    audioCodec: z.string().min(1),
  }).strict(),
  metadata: z.object({
    title: z.string().min(1).optional(),
    caption: z.string().min(1).optional(),
    description: z.string().min(1).optional(),
    hashtags: z.array(z.string().regex(/^#[a-z0-9]+(?:-[a-z0-9]+)*$/)),
    cta: z.string().min(1).optional(),
    claimIds: z.array(stableKnowledgeIdSchema),
    cover: z.object({
      strategy: z.enum(['frame-selection', 'custom-image', 'platform-default']),
      intent: z.string().min(1),
    }).strict(),
  }).strict(),
  captions: z.object({
    behavior: z.enum(['external-track', 'platform-generated', 'burned-in', 'none']),
    language: z.string().min(2),
    artifactPath: z.string().min(1).optional(),
    humanReviewRequired: z.boolean(),
  }).strict(),
  review: z.object({
    platformPreviewRequired: z.boolean(),
    statement: z.string().min(1),
    approval: approvalSchema.optional(),
  }).strict(),
  artifacts: z.array(artifactSchema).min(4),
}).strict().superRefine((manifest, context) => {
  if (
    !manifest.metadata.title
    && !manifest.metadata.caption
    && !manifest.metadata.description
  ) {
    context.addIssue({
      code: 'custom',
      path: ['metadata'],
      message: 'Delivery metadata requires a title, caption, or description',
    });
  }

  const ready = manifest.state === 'ready-for-manual-upload';
  if (manifest.publishEligible !== ready) {
    context.addIssue({
      code: 'custom',
      path: ['publishEligible'],
      message: 'Only ready-for-manual-upload deliveries may be publish eligible',
    });
  }

  const captionArtifacts = manifest.artifacts.filter(({role}) => role === 'captions');
  if (manifest.captions.behavior === 'external-track') {
    if (!manifest.captions.artifactPath || captionArtifacts.length !== 1) {
      context.addIssue({
        code: 'custom',
        path: ['captions'],
        message: 'External caption deliveries require exactly one caption artifact',
      });
    }
  } else if (manifest.captions.artifactPath || captionArtifacts.length > 0) {
    context.addIssue({
      code: 'custom',
      path: ['captions'],
      message: 'Only external caption deliveries may include a caption artifact',
    });
  }

  const seenRoles = new Set<string>();
  const seenPaths = new Set<string>();
  for (const [index, artifact] of manifest.artifacts.entries()) {
    if (seenRoles.has(artifact.role)) {
      context.addIssue({
        code: 'custom',
        path: ['artifacts', index, 'role'],
        message: `Duplicate artifact role: ${artifact.role}`,
      });
    }
    if (seenPaths.has(artifact.path)) {
      context.addIssue({
        code: 'custom',
        path: ['artifacts', index, 'path'],
        message: `Duplicate artifact path: ${artifact.path}`,
      });
    }
    seenRoles.add(artifact.role);
    seenPaths.add(artifact.path);
  }

  for (const requiredRole of ['video', 'metadata', 'upload-copy', 'review']) {
    if (!seenRoles.has(requiredRole)) {
      context.addIssue({
        code: 'custom',
        path: ['artifacts'],
        message: `Missing required artifact role: ${requiredRole}`,
      });
    }
  }
});

export type DeliveryManifest = z.infer<typeof deliveryManifestSchema>;
export type DeliveryPackageState = z.infer<typeof deliveryPackageStateSchema>;
