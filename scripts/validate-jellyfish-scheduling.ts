import {matchesJellyfishPreservation} from './lib/jellyfish-research-sanitization';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {mediaHash,loadMediaRegistry} from '../src/artifacts/media';
import {loadCycle} from '../src/workflow/store';
import {readBoundRecord} from '../src/workflow/evidence';
import {cycleReleaseSchema,inspectCycleRelease} from '../src/workflow/release';

const base='content-intelligence/operations/jellyfish-reversal-scheduling-v1';
const read=(path:string)=>JSON.parse(readFileSync(path,'utf8'));
const baseline=read(`${base}/qa/staged-284-audit-v1.json`) as {files:{path:string;sha256:string}[];allowedCloseoutChanges:string[];branch:string;baseHead:string};
for(const file of baseline.files){
 if(!baseline.allowedCloseoutChanges.includes(file.path)&&!matchesJellyfishPreservation(file.path,file.sha256))throw new Error('Protected staged file changed: '+file.path);
}
execFileSync('git',['merge-base','--is-ancestor',baseline.baseHead,'HEAD']);
if(execFileSync('git',['branch','--show-current'],{encoding:'utf8'}).trim()!==baseline.branch)throw new Error('Wrong branch');
const registry=loadMediaRegistry(),cycle=loadCycle(process.cwd(),'cycle.21',registry);
if(cycle.stage!=='publication-review'||cycle.revision!==15||cycle.publicationDecision||!cycle.release)throw new Error('Scheduling must preserve native gate projection');
const index=read(`${base}/scheduling-index-v1.json`);
const report=readBoundRecord(index.report) as Record<string,unknown>;
const records=index.platformRecords.map((ref:{path:string;sha256:string})=>readBoundRecord(ref)) as Record<string,unknown>[];
if(records.map(r=>r.platform).sort().join(',')!=='facebook,instagram,tiktok,youtube')throw new Error('Expected exactly four scheduling records');
for(const record of [index,report,...records]){
 if(record.cycleId!=='cycle.21'||record.state!=='scheduled-owner-reported'||record.statusLabel!=='OWNER-REPORTED SCHEDULED'||record.scheduledFor!=='2026-10-21T20:00:00+02:00'||record.scheduledForUtc!=='2026-10-21T18:00:00Z'||record.scheduledBy!=='owner-manual'||record.publication!=='unknown'||record.independentPlatformVerification!==false||JSON.stringify(record.assistantPlatformActions)!=='[]')throw new Error('Scheduling facts drifted');
 for(const field of ['actualPublicationTime','actualPublicationDate','schedulingActionTime','publicUrl','platformId','actualUploadedBytes','actualSettings','comments','processingResults','deviceQa','analytics'])if(record[field]!==null)throw new Error('Unknown field invented: '+field);
}
const master='artifacts/masters/jellyfish-reversal-cycle21-candidate-v2.mp4';
const expected='f7c2dacd425fc683bd7dca672c4e3c3ab2b93c929d934acaefb50e9664e67c4c';
if(mediaHash(master)!==expected)throw new Error('Approved V2 changed');
const release=cycleReleaseSchema.parse(readBoundRecord(cycle.release)),inspection=inspectCycleRelease(release,registry,new Date().toISOString());
for(const record of records){
 const masterRef=record.intendedMaster as {path:string;sha256:string};
 if(masterRef.path!==master||masterRef.sha256!==expected)throw new Error('Wrong intended master');
 readBoundRecord(record.ownerReport as {path:string;sha256:string});
 readBoundRecord(record.intendedRelease as {path:string;sha256:string});
 readBoundRecord(record.intendedDelivery as {path:string;sha256:string});
 const delivery=release.deliveries.find(d=>d.variant.platform===record.platform);
 if(!delivery||JSON.stringify(record.intendedDelivery)!==JSON.stringify(delivery.manifest)||JSON.stringify(record.intendedVariant)!==JSON.stringify({id:delivery.variant.id,revision:delivery.variant.revision,media:delivery.variant.media}))throw new Error('Scheduling detached from exact package');
}
const project=read('workflow/project-state.json'),entry=project.cycle21SchedulingV1;
for(const ref of [entry.report,entry.index,entry.cycleJournalAddendum])readBoundRecord(ref);
if(mediaHash(entry.gitAuthorization.path)!==entry.gitAuthorization.sha256)throw new Error('Owner instruction changed');
const addendum=readBoundRecord(entry.cycleJournalAddendum) as Record<string,unknown>;
if(entry.state!=='scheduled-owner-reported'||entry.scheduledFor!==index.scheduledFor||entry.scheduledForUtc!==index.scheduledForUtc||entry.nativeRevision!==15||entry.publication!=='unknown'||addendum.nativeJournalUnchanged!==true||addendum.nativeRevision!==15||addendum.publicationDecision!==null||inspection.unknowns.length!==48)throw new Error('Project, addendum or retained uncertainty mismatch');
console.log(JSON.stringify({passed:true,platforms:records.map(r=>r.platform),state:index.state,scheduledFor:index.scheduledFor,scheduledForUtc:index.scheduledForUtc,masterSha256:expected,protectedOriginalStagedFiles:baseline.files.length-baseline.allowedCloseoutChanges.length,securitySanitizationAmendmentApplied:true,nativeStage:cycle.stage,nativeRevision:cycle.revision,nativeJournalUnchanged:true,presentationUnknownsRetained:inspection.unknowns.length,publication:'unknown',assistantPlatformActions:[]},null,2));
