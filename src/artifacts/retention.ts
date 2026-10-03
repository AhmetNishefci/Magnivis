import {createHash} from 'node:crypto';
import {existsSync,readFileSync,readdirSync,realpathSync,statSync,mkdirSync,writeFileSync,linkSync,rmSync} from 'node:fs';
import {dirname,isAbsolute,relative,resolve,sep} from 'node:path';
import {z} from 'zod';
import {ownerDecisionSchema} from '../workflow/evidence-schema';
import {sha256Json} from './json-identity';
import {gitMediaByteLimit} from './durability';
import type {MediaArtifact,MediaReference} from './media';
const digest=z.string().regex(/^[a-f0-9]{64}$/);
const pathSchema=z.string().min(1).refine(p=>!isAbsolute(p)&&!p.includes('\\')&&p.split('/').every(s=>s&&s!=='.'&&s!=='..'));
const record=z.object({path:pathSchema,sha256:digest}).strict();
const media=z.object({id:z.string(),sha256:digest}).strict();
export const historicalMediaRetentionSchema=z.object({
 schemaVersion:z.literal(1),disposition:z.enum(['failed','rejected','superseded']),media,
 cycleId:z.string().regex(/^cycle\.[a-z0-9-]+$/),candidate:record,registrationEvent:record,
 revisionEvent:record,ownerDecision:record,authority:record,failureEvidence:z.array(record).min(1),
 replacementCandidate:record.nullable(),replacementEvent:record.nullable(),
 storage:z.object({kind:z.literal('exact-byte-parts'),parts:z.array(z.object({path:pathSchema,sha256:digest,bytes:z.number().int().positive().max(gitMediaByteLimit-1),offset:z.number().int().nonnegative()}).strict()).min(1)}).strict(),
}).strict();
export type HistoricalMediaRetention=z.infer<typeof historicalMediaRetentionSchema>;
const hash=(bytes:Buffer)=>createHash('sha256').update(bytes).digest('hex');
const safeFile=(root:string,path:string)=>{
 const file=realpathSync(resolve(root,path)),rel=relative(realpathSync(root),file);
 if(isAbsolute(rel)||rel==='..'||rel.startsWith(`..${sep}`)||!statSync(file).isFile())throw new Error('Retention path escapes repository');return file;
};
const bound=(ref:z.infer<typeof record>,root:string)=>{const bytes=readFileSync(safeFile(root,ref.path));if(hash(bytes)!==ref.sha256)throw new Error('Retention evidence digest mismatch');return JSON.parse(bytes.toString('utf8'));};
export const loadHistoricalMediaRetentions=(root=process.cwd())=>{
 const path=resolve(root,'artifacts/media-retentions.json');if(!existsSync(path))return [];
 const ledger=z.object({schemaVersion:z.literal(1),records:z.array(record)}).strict().parse(JSON.parse(readFileSync(path,'utf8')));
 const rows=ledger.records.map(ref=>({ref,retention:historicalMediaRetentionSchema.parse(bound(ref,root))}));
 if(new Set(rows.map(r=>r.retention.media.id)).size!==rows.length)throw new Error('Duplicate historical retention identity');return rows;
};
/** Retention never makes media eligible for a new candidate, variant or upload. */
export const assertMediaProductionEligible=(ref:MediaReference,root=process.cwd())=>{
 if(loadHistoricalMediaRetentions(root).some(r=>r.retention.media.id===ref.id))throw new Error('Historical retained media is ineligible for production or delivery');
};
export const validateHistoricalMediaRetention=(r:HistoricalMediaRetention,artifact:MediaArtifact,root=process.cwd())=>{
 if(r.media.id!==artifact.id||r.media.sha256!==artifact.sha256||artifact.exception)throw new Error('Retention detached from original identity');
 const candidate=bound(r.candidate,root);if(candidate.cycleId!==r.cycleId||sha256Json(candidate.media)!==sha256Json(r.media))throw new Error('Retention candidate mismatch');
 const event=(ref:z.infer<typeof record>)=>{
  const expected=`workflow/cycles/${r.cycleId}/event-`,revision=Number(ref.path.slice(expected.length,-5));
  if(!ref.path.startsWith(expected)||!Number.isInteger(revision)||revision<1||ref.path!==`${expected}${revision}.json`)throw new Error('Retention event is not journal evidence');
  const head=JSON.parse(readFileSync(resolve(root,`workflow/cycles/${r.cycleId}/state.json`),'utf8'));
  if(head.revision<revision)throw new Error('Retention event is not committed');return {revision,stored:bound(ref,root)};
 };
 const registration=event(r.registrationEvent),revision=event(r.revisionEvent);
 if(registration.stored.event.type!=='complete-internal'||registration.stored.event.stage!=='production'||sha256Json(registration.stored.event.record)!==sha256Json(r.candidate))throw new Error('Retention lacks original registration event');
 const decision=ownerDecisionSchema.parse(bound(r.ownerDecision,root));
 if(revision.revision<=registration.revision||revision.stored.event.type!=='owner-decision'||sha256Json(revision.stored.event.record)!==sha256Json(r.ownerDecision)||decision.schemaVersion!==3||decision.cycleId!==r.cycleId||decision.gate!=='master-review'||!['revise','reject'].includes(decision.decision)||decision.evidenceBasis!=='explicit-owner-message'||decision.targetSha256!==sha256Json(candidate))throw new Error('Retention lacks exact owner revision/rejection');
 if(r.disposition==='rejected'&&decision.decision!=='reject')throw new Error('Rejected retention needs rejection');
 const authority=bound(r.authority,root);
 if(authority.kind!=='explicit-owner-retention-contract-repair'||authority.evidenceBasis!=='explicit-owner-message'||!authority.instruction||!authority.media?.some((m:MediaReference)=>sha256Json(m)===sha256Json(r.media)))throw new Error('Retention lacks scoped owner authority');
 r.failureEvidence.forEach(f=>bound(f,root));
 if(r.disposition==='failed'&&!r.failureEvidence.some(f=>{const failure=bound(f,root);return failure.exactMasterSha256===artifact.sha256&&failure.fileBytes===artifact.bytes&&failure.durabilityCheck==='failed';}))throw new Error('Failed retention lacks exact recorded durability failure');
 if(!!r.replacementCandidate!==!!r.replacementEvent||(r.disposition==='superseded'&&!r.replacementCandidate))throw new Error('Incomplete replacement evidence');
 if(r.replacementCandidate&&r.replacementEvent){
  const replacement=bound(r.replacementCandidate,root),replacementEvent=event(r.replacementEvent);
  if(replacement.cycleId!==r.cycleId||replacement.media.id===r.media.id||replacementEvent.revision<=revision.revision||replacementEvent.stored.event.type!=='complete-internal'||replacementEvent.stored.event.stage!=='production'||sha256Json(replacementEvent.stored.event.record)!==sha256Json(r.replacementCandidate))throw new Error('Retention replacement is not journal-authorized');
 }
 const cycleRoot=resolve(root,'workflow/cycles');
 if(existsSync(cycleRoot))for(const dir of readdirSync(cycleRoot,{withFileTypes:true}).filter(d=>d.isDirectory())){
  const head=JSON.parse(readFileSync(resolve(cycleRoot,dir.name,'state.json'),'utf8'));
  if(head.candidate&&bound(head.candidate,root).media.id===r.media.id)throw new Error('Historical retention cannot exempt an active candidate');
 }
 let offset=0;const identity=createHash('sha256'),paths=new Set<string>();
 for(const part of r.storage.parts){
  if(part.offset!==offset||paths.has(part.path)||!part.path.startsWith('artifacts/historical-media/')||part.path===artifact.canonicalPath)throw new Error('Invalid archival part layout');paths.add(part.path);
  const bytes=readFileSync(safeFile(root,part.path));if(bytes.length!==part.bytes||bytes.length>=gitMediaByteLimit||hash(bytes)!==part.sha256)throw new Error('Historical archival part integrity failed');identity.update(bytes);offset+=bytes.length;
 }
 if(offset!==artifact.bytes||identity.digest('hex')!==artifact.sha256)throw new Error('Historical archive does not reproduce original bytes');
 return r;
};
/** Reconstitutes exact historical bytes only when absent; corrupt originals are never overwritten. */
export const restoreHistoricalMedia=(artifact:MediaArtifact,root=process.cwd())=>{
 const row=loadHistoricalMediaRetentions(root).find(r=>r.retention.media.id===artifact.id);if(!row)return false;
 const r=validateHistoricalMediaRetention(row.retention,artifact,root),destination=resolve(root,artifact.canonicalPath);
 if(existsSync(destination))return false;
 mkdirSync(dirname(destination),{recursive:true});
 const parent=realpathSync(dirname(destination)),rel=relative(realpathSync(root),parent);if(isAbsolute(rel)||rel==='..'||rel.startsWith(`..${sep}`))throw new Error('Historical restore escapes repository');
 const temporary=`${destination}.retention-pending`;
 try{writeFileSync(temporary,Buffer.concat(r.storage.parts.map(p=>readFileSync(safeFile(root,p.path)))),{flag:'wx'});linkSync(temporary,destination);}finally{if(existsSync(temporary))rmSync(temporary);}
 return true;
};
