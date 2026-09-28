import {z} from 'zod';
import type {ContentAsset} from '../content-assets/schema';
import type {KnowledgePackage} from '../knowledge/schema';
import {stableKnowledgeIdSchema} from '../knowledge/schema';

const artifactReferenceSchema = z.object({
  id: stableKnowledgeIdSchema,
  revision: z.number().int().positive(),
  sha256: z.string().regex(/^[a-f0-9]{64}$/),
}).strict();

const frameRangeSchema = z.object({
  start: z.number().int().nonnegative(),
  end: z.number().int().positive(),
}).strict().refine(({start, end}) => end > start, 'Frame end must follow frame start');

const factualTextSchema = z.object({
  text: z.string().min(1),
  claimIds: z.array(stableKnowledgeIdSchema).min(1),
}).strict();

const productionBeatSchema = z.object({
  id: stableKnowledgeIdSchema,
  sourceVisualPlanId: stableKnowledgeIdSchema,
  narrativeBeatId: stableKnowledgeIdSchema,
  scriptSegmentIds: z.array(stableKnowledgeIdSchema).min(1),
  claimIds: z.array(stableKnowledgeIdSchema).min(1),
  frames: frameRangeSchema,
  sceneType: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  objective: z.string().min(1),
  onScreenText: z.array(factualTextSchema),
  animationIntent: z.string().min(1),
  transitionIntent: z.string().min(1),
  audioIntent: z.string().min(1),
}).strict();

const productionAssetSchema = z.object({
  id: stableKnowledgeIdSchema,
  kind: z.enum(['procedural-code', 'generated-audio', 'generated-narration', 'caption-track']),
  path: z.string().min(1).optional(),
  provenance: z.object({
    origin: z.enum(['original-procedural', 'local-synthetic-voice', 'derived-from-approved-script']),
    rights: z.enum(['magnivis-original', 'kokoro-apache-2.0-model-output']),
    notes: z.string().min(1),
  }).strict(),
}).strict();

export const productionPlanSchema = z.object({
  schemaVersion: z.literal(1),
  id: stableKnowledgeIdSchema.refine((id) => id.startsWith('production-plan.')),
  revision: z.number().int().positive(),
  status: z.enum([
    'planned',
    'implementation-ready',
    'rendered-candidate-visual-review-required',
  ]),
  knowledgePackage: artifactReferenceSchema,
  contentAsset: artifactReferenceSchema,
  ownerDecision: artifactReferenceSchema,
  approvedScriptSha256: z.string().regex(/^[a-f0-9]{64}$/),
  excludedClaimIds: z.array(stableKnowledgeIdSchema),
  format: z.object({
    width: z.literal(1080),
    height: z.literal(1920),
    fps: z.literal(30),
    durationSeconds: z.number().positive(),
  }).strict(),
  safeAreaProfileId: stableKnowledgeIdSchema,
  beats: z.array(productionBeatSchema).min(1),
  assets: z.array(productionAssetSchema).min(1),
  captions: z.object({
    file: z.string().min(1),
    generatorId: stableKnowledgeIdSchema,
    generatorVersion: z.number().int().positive(),
    source: z.literal('approved-narration-cues'),
    placement: z.literal('optional-platform-track-lower-center'),
  }).strict(),
  reviewRequirements: z.array(z.string().min(1)).min(1),
}).strict().superRefine((plan, context) => {
  const durationFrames = Math.round(plan.format.durationSeconds * plan.format.fps);
  const ids = plan.beats.map(({id}) => id);
  if (new Set(ids).size !== ids.length) {
    context.addIssue({code: 'custom', path: ['beats'], message: 'Production beat IDs must be unique'});
  }
  plan.beats.forEach((beat, index) => {
    if (beat.frames.end > durationFrames) {
      context.addIssue({code: 'custom', path: ['beats', index, 'frames'], message: 'Production beat exceeds video duration'});
    }
  });
});

export type ProductionPlan = z.infer<typeof productionPlanSchema>;

export const validateProductionPlanReferences = (
  input: unknown,
  knowledgePackage: KnowledgePackage,
  contentAsset: ContentAsset,
) => {
  const plan = productionPlanSchema.parse(input);
  if (
    plan.knowledgePackage.id !== knowledgePackage.id
    || plan.knowledgePackage.revision !== knowledgePackage.revision
    || plan.contentAsset.id !== contentAsset.id
    || plan.contentAsset.revision !== contentAsset.revision
  ) {
    throw new Error('ProductionPlan references a stale KnowledgePackage or ContentAsset');
  }
  if (knowledgePackage.editorialStatus !== 'approved' || contentAsset.editorialStatus !== 'approved') {
    throw new Error('ProductionPlan requires approved knowledge and editorial sources');
  }

  const claimById = new Map(knowledgePackage.claims.map((claim) => [claim.id, claim]));
  const selectedClaimIds = new Set(contentAsset.selectedClaimIds);
  const scriptSegmentIds = new Set(contentAsset.script.segments.map(({id}) => id));
  const narrativeBeatIds = new Set(contentAsset.narrativeStructure.map(({id}) => id));
  const visualPlanIds = new Set(contentAsset.visualPlan.map(({id}) => id));
  const visualPlanUseCounts = new Map<string, number>();

  plan.beats.forEach((beat) => {
    if (!visualPlanIds.has(beat.sourceVisualPlanId)) {
      throw new Error(`ProductionPlan references unknown visual intent: ${beat.sourceVisualPlanId}`);
    }
    visualPlanUseCounts.set(
      beat.sourceVisualPlanId,
      (visualPlanUseCounts.get(beat.sourceVisualPlanId) ?? 0) + 1,
    );
    if (!narrativeBeatIds.has(beat.narrativeBeatId)) {
      throw new Error(`ProductionPlan references unknown narrative beat: ${beat.narrativeBeatId}`);
    }
    beat.scriptSegmentIds.forEach((id) => {
      if (!scriptSegmentIds.has(id)) throw new Error(`ProductionPlan references unknown script segment: ${id}`);
    });
    const factualClaimIds = [
      ...beat.claimIds,
      ...beat.onScreenText.flatMap(({claimIds}) => claimIds),
    ];
    factualClaimIds.forEach((claimId) => {
      const claim = claimById.get(claimId);
      if (!claim || !selectedClaimIds.has(claimId) || claim.verificationStatus !== 'verified') {
        throw new Error(`ProductionPlan references a claim that is not selected and verified: ${claimId}`);
      }
      if (plan.excludedClaimIds.includes(claimId)) {
        throw new Error(`ProductionPlan references an explicitly excluded claim: ${claimId}`);
      }
    });
  });
  if (
    visualPlanUseCounts.size !== visualPlanIds.size
    || [...visualPlanIds].some((id) => visualPlanUseCounts.get(id) !== 1)
  ) {
    throw new Error('ProductionPlan must implement every approved VisualPlan item exactly once');
  }
  return plan;
};
