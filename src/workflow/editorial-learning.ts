import {existsSync,readdirSync,readFileSync} from 'node:fs';
import {join} from 'node:path';
import {z} from 'zod';
import {sha256Json} from '../content-intelligence/run-schema';
import {ownerDecisionSchema,recordReferenceSchema,readBoundRecord,text,type RecordReference} from './evidence';
import type {TopicSelection} from './topic-selection';
const legacySchema=z.object({decision:recordReferenceSchema,target:recordReferenceSchema,selection:recordReferenceSchema,judgment:z.enum(['approve-premise','reject-premise']),context:text,statedReason:text.nullable(),interpretation:text,nonGeneralizations:z.array(text).min(1)}).strict();
/** Read-only contextual evidence. No scores, exclusions, embeddings or topic preferences. */
export const editorialDecisionContext=(root=process.cwd())=>{
 const result:{decision:RecordReference;selection:RecordReference;judgment:string;premise:string;selectionRationale:string;ownerInstruction:string;statedReason:string|null;interpretation:string|null;context:string;nonGeneralizations:string[]}[]=[];
 const add=(decisionRef:RecordReference,selectionRef:RecordReference,context:string,judgment?:string,statedReason?:string|null,interpretation?:string,nonGeneralizations?:string[])=>{
  const d=ownerDecisionSchema.parse(readBoundRecord(decisionRef,root));
  const s=readBoundRecord(selectionRef,root) as TopicSelection;
  const candidate=s.candidates.find(c=>c.id===s.selectedId);
  if(d.cycleId!==s.cycleId||!candidate||s.outcome!=='selected')throw new Error('Editorial learning requires original autonomous selection');
  result.push({decision:decisionRef,selection:selectionRef,judgment:judgment??d.decision,premise:candidate.curiosityReview?.honestPremise??candidate.subject,selectionRationale:s.rationale,ownerInstruction:d.instruction,statedReason:statedReason??d.reason??null,interpretation:interpretation??null,context,nonGeneralizations:nonGeneralizations??d.nonGeneralizations??['Ordinary editorial judgment is not a domain/topic exclusion, audience metric or permission to clone a subject.']});
 };
 const legacyPath=join(root,'system-audits/pre-production-premise-review/historical-editorial-decisions.json');
 if(existsSync(legacyPath))for(const value of JSON.parse(readFileSync(legacyPath,'utf8'))){
  const entry=legacySchema.parse(value),d=ownerDecisionSchema.parse(readBoundRecord(entry.decision,root));
  if(d.gate!=='master-review'||d.targetSha256!==sha256Json(readBoundRecord(entry.target,root)))throw new Error('Historical learning adapter detached from actual master decision');
  add(entry.decision,entry.selection,entry.context,entry.judgment,entry.statedReason,entry.interpretation,entry.nonGeneralizations);
 }
 const directory=join(root,'workflow/cycles');
 if(existsSync(directory))for(const dir of readdirSync(directory,{withFileTypes:true}).filter(d=>d.isDirectory()).sort((a,b)=>a.name.localeCompare(b.name))){
  const state=JSON.parse(readFileSync(join(directory,dir.name,'state.json'),'utf8')) as {id:string;revision:number;history:{event:string;evidence:RecordReference}[]};
  if(state.id!==dir.name)throw new Error('Editorial learning cycle directory identity mismatch');
 const selections=state.history.filter(h=>h.event==='discovery').map(h=>h.evidence);
  for(const h of state.history.filter(h=>h.event==='owner-decision')){
   const d=ownerDecisionSchema.parse(readBoundRecord(h.evidence,root));if(d.gate!=='premise-review')continue;
   const journalEvents=Array.from({length:state.revision},(_,i)=>JSON.parse(readFileSync(join(directory,dir.name,`event-${i+1}.json`),'utf8')));
   if(journalEvents.at(-1)?.nextSha256!==sha256Json(state)||!journalEvents.some(e=>e.event.type==='owner-decision'&&sha256Json(e.event.record)===sha256Json(h.evidence)))throw new Error('Editorial context must be backed by committed journal events');
   const selection=selections.find(r=>sha256Json(readBoundRecord(r,root))===d.targetSha256);
   if(d.cycleId!==state.id||!selection||!journalEvents.some(e=>e.event.type==='complete-internal'&&e.event.stage==='discovery'&&sha256Json(e.event.record)===sha256Json(selection)))throw new Error('Premise decision learning detached from original cycle/selection');
   add(h.evidence,selection,'Prospective premise judgment; approval does not verify claims or approve script/media/publication.');
  }
 }
 return result;
};
export const validateEditorialLearningReview=(selection:TopicSelection,root=process.cwd())=>{
 const context=editorialDecisionContext(root),review=selection.editorialLearningReview??[];
 // Validate the recorded as-of snapshot, not future decisions: replay must not gain hindsight.
 if(!selection.editorialLearningReview)throw new Error('Discovery requires its as-of editorial learning review (empty when no judgments existed)');
 for(const r of review)if(!context.some(c=>c.decision.path===r.decision.path&&c.decision.sha256===r.decision.sha256))throw new Error('Editorial learning references an unrecorded premise judgment');
 return context;
};
