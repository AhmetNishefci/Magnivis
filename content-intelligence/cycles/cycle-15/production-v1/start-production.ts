/** Apply actual scoped creative approval; no master or publication approval. */
import {readFileSync,writeFileSync} from 'node:fs';
import {sha256Json} from '../../../../src/content-intelligence/run-schema';
import {validateCreativeDirection} from '../../../../src/content-assets/creative-direction-integrity';
import {knowledgePackageSchema} from '../../../../src/knowledge/schema';
import {contentAssetSchema} from '../../../../src/content-assets/schema';
import {loadMediaRegistry,mediaHash} from '../../../../src/artifacts/media';
import {loadCycle,persistCycleEvent} from '../../../../src/workflow/store';
const b='content-intelligence/cycles/cycle-15/production-v1',e='content-intelligence/cycles/cycle-15/development-v1';
const read=(p:string):unknown=>JSON.parse(readFileSync(p,'utf8')),ref=(path:string)=>({path,sha256:mediaHash(path)}),put=(n:string,x:unknown)=>{const p=`${b}/${n}.json`;writeFileSync(p,JSON.stringify(x,null,2)+'\n',{flag:'wx'});return ref(p);};
const pkg=knowledgePackageSchema.parse(read(`${e}/knowledge-package.ready.json`)),asset=contentAssetSchema.parse(read(`${e}/content-asset.ready.json`)),now=new Date().toISOString(),registry=loadMediaRegistry();
const prior=validateCreativeDirection(read(`${e}/direction-v1.json`),pkg,asset,{registry});
if(sha256Json(asset.script)!=='029ab1010bef6553e6f2e95957376f0191054be34b81cb30d51b778ac5afda86')throw new Error('Locked narration mismatch');
const direction=validateCreativeDirection({...prior,state:'ready-for-production-planning',ownerReview:{required:false,rationale:'Actual owner instruction explicitly approves this exact script and eight-scene treatment and authorizes candidate production; prior scoped hold resolved by production-authority.json. No exceptional new policy or master/publication approval inferred.'},provenance:{...prior.provenance,enteredAt:now,notes:prior.provenance.notes+' Actual scoped creative acceptance and production authority: '+`${b}/production-authority.json`+'. Exact decisions/convergence retained; no forced style adaptation.'}},pkg,asset,{registry});
const ready=put('direction-ready',direction);
persistCycleEvent(process.cwd(),loadCycle(process.cwd(),'cycle.15',registry),{type:'complete-internal',stage:'creative',record:ready,at:now},registry);
const start=put('production-start',{cycleId:'cycle.15',stage:'production',action:'Produce exact locked narration and eight-scene biological candidate; inspect mechanism prototypes, full audiovisual/scientific/caption/technical QA and stop at Master Review. No deliveries/platforms.'});
const event={type:'begin-internal' as const,stage:'production' as const,record:start,at:new Date().toISOString()};put('production-begin-event',event);
const c=persistCycleEvent(process.cwd(),loadCycle(process.cwd(),'cycle.15',registry),event,registry);console.log({stage:c.stage,revision:c.revision});
