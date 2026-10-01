import {z} from 'zod';
import {digestSchema} from '../artifacts/schema';
import {presentationSurfaceSchema} from './presentation';
import {presentationDecisionReferenceSchema} from './owner-presentation';
export const ownerReportedPresentationSchema=z.object({
 id:z.string().startsWith('presentation-owner-report.'),platformVariantId:z.string(),
 masterArtifactId:z.string(),surface:presentationSurfaceSchema,context:z.literal('mobile-app'),
 state:z.literal('OWNER_REPORTED_PASSED'),mediaSha256:digestSchema,coverSha256:digestSchema.nullable(),
 reviewer:z.literal('Ahmet Nishefci'),decision:presentationDecisionReferenceSchema,
 evidenceBasis:z.literal('explicit-owner-statement'),decisionEnteredAt:z.iso.datetime(),
 testedAt:z.null(),device:z.null(),os:z.null(),appVersion:z.null(),screenshots:z.array(z.string()).max(0),
 notes:z.string().min(1),
}).strict();
