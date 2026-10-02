import {z} from 'zod';
import {text, recordReferenceSchema, readBoundRecord, readBoundFile} from './evidence';

const candidate = z.object({
  id: text, subject: text, domains: z.array(text).min(1),
  novelty: text, evidenceFeasibility: text, explanatoryPayoff: text,
  visualPotential: text, audienceCuriosity: text, productionFeasibility: text,
  portfolioDiversity: text, comparison: text,
  evidence: z.array(recordReferenceSchema).min(1),
  disposition: z.enum(['eligible', 'inadequate-evidence', 'repeat', 'hold']),
  limitations: z.array(text),
}).strict();
export const topicSelectionSchema = z.object({
  schemaVersion: z.literal(3), method: z.literal('qualitative-open-world-comparison'),
  cycleId:text.regex(/^cycle\.[a-z0-9-]+$/),
  searchRecord: recordReferenceSchema,
  searchBreadth: text, classificationAfterDiscovery: z.literal(true),
  historyReviewed: z.array(recordReferenceSchema), noHistoryReason: text.optional(),
  analyticsInfluence: z.literal('provenance-bearing-signals-not-category-rules'),
  convenienceAdvantageRejected: z.literal(true),
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
  if (selection.outcome === 'selected') {
    if (!selection.candidates.some(c => c.id === selection.selectedId && c.disposition === 'eligible')) throw new Error('Only an evidence-feasible eligible candidate can be selected');
  } else if (selection.selectedId !== null) throw new Error('Unsuccessful discovery cannot force a topic');
  return selection;
};

/** Autonomous session/provider selection interface: no owner shortlist decision and no numeric rank. */
export const chooseTopicAutonomously=async({discoverAndCompare,preserve,maximumRounds,root=process.cwd()}:{discoverAndCompare:(round:number,priorPools:readonly z.infer<typeof topicSelectionSchema>[])=>Promise<unknown>;preserve:(selection:z.infer<typeof topicSelectionSchema>)=>Promise<z.infer<typeof recordReferenceSchema>>;maximumRounds:number;root?:string})=>{
  if(!Number.isInteger(maximumRounds)||maximumRounds<1)throw new Error('Discovery authority needs a positive bounded effort');
  const pools:z.infer<typeof topicSelectionSchema>[]=[];
  for(let round=1;round<=maximumRounds;round++){
    const selection=validateTopicSelection(await discoverAndCompare(round,structuredClone(pools)),root);
    const record=await preserve(selection);const stored=validateTopicSelection(readBoundRecord(record,root),root);
    if(JSON.stringify(stored)!==JSON.stringify(selection))throw new Error('Discovery rationale was not preserved exactly');
    pools.push(selection);
    if(selection.outcome==='selected'||selection.outcome==='escalate')return {outcome:selection.outcome,selection,record,pools};
  }
  return {outcome:'escalate' as const,selection:null,record:null,pools,reason:'No adequate candidate selected within authorized discovery effort; no weak topic forced.'};
};
