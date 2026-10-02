import {z} from 'zod';
/** Internal factual/editorial readiness is distinct from any owner decision. */
export const internalEditorialAuthoritySchema=z.object({
  kind:z.literal('internal-evidence-review'),cycleId:z.string().regex(/^cycle\.[a-z0-9-]+$/),
  reviewSha256:z.string().regex(/^[a-f0-9]{64}$/),
  exceptionDecisions:z.array(z.string().regex(/^[a-f0-9]{64}$/)).optional(),
}).strict();
