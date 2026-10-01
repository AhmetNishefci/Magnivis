import {readFile} from 'node:fs/promises';
import {z} from 'zod';
import {createTopicCandidateRegistry, topicCandidateRegistry} from '../src/content-intelligence/registry';
import {topicCandidateSchema, topicEvaluationDraftSchema} from '../src/content-intelligence/schema';

const bundleSchema = z.object({
  id: z.string().min(1),
  recordedAt: z.iso.date(),
  baseCommit: z.string().regex(/^[a-f0-9]{40}$/),
  provenance: z.object({
    method: z.literal('manual-ai-assisted-discovery'),
    operator: z.string().min(1),
    model: z.string().min(1),
    modelIdentityBasis: z.string().min(1),
    paidApiUsed: z.literal(false),
    workflowEnvelope: z.literal(false),
    classificationTiming: z.literal('after-idea-discovery'),
  }).strict(),
  ownerReview: z.literal('pending-selection'),
  selectedTopicId: z.null(),
  candidates: z.array(topicCandidateSchema).min(1),
  triage: z.array(z.object({
    topicCandidateId: z.string(),
    disposition: z.enum(['shortlist', 'reserve', 'exclude-this-cycle']),
    rationale: z.string().min(1),
    duplicateCheck: z.string().min(1),
  }).strict()),
  evaluations: z.array(topicEvaluationDraftSchema),
  sourceReconnaissance: z.array(z.object({
    topicCandidateId: z.string(),
    url: z.url(),
    title: z.string().min(1),
    organization: z.string().min(1),
    checkedAt: z.iso.date(),
    access: z.enum(['page-excerpt', 'abstract-only', 'search-excerpt', 'search-excerpt-open-failed']),
    reviewStatus: z.literal('unreviewed'),
    notes: z.string().min(1),
  }).strict()),
}).strict();

const path = process.argv[2];
if (!path) throw new Error('Usage: pnpm exec tsx scripts/validate-discovery.ts <discovery.json>');
const bundle = bundleSchema.parse(JSON.parse(await readFile(path, 'utf8')));
const registry = createTopicCandidateRegistry([
  ...topicCandidateRegistry.list(), ...bundle.candidates,
]);
const ids = new Set(bundle.candidates.map(({id}) => id));
const triageIds = new Set(bundle.triage.map(({topicCandidateId}) => topicCandidateId));
if (triageIds.size !== bundle.triage.length || triageIds.size !== ids.size) {
  throw new Error('Every candidate needs exactly one triage record');
}
for (const record of bundle.triage) {
  if (!ids.has(record.topicCandidateId)) throw new Error('Triage references a candidate outside this cycle');
}
for (const candidate of bundle.candidates) {
  if (candidate.discovery.recordedAt !== bundle.recordedAt || candidate.status !== 'evaluating' || candidate.review) {
    throw new Error('Discovery candidates must be dated, evaluating and without approval metadata');
  }
}
const shortlistIds = new Set(bundle.triage.filter(({disposition}) => disposition === 'shortlist')
  .map(({topicCandidateId}) => topicCandidateId));
const evaluationIds = new Set(bundle.evaluations.map(({topicCandidateId}) => topicCandidateId));
if (evaluationIds.size !== bundle.evaluations.length || evaluationIds.size !== shortlistIds.size) {
  throw new Error('Every shortlisted candidate needs exactly one evaluation');
}
for (const evaluation of bundle.evaluations) {
  if (!shortlistIds.has(evaluation.topicCandidateId)
    || registry.get(evaluation.topicCandidateId).revision !== evaluation.candidateRevision) {
    throw new Error('Evaluation references an unknown shortlisted candidate or stale revision');
  }
}
for (const source of bundle.sourceReconnaissance) {
  if (!shortlistIds.has(source.topicCandidateId) || source.checkedAt !== bundle.recordedAt) {
    throw new Error('Reconnaissance must reference a dated shortlisted candidate');
  }
}
for (const id of shortlistIds) {
  if (!bundle.sourceReconnaissance.some(({topicCandidateId}) => topicCandidateId === id)) {
    throw new Error(`Missing feasibility source lead: ${id}`);
  }
}
console.log(JSON.stringify({
  id: bundle.id, candidates: ids.size, shortlist: shortlistIds.size,
  sourceLeads: bundle.sourceReconnaissance.length, ownerReview: bundle.ownerReview,
  selectedTopicId: bundle.selectedTopicId,
}, null, 2));
