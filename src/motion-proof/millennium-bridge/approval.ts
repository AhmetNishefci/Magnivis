import {readFileSync} from 'node:fs';
import {z} from 'zod';
import {fileSha256} from '../../design-exploration/raster-source';
import {sha256Json} from '../../content-intelligence/run-schema';
export const bApprovalPath = 'design-reviews/decisions/millennium-bridge-exploration-b-approval-v1.json';
const hash = z.string().regex(/^[a-f0-9]{64}$/);
const schema = z.object({
  id: z.literal('owner-design-decision.millennium-bridge.exploration-b.approval.v1'), reviewer: z.literal('Ahmet Nishefci'), decision: z.literal('approve-art-direction-basis'), decisionEntryAt: z.iso.datetime(), reviewedCommit: z.literal('317ea9d1b89f0e6cf6fe2c482c53835516c8b191'),
  manifestPath: z.literal('design-reviews/millennium-bridge-exploration-b-v1/manifest.json'), manifestFileSha256: hash,
  frames: z.array(z.object({path:z.string(),sha256:hash}).strict()).length(5), contactSheet:z.object({path:z.literal('contact-sheet.png'),sha256:hash,width:z.literal(1080),height:z.literal(1460)}).strict(),
  observations:z.array(z.string()).length(5), scope:z.string().min(1),
  authority:z.object({visualArtDirectionBasis:z.literal(true),controlledOpeningMotionProof:z.literal(true),completeVideo:z.literal(false),lockedMaster:z.literal(false),finalCaptionPlan:z.literal(false),platformVariants:z.literal(false),metaReconstruction:z.literal(false),delivery:z.literal(false),upload:z.literal(false),publication:z.literal(false)}).strict(),
}).strict();
export const validateBApproval = (input: unknown = JSON.parse(readFileSync(bApprovalPath,'utf8'))) => {
  const decision = schema.parse(input);
  if (fileSha256(readFileSync(decision.manifestPath)) !== decision.manifestFileSha256) throw new Error('B approval manifest identity changed');
  const manifest = JSON.parse(readFileSync(decision.manifestPath,'utf8'));
  const dir = 'design-reviews/millennium-bridge-exploration-b-v1';
  const expected = manifest.frames.map((f:{png:{path:string;sha256:string}}) => ({path:`${dir}/${f.png.path}`,sha256:f.png.sha256}));
  if (sha256Json(expected) !== sha256Json(decision.frames) || sha256Json(decision.contactSheet) !== sha256Json(manifest.contactSheet)) throw new Error('B approval coverage changed');
  for (const f of [...decision.frames,{path:`${dir}/contact-sheet.png`,sha256:decision.contactSheet.sha256}]) if (fileSha256(readFileSync(f.path)) !== f.sha256) throw new Error('B approved image changed');
  return decision;
};
