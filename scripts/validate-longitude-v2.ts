import {existsSync,readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {z} from 'zod';
import {validateLongitudeV2} from '../src/production/longitude-v2-integrity';
import {longitudeFileHash} from '../src/production/longitude-integrity';
import {parseManifests} from '../src/artifacts/schema';
import {stableJson} from '../src/content-intelligence/run-schema';
const result=validateLongitudeV2();
const read=(p:string):unknown=>JSON.parse(readFileSync(p,'utf8'));
const folder='content-intelligence/reviews/longitude-clock-production-v2';
if(existsSync(folder+'/candidate-receipt.json')){
 const receipt=z.object({master:z.object({path:z.string(),sha256:z.string()}),essentialBindings:z.array(z.object({path:z.string(),sha256:z.string()})),renderInput:z.string(),productionPlan:z.string(),masterApproved:z.literal(false),platformApproved:z.literal(false),uploaded:z.literal(false),published:z.literal(false),v1Preserved:z.literal(true)}).passthrough().parse(read(folder+'/candidate-receipt.json'));
 if(longitudeFileHash(receipt.master.path)!==receipt.master.sha256)throw new Error('Candidate V2 bytes drift');
 for(const b of receipt.essentialBindings)if(longitudeFileHash(b.path)!==b.sha256)throw new Error('Essential V2 production binding drift: '+b.path);
 const rendered=read(receipt.renderInput) as Record<string,unknown>;
 if(stableJson({...rendered,revision:4,status:'rendered-candidate-visual-review-required'})!==stableJson(read(receipt.productionPlan)))throw new Error('Post-render lifecycle changed material inputs');
 const manifests=parseManifests(read('artifacts/longitude-clock-v2-manifests.json'));
 for(const m of manifests)if(longitudeFileHash(m.localPath)!==m.identity.sha256||readFileSync(m.localPath).length!==m.identity.bytes||m.approvalScope!=='none'||m.publication!=='not-authorized')throw new Error('V2 artifact drift or inferred approval');
 for(const p of ['report.json','decode-report.json','typography-report.json','visual-inspection.json'])z.object({passed:z.literal(true)}).passthrough().parse(read('artifacts/qa-evidence/longitude-clock-candidate-v2/'+p));
 // All immutable v1 evidence/audio/plans remain exact, not only the old MP4.
 const protectedPaths=execFileSync('git',['ls-tree','-r','--name-only','919d18ce20e39209d3279893781669b5d5eeccbd'],{encoding:'utf8'}).split('\n').filter(p=>p.startsWith('artifacts/qa-evidence/longitude-clock-candidate-v1/')||p.startsWith('public/audio/longitude-clock/')||p.startsWith('content-intelligence/reviews/longitude-clock-production-v1/')||['artifacts/longitude-clock-manifests.json','src/production/plans/longitude-clock.json','src/production/narration/longitude-clock.json','src/production/narration/longitude-clock-soundscape.json','src/captions/plans/longitude-clock.json','captions/longitude-clock.en.vtt'].includes(p));
 for(const p of protectedPaths)if(!readFileSync(p).equals(execFileSync('git',['show',`919d18ce20e39209d3279893781669b5d5eeccbd:${p}`],{maxBuffer:64*1024*1024})))throw new Error('Immutable V1 evidence drift: '+p);
 console.log(JSON.stringify({...result,master:receipt.master,retainedArtifacts:manifests.length,v1FilesPreserved:protectedPaths.length},null,2));
}else console.log(JSON.stringify(result,null,2));
