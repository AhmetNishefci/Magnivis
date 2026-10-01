import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {parseManifests} from '../src/artifacts/schema';
import {validateLongitudeProduction,longitudeFileHash} from '../src/production/longitude-integrity';
import {stableJson} from '../src/content-intelligence/run-schema';
const read=(p:string)=>JSON.parse(readFileSync(p,'utf8'));
const bindings=validateLongitudeProduction();
const receipt=read('content-intelligence/reviews/longitude-clock-production-v1/candidate-receipt.json');
const manifests=parseManifests(read('artifacts/longitude-clock-manifests.json'));
for(const m of manifests){if(longitudeFileHash(m.localPath)!==m.identity.sha256||readFileSync(m.localPath).length!==m.identity.bytes)throw new Error(`Retained artifact changed: ${m.localPath}`);if(m.approvalScope!=='none'||m.publication!=='not-authorized')throw new Error('Candidate inherited approval');}
if(receipt.master.sha256!==longitudeFileHash(receipt.master.path)||receipt.masterApproved||receipt.platformApproved||receipt.uploaded||receipt.published)throw new Error('Candidate identity/authority drift');
for(const field of ['productionPlan','captionPlan','renderInput'])if(longitudeFileHash(receipt[field])!==receipt[field+'Sha256'])throw new Error(`${field} binding drift`);
const rendered=read(receipt.renderInput),plan=read(receipt.productionPlan);
if(stableJson({...rendered,revision:2,status:'rendered-candidate-visual-review-required'})!==stableJson(plan))throw new Error('Post-render plan changed beyond lifecycle state');
for(const p of ['src/Root.tsx','scripts/render.ts','scripts/video-targets.ts','package.json','pnpm-lock.yaml'])if(!readFileSync(p).equals(execFileSync('git',['show',`4c4c967f968972108f53221f6921f721246cf0db:${p}`])))throw new Error(`Historical implementation changed: ${p}`);
for(const p of ['decode-report.json','typography-report.json','determinism-report.json']){const r=read('artifacts/qa-evidence/longitude-clock-candidate-v1/'+p);if(r.passed!==true)throw new Error(`QA failed: ${p}`);}
console.log(JSON.stringify({...bindings,retainedArtifacts:manifests.length,master:receipt.master,renderInputPreserved:true,historicalImplementationPreserved:true},null,2));
