import {readFileSync,writeFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {openMediaCatalog} from '../src/artifacts/catalog';
import {mediaHash} from '../src/artifacts/media';
import {sha256Json} from '../src/content-intelligence/run-schema';
import {ownerDecisionSchema,readBoundRecord} from '../src/workflow/evidence';
import {inspectCycleRelease,resolveAuthorizedCycleUpload,cycleDeliverySchema} from '../src/workflow/release';
import {loadCycle,persistCycleEvent} from '../src/workflow/store';
import {nextAction} from '../src/workflow/cycle';
const root=process.cwd(),base='content-intelligence/cycles/cycle-5/publication',registry=openMediaCatalog(root);
const read=(p:string)=>JSON.parse(readFileSync(p,'utf8'));
const ref=(path:string)=>({path,sha256:mediaHash(path)});
const put=(name:string,value:unknown)=>{const path=`${base}/${name}.json`;writeFileSync(path,JSON.stringify(value,null,2)+'\n',{flag:'wx'});return ref(path);};
let cycle=loadCycle(root,'cycle.5',registry);
if(cycle.stage!=='publication-review'||!cycle.release||!cycle.candidate)throw new Error('Exact Cycle 5 publication review required');
const release=readBoundRecord(cycle.release),now=new Date().toISOString();
const inspection=inspectCycleRelease(release,registry,now,root);
const risk=read(`${base}/risk-register-v1.json`);
if(risk.targetSha256!==sha256Json(release)||sha256Json(risk.requiredExactPresentationUnknowns)!==sha256Json(inspection.unknowns))throw new Error('Review/risk binding drift');
const instruction=`APPROVE the exact four-platform release and selected covers, accepting the listed presentation and operational uncertainties.

Record my Cycle #5 publication authorization under the authoritative V3 workflow.

Preserve the approved master exactly. Do not rerender, re-encode, modify, or duplicate identical media unnecessarily.

Finalize the manual-release handoff for YouTube Shorts, TikTok, Instagram Reels, and Facebook Reels using the already prepared platform copy, covers/frame references, settings, and exact canonical media.

Do not upload, schedule, publish, or claim publication on my behalf.

Keep actual publication evidence, URLs, IDs, presentation observations, and analytics unknown until I provide them.

Commit and push the completed Cycle #5 authorization state if repository permissions allow.

Return a concise manual-release summary containing:
- exact video file to upload;
- YouTube title, description, tags, cover/thumbnail guidance, settings, and first comment;
- TikTok caption, cover guidance, settings, and first comment;
- Instagram caption, exact cover, settings, and first comment;
- Facebook title/caption, cover guidance, settings, and first comment;
- any live setting I need to verify manually;
- final Git state.

Make this practical for manual uploading. Do not repeat internal architecture details unless they affect what I need to do.

End with exactly:

AHMET — CYCLE #5 MANUAL RELEASE`;
const decision=put('owner-publication-decision-v1',ownerDecisionSchema.parse({schemaVersion:3,id:'owner-decision.cycle-5.publication-v1',revision:1,gate:'publication-review',cycleId:cycle.id,targetSha256:sha256Json(release),decision:'approve',enteredAt:now,suppliedReviewTime:null,reviewer:'Ahmet — owner',evidenceBasis:'explicit-owner-message',instruction,acceptedUnknowns:[...inspection.unknowns,...risk.additionalOperationalUnknowns],scope:ref(`${base}/risk-register-v1.json`)}));
put('owner-publication-decision-reference-v1',decision);
cycle=persistCycleEvent(root,cycle,{type:'owner-decision',record:decision,at:now},registry);
const uploads=resolveAuthorizedCycleUpload(release,decision,registry,root);
put('authorized-media-resolution-v1',uploads);
const bindings=inspection.release.deliveries.map(({variant,manifest})=>{const m=cycleDeliverySchema.parse(readBoundRecord(manifest));return {variantId:variant.id,platform:variant.platform,surface:variant.surface,variantSha256:sha256Json(variant),manifest,metadata:m.metadata,uploadCopy:m.uploadCopy,media:variant.media,artifacts:m.artifacts,readyFor:'owner-manual-release',readinessBasis:'Exact V3 publication authorization with accepted scoped uncertainty; no device pass claimed'};});
put('authorization-bindings-v1',{cycleId:cycle.id,recordedAt:new Date().toISOString(),sourceReviewCommit:execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),release:cycle.release,releaseTargetSha256:sha256Json(release),decision,riskRegister:ref(`${base}/risk-register-v1.json`),scope:'Ahmet manual release on YouTube, TikTok, Instagram and Facebook only. Assistant external platform actions prohibited.',stage:cycle.stage,revision:cycle.revision,nextAction:nextAction(cycle),bindings,acceptedPresentationUnknowns:inspection.unknowns.length,acceptedOperationalUnknowns:risk.additionalOperationalUnknowns.length,mediaCopied:0,mediaRegenerated:0,externalPlatformActionsPerformed:[],publicationEvidence:null,actualScheduling:null,actualPublication:null,analytics:null});
put('publication-evidence-intake-v1',{cycleId:cycle.id,release:cycle.release,publicationDecision:decision,state:'awaiting-owner-evidence',platforms:uploads.map(u=>({platform:u.platform,variantId:u.variantId,authorizedMedia:u.files.find(f=>f.role==='video')!.media,manifestSha256:u.manifestSha256,scheduling:null,publication:null,url:null,postId:null,publishedAt:null,actualSettings:null,firstComment:{posted:null,commentId:null,postedAt:null,pinState:null},presentationObservations:null,analytics:null})),notes:'No PublicationRecord, observation, real-device pass or metric is inferred. Later owner evidence must identify actual platform/URL/ID/time when available; native metrics retain definitions/source/capture time/window.'});
const lines=[
 '# AHMET — CYCLE #5 MANUAL RELEASE','',
 'Exact four-platform release and selected covers authorized by Ahmet. Only Ahmet performs manual uploads. Nothing has been uploaded, scheduled or published by the assistant. URLs, IDs, live settings, presentation observations and analytics remain unknown.','',
 'Upload the same canonical video to all four platforms:','',
 '[chladni-sand-candidate-v1.mp4](../../../../artifacts/masters/chladni-sand-candidate-v1.mp4)','',
 '`artifacts/masters/chladni-sand-candidate-v1.mp4`','',
 'SHA-256: `76fb050dd348c307b07489cf62de3cab59adcd6dfc3eb5b983bc30b584a5c3df`. 1080×1920, 30 fps, H.264/AAC; 42.496-second MP4. Do not trim, re-encode or change approved narration/captions/audio.','',
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
 lines.push(`**Cover:** ${platform==='youtube'?'Use [the exact dedicated cover](../../../../artifacts/covers/chladni-sand-cover-v1.png) if the verified-account desktop custom-Short-thumbnail control is available. Otherwise select the settled nodal-pattern frame around 19.4 seconds where offered.':platform==='instagram'?'Use [the exact dedicated cover](../../../../artifacts/covers/chladni-sand-cover-v1.png), SHA-256 `183d4c7c9bd15fbd575114800a02e11ec87f5995ae8e036ab2d59205bcc3b17c`; confirm profile/grid crop. If custom-image selection is unavailable, select the settled pattern around 19.4 seconds.':'Select the settled nodal-pattern frame around 19.4 seconds in the native selector where offered. [Exact local frame reference](../../../../artifacts/qa-evidence/chladni-sand-v1/frame-24-19.4s.png); native selected-frame pixels/crop may differ.'}`,'');
 lines.push(`**Settings:** ${platform==='youtube'?'English; Science & Technology if available; general audience / not specifically directed to children. Optional [aligned VTT](../../../../captions/chladni-sand.en.vtt).':platform==='instagram'?'Confirm @magnivis.media; enable highest-quality upload where offered; inspect selected cover crop.':platform==='tiktok'?'Confirm the actual Magnivis account, native cover selector and AI label; choose duet/stitch/reuse controls manually.':'Confirm the actual Magnivis Page/account, title/caption fields and native cover selector; Page/feed and dedicated viewer may differ.'} Apply common settings above.`,'',`[Approved copy source](${platform}/upload-copy-v1.txt) · [Approved metadata/settings](${platform}/metadata-v1.json)`,'');
}
lines.push('## Live checks and evidence','', 'Confirm destination account, cover selection/crop, AI disclosure control, captions/duplication, quality and actual visibility/schedule in the live UI. Prepared recommendations are not already applied settings. You accepted the listed unknowns; no native/device safety claim is made. After posting, provide actual links/IDs and any observations. Analytics remain absent until actual native evidence is supplied.','', '[Authorization](owner-publication-decision-v1.json) · [Exact bindings](authorization-bindings-v1.json) · [Authorized upload resolution](authorized-media-resolution-v1.json) · [Awaiting evidence](publication-evidence-intake-v1.json)','', 'AHMET — CYCLE #5 MANUAL RELEASE');
writeFileSync(`${base}/manual-release-v1.md`,lines.join('\n')+'\n',{flag:'wx'});
console.log(JSON.stringify({stage:cycle.stage,revision:cycle.revision,decision,uploads:uploads.map(u=>({platform:u.platform,files:u.files})),acceptedPresentationUnknowns:inspection.unknowns.length}));
