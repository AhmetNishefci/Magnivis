import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
const b='content-intelligence/cycles/cycle-15/revision-v3/';
const hash=(p:string)=>createHash('sha256').update(readFileSync(p)).digest('hex');
const read=(p:string):Record<string,unknown>=>JSON.parse(readFileSync(p,'utf8')) as Record<string,unknown>;
let refs=0;const walk=(v:unknown):void=>{if(!v||typeof v!=='object')return;const r=v as Record<string,unknown>;if(typeof r.path==='string'&&typeof r.sha256==='string'){assert.equal(hash(r.path),r.sha256,r.path);refs++;}for(const x of Object.values(r))walk(x);};
const baseline=read(b+'preservation-baseline.json');walk(baseline);
for(let i=1;i<=17;i++){const p=`workflow/cycles/cycle.15/event-${i}.json`;assert.deepEqual(readFileSync(p),execFileSync('git',['show',`${String(baseline.commit)}:${p}`]),p);}
const state=read('workflow/cycles/cycle.15/state.json');walk(state);assert.equal(state.stage,'master-review');assert.equal(state.revision,22);assert.equal(state.masterDecision,null);assert.equal(state.publicationDecision,null);assert.equal(state.release,null);
for(const n of ['implementation-bindings','qa/final-report','master-review-target'])walk(read(b+n+'.json'));
const candidate=read(b+'master-candidate-v3.json');walk(candidate);const media=candidate.media as {sha256:string};assert.equal(hash('artifacts/masters/flytrap-cycle15-candidate-v3.mp4'),media.sha256);
assert.equal(candidate.scriptSha256,'029ab1010bef6553e6f2e95957376f0191054be34b81cb30d51b778ac5afda86');
console.log(JSON.stringify({passed:true,nativeRevision:22,masterSha256:media.sha256,hashReferences:refs,preservedHistoricalFiles:(baseline.files as unknown[]).length,priorJournalEvents:17,publicationAuthorized:false,scope:'Read-only identity/preservation verification, not subjective editorial or device approval.'},null,2));
