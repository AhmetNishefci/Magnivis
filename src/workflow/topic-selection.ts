import {z} from 'zod';
import {sha256Json} from '../content-intelligence/run-schema';
import historicalSelections from '../../system-audits/topic-curiosity-v3/historical-selections.json';
import {text, recordReferenceSchema, readBoundRecord, readBoundFile} from './evidence';

export const curiosityReviewSchema = z.object({
  honestPremise: text,
  coldAudienceReason: text,
  interestOrigin: z.enum(['premise-led', 'context-led', 'uncertain']),
  storyRoute: text,
  truthBoundary: z.object({state: z.enum(['credible-lead', 'reframed', 'unsupported']), rationale: text}).strict(),
  opportunityJudgment: z.object({sufficient: z.boolean(), rationale: text}).strict(),
  shareability: text.nullable().optional(),
}).strict();
const candidate = z.object({
  id: text, subject: text, domains: z.array(text).min(1),
  novelty: text, evidenceFeasibility: text, explanatoryPayoff: text,
  visualPotential: text, audienceCuriosity: text, productionFeasibility: text,
  portfolioDiversity: text, comparison: text,
  evidence: z.array(recordReferenceSchema).min(1),
  disposition: z.enum(['eligible', 'inadequate-evidence', 'repeat', 'hold']),
  limitations: z.array(text), curiosityReview: curiosityReviewSchema.optional(),
}).strict();
export const topicSelectionSchema = z.object({
  schemaVersion: z.literal(3), method: z.literal('qualitative-open-world-comparison'),
  cycleId:text.regex(/^cycle\.[a-z0-9-]+$/),
  searchRecord: recordReferenceSchema,
  searchBreadth: text, classificationAfterDiscovery: z.literal(true),
  historyReviewed: z.array(recordReferenceSchema), noHistoryReason: text.optional(),
  analyticsInfluence: z.literal('provenance-bearing-signals-not-category-rules'),
  convenienceAdvantageRejected: z.literal(true),
  selectionStandard: z.literal('cold-audience-curiosity.v1').optional(),
  poolReview: z.object({adequateOpportunityFound: z.boolean(), rationale: text, nextSearchChange: text.nullable()}).strict().optional(),
  candidates: z.array(candidate).min(2), selectedId: text.nullable(),
  outcome: z.enum(['selected', 'continue-discovery', 'escalate']), rationale: text,
}).strict();
export const validateTopicSelection = (input: unknown, root = process.cwd()) => {
  const selection = topicSelectionSchema.parse(input);
  readBoundRecord(selection.searchRecord, root);
  if (!selection.historyReviewed.length && !selection.noHistoryReason) throw new Error('Discovery must inspect history or explain its absence');
  selection.historyReviewed.forEach(r => readBoundFile(r, root));
  const ids = new Set(selection.candidates.map(c => c.id));
  if (ids.size !== selection.candidates.length) throw new Error('Duplicate discovery candidate');
  selection.candidates.forEach(c => c.evidence.forEach(r => readBoundFile(r, root)));
  // Exact pre-change identities retain their historical semantics, not a cycle-number exemption.
  const historical = historicalSelections.some(r => r.sha256 === sha256Json(selection));
  if (!historical) {
    if (!selection.selectionStandard || !selection.poolReview || selection.candidates.some(c => !c.curiosityReview)) {
      throw new Error('Prospective selection requires qualitative cold-audience and pool reviews');
    }
    if (selection.outcome === 'continue-discovery' && !selection.poolReview.nextSearchChange) {
      throw new Error('Continued discovery must explain how the search will broaden or deepen');
    }
    if (selection.outcome === 'selected') {
      const review = selection.candidates.find(c => c.id === selection.selectedId)?.curiosityReview;
      if (!selection.poolReview.adequateOpportunityFound || !review?.opportunityJudgment.sufficient || review.truthBoundary.state === 'unsupported') {
        throw new Error('Selection requires a sufficiently compelling legitimate opportunity, not the best weak candidate');
      }
    }
  }
  if (selection.outcome === 'selected') {
    if (!selection.candidates.some(c => c.id === selection.selectedId && c.disposition === 'eligible')) throw new Error('Only an evidence-feasible eligible candidate can be selected');
  } else if (selection.selectedId !== null) throw new Error('Unsuccessful discovery cannot force a topic');
  return selection;
};

/** Autonomous session/provider interface. Preserved rounds consume one recoverable total budget. */
export const chooseTopicAutonomously = async ({discoverAndCompare, preserve, maximumRounds, priorRecords = [], root = process.cwd()}: {
  discoverAndCompare: (round: number, priorPools: readonly z.infer<typeof topicSelectionSchema>[]) => Promise<unknown>;
  preserve: (selection: z.infer<typeof topicSelectionSchema>) => Promise<z.infer<typeof recordReferenceSchema>>;
  maximumRounds: number;
  priorRecords?: readonly z.infer<typeof recordReferenceSchema>[];
  root?: string;
}) => {
  if (!Number.isInteger(maximumRounds) || maximumRounds < 1 || priorRecords.length > maximumRounds) throw new Error('Discovery authority needs a positive bounded total effort');
  const records = [...priorRecords];
  const pools = records.map(r => validateTopicSelection(readBoundRecord(r, root), root));
  if (new Set(records.map(r => r.sha256)).size !== records.length) throw new Error('Duplicate preserved discovery round');
  if (pools.some(p => p.outcome !== 'continue-discovery') || new Set(pools.map(p => p.cycleId)).size > 1) throw new Error('Only unfinished same-cycle discovery can resume');
  for (let round = pools.length + 1; round <= maximumRounds; round++) {
    const selection = validateTopicSelection(await discoverAndCompare(round, structuredClone(pools)), root);
    if (pools.length && pools[0]!.cycleId !== selection.cycleId) throw new Error('Discovery cannot switch cycles');
    const record = await preserve(selection);
    const stored = validateTopicSelection(readBoundRecord(record, root), root);
    if (JSON.stringify(stored) !== JSON.stringify(selection)) throw new Error('Discovery rationale was not preserved exactly');
    if (records.some(r => r.sha256 === record.sha256)) throw new Error('Continued discovery must preserve a distinct round');
    pools.push(selection); records.push(record);
    if (selection.outcome === 'selected' || selection.outcome === 'escalate') return {outcome: selection.outcome, selection, record, pools, records};
  }
  return {outcome: 'continue-discovery' as const, selection: null, record: null, pools, records,
    reason: 'No adequate candidate within bounded discovery effort; preserve unfinished work. Budget exhaustion alone is not an owner exception.'};
};
