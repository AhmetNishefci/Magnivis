import assert from 'node:assert/strict';
import {readFileSync,writeFileSync} from 'node:fs';
import {mediaHash} from '../src/artifacts/media';
import {sha256Json} from '../src/content-intelligence/run-schema';
import {knowledgePackageSchema} from '../src/knowledge/schema';
import {contentAssetSchema} from '../src/content-assets/schema';
import {creativeDirectionSchema} from '../src/content-assets/creative-direction';
import {validateInternalProductionPlanReferences} from '../src/production/schema';
import {validateAdaptiveCaptionPlan} from '../src/captions/adaptive-plan';
import {faces,topology,counterChoice,enumerate,branches,type DieId} from '../src/production/dice-v4/model';
import narration from '../src/production/narration/dice-v4.json';
import old from '../src/production/narration/dice.json';
const b='content-intelligence/cycles/cycle-14/revision-v4',e='content-intelligence/cycles/cycle-14/revision-v2',read=(p:string):unknown=>JSON.parse(readFileSync(p,'utf8'));
const pkg=knowledgePackageSchema.parse(read(`${e}/knowledge-package.ready.json`)),asset=contentAssetSchema.parse(read(`${e}/content-asset.ready.json`)),direction=creativeDirectionSchema.parse(read(`${b}/direction-v4.json`));
validateInternalProductionPlanReferences(read('src/production/plans/dice-v4.json'),pkg,asset,direction);validateAdaptiveCaptionPlan(read('src/captions/plans/dice-v4.json'),narration.cues,narration.format,direction,asset);
assert.equal(sha256Json(asset.script),'4c96934b18bf82f5f393634d28d2a2be3f755893f639e479735076a6025f069b');assert.equal(narration.cues.map(c=>c.transcript).join(' '),asset.script.segments.map(s=>s.text).join(' '));
for(const [i,c]of narration.cues.entries()){assert.equal(c.file,old.cues[i]!.file);assert.equal(c.duration,old.cues[i]!.duration);assert.equal(c.transcript,old.cues[i]!.transcript);assert.equal(mediaHash(`public/${c.file}`),old.provenance.cueArtifacts[i]!.sha256);}
const cfg=read('content-intelligence/cycles/cycle-14/development-v1/mathematics/configuration.json') as {dice:{id:DieId;faces:number[]}[]};for(const d of cfg.dice){assert.deepEqual(faces[d.id],d.faces);assert.deepEqual([...topology[d.id]].sort(),[...d.faces].sort());}
const comparisons=counterChoice.slice(0,4).map((opponent,i)=>{const winner=counterChoice[i+1]!,pairs=enumerate(winner,opponent);assert.equal(pairs.length,36);assert.equal(pairs.filter(p=>p.win).length,24);assert.equal(pairs.filter(p=>!p.win).length,12);assert.equal(pairs.filter(p=>p.tie).length,0);return {winner,opponent,pairs,wins:24,losses:12,ties:0};});
const routeWeights=Object.entries(branches).map(([kind,b])=>{const pairs=enumerate(b.winner,b.opponent),counts=[pairs.filter(p=>p.win&&p.a===b.firstValue).length,pairs.filter(p=>p.win&&p.a===b.secondValue).length];assert.deepEqual(counts,kind==='green'?[18,6]:[12,12]);return {kind,counts,total:24,losses:12};});
const baseline=read(`${b}/preservation-baseline.json`) as {files:{path:string;sha256:string}[]};baseline.files.forEach(r=>assert.equal(mediaHash(r.path),r.sha256,`Historical change ${r.path}`));
if(process.argv.includes('--record'))writeFileSync(`${b}/mathematical-qa.json`,JSON.stringify({checkedAt:new Date().toISOString(),passed:true,scriptSha256:sha256Json(asset.script),comparisons,routeWeights,faceTopology:topology,sourceAudioUnchanged:true,previousTrackedFilesUnchanged:baseline.files.length,limitations:['Ideal independent equally likely faces, strictly-higher-number rule.','Illustrative fixed geometry/motion, no physical fairness tests or observed random trials.']},null,2)+'\n',{flag:'wx'});
console.log('Read-only V4verification passed: exact narration/WAVs, fixed physical faces,144pair outcomes, progressive branch counts and previous-file preservation.');
