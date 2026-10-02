import {mkdirSync, readFileSync, writeFileSync, renameSync, rmSync, existsSync, readdirSync} from 'node:fs';
import {resolve, relative, isAbsolute, sep} from 'node:path';
import {sha256Json} from '../content-intelligence/run-schema';
import type {MediaRegistry} from '../artifacts/media';
import {startCycle, transitionCycle, nextAction, cycleSchema, type Cycle, type CycleEvent} from './cycle';
import {recordReferenceSchema,readBoundRecord, type RecordReference} from './evidence';
import {cycleReleaseSchema} from './release';
import {publicationRecordSchema} from '../operations/schema';

const directory = (root: string, id: string) => {
  if(!/^cycle\.[a-z0-9-]+$/.test(id)) throw new Error('Unsafe cycle ID');
  return resolve(root,'workflow/cycles',id);
};
const json=(path:string)=>JSON.parse(readFileSync(path,'utf8'));
const writeExclusive=(path:string,value:unknown)=>writeFileSync(path,JSON.stringify(value,null,2)+'\n',{flag:'wx'});
/** Replay committed events, rather than trusting a writable stage flag or branch name. */
export const loadCycle = (root: string, id: string, registry: MediaRegistry, allowPending = false): Cycle => {
  const dir=directory(root,id);const head=cycleSchema.parse(json(resolve(dir,'state.json')));
  let current=startCycle(recordReferenceSchema.parse(json(resolve(dir,'authority.json'))),root);
  for(let n=1;n<=head.revision;n++) {
    const stored=json(resolve(dir,`event-${n}.json`)) as {previousSha256:string;event:CycleEvent;nextSha256:string};
    if(stored.previousSha256!==sha256Json(current)) throw new Error('Cycle event chain drift');
    const next=transitionCycle(current,stored.event,registry,root);
    if(stored.nextSha256!==sha256Json(next)) throw new Error('Cycle event result drift');
    current=next;
  }
  if(sha256Json(current)!==sha256Json(head)) throw new Error('Current cycle state differs from replayed evidence');
  if(!allowPending && existsSync(resolve(dir,`event-${head.revision+1}.json`)))throw new Error('Incomplete prior transaction; recover the proven pending event before continuing');
  return current;
};
/** Project overview is derived from independent replayed journals, never a shared
 * writable active-cycle flag. Old observations cannot overwrite another cycle. */
export const loadProjectCycles=(root:string,registry:MediaRegistry)=>{
  const path=resolve(root,'workflow/cycles');
  return existsSync(path)?readdirSync(path,{withFileTypes:true}).filter(d=>d.isDirectory()).sort((a,b)=>a.name.localeCompare(b.name)).map(d=>loadCycle(root,d.name,registry)):[];
};
export const projectCycleOverview=(cycles:readonly Cycle[],root=process.cwd())=>({
  productionActive:cycles.filter(c=>['discovery','editorial','creative','production','presentation'].includes(c.stage)).map(c=>c.id),
  ownerActions:cycles.filter(c=>nextAction(c).kind==='owner').map(c=>({cycleId:c.id,...nextAction(c)})),
  publicationAuthorized:cycles.filter(c=>c.stage==='authorized').map(c=>c.id),
  scheduledOwnerReported:cycles.filter(c=>c.observations.some(o=>o.kind==='scheduled-owner-reported')).map(c=>c.id),
  publicationEvidencePending:cycles.filter(c=>c.stage==='authorized').map(c=>{
    const release=cycleReleaseSchema.parse(readBoundRecord(c.release!,root));
    const published=c.observations.filter(o=>o.kind==='published').map(o=>publicationRecordSchema.parse(readBoundRecord(o.record,root)).source.platformVariant.id);
    return {cycleId:c.id,pendingVariants:release.deliveries.filter(d=>!published.includes(d.variant.id)).map(d=>({variantId:d.variant.id,platform:d.variant.platform,surface:d.variant.surface,media:d.variant.media}))};
  }).filter(c=>c.pendingVariants.length),
  closed:cycles.filter(c=>c.stage==='closed').map(c=>c.id),
});
/** Compatibility convenience only; ambiguous production never silently selects. */
export const loadCurrentCycle=(root:string,registry:MediaRegistry)=>{
  const current=loadProjectCycles(root,registry).filter(c=>!['authorized','closed'].includes(c.stage));
  if(current.length>1)throw new Error('Multiple production/review cycles; specify cycle ID');
  return current[0]??null;
};
export const initializeCycle = (root: string, authority: RecordReference) => {
  const cycle=startCycle(authority,root);const dir=directory(root,cycle.id);
  mkdirSync(resolve(root,'workflow/cycles'),{recursive:true});
  // Exclusive per-ID creation; different cycles never contend on project state.
  mkdirSync(dir);writeExclusive(resolve(dir,'authority.json'),authority);writeExclusive(resolve(dir,'state.json'),cycle);
  return cycle;
};
/** Lock + optimistic revision + immutable event. Interrupted writes fail honestly; no silent replay guessing. */
export const persistCycleEvent = (root: string, previous: Cycle, event: CycleEvent, registry: MediaRegistry) => {
  const dir=directory(root,previous.id);const lock=resolve(dir,'.write-lock');mkdirSync(lock);
  try {
    const current=loadCycle(root,previous.id,registry);
    if(sha256Json(previous)!==sha256Json(current)) throw new Error('Concurrent cycle update; reload current state');
    const next=transitionCycle(current,event,registry,root);
    if(sha256Json(next)===sha256Json(current))return current;
    const pending=resolve(dir,`event-${next.revision}.json`);
    if(existsSync(pending)) throw new Error('Incomplete prior transaction requires explicit recovery inspection');
    writeExclusive(pending,{previousSha256:sha256Json(current),event,nextSha256:sha256Json(next)});
    writeExclusive(resolve(dir,'state.pending.json'),next);renameSync(resolve(dir,'state.pending.json'),resolve(dir,'state.json'));
    return next;
  } finally {rmSync(lock,{recursive:true});}
};
export const repositoryReference = (path:string,root:string,sha256:string):RecordReference => {
  const rel=relative(resolve(root),resolve(path));
  if(isAbsolute(rel)||rel==='..'||rel.startsWith(`..${sep}`)) throw new Error('Cycle evidence must be inside repository');
  return recordReferenceSchema.parse({path:rel,sha256});
};

/** Deterministic recovery of an interrupted event/state write; no guessed authority or media mutation. */
export const recoverCycleEvent=(root:string,id:string,registry:MediaRegistry)=>{
  const dir=directory(root,id);const lock=resolve(dir,'.write-lock');mkdirSync(lock);
  try {
    const current=loadCycle(root,id,registry,true);const path=resolve(dir,`event-${current.revision+1}.json`);
    if(!existsSync(path))return current;
    const stored=json(path) as {previousSha256:string;event:CycleEvent;nextSha256:string};
    if(stored.previousSha256!==sha256Json(current))throw new Error('Pending event does not bind current state');
    const next=transitionCycle(current,stored.event,registry,root);
    if(stored.nextSha256!==sha256Json(next))throw new Error('Pending event cannot be reproduced');
    const pending=resolve(dir,'state.pending.json');
    if(existsSync(pending)&&sha256Json(json(pending))!==sha256Json(next))throw new Error('Ambiguous pending state requires inspection');
    if(!existsSync(pending))writeExclusive(pending,next);
    renameSync(pending,resolve(dir,'state.json'));return next;
  } finally {rmSync(lock,{recursive:true});}
};
