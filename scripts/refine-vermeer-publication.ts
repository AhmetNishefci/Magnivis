import {readFileSync,writeFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {loadMediaRegistry,mediaHash} from '../src/artifacts/media';
import {sha256Json} from '../src/content-intelligence/run-schema';
import {ownerDecisionSchema,readBoundRecord} from '../src/workflow/evidence';
import {loadCycle,persistCycleEvent,loadProjectCycles} from '../src/workflow/store';
import {cycleDeliverySchema,cycleReleaseSchema,inspectCycleRelease} from '../src/workflow/release';
import {ownerHandoff} from '../src/workflow/handoff';
const base='content-intelligence/cycles/cycle-11/publication',root=process.cwd(),registry=loadMediaRegistry(),now=new Date().toISOString();
const read=(p:string)=>JSON.parse(readFileSync(p,'utf8'));
const ref=(path:string)=>({path,sha256:mediaHash(path)});
const put=(name:string,data:unknown)=>{const path=`${base}/${name}.json`;writeFileSync(path,JSON.stringify(data,null,2)+'\n',{flag:'wx'});return ref(path);};
let cycle=loadCycle(root,'cycle.11',registry);
if(cycle.stage!=='publication-review'||cycle.revision!==17||!cycle.release||cycle.publicationDecision)throw new Error('Expected pending release V1');
const previous=cycle.release,release=cycleReleaseSchema.parse(readBoundRecord(previous));
const instruction=`MAGNIVIS — CYCLE #11 PUBLICATION REVIEW

I approve the Cycle #11 V2 publication content and selected covers, subject to final native-platform QA.

Before finalizing the handoff:

1. Prepare distinct, concise, engaging first comments for YouTube Shorts, TikTok, Instagram Reels, and Facebook Reels. Each should encourage genuine curiosity or add meaningful context without repeating the caption unnecessarily. Preserve factual accuracy.

2. Retain the existing account-level remix, Duet, Stitch, reuse, and download policies rather than automatically disabling them. Report any platform-specific exceptions requiring my decision.

3. Preserve the approved V2 master, narration, captions, titles, descriptions, hashtags, source attribution, and selected covers.

4. Update only the affected publication-package values and validate them.

5. Keep the permanent production lessons already recorded. Do not add redundant guidance.

6. Present the final copy-ready publication handoff, including all four first comments and the confirmed or pending platform settings.

Do not upload, schedule, or publish anything automatically.

Stop at AHMET — PUBLICATION REVIEW / AUTHORIZATION.

Await my explicit authorization.`;
const decision=put('owner-publication-refinement-v1',ownerDecisionSchema.parse({schemaVersion:3,id:'owner-decision.cycle-11.publication-refinement-v1',revision:1,gate:'publication-review',cycleId:cycle.id,targetSha256:sha256Json(release),decision:'revise',enteredAt:now,suppliedReviewTime:null,reviewer:'Ahmet — owner',evidenceBasis:'explicit-owner-message',instruction,reason:'Existing revise transition implements requested package refinement; owner conditionally accepts existing content/covers, not final release authorization or native QA acceptance.',acceptedUnknowns:[]}));
put('conditional-content-cover-acceptance-v1',{cycleId:cycle.id,previousRelease:previous,ownerInstruction:decision,approvedContent:'Existing V2 master, narration/captions, titles/descriptions/hashtags/tags/source attribution and selected covers; frozen identities retained',condition:'subject to final native-platform QA',firstComments:'New four distinct comments requested; pending final owner review',accountPolicies:'Retain actual existing account policies; values unverified, no disable defaults',publicationAuthorized:false,nativeDeviceEvidence:'not-tested; no new evidence supplied'});
cycle=persistCycleEvent(root,cycle,{type:'owner-decision',record:decision,at:now},registry);
const start=put('presentation-refinement-start-v1',{cycleId:cycle.id,stage:'presentation',action:'Only revise first comments and account-policy retention instructions; preserve content/cover/media/profile evidence. Return to publication review without external actions.'});
cycle=persistCycleEvent(root,cycle,{type:'begin-internal',stage:'presentation',record:start,at:new Date().toISOString()},registry);
const comments={youtube:'An old canvas can be genuine while the paint above it is modern. Which layer would you examine first?',tiktok:'The cracks looked old. The paint told a different story. What would you test first?',instagram:'The image stayed the same; its attribution changed. What makes a masterpiece: the painting, the artist, or the evidence?',facebook:'His confession was also an admission of deception. Does proving a painting false change how you judge the person who sold it?'};
if(new Set(Object.values(comments)).size!==4||comments.tiktok.length>150)throw new Error('Comment variety/conservative TikTok envelope failed');
const unchangedFields=['title','titleSupport','description','hashtags','tags','keywords','keywordFieldSupport','language','cover','captions','claimIds','knowledgePackage','contentAsset','masterDecision','sources','media'];
const checks:unknown[]=[];
for(const entry of release.deliveries){
 const platform=entry.variant.platform,oldManifest=cycleDeliverySchema.parse(readBoundRecord(entry.manifest)),old=readBoundRecord(oldManifest.metadata) as {variantId:string;firstComment:string;operatorSettings:Record<string,string>&{reuse:string;reuseControls:string};[key:string]:unknown},metadata=structuredClone(old);
 metadata.variantId=`vermeer-forgery.variant.${platform}.v2`;
 metadata.firstComment=comments[platform];
 metadata.operatorSettings.reuse='Owner instruction: retain existing account-level remix, Duet, Stitch, reuse and download policies. Confirm actual current values in live account; no post-level disable override or account-wide change.';
 metadata.operatorSettings.reuseControls=platform==='youtube'?'Preserve current channel Shorts remix/reuse policy; confirm live values. Standard YouTube License; embedding allowed; subscriber notifications on':platform==='tiktok'?'Preserve current account Duet, Stitch, reuse and download policies; confirm live values; no automatic disable override':platform==='instagram'?'Preserve current account remix/reuse/download policies; confirm live values; show on profile/feed; automatic Facebook sharing Off':'Preserve current Page/account remix/reuse/download policies; confirm live values; independent Page Reel, no automatic Instagram cross-post';
 for(const field of unchangedFields)if(sha256Json(metadata[field])!==sha256Json(old[field]))throw new Error('Approved value drift: '+field);
 const mref=put(`${platform}/metadata-v2`,metadata);
 const copyPath=`${base}/${platform}/upload-copy-v2.txt`;
 let text=readFileSync(oldManifest.uploadCopy.path,'utf8').replace(old.firstComment,metadata.firstComment);
 for(const key of ['reuse','reuseControls'])text=text.replace(JSON.stringify(old.operatorSettings[key]),JSON.stringify(metadata.operatorSettings[key]));
 if(!text.includes(metadata.firstComment)||text.includes(old.operatorSettings.reuse)||text.includes(old.operatorSettings.reuseControls))throw new Error('Operator copy drift');
 writeFileSync(copyPath,text,{flag:'wx'});
 entry.variant={...entry.variant,id:metadata.variantId,revision:2};
 entry.manifest=put(`${platform}/manifest-v2`,cycleDeliverySchema.parse({...oldManifest,id:`delivery.cycle-11.${platform}.v2`,variantSha256:sha256Json(entry.variant),metadata:mref,uploadCopy:ref(copyPath)}));
 checks.push({platform,firstComment:metadata.firstComment,commentCharacters:metadata.firstComment.length,approvedFieldsUnchanged:unchangedFields,geometryAndSelectedMediaUnchanged:true,operatorChanges:['reuse','reuseControls'],accountPolicyValues:'unknown pending live confirmation',exceptionsRequiringDecision:[]});
}
const inspection=inspectCycleRelease(release,registry,new Date().toISOString(),root),current=put('release-v2',release);
const risks=read(`${base}/risk-register-v1.json`);risks.release=current;risks.targetSha256=sha256Json(release);risks.inspectionTime=new Date().toISOString();risks.requiredExactPresentationUnknowns=inspection.unknowns;
put('risk-register-v2',risks);
cycle=persistCycleEvent(root,cycle,{type:'complete-internal',stage:'presentation',record:current,at:new Date().toISOString()},registry);
put('controller-handoff-v2',ownerHandoff(cycle,registry,root));
const baseline='75db37e10751617fc2a38ec36399a007c40a16b6',tracked=execFileSync('git',['ls-tree','-r','--name-only',baseline],{encoding:'utf8'}).trim().split('\n');
const changes=new Set(execFileSync('git',['diff','--name-only',baseline,'--'],{encoding:'utf8'}).trim().split('\n'));
for(const p of tracked.filter(p=>p!=='workflow/cycles/cycle.11/state.json'))if(changes.has(p))throw new Error('Prior tracked artifact changed: '+p);
if(mediaHash('artifacts/masters/vermeer-forgery-cycle11-candidate-v2.mp4')!=='f6d6da416f45aef07d7ac61eac232eadce5a854b9cd97094162849a70ee98df8')throw new Error('Approved master drift');
put('package-refinement-validation-v1',{checkedAt:new Date().toISOString(),passed:true,baselineCommit:baseline,previousRelease:previous,currentRelease:current,reviewTargetSha256:sha256Json(release),ownerInstruction:decision,checks,priorTrackedFilesPreserved:tracked.length-1,mediaCatalogUnchanged:true,masterUnchanged:true,permanentGuidanceUnchanged:true,unknownCount:inspection.unknowns.length,knownCollisions:[],workflowReplay:loadProjectCycles(root,registry).map(c=>({id:c.id,revision:c.revision,stage:c.stage})),projectMetadataReconciliation:'project-state.json cycle11/nextOwnerGate text remains a historical master-review revision14 summary. Per canonical WORKFLOW-V3, current authority is the replayed cycle11 journal: publication-review revision20. No historical metadata rewritten in this package-only refinement.',nativeQa:'pending; no upload/device evidence supplied',publicationAuthorized:false,externalActions:[]});
console.log(JSON.stringify({stage:cycle.stage,revision:cycle.revision,currentRelease:current,target:sha256Json(release),unknowns:inspection.unknowns.length,comments},null,2));
