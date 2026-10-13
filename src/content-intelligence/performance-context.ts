import {z} from 'zod';
import {readBoundRecord, readBoundFile, recordReferenceSchema, text, type RecordReference} from '../workflow/evidence';
import {buildAnalyticsIntake} from '../operations/analytics-intake';

const contextSchema = z.object({
  recordKind: z.literal('performance-review-context'),
  manifest: recordReferenceSchema, parsed: recordReferenceSchema, priorBenchmarkReview: recordReferenceSchema,
  lessons: z.array(z.object({
    id: text, evidenceLevel: z.enum(['verified-source-observation', 'multiple-production-observations', 'plausible-unconfirmed', 'creative-experiment']),
    status: z.enum(['supported-observation', 'hypothesis']), strength: z.literal('weak'), maturity: z.literal('unknown'),
    observation: text, evidence: z.array(recordReferenceSchema).min(1), applicability: text,
    limitations: z.array(text).min(1), nonGeneralizations: z.array(text).min(1),
    causalityEstablished: z.literal(false), styleCopyAuthorized: z.literal(false),
  }).strict()).min(1),
  workflowUse: text, ownerReview: z.literal('pending'),
}).strict();

/** Session context, not a LearningSignal or an owner-approved discovery decision.
 * Export provenance is useful even when strict snapshot capture/publication fields are absent. */
export const readPerformanceReviewContext = (ref: RecordReference, root = process.cwd()) => {
  const context = contextSchema.parse(readBoundRecord(ref, root));
  const intake = buildAnalyticsIntake(readBoundRecord(context.manifest, root), root);
  if (JSON.stringify(readBoundRecord(context.parsed, root)) !== JSON.stringify(intake)) throw new Error('Parsed analytics drift from original sources');
  readBoundFile(context.priorBenchmarkReview, root);
  context.lessons.forEach(lesson => lesson.evidence.forEach(evidence => readBoundFile(evidence, root)));
  return {...context, intakeSummary: {
    sourceCount: intake.sources.length, sourceRecordCount: intake.records.length,
    postRecordCount: intake.records.filter(r => r.kind === 'post').length,
    calculations: intake.calculations.filter(c => !c.id.endsWith('duration-ratio')),
    warnings: intake.warnings,
  }};
};
