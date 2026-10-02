import {readBoundFile} from '../src/workflow/evidence';
import {ownerHandoff} from '../src/workflow/handoff';
import {readFileSync,mkdirSync} from 'node:fs';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import {loadMediaRegistry,mediaHash} from '../src/artifacts/media';
import {openMediaCatalog} from '../src/artifacts/catalog';
import {initializeCycle,loadCycle,persistCycleEvent,repositoryReference,loadProjectCycles,projectCycleOverview,recoverCycleEvent} from '../src/workflow/store';
import {cycleStatus,runUntilGate,type CycleEvent} from '../src/workflow/cycle';
const [command,input,eventPath]=process.argv.slice(2);const root=process.cwd();
if(command==='start'&&input) {
  mkdirSync(resolve(root,'workflow/cycles'),{recursive:true});
  const c=initializeCycle(root,repositoryReference(input,root,mediaHash(input)));console.log(JSON.stringify(cycleStatus(c,root),null,2));
} else if(command==='status'&&!input) {
  const registry=openMediaCatalog(root);const cycles=loadProjectCycles(root,registry);console.log(JSON.stringify({project:JSON.parse(readFileSync(resolve(root,'workflow/project-state.json'),'utf8')),overview:projectCycleOverview(cycles,root),cycles:cycles.map(c=>cycleStatus(c,root,registry))},null,2));
} else if(command==='review'&&input) {
  const registry=loadMediaRegistry(root);console.log(JSON.stringify(ownerHandoff(loadCycle(root,input,registry),registry,root),null,2));
} else if(command==='recover'&&input) {
  const current=recoverCycleEvent(root,input,loadMediaRegistry(root));console.log(JSON.stringify(cycleStatus(current,root),null,2));
} else if(command==='run'&&input&&eventPath) {
  const registry=openMediaCatalog(root);const current=loadCycle(root,input,registry);
  readBoundFile(repositoryReference(eventPath,root,mediaHash(eventPath)),root);
  const adapter=await import(pathToFileURL(resolve(eventPath)).href) as {execute: Parameters<typeof runUntilGate>[2]};
  if(typeof adapter.execute!=='function')throw new Error('Session adapter must export execute(stage, cycle)');
  const c=await runUntilGate(current,registry,adapter.execute,(previous,next,event)=>{const stored=persistCycleEvent(root,previous,event,registry);if(JSON.stringify(stored)!==JSON.stringify(next))throw new Error('Persistence result mismatch');},root);
  console.log(JSON.stringify(cycleStatus(c,root),null,2));
} else if((command==='status'||command==='advance')&&input) {
  const registry=loadMediaRegistry(root);let c=loadCycle(root,input,registry);
  if(command==='advance') {if(!eventPath)throw new Error('advance requires an evidence-bound event.json');c=persistCycleEvent(root,c,JSON.parse(readFileSync(eventPath,'utf8')) as CycleEvent,registry);}
  console.log(JSON.stringify(cycleStatus(c,root),null,2));
} else throw new Error('Usage: node --import tsx scripts/cycle.ts start <owner-cycle-authority.json> | run <cycle.id> <session-executor.ts> | status <cycle.id> | advance <cycle.id> <event.json>');
