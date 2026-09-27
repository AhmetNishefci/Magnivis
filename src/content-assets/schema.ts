import {z} from 'zod';
import {stableKnowledgeIdSchema} from '../knowledge/schema';

export const contentAssetTypeSchema = z.enum([
  'short-form-video',
  'long-form-video',
]);

export const contentAssetStatusSchema = z.enum([
  'draft',
  'editorial-review',
  'approved',
  'production-ready',
  'archived',
]);

export const visualTypeSchema = z.enum([
  'footage',
  'diagram',
  'animation',
  'map',
  'chart',
  'generated-visual',
  'motion-typography',
  'archival-public-domain',
]);

const factualScriptSegmentSchema = z.object({
  id: stableKnowledgeIdSchema,
  type: z.literal('factual'),
  text: z.string().min(1),
  claimIds: z.array(stableKnowledgeIdSchema).min(1),
}).strict();

const editorialScriptSegmentSchema = z.object({
  id: stableKnowledgeIdSchema,
  type: z.literal('editorial'),
  text: z.string().min(1),
}).strict();

export const scriptSegmentSchema = z.discriminatedUnion('type', [
  factualScriptSegmentSchema,
  editorialScriptSegmentSchema,
]);

const narrativeBeatSchema = z.object({
  id: stableKnowledgeIdSchema,
  label: z.string().min(1),
  purpose: z.string().min(1),
  scriptSegmentIds: z.array(stableKnowledgeIdSchema).min(1),
}).strict();

export const visualPlanItemSchema = z.object({
  id: stableKnowledgeIdSchema,
  narrativeBeatId: stableKnowledgeIdSchema,
  objective: z.string().min(1),
  visualType: visualTypeSchema,
  scriptSegmentIds: z.array(stableKnowledgeIdSchema).default([]),
  claimIds: z.array(stableKnowledgeIdSchema).default([]),
  notes: z.string().min(1).optional(),
}).strict();

const narrationPlanSchema = z.object({
  mode: z.enum(['narrated', 'silent', 'mixed']),
  voiceDirection: z.string().min(1).optional(),
  pronunciationNotes: z.array(z.string().min(1)).default([]),
}).strict().superRefine((plan, context) => {
  if (plan.mode !== 'silent' && !plan.voiceDirection) {
    context.addIssue({
      code: 'custom',
      path: ['voiceDirection'],
      message: 'Narrated and mixed assets require voice direction',
    });
  }
});

const approvalSchema = z.object({
  approvedBy: z.string().min(1),
  approvedAt: z.iso.date(),
  notes: z.string().min(1).optional(),
}).strict();

const duplicateValues = (values: readonly string[]) => {
  const seen = new Set<string>();
  return [...new Set(values.filter((value) => {
    if (seen.has(value)) return true;
    seen.add(value);
    return false;
  }))];
};

export const contentAssetSchema = z.object({
  id: stableKnowledgeIdSchema,
  revision: z.number().int().positive(),
  knowledgePackageId: stableKnowledgeIdSchema,
  assetType: contentAssetTypeSchema,
  editorialPurpose: z.string().min(1),
  storyAngle: z.string().min(1),
  hookId: stableKnowledgeIdSchema,
  selectedClaimIds: z.array(stableKnowledgeIdSchema).min(1),
  durationIntentSeconds: z.object({
    minimum: z.number().positive(),
    maximum: z.number().positive(),
  }).strict().refine(
    ({minimum, maximum}) => maximum >= minimum,
    'Maximum duration must be greater than or equal to minimum duration',
  ),
  script: z.object({
    language: z.string().min(2),
    segments: z.array(scriptSegmentSchema).min(1),
  }).strict(),
  narrativeStructure: z.array(narrativeBeatSchema).min(1),
  visualPlan: z.array(visualPlanItemSchema).min(1),
  narrationPlan: narrationPlanSchema.optional(),
  editorialStatus: contentAssetStatusSchema,
  approval: approvalSchema.optional(),
}).strict().superRefine((asset, context) => {
  const expectedAssetPrefix = `${asset.knowledgePackageId}.asset.`;
  if (!asset.id.startsWith(expectedAssetPrefix)) {
    context.addIssue({
      code: 'custom',
      path: ['id'],
      message: `Content asset IDs must use the ${expectedAssetPrefix}* namespace`,
    });
  }

  const idCollections = [
    ['selectedClaimIds', asset.selectedClaimIds],
    ['script', asset.script.segments.map(({id}) => id)],
    ['narrativeStructure', asset.narrativeStructure.map(({id}) => id)],
    ['visualPlan', asset.visualPlan.map(({id}) => id)],
  ] as const;
  for (const [field, ids] of idCollections) {
    for (const duplicate of duplicateValues(ids)) {
      context.addIssue({
        code: 'custom',
        path: [field],
        message: `Duplicate ID: ${duplicate}`,
      });
    }
  }

  const expectedScriptPrefix = `${asset.id}.script.`;
  const expectedBeatPrefix = `${asset.id}.beat.`;
  const expectedVisualPrefix = `${asset.id}.visual.`;
  const selectedClaimIds = new Set(asset.selectedClaimIds);
  const scriptSegmentIds = new Set(asset.script.segments.map(({id}) => id));
  const narrativeBeatIds = new Set(asset.narrativeStructure.map(({id}) => id));
  const usedClaimIds = new Set<string>();
  const assignedScriptSegmentIds: string[] = [];

  asset.script.segments.forEach((segment, segmentIndex) => {
    if (!segment.id.startsWith(expectedScriptPrefix)) {
      context.addIssue({
        code: 'custom',
        path: ['script', 'segments', segmentIndex, 'id'],
        message: `Script segment IDs must use the ${expectedScriptPrefix}* namespace`,
      });
    }
    if (segment.type === 'factual') {
      segment.claimIds.forEach((claimId, claimIndex) => {
        usedClaimIds.add(claimId);
        if (!selectedClaimIds.has(claimId)) {
          context.addIssue({
            code: 'custom',
            path: ['script', 'segments', segmentIndex, 'claimIds', claimIndex],
            message: `Script references an unselected claim: ${claimId}`,
          });
        }
      });
    }
  });

  asset.narrativeStructure.forEach((beat, beatIndex) => {
    if (!beat.id.startsWith(expectedBeatPrefix)) {
      context.addIssue({
        code: 'custom',
        path: ['narrativeStructure', beatIndex, 'id'],
        message: `Narrative beat IDs must use the ${expectedBeatPrefix}* namespace`,
      });
    }
    beat.scriptSegmentIds.forEach((segmentId, segmentIndex) => {
      assignedScriptSegmentIds.push(segmentId);
      if (!scriptSegmentIds.has(segmentId)) {
        context.addIssue({
          code: 'custom',
          path: ['narrativeStructure', beatIndex, 'scriptSegmentIds', segmentIndex],
          message: `Unknown script segment: ${segmentId}`,
        });
      }
    });
  });

  for (const duplicate of duplicateValues(assignedScriptSegmentIds)) {
    context.addIssue({
      code: 'custom',
      path: ['narrativeStructure'],
      message: `Script segment assigned to multiple narrative beats: ${duplicate}`,
    });
  }
  for (const segmentId of scriptSegmentIds) {
    if (!assignedScriptSegmentIds.includes(segmentId)) {
      context.addIssue({
        code: 'custom',
        path: ['narrativeStructure'],
        message: `Script segment is not assigned to a narrative beat: ${segmentId}`,
      });
    }
  }

  asset.visualPlan.forEach((visual, visualIndex) => {
    if (!visual.id.startsWith(expectedVisualPrefix)) {
      context.addIssue({
        code: 'custom',
        path: ['visualPlan', visualIndex, 'id'],
        message: `Visual plan IDs must use the ${expectedVisualPrefix}* namespace`,
      });
    }
    if (!narrativeBeatIds.has(visual.narrativeBeatId)) {
      context.addIssue({
        code: 'custom',
        path: ['visualPlan', visualIndex, 'narrativeBeatId'],
        message: `Unknown narrative beat: ${visual.narrativeBeatId}`,
      });
    }
    visual.scriptSegmentIds.forEach((segmentId, segmentIndex) => {
      if (!scriptSegmentIds.has(segmentId)) {
        context.addIssue({
          code: 'custom',
          path: ['visualPlan', visualIndex, 'scriptSegmentIds', segmentIndex],
          message: `Unknown script segment: ${segmentId}`,
        });
      }
    });
    visual.claimIds.forEach((claimId, claimIndex) => {
      usedClaimIds.add(claimId);
      if (!selectedClaimIds.has(claimId)) {
        context.addIssue({
          code: 'custom',
          path: ['visualPlan', visualIndex, 'claimIds', claimIndex],
          message: `Visual plan references an unselected claim: ${claimId}`,
        });
      }
    });
  });

  asset.selectedClaimIds.forEach((claimId, claimIndex) => {
    if (!usedClaimIds.has(claimId)) {
      context.addIssue({
        code: 'custom',
        path: ['selectedClaimIds', claimIndex],
        message: `Selected claim is unused by the script and visual plan: ${claimId}`,
      });
    }
  });

  if (
    ['approved', 'production-ready', 'archived'].includes(asset.editorialStatus)
    && !asset.approval
  ) {
    context.addIssue({
      code: 'custom',
      path: ['approval'],
      message: `${asset.editorialStatus} assets require approval metadata`,
    });
  }
});

export type ContentAsset = z.infer<typeof contentAssetSchema>;
export type ScriptSegment = z.infer<typeof scriptSegmentSchema>;
export type VisualPlanItem = z.infer<typeof visualPlanItemSchema>;
