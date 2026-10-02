import {mkdirSync,readFileSync,writeFileSync} from 'node:fs';
import {openMediaCatalog} from '../src/artifacts/catalog';
import {mediaHash} from '../src/artifacts/media';
import {sha256Json} from '../src/content-intelligence/run-schema';
import {ownerDecisionSchema} from '../src/workflow/evidence';
import {loadCycle,persistCycleEvent} from '../src/workflow/store';
const root=process.cwd(),base='content-intelligence/cycles/cycle-5',registry=openMediaCatalog(root);
let cycle=loadCycle(root,'cycle.5',registry);
if(cycle.stage!=='master-review'||!cycle.candidate)throw new Error('Exact unapproved master review required');
const candidate=JSON.parse(readFileSync(cycle.candidate.path,'utf8'));
registry.resolveFile(candidate.media);
const now=new Date().toISOString();
const instruction=`APPROVE.

I approve the Cycle #5 master exactly as reviewed.

Lock the current master without creative modification, rerendering, re-encoding, narration changes, caption changes, timing changes, or visual changes.

Proceed through the authoritative Magnivis V3 workflow from Master approval to publication preparation.

Prepare platform presentation for YouTube Shorts, TikTok, Instagram Reels, and Facebook Reels.

Apply the current platform-presentation architecture independently to each destination. Reuse the canonical approved master when it satisfies that platform's presentation requirements. Create a derivative only when actual platform-specific presentation requirements justify different media bytes.

Do not duplicate identical media unnecessarily.

Prepare the appropriate title, description/caption, hashtags/tags where applicable, cover/thumbnail treatment, recommended settings, and first comment for each platform according to current Magnivis policy.

Preserve the approved content, factual safeguards, narrator, captions, audio, and creative treatment.

Perform the required presentation and publication-readiness validation.

Do not upload, schedule, or publish anything.

Stop at the second normal V3 owner gate:

AHMET — PUBLICATION REVIEW / AUTHORIZATION

Provide the exact canonical upload media and any genuinely necessary derivatives, covers/thumbnails, platform copy, relevant settings, known presentation evidence, and unresolved uncertainties required for owner review.`;
const path=`${base}/master-owner-decision-v1.json`;
writeFileSync(path,JSON.stringify(ownerDecisionSchema.parse({schemaVersion:3,id:'owner-decision.cycle-5.master-v1',revision:1,gate:'master-review',cycleId:cycle.id,targetSha256:sha256Json(candidate),decision:'approve',enteredAt:now,suppliedReviewTime:null,reviewer:'Ahmet — owner',evidenceBasis:'explicit-owner-message',instruction,acceptedUnknowns:[]}),null,2)+'\n',{flag:'wx'});
cycle=persistCycleEvent(root,cycle,{type:'owner-decision',record:{path,sha256:mediaHash(path)},at:now},registry);
const startPath=`${base}/presentation-start-v1.json`;
mkdirSync(`${base}/publication`,{recursive:true});
writeFileSync(startPath,JSON.stringify({cycleId:cycle.id,stage:'presentation',action:'Prepare independent exact-master presentation assessments, justified cover treatment, copy/settings/first comments and reference-only deliveries. No upload/scheduling/publication authority.'},null,2)+'\n',{flag:'wx'});
cycle=persistCycleEvent(root,cycle,{type:'begin-internal',stage:'presentation',record:{path:startPath,sha256:mediaHash(startPath)},at:new Date().toISOString()},registry);
console.log(JSON.stringify({stage:cycle.stage,revision:cycle.revision,approvedMedia:candidate.media,masterDecision:cycle.masterDecision}));
