import {mkdirSync,readFileSync,writeFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {mediaHash,loadMediaRegistry} from '../src/artifacts/media';
import {loadCycle} from '../src/workflow/store';
import {readBoundRecord} from '../src/workflow/evidence';
import {cycleReleaseSchema,cycleDeliverySchema,inspectCycleRelease} from '../src/workflow/release';
const root=process.cwd(),base='content-intelligence/operations/vermeer-forgery-scheduling-v1',registry=loadMediaRegistry(),cycle=loadCycle(root,'cycle.11',registry),now=new Date().toISOString();
if(cycle.stage!=='publication-review'||cycle.revision!==20||!cycle.release||cycle.publicationDecision)throw new Error('Unexpected Cycle11 checkpoint');
const release=cycleReleaseSchema.parse(readBoundRecord(cycle.release));const inspection=inspectCycleRelease(release,registry,now,root);
const masterPath='artifacts/masters/vermeer-forgery-cycle11-candidate-v2.mp4',masterHash='f6d6da416f45aef07d7ac61eac232eadce5a854b9cd97094162849a70ee98df8';if(mediaHash(masterPath)!==masterHash)throw new Error('Intended approved master changed');
mkdirSync(base,{recursive:true});
const ref=(path:string)=>({path,sha256:mediaHash(path)});
const put=(name:string,data:unknown)=>{const path=`${base}/${name}.json`;writeFileSync(path,JSON.stringify(data,null,2)+'\n',{flag:'wx'});return ref(path);};
const instruction=`MAGNIVIS — CYCLE #11 SCHEDULING CONFIRMATION

OWNER UPDATE:

I have manually scheduled Cycle #11 (Han van Meegeren / Vermeer Forgery) on all four platforms:

- YouTube Shorts
- TikTok
- Instagram Reels
- Facebook Reels

Record this owner-reported scheduling status in the existing Magnivis operations and publication registry.

Use the validated Cycle #11 V2 publication packages and approved master as the intended release artifacts.

Do not invent publication dates, exact times, URLs, platform post IDs, analytics, or native-device QA evidence. Any information I have not supplied must remain explicitly unknown or pending.

Preserve the distinction between owner-reported scheduling and independently verified publication.

Do not change the approved master or publication packages.

Run the appropriate validation checks, preserve repository integrity, and back up the resulting state.

Then prepare for our first cross-platform analytics review.

Do not start Cycle #12 discovery yet, and do not assume analytics are available until I provide them.

Stop and report the updated project state and the information needed for the analytics review.`;
const unknowns={actualPublicationTime:null,actualPublicationDate:null,scheduledFor:null,schedulingTimeZone:null,schedulingActionTime:null,publicUrl:null,platformId:null,actualUploadedBytes:null,processingResults:null,actualSettings:null,comments:null,presentationObservations:null,deviceQa:null,analytics:null};
const report=put('owner-report',{schemaVersion:3,cycleId:cycle.id,evidenceBasis:'explicit-owner-message',recordedAt:now,recordedAtBasis:'Record-entry time only; no scheduling-action, scheduled release or actual publication date/time supplied.',instruction,platforms:release.deliveries.map(d=>d.variant.platform),state:'scheduled-owner-reported',publication:'unknown',independentPlatformVerification:false,...unknowns,intendedMaster:{path:masterPath,media:release.deliveries[0]!.variant.media,sha256:masterHash},existingPreparedRelease:cycle.release,existingPublicationDecision:cycle.publicationDecision,masterApproval:cycle.masterDecision,conditionalContentCoverAcceptance:ref('content-intelligence/cycles/cycle-11/publication/conditional-content-cover-acceptance-v1.json'),nativeWorkflow:{stage:cycle.stage,revision:cycle.revision,unchanged:true},limitations:['Owner scheduling report only, not independently verified publication.','Validated release V2 and approved master are intended artifacts; actual uploaded bytes, cover selection, applied settings and posted comments unverified.','No native QA completion, exact-release authorization or acceptance of presentation uncertainty inferred from scheduling.','Publication status is unknown, not an invented claim that it remains unpublished.'],nativeRecordReconciliation:'Existing operations owner-report/per-platform scheduling evidence pattern retained. Typed PublicationRecord cannot represent scheduling and requires actual publication identity/evidence. Native authorized-release observations require a persisted exact publication decision; none supplied. Preserve cycle11 journal and register this owner report separately rather than fabricate approval, QA or publication.'});
const records=release.deliveries.map(d=>{
 const manifest=cycleDeliverySchema.parse(readBoundRecord(d.manifest));
 return put(d.variant.platform,{cycleId:cycle.id,platform:d.variant.platform,state:'scheduled-owner-reported',publication:'unknown',evidenceBasis:'explicit-owner-message',ownerReport:report,recordedAt:now,actualEventTime:null,...unknowns,independentPlatformVerification:false,intendedRelease:cycle.release,intendedVariant:{id:d.variant.id,revision:d.variant.revision,media:d.variant.media},intendedDelivery:d.manifest,intendedArtifacts:manifest.artifacts,identityBasis:'owner-designated validated packages and approved master as intended release, not independently verified uploaded bytes'});
});
const index=put('scheduling-index-v1',{cycleId:cycle.id,recordedAt:now,state:'scheduled-owner-reported',report,platformRecords:records,intendedRelease:cycle.release,publication:'unknown',analytics:'not-supplied',nativeJournalUnchanged:true,assistantPlatformActions:[]});
const statePath='workflow/project-state.json',state=JSON.parse(readFileSync(statePath,'utf8'));
state.cycle11='Scheduled-owner-reported on YouTube Shorts, TikTok, Instagram Reels and Facebook Reels. Evidence '+report.path+'. Intended approved V2 f6d6da416f45aef07d7ac61eac232eadce5a854b9cd97094162849a70ee98df8 and validated release-v2/packages unchanged; actual uploaded bytes, publication, dates/times/timezone/URLs/IDs/settings/comments/native QA/analytics unknown. Native journal remains publication-review revision20; scheduling report does not forge exact-release authorization, QA completion or publication. Owner content/cover acceptance subject to final native QA retained.';
state.nextOwnerGate='No new production authorized. Cycle11 owner-reported scheduled on all four; native publication-review revision20 retained pending exact release authority/QA evidence. Next requested work is first cross-platform analytics review once owner provides available published-post evidence and native metrics.';
state.nextSystemTask='Await owner publication evidence and raw native analytics for first cross-platform review; prepare intake without fabricating metrics. Cycle11 scheduling evidence indexed separately from strict journal. No Cycle12 discovery, master/package changes, assistant platform actions or main merge.';
state.externalActions=state.externalActions+' New Cycle11 update: owner reports manual scheduling on all four; actual publication and event metadata unknown; no assistant platform action.';
state.cycle11SchedulingEvidence=index;writeFileSync(statePath,JSON.stringify(state,null,2).replace(/[\u0080-\uffff]/g,c=>'\\u'+c.charCodeAt(0).toString(16).padStart(4,'0'))+'\n');
writeFileSync('docs/OPERATIONS.md',readFileSync('docs/OPERATIONS.md','utf8')+`\n## Cycle #11 scheduling report — recorded ${now.slice(0,10)}\n\nOwner reports manual scheduling on YouTube Shorts, TikTok, Instagram Reels and Facebook Reels. [Scheduling index](../${index.path}) binds four append-only records to the intended approved V2 master and validated release-v2 packages. The date above is record-entry date, not a scheduled or publication date. Publication, scheduling-action/release dates/times/timezone, URLs/IDs, actual uploaded bytes, settings/comments, processing, native-device QA and analytics remain unknown. No assistant platform action.\n\nThe journal remains publication-review revision20; earlier content/cover acceptance was conditional on final native QA, and scheduling does not supply that QA or retrospective exact-release authorization. Existing typed publication registry cannot honestly contain a completed PublicationRecord from this report. Operational scheduling is recorded using the existing owner-report pattern, separately from strict journal/publication gates. Stale project metadata describing master-review revision14 is corrected; historical master/package/journal evidence remains unchanged. [Analytics intake](../${base}/analytics-review-intake-v1.md) prepares the first cross-platform review without new metric snapshots. No Cycle12 or main merge.\n`);
put('recording-validation-v1',{checkedAt:now,passed:true,baselineCommit:execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),cycleId:cycle.id,ownerReport:report,index,platformRecords:records,intendedMasterUnchanged:true,exactReleaseInspected:cycle.release,presentationUnknownsRetained:inspection.unknowns.length,workflowStateUnchanged:ref('workflow/cycles/cycle.11/state.json'),typedPublicationRecordCreated:false,newMetricSnapshots:0,externalPlatformActions:[],cycle12Started:false});
console.log(JSON.stringify({state:'scheduled-owner-reported',platforms:records.length,index,nativeStage:cycle.stage,nativeRevision:cycle.revision,publication:'unknown',analytics:'not-supplied'},null,2));
