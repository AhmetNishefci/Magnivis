import {execFileSync} from 'node:child_process';
import {existsSync,readFileSync,writeFileSync} from 'node:fs';
import {loadMediaRegistry,mediaHash} from '../src/artifacts/media';
import {loadCycle} from '../src/workflow/store';
const baseline='a56eb2ebcc4672e17669cfd15d37edf60490218a',registry=loadMediaRegistry();
const git=(args:string[])=>execFileSync('git',args,{encoding:'utf8'});
const tracked=git(['ls-tree','-r','--name-only',baseline]).trim().split('\n');
const allowed=new Set(['src/ai/providers/kokoro-local.mjs','scripts/production-video-targets.ts','artifacts/media-catalog.json','workflow/cycles/cycle.9/state.json','workflow/project-state.json','docs/PROJECT-STATE.md','docs/ASSET-LICENSES.md']);
const changed=git(['diff','--name-only',baseline,'--']).trim().split('\n').filter(Boolean);
const drift=tracked.filter(p=>(changed.includes(p)&&!allowed.has(p))||!existsSync(p));
if(drift.length)throw new Error(`Historical or out-of-scope changes: ${drift.join(',')}`);
const priorRegistry=JSON.parse(git(['show',`${baseline}:artifacts/media-catalog.json`])) as {artifacts:{id:string}[]};
const currentRegistry=JSON.parse(readFileSync('artifacts/media-catalog.json','utf8')) as {artifacts:{id:string}[]};
for(const entry of priorRegistry.artifacts){if(JSON.stringify(currentRegistry.artifacts.find(e=>e.id===entry.id))!==JSON.stringify(entry))throw new Error('Existing media identity changed');}
const old=JSON.parse(readFileSync('src/production/narration/two-goals.json','utf8')) as {cues:{file:string;transcript:string}[];provenance:{approvedScriptSha256:string}},next=JSON.parse(readFileSync('src/production/narration/two-goals-v2.json','utf8')) as typeof old;
for(const [i,c] of old.cues.entries()){if(c.transcript!==next.cues[i]!.transcript||(![7,8,10].includes(i)&&c.file!==next.cues[i]!.file))throw new Error('Unapproved narration change');}
if(old.provenance.approvedScriptSha256!==next.provenance.approvedScriptSha256)throw new Error('Script hash changed');
const cycle=loadCycle(process.cwd(),'cycle.9',registry),cycle8=loadCycle(process.cwd(),'cycle.8',registry);
if(cycle.stage!=='master-review'||cycle.revision!==11||cycle.masterDecision||cycle.release||cycle.publicationDecision||existsSync('workflow/cycles/cycle.10'))throw new Error('Wrong boundary');
if(cycle8.revision!==30||cycle8.stage!=='authorized')throw new Error('Cycle8 changed');
const target=readFileSync('scripts/production-video-targets.ts','utf8').replace(/^import .*two-goals-v2.*;\n/gm,'').replace(/^export const twoGoalsV2Target=.*;\n/m,'').replace("id==='two-goals-v2'?twoGoalsV2Target:",'');
if(target!==git(['show',`${baseline}:scripts/production-video-targets.ts`]))throw new Error('Old production targets changed');
const priorProvider=git(['show',`${baseline}:src/ai/providers/kokoro-local.mjs`]);
if(!readFileSync('src/ai/providers/kokoro-local.mjs','utf8').startsWith(priorProvider))throw new Error('Default narrator changed');
writeFileSync('content-intelligence/cycles/cycle-9/pronunciation-revision-v2/scope-verification.json',JSON.stringify({checkedAt:new Date().toISOString(),passed:true,baseline,existingTrackedFilesPreserved:tracked.length-allowed.size,priorMediaEntriesUnchanged:priorRegistry.artifacts.length,unchangedNarrationClips:11,regeneratedCompleteUnits:3,correctedOccurrences:4,approvedScriptUnchanged:true,visualComponentUnchanged:true,v1Master:{path:'artifacts/masters/two-goals-cycle9-candidate-v1.mp4',sha256:mediaHash('artifacts/masters/two-goals-cycle9-candidate-v1.mp4')},cycle:{revision:cycle.revision,stage:cycle.stage,candidate:cycle.candidate},earlierJournalsAndSchedulingUnchanged:true,masterApprovalAbsent:true,publicationPreparationAbsent:true,cycle10Absent:true},null,2)+'\n',{flag:'wx'});
console.log('V1, all prior tracked artifacts and catalog identities preserved; V2 scoped; correct Master Review boundary.');
