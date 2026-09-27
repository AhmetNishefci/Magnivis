import {z} from 'zod';
import {deliveryPackageStateSchema} from '../delivery/schema';
import {stableKnowledgeIdSchema} from '../knowledge/schema';
import {platformSchema} from '../platform-variants/schema';

export const platformAccountSchema = z.object({
  id: stableKnowledgeIdSchema.refine((id) => id.startsWith('account.'), {
    message: 'Platform account IDs must use the account.* namespace',
  }),
  revision: z.number().int().positive(),
  platform: platformSchema,
  displayName: z.string().min(1),
  handle: z.string().regex(/^@[A-Za-z0-9._-]+$/).optional(),
  bio: z.string().min(1).optional(),
  status: z.enum(['planned', 'configured', 'active', 'inactive', 'unknown']),
  recordedAt: z.iso.date(),
  notes: z.array(z.string().min(1)),
}).strict();

const disclosureStateSchema = z.enum([
  'declared',
  'not-declared',
  'not-applicable',
  'unknown',
]);

const settingStateSchema = z.enum(['enabled', 'disabled', 'unknown']);

export const platformSettingsSnapshotSchema = z.object({
  visibility: z.enum(['public', 'private', 'unlisted', 'followers', 'unknown']),
  comments: settingStateSchema,
  reuse: settingStateSchema,
  aiGeneratedContentDisclosure: disclosureStateSchema,
  commercialContentDisclosure: disclosureStateSchema,
  captions: z.enum(['external-track', 'platform-generated', 'burned-in', 'none', 'unknown']),
  notes: z.array(z.string().min(1)),
}).strict();

const revisionReferenceSchema = z.object({
  id: stableKnowledgeIdSchema,
  revision: z.number().int().positive(),
}).strict();

export const publicationRecordSchema = z.object({
  id: stableKnowledgeIdSchema.refine((id) => id.startsWith('publication.'), {
    message: 'Publication IDs must use the publication.* namespace',
  }),
  revision: z.number().int().positive(),
  platformAccountId: stableKnowledgeIdSchema,
  platform: platformSchema,
  source: z.object({
    platformVariant: revisionReferenceSchema,
    contentAsset: revisionReferenceSchema,
    knowledgePackage: revisionReferenceSchema,
    videoSpecId: z.string().regex(/^[a-z0-9-]+$/),
    delivery: z.object({
      id: stableKnowledgeIdSchema,
      state: deliveryPackageStateSchema,
      relationship: z.enum(['used-for-upload', 'retrospective-match']),
    }).strict(),
    videoSha256: z.string().regex(/^[a-f0-9]{64}$/),
  }).strict(),
  state: z.enum(['private-preview', 'published', 'unlisted', 'deleted']),
  remote: z.object({
    postId: z.string().min(1),
    url: z.url(),
  }).strict().optional(),
  publishedOn: z.iso.date().optional(),
  recordedAt: z.iso.date(),
  settings: platformSettingsSnapshotSchema,
  approval: z.object({
    approvedBy: z.string().min(1),
    approvedAt: z.iso.date(),
    notes: z.string().min(1).optional(),
  }).strict(),
}).strict().superRefine((publication, context) => {
  if (publication.state === 'published' && (!publication.remote || !publication.publishedOn)) {
    context.addIssue({
      code: 'custom',
      path: ['remote'],
      message: 'Published records require remote identity and publication date',
    });
  }
  if (
    publication.state === 'published'
    && publication.source.delivery.relationship === 'used-for-upload'
    && publication.source.delivery.state !== 'ready-for-manual-upload'
  ) {
    context.addIssue({
      code: 'custom',
      path: ['source', 'delivery', 'state'],
      message: 'Published records require a ready-for-manual-upload source delivery',
    });
  }
});

export const metricSnapshotSchema = z.object({
  id: stableKnowledgeIdSchema.refine((id) => id.startsWith('metric-snapshot.'), {
    message: 'Metric snapshot IDs must use the metric-snapshot.* namespace',
  }),
  revision: z.number().int().positive(),
  publicationId: stableKnowledgeIdSchema,
  capturedAt: z.iso.datetime(),
  source: z.object({
    kind: z.enum(['manual-entry', 'manual-export', 'official-api']),
    notes: z.string().min(1),
  }).strict(),
  observationWindow: z.object({
    kind: z.enum(['since-publication', 'rolling', 'custom']),
    label: z.string().min(1),
    start: z.iso.datetime().optional(),
    end: z.iso.datetime().optional(),
  }).strict(),
  metrics: z.array(z.object({
    key: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    nativeName: z.string().min(1),
    value: z.number(),
    unit: z.enum(['count', 'seconds', 'minutes', 'hours', 'percent', 'ratio', 'currency']),
    definition: z.string().min(1),
    notes: z.string().min(1).optional(),
  }).strict()).min(1),
}).strict().superRefine((snapshot, context) => {
  const keys = new Set<string>();
  snapshot.metrics.forEach((metric, index) => {
    if (keys.has(metric.key)) {
      context.addIssue({
        code: 'custom',
        path: ['metrics', index, 'key'],
        message: `Duplicate metric key: ${metric.key}`,
      });
    }
    keys.add(metric.key);
  });
  if (snapshot.observationWindow.kind !== 'since-publication') {
    if (!snapshot.observationWindow.start || !snapshot.observationWindow.end) {
      context.addIssue({
        code: 'custom',
        path: ['observationWindow'],
        message: 'Rolling and custom windows require start and end timestamps',
      });
    } else if (snapshot.observationWindow.end <= snapshot.observationWindow.start) {
      context.addIssue({
        code: 'custom',
        path: ['observationWindow', 'end'],
        message: 'Observation window end must follow its start',
      });
    }
  }
});

export type PlatformAccount = z.infer<typeof platformAccountSchema>;
export type PublicationRecord = z.infer<typeof publicationRecordSchema>;
export type MetricSnapshot = z.infer<typeof metricSnapshotSchema>;
