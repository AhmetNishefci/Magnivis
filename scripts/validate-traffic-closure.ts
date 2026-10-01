import {validateCanonicalNarratorAmendment} from './primary-narrator-authority-integrity';
import {readFileSync,existsSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {sha256Json} from '../src/content-intelligence/run-schema';
import {fileSha256} from '../src/production/phantom-traffic-integrity';
import {phantomTrafficClosureDecision as d,phantomTrafficPublicationRecords as records,phantomTrafficLivePresentation as qa} from '../src/operations/phantom-traffic';
import {publicationRegistry} from '../src/operations/registry';
import {validateDeliveryPackage} from './delivery-packages';
import {validatePhantomTrafficLockedMaster} from '../src/production/phantom-traffic-master-integrity';
import {parseManifests} from '../src/artifacts/schema';
const dir='content-intelligence/reviews/phantom-traffic-closure-v1';
if(d.owner!=='Ahmet Nishefci'||d.authority!=='explicit-owner-message'||d.timeBasis!=='decision-entry'||d.ownerSuppliedReviewTimestamp!==null||d.publishedAt!==null||d.publishedOn!=='2026-10-01'||d.operationalCycleState!=='COMPLETE'||d.cycle2Started||d.assistantUploaded)throw new Error('Invalid owner closure scope');
for(const reference of [d.master,d.publicationAuthorization,d.finalDeliveries])if(fileSha256(reference.path)!==reference.sha256)throw new Error('Stale closure evidence');
for(const [name,data] of [['publication-records.json',records],['owner-live-presentation.json',qa]])if(sha256Json(JSON.parse(readFileSync(`${dir}/${name}`,'utf8')))!==sha256Json(data))throw new Error('Stale closure snapshot');
const bindings=JSON.parse(readFileSync(d.finalDeliveries.path,'utf8'));
for(const r of records){
 publicationRegistry.get(r.id);const entry=bindings.packages.find((p:{platform:string})=>p.platform===r.platform);
 const manifest=validateDeliveryPackage(entry.directory);
 if(r.source.delivery.manifestSha256!==fileSha256(`${entry.directory}/manifest.json`)||r.source.delivery.id!==manifest.deliveryId||r.source.videoSha256!==d.master.sha256)throw new Error('Publication/delivery identity mismatch');
 if(r.ownerReport?.decision.sha256!==sha256Json(d)||r.firstComment?.decision.sha256!==sha256Json(d))throw new Error('Publication/comment evidence mismatch');
}
const t=records.find(r=>r.platform==='tiktok')!;if(t.remote||t.ownerReport?.missingPublicPermalink!==true)throw new Error('Invented TikTok permalink');
const before=parseManifests(JSON.parse(execFileSync('git',['show','577f9fe39045bd54bd37a49c7d5d81b69becf8fd:artifacts/manifests.json'],{encoding:'utf8'}))),after=parseManifests(JSON.parse(readFileSync('artifacts/manifests.json','utf8')));
for(const m of before)if(sha256Json(after.find(a=>a.artifactId===m.artifactId))!==sha256Json(m))throw new Error('Historical manifest rewritten');
for(const path of ['docs/CREATIVE-DIRECTION.md','AGENTS.md','artifacts/presentation-profiles.json','artifacts/presentation-qa.json','artifacts/cover-assets.json','artifacts/recovery-decision.json','artifacts/owner-evidence.json']){
 if(!existsSync(path))continue;const old=execFileSync('git',['show',`577f9fe39045bd54bd37a49c7d5d81b69becf8fd:${path}`]);if(!old.equals(readFileSync(path))){
  if(path==='AGENTS.md'||path==='docs/CREATIVE-DIRECTION.md')validateCanonicalNarratorAmendment(path,old,readFileSync(path));
  else throw new Error(`Historical authority/evidence modified: ${path}`);
 }
}
const guide=readFileSync('AGENTS.md','utf8');for(const route of guide.matchAll(/`((?:docs|recovery-audit)\/[^`]+\.md)`/g))if(!existsSync(route[1]!))throw new Error('Missing canonical route');
console.log(JSON.stringify({passed:true,cycle1:'OPERATIONALLY_COMPLETE',publications:records.map(r=>({id:r.id,state:r.state,remote:r.remote??null,publishedOn:r.publishedOn})),ownerPostPublicationQaPlatforms:qa.length,measuredPassesAdded:0,commentsOwnerReported:4,tiktokPermalinkGap:true,historicalArtifactRecordsPreserved:before.length,adaptiveCreativeDirectionIntact:true,lockedMaster:validatePhantomTrafficLockedMaster().artifact,nextGate:d.nextGate},null,2));
