import {writeFileSync,existsSync,mkdirSync} from 'node:fs';
import {ownerPresentationDecisionSchema} from '../src/platform-variants/owner-presentation';
import {phantomTrafficPlatformVariants} from '../src/platform-variants/variants/phantom-traffic';
import {sha256Json} from '../src/content-intelligence/run-schema';
import {validatePhantomTrafficLockedMaster} from '../src/production/phantom-traffic-master-integrity';
const directory='content-intelligence/reviews/phantom-traffic-delivery-v1';
const path=`${directory}/owner-decision.json`;
if(existsSync(path))throw new Error('Preserve recorded owner statement; use a separate revision for additional scope evidence');
const master=validatePhantomTrafficLockedMaster();
const scopes=['youtube-shorts-viewer','tiktok-feed','instagram-reels-playback','instagram-profile-grid','facebook-reels-viewer','facebook-page-feed'];
const decision=ownerPresentationDecisionSchema.parse({schemaVersion:1,id:'owner-decision.phantom-traffic.platform.v1',revision:1,owner:'Ahmet Nishefci',authority:'explicit-owner-message',enteredAt:new Date().toISOString(),timeBasis:'decision-entry',ownerSuppliedReviewTimestamp:null,
 ownerStatement:'I reviewed Phantom Traffic on the relevant real-device presentation surfaces and the presentation looks good.',scopeConfirmation:null,
 master:{artifactId:master.masterArtifactId,path:master.artifact.path,sha256:master.artifact.sha256},reviewedVariants:phantomTrafficPlatformVariants.map(v=>({id:v.id,revision:v.revision,sha256:sha256Json(v)})),
 requestedSurfaces:scopes,confirmedSurfaces:[],cover:{path:'artifacts/covers/phantom-traffic-instagram-cover-v1.png',sha256:'3494907b3759b03146d1f050c17be653e807ba0b5b75abaafa0e87e79e0ccef5',tested:null},
 metadata:{device:null,os:null,appVersion:null,testedAt:null,screenshots:[],cropMeasurements:null},
 limitations:['Owner real-device approval is recorded; the initial statement does not enumerate which distinct surfaces were actually tested. Scope confirmation was requested.','No supplied review timestamp, device/app metadata, screenshots or crop coordinates.','Exact Instagram cover use is unconfirmed. No local model is promoted to measured real-device evidence.'],publicationAuthorized:false});
mkdirSync(directory,{recursive:true});writeFileSync(path,JSON.stringify(decision,null,2)+'\n');
console.log(JSON.stringify({recorded:decision.id,enteredAt:decision.enteredAt,confirmedSurfaces:decision.confirmedSurfaces,publicationAuthorized:false},null,2));
