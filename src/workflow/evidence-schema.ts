import {isAbsolute} from 'node:path';
import {z} from 'zod';
export const digest = z.string().regex(/^[a-f0-9]{64}$/);
export const text = z.string().trim().min(1);
export const recordReferenceSchema = z.object({
  path: text.refine(p => !isAbsolute(p) && !p.includes('\\') && p.split('/').every(s => s && s !== '.' && s !== '..')),
  sha256: digest,
}).strict();
export type RecordReference = z.infer<typeof recordReferenceSchema>;
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
