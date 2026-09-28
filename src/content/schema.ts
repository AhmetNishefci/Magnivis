import {z} from 'zod';
import {stableKnowledgeIdSchema} from '../knowledge/schema';

export const sourceSchema = z.object({
  id: z.string().min(1),
  organization: z.string().min(1),
  title: z.string().min(1),
  url: z.url(),
  retrieved: z.iso.date(),
});

export const factSchema = z.object({
  id: z.string().min(1),
  claim: z.string().min(1),
  value: z.number().positive(),
  unit: z.enum(['km', 'm', 'mm', 'm/s', 's', 'minutes', 'light-years', 'g', 'kg', 'usd', 'count', 'solar-radii']),
  basis: z.enum(['measured', 'defined', 'estimated', 'derived']),
  sourceIds: z.array(z.string().min(1)).min(1),
  display: z.string().min(1),
  notes: z.string().min(1),
});

export const sceneSchema = z.object({
  id: z.string().min(1),
  start: z.number().nonnegative(),
  end: z.number().positive(),
  purpose: z.string().min(1),
}).refine((scene) => scene.end > scene.start, 'Scene end must follow its start');

export const videoSpecSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  compositionId: z.string().min(1),
  workingTitle: z.string().min(1),
  titleCandidates: z.array(z.string().min(1)).min(1),
  descriptionCandidates: z.array(z.string().min(1)).min(1),
  hook: z.string().min(1),
  pillar: z.enum(['universe', 'earth', 'engineering', 'numbers', 'technology']),
  status: z.enum([
    'idea',
    'research',
    'approved',
    'production',
    'rendered',
    'reviewed',
    'uploaded-private',
    'published',
  ]),
  publication: z.object({
    platform: z.literal('youtube'),
    videoId: z.string().min(1),
    publicUrl: z.url(),
    publishedDate: z.iso.date(),
  }).optional(),
  language: z.string().min(2),
  captions: z.array(z.object({
    language: z.string().min(2),
    label: z.string().min(1),
    file: z.string().min(1),
  })),
  format: z.object({
    width: z.number().int().positive(),
    height: z.number().int().positive(),
    fps: z.number().int().positive(),
    durationSeconds: z.number().positive(),
  }),
  scenes: z.array(sceneSchema).min(1),
  factIds: z.array(z.string().min(1)).default([]),
  contentAssetId: stableKnowledgeIdSchema.optional(),
  platformVariantId: stableKnowledgeIdSchema.optional(),
  production: z.object({
    productionPlanId: stableKnowledgeIdSchema,
    productionPlanRevision: z.number().int().positive(),
    knowledgePackageRevision: z.number().int().positive(),
    contentAssetRevision: z.number().int().positive(),
    approvedPackageSha256: z.string().regex(/^[a-f0-9]{64}$/),
    approvedContentAssetSha256: z.string().regex(/^[a-f0-9]{64}$/),
    ownerDecisionSha256: z.string().regex(/^[a-f0-9]{64}$/),
    approvedScriptSha256: z.string().regex(/^[a-f0-9]{64}$/),
    captionPlanId: stableKnowledgeIdSchema.optional(),
    captionPlanRevision: z.number().int().positive().optional(),
    captionPlanSha256: z.string().regex(/^[a-f0-9]{64}$/).optional(),
    safeAreaProfileId: stableKnowledgeIdSchema,
    outputReviewState: z.literal('visual-review-required'),
  }).strict().optional(),
  audio: z.object({
    file: z.string().min(1),
    layers: z.array(z.enum(['music', 'ambient', 'transition', 'impact', 'narration', 'silence'])),
    narration: z.boolean(),
    narrationCues: z.array(z.object({
      id: z.string().min(1),
      file: z.string().min(1),
      start: z.number().nonnegative(),
      duration: z.number().positive().optional(),
      transcript: z.string().min(1),
    })),
    provenance: z.object({
      soundscape: z.object({
        generatorId: stableKnowledgeIdSchema,
        generatorVersion: z.number().int().positive(),
        sha256: z.string().regex(/^[a-f0-9]{64}$/),
      }).strict(),
      narration: z.object({
        provider: z.literal('kokoro-local'),
        modelId: z.string().min(1),
        voiceId: z.string().min(1),
        speed: z.number().positive(),
        generatedAt: z.iso.datetime(),
        approvedScriptSha256: z.string().regex(/^[a-f0-9]{64}$/),
        cueArtifacts: z.array(z.object({
          id: z.string().min(1),
          sha256: z.string().regex(/^[a-f0-9]{64}$/),
        }).strict()).min(1),
      }).strict(),
    }).strict().optional(),
  }),
}).superRefine((video, context) => {
  const usesLegacyFacts = video.factIds.length > 0;
  const usesContentAsset = Boolean(video.contentAssetId);
  const usesPlatformVariant = Boolean(video.platformVariantId);
  const referenceCount = [
    usesLegacyFacts,
    usesContentAsset,
    usesPlatformVariant,
  ].filter(Boolean).length;
  if (referenceCount !== 1) {
    context.addIssue({
      code: 'custom',
      path: ['platformVariantId'],
      message: 'A video must use exactly one of legacy factIds, contentAssetId, or platformVariantId',
    });
  }
});

export type SourceRecord = z.infer<typeof sourceSchema>;
export type FactRecord = z.infer<typeof factSchema>;
export type VideoSpec = z.infer<typeof videoSpecSchema>;
