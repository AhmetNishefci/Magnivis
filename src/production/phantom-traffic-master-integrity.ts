import {readFileSync,statSync} from 'node:fs';
import decisionData from '../../content-intelligence/reviews/phantom-traffic-master-lock-v1/owner-decision.json';
import reviewedPlanData from './plans/phantom-traffic.json';
import reviewedVideoData from '../../content-intelligence/reviews/phantom-traffic-master-lock-v1/reviewed-video-spec.json';
import bindings from '../../content-intelligence/reviews/phantom-traffic-production-v1/candidate-bindings.json';
import {applyMasterVisualApproval,masterApprovalDecisionSchema} from './master-approval';
import {productionPlanSchema} from './schema';
import {phantomTrafficProductionPlan as plan} from './plans/phantom-traffic';
import {phantomTraffic as video} from '../content/videos/phantom-traffic';
import {videoSpecSchema} from '../content/schema';
import {sha256Json} from '../content-intelligence/run-schema';
import {fileSha256,validatePhantomTrafficProduction} from './phantom-traffic-integrity';
export const validatePhantomTrafficLockedMaster=()=>{
 validatePhantomTrafficProduction();
 const d=masterApprovalDecisionSchema.parse(decisionData);
 const replay=applyMasterVisualApproval(d,productionPlanSchema.parse(reviewedPlanData),bindings);
 if(sha256Json(replay)!==sha256Json(plan))throw new Error('Locked ProductionPlan differs from exact approval replay');
 if(fileSha256(d.artifact.path)!==d.artifact.sha256||statSync(d.artifact.path).size!==d.artifact.bytes)throw new Error('Locked master bytes changed');
 if(sha256Json(bindings)!==d.candidateBindings.sha256||sha256Json(JSON.parse(readFileSync(d.candidateBindings.path,'utf8')))!==d.candidateBindings.sha256)throw new Error('Reviewed candidate receipt changed');
 if(d.artifact.sha256!==bindings.candidate.sha256||d.artifact.path!==bindings.candidate.path||d.narrationBundleSha256!==bindings.narration.bundleSha256)throw new Error('Master/audio identity differs from reviewed candidate');
 // Every render dependency remains exact. Only VideoSpec lifecycle metadata changes.
 for(const source of bindings.sources)if(fileSha256(source.path)!==source.sha256&&source.path!=='src/content/videos/phantom-traffic.ts')throw new Error(`Locked render dependency changed: ${source.path}`);
 const oldVideo=videoSpecSchema.parse(reviewedVideoData);
 const expected=videoSpecSchema.parse({...oldVideo,status:'reviewed',production:{...oldVideo.production,productionPlanRevision:plan.revision,outputReviewState:'owner-visual-approved'}});
 if(sha256Json(video)!==sha256Json(expected))throw new Error('Locked VideoSpec changed beyond authorized lifecycle metadata');
 if(d.platformApprovalGranted||d.publicationApprovalGranted||!plan.visualApproval||plan.visualApproval.reviewedAt)throw new Error('Invalid approval scope/time basis');
 return {passed:true,ownerMasterVisualApproval:true,masterArtifactId:d.masterArtifactId,artifact:d.artifact,productionPlan:{id:plan.id,revision:plan.revision,status:plan.status},captionPlan:d.captionPlan,decisionId:d.id,decisionEnteredAt:d.enteredAt,ownerSuppliedReviewTimestamp:null,platformApprovalGranted:false,publicationApprovalGranted:false};
};
