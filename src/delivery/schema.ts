import {z} from 'zod';
import {mediaReferenceSchema} from '../artifacts/media';
import {platformApprovalSchema} from '../platform-variants/owner-presentation';
import {stableKnowledgeIdSchema} from '../knowledge/schema';
import {
  platformSchema,
  platformPreviewStatusSchema,
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
  role: z.enum(['video', 'captions', 'cover', 'metadata', 'upload-copy', 'review']),
  path: z.string().min(1).refine(p => !p.startsWith('/') && !p.includes('\\') && p.split('/').every(s => s && s !== '.' && s !== '..')),
  mediaArtifact: mediaReferenceSchema.optional(),
  mediaType: z.string().min(1),
  bytes: z.number().int().nonnegative(),
  sha256: z.string().regex(/^[a-f0-9]{64}$/),
}).strict();

const approvalSchema = platformApprovalSchema;

export const deliveryManifestSchema = z.object({
  schemaVersion: z.union([z.literal(1), z.literal(2), z.literal(3)]),
  deliveryId: z.string().regex(/^delivery\.[a-z0-9]+(?:[.-][a-z0-9]+)*\.r[1-9][0-9]*$/),
  generatedAt: z.iso.datetime(),
  state: deliveryPackageStateSchema,
  publishEligible: z.boolean(),
  source: z.object({
    mediaArtifact: mediaReferenceSchema.optional(),
    platformVariant: revisionReferenceSchema.extend({
      status: platformVariantStatusSchema,
    }).strict(),
    contentAsset: revisionReferenceSchema,
    knowledgePackage: revisionReferenceSchema,
    videoSpec: z.object({
      id: z.string().min(1),
      compositionId: z.string().min(1),
    }).strict(),
    productionChain: z.object({
      productionPlan: revisionReferenceSchema,
      captionPlan: revisionReferenceSchema.extend({
        sha256: z.string().regex(/^[a-f0-9]{64}$/),
      }).strict(),
      lockedMaster: z.object({
        videoSpecId: z.string().regex(/^[a-z0-9-]+$/),
        path: z.string().min(1),
        sha256: z.string().regex(/^[a-f0-9]{64}$/),
        relationship: z.enum(['exact-master', 'platform-safe-area-derivative', 'platform-specific-derivative']),
      }).strict(),
    }).strict().optional(),
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
      artifact:z.object({id:z.string().min(1),path:z.string().min(1),sha256:z.string().regex(/^[a-f0-9]{64}$/)}).strict().optional(),
    }).strict(),
  }).strict(),
  captions: z.object({
    behavior: z.enum(['external-track', 'platform-generated', 'burned-in', 'none']),
    designedBurnedIn: z.boolean().default(false),
    language: z.string().min(2),
    artifactPath: z.string().min(1).optional(),
    humanReviewRequired: z.boolean(),
  }).strict(),
  operatorGuidance: z.object({
    visibility: z.literal('private-preview'),
    manualPublication: z.object({visibility: z.literal('public'), authorization: z.object({id: z.string().startsWith('owner-decision.'), revision: z.number().int().positive(), sha256: z.string().regex(/^[a-f0-9]{64}$/)}).strict()}).strict().optional(),
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
    notes: z.array(z.string().min(1)),
  }).strict().optional(),
  review: z.object({
    platformPreviewRequired: z.boolean(),
    previewStatus: platformPreviewStatusSchema.default('not-ready'),
    publicationAuthorized: z.literal(false).default(false),
    statement: z.string().min(1),
    approval: approvalSchema.optional(),
  }).strict(),
  artifacts: z.array(artifactSchema).min(4),
}).strict().superRefine((manifest, context) => {
  const referenceBased = manifest.schemaVersion === 3;
  if (referenceBased !== Boolean(manifest.source.mediaArtifact)) context.addIssue({code: 'custom', message: 'V3 requires exact canonical source media; legacy manifests cannot add media references'});
  for (const a of manifest.artifacts) {
    if (a.mediaArtifact && (!referenceBased || !['video', 'cover'].includes(a.role) || a.sha256 !== a.mediaArtifact.sha256)) context.addIssue({code: 'custom', message: 'Invalid external media reference'});
    if (!a.mediaArtifact && a.path.includes('/')) context.addIssue({code: 'custom', message: 'Package-local artifact must be a basename'});
    if (referenceBased && ['video', 'cover'].includes(a.role) && !a.mediaArtifact) context.addIssue({code: 'custom', message: 'V3 binary assets must reference canonical media'});
  }
  const video = manifest.artifacts.find(a => a.role === 'video');
  if (referenceBased && (video?.mediaArtifact?.id !== manifest.source.mediaArtifact?.id || video?.sha256 !== manifest.source.mediaArtifact?.sha256)) context.addIssue({code: 'custom', message: 'Video/source media identity mismatch'});
  const manualPublication = manifest.operatorGuidance?.manualPublication;
  if (manualPublication && (manifest.state !== 'ready-for-manual-upload' || manifest.review.approval?.ownerDecision?.id !== manualPublication.authorization.id || manifest.review.approval?.ownerDecision?.revision !== manualPublication.authorization.revision || manifest.review.approval?.ownerDecision?.sha256 !== manualPublication.authorization.sha256)) {
    context.addIssue({code: 'custom', message: 'Public manual-upload instructions require a ready handoff and matching explicit authorization'});
  }
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

  const covers=manifest.artifacts.filter(a=>a.role==='cover');
  if ((manifest.metadata.cover.artifact && (manifest.metadata.cover.strategy!=='custom-image'||covers.length!==1||covers[0]?.sha256!==manifest.metadata.cover.artifact.sha256)) || (!manifest.metadata.cover.artifact&&covers.length)) context.addIssue({code:'custom',message:'Delivery cover must match its exact registered artifact'});

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
