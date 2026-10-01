import {existsSync,writeFileSync,readFileSync} from 'node:fs';
import {phantomTrafficPublicationRecords,phantomTrafficLivePresentation,phantomTrafficClosureDecision as decision} from '../src/operations/phantom-traffic';
import {sha256Json} from '../src/content-intelligence/run-schema';
const dir='content-intelligence/reviews/phantom-traffic-closure-v1';
if(existsSync(`${dir}/publication-records.json`))throw new Error('Use a new immutable closure revision');
for(const [name,data] of [['publication-records.json',phantomTrafficPublicationRecords],['owner-live-presentation.json',phantomTrafficLivePresentation]])writeFileSync(`${dir}/${name}`,JSON.stringify(data,null,2)+'\n');
const previous=JSON.parse(readFileSync('content-intelligence/reviews/phantom-traffic-publication-v1/post-publication-review.json','utf8'));
writeFileSync(`${dir}/post-publication-review.json`,JSON.stringify({schemaVersion:1,state:'OWNER_REPORTED_POST_PUBLICATION_APPROVED',previousStage:'content-intelligence/reviews/phantom-traffic-publication-v1/post-publication-review.json',decision:{id:decision.id,revision:decision.revision,sha256:sha256Json(decision)},publicationOccurred:'owner-reported',platformContextScope:decision.presentationScope,measuredQaGranted:false,previousSurfaces:previous.surfaces.map((s:{surface:string})=>({...s,ownerPlatformLevelApproval:'reported-desktop-and-mobile-where-applicable',individualSurfaceEvidence:'not-separately-enumerated',measuredState:'NOT_TESTED'})),remainingEvidenceGaps:decision.limitations,operationalCycleState:'COMPLETE',closureBlocked:false},null,2)+'\n');
console.log(JSON.stringify({publications:4,ownerLivePresentationRecords:4,cycle:'COMPLETE',tiktokPublicPermalink:null}));
