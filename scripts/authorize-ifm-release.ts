import {readFileSync,writeFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {openMediaCatalog} from '../src/artifacts/catalog';
import {mediaHash} from '../src/artifacts/media';
import {sha256Json} from '../src/content-intelligence/run-schema';
import {ownerDecisionSchema,readBoundRecord} from '../src/workflow/evidence';
import {inspectCycleRelease,resolveAuthorizedCycleUpload,cycleDeliverySchema} from '../src/workflow/release';
import {loadCycle,persistCycleEvent} from '../src/workflow/store';
import {nextAction} from '../src/workflow/cycle';
const root=process.cwd(),base='content-intelligence/cycles/cycle-7/publication',registry=openMediaCatalog(root);
const read=(p:string)=>JSON.parse(readFileSync(p,'utf8'));
const ref=(path:string)=>({path,sha256:mediaHash(path)});
const put=(name:string,value:unknown)=>{const path=`${base}/${name}.json`;writeFileSync(path,JSON.stringify(value,null,2)+'\n',{flag:'wx'});return ref(path);};
let cycle=loadCycle(root,'cycle.7',registry);
if(cycle.stage!=='publication-review'||!cycle.release||!cycle.candidate)throw new Error('Exact Cycle 7 publication review required');
const release=readBoundRecord(cycle.release),now=new Date().toISOString();
const inspection=inspectCycleRelease(release,registry,now,root);
const risk=read(`${base}/risk-register-v1.json`);
if(risk.targetSha256!==sha256Json(release)||sha256Json(risk.requiredExactPresentationUnknowns)!==sha256Json(inspection.unknowns))throw new Error('Review/risk binding drift');
const instruction=`APPROVE PUBLICATION — Cycle #7.

I approve the exact four-platform release package for the locked V3 master:

artifacts/masters/interaction-free-cycle7-candidate-v3.mp4

I accept the explicitly listed presentation and operational uncertainties for:
- YouTube Shorts
- TikTok
- Instagram Reels
- Facebook Reels

Record publication authorization according to the authoritative V3 workflow.

Preserve the exact approved master and approved publication package unchanged.

Prepare the final manual-release handoff with the exact:
- canonical video path;
- cover paths / frame timestamps;
- YouTube title, description, tags, first comment and settings;
- TikTok caption, first comment and settings;
- Instagram caption, first comment and settings;
- Facebook title where supported, caption, first comment and settings;
- AI/synthetic-content disclosure guidance;
- any final manual checks required during upload.

Print all owner-facing upload information directly in the response so I do not need to open repository files to perform the release.

Do NOT upload, schedule or publish anything yourself.

Do NOT start Cycle #8.

After completing the authorization/manual-release handoff, stop and report the resulting Cycle #7 state.

IMPORTANT:
Do not begin the planned Premise Review workflow modification yet. That will be handled as a separate owner-authorized task after Cycle #7 is safely authorized for manual release.`;
const decision=put('owner-publication-decision-v1',ownerDecisionSchema.parse({schemaVersion:3,id:'owner-decision.cycle-7.publication-v1',revision:1,gate:'publication-review',cycleId:cycle.id,targetSha256:sha256Json(release),decision:'approve',enteredAt:now,suppliedReviewTime:null,reviewer:'Ahmet — owner',evidenceBasis:'explicit-owner-message',instruction,acceptedUnknowns:[...inspection.unknowns,...risk.additionalOperationalUnknowns],scope:ref(`${base}/risk-register-v1.json`)}));
put('owner-publication-decision-reference-v1',decision);
cycle=persistCycleEvent(root,cycle,{type:'owner-decision',record:decision,at:now},registry);
const uploads=resolveAuthorizedCycleUpload(release,decision,registry,root);
put('authorized-media-resolution-v1',uploads);
const bindings=inspection.release.deliveries.map(({variant,manifest})=>{const m=cycleDeliverySchema.parse(readBoundRecord(manifest));return {variantId:variant.id,platform:variant.platform,surface:variant.surface,variantSha256:sha256Json(variant),manifest,metadata:m.metadata,uploadCopy:m.uploadCopy,media:variant.media,artifacts:m.artifacts,readyFor:'owner-manual-release',readinessBasis:'Exact V3 publication authorization with accepted scoped uncertainty; no device pass claimed'};});
put('authorization-bindings-v1',{cycleId:cycle.id,recordedAt:new Date().toISOString(),sourceReviewCommit:execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),release:cycle.release,releaseTargetSha256:sha256Json(release),decision,riskRegister:ref(`${base}/risk-register-v1.json`),scope:'Ahmet manual release on YouTube, TikTok, Instagram and Facebook only. Assistant external platform actions prohibited.',stage:cycle.stage,revision:cycle.revision,nextAction:nextAction(cycle),bindings,acceptedPresentationUnknowns:inspection.unknowns.length,acceptedOperationalUnknowns:risk.additionalOperationalUnknowns.length,mediaCopied:0,mediaRegenerated:0,externalPlatformActionsPerformed:[],publicationEvidence:null,actualScheduling:null,actualPublication:null,analytics:null});
put('publication-evidence-intake-v1',{cycleId:cycle.id,release:cycle.release,publicationDecision:decision,state:'awaiting-owner-evidence',platforms:uploads.map(u=>({platform:u.platform,variantId:u.variantId,authorizedMedia:u.files.find(f=>f.role==='video')!.media,manifestSha256:u.manifestSha256,scheduling:null,publication:null,url:null,postId:null,publishedAt:null,actualSettings:null,firstComment:{posted:null,commentId:null,postedAt:null,pinState:null},presentationObservations:null,analytics:null})),notes:'No PublicationRecord, observation, real-device pass or metric is inferred. Later owner evidence must identify actual platform/URL/ID/time when available; native metrics retain definitions/source/capture time/window.'});
const lines=[
 '# AHMET — CYCLE #7 MANUAL RELEASE','',
 'Cycle #7 authorized at journal revision21 by explicit owner publication decision. All52 presentation and5 operational uncertainties accepted for exact release. This is not a device pass. Only Ahmet performs platform actions. No assistant upload, scheduling or publication.','',
 'Canonical video for all four destinations:','',
 '`artifacts/masters/interaction-free-cycle7-candidate-v3.mp4`','',
 'SHA-256: `d781b6e8a48d01715d02c5ffb0d471008c5dbaf35f98413b1440be8b2eb5d5a3`.1080×1920 /30fps H.264/AAC48k,53.8s picture /53.846s MP4. Exact master, production inputs and original prepared copy/profiles/evidence/covers/manifests remain unchanged. Authorization adds only records and a manual handoff, no lifecycle copies.','',
 'Dedicated cover for YouTube/Instagram: `artifacts/covers/interaction-free-cover-v1.png`,1080×1920, SHA-256 `a0757daefec248b8996ed90b1f04ffa5a74333c44522657729ad07c7ea3d254d`. Original paired climax with explicit successful-trial/ideal-model qualification.','',
 'TikTok/Facebook native frame: corresponding32.7-second climax, frame981. Local canonical review reference: `artifacts/qa-evidence/interaction-free-cycle7-v3/frame-66-32.7s.png`, SHA-256 `9e557bb3e7d2e73393540f5d1dc3bf296f4f85270048342dfe694e689d9d1891`. Native selector may approximate and crop; reference is not a claim of exact native extracted pixels.','',
 '## Shared manual settings','',
 'Confirm the correct Magnivis destination. Keep exact MP4, original audio and designed captions. Highest-quality upload where offered; no optional enhancement, trim, templates, text/music/audio additions or normalization edits. English where selectable. Normal comments; no paid promotion or location. First comments prepared, not posted/pinned. Owner chooses live remix/duet/stitch/reuse permissions. Public/Everyone only by owner manual release; no date/time selected.','',
 'No new preview approval gate: accepted uncertainty remains unknown. If native UI exposes a genuine material collision or other suitability failure, document it and return for scoped remediation; do not change the approved media/package on your own. If a custom cover/title control is unavailable, record the actual result; do not manufacture that capability or change the master.','',
];
for(const platform of ['youtube','tiktok','instagram','facebook']){
 const m=read(`${base}/${platform}/metadata-v1.json`);
 lines.push(`## ${platform==='youtube'?'YouTube Shorts':platform==='tiktok'?'TikTok':platform==='instagram'?'Instagram Reels':'Facebook Reels'}`,'');
 if(m.title)lines.push(`Title${platform==='facebook'?' (only if supported by actual composer)':''}: ${m.title}`,'');
 lines.push(platform==='youtube'?'Description:':'Caption:','',m.description,'');
 if(m.tags.length)lines.push(`Optional tags: ${m.tags.join(', ')}`,'');
 lines.push('First comment (not posted):','',m.firstComment,'');
 lines.push(`Cover: ${m.cover.selection}. ${platform==='youtube'?'Use exact dedicated PNG if verified-account desktop Shorts custom-thumbnail control is available.':platform==='instagram'?'Use exact dedicated PNG where live cover control supports it; inspect grid/feed crop.':'Select corresponding32.7s paired climax in native selector where available; existing PNG is review reference.'}`,'');
 lines.push('Exact approved recommended settings (not yet applied):','');
 for(const [key,value] of Object.entries(m.operatorSettings))if(value!==null)lines.push(`- ${key}: ${value}`);
 lines.push('',`Captions: ${m.captions.guidance}${platform==='youtube'?' Optional exact English accessibility track: captions/interaction-free-v3.en.vtt.':''}`,'');
}
lines.push('## Final live checks and later evidence','',
 'During your manual upload, confirm destination account, selected cover and crop, title/caption/hashtags, disclosure selection, no duplicate native caption obstruction, original audio and quality, actual visibility/schedule and processing status. Prepared controls/settings are recommendations, not applied facts. Inspect available opening/climax/final qualification preview; no real-device pass is inferred. Accepted uncertainties do not override an actual observed collision.','',
 'After scheduling, report platform, intended date/time/timezone and available receipt; scheduling is not publication. After actual publication, report platform URL/post ID, actual public time when known, selected cover, disclosure/visibility/caption settings, first-comment posted/pinned state, processing and any crop/UI/audio issue. Unknown values remain null. No PublicationRecord or zero analytics is inferred. Later metrics need raw native definitions, source, capture time and reporting window. Cycle #7 waits for owner evidence and is not closed by authorization.','',
 'No Cycle #8. Premise Review workflow modification is deferred to separate explicit owner authority; no workflow/schema edits in this task.','',
 '[Publication decision](owner-publication-decision-v1.json) · [Authorization bindings](authorization-bindings-v1.json) · [Authorized file resolution](authorized-media-resolution-v1.json) · [Evidence intake](publication-evidence-intake-v1.json)');
writeFileSync(`${base}/manual-release-v1.md`,lines.join('\n')+'\n',{flag:'wx'});
console.log(JSON.stringify({stage:cycle.stage,revision:cycle.revision,decision,uploads:uploads.map(u=>({platform:u.platform,files:u.files})),acceptedPresentationUnknowns:inspection.unknowns.length,acceptedOperationalUnknowns:risk.additionalOperationalUnknowns.length}));
