import {z} from 'zod';
import type {ContentAsset} from '../content-assets/schema';
import {sha256Json} from '../content-intelligence/run-schema';
import type {CreativeDirection} from '../content-assets/creative-direction';
import {creativeReferenceSchema} from '../content-assets/creative-direction';
import {reconstructCanonicalNarration} from './plan';
import {captionSourceBoundarySchema} from './schema';

// A future authored visual system; no fallback to the immutable V1 renderer.
export const adaptiveCaptionPlanSchema = z.object({
  schemaVersion: z.literal(2), id: z.string().startsWith('caption-plan.'),
  revision: z.number().int().positive(), status: z.enum(['draft','review-required','approved']),
  creativeDirection: creativeReferenceSchema, approvedScriptSha256: z.string().regex(/^[a-f0-9]{64}$/),
  fps: z.number().positive(), coverage: z.literal('complete-narration'),
  visualTreatment: z.object({
    fontAsset: z.string().min(1), fontFamily: z.string().min(1),
    fontSize: z.number().positive(), fontWeight: z.number().int().min(100).max(1000),
    lineHeight: z.number().positive(), foreground: z.string().min(1),
    emphasisMethod: z.string().min(1), backdrop: z.string().min(1),
    animation: z.string().min(1), rendererId: z.string().min(1), rationale: z.string().min(1),
  }).strict(),
  cues: z.array(z.object({
    id: z.string().min(1), sourceNarrationCueId: z.string().min(1),
    startFrame: z.number().int().nonnegative(), endFrame: z.number().int().positive(),
    lines: z.array(z.string().min(1)).min(1),
    sourceBoundaryBefore: captionSourceBoundarySchema.optional(),
    bounds: z.object({x:z.number().nonnegative(),y:z.number().nonnegative(),width:z.number().positive(),height:z.number().positive()}).strict(),
    presentationIntent: z.string().min(1),
  }).strict()).min(1),
}).strict();
export const validateAdaptiveCaptionPlan = (
  input: unknown,
  narration: readonly {id:string;transcript:string;start:number;duration:number}[],
  canvas: {width:number;height:number},
  direction: CreativeDirection,
  approvedAsset: ContentAsset,
) => {
  const plan = adaptiveCaptionPlanSchema.parse(input);
  if (direction.state !== 'ready-for-production-planning' || plan.creativeDirection.id !== direction.id
    || plan.creativeDirection.revision !== direction.revision || plan.creativeDirection.sha256 !== sha256Json(direction)
    || plan.approvedScriptSha256 !== direction.approvedScriptSha256) throw new Error('Adaptive caption direction/script binding is stale');
  if (sha256Json(approvedAsset) !== direction.contentAsset.sha256 || sha256Json(approvedAsset.script) !== plan.approvedScriptSha256
    || narration.map(n=>n.transcript).join(' ') !== approvedAsset.script.segments.map(s=>s.text).join(' ')) throw new Error('Adaptive captions require exact approved narration/source');
  if (new Set(plan.cues.map(c=>c.id)).size !== plan.cues.length) throw new Error('Duplicate caption cue');
  for (let i=0;i<plan.cues.length;i++) {
    const c=plan.cues[i]!;const source=narration.find(n=>n.id===c.sourceNarrationCueId);
    if (!source || c.endFrame<=c.startFrame || c.startFrame<Math.round(source.start*plan.fps)
      || c.endFrame>Math.round((source.start+source.duration)*plan.fps)
      || (i>0 && c.startFrame<plan.cues[i-1]!.endFrame)) throw new Error('Caption timing is outside ordered speech');
    if (c.bounds.x+c.bounds.width>canvas.width || c.bounds.y+c.bounds.height>canvas.height) throw new Error('Caption bounds exceed canvas');
  }
  const sourceOrder=plan.cues.map(c=>c.sourceNarrationCueId).filter((id,i,a)=>i===0||id!==a[i-1]);
  if (JSON.stringify(sourceOrder)!==JSON.stringify(narration.map(n=>n.id))) throw new Error('Caption source order or coverage differs from narration');
  for (const n of narration) {
    const cues=plan.cues.filter(c=>c.sourceNarrationCueId===n.id);
    if (reconstructCanonicalNarration(cues)!==n.transcript) throw new Error('Caption narration fidelity failed');
  }
  // Canvas containment is not a platform/native-UI pass. The actual renderer must
  // separately prove typography fit, provenance, safe regions and real-device QA.
  return plan;
};
