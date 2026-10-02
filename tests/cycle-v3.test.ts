import {execFileSync} from 'node:child_process';
import {convergenceFixture,copyComparisonEvidence} from './fixtures/visual-convergence';
import type {CreativeDirection} from '../src/content-assets/creative-direction';
import {createRequire} from 'node:module';
import {openMediaCatalog,persistMediaArtifact} from '../src/artifacts/catalog';
import {validateLearningSignal} from '../src/workflow/learning';
import {projectLegacyPresentationProfile} from '../src/workflow/profile-compatibility';
import {mkdtempSync,writeFileSync,readFileSync,rmSync,mkdirSync,cpSync,realpathSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {afterEach,describe,it,expect} from 'vitest';
import {loadMediaRegistry,mediaHash,mediaReference} from '../src/artifacts/media';
import {sha256Json} from '../src/content-intelligence/run-schema';
import {knowledgePackageSchema} from '../src/knowledge/schema';
import {contentAssetSchema} from '../src/content-assets/schema';
import {verifyInternalEditorial} from '../src/workflow/editorial';
import {assessPresentationV3} from '../src/workflow/presentation';
import {startCycle,transitionCycle,runUntilGate,nextAction,validatePlatformCoverage,type CycleEvent} from '../src/workflow/cycle';
import {initializeCycle,loadCycle,persistCycleEvent,recoverCycleEvent,loadCurrentCycle,loadProjectCycles,projectCycleOverview} from '../src/workflow/store';
import {cycleDeliverySchema,inspectCycleRelease,resolveAuthorizedCycleUpload} from '../src/workflow/release';
import {validateTopicSelection,chooseTopicAutonomously} from '../src/workflow/topic-selection';
import {publicationRegistry,createPublicationRegistry,platformAccountRegistry} from '../src/operations/registry';
import {publicationRecords} from '../src/operations/publications';
import {generateDeliveryPackage,validateDeliveryPackage} from '../scripts/delivery-packages';
import {chocolatePublicationDeliveryDependencies} from '../scripts/chocolate-publication-delivery';
import {chocolatePublicationVariants} from '../src/platform-variants/variants/chocolate-crystal-choice-publication';
import {createPlatformVariantRegistry} from '../src/platform-variants/registry';
import {resolveDeliveryUpload} from '../src/delivery/media-bindings';
import type {RecordReference} from '../src/workflow/evidence';
const temps:string[]=[];
afterEach(()=>temps.splice(0).forEach(p=>rmSync(p,{recursive:true,force:true})));
const read=(path:string)=>JSON.parse(readFileSync(path,'utf8'));
const now='2026-10-02T13:00:00.000Z';
const registry=loadMediaRegistry();
/** Test-only replay of existing Chocolate inputs/bytes. No production or real owner decision is issued. */
const fixture=(cycleId='cycle.test-only',sharedRoot?:string)=>{
  const root=sharedRoot??mkdtempSync(join(tmpdir(),'magnivis-v3-test-'));if(!sharedRoot)temps.push(root);let sequence=0;
  const put=(data:unknown):RecordReference=>{const path=`${cycleId}-fixture-${++sequence}.json`;writeFileSync(join(root,path),JSON.stringify(data,null,2)+'\n');return {path,sha256:mediaHash(join(root,path))};};
  const pkg=knowledgePackageSchema.parse(read('content-intelligence/reviews/chocolate-crystal-choice-approved-v3/knowledge-package.approved.json'));
  const asset=contentAssetSchema.parse(read('content-intelligence/reviews/chocolate-crystal-choice-approved-v3/content-asset.approved.json'));
  const review={schemaVersion:3 as const,cycleId,topicCandidateId:'existing-chocolate',enteredAt:now,reviewer:'Synthetic test operator; not Ahmet',packageSha256:sha256Json(pkg),assetSha256:sha256Json(asset),scriptSha256:sha256Json(asset.script),
    inspections:pkg.sources.map(s=>({sourceId:s.id,accessStatus:'inspected' as const,identityConfirmed:true,evidenceLocations:pkg.claims.flatMap(c=>c.evidence.filter(e=>e.sourceId===s.id).map(e=>e.locator??'fixture locator')),supportsClaimIds:pkg.claims.filter(c=>c.evidence.some(e=>e.sourceId===s.id)).map(c=>c.id),limitations:['Synthetic inspection metadata for invariant testing, not renewed factual evidence.'],sourceQualityRationale:'Test fixture only.',inspectedEvidence:put({sourceId:s.id,url:s.url,retrievedAt:now,accessStatus:'inspected',inspectedText:'Synthetic test evidence; NOT an actual source acquisition or factual re-verification.',acquisition:'manual-source-inspection'})})),
    claims:pkg.claims.map(c=>({id:c.id,statementSha256:sha256Json(c.statement),disposition:asset.selectedClaimIds.includes(c.id)?'verify' as const:'reserve' as const,rationale:'Fixture disposition preserves all reserve statuses.',evidence:c.evidence.map(e=>({sourceId:e.sourceId,locator:e.locator??'fixture locator',assessment:'Synthetic sufficient-for-wording test assessment.',sufficientForWording:true})),qualificationsPreserved:true})),misconceptionSafeguards:['Retain existing chocolate qualifications; fixture only.'],comprehensionReview:'Existing script reused for integration testing.',rightsReview:'Existing retained media is referenced, never regenerated.',careAssessment:{state:'routine',rationale:'Synthetic test of non-sensitive existing record.'},exceptionalConditions:[]};
  const editorial=verifyInternalEditorial(review,pkg,asset,root);
  const reference=(a:{id:string;revision:number})=>({id:a.id,revision:a.revision,sha256:sha256Json(a)});
  const direction:CreativeDirection={...read('content-intelligence/reviews/chocolate-crystal-choice-production-v1/direction-approved-v2.json'),knowledgePackage:reference(editorial.knowledgePackage),contentAsset:reference(editorial.contentAsset),convergenceReview:convergenceFixture(now,editorial.contentAsset.id),provenance:{method:'manual-editorial',enteredAt:now,notes:'Synthetic cycle test direction only.'},ownerReview:{required:false,rationale:'Synthetic routine internal-direction fixture.'}};
  copyComparisonEvidence(root,direction.convergenceReview);
  const caption={...read('src/captions/plans/chocolate.json'),creativeDirection:reference(direction)};
  const originalPlan=read('src/production/plans/chocolate.json');const {ownerDecision:_owner,...rest}=originalPlan;void _owner;
  const plan={...rest,internalEditorialAuthority:editorial.authority,knowledgePackage:reference(editorial.knowledgePackage),contentAsset:reference(editorial.contentAsset),creativeDirection:reference(direction),captions:{...rest.captions,captionPlanSha256:sha256Json(caption)}};
  const media=mediaReference(registry.byHash('3491a81c031c459493909ef55dcf217699ac30d01a714942da90ce4e963814e7')!);
  const narration=read('src/production/narration/chocolate.json').cues.map((c:{id:string;transcript:string;start:number;duration:number;file:string})=>({id:c.id,transcript:c.transcript,start:c.start,duration:c.duration,media:mediaReference(registry.byHash(mediaHash(`public/${c.file}`))!)}));
  const checks={technical:'passed',typography:'passed',captions:'passed',audio:'passed'};
  const qa=put({fixtureOnly:true,mediaSha256:media.sha256,scriptSha256:sha256Json(asset.script),checks});
  const candidate={schemaVersion:3,cycleId:review.cycleId,media,durationSeconds:plan.format.durationSeconds,scriptSha256:sha256Json(asset.script),productionPlan:put(plan),captionPlan:put(caption),narrationBundle:put(read('src/production/narration/chocolate.json')),narration,qa:{...checks,reports:[qa]},factualSafeguards:['Existing approved wording preserved.'],uncertainties:['Synthetic test review; no actual human review or device capture.'],unusualProduction:[]};
  const source=put({fixtureOnly:true});
  const comparison={curiosityReview:{honestPremise:'Same ingredients can yield different texture.',coldAudienceReason:'A familiar material visibly transforms.',interestOrigin:'premise-led',storyRoute:'Transformation explanation',truthBoundary:{state:'credible-lead',rationale:'Existing inspected fixture inputs; no renewed claim verification.'},opportunityJudgment:{sufficient:true,rationale:'Synthetic opportunity adequate for this test.'},shareability:null},novelty:'Fixture history comparison.',evidenceFeasibility:'Fixture qualitative comparison.',explanatoryPayoff:'Fixture explanation.',visualPotential:'Different media remain eligible.',audienceCuriosity:'Fixture curiosity.',productionFeasibility:'Existing renderer gives no advantage.',portfolioDiversity:'Open domains.',comparison:'Inspect alternatives qualitatively.',evidence:[source],limitations:[]};
  const selection={selectionStandard:'cold-audience-curiosity.v1',poolReview:{adequateOpportunityFound:true,rationale:'Synthetic sufficient opportunity.',nextSearchChange:null},schemaVersion:3,cycleId,method:'qualitative-open-world-comparison',searchRecord:source,searchBreadth:'Synthetic pool, not actual new discovery.',classificationAfterDiscovery:true,historyReviewed:[source],analyticsInfluence:'provenance-bearing-signals-not-category-rules',convenienceAdvantageRejected:true,candidates:[{...comparison,id:'existing-chocolate',subject:'Existing test record',domains:['unrestricted-test-domain'],disposition:'eligible'},{...comparison,id:'alternative-fixture',subject:'Synthetic alternative',domains:['future-domain'],disposition:'inadequate-evidence'}],selectedId:'existing-chocolate',outcome:'selected',rationale:'Test-only selected existing record; no real topic chosen.'};
  const authority=put({schemaVersion:3,cycleId:review.cycleId,enteredAt:now,evidenceBasis:'explicit-owner-cycle-start',instruction:'SYNTHETIC TEST AUTHORITY ONLY; no real cycle start.',internalPipelineAuthorized:true,externalActionsAuthorized:false});
  const records={discovery:put(selection),editorial:put({draftPackage:pkg,draftAsset:asset,review}),creative:put(direction),production:put(candidate)};
  const event=(stage:keyof typeof records):CycleEvent=>({type:'complete-internal',stage,record:records[stage],at:now});
  const decision=(gate:'master-review'|'publication-review',target:unknown,choice='approve',acceptedUnknowns:string[]=[])=>put({schemaVersion:3,id:'owner-decision.test-only',revision:1,gate,cycleId:review.cycleId,targetSha256:sha256Json(target),decision:choice,enteredAt:now,suppliedReviewTime:null,reviewer:'Synthetic fixture, not Ahmet',evidenceBasis:'explicit-owner-message',instruction:'TEST ONLY, not a real owner approval.',acceptedUnknowns});
  const releaseFixture=(evaluatedRegistry=registry)=>{
    const media=candidate.media;
    const midpointFrames=caption.cues.map((c:{startFrame:number;endFrame:number})=>Math.floor((c.startFrame+c.endFrame)/2));
    const deliveries=chocolatePublicationVariants.map(v=>{
      const unknown={state:'unknown',regions:null,rationale:'No measured geometry in this test.',provenance:[]};
      const profile={schemaVersion:3,id:`profile.test.${v.platform}`,revision:1,platform:v.platform,surface:v.surface,canvas:{width:1080,height:1920},reviewedAt:now,reviewAfter:'2026-11-02T13:00:00.000Z',lifecycle:'current',compositionSafe:{state:'provisional',regions:[{x:0,y:0,width:1080,height:1920}],rationale:'Test-only full canvas, not platform geometry.',provenance:[source]},nativeExclusions:unknown,captionSafe:unknown,cropSafe:unknown,export:{containers:['mp4'],videoCodecs:['h264'],audioCodecs:['aac'],fps:[30],duration:{minimum:0,maximum:180},provenance:[source],rationale:'Fixture envelope, not a claim about external specifications.'}};
      const samples=[...midpointFrames.map((frame:number)=>({frame,kind:'caption-midpoint',bounds:{x:300,y:900,width:100,height:100}})),...(['hook','payoff','disclosure'] as const).map(kind=>({frame:0,kind,bounds:{x:300,y:500,width:100,height:100}}))];
      const presentation={schemaVersion:3,media,platform:v.platform,surface:v.surface,profileSha256:sha256Json(profile),inspectedAt:now,fps:30,durationFrames:1195,samples,coverage:{method:'sampled-bounds',captionMidpoints:midpointFrames,hookFrames:[0],payoffFrames:[0],disclosureFrames:[0]},reports:[source],device:{state:'not-tested',device:null,testedAt:null,evidence:[]}};
      const variant={id:v.id,revision:3,platform:v.platform,surface:v.surface,media,master:media,relationship:'exact-master',adaptationReason:null,presentation:put(presentation),profile:put(profile)};
      const manifest=put({schemaVersion:3,id:`delivery.test.${v.platform}`,cycleId:review.cycleId,variantSha256:sha256Json(variant),media,artifacts:[{role:'video',media}],metadata:put({cycleId:review.cycleId,variantId:v.id,platform:v.platform,surface:v.surface,media,claimIds:asset.selectedClaimIds,fixtureOnly:true}),uploadCopy:source,state:'prepared'});
      return {variant,manifest};
    });
    const release={schemaVersion:3 as const,cycleId:review.cycleId,deliveries};
    const acceptedUnknowns=deliveries.flatMap(({variant})=>assessPresentationV3(read(join(root,variant.presentation.path)),read(join(root,variant.profile.path)),media,evaluatedRegistry,now,root).unknowns.map(u=>`${variant.id}: ${u}`));
    return {release,record:put(release),acceptedUnknowns};
  };
  const preflight=releaseFixture().release.deliveries.map(d=>({profile:d.variant.profile,evidence:d.variant.presentation}));
  plan.presentationProfiles=preflight.map(p=>p.profile);candidate.productionPlan=put(plan);Object.assign(candidate,{platformPreflight:preflight});records.production=put(candidate);
  return {root,put,pkg,asset,review,editorial,direction,plan,caption,candidate,media,authority,records,event,decision,selection,releaseFixture};
};

describe('Cycle V3 generic lifecycle and integration',()=>{
  it('runs fresh media, a fresh derivative, complete release, backlog and isolated late publication in one catalog lifecycle',async()=>{
    const f=fixture('cycle.integration-a');mkdirSync(join(f.root,'artifacts'),{recursive:true});
    const narrationRecords=f.candidate.narration.map((n:{media:ReturnType<typeof mediaReference>})=>registry.get(n.media));
    const comparisonRecords=f.direction.convergenceReview.recentAssets.flatMap(r=>[r.visualComparison!.master,...r.visualComparison!.inspectedVisuals]).map(m=>registry.get(m));
    const existingRecords=[...narrationRecords,...comparisonRecords];
    for(const m of existingRecords){mkdirSync(join(f.root,m.canonicalPath,'..'),{recursive:true});cpSync(registry.resolveFile(mediaReference(m)),join(f.root,m.canonicalPath));for(const source of m.provenance.sourceRecords){mkdirSync(join(f.root,source,'..'),{recursive:true});cpSync(source,join(f.root,source));}}
    writeFileSync(join(f.root,'artifacts/media-catalog.json'),JSON.stringify({schemaVersion:2,artifacts:existingRecords}));
    const live=openMediaCatalog(f.root);const stale=loadMediaRegistry(f.root);const initialSnapshot=live.list();const proof=f.put({fixtureOnly:true,purpose:'Generic ffmpeg color/silence engineering fixture, not production content or real QA.'});
    const generate=(name:string,color:string,parents:ReturnType<typeof mediaReference>[]=[] )=>{
      const path=`artifacts/${name}.mp4`;const ffmpeg=createRequire(import.meta.url)('ffmpeg-static') as string;
      execFileSync(ffmpeg,['-v','error','-f','lavfi','-i',`color=c=${color}:s=1080x1920:r=30`,'-f','lavfi','-i','anullsrc=r=48000:cl=stereo','-t',String(f.plan.format.durationSeconds),'-c:v','libx264','-preset','ultrafast','-threads','1','-pix_fmt','yuv420p','-c:a','aac',join(f.root,path)]);
      const sha256=mediaHash(join(f.root,path));
      return persistMediaArtifact({id:`media.${sha256}`,sha256,canonicalPath:path,mediaType:'video/mp4',bytes:readFileSync(join(f.root,path)).length,parents,provenance:{kind:parents.length?'platform-adaptation':'original-production',sourceCommit:'a'.repeat(40),sourceRecords:[proof.path],createdAt:now,creationTimeUnknownReason:null}},f.root);
    };
    const bindCandidate=(fixtureData:ReturnType<typeof fixture>,media:ReturnType<typeof mediaReference>)=>{
      fixtureData.candidate.media=media;
      fixtureData.candidate.qa.reports=[fixtureData.put({mediaSha256:media.sha256,scriptSha256:fixtureData.candidate.scriptSha256,checks:{technical:'passed',typography:'passed',captions:'passed',audio:'passed'},fixtureOnly:true})];
      const preflight=fixtureData.releaseFixture(live).release.deliveries.map(d=>({profile:d.variant.profile,evidence:d.variant.presentation}));
      fixtureData.plan.presentationProfiles=preflight.map(p=>p.profile);fixtureData.candidate.productionPlan=fixtureData.put(fixtureData.plan);
      Object.assign(fixtureData.candidate,{platformPreflight:preflight});fixtureData.records.production=fixtureData.put(fixtureData.candidate);
    };
    let generated:ReturnType<typeof mediaReference>|null=null;
    const initial=initializeCycle(f.root,f.authority);
    const master=await runUntilGate(initial,live,async stage=>{
      if(stage==='production'){generated=generate('new-master','black');expect(initialSnapshot.some(m=>m.sha256===generated!.sha256)).toBe(false);expect(()=>stale.get(generated!)).toThrow(/Missing/);bindCandidate(f,generated);}
      return f.event(stage as keyof typeof f.records);
    },(previous,_next,event)=>{persistCycleEvent(f.root,previous,event,live);},f.root);
    expect(master.stage).toBe('master-review');expect(live.resolveFile(f.candidate.media)).toBe(realpathSync(join(f.root,'artifacts/new-master.mp4')));
    const approved=persistCycleEvent(f.root,master,{type:'owner-decision',record:f.decision('master-review',f.candidate),at:now},live);
    const derivative=generate('new-derivative','blue',[f.candidate.media]);expect(live.get(derivative).parents).toEqual([f.candidate.media]);
    const r=f.releaseFixture(live);const target=r.release.deliveries.find(d=>d.variant.platform==='tiktok')!;
    const evidence=read(join(f.root,target.variant.presentation.path));
    const qa=f.put({mediaSha256:derivative.sha256,scriptSha256:f.candidate.scriptSha256,checks:{technical:'passed',typography:'passed',captions:'passed',audio:'passed'},fixtureOnly:true});
    const variant={...target.variant,media:derivative,relationship:'derivative',adaptationReason:'Synthetic layout-difference fixture; no real native geometry claimed.',presentationInputs:{captionPlan:f.candidate.captionPlan,narrationBundle:f.candidate.narrationBundle},presentation:f.put({...evidence,media:derivative,reports:[qa]})};
    const old=read(join(f.root,target.manifest.path));const metadata=read(join(f.root,old.metadata.path));
    const manifest=f.put({...old,media:derivative,variantSha256:sha256Json(variant),artifacts:[{role:'video',media:derivative}],metadata:f.put({...metadata,media:derivative})});
    const release={...r.release,deliveries:r.release.deliveries.map(d=>d===target?{variant,manifest}:d)};
    const sourceEvidenceVariant={...variant,presentation:target.variant.presentation};
    const sourceEvidenceManifest=f.put({...read(join(f.root,manifest.path)),variantSha256:sha256Json(sourceEvidenceVariant)});
    expect(()=>inspectCycleRelease({...release,deliveries:[{variant:sourceEvidenceVariant,manifest:sourceEvidenceManifest}]},live,now,f.root)).toThrow(/exact evaluated/);
    const prepared=persistCycleEvent(f.root,approved,{type:'complete-internal',stage:'presentation',record:f.put(release),at:now},live);
    expect(prepared.stage).toBe('publication-review');expect(new Set(release.deliveries.map(d=>d.variant.media.sha256)).size).toBe(2);
    const unknowns=inspectCycleRelease(release,live,now,f.root).unknowns;const decision=f.decision('publication-review',release,'approve',unknowns);
    expect(()=>resolveAuthorizedCycleUpload(release,f.decision('publication-review',release,'reject',unknowns),live,f.root)).toThrow(/not owner authorized/);
    const authorized=persistCycleEvent(f.root,prepared,{type:'owner-decision',record:decision,at:now},live);
    const report=f.put({cycleId:authorized.id,variantId:target.variant.id,media:derivative,manifestSha256:manifest.sha256,evidenceBasis:'explicit-owner-message',observedAt:null,state:'scheduled-owner-reported'});
    const scheduled=persistCycleEvent(f.root,authorized,{type:'observe',kind:'scheduled-owner-reported',record:report,at:now},live);
    expect(persistCycleEvent(f.root,scheduled,{type:'observe',kind:'scheduled-owner-reported',record:report,at:now},live)).toEqual(scheduled);
    expect(scheduled.observations.filter(o=>o.kind==='published')).toHaveLength(0);
    const b=fixture('cycle.integration-b',f.root);bindCandidate(b,f.candidate.media);const startB=initializeCycle(f.root,b.authority);expect(()=>transitionCycle(startB,f.event('discovery'),live,f.root)).toThrow(/another cycle/);
    const masterB=await runUntilGate(startB,live,async stage=>b.event(stage as keyof typeof b.records),(previous,_next,event)=>{persistCycleEvent(f.root,previous,event,live);},f.root);
    expect(masterB.stage).toBe('master-review');const bBefore=readFileSync(join(f.root,'workflow/cycles',masterB.id,'state.json'));
    const d=release.deliveries.find(d=>d.variant.platform==='youtube')!;const publication=structuredClone(publicationRegistry.list().find(p=>p.platform==='youtube')!);
    Object.assign(publication,{id:'publication.synthetic-integration-a',state:'published',publishedOn:'2026-10-02',remote:{postId:'synthetic-test-only',url:'https://example.com/synthetic-not-a-publication'}});delete publication.ownerReport;
    publication.source={...publication.source,platformVariant:{id:d.variant.id,revision:d.variant.revision},contentAsset:{id:f.editorial.contentAsset.id,revision:f.editorial.contentAsset.revision},knowledgePackage:{id:f.editorial.knowledgePackage.id,revision:f.editorial.knowledgePackage.revision},mediaArtifact:d.variant.media,videoSha256:d.variant.media.sha256,delivery:{id:read(join(f.root,d.manifest.path)).id,state:'ready-for-manual-upload',relationship:'used-for-upload',manifestSha256:d.manifest.sha256}};
    publication.approval.ownerDecision={id:'owner-decision.test-only',revision:1,sha256:decision.sha256};
    const publicationRef=f.put(publication);const published=persistCycleEvent(f.root,scheduled,{type:'observe',kind:'published',record:publicationRef,at:now},live);
    expect(()=>persistCycleEvent(f.root,published,{type:'close',record:f.put({cycleId:published.id,releaseSha256:published.release!.sha256,unresolvedConsequentialIssues:[],analyticsState:'not-observed'}),at:now},live)).toThrow(/missing publication evidence/);
    expect(()=>persistCycleEvent(f.root,published,{type:'observe',kind:'published',record:f.put({...publication,source:{...publication.source,delivery:{...publication.source.delivery,manifestSha256:'0'.repeat(64)}}}),at:now},live)).toThrow(/binding mismatch/);
    expect(persistCycleEvent(f.root,published,{type:'observe',kind:'published',record:publicationRef,at:now},live)).toEqual(published);
    expect(()=>persistCycleEvent(f.root,published,{type:'observe',kind:'published',record:f.put({...publication,remote:{...publication.remote,postId:'different-synthetic-id'}}),at:now},live)).toThrow(/Conflicting duplicate/);
    expect(published.observations.filter(o=>o.kind==='published')).toHaveLength(1);
    expect(readFileSync(join(f.root,'workflow/cycles',masterB.id,'state.json')).equals(bBefore)).toBe(true);
    expect(projectCycleOverview(loadProjectCycles(f.root,live),f.root).ownerActions.map(a=>a.cycleId)).toContain(masterB.id);
    expect(()=>persistCycleEvent(f.root,masterB,{type:'observe',kind:'published',record:f.put(publication),at:now},live)).toThrow(/authorized release/);
    const approvedB=persistCycleEvent(f.root,masterB,{type:'owner-decision',record:b.decision('master-review',b.candidate),at:now},live);
    const releaseB=b.releaseFixture(live);const preparedB=persistCycleEvent(f.root,approvedB,{type:'complete-internal',stage:'presentation',record:releaseB.record,at:now},live);
    const authorizedB=persistCycleEvent(f.root,preparedB,{type:'owner-decision',record:b.decision('publication-review',releaseB.release,'approve',releaseB.acceptedUnknowns),at:now},live);
    expect(()=>persistCycleEvent(f.root,authorizedB,{type:'observe',kind:'published',record:publicationRef,at:now},live)).toThrow(/binding mismatch/);
    expect(projectCycleOverview(loadProjectCycles(f.root,live),f.root).publicationAuthorized).toEqual(['cycle.integration-a','cycle.integration-b']);
    const c=fixture('cycle.integration-c',f.root);expect(initializeCycle(f.root,c.authority).stage).toBe('discovery');
  },90000);
  it('rejects stale catalog snapshots, removal, rewritten metadata, duplicate bytes and corrupted resolution',()=>{
    const f=fixture();mkdirSync(join(f.root,'artifacts'),{recursive:true});writeFileSync(join(f.root,'artifacts/media-catalog.json'),JSON.stringify({schemaVersion:2,artifacts:[]}));
    const live=openMediaCatalog(f.root);const proof=f.put({fixtureOnly:true});const path='artifacts/test.wav';writeFileSync(join(f.root,path),Buffer.from('synthetic engineering bytes, not production audio'));
    const hash=mediaHash(join(f.root,path));const artifact={id:`media.${hash}`,sha256:hash,canonicalPath:path,mediaType:'audio/wav',bytes:readFileSync(join(f.root,path)).length,parents:[],provenance:{kind:'original-production' as const,sourceCommit:'a'.repeat(40),sourceRecords:[proof.path],createdAt:now,creationTimeUnknownReason:null}};
    const ref=persistMediaArtifact(artifact,f.root);expect(live.get(ref)).toEqual(artifact);
    expect(()=>persistMediaArtifact({...artifact,provenance:{...artifact.provenance,createdAt:'2026-10-03T13:00:00.000Z'}},f.root)).toThrow(/immutable media metadata/);
    cpSync(join(f.root,path),join(f.root,'artifacts/duplicate.wav'));expect(()=>persistMediaArtifact({...artifact,canonicalPath:'artifacts/duplicate.wav'},f.root)).toThrow(/Duplicate payload/);
    writeFileSync(join(f.root,path),'corrupted');expect(()=>live.resolveFile(ref)).toThrow(/integrity/);
    writeFileSync(join(f.root,'artifacts/media-catalog.json'),JSON.stringify({schemaVersion:2,artifacts:[]}));expect(()=>live.list()).toThrow(/removed or rewrote/);
  });
  it('rejects matching evidence/profile for the wrong destination and surface',()=>{
    const f=fixture();const r=f.releaseFixture();const original=r.release.deliveries[0]!;
    for(const change of [{platform:'tiktok'},{surface:'wrong-surface'}]){
      const variant={...original.variant,...change};const old=read(join(f.root,original.manifest.path));
      const metadata=read(join(f.root,old.metadata.path));
      const manifest=f.put({...old,variantSha256:sha256Json(variant),metadata:f.put({...metadata,platform:variant.platform,surface:variant.surface})});
      expect(()=>inspectCycleRelease({...r.release,deliveries:[{variant,manifest}]},registry,now,f.root)).toThrow(/destination/);
    }
    const instagram=r.release.deliveries.find(d=>d.variant.platform==='instagram')!;
    const facebook=r.release.deliveries.find(d=>d.variant.platform==='facebook')!;
    const variant={...facebook.variant,profile:instagram.variant.profile,presentation:instagram.variant.presentation};
    const manifest=f.put({...read(join(f.root,facebook.manifest.path)),variantSha256:sha256Json(variant)});
    expect(()=>inspectCycleRelease({...r.release,deliveries:[{variant,manifest}]},registry,now,f.root)).toThrow(/destination/);
  });
  it('requires all and only authorized platforms, including closure validation',async()=>{
    const f=fixture();const cycle=startCycle(f.authority,f.root);const r=f.releaseFixture().release;
    const master=await runUntilGate(cycle,registry,async stage=>f.event(stage as keyof typeof f.records),()=>{},f.root);
    const locked=transitionCycle(master,{type:'owner-decision',record:f.decision('master-review',f.candidate),at:now},registry,f.root);
    expect(()=>validatePlatformCoverage(cycle,r,f.root)).not.toThrow();
    for(const count of [1,3]){const missing={...r,deliveries:r.deliveries.slice(0,count)};expect(()=>validatePlatformCoverage(cycle,missing,f.root)).toThrow(/authorized target/);expect(()=>transitionCycle(locked,{type:'complete-internal',stage:'presentation',record:f.put(missing),at:now},registry,f.root)).toThrow(/authorized target/);}
    const authority=f.put({...read(join(f.root,f.authority.path)),targetPlatforms:['youtube','tiktok','instagram']});
    const restricted=startCycle(authority,f.root);
    expect(()=>validatePlatformCoverage(restricted,{...r,deliveries:r.deliveries.filter(d=>d.variant.platform!=='instagram')},f.root)).toThrow(/authorized target/);
  });
  it('resumes exact editorial judgment with journal authority and retains factual blocks',()=>{
    const f=fixture();const proposal={...f.review,careAssessment:{state:'owner-judgment-required',rationale:'Synthetic high-care treatment judgment.'}};
    let cycle=transitionCycle(startCycle(f.authority,f.root),f.event('discovery'),registry,f.root);
    const scope=f.put(proposal);cycle=transitionCycle(cycle,{type:'escalate',reason:'High-care treatment judgment',record:scope,at:now},registry,f.root);
    const exception=f.put(cycle.exception);
    const decisionData={...read(join(f.root,f.decision('master-review',proposal).path)),gate:'exception',targetSha256:sha256Json(cycle.exception),scope,validUntil:'2026-10-03T13:00:00.000Z'};
    const decision=f.put(decisionData);
    cycle=transitionCycle(cycle,{type:'owner-decision',record:decision,at:now},registry,f.root);
    const resumed={...proposal,exceptionResumptions:[{exception,decision,resumedAt:now}]};
    const record=f.put({draftPackage:f.pkg,draftAsset:f.asset,review:resumed});
    const next=transitionCycle(cycle,{type:'complete-internal',stage:'editorial',record,at:now},registry,f.root);
    expect(next.stage).toBe('creative');
    expect(()=>transitionCycle(cycle,{type:'complete-internal',stage:'editorial',record,at:'2026-10-04T13:00:00.000Z'},registry,f.root)).toThrow(/actual resumption event/);
    const escalatedAgain=transitionCycle(cycle,{type:'escalate',reason:'Superseding scoped treatment decision',record:scope,at:now},registry,f.root);
    const replacement=f.put({...decisionData,revision:2,targetSha256:sha256Json(escalatedAgain.exception)});
    const replaced=transitionCycle(escalatedAgain,{type:'owner-decision',record:replacement,at:now},registry,f.root);
    expect(()=>transitionCycle(replaced,{type:'complete-internal',stage:'editorial',record,at:now},registry,f.root)).toThrow(/journal-authorized/);
    expect(verifyInternalEditorial(resumed,f.pkg,f.asset,f.root,[decision]).authority.exceptionDecisions).toEqual([decision.sha256]);
    expect(()=>verifyInternalEditorial(resumed,f.pkg,f.asset,f.root)).toThrow(/journal-authorized/);
    expect(()=>verifyInternalEditorial({...resumed,careAssessment:{...proposal.careAssessment,rationale:'Unrelated changed scope'}},f.pkg,f.asset,f.root,[decision])).toThrow(/unrelated/);
    for(const change of [{validUntil:'2026-10-01T13:00:00.000Z'},{lifecycle:'superseded'},{cycleId:'cycle.other'}]){
      const bad=f.put({...decisionData,...change});const review={...resumed,exceptionResumptions:[{exception,decision:bad,resumedAt:now}]};
      expect(()=>verifyInternalEditorial(review,f.pkg,f.asset,f.root,[bad])).toThrow();
    }
    expect(()=>verifyInternalEditorial({...resumed,exceptionalConditions:['Unsupported central fact']},f.pkg,f.asset,f.root,[decision])).toThrow(/cannot be overridden/);
    const id=f.asset.selectedClaimIds[0]!;const pkg=knowledgePackageSchema.parse({...f.pkg,claims:f.pkg.claims.map(c=>c.id===id?{...c,verificationStatus:'uncertain'}:c)});
    const unsupported={...proposal,packageSha256:sha256Json(pkg)};const target=f.put(unsupported);const ex={...cycle.exception,reason:'Treatment only',target,resumeStage:'editorial'};const exRef=f.put(ex);
    const approve=f.put({...decisionData,scope:target,targetSha256:sha256Json(ex)});
    expect(()=>verifyInternalEditorial({...unsupported,exceptionResumptions:[{exception:exRef,decision:approve,resumedAt:now}]},pkg,f.asset,f.root,[approve])).toThrow(/cannot automatically/);
  });
  it('runs all internal work from one start until exact master review with real retained media and no owner continuation',async()=>{
    const f=fixture();const events:CycleEvent[]=[];
    const current=await runUntilGate(startCycle(f.authority,f.root),registry,async stage=>{if(stage==='presentation')throw new Error('Must stop at master gate');const e=f.event(stage);events.push(e);return e;},()=>{},f.root);
    expect(events).toHaveLength(4);expect(nextAction(current)).toEqual({kind:'owner',gate:'master-review'});expect(current.masterDecision).toBeNull();
    const locked=transitionCycle(current,{type:'owner-decision',record:f.decision('master-review',f.candidate),at:now},registry,f.root);
    expect(locked.stage).toBe('presentation');
    const r=f.releaseFixture();const prepared=transitionCycle(locked,{type:'complete-internal',stage:'presentation',record:r.record,at:now},registry,f.root);
    expect(nextAction(prepared)).toEqual({kind:'owner',gate:'publication-review'});
    expect(()=>transitionCycle(prepared,{type:'owner-decision',record:f.decision('publication-review',r.release),at:now},registry,f.root)).toThrow(/each exact-media/);
    const decision=f.decision('publication-review',r.release,'approve',r.acceptedUnknowns);
    const authorized=transitionCycle(prepared,{type:'owner-decision',record:decision,at:now},registry,f.root);
    expect(resolveAuthorizedCycleUpload(r.release,decision,registry,f.root).map(p=>p.files[0]!.media)).toEqual(Array(4).fill(f.media));
    const report=f.put({cycleId:authorized.id,variantId:r.release.deliveries[0]!.variant.id,media:f.media,manifestSha256:r.release.deliveries[0]!.manifest.sha256,evidenceBasis:'explicit-owner-message',observedAt:null,state:'scheduled-owner-reported'});
    const scheduled=transitionCycle(authorized,{type:'observe',kind:'scheduled-owner-reported',record:report,at:now},registry,f.root);
    expect(scheduled.stage).toBe('authorized');expect(scheduled.observations.filter(o=>o.kind==='published')).toHaveLength(0);
    expect(()=>transitionCycle(scheduled,{type:'observe',kind:'published',record:report,at:now},registry,f.root)).toThrow();
  });
  it('replays immutable events and rejects forged state, stale concurrent writers and unsupported transition',()=>{
    const f=fixture();mkdirSync(join(f.root,'workflow/cycles'),{recursive:true});
    const initial=initializeCycle(f.root,f.authority);const after=persistCycleEvent(f.root,initial,f.event('discovery'),registry);
    expect(loadCycle(f.root,initial.id,registry)).toEqual(after);
    expect(()=>persistCycleEvent(f.root,initial,f.event('discovery'),registry)).toThrow(/Concurrent/);
    const path=join(f.root,'workflow/cycles',initial.id,'state.json');writeFileSync(path,JSON.stringify({...after,stage:'authorized'}));
    expect(()=>loadCycle(f.root,initial.id,registry)).toThrow(/differs from replayed/);
    expect(()=>transitionCycle(initial,f.event('production'),registry,f.root)).toThrow(/Unsupported/);
  });
  it('requires exact owner targets and preserves rejected candidate history',async()=>{
    const f=fixture();const candidate=await runUntilGate(startCycle(f.authority,f.root),registry,async stage=>f.event(stage as keyof typeof f.records),()=>{},f.root);
    expect(()=>transitionCycle(candidate,{type:'owner-decision',record:f.decision('master-review',{changed:true}),at:now},registry,f.root)).toThrow(/exact review target/);
    const revision=transitionCycle(candidate,{type:'owner-decision',record:f.decision('master-review',f.candidate,'revise'),at:now},registry,f.root);
    expect(revision.stage).toBe('production');expect(revision.candidate).toBeNull();expect(revision.receipts.some(r=>r.stage==='production')).toBe(true);
  });
  it('blocks central uncertain/conflicting claims, uninspected evidence, stale statements and incomplete ledgers',()=>{
    const f=fixture();const id=f.asset.selectedClaimIds[0]!;
    for(const state of ['uncertain','conflicting','unverified'] as const) {
      const pkg=knowledgePackageSchema.parse({...f.pkg,claims:f.pkg.claims.map(c=>c.id===id?{...c,verificationStatus:state}:c)});
      expect(()=>verifyInternalEditorial({...f.review,packageSha256:sha256Json(pkg)},pkg,f.asset,f.root)).toThrow(/cannot automatically/);
    }
    const stale={...f.review,claims:f.review.claims.map(c=>c.id===id?{...c,statementSha256:'0'.repeat(64)}:c)};
    expect(()=>verifyInternalEditorial(stale,f.pkg,f.asset,f.root)).toThrow(/wording changed/);
    expect(()=>verifyInternalEditorial({...f.review,claims:[]},f.pkg,f.asset,f.root)).toThrow();
    expect(()=>verifyInternalEditorial({...f.review,exceptionalConditions:['High-care uncertainty']},f.pkg,f.asset,f.root)).toThrow(/escalation/);
    const originalStates=new Map(f.pkg.claims.map(c=>[c.id,c.verificationStatus]));
    f.editorial.knowledgePackage.claims.filter(c=>!f.asset.selectedClaimIds.includes(c.id)).forEach(c=>expect(c.verificationStatus).toBe(originalStates.get(c.id)));
    expect(f.editorial.contentAsset.approval?.authority?.kind).toBe('internal-evidence-review');
  });
  it('allows open domains without owner topic choice but never forces an inadequate selection',async()=>{
    const f=fixture();expect(validateTopicSelection(f.selection,f.root).selectedId).toBe('existing-chocolate');
    expect(()=>validateTopicSelection({...f.selection,selectedId:'alternative-fixture'},f.root)).toThrow(/eligible/);
    const continuing={...f.selection,selectedId:null,outcome:'continue-discovery',poolReview:{adequateOpportunityFound:false,rationale:'No strong opportunity yet.',nextSearchChange:'Broaden search sources.'}};
    expect(validateTopicSelection(continuing,f.root).selectedId).toBeNull();
    const exhausted=await chooseTopicAutonomously({maximumRounds:1,root:f.root,discoverAndCompare:async()=>continuing,preserve:async record=>f.put(record)});
    expect(exhausted.outcome).toBe('continue-discovery');expect(exhausted.selection).toBeNull();
    const chosen=await chooseTopicAutonomously({maximumRounds:2,root:f.root,discoverAndCompare:async round=>round===1?continuing:f.selection,preserve:async record=>f.put(record)});
    expect(chosen.outcome).toBe('selected');expect(chosen.pools).toHaveLength(2);
  });
  it('binds platform evidence to exact media/profile/surface; unknown remains unknown and known collisions require adaptation',()=>{
    const f=fixture();const {release}=f.releaseFixture();const variant=release.deliveries[0]!.variant;
    const evidence=read(join(f.root,variant.presentation.path));const profile=read(join(f.root,variant.profile.path));
    const result=assessPresentationV3(evidence,profile,f.media,registry,now,f.root);expect(result.disposition).toBe('owner-risk-review');
    expect(()=>assessPresentationV3({...evidence,platform:'tiktok'},profile,f.media,registry,now,f.root)).toThrow(/exact evaluated/);
    expect(()=>assessPresentationV3({...evidence,media:mediaReference(registry.list().find(m=>m.sha256!==f.media.sha256)!)},profile,f.media,registry,now,f.root)).toThrow(/exact evaluated/);
    expect(()=>assessPresentationV3({...evidence,coverage:{...evidence.coverage,method:'all-frame-bounds'}},profile,f.media,registry,now,f.root)).toThrow(/all-frame/);
    const collisionProfile={...profile,nativeExclusions:{state:'provisional',regions:[{x:0,y:0,width:1080,height:1920}],provenance:profile.compositionSafe.provenance,rationale:'Synthetic collision.'}};
    expect(assessPresentationV3({...evidence,profileSha256:sha256Json(collisionProfile)},collisionProfile,f.media,registry,now,f.root).disposition).toBe('derivative-required');
    expect(()=>assessPresentationV3({...evidence,device:{state:'passed',device:null,testedAt:null,evidence:[]}},profile,f.media,registry,now,f.root)).toThrow(/actual device/);
  });
  it('rejects an incorrect historical manifest digest at generic publication registration',()=>{
    const records=structuredClone(publicationRecords);records[1]!.source.delivery.manifestSha256='0'.repeat(64);
    expect(()=>createPublicationRegistry(records,platformAccountRegistry)).toThrow(/manifest digest mismatch/);
    expect(publicationRegistry.list()).toHaveLength(5);
  });
  it('exercises actual Chocolate locked-master/caption/plan/cover inputs through native V3 reference packages and ffprobe, without production',()=>{
    const root=mkdtempSync(join(tmpdir(),'magnivis-v3-delivery-'));temps.push(root);
    const variants=chocolatePublicationVariants.map(v=>({...v,mediaArtifact:mediaReference(registry.byHash(v.sourceMaster!.artifact.sha256)!)}));
    const deps={...chocolatePublicationDeliveryDependencies,mediaRegistry:registry,variantRegistry:createPlatformVariantRegistry(variants,chocolatePublicationDeliveryDependencies.assetRegistry,registry)};
    const packages=variants.map(v=>generateDeliveryPackage({variantId:v.id,outputRoot:root,dependencies:deps}));
    expect(new Set(packages.map(p=>resolveDeliveryUpload(p.manifest,registry).uploadFile)).size).toBe(1);
    for(const p of packages){expect(p.manifest.schemaVersion).toBe(3);expect(validateDeliveryPackage(p.directory,deps)).toEqual(p.manifest);expect(p.manifest.source.productionChain?.lockedMaster.relationship).toBe('exact-master');}
  });
  it('recovers only a fully proven pending transaction and records in-progress work honestly',()=>{
    const f=fixture();mkdirSync(join(f.root,'workflow/cycles'),{recursive:true});
    const initial=initializeCycle(f.root,f.authority);const event=f.event('discovery');const next=transitionCycle(initial,event,registry,f.root);
    const eventPath=join(f.root,'workflow/cycles',initial.id,'event-1.json');
    writeFileSync(eventPath,JSON.stringify({previousSha256:sha256Json(initial),event,nextSha256:sha256Json(next)}));
    expect(()=>loadCycle(f.root,initial.id,registry)).toThrow(/Incomplete prior transaction/);
    expect(recoverCycleEvent(f.root,initial.id,registry)).toEqual(next);
    expect(loadCurrentCycle(f.root,registry)?.stage).toBe('editorial');
    const start=f.put({cycleId:initial.id,stage:'editorial',action:'Test-only internal stage start.'});
    const begun=persistCycleEvent(f.root,next,{type:'begin-internal',stage:'editorial',record:start,at:now},registry);
    expect(begun.workInProgress?.stage).toBe('editorial');expect(begun.candidate).toBeNull();
    expect(()=>transitionCycle(begun,{type:'begin-internal',stage:'editorial',record:start,at:now},registry,f.root)).toThrow(/already active/);
    expect(()=>initializeCycle(f.root,f.authority)).toThrow();
  });
  it('blocks wrong release file digests even with an approval, source-master evidence for derivatives and desktop device passes',()=>{
    const f=fixture();const r=f.releaseFixture();
    const bad={...r.release,deliveries:r.release.deliveries.map((d,i)=>i===0?{...d,manifest:{...d.manifest,sha256:'0'.repeat(64)}}:d)};
    expect(()=>resolveAuthorizedCycleUpload(bad,f.decision('publication-review',bad,'approve',r.acceptedUnknowns),registry,f.root)).toThrow(/digest mismatch/);
    const v=r.release.deliveries[0]!.variant;const ev=read(join(f.root,v.presentation.path));const profile=read(join(f.root,v.profile.path));
    expect(()=>assessPresentationV3({...ev,device:{state:'passed',context:'desktop-web',device:'Desktop browser',testedAt:now,reviewer:'Test operator',evidence:ev.reports}},profile,f.media,registry,now,f.root)).toThrow(/actual device/);
    const m=registry.list().find(m=>m.mediaType==='video/mp4'&&m.sha256!==f.media.sha256)!;
    expect(()=>assessPresentationV3(ev,profile,mediaReference(m),registry,now,f.root)).toThrow(/exact evaluated/);
    const manifest=read(join(f.root,v.id===r.release.deliveries[0]!.variant.id?r.release.deliveries[0]!.manifest.path:''));
    expect(()=>cycleDeliverySchema.parse({...manifest,artifacts:[...manifest.artifacts,{role:'cover',media:f.media}]})).toThrow(/independent/);
    expect(inspectCycleRelease(r.release,registry,now,f.root).uploads).toHaveLength(4);
  });
  it('prevents an internal executor from crossing a real owner gate and supports upstream evidence revisions',async()=>{
    const f=fixture();const initial=startCycle(f.authority,f.root);
    await expect(runUntilGate(initial,registry,async()=>({type:'owner-decision',record:f.decision('master-review',f.candidate),at:now}),()=>{},f.root)).rejects.toThrow(/cannot forge/);
    let state=transitionCycle(initial,f.event('discovery'),registry,f.root);
    state=transitionCycle(state,f.event('editorial'),registry,f.root);
    const reason=f.put({cycleId:f.review.cycleId,reason:'Test-only editorial wording revision.'});
    const retry=transitionCycle(state,{type:'retry-internal',stage:'editorial',record:reason,at:now},registry,f.root);
    expect(retry.stage).toBe('editorial');expect(retry.receipts.map(r=>r.stage)).toEqual(['discovery']);
    expect(()=>transitionCycle(initial,{type:'retry-internal',stage:'production',record:reason,at:now},registry,f.root)).toThrow(/skip forward/);
    expect(()=>transitionCycle({...initial,stage:'authorized'},f.event('discovery'),registry,f.root)).toThrow(/skips required/);
  });
  it('keeps native metrics as weak early observations and never promotes unmeasured legacy profiles',()=>{
    const f=fixture();const publication=publicationRegistry.list()[0]!;
    const metric=f.put({id:'metric-snapshot.test',revision:1,publicationId:publication.id,capturedAt:now,source:{kind:'manual-entry',notes:'Synthetic unit-test values, not real analytics.'},observationWindow:{kind:'since-publication',label:'Fixture first hour'},metrics:[{key:'views',nativeName:'Views',value:1,unit:'count',definition:'Synthetic native definition fixture.'}]});
    const signal={schemaVersion:3,publicationId:publication.id,platform:publication.platform,snapshots:[metric],interpretation:'Test-only hypothesis.',status:'hypothesis',strength:'weak',maturity:'early',limitations:['No causal inference.'],applicability:'Test-only signal.',causalityEstablished:false,styleCopyAuthorized:false};
    expect(validateLearningSignal(signal,publication,f.root).strength).toBe('weak');
    expect(()=>validateLearningSignal({...signal,strength:'strong'},publication,f.root)).toThrow(/cannot become strong/);
    const profiles=read('artifacts/presentation-profiles.json');const source={path:'artifacts/presentation-profiles.json',sha256:mediaHash('artifacts/presentation-profiles.json')};
    const exp={path:'src/platform-variants/platform-profiles.ts',sha256:mediaHash('src/platform-variants/platform-profiles.ts')};
    const projected=projectLegacyPresentationProfile(profiles.find((p:{id:string})=>p.id==='safe-area.youtube-shorts.v2'),source,exp,now);
    expect(projected.compositionSafe.state).toBe('provisional');expect(projected.nativeExclusions.regions).toBeNull();expect(projected.cropSafe.state).toBe('unknown');
    expect(projected.compositionSafe.regions![0]!.y).toBe(240);
  });

});
