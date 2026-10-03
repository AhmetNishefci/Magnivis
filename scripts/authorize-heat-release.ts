import {readFileSync,writeFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {openMediaCatalog} from '../src/artifacts/catalog';
import {mediaHash} from '../src/artifacts/media';
import {sha256Json} from '../src/content-intelligence/run-schema';
import {ownerDecisionSchema,readBoundRecord} from '../src/workflow/evidence';
import {inspectCycleRelease,resolveAuthorizedCycleUpload,cycleDeliverySchema} from '../src/workflow/release';
import {loadCycle,persistCycleEvent} from '../src/workflow/store';
import {nextAction} from '../src/workflow/cycle';
const root=process.cwd(),base='content-intelligence/cycles/cycle-6/publication',registry=openMediaCatalog(root);
const read=(p:string)=>JSON.parse(readFileSync(p,'utf8'));
const ref=(path:string)=>({path,sha256:mediaHash(path)});
const put=(name:string,value:unknown)=>{const path=`${base}/${name}.json`;writeFileSync(path,JSON.stringify(value,null,2)+'\n',{flag:'wx'});return ref(path);};
let cycle=loadCycle(root,'cycle.6',registry);
if(cycle.stage!=='publication-review'||!cycle.release||!cycle.candidate)throw new Error('Exact Cycle 6 publication review required');
const release=readBoundRecord(cycle.release),now=new Date().toISOString();
const inspection=inspectCycleRelease(release,registry,now,root);
const risk=read(`${base}/risk-register-v1.json`);
if(risk.targetSha256!==sha256Json(release)||sha256Json(risk.requiredExactPresentationUnknowns)!==sha256Json(inspection.unknowns))throw new Error('Review/risk binding drift');
const instruction=`APPROVE PUBLICATION — Cycle #6.

I approve the exact four-platform release using the locked canonical master:
artifacts/masters/heat-barrier-cycle6-candidate-v4.mp4

I approve the prepared platform copy and cover recommendations for:
- YouTube Shorts
- TikTok
- Instagram Reels
- Facebook Reels

I accept the documented presentation and operational uncertainties, including the absence of real-device verification.

Record publication authorization according to the authoritative V3 workflow.

Do not modify, rerender, re-encode or duplicate the approved master.

Do not create platform-specific video derivatives unless a genuine platform requirement is discovered that makes the canonical master unsafe or unsuitable.

Prepare the final manual-release handoff with:
- exact canonical upload file;
- YouTube title, description, tags, first comment and settings;
- TikTok caption, first comment and settings;
- Instagram caption, first comment and settings;
- Facebook title/caption, first comment and settings;
- exact cover/frame instructions for each platform;
- any AI/synthetic-content disclosure guidance;
- visibility and quality settings;
- post-publication evidence instructions.

Do NOT upload, schedule or publish anything. I will perform all platform actions manually.

After preparing the handoff, Cycle #6 should wait for owner-reported scheduling/publication evidence.

IMPORTANT — do not start Cycle #7.

After Cycle #6 manual release preparation is complete, the next system task will be a separate Magnivis editorial-calibration task before Cycle #7 begins.

Stop after providing:
AHMET — CYCLE #6 MANUAL RELEASE`;
const decision=put('owner-publication-decision-v1',ownerDecisionSchema.parse({schemaVersion:3,id:'owner-decision.cycle-6.publication-v1',revision:1,gate:'publication-review',cycleId:cycle.id,targetSha256:sha256Json(release),decision:'approve',enteredAt:now,suppliedReviewTime:null,reviewer:'Ahmet — owner',evidenceBasis:'explicit-owner-message',instruction,acceptedUnknowns:[...inspection.unknowns,...risk.additionalOperationalUnknowns],scope:ref(`${base}/risk-register-v1.json`)}));
put('owner-publication-decision-reference-v1',decision);
cycle=persistCycleEvent(root,cycle,{type:'owner-decision',record:decision,at:now},registry);
const uploads=resolveAuthorizedCycleUpload(release,decision,registry,root);
put('authorized-media-resolution-v1',uploads);
const bindings=inspection.release.deliveries.map(({variant,manifest})=>{const m=cycleDeliverySchema.parse(readBoundRecord(manifest));return {variantId:variant.id,platform:variant.platform,surface:variant.surface,variantSha256:sha256Json(variant),manifest,metadata:m.metadata,uploadCopy:m.uploadCopy,media:variant.media,artifacts:m.artifacts,readyFor:'owner-manual-release',readinessBasis:'Exact V3 publication authorization with accepted scoped uncertainty; no device pass claimed'};});
put('authorization-bindings-v1',{cycleId:cycle.id,recordedAt:new Date().toISOString(),sourceReviewCommit:execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),release:cycle.release,releaseTargetSha256:sha256Json(release),decision,riskRegister:ref(`${base}/risk-register-v1.json`),scope:'Ahmet manual release on YouTube, TikTok, Instagram and Facebook only. Assistant external platform actions prohibited.',stage:cycle.stage,revision:cycle.revision,nextAction:nextAction(cycle),bindings,acceptedPresentationUnknowns:inspection.unknowns.length,acceptedOperationalUnknowns:risk.additionalOperationalUnknowns.length,mediaCopied:0,mediaRegenerated:0,externalPlatformActionsPerformed:[],publicationEvidence:null,actualScheduling:null,actualPublication:null,analytics:null});
put('publication-evidence-intake-v1',{cycleId:cycle.id,release:cycle.release,publicationDecision:decision,state:'awaiting-owner-evidence',platforms:uploads.map(u=>({platform:u.platform,variantId:u.variantId,authorizedMedia:u.files.find(f=>f.role==='video')!.media,manifestSha256:u.manifestSha256,scheduling:null,publication:null,url:null,postId:null,publishedAt:null,actualSettings:null,firstComment:{posted:null,commentId:null,postedAt:null,pinState:null},presentationObservations:null,analytics:null})),notes:'No PublicationRecord, observation, real-device pass or metric is inferred. Later owner evidence must identify actual platform/URL/ID/time when available; native metrics retain definitions/source/capture time/window.'});
const lines=[
 '# AHMET — CYCLE #6 MANUAL RELEASE','',
 'Exact four-platform release and selected covers authorized by Ahmet. Only Ahmet performs manual uploads. Nothing has been uploaded, scheduled or published by the assistant. URLs, IDs, live settings, presentation observations and analytics remain unknown.','',
 'Upload the same canonical video to all four platforms:','',
 '[heat-barrier-cycle6-candidate-v4.mp4](../../../../artifacts/masters/heat-barrier-cycle6-candidate-v4.mp4)','',
 '`artifacts/masters/heat-barrier-cycle6-candidate-v4.mp4`','',
 'SHA-256: `8ce566dacc0ca2c5a91decd2c2ddd44b6c0c96ad1943076d9496b9600754c040`. 1080×1920, 30 fps, H.264/AAC; 41.920-second MP4. Do not trim, re-encode or change approved narration/captions/audio.','',
 '## Common settings','',
 'Confirm the correct Magnivis destination. Enable highest-quality upload where offered; keep original audio and designed captions. No added music/text, templates, enhancements or audio effects. English where selectable; normal comments; no paid promotion or location. Enable the available AI/synthetic disclosure control for synthetic narration. Owner chooses live reuse/remix/duet/stitch permissions. Optional native/accessibility captions must retain exact words and avoid a second visible caption layer. First comments are prepared, not posted or pinned.','',
 'Choose public visibility or your desired schedule manually. No date/time is set. 20:00 Kosovo local remains a provisional test window. Presentation uncertainty is accepted for this exact release; no extra preview approval gate is introduced. Native UI/crops/account controls remain unverified. If an actual material collision is observed, record it and request remediation; do not alter the locked video.','',
];
for(const platform of ['youtube','tiktok','instagram','facebook']){
 const m=read(`${base}/${platform}/metadata-v1.json`);
 lines.push(`## ${platform==='youtube'?'YouTube Shorts':platform==='tiktok'?'TikTok':platform==='instagram'?'Instagram Reels':'Facebook Reels'}`,'');
 if(platform==='youtube'||platform==='facebook')lines.push(`**Title:** ${m.title}`,'');
 lines.push(`**${platform==='youtube'?'Description':'Caption'}:**`,'',m.description,'');
 if(m.tags.length)lines.push(`**Tags:** ${m.tags.join(', ')}`,'');
 lines.push(`**First comment:** ${m.firstComment}`,'');
 lines.push(`**Cover:** ${platform==='youtube'?'Use [the exact dedicated cover](../../../../artifacts/covers/heat-barrier-cover-v1.png) if the verified-account desktop custom-Short-thumbnail control is available. If the custom control is unavailable, record the actual native cover result; keep the exact master unchanged.':platform==='instagram'?'Use [the exact dedicated cover](../../../../artifacts/covers/heat-barrier-cover-v1.png), SHA-256 `5a4de17033673c43002885423e24186d616f143b5885b6ecab6f7482087447bc`; confirm profile/grid crop. If custom-image selection is unavailable, record the native cover result; do not modify the master.':'Select the opening paradox comparison at 2.0 seconds in the native selector where offered. [Exact local frame reference](../../../../artifacts/qa-evidence/heat-barrier-cycle6-v4/frame-07-2.0s.png); native selected-frame pixels/crop may differ.'}`,'');
 lines.push(`**Settings:** ${platform==='youtube'?'English; Science & Technology if available; general audience / not specifically directed to children. Optional [aligned VTT](../../../../captions/heat-barrier-v4.en.vtt).':platform==='instagram'?'Confirm @magnivis.media; enable highest-quality upload where offered; inspect selected cover crop.':platform==='tiktok'?'Confirm the actual Magnivis account, native cover selector and AI label; choose duet/stitch/reuse controls manually.':'Confirm the actual Magnivis Page/account, title/caption fields and native cover selector; Page/feed and dedicated viewer may differ.'} Apply common settings above.`,'',`[Approved copy source](${platform}/upload-copy-v1.txt) · [Approved metadata/settings](${platform}/metadata-v1.json)`,'');
}
lines.push('## Live checks and evidence','', 'Confirm destination account, cover selection/crop, AI disclosure control, captions/duplication, quality and actual visibility/schedule in the live UI. Prepared recommendations are not already applied settings. You accepted the listed unknowns; no native/device safety claim is made. After scheduling, report which platform, intended release date/time and timezone, and any screenshot if available. Scheduling is not publication. After publication, provide the live URL/post ID and actual public time if known; note chosen cover, visibility, AI disclosure, caption behavior, first-comment posted/pinned state and any observed crop/UI/audio issues. Exact platform-transcoded bytes are not inferred from upload identity. Later analytics need platform-native metric names, values, capture time, reporting window and source screenshot/export; unknowns remain null. Cycle #6 waits for this evidence and is not operationally closed merely by scheduling. Cycle #7 must not start; separate editorial calibration is the next system task, not part of this handoff.','', '[Authorization](owner-publication-decision-v1.json) · [Exact bindings](authorization-bindings-v1.json) · [Authorized upload resolution](authorized-media-resolution-v1.json) · [Awaiting evidence](publication-evidence-intake-v1.json)','', 'AHMET — CYCLE #6 MANUAL RELEASE');
writeFileSync(`${base}/manual-release-v1.md`,lines.join('\n')+'\n',{flag:'wx'});
console.log(JSON.stringify({stage:cycle.stage,revision:cycle.revision,decision,uploads:uploads.map(u=>({platform:u.platform,files:u.files})),acceptedPresentationUnknowns:inspection.unknowns.length}));
