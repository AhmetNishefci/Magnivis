import {execFileSync} from 'node:child_process';
import {readFileSync} from 'node:fs';
import {describe,it,expect} from 'vitest';
import {creativeDirectionSchema, type CreativeDirection} from '../src/content-assets/creative-direction';
import {validateCreativeDirection} from '../src/content-assets/creative-direction-integrity';
import {recentApprovedVisualWorks} from '../src/content-assets/visual-convergence';
import {creativeDirectionWorkflow} from '../src/content-intelligence/creative-direction';
import {woodFrogApprovedKnowledgePackage as pkg} from '../src/knowledge/packages/wood-frog-approved';
import {woodFrogApprovedContentAsset as asset} from '../src/content-assets/assets/wood-frog-approved';
import {sha256Json} from '../src/content-intelligence/run-schema';
import {loadMediaRegistry,mediaHash} from '../src/artifacts/media';
import {loadCycle} from '../src/workflow/store';
import {nextAction as action} from '../src/workflow/cycle';
import historical from '../system-audits/cross-cycle-creative-convergence/historical-directions.json';
import {convergenceFixture} from './fixtures/visual-convergence';

const ref=(a:{id:string;revision:number})=>({id:a.id,revision:a.revision,sha256:sha256Json(a)});
const fixture=():CreativeDirection=>creativeDirectionSchema.parse({schemaVersion:1,id:'creative-direction.convergence-test',revision:1,state:'ready-for-production-planning',knowledgePackage:ref(pkg),contentAsset:ref(asset),approvedScriptSha256:sha256Json(asset.script),creativeThesis:'Synthetic regression only; no video started.',viewerExperience:'Understand a mechanism.',emotionalTarget:'Understanding.',visualThesis:'Independently justified visual clarity.',decisions:['visual-medium','art-direction','narration','captions','sound','pacing','hook','platform-presentation'].map(d=>({dimension:d,treatment:'Light paper field, repeated green, Manrope and centered explanation when story-appropriate.',rationale:'Fixture causal separation and caption readability justify these familiar choices.'})),convergenceReview:convergenceFixture(),ownerReview:{required:false,rationale:'Routine internal judgment within brand/evidence policy.'},risks:[],provenance:{method:'manual-editorial',enteredAt:'2026-10-02T20:00:00.000Z',notes:'Synthetic test, not production or owner evidence.'},platformApprovalGranted:false,publicationApprovalGranted:false});
const check=(d:unknown)=>validateCreativeDirection(d,pkg,asset);

describe('Cross-cycle convergence awareness within Adaptive Creative Direction',()=>{
 it('requires actual rendered recent history, overall impression and an internal tooling check',()=>{
  const d=fixture();const {portfolioReview:_review,...without}=d.convergenceReview;void _review;
  expect(()=>check({...d,convergenceReview:without})).toThrow('rendered cross-cycle');
  expect(()=>check({...d,convergenceReview:{...d.convergenceReview,portfolioReview:{...d.convergenceReview.portfolioReview,proposedFeedImpression:''}}})).toThrow();
  expect(()=>check({...d,convergenceReview:{...d.convergenceReview,recentAssets:d.convergenceReview.recentAssets.map(r=>({...r,visualComparison:undefined}))}})).toThrow('inspected visual comparison');
  const unexamined=fixture();unexamined.convergenceReview.recentAssets[0]!.visualComparison!.similarityCauses=[];expect(()=>check(unexamined)).toThrow('qualitative causes');
 });
 it('uses a bounded recent approved set rather than convenient older precedents or publication claims',()=>{
  const recent=recentApprovedVisualWorks('2026-10-02T20:00:00.000Z',asset.id);
  expect(recent.map(w=>w.contentAsset.id)).toEqual(['paper-half-shape.asset.hidden-geometry','chocolate-crystal-choice.asset.same-recipe-different-structure','longitude-clock.asset.time-to-position','phantom-traffic.asset.backward-wave']);
  const d=fixture();expect(()=>check({...d,convergenceReview:{...d.convergenceReview,recentAssets:d.convergenceReview.recentAssets.slice(1)}})).toThrow('exact bounded');
  expect(()=>check({...d,convergenceReview:{...d.convergenceReview,recentAssets:[],noRecentAssetsReason:'Prefer not to inspect recent work'}})).toThrow('exact bounded');
 });
 it('allows meaningful similarity, story-justified continuity and deliberate brand continuity',()=>{
  const d=check(fixture());expect(d.state).toBe('ready-for-production-planning');
  expect(d.convergenceReview.recentAssets.every(r=>r.visualComparison!.similarityCauses.some(s=>s.cause==='story-justified'))).toBe(true);
  expect(d.convergenceReview.recentAssets.every(r=>r.visualComparison!.similarityCauses.some(s=>s.cause==='brand-continuity'))).toBe(true);
  expect(d.ownerReview.required).toBe(false);
 });
 it.each(['story-justified','brand-continuity'] as const)('permits similarity justified by %s alone',cause=>{
  const d=fixture();for(const r of d.convergenceReview.recentAssets)r.visualComparison!.similarityCauses=r.visualComparison!.similarityCauses.filter(s=>s.cause===cause);
  expect(check(d).state).toBe('ready-for-production-planning');
 });
 it('blocks convenience-driven readiness even when the old unresolved list was cleared',()=>{
  const d=fixture();d.convergenceReview.recentAssets[0]!.visualComparison!.similarityCauses=[{similarity:'Familiar pale stage',cause:'convenience-driven',justification:'Renderer and existing assets are already available.'}];
  expect(d.convergenceReview.unresolvedConvenienceReuse).toEqual([]);
  expect(()=>check(d)).toThrow('materially different alternative exploration');
 });
 it('permits internal exploration to retain a similar treatment for independent story reasons',()=>{
  const d=fixture();const c=d.convergenceReview.recentAssets[0]!.visualComparison!;
  c.similarityCauses=[{similarity:'Existing background helper',cause:'convenience-driven',justification:'Initially favored helper availability; reconsidered internally.'}];
  c.convenienceResponse={alternatives:[{treatment:'Licensed footage-led tactile close-ups',materialChanges:['Physical setting, camera/lighting and object interaction instead of flat diagram stage'],storyTradeoffs:'Tactile realism adds context but hides the exact ideal ratio; comparison remains possible.'}],resolution:'Retain diagram after comparing explanatory tradeoffs; not to save adapting a renderer.',chosenForStory:'The ideal edge relationship must stay exact and visible, with physical rounding qualified.'};
  expect(check(d).ownerReview.required).toBe(false);
 });
 it('requires story tradeoffs and material change rather than merely renaming a preset',()=>{
  const d=fixture();const c=d.convergenceReview.recentAssets[0]!.visualComparison!;
  c.similarityCauses=[{similarity:'Available assets',cause:'convenience-driven',justification:'Availability alone.'}];
  c.convenienceResponse={alternatives:[{treatment:'Same preset renamed',materialChanges:[],storyTradeoffs:''}],resolution:'No change.',chosenForStory:''};
  expect(()=>check(d)).toThrow();
 });
 it.each(['Light field after a light predecessor','Dark field after a dark predecessor','Same cream background, green palette and Manrope','Never-before-used volumetric archival collage with typographic weather'])('permits open story-specific execution: %s',treatment=>{
  const d=fixture();d.decisions=d.decisions.map(c=>({...c,treatment}));expect(check(d).decisions[0]!.treatment).toBe(treatment);
 });
 it('rejects numeric diversity authority and does not add a style whitelist',()=>{
  const d=fixture();expect(creativeDirectionSchema.safeParse({...d,convergenceReview:{...d.convergenceReview,diversityScore:0.9}}).success).toBe(false);
  expect(creativeDirectionSchema.safeParse({...d,convergenceReview:{...d.convergenceReview,requiredStyle:'dark-next'}}).success).toBe(false);
  const prompt=creativeDirectionWorkflow.systemInstructions.join(' ');
  expect(prompt).toContain('No light/dark alternation');expect(prompt).toContain('numeric visual-distance/diversity score');expect(prompt).toContain('No new normal owner gate');
 });
 it('rejects wrong media identity and stale inspection hashes rather than accepting documentation labels',()=>{
  const d=fixture();const c=d.convergenceReview.recentAssets[0]!.visualComparison!;c.master=d.convergenceReview.recentAssets[1]!.visualComparison!.master;
  expect(()=>check(d)).toThrow('detached');
  const other=fixture();other.convergenceReview.recentAssets[0]!.visualComparison!.inspectionRecord.sha256='0'.repeat(64);expect(()=>check(other)).toThrow('digest mismatch');
 });
 it('freezes historical directions and permits only exact prior semantics, not edited records',()=>{
  for(const d of historical){expect(mediaHash(d.path)).toBe(d.fileSha256);expect(sha256Json(JSON.parse(readFileSync(d.path,'utf8')))).toBe(d.sha256);}
  const old=JSON.parse(readFileSync('content-intelligence/cycles/cycle-4/direction-v1.json','utf8'));
  const paperPkg=JSON.parse(readFileSync('content-intelligence/cycles/cycle-4/knowledge-package.ready.json','utf8'));const paperAsset=JSON.parse(readFileSync('content-intelligence/cycles/cycle-4/content-asset.ready.json','utf8'));
  expect(validateCreativeDirection(old,paperPkg,paperAsset)).toEqual(old);
  expect(()=>validateCreativeDirection({...old,revision:2},paperPkg,paperAsset)).toThrow('rendered cross-cycle');
 });
 it('preserves the exact approved Cycle 4, two normal V3 gates and pre-Cycle-5 milestone state',()=>{
  const registry=loadMediaRegistry();const cycle=loadCycle(process.cwd(),'cycle.4',registry);
  expect(cycle.stage).toBe('authorized');expect(cycle.revision).toBe(9);expect(action(cycle)).toEqual({kind:'manual-publication',gate:null});
  const spec=readFileSync('src/workflow/cycle.ts','utf8');expect(spec).toContain("['master-review','publication-review'].includes(cycle.stage)");
  expect(mediaHash('artifacts/masters/paper-half-shape-candidate-v1.mp4')).toBe('93955c8959157fd01c680c195d0f4ed9bcdb883fe4472e92e7af5c9505dd74b7');
  // The system milestone did not authorize Cycle 5; a later explicit owner start may.
  expect(execFileSync('git',['show','87cc71f:workflow/project-state.json'],{encoding:'utf8'})).not.toContain('cycle.5');
 });
});
