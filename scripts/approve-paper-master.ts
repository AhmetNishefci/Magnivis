import {readFileSync,writeFileSync} from 'node:fs';
import {openMediaCatalog} from '../src/artifacts/catalog';
import {mediaHash} from '../src/artifacts/media';
import {sha256Json} from '../src/content-intelligence/run-schema';
import {ownerDecisionSchema} from '../src/workflow/evidence';
import {loadCycle,persistCycleEvent} from '../src/workflow/store';

// Captures the actual owner message at the pending gate; never authorizes release.
const root=process.cwd();const registry=openMediaCatalog(root);
let cycle=loadCycle(root,'cycle.4',registry);
if(cycle.stage!=='master-review'||!cycle.candidate)throw new Error('Exact master review must be pending');
const now=new Date().toISOString();
const candidate=JSON.parse(readFileSync(cycle.candidate.path,'utf8'));
const path='content-intelligence/cycles/cycle-4/master-owner-decision-v1.json';
const decision=ownerDecisionSchema.parse({schemaVersion:3,id:'owner-decision.cycle-4.master-v1',revision:1,gate:'master-review',cycleId:cycle.id,targetSha256:sha256Json(candidate),decision:'approve',enteredAt:now,suppliedReviewTime:null,reviewer:'Ahmet — owner',evidenceBasis:'explicit-owner-message',instruction:'APPROVE',acceptedUnknowns:[]});
writeFileSync(path,JSON.stringify(decision,null,2)+'\n',{flag:'wx'});
cycle=persistCycleEvent(root,cycle,{type:'owner-decision',record:{path,sha256:mediaHash(path)},at:now},registry);
const startPath='content-intelligence/cycles/cycle-4/presentation-start-v1.json';
writeFileSync(startPath,JSON.stringify({cycleId:cycle.id,stage:'presentation',action:'Prepare exact-master platform adaptations, original cover, presentation analysis and reference-only delivery handoffs for publication review.'},null,2)+'\n',{flag:'wx'});
cycle=persistCycleEvent(root,cycle,{type:'begin-internal',stage:'presentation',record:{path:startPath,sha256:mediaHash(startPath)},at:new Date().toISOString()},registry);
console.log(JSON.stringify({stage:cycle.stage,revision:cycle.revision,masterDecision:cycle.masterDecision,media:candidate.media,publicationAuthorized:false}));
