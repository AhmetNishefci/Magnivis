import {execFileSync} from 'node:child_process';
import {createRequire} from 'node:module';
import {readFileSync,statSync} from 'node:fs';
import {validatePhantomTrafficProduction,fileSha256} from '../src/production/phantom-traffic-integrity';
import metadata from '../src/production/narration/phantom-traffic.json';
import decision from '../content-intelligence/reviews/phantom-traffic-approved-v3/owner-decision.json';
import {knowledgePackageSchema} from '../src/knowledge/schema';
import {contentAssetSchema} from '../src/content-assets/schema';
import {sha256Json} from '../src/content-intelligence/run-schema';
const require=createRequire(import.meta.url);
const probe=(require('ffprobe-static') as {path:string}).path;
const result=validatePhantomTrafficProduction();
for (const [file,schema,hash] of [
 ['knowledge-package.review.json',knowledgePackageSchema,decision.packageSha256],
 ['content-asset.review.json',contentAssetSchema,decision.assetSha256],
] as const) {
 const source=execFileSync('git',['show',`${decision.approvedSourceCommit}:content-intelligence/reviews/phantom-traffic-finalization-v2/${file}`],{encoding:'utf8'});
 if (sha256Json(schema.parse(JSON.parse(source)))!==hash) throw new Error('Owner-approved Git commit state mismatch');
}
for(const cue of metadata.cues){
 const duration=Number(JSON.parse(execFileSync(probe,['-v','error','-show_entries','format=duration','-of','json',`public/${cue.file}`],{encoding:'utf8'})).format.duration);
 if(Math.abs(duration-cue.duration)>0.000001)throw new Error(`Changed measured audio duration: ${cue.id}`);
}
const reviewSource=JSON.parse(execFileSync('git',['show',`${decision.approvedSourceCommit}:content-intelligence/reviews/phantom-traffic-finalization-v2/claim-review.json`],{encoding:'utf8'}));
if(sha256Json(reviewSource)!==decision.reviewSha256)throw new Error('Exact reviewed claim/evidence state mismatch');
const receipt=JSON.parse(readFileSync('content-intelligence/reviews/phantom-traffic-production-v1/candidate-bindings.json','utf8')) as {candidate:{path:string;sha256:string;bytes:number}; sources:{path:string;sha256:string}[]; qaEvidence:{path:string;sha256:string}[];ownerMasterVisualApproval:boolean;platformApprovalGranted:boolean;publicationApprovalGranted:boolean};
for(const file of [receipt.candidate,...receipt.sources,...receipt.qaEvidence])if(fileSha256(file.path)!==file.sha256)throw new Error(`Changed bound candidate artifact: ${file.path}`);
if(statSync(receipt.candidate.path).size!==receipt.candidate.bytes||receipt.ownerMasterVisualApproval||receipt.platformApprovalGranted||receipt.publicationApprovalGranted)throw new Error('Invalid review candidate identity/gate');
const report=JSON.parse(readFileSync('artifacts/qa-evidence/phantom-traffic-candidate-v1/report.json','utf8')) as {passed:boolean;failures:string[]};
if(!report.passed||report.failures.length)throw new Error('Rendered media QA failed');
console.log(JSON.stringify({...result,exactApprovedCommitChecked:true,measuredCueDurationsChecked:true,mediaQaPassed:true,candidateReceiptHashesChecked:true},null,2));
