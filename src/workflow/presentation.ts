import {z} from 'zod';
import {mediaReferenceSchema, type MediaRegistry, type MediaReference} from '../artifacts/media';
import {sha256Json} from '../content-intelligence/run-schema';
import {digest, text, recordReferenceSchema, readBoundFile} from './evidence';
import {platformSchema} from '../platform-variants/schema';
const rect = z.object({x: z.number().nonnegative(), y: z.number().nonnegative(), width: z.number().positive(), height: z.number().positive()}).strict();
const model = z.object({
  state: z.enum(['measured', 'owner-reported', 'provisional', 'unknown']),
  regions: z.array(rect).nullable(), rationale: text,
  provenance: z.array(recordReferenceSchema),
}).strict().superRefine((m, ctx) => {
  if (m.state === 'unknown' && m.regions !== null || m.state !== 'unknown' && (m.regions === null || !m.provenance.length)) ctx.addIssue({code: 'custom', message: 'Geometry must preserve confidence and provenance; unknown means null'});
});
export const presentationProfileV3Schema = z.object({
  schemaVersion: z.literal(3), id: text, revision: z.number().int().positive(),
  platform: platformSchema, surface: text,
  canvas: z.object({width: z.number().int().positive(), height: z.number().int().positive()}).strict(),
  reviewedAt: z.iso.datetime(), reviewAfter: z.iso.datetime(),
  lifecycle: z.enum(['current', 'superseded']),
  compositionSafe: model, nativeExclusions: model, captionSafe: model, cropSafe: model,
  export: z.object({containers: z.array(text).min(1), videoCodecs: z.array(text).min(1), audioCodecs: z.array(text).min(1), fps: z.array(z.number().positive()).min(1), duration: z.object({minimum: z.number().nonnegative(), maximum: z.number().positive()}).strict(), provenance: z.array(recordReferenceSchema).min(1), rationale: text}).strict(),
}).strict().superRefine((p, ctx) => {
  if (p.export.duration.maximum < p.export.duration.minimum || p.reviewAfter < p.reviewedAt) ctx.addIssue({code:'custom', message:'Invalid versioned profile range'});
  for (const m of [p.compositionSafe, p.nativeExclusions, p.captionSafe, p.cropSafe]) for (const r of m.regions ?? []) if (r.x + r.width > p.canvas.width || r.y + r.height > p.canvas.height) ctx.addIssue({code:'custom',message:'Profile rectangle outside canvas'});
});
const sample = z.object({frame: z.number().int().nonnegative(), kind: z.enum(['hook', 'payoff', 'disclosure', 'caption-midpoint', 'critical', 'timeline']), bounds: rect}).strict();
export const presentationEvidenceV3Schema = z.object({
  schemaVersion: z.literal(3), medium: z.enum(['video','image']).default('video'), media: mediaReferenceSchema,
  platform: platformSchema, surface: text, profileSha256: digest,
  inspectedAt: z.iso.datetime(), fps:z.number().positive().optional(), durationFrames: z.number().int().positive(),
  samples: z.array(sample).min(1),
  coverage: z.object({
    method: z.enum(['all-frame-bounds', 'sampled-bounds']),
    captionMidpoints: z.array(z.number().int().nonnegative()),
    hookFrames: z.array(z.number().int().nonnegative()),
    payoffFrames: z.array(z.number().int().nonnegative()),
    disclosureFrames: z.array(z.number().int().nonnegative()), noDisclosureReason: text.optional(),
  }).strict(),
  reports: z.array(recordReferenceSchema).min(1),
  device: z.object({context:z.enum(['not-tested','desktop-web','mobile-app']).default('not-tested'),reviewer:text.nullable().default(null),os:text.nullable().default(null),appVersion:text.nullable().default(null),state: z.enum(['not-tested', 'passed', 'failed']), device: text.nullable(), testedAt: z.iso.datetime().nullable(), evidence: z.array(recordReferenceSchema)}).strict(),
}).strict();
const contains = (a: z.infer<typeof rect>, b: z.infer<typeof rect>) => b.x >= a.x && b.y >= a.y && b.x+b.width <= a.x+a.width && b.y+b.height <= a.y+a.height;
const overlap = (a: z.infer<typeof rect>, b: z.infer<typeof rect>) => a.x < b.x+b.width && a.x+a.width > b.x && a.y < b.y+b.height && a.y+a.height > b.y;
export const assessPresentationV3 = (input: unknown, profileInput: unknown, media: MediaReference, registry: MediaRegistry, now: string, root = process.cwd()) => {
  const evidence = presentationEvidenceV3Schema.parse(input);
  const profile = presentationProfileV3Schema.parse(profileInput);
  registry.resolveFile(media);
  if (sha256Json(evidence.media) !== sha256Json(media) || evidence.platform !== profile.platform || evidence.surface !== profile.surface || evidence.profileSha256 !== sha256Json(profile)) throw new Error('Presentation evidence must bind exact evaluated media, platform, surface and profile');
  [...evidence.reports, ...evidence.device.evidence, ...profile.export.provenance, ...[profile.compositionSafe, profile.nativeExclusions, profile.captionSafe, profile.cropSafe].flatMap(m => m.provenance)].forEach(r => readBoundFile(r, root));
  if(evidence.medium==='video'&&!evidence.fps)throw new Error('Video presentation evidence requires explicit frame rate');
  if(evidence.medium==='video'&&(!evidence.coverage.hookFrames.length||!evidence.coverage.payoffFrames.length))throw new Error('Video presentation needs hook and payoff checks');
  if(!evidence.coverage.disclosureFrames.length&&!evidence.coverage.noDisclosureReason)throw new Error('Required disclosures must be checked or absence explained');
  if(evidence.medium==='image'&&(evidence.durationFrames!==1||!evidence.samples.some(s=>s.kind==='critical')))throw new Error('Cover presentation must inspect its static critical content');
  if (evidence.samples.some(s => s.frame >= evidence.durationFrames)) throw new Error('Presentation sample outside timeline');
  for (const [kind, frames] of [['caption-midpoint', evidence.coverage.captionMidpoints], ['hook', evidence.coverage.hookFrames], ['payoff', evidence.coverage.payoffFrames], ['disclosure', evidence.coverage.disclosureFrames]] as const) {
    if (frames.some(frame => !evidence.samples.some(s => s.frame === frame && s.kind === kind))) throw new Error('Missing required presentation checkpoint');
  }
  const coveredFrames=new Set(evidence.samples.map(s=>s.frame));
  if (evidence.coverage.method === 'all-frame-bounds') for (let frame=0; frame<evidence.durationFrames; frame++) if (!coveredFrames.has(frame)) throw new Error('Claimed all-frame coverage is incomplete');
  const unknowns: string[] = [];
  if (profile.lifecycle !== 'current' || now > profile.reviewAfter) unknowns.push('Profile is superseded or due for renewed inspection');
  for (const [name,m] of Object.entries({composition:profile.compositionSafe,nativeUI:profile.nativeExclusions,captions:profile.captionSafe,crop:profile.cropSafe})) if (m.state !== 'measured') unknowns.push(`${name}: ${m.state}`);
  if (evidence.coverage.method === 'sampled-bounds') unknowns.push('Unsampled timeline motion not proven');
  if (['passed','failed'].includes(evidence.device.state) && (evidence.device.context!=='mobile-app'||!evidence.device.reviewer||!evidence.device.device || !evidence.device.testedAt || !evidence.device.evidence.length)) throw new Error('Device pass requires actual device, time and evidence');
  if (evidence.device.state === 'not-tested') unknowns.push('No exact-media real-device evidence');
  const collisions: string[] = [];
  for (const s of evidence.samples) {
    for (const [name,m] of [['composition',profile.compositionSafe],['crop',profile.cropSafe],...(s.kind === 'caption-midpoint' ? [['caption',profile.captionSafe] as const] : [])] as const) if (m.regions && !m.regions.some(r => contains(r,s.bounds))) collisions.push(`${name} collision at frame ${s.frame}`);
    if (profile.nativeExclusions.regions?.some(r => overlap(r,s.bounds))) collisions.push(`native UI collision at frame ${s.frame}`);
    if (s.bounds.x+s.bounds.width > profile.canvas.width || s.bounds.y+s.bounds.height > profile.canvas.height) collisions.push(`canvas collision at frame ${s.frame}`);
  }
  if (evidence.device.state === 'failed') collisions.push('Real-device presentation failed');
  return {evidence, profile, collisions, unknowns, disposition: collisions.length ? 'derivative-required' as const : unknowns.length ? 'owner-risk-review' as const : 'presentation-checked' as const};
};
