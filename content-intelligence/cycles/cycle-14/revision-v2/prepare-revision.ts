/** Renew exact editorial/script/direction bindings; preserve the approved treatment and production hold. */
import {readFileSync, writeFileSync} from 'node:fs';
import {knowledgePackageSchema} from '../../../../src/knowledge/schema';
import {contentAssetSchema} from '../../../../src/content-assets/schema';
import {verifyInternalEditorial} from '../../../../src/workflow/editorial';
import {validateCreativeDirection} from '../../../../src/content-assets/creative-direction-integrity';
import {loadMediaRegistry, mediaHash} from '../../../../src/artifacts/media';
import {loadCycle, persistCycleEvent} from '../../../../src/workflow/store';
import {sha256Json} from '../../../../src/content-intelligence/run-schema';
const base = 'content-intelligence/cycles/cycle-14/revision-v2', prior = 'content-intelligence/cycles/cycle-14/development-v1';
const read = (path: string) => JSON.parse(readFileSync(path, 'utf8'));
const data = read(`${base}/authoring-data.json`) as {lines: [string,string[]][]; objectives: string[]; runtimeEstimate: object};
const ref = (path: string) => ({path, sha256: mediaHash(path)});
const put = (name: string, value: unknown) => {const path = `${base}/${name}.json`; writeFileSync(path, JSON.stringify(value, null, 2) + '\n', {flag:'wx'}); return ref(path);};
const now = new Date().toISOString(), registry = loadMediaRegistry();
const pkgInput = read(`${prior}/draft-package.json`);
pkgInput.revision = 2; pkgInput.hooks[0].text = data.lines[0]![0];
const pkg = knowledgePackageSchema.parse(pkgInput);
const input = read(`${prior}/draft-asset.json`), aid: string = input.id;
input.revision = 2; input.durationIntentSeconds = {minimum: 52, maximum: 66};
input.script = {language: 'en', segments: data.lines.map((line, i) => ({id: `${aid}.script.${i+1}`, type: 'factual', text: line[0], claimIds: line[1].map(key => `dice-no-best.claim.${key}`)}))};
const labels = ['choose','conditions','simple-proof','blue-reply','green-reply','orange-reply','return','chance','circle-payoff'];
input.narrativeStructure = data.lines.map((_, i) => ({id: `${aid}.beat.${i+1}`, label: labels[i], purpose: data.objectives[i], scriptSegmentIds: [`${aid}.script.${i+1}`]}));
input.visualPlan = data.lines.map((line, i) => ({id: `${aid}.visual.${i+1}`, narrativeBeatId: `${aid}.beat.${i+1}`, objective: data.objectives[i], visualType: 'animation', suggestedPrimitive: 'bespoke', scriptSegmentIds: [`${aid}.script.${i+1}`], claimIds: [...new Set([...line[1],...(i>=2 && i<=5 ? ['sample-space'] : [])])].map(key => `dice-no-best.claim.${key}`), notes: `Approved tactile/graphic treatment retained. Exact multiplicities and weighted proofs in ${base}/visual-proof-plan.json. On-screen calculations stay factual content, separate from the exact speech/caption transcript. Dormant dice retain name/number identity; no repeated grid, undocumented physical game or color-only decoding.`}));
const asset = contentAssetSchema.parse(input);
const review = read(`${prior}/internal-editorial-review.json`);
review.enteredAt = now;
review.reviewer = 'Codex renewed internal evidence/editorial review; owner treatment approval is scoped and revised narration is unapproved';
review.packageSha256 = sha256Json(pkg); review.assetSha256 = sha256Json(asset); review.scriptSha256 = sha256Json(asset.script);
review.premiseAlignment.rationale = 'Immaterial comprehension refinement preserves the approved premise, exact face values, all four2/3counter-choices, assumptions, chance qualification and circular payoff. Source bodies, claim statements/evidence/dispositions and independent complete calculations remain byte-identical in V1. No new factual publishing promise or discovery.';
review.comprehensionReview = 'One spoken six-face count introduces the model; blue has a visible six-face4/0inventory, and green/orange retain audible winning-route explanations while weighted graphics carry18+6 and12+12. Each visual proof must visibly earn2/3rather than flash an unexplained label. All identities persist; response-arrow meaning stays explicit. Claims survive exact renewed script-to-evidence mapping. No audience panel, narration listening, rendered sequence or comprehension pass is invented.';
review.misconceptionSafeguards.push('On-screen arithmetic does not become extra spoken caption text. Preserve the reviewed128-word transcript exactly if later approved; proof labels separately bind the unchanged verified claims.');
put('draft-package', pkg); put('draft-asset', asset); put('internal-editorial-review', review);
const ready = verifyInternalEditorial(review, pkg, asset);
put('knowledge-package.ready', ready.knowledgePackage); put('content-asset.ready', ready.contentAsset);
const editorial = put('editorial-receipt', {draftPackage: pkg, draftAsset: asset, review});
persistCycleEvent(process.cwd(), loadCycle(process.cwd(), 'cycle.14', registry), {type: 'complete-internal', stage:'editorial', record:editorial, at:now}, registry);
const start = put('creative-start', {cycleId:'cycle.14', stage:'creative', action:'Rebind owner-approved tactile/graphic/circle/narration/no-CTA treatment to revised exact script and proof plan. Keep proposal pending Final Creative Review; no creative-to-production transition, render or generated narration.'});
persistCycleEvent(process.cwd(), loadCycle(process.cwd(), 'cycle.14', registry), {type:'begin-internal', stage:'creative', record:start, at:now}, registry);
const bind = (value: {id:string;revision:number}) => ({id:value.id, revision:value.revision, sha256:sha256Json(value)});
const d = read(`${prior}/direction-v1.json`);
d.id = 'creative-direction.dice-no-best.choose-second.v2'; d.revision=2;
d.knowledgePackage=bind(ready.knowledgePackage); d.contentAsset=bind(ready.contentAsset); d.approvedScriptSha256=sha256Json(asset.script);
for(const decision of d.decisions) {
 if(decision.dimension==='hook') {decision.treatment=data.lines[0]![0]+' Four persistent tactile dice and compact winning rule present immediately; model assumptions follow. Narration is proposed, not yet approved.';decision.rationale='Shorten the invitation and state the rule before the counter-choice challenge. This retains the approved participation/treatment rather than a new template or certain-win promise.';}
 if(decision.dimension==='pacing') {decision.treatment='128 spoken words;46.5–53seconds estimated speech at145–165words/min, plus6–12seconds provisional mental-choice/proof recognition yields52.5–65seconds. Estimate only; no fixed60second target or measured narration.';decision.rationale='Reducing recited arithmetic creates space to look at the correct weighted possibilities. Preserve enough actual recognition time; do not turn shorter narration into a faster unexplained demonstration.';}
 if(decision.dimension==='visual-medium') decision.treatment += ' V2 visual proof uses the unchanged verified sample space and leaves the full18+6/12+12calculations visible without reciting them. Name/number identities persist.';
}
d.ownerReview={required:true,rationale:'Owner explicitly approved the five named treatment aspects in scoped owner-feedback.json, while requesting narration revision and reserving Final Creative Review. Rebinding does not approve new narration or authorize production.'};
d.provenance.enteredAt=now;
d.provenance.notes='Manual script refinement and renewed native editorial validation, with the exact V1 source/math and four-master rendered-inspection evidence reused by reference. Latest approved set checked unchanged; no new image/video/audio inspection, media creation, provider run or render. Exact owner treatment acceptance separately bound.';
const direction=validateCreativeDirection(d, ready.knowledgePackage, ready.contentAsset, {registry});
put('direction-v2', direction);
put('approval-application', {ownerFeedback:ref(`${base}/owner-feedback.json`), priorDirection:ref(`${prior}/direction-v1.json`), revisedDirection:ref(`${base}/direction-v2.json`), approvedAspectsRetained:['tactile dice','integrated visual proof','circular advantage reveal','narration direction','no-spoken-CTA approach'], refinements:['shorter rule-first opening','less recited arithmetic','revised script-bound visual proof and recognition-time estimate'], narratorChange:false, ctaChange:false, exactNarrationApproved:false, productionAuthorized:false, evidenceLimits:'No shorter reference text was supplied; no absent script or audiovisual acceptance inferred.'});
put('final-creative-review-target', {cycleId:'cycle.14', ownerFeedback:ref(`${base}/owner-feedback.json`), premiseDecision:ref('content-intelligence/cycles/cycle-14/owner-premise-approval-v1.json'), package:ref(`${base}/knowledge-package.ready.json`), asset:ref(`${base}/content-asset.ready.json`), script:ref(`${base}/script.md`), scriptJsonSha256:sha256Json(asset.script), direction:ref(`${base}/direction-v2.json`), visualProof:ref(`${base}/visual-proof-plan.json`), authoring:ref(`${base}/authoring-data.json`), mathematicalProof:[ref(`${prior}/mathematics/enumeration.json`),ref(`${prior}/mathematics/cross-check.json`)], runtimeEstimate:data.runtimeEstimate, treatmentAspectsApproved:true, revisedNarrationApproved:false, productionAuthorized:false});
put('scope-hold', {enteredAt:now, ownerInstruction:ref(`${base}/owner-instruction.md`), ownerFeedback:ref(`${base}/owner-feedback.json`), currentOwnerGate:'AHMET — CYCLE #14 FINAL CREATIVE REVIEW', nativeStage:'creative', revision:10, directionState:'proposal', renderingAuthorized:false, productionBegun:false, rationale:'Scoped owner approval retained accurately. Revised narration and renewed direction remain proposals; no new normal gate/schema or owner decision inferred. Stop before production.'});
console.log(JSON.stringify({nativeStage:'creative',revision:10,revisedNarrationApproved:false,treatmentAspectsApproved:true,productionBegun:false,scriptWords:128},null,2));
