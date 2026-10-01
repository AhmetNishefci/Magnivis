import {executionPolicySchema,validateExecutionPolicy,predatesBrandPolicy} from '../design/brand-execution-policy';
import {z} from 'zod';
import {creativeReferenceSchema} from '../content-assets/creative-direction';
import {validateCreativeDirection} from '../content-assets/creative-direction-integrity';
import {sha256Json} from '../content-intelligence/run-schema';
import historicalPlans from '../../system-audits/adaptive-creative-direction-v1/historical-plans.json';
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
  kind: z.string().regex(/^[a-z]+(?:-[a-z]+)*$/),
  path: z.string().min(1).optional(),
  provenance: z.object({
    origin: z.string().min(1),
    rights: z.string().min(1),
    notes: z.string().min(1),
    evidence: z.string().min(1).optional(),
  }).strict(),
}).strict();

export const productionVisualApprovalSchema = z.object({
  decision: z.literal('approved'),
  reviewedBy: z.string().min(1),
  reviewedAt: z.iso.datetime().optional(),
  decisionEnteredAt: z.iso.datetime().optional(),
  reviewTimeBasis: z.literal('decision-entry').optional(),
  ownerDecision: artifactReferenceSchema.optional(),
  artifact: z.object({
    path: z.string().min(1),
    sha256: z.string().regex(/^[a-f0-9]{64}$/),
  }).strict(),
  captionPlan: artifactReferenceSchema,
  notes: z.string().min(1),
  platformVariantApprovalGranted: z.literal(false),
  publicationApprovalGranted: z.literal(false),
}).strict().superRefine((approval, context) => {
  if (!approval.reviewedAt && !approval.decisionEnteredAt) context.addIssue({code:'custom',message:'Visual approval needs supplied review time or labeled decision-entry time'});
  if (approval.decisionEnteredAt && (approval.reviewedAt || approval.reviewTimeBasis !== 'decision-entry' || !approval.ownerDecision)) context.addIssue({code:'custom',message:'Decision-entry visual approval needs its exact decision and cannot impersonate a supplied review timestamp'});
  if (approval.reviewTimeBasis && !approval.decisionEnteredAt) context.addIssue({code:'custom',message:'Decision-entry basis requires entry time'});
});

export const productionPlanSchema = z.object({
  schemaVersion: z.literal(1),
  id: stableKnowledgeIdSchema.refine((id) => id.startsWith('production-plan.')),
  revision: z.number().int().positive(),
  status: z.enum([
    'planned',
    'implementation-ready',
    'rendered-candidate-visual-review-required',
    'owner-visual-approved',
  ]),
  knowledgePackage: artifactReferenceSchema,
  contentAsset: artifactReferenceSchema,
  ownerDecision: artifactReferenceSchema,
  approvedScriptSha256: z.string().regex(/^[a-f0-9]{64}$/),
  creativeDirection: creativeReferenceSchema.optional(),
  executionPolicy: executionPolicySchema.optional(),
  excludedClaimIds: z.array(stableKnowledgeIdSchema),
  format: z.object({
    width: z.number().int().positive(),
    height: z.number().int().positive(),
    fps: z.number().int().positive(),
    durationSeconds: z.number().positive(),
  }).strict(),
  safeAreaProfileId: stableKnowledgeIdSchema,
  beats: z.array(productionBeatSchema).min(1),
  assets: z.array(productionAssetSchema).min(1),
  captions: z.object({
    file: z.string().min(1),
    captionPlanId: stableKnowledgeIdSchema,
    captionPlanRevision: z.number().int().positive(),
    captionPlanSha256: z.string().regex(/^[a-f0-9]{64}$/),
    generatorId: stableKnowledgeIdSchema,
    generatorVersion: z.number().int().positive(),
    source: z.literal('approved-narration-cues'),
    designedBurnedIn: z.literal(true),
    placement: z.literal('optional-platform-track-lower-center'),
  }).strict(),
  visualApproval: productionVisualApprovalSchema.optional(),
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
  if (plan.status === 'owner-visual-approved' && !plan.visualApproval) {
    context.addIssue({
      code: 'custom',
      path: ['visualApproval'],
      message: 'Owner-visual-approved production plans require exact artifact approval metadata',
    });
  }
  if (plan.status !== 'owner-visual-approved' && plan.visualApproval) {
    context.addIssue({
      code: 'custom',
      path: ['visualApproval'],
      message: 'Visual approval metadata requires owner-visual-approved status',
    });
  }
  if (plan.visualApproval && (
    plan.visualApproval.captionPlan.id !== plan.captions.captionPlanId
    || plan.visualApproval.captionPlan.revision !== plan.captions.captionPlanRevision
    || plan.visualApproval.captionPlan.sha256 !== plan.captions.captionPlanSha256
  )) {
    context.addIssue({
      code: 'custom',
      path: ['visualApproval', 'captionPlan'],
      message: 'Visual approval must reference the exact CaptionPlan used by the production plan',
    });
  }
});

export type ProductionPlan = z.infer<typeof productionPlanSchema>;

export const validateProductionPlanReferences = (
  input: unknown,
  knowledgePackage: KnowledgePackage,
  contentAsset: ContentAsset,
  creativeDirection?: unknown,
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
  const historical = historicalPlans.some(ref => ref.id === plan.id && ref.sha256 === sha256Json(plan));
  if (!historical) {
    if (plan.knowledgePackage.sha256 !== sha256Json(knowledgePackage) || plan.contentAsset.sha256 !== sha256Json(contentAsset)
      || plan.approvedScriptSha256 !== sha256Json(contentAsset.script)) throw new Error('Future ProductionPlan editorial hashes are stale');
    if (plan.assets.some(asset => !asset.provenance.evidence)) throw new Error('Future assets require inspectable provenance/license evidence');
    if (!plan.creativeDirection || !creativeDirection) throw new Error('Future production requires an exact asset-bound CreativeDirection');
    const direction = validateCreativeDirection(creativeDirection, knowledgePackage, contentAsset);
    if (direction.state !== 'ready-for-production-planning'
      || plan.creativeDirection.id !== direction.id || plan.creativeDirection.revision !== direction.revision
      || plan.creativeDirection.sha256 !== sha256Json(direction)) throw new Error('ProductionPlan creative direction is stale or not ready');
  }
  if (!historical && !predatesBrandPolicy(plan)) validateExecutionPolicy(plan.executionPolicy);
  return plan;
};
