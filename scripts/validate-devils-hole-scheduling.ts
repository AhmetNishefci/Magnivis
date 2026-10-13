import {readFileSync} from 'node:fs';
import {mediaHash,loadMediaRegistry} from '../src/artifacts/media';
import {loadCycle} from '../src/workflow/store';
import {readBoundRecord} from '../src/workflow/evidence';
import {inspectCycleRelease} from '../src/workflow/release';
const base='content-intelligence/operations/devils-hole-scheduling-v1';
const read=(p:string)=>JSON.parse(readFileSync(p,'utf8'));
const baseline=read(`${base}/preservation-baseline.json`) as {files:{path:string;sha256:string}[];allowedChanges:string[]};
for(const f of baseline.files)if(!baseline.allowedChanges.includes(f.path)&&mediaHash(f.path)!==f.sha256)throw new Error('Protected production/history/unrelated file changed: '+f.path);
const registry=loadMediaRegistry(),cycle=loadCycle(process.cwd(),'cycle.13',registry),index=read(`${base}/scheduling-index-v1.json`);
if(cycle.stage!=='publication-review'||cycle.revision!==17||cycle.publicationDecision||!cycle.release)throw new Error('Scheduling must not forge release/device approval or closure');
const report=readBoundRecord(index.report) as {state:string;scheduledDate:string;scheduledBy:string;publication:string;independentPlatformVerification:boolean;intendedMaster:{path:string;sha256:string};existingPreparedRelease:unknown};
if(report.state!=='scheduled-owner-reported'||report.scheduledDate!=='2026-10-13'||report.scheduledBy!=='owner-manual'||report.publication!=='unknown'||report.independentPlatformVerification)throw new Error('Owner-report facts or evidence basis mismatch');
const master='artifacts/masters/devils-hole-cycle13-candidate-v2.mp4',hash='03a008634795659bd0ed51cf61d16381e7e24c3050184cbb375477cf963feb92';
if(report.intendedMaster.path!==master||report.intendedMaster.sha256!==hash||mediaHash(master)!==hash)throw new Error('Approved V2 identity mismatch');
const inspection=inspectCycleRelease(readBoundRecord(cycle.release),registry,new Date().toISOString());
const records=index.platformRecords.map((ref:{path:string;sha256:string})=>readBoundRecord(ref)) as Record<string,unknown>[];
if(records.map(r=>r.platform).sort().join(',')!=='facebook,instagram,tiktok,youtube')throw new Error('Expected exactly four scheduling records');
for(const r of records){
 if(r.scheduledDate!=='2026-10-13'||r.state!=='scheduled-owner-reported'||r.scheduledBy!=='owner-manual'||r.publication!=='unknown'||r.independentPlatformVerification!==false)throw new Error('Per-platform state drift');
 for(const field of ['actualPublicationTime','actualPublicationDate','scheduledFor','schedulingTimeZone','schedulingActionTime','publicUrl','platformId','actualUploadedBytes','processingResults','actualSettings','comments','presentationObservations','deviceQa','analytics'])if(r[field]!==null)throw new Error('Missing information fabricated: '+field);
}
const project=read('workflow/project-state.json');if(project.cycle13Presentation.externalState!=='scheduled-owner-reported'||project.cycle14Hold.state!=='not-authorized')throw new Error('Current Operations routing or Cycle14 hold missing');
console.log(JSON.stringify({passed:true,status:'OWNER-REPORTED SCHEDULED',scheduledDate:'2026-10-13',platforms:records.map(r=>r.platform),masterPath:master,masterSha256:hash,protectedFilesChecked:baseline.files.length-baseline.allowedChanges.length,nativeStage:cycle.stage,nativeRevision:cycle.revision,nativeJournalUnchanged:true,presentationUnknownsRetained:inspection.unknowns.length,publication:'unknown',independentPlatformVerification:false,publicationRecordCreated:false,newMedia:0,strategyWorkPerformed:false,cycle14Started:false,assistantPlatformActions:[]},null,2));
