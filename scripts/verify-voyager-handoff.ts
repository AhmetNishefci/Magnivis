import {readFileSync,readdirSync,existsSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {loadCycle,loadProjectCycles} from '../src/workflow/store';
import {loadMediaRegistry,mediaHash} from '../src/artifacts/media';
const base='content-intelligence/cycles/cycle-16/production-v1',read=(path:string)=>JSON.parse(readFileSync(path,'utf8')) as Record<string,unknown>;
const registry=loadMediaRegistry(),cycle=loadCycle(process.cwd(),'cycle.16',registry);
if(cycle.stage!=='master-review'||cycle.masterDecision||cycle.release||cycle.publicationDecision||!cycle.candidate)throw new Error('Wrong owner review boundary');
const candidate=read(cycle.candidate.path) as unknown as {media:{id:string;sha256:string};scriptSha256:string;qa:{reports:{path:string;sha256:string}[]}};
if(mediaHash(registry.resolveFile(candidate.media))!==candidate.media.sha256)throw new Error('Candidate mismatch');
const bindings=read(base+'/implementation-bindings.json') as unknown as {files:{path:string;sha256:string}[]};
for(const file of bindings.files)if(mediaHash(file.path)!==file.sha256)throw new Error('Implementation changed: '+file.path);
const baseline='2683c11',oldCatalog=JSON.parse(execFileSync('git',['show',baseline+':artifacts/media-catalog.json'],{encoding:'utf8',maxBuffer:8*1024*1024})) as {artifacts:{id:string}[]};
for(const entry of oldCatalog.artifacts){const old=JSON.stringify(entry),current=JSON.stringify(registry.list().find(m=>m.id===entry.id));if(old!==current)throw new Error('Prior catalog metadata changed');}
const protectedFiles=execFileSync('git',['ls-tree','-r','--name-only',baseline,'content-intelligence/cycles/cycle-15','workflow/cycles/cycle.15'],{encoding:'utf8'}).trim().split('\n');
for(const file of protectedFiles){const old=execFileSync('git',['show',baseline+':'+file],{maxBuffer:8*1024*1024});if(!readFileSync(file).equals(old))throw new Error('Protected Flytrap evidence changed: '+file);}
if(readdirSync('content-intelligence/cycles/cycle-16').some(n=>n.startsWith('delivery'))||existsSync('deliveries/voyager'))throw new Error('Premature delivery work');
const cycles=loadProjectCycles(process.cwd(),registry);
console.log(JSON.stringify({passed:true,baseline,cycleId:cycle.id,stage:cycle.stage,masterApproved:false,publicationAuthorized:false,media:candidate.media,implementationFiles:bindings.files.length,priorCatalogIdentitiesPreserved:oldCatalog.artifacts.length,protectedFlytrapFiles:protectedFiles.length,replayedCycles:cycles.length,noVoyagerDeliveryPackages:true,limits:'Source and exact identity verification, not subjective playback or native-device approval.'},null,2));
