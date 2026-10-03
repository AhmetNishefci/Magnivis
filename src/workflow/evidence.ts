import {readFileSync, realpathSync, statSync} from 'node:fs';
import {relative, resolve, isAbsolute, sep} from 'node:path';
import {z} from 'zod';
import {mediaHash} from '../artifacts/media';
import {sha256Json} from '../content-intelligence/run-schema';

export const digest = z.string().regex(/^[a-f0-9]{64}$/);
export const text = z.string().trim().min(1);
export const recordReferenceSchema = z.object({
  path: text.refine(p => !isAbsolute(p) && !p.includes('\\') && p.split('/').every(s => s && s !== '.' && s !== '..')),
  sha256: digest,
}).strict();
export type RecordReference = z.infer<typeof recordReferenceSchema>;
export const readBoundFile = (input: RecordReference, root = process.cwd()): Buffer => {
  const ref = recordReferenceSchema.parse(input);
  const path = realpathSync(resolve(root, ref.path));
  const rel = relative(realpathSync(root), path);
  if (isAbsolute(rel) || rel === '..' || rel.startsWith(`..${sep}`) || !statSync(path).isFile()) throw new Error('Evidence path escapes repository');
  if (mediaHash(path) !== ref.sha256) throw new Error('Evidence file digest mismatch');
  return readFileSync(path);
};
export const readBoundRecord = (input: RecordReference, root = process.cwd()): unknown => JSON.parse(readBoundFile(input,root).toString('utf8'));
export const ownerDecisionSchema = z.object({
  schemaVersion: z.literal(3), id: text.startsWith('owner-decision.'), revision: z.number().int().positive(),
  gate: z.enum(['premise-review', 'master-review', 'publication-review', 'exception']),
  cycleId: text, targetSha256: digest, decision: z.enum(['approve', 'revise', 'reject']),
  enteredAt: z.iso.datetime(), suppliedReviewTime: z.iso.datetime().nullable(),
  reviewer: text, evidenceBasis: z.literal('explicit-owner-message'), instruction: text,
  reason:text.optional(), nonGeneralizations:z.array(text).optional(),
  acceptedUnknowns: z.array(text), scope:recordReferenceSchema.optional(),
  validUntil:z.iso.datetime().optional(),lifecycle:z.enum(['active','superseded']).optional(),
}).strict();
export type OwnerDecision = z.infer<typeof ownerDecisionSchema>;
export const requireOwnerDecision = (ref: RecordReference, cycleId: string, gate: OwnerDecision['gate'], target: unknown, root = process.cwd()) => {
  const decision = ownerDecisionSchema.parse(readBoundRecord(ref, root));
  if (decision.cycleId !== cycleId || decision.gate !== gate || decision.targetSha256 !== sha256Json(target)) throw new Error('Owner decision is detached from the exact review target');
  if(gate==='exception'){const scope=(target as {target?:RecordReference}).target;if(!scope||!decision.scope||sha256Json(scope)!==sha256Json(decision.scope))throw new Error('Exceptional approval must identify its exact scoped artifact');}
  return decision;
};
