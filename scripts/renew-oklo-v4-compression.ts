import {writeFileSync} from 'node:fs';
import {loadMediaRegistry,mediaHash} from '../src/artifacts/media';
import {loadCycle,persistCycleEvent} from '../src/workflow/store';
const base='content-intelligence/cycles/cycle-8/editorial-revision-v4/compression-pass-2';
const put=(name:string,data:unknown)=>{const path=`${base}/${name}.json`;writeFileSync(path,JSON.stringify(data,null,2)+'\n',{flag:'wx'});return {path,sha256:mediaHash(path)};};
const registry=loadMediaRegistry();let cycle=loadCycle(process.cwd(),'cycle.8',registry);
cycle=persistCycleEvent(process.cwd(),cycle,{type:'retry-internal',stage:'editorial',record:put('editorial-renewal',{cycleId:'cycle.8',reason:'Measured first narration74.3s revealed removable repetition. Renew exact wording/direction before final production; same premise and existing claim scopes.'}),at:new Date().toISOString()},registry);
persistCycleEvent(process.cwd(),cycle,{type:'begin-internal',stage:'editorial',record:put('editorial-start',{cycleId:'cycle.8',stage:'editorial',action:'Final compression pass preserving isotope/fission/groundwater/retention/one-zone inference qualifications.'}),at:new Date().toISOString()},registry);
