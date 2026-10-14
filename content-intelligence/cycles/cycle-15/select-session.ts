/** Cycle15 one-time session adapter. No provider calls or production. */
import {readFileSync,writeFileSync} from 'node:fs';
import {chooseTopicAutonomously} from '../../../src/workflow/topic-selection';
import {validatePremiseSelection} from '../../../src/workflow/premise';
import {repositoryReference} from '../../../src/workflow/store';
import {mediaHash} from '../../../src/artifacts/media';
import {sha256Json} from '../../../src/content-intelligence/run-schema';
const base='content-intelligence/cycles/cycle-15';
const result=await chooseTopicAutonomously({maximumRounds:3,
 discoverAndCompare:async(round)=>{if(round!==1)throw new Error('Fresh authored comparison needed for another round');return JSON.parse(readFileSync(`${base}/topic-selection.proposal.json`,'utf8'));},
 preserve:async(selection)=>{const path=`${base}/discovery/round-1.json`;writeFileSync(path,JSON.stringify(selection,null,2)+'\n',{flag:'wx'});return repositoryReference(path,process.cwd(),mediaHash(path));}
});
if(result.outcome!=='selected'||!result.selection)throw new Error('No eligible premise');
validatePremiseSelection(result.selection);
writeFileSync(`${base}/topic-selection.json`,JSON.stringify(result.selection,null,2)+'\n',{flag:'wx'});
writeFileSync(`${base}/discovery-result.json`,JSON.stringify({outcome:result.outcome,record:result.record,records:result.records,maximumRounds:3,roundsUsed:result.records.length,method:'chooseTopicAutonomously; actual manual session comparison; no paid/provider workflow envelope'},null,2)+'\n');
writeFileSync(`${base}/discovery-complete-event.json`,JSON.stringify({type:'complete-internal',stage:'discovery',record:repositoryReference(`${base}/topic-selection.json`,process.cwd(),mediaHash(`${base}/topic-selection.json`)),at:new Date().toISOString()},null,2)+'\n');
console.log(JSON.stringify({selectedId:result.selection.selectedId,selectionJsonSha256:sha256Json(result.selection),roundsUsed:result.records.length,candidates:result.selection.candidates.length},null,2));
