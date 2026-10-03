import {mkdirSync,readFileSync,writeFileSync} from 'node:fs';
import {openMediaCatalog} from '../src/artifacts/catalog';
import {mediaHash} from '../src/artifacts/media';
import {sha256Json} from '../src/content-intelligence/run-schema';
import {ownerDecisionSchema} from '../src/workflow/evidence';
import {loadCycle,persistCycleEvent} from '../src/workflow/store';
const root=process.cwd(),base='content-intelligence/cycles/cycle-6',registry=openMediaCatalog(root);
let cycle=loadCycle(root,'cycle.6',registry);
if(cycle.stage!=='master-review'||!cycle.candidate)throw new Error('Exact unapproved master review required');
const candidate=JSON.parse(readFileSync(cycle.candidate.path,'utf8'));
registry.resolveFile(candidate.media);
const now=new Date().toISOString();
const instruction=`APPROVE — Cycle #6 revised master V4.

I approve the exact master:
artifacts/masters/heat-barrier-cycle6-candidate-v4.mp4

The Leidenfrost topic, hook, explanation, pacing, visual treatment, captions and overall master are approved.
Record owner approval under authoritative V3 and lock exact master without creative modification. Proceed to AHMET — PUBLICATION REVIEW / AUTHORIZATION. Prepare YouTube Shorts, TikTok, Instagram Reels and Facebook Reels: strongest appropriate title where supported, description/caption, hashtags, tags/keywords where supported, first comment, cover/thumbnail recommendation and upload settings. Discovery/curiosity without scientific exaggeration. Use one canonical master when presentation-safe, no identical-byte platform copies; derivative only for actual documented presentation requirement. Preserve original audio and burned-in captions; no music, filters, effects, trim, speed or automatic reframing absent a genuinely required documented derivative. Perform current-profile presentation checks; no invented device verification. Do NOT upload, schedule or publish. Stop at second normal publication gate with exact canonical media/justified derivatives/covers/full copy/settings/validation/genuine uncertainties. Owner instruction recorded faithfully; entry time separate from unknown supplied review time.`;
const path=`${base}/master-owner-decision-v1.json`;
writeFileSync(path,JSON.stringify(ownerDecisionSchema.parse({schemaVersion:3,id:'owner-decision.cycle-6.heat-master-v4',revision:1,gate:'master-review',cycleId:cycle.id,targetSha256:sha256Json(candidate),decision:'approve',enteredAt:now,suppliedReviewTime:null,reviewer:'Ahmet — owner',evidenceBasis:'explicit-owner-message',instruction,acceptedUnknowns:[]}),null,2)+'\n',{flag:'wx'});
cycle=persistCycleEvent(root,cycle,{type:'owner-decision',record:{path,sha256:mediaHash(path)},at:now},registry);
const startPath=`${base}/presentation-start-v1.json`;
mkdirSync(`${base}/publication`,{recursive:true});
writeFileSync(startPath,JSON.stringify({cycleId:cycle.id,stage:'presentation',action:'Prepare independent exact-master presentation assessments, justified cover treatment, copy/settings/first comments and reference-only deliveries. No upload/scheduling/publication authority.'},null,2)+'\n',{flag:'wx'});
cycle=persistCycleEvent(root,cycle,{type:'begin-internal',stage:'presentation',record:{path:startPath,sha256:mediaHash(startPath)},at:new Date().toISOString()},registry);
const lockPath=`${base}/master-lock-v4.json`;
writeFileSync(lockPath,JSON.stringify({cycleId:cycle.id,media:candidate.media,canonicalPath:registry.resolveFile(candidate.media),candidate:cycle.candidate,ownerDecision:cycle.masterDecision,lockedAt:now,method:'Exact canonical identity locked by reference; no copy, render, encoding or creative modification.',publicationAuthorized:false},null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({stage:cycle.stage,revision:cycle.revision,approvedMedia:candidate.media,masterDecision:cycle.masterDecision}));
