/** Read-only discovery handoff validation. No provider, render or publication calls. */
import {readFileSync, readdirSync, writeFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {join} from 'node:path';
import {validateTopicSelection} from '../../../src/workflow/topic-selection';
import {validatePremiseSelection} from '../../../src/workflow/premise';
import {readBoundFile} from '../../../src/workflow/evidence';
import {loadCycle} from '../../../src/workflow/store';
import {loadMediaRegistry} from '../../../src/artifacts/media';
import {sha256Json} from '../../../src/content-intelligence/run-schema';
const base='content-intelligence/cycles/cycle-15';
const selection=validateTopicSelection(JSON.parse(readFileSync(`${base}/topic-selection.json`,'utf8')));
validatePremiseSelection(selection);
const cycle=loadCycle(process.cwd(),'cycle.15',loadMediaRegistry());
if(cycle.stage!=='premise-review'||cycle.revision!==2||cycle.premiseApproved||cycle.research||cycle.narration||cycle.direction||cycle.candidate||cycle.productionBegun||cycle.publicationAuthorized)throw new Error('Discovery boundary violated');
if(sha256Json(selection)!=='9f80edc36a770075590493d81a80bcd0def9a871872ef58bbeb9e93abc4f3e7d')throw new Error('Selection differs from owner review target');
const inspect=(value: unknown):void=>{
 if(Array.isArray(value)){value.forEach(inspect);return;}
 if(!value||typeof value!=='object')return;
 const item=value as Record<string,unknown>;
 if(typeof item.path==='string'&&typeof item.sha256==='string')readBoundFile({path:item.path,sha256:item.sha256});
 Object.values(item).forEach(inspect);
};
const files=(path:string):string[]=>readdirSync(path,{withFileTypes:true}).flatMap(entry=>entry.isDirectory()?files(join(path,entry.name)):[join(path,entry.name)]);
files(base).filter(p=>p.endsWith('.json')&&!p.endsWith('/scope-validation.json')).forEach(p=>inspect(JSON.parse(readFileSync(p,'utf8'))));
const tracked=execFileSync('git',['diff','--name-only','b816cc2'],{encoding:'utf8'}).trim().split('\n').filter(Boolean);
const extra=execFileSync('git',['ls-files','--others','--exclude-standard'],{encoding:'utf8'}).trim().split('\n').filter(Boolean);
const allowed=(p:string)=>p==='workflow/project-state.json'||p.startsWith(`${base}/`)||p.startsWith('workflow/cycles/cycle.15/')||p==='workflow/authorities/cycle-15-start.json';
if([...tracked,...extra].some(p=>!allowed(p)))throw new Error('Unrelated/historical file changed');
const searches=JSON.parse(readFileSync(`${base}/discovery/search-record.json`,'utf8'));
if(searches.queries.flat().length!==22)throw new Error('Incorrect query count');
const scopes={passed:true,checkedAt:new Date().toISOString(),cycleRevision:cycle.revision,gate:'AHMET — CYCLE #15 PREMISE REVIEW',selectionJsonSha256:sha256Json(selection),seriousComparedCandidates:selection.candidates.length,shortlistCandidates:5,roundsUsed:1,maximumRounds:3,searchQueries:22,allBoundReferencesValidated:true,historicalTrackedFilesUnchanged:true,allowedChangedPaths:tracked,untrackedScopeValidated:true,premiseApproved:false,researchDevelopmentStarted:false,productionStarted:false,platformActions:[],limits:['Preliminary feasibility, not final claim verification.','No rendered review, source video playback, real-device evidence or subjective audio acceptance claimed.','Full calcium paper inaccessible; actual institutional bodies and primary exception paper bound.']};
writeFileSync(`${base}/scope-validation.json`,JSON.stringify(scopes,null,2)+'\n');
console.log(JSON.stringify(scopes,null,2));
