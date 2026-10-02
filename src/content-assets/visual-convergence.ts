import {existsSync,readdirSync,readFileSync} from 'node:fs';
import {join} from 'node:path';
import {z} from 'zod';
import {loadMediaRegistry,type MediaRegistry,mediaHash,type MediaReference} from '../artifacts/media';
import {sha256Json} from '../content-intelligence/run-schema';
import {readBoundRecord,requireOwnerDecision,recordReferenceSchema,digest,type RecordReference} from '../workflow/evidence';
import {masterApprovalDecisionSchema} from '../production/master-approval-schema';
import historicalDirections from '../../system-audits/cross-cycle-creative-convergence/historical-directions.json';
import type {CreativeDirection} from './creative-direction';

type AssetReference=CreativeDirection['contentAsset'];
export type RecentApprovedVisualWork={contentAsset:AssetReference;master:MediaReference;approval:RecordReference;creativeDirection:RecordReference|null;enteredAt:string};
const reference=(path:string,root:string):RecordReference=>({path,sha256:mediaHash(join(root,path))});
// Existing legacy approval adapters, not a style library. New work comes from journals.
const legacy=[
 ['phantom-traffic',null],
 ['longitude-clock','content-intelligence/reviews/longitude-clock-production-v2/creative-direction.revision-3.json'],
 ['chocolate-crystal-choice','content-intelligence/reviews/chocolate-crystal-choice-production-v1/direction-approved-v2.json'],
] as const;
/** Four latest available exact approved masters by decision-entry time, not publication/success. */
export const recentApprovedVisualWorks=(at:string,excludeAssetId:string,root=process.cwd()):RecentApprovedVisualWork[]=>{
 const works:RecentApprovedVisualWork[]=[];
 for(const [id,directionPath] of legacy){
  const path=`content-intelligence/reviews/${id}-master-lock-v1/owner-decision.json`;
  if(!existsSync(join(root,path)))continue;
  const approval=reference(path,root);const d=masterApprovalDecisionSchema.parse(readBoundRecord(approval,root));
  works.push({contentAsset:d.contentAsset,master:{id:`media.${d.artifact.sha256}`,sha256:d.artifact.sha256},approval,creativeDirection:directionPath?reference(directionPath,root):null,enteredAt:d.enteredAt});
 }
 const cycles=join(root,'workflow/cycles');
 if(existsSync(cycles))for(const entry of readdirSync(cycles,{withFileTypes:true}).filter(e=>e.isDirectory())){
  const statePath=join(cycles,entry.name,'state.json');if(!existsSync(statePath))continue;
  const state=z.object({id:z.string(),revision:z.number().int().nonnegative(),masterDecision:recordReferenceSchema.nullable(),candidate:recordReferenceSchema.nullable(),receipts:z.array(z.object({stage:z.string(),record:recordReferenceSchema}).strict())}).passthrough().parse(JSON.parse(readFileSync(statePath,'utf8')));
  if(!state.masterDecision||!state.candidate)continue;
  const candidate=z.object({media:z.object({id:z.string(),sha256:z.string()}),productionPlan:z.object({path:z.string(),sha256:z.string()})}).passthrough().parse(readBoundRecord(state.candidate,root));
  const decision=requireOwnerDecision(state.masterDecision,state.id,'master-review',candidate,root);
  if(decision.decision!=='approve')continue;
  const plan=z.object({contentAsset:z.object({id:z.string(),revision:z.number(),sha256:z.string()})}).passthrough().parse(readBoundRecord(candidate.productionPlan,root));
  // A comparison cannot depend on its own later approval.
  if(decision.enteredAt>at||plan.contentAsset.id===excludeAssetId)continue;
  // Selection uses immutable journal bindings; the V3 controller still performs
  // full semantic replay at its existing gates. A writable stage flag is insufficient.
  let previous:string|undefined;let approvalJournaled=false;
  for(let n=1;n<=state.revision;n++){
   const event=z.object({previousSha256:digest,nextSha256:digest,event:z.object({type:z.string(),record:recordReferenceSchema}).passthrough()}).strict().parse(JSON.parse(readFileSync(join(cycles,entry.name,`event-${n}.json`),'utf8')));
   readBoundRecord(event.event.record,root);
   if(previous&&event.previousSha256!==previous)throw new Error('Recent approved cycle journal chain drift');
   previous=event.nextSha256;
   if(event.event.type==='owner-decision'&&sha256Json(event.event.record)===sha256Json(state.masterDecision))approvalJournaled=true;
  }
  if(!approvalJournaled||previous!==sha256Json(state))throw new Error('Recent approval must bind the independent cycle journal');
  const direction=state.receipts.filter(r=>r.stage==='creative').at(-1)?.record;
  if(!direction)throw new Error('Approved cycle lacks its bound CreativeDirection');
  works.push({contentAsset:plan.contentAsset,master:candidate.media,approval:state.masterDecision,creativeDirection:direction,enteredAt:decision.enteredAt});
 }
 const unique=new Map<string,RecentApprovedVisualWork>();
 for(const w of works.filter(w=>w.enteredAt<=at&&w.contentAsset.id!==excludeAssetId).sort((a,b)=>a.enteredAt.localeCompare(b.enteredAt)||a.master.sha256.localeCompare(b.master.sha256)))unique.set(w.contentAsset.id,w);
 return [...unique.values()].sort((a,b)=>b.enteredAt.localeCompare(a.enteredAt)||a.master.sha256.localeCompare(b.master.sha256)).slice(0,4);
};

export type VisualConvergenceContext={root?:string;registry?:MediaRegistry};
/** Qualitative judgments are accountable inspection records; hashes do not judge art. */
export const validateVisualConvergence=(direction:CreativeDirection,context:VisualConvergenceContext={})=>{
 const root=context.root??process.cwd();
 // Only exact pre-change records retain prior semantics. An edited record gets no exemption.
 if(historicalDirections.some(d=>d.id===direction.id&&d.sha256===sha256Json(direction)))return;
 if(!direction.convergenceReview.portfolioReview)throw new Error('Prospective CreativeDirection requires rendered cross-cycle portfolio review');
 const registry=context.registry??loadMediaRegistry(root);
 const expected=recentApprovedVisualWorks(direction.provenance.enteredAt,direction.contentAsset.id,root);
 const rows=direction.convergenceReview.recentAssets;
 if(rows.length!==expected.length||expected.some(w=>!rows.some(r=>sha256Json(r.contentAsset)===sha256Json(w.contentAsset))))throw new Error('Compare the exact bounded recent approved masters; do not omit inconvenient precedents');
 for(const work of expected){
  const row=rows.find(r=>r.contentAsset.id===work.contentAsset.id)!;const comparison=row.visualComparison;
  if(!comparison)throw new Error('Recent similarity must consider inspected rendered outputs, not documentation labels alone');
  for(const key of ['master','approval','creativeDirection'] as const)if(sha256Json(comparison[key])!==sha256Json(work[key]))throw new Error('Visual comparison is detached from exact approved master/direction');
  registry.resolveFile(comparison.master);
  if(comparison.creativeDirection){const prior=z.object({contentAsset:z.unknown()}).passthrough().parse(readBoundRecord(comparison.creativeDirection,root));if(sha256Json(prior.contentAsset)!==sha256Json(work.contentAsset))throw new Error('Historical direction targets a different asset');}
  const inspection=z.object({works:z.array(z.object({master:z.unknown(),inspectedVisuals:z.array(z.unknown()),findings:z.array(z.string().min(1)).min(1)}).passthrough())}).passthrough().parse(readBoundRecord(comparison.inspectionRecord,root));
  const inspected=inspection.works.find(w=>sha256Json(w.master)===sha256Json(work.master));
  if(!inspected||sha256Json(inspected.inspectedVisuals)!==sha256Json(comparison.inspectedVisuals))throw new Error('Rendered inspection does not bind these exact visual outputs');
  for(const visual of comparison.inspectedVisuals){const artifact=registry.get(visual);if(!/^(image|video)\//.test(artifact.mediaType))throw new Error('Visual inspection requires actual rendered image/video evidence');registry.resolveFile(visual);}
 }
};
