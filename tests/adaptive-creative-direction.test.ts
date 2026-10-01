import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {describe,expect,it} from 'vitest';
import baseline from '../system-audits/adaptive-creative-direction-v1/historical-baseline.json';
import {woodFrogApprovedKnowledgePackage as pkg} from '../src/knowledge/packages/wood-frog-approved';
import {woodFrogApprovedContentAsset as asset} from '../src/content-assets/assets/wood-frog-approved';
import {phantomTrafficContentAsset as recent} from '../src/content-assets/assets/phantom-traffic';
import {creativeDirectionSchema,creativeDirectionDraftSchema} from '../src/content-assets/creative-direction';
import {validateCreativeDirection} from '../src/content-assets/creative-direction-integrity';
import {sha256Json} from '../src/content-intelligence/run-schema';
import {woodFrogProductionPlan} from '../src/production/plans/wood-frog';
import {validateProductionPlanReferences} from '../src/production/schema';
import {proposeCreativeDirection} from '../src/content-intelligence/creative-direction';
import {validateAdaptiveCaptionPlan} from '../src/captions/adaptive-plan';
import {hookArchetypeSchema} from '../src/knowledge/schema';
import {createWorkflowRun} from '../src/content-intelligence/run-store';
import {validateWorkflowRunEnvelope} from '../src/content-intelligence/run-schema';
import {woodFrogFreezeTopicCandidate} from '../src/content-intelligence/candidates/wood-frog-freeze';
import {creativeDirectionWorkflow} from '../src/content-intelligence/creative-direction';
import {videoSpecSchema} from '../src/content/schema';
import {phantomTraffic} from '../src/content/videos/phantom-traffic';
const ref=(a:{id:string;revision:number})=>({id:a.id,revision:a.revision,sha256:sha256Json(a)});
const makeDirection=()=>creativeDirectionSchema.parse({
 schemaVersion:1,id:'creative-direction.test',revision:1,state:'ready-for-production-planning',
 knowledgePackage:ref(pkg),contentAsset:ref(asset),approvedScriptSha256:sha256Json(asset.script),
 creativeThesis:'Test fixture only; no historical redesign.',viewerExperience:'Understand a scoped mechanism.',emotionalTarget:'Curiosity resolved.',visualThesis:'Explain relationships through intentional motion.',
 decisions:['visual-medium','art-direction','narration','captions','sound','pacing','hook','platform-presentation'].map(d=>({dimension:d,treatment:`Authored ${d} treatment`,rationale:'Selected for the explanation, rather than inheritance.'})),
 convergenceReview:{recentAssets:[{contentAsset:ref(recent),learnedPrinciple:'Motion can explain a relationship.',applicability:'Test whether physical motion clarifies this fixture.',similarities:['Shared QA infrastructure'],differences:['Different content-specific execution'],assessment:'distinct-execution',rationale:'Infrastructure does not mandate style.'}],unresolvedConvenienceReuse:[],conclusion:'Intentional choices; no convenience-driven lock.'},
 ownerReview:{required:false,rationale:'Fixture decisions stay within existing editorial truth.'},risks:['Fixture only.'],provenance:{method:'manual-editorial',enteredAt:'2026-10-01T00:00:00Z',notes:'Synthetic unit-test input, not an owner decision or produced asset.'},platformApprovalGranted:false,publicationApprovalGranted:false,
});
const futurePlan=(direction=makeDirection())=>({...woodFrogProductionPlan,id:'production-plan.future-test.v1',status:'planned',visualApproval:undefined,creativeDirection:ref(direction),assets:woodFrogProductionPlan.assets.map(a=>({...a,provenance:{...a.provenance,evidence:'Fixture rights evidence'}}))});

describe('Adaptive creative direction',()=>{
 it('preserves every historical render, approval, audio, artifact and presentation input byte-for-byte',()=>{
  // Appendable platform/account registries are checked by this milestone's audit,
  // not frozen forever: future measured evidence must still be recordable.
  const mutableRegistries=new Set(['artifacts/manifests.json','artifacts/presentation-qa.json','artifacts/presentation-profiles.json','artifacts/cover-assets.json','artifacts/deliveries.json']);
  for(const file of baseline.files.filter(f=>!mutableRegistries.has(f.path))) expect(createHash('sha256').update(readFileSync(file.path)).digest('hex'),file.path).toBe(file.sha256);
 });
 it('accepts the exact historical production plan without retroactive direction',()=>{
  expect(validateProductionPlanReferences(woodFrogProductionPlan,pkg,asset)).toEqual(woodFrogProductionPlan);
 });
 it('requires direction for future plans and for altered historical plans',()=>{
  expect(()=>validateProductionPlanReferences({...futurePlan(),creativeDirection:undefined},pkg,asset)).toThrow('CreativeDirection');
  expect(()=>validateProductionPlanReferences({...woodFrogProductionPlan,revision:4},pkg,asset)).toThrow('provenance');
 });
 it('validates future source bindings, readiness, rights evidence and selected direction',()=>{
  const d=makeDirection();expect(validateProductionPlanReferences(futurePlan(d),pkg,asset,d).creativeDirection).toEqual(ref(d));
  expect(()=>validateProductionPlanReferences({...futurePlan(d),creativeDirection:{...ref(d),sha256:'0'.repeat(64)}},pkg,asset,d)).toThrow('stale');
  expect(()=>validateProductionPlanReferences({...futurePlan(d),assets:woodFrogProductionPlan.assets},pkg,asset,d)).toThrow('provenance');
 });
 it('rejects stale editorial/script hashes and unapproved source authority',()=>{
  const d=makeDirection();expect(()=>validateCreativeDirection({...d,approvedScriptSha256:'0'.repeat(64)},pkg,asset)).toThrow('stale');
  const draft={...asset,editorialStatus:'draft' as const};expect(()=>validateCreativeDirection({...d,contentAsset:ref(draft)},pkg,draft)).toThrow('approved');
 });
 it('permits different media, voices, palettes, caption execution and silence with rationale',()=>{
  const d=makeDirection();for(const treatment of ['Live-action licensed reconstruction','Custom 3D scene','Restrained monochrome typography','Alternate licensed voice; measured pacing','Silence between narration phrases']) {
   expect(creativeDirectionSchema.parse({...d,decisions:d.decisions.map(choice=>({...choice,treatment}))}).decisions[0]?.treatment).toBe(treatment);
  }
  expect(creativeDirectionSchema.safeParse({...d,decisions:d.decisions.map(c=>({...c,rationale:''}))}).success).toBe(false);
 });
 it('requires meaningful convergence review but permits justified reuse',()=>{
  const d=makeDirection();expect(creativeDirectionSchema.safeParse({...d,convergenceReview:{...d.convergenceReview,recentAssets:[]}}).success).toBe(false);
  expect(creativeDirectionSchema.safeParse({...d,convergenceReview:{...d.convergenceReview,unresolvedConvenienceReuse:['Inherited narrator without evaluation']}}).success).toBe(false);
  expect(creativeDirectionSchema.safeParse({...d,convergenceReview:{...d.convergenceReview,recentAssets:d.convergenceReview.recentAssets.map(p=>({...p,assessment:'justified-reuse'}))}}).success).toBe(true);
 });
 it('requires owner review only when declared significant, and never invents approval',()=>{
  const d=makeDirection();expect(creativeDirectionSchema.safeParse({...d,ownerReview:{required:true,rationale:'Major departure.'}}).success).toBe(false);
  expect(creativeDirectionDraftSchema.safeParse(d).success).toBe(false);
  expect(creativeDirectionDraftSchema.safeParse({...d,state:'proposal',ownerReview:{required:true,rationale:'Major departure.'}}).success).toBe(true);
 });
 it('keeps platform/publication scope independent',()=>{
  const d=makeDirection();expect(creativeDirectionSchema.safeParse({...d,platformApprovalGranted:true}).success).toBe(false);
  expect(creativeDirectionSchema.safeParse({...d,publicationApprovalGranted:true}).success).toBe(false);
 });
 it('uses the provider boundary, records provenance, and compares supplied historical assets',async()=>{
  const d={...makeDirection(),state:'proposal'};let calls=0;
  const provider={id:'fixture',generateStructured:async()=>{calls++;return {output:d,model:'fixture',generatedAt:'2026-10-01T00:00:00Z'};}};
  const generated=await proposeCreativeDirection(provider,{knowledgePackage:pkg,contentAsset:asset,recentAssets:[recent],brief:'Test only'});
  expect(generated.provenance.workflowId).toBe('workflow.creative-direction');expect(calls).toBe(1);
  await expect(proposeCreativeDirection(provider,{knowledgePackage:pkg,contentAsset:{...asset,editorialStatus:'draft'},recentAssets:[recent],brief:'Test only'})).rejects.toThrow('approved');expect(calls).toBe(1);
  await expect(proposeCreativeDirection(provider,{knowledgePackage:pkg,contentAsset:asset,recentAssets:[],brief:'Test only'})).rejects.toThrow('exact supplied');
 });
 it('allows non-Kokoro narration provenance without requiring a universal voice',()=>{
  expect(videoSpecSchema.parse({...phantomTraffic,audio:{...phantomTraffic.audio,provenance:{...phantomTraffic.audio.provenance!,narration:{...phantomTraffic.audio.provenance!.narration,provider:'licensed-provider',voiceId:'explicit-story-choice'}}}}).audio.provenance?.narration.voiceId).toBe('explicit-story-choice');
 });
 it('validates adaptive captions independently of V1 aesthetics without losing speech fidelity',()=>{
  const d=makeDirection();const input={schemaVersion:2,id:'caption-plan.test',revision:1,status:'draft',creativeDirection:ref(d),approvedScriptSha256:d.approvedScriptSha256,fps:30,coverage:'complete-narration',visualTreatment:{fontAsset:'Licensed font evidence',fontFamily:'Story font',fontSize:55,fontWeight:600,lineHeight:1.2,foreground:'#ffffff',emphasisMethod:'Weight only',backdrop:'None',animation:'Still',rendererId:'renderer.test',rationale:'Visual restraint suits this fixture.'},cues:[{id:'test',sourceNarrationCueId:'speech',startFrame:0,endFrame:60,lines:['Can sometimes grow.'],bounds:{x:100,y:300,width:700,height:100},presentationIntent:'Preserve the qualifier.'}]};
  const narration=asset.script.segments.map((s,i)=>({id:`speech-${i}`,transcript:s.text,start:i*4,duration:4}));
  input.cues=narration.map((n,i)=>({...input.cues[0]!,id:`caption-${i}`,sourceNarrationCueId:n.id,startFrame:i*120,endFrame:(i+1)*120,lines:[n.transcript]}));
  expect(validateAdaptiveCaptionPlan(input,narration,{width:1080,height:1920},d,asset).visualTreatment.animation).toBe('Still');
  expect(()=>validateAdaptiveCaptionPlan({...input,cues:[{...input.cues[0],lines:['Always grows.']},...input.cues.slice(1)]},narration,{width:1080,height:1920},d,asset)).toThrow('fidelity');
  expect(()=>validateAdaptiveCaptionPlan({...input,cues:[{...input.cues[0],endFrame:130}]},narration,{width:1080,height:1920},d,asset)).toThrow('timing');
  expect(()=>validateAdaptiveCaptionPlan({...input,creativeDirection:{...ref(d),sha256:'0'.repeat(64)}},narration,{width:1080,height:1920},d,asset)).toThrow('stale');
 });
 it('keeps topic labels and hook mechanisms open without imposing domain styles',()=>{
  expect(hookArchetypeSchema.parse('narrative-cold-open')).toBe('narrative-cold-open');
  expect(videoSpecSchema.parse({...phantomTraffic,pillar:'philosophy-ideas'}).pillar).toBe('philosophy-ideas');
 });
 it('persists and verifies the new CI envelope without granting approval',async()=>{
  const input={knowledgePackage:pkg,contentAsset:asset,recentAssets:[recent],brief:'Test only'};
  const generated=await proposeCreativeDirection({id:'fixture',generateStructured:async()=>({output:{...makeDirection(),state:'proposal'},model:'fixture',generatedAt:'2026-10-01T00:00:00Z'})},input);
  const run=createWorkflowRun({id:'run.creative-test',stage:'creative-direction',candidate:woodFrogFreezeTopicCandidate,workflow:creativeDirectionWorkflow,input,inputReferences:generated.provenance.inputReferences,generated,validatedAt:'2026-10-01T00:00:00Z',derivedArtifacts:[{kind:'creative-direction',id:generated.artifact.id,revision:1}]});
  expect(run.review.status).toBe('awaiting-human');expect(validateWorkflowRunEnvelope(run)).toEqual(run);
  expect(()=>validateWorkflowRunEnvelope({...run,response:{...run.response,outputSha256:'0'.repeat(64)}})).toThrow('hash');
 });
 it('rejects forged future plan source hashes even when direction is valid',()=>{
  const d=makeDirection();const p=futurePlan(d);
  expect(()=>validateProductionPlanReferences({...p,knowledgePackage:{...p.knowledgePackage,sha256:'0'.repeat(64)}},pkg,asset,d)).toThrow('hashes');
 });

});
