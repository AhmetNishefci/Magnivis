import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import assert from 'node:assert/strict';
const root='content-intelligence/cycles/cycle-15/revision-v2/';
type Ref={path:string;sha256:string};
type RecordData={commit:string;files:Ref[];revision:number;stage:string;masterDecision:unknown;publicationDecision:unknown;release:unknown;candidate:Ref;media:{sha256:string};scriptSha256:string;cycle15RevisionV2:{masterMedia:{sha256:string};nativeRevision:number}};
const load=(p:string):RecordData=>JSON.parse(readFileSync(p,'utf8')) as RecordData;
const hash=(p:string)=>createHash('sha256').update(readFileSync(p)).digest('hex');
let references=0;
const walk=(v:unknown):void=>{if(!v||typeof v!=='object')return;const record=v as Record<string,unknown>;if(typeof record.path==='string'&&typeof record.sha256==='string'){assert.equal(hash(record.path),record.sha256,record.path);references++;}for(const x of Object.values(record))walk(x);};
const baseline=load(root+'preservation-baseline.json');walk(baseline);
walk(load(root+'implementation-bindings.json'));walk(load(root+'qa/final-report.json'));
const state=load('workflow/cycles/cycle.15/state.json');walk(state);
assert.equal(state.revision,17);assert.equal(state.stage,'master-review');assert.equal(state.masterDecision,null);assert.equal(state.publicationDecision,null);assert.equal(state.release,null);
assert.equal(state.candidate.path,root+'master-candidate-v2.json');
const candidate=load(state.candidate.path);walk(candidate);
assert.equal(hash('artifacts/masters/flytrap-cycle15-candidate-v2.mp4'),candidate.media.sha256);
assert.equal(candidate.scriptSha256,'029ab1010bef6553e6f2e95957376f0191054be34b81cb30d51b778ac5afda86');
for(let i=1;i<=9;i++){const p=`workflow/cycles/cycle.15/event-${i}.json`;assert.deepEqual(readFileSync(p),execFileSync('git',['show',`${baseline.commit}:${p}`]),p);}
const oldFiles=execFileSync('git',['ls-tree','-r','--name-only',baseline.commit,'workflow/cycles','content-intelligence/cycles','docs/PROJECT-STATE.md'],{encoding:'utf8'}).trim().split('\n');
let historicalFiles=0;
for(const p of oldFiles){if(p==='workflow/cycles/cycle.15/state.json')continue;assert.deepEqual(readFileSync(p),execFileSync('git',['show',`${baseline.commit}:${p}`],{maxBuffer:128*1024*1024}),p);historicalFiles++;}
const metadata=load('workflow/project-state.json');assert.equal(metadata.cycle15RevisionV2.masterMedia.sha256,candidate.media.sha256);assert.equal(metadata.cycle15RevisionV2.nativeRevision,17);
console.log(JSON.stringify({status:'passed',masterSha256:candidate.media.sha256,nativeStage:state.stage,nativeRevision:state.revision,checkedHashReferences:references,preservedBaselineFiles:baseline.files.length,preservedHistoricalFiles:historicalFiles,publicationAuthorized:false,scope:'Read-only exact hashes and historical bytes; no creative or actual-device certification.'},null,2));
