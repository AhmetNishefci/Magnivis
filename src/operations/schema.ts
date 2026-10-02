import {z} from 'zod';
import {mediaReferenceSchema} from '../artifacts/media';
import {platformApprovalSchema,presentationDecisionReferenceSchema} from '../platform-variants/owner-presentation';
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
      manifestSha256:z.string().regex(/^[a-f0-9]{64}$/).optional(),
    }).strict(),
    videoSha256: z.string().regex(/^[a-f0-9]{64}$/),
    mediaArtifact: mediaReferenceSchema.optional(),
  }).strict(),
  state: z.enum(['private-preview', 'published', 'published-owner-reported', 'unlisted', 'deleted']),
  ownerReport:z.object({decision:presentationDecisionReferenceSchema,evidenceBasis:z.literal('explicit-owner-message'),enteredAt:z.iso.datetime(),timeBasis:z.literal('decision-entry'),publishedAt:z.null(),managementUrl:z.url().optional(),missingPublicPermalink:z.boolean(),uploadIdentityBasis:z.literal('owner-reported-prepared-file'),limitations:z.array(z.string()).min(1)}).strict().optional(),
  firstComment:z.object({state:z.literal('owner-reported-posted'),text:z.string().min(1),commentId:z.null(),postedAt:z.null(),pinState:z.literal('unknown'),engagement:z.null(),decision:presentationDecisionReferenceSchema}).strict().optional(),
  remote: z.object({
    postId: z.string().min(1),
    url: z.url(),
  }).strict().optional(),
  publishedOn: z.iso.date().optional(),
  recordedAt: z.iso.date(),
  settings: platformSettingsSnapshotSchema,
  approval: platformApprovalSchema,
}).strict().superRefine((publication, context) => {
  if (publication.source.mediaArtifact && publication.source.mediaArtifact.sha256 !== publication.source.videoSha256) context.addIssue({code: 'custom', message: 'Publication media must match exact uploaded hash'});
  if (publication.state === 'published-owner-reported') {
    if (!publication.ownerReport || !publication.publishedOn || !publication.source.delivery.manifestSha256 || !publication.approval.ownerDecision) {
      context.addIssue({code:'custom',message:'Owner-reported publication requires dated explicit evidence, exact delivery hash and approval decision'});
    }
    if (publication.ownerReport?.missingPublicPermalink === Boolean(publication.remote)) {
      context.addIssue({code:'custom',message:'Missing permalink must accurately match remote identity availability'});
    }
    if (publication.platform === 'tiktok' && publication.remote && !/^https:\/\/(?:www\.)?tiktok\.com\/@[^/]+\/video\/\d+/.test(publication.remote.url)) {
      context.addIssue({code:'custom',message:'TikTok remote identity must be an individual public video, never Studio'});
    }
  } else if (publication.ownerReport) {
    context.addIssue({code:'custom',message:'Owner report evidence belongs to the distinct owner-reported publication state'});
  }
  if (publication.state === 'published' && (!publication.remote || !publication.publishedOn)) {
    context.addIssue({
      code: 'custom',
      path: ['remote'],
      message: 'Published records require remote identity and publication date',
    });
  }
  if (
    ['published','published-owner-reported'].includes(publication.state)
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
