import {validateCyclePublication} from './operations';
import {z} from 'zod';
import {inspectMedia} from '../artifacts/inspection';
import {mediaReferenceSchema, loadMediaRegistry, type MediaRegistry} from '../artifacts/media';
import {sha256Json} from '../content-intelligence/run-schema';
import {knowledgePackageSchema} from '../knowledge/schema';
import {contentAssetSchema} from '../content-assets/schema';
import {creativeDirectionSchema} from '../content-assets/creative-direction';
import {validateCreativeDirection} from '../content-assets/creative-direction-integrity';
import {validateInternalProductionPlanReferences} from '../production/schema';
import {validateAdaptiveCaptionPlan} from '../captions/adaptive-plan';
import {platformSchema} from '../platform-variants/schema';
import {metricSnapshotSchema, publicationRecordSchema} from '../operations/schema';
import {verifyInternalEditorial} from './editorial';
import {validateTopicSelection} from './topic-selection';
import {assessPresentationV3} from './presentation';
import {cycleReleaseSchema, cycleDeliverySchema, releaseMetadataSchema, inspectCycleRelease, resolveAuthorizedCycleUpload} from './release';
import {digest, text, recordReferenceSchema, readBoundRecord, requireOwnerDecision, ownerDecisionSchema} from './evidence';

export const internalStages = ['discovery', 'editorial', 'creative', 'production', 'presentation'] as const;
const stages = [...internalStages, 'master-review', 'publication-review', 'authorized', 'closed'] as const;
const ref = recordReferenceSchema;
const receiptSchema = z.object({stage: z.enum(internalStages), record: ref}).strict();
export const cycleSchema = z.object({
  schemaVersion: z.literal(3), id: text.regex(/^cycle\.[a-z0-9-]+$/), revision: z.number().int().nonnegative(),
  authority: ref, stage: z.enum(stages), workInProgress: z.object({stage:z.enum(internalStages),record:ref,startedAt:z.iso.datetime()}).strict().nullable(), receipts: z.array(receiptSchema),
  candidate: ref.nullable(), masterDecision: ref.nullable(), release: ref.nullable(), publicationDecision: ref.nullable(),
  exception: z.object({reason: text, target: ref, resumeStage: z.enum(stages)}).strict().nullable(),
  observations: z.array(z.object({kind: z.enum(['scheduled-owner-reported', 'published', 'presentation-observed', 'metrics']), record: ref}).strict()),
  history: z.array(z.object({revision: z.number().int().positive(), previousSha256: digest, event: text, at: z.iso.datetime(), evidence: ref}).strict()),
}).strict();
export type Cycle = z.infer<typeof cycleSchema>;
export const cycleStartAuthoritySchema = z.object({schemaVersion:z.literal(3),cycleId:text,enteredAt:z.iso.datetime(),evidenceBasis:z.literal('explicit-owner-cycle-start'),instruction:text,internalPipelineAuthorized:z.literal(true),externalActionsAuthorized:z.literal(false),targetPlatforms:z.array(platformSchema).min(1).default(['youtube','tiktok','instagram','facebook'])}).strict();
const candidateSchema = z.object({
  schemaVersion:z.literal(3),cycleId:text,media:mediaReferenceSchema,durationSeconds:z.number().positive(),
  scriptSha256:digest,productionPlan:ref,captionPlan:ref,narrationBundle:ref,platformPreflight:z.array(z.object({profile:ref,evidence:ref}).strict()).min(1),
  narration:z.array(z.object({id:text,transcript:text,start:z.number().nonnegative(),duration:z.number().positive(),media:mediaReferenceSchema}).strict()).min(1),
  qa:z.object({technical:z.literal('passed'),typography:z.literal('passed'),captions:z.literal('passed'),audio:z.literal('passed'),reports:z.array(ref).min(1)}).strict(),
  factualSafeguards:z.array(text).min(1),uncertainties:z.array(text),unusualProduction:z.array(text),
}).strict();
export const startCycle = (authority: z.infer<typeof ref>, root = process.cwd()): Cycle => {
  const start = cycleStartAuthoritySchema.parse(readBoundRecord(authority,root));
  return cycleSchema.parse({schemaVersion:3,id:start.cycleId,revision:0,authority,stage:'discovery',workInProgress:null,receipts:[],candidate:null,masterDecision:null,release:null,publicationDecision:null,exception:null,observations:[],history:[]});
};
export const validatePlatformCoverage=(cycle:Cycle,input:unknown,root=process.cwd())=>{
  const expected=cycleStartAuthoritySchema.parse(readBoundRecord(cycle.authority,root)).targetPlatforms;
  const release=cycleReleaseSchema.parse(input);const delivered=new Set(release.deliveries.map(d=>d.variant.platform));
  if(expected.some(p=>!delivered.has(p))||[...delivered].some(p=>!expected.includes(p)))throw new Error('Release must cover exactly the authorized target platforms');
};
const receiptFor = (cycle: Cycle, stage: typeof internalStages[number], root: string) => {
  const receipt = [...cycle.receipts].reverse().find(r => r.stage === stage);
  if (!receipt) throw new Error(`Missing ${stage} receipt`);
  return readBoundRecord(receipt.record,root);
};
const editorialFor = (cycle: Cycle, root: string, evaluationAt?:string) => {
  const bundle = z.object({draftPackage:z.unknown(),draftAsset:z.unknown(),review:z.unknown()}).strict().parse(receiptFor(cycle,'editorial',root));
  const latest=new Map<string,z.infer<typeof ref>>();
  for(const h of cycle.history.filter(h=>h.event==='owner-decision')){const d=ownerDecisionSchema.parse(readBoundRecord(h.evidence,root));if(d.gate==='exception'&&d.scope)latest.set(sha256Json(d.scope),h.evidence);}
  const approved=[...latest.values()].filter(r=>ownerDecisionSchema.parse(readBoundRecord(r,root)).decision==='approve');
  const at=evaluationAt??cycle.history.filter(h=>h.event==='editorial').at(-1)?.at;
  const editorial=verifyInternalEditorial(bundle.review,knowledgePackageSchema.parse(bundle.draftPackage),contentAssetSchema.parse(bundle.draftAsset),root,approved,at);
  const selection=validateTopicSelection(receiptFor(cycle,'discovery',root),root);
  if(editorial.review.topicCandidateId!==selection.selectedId)throw new Error('Research must bind the autonomously selected topic');
  if(editorial.review.cycleId!==cycle.id)throw new Error('Editorial authority belongs to another cycle');
  return editorial;
};
const directionFor = (cycle: Cycle, root: string) => {
  const editorial=editorialFor(cycle,root);
  return validateCreativeDirection(receiptFor(cycle,'creative',root),editorial.knowledgePackage,editorial.contentAsset);
};
const validateCandidateReceipt=(cycle:Cycle,record:z.infer<typeof ref>,registry:MediaRegistry,root:string)=>{
  const candidate=candidateSchema.parse(readBoundRecord(record,root));
  const editorial=editorialFor(cycle,root);const direction=directionFor(cycle,root);
  const plan=validateInternalProductionPlanReferences(readBoundRecord(candidate.productionPlan,root),editorial.knowledgePackage,editorial.contentAsset,direction);
  if(plan.status!=='rendered-candidate-visual-review-required'||plan.visualApproval)throw new Error('Master review requires a genuine unapproved rendered-candidate plan');
  if(editorial.review.claims.some(c=>['exclude','unresolved'].includes(c.disposition)&&!plan.excludedClaimIds.includes(c.id)))throw new Error('Production must retain every exclusion/unresolved claim');
  if(candidate.cycleId!==cycle.id || candidate.scriptSha256!==sha256Json(editorial.contentAsset.script) || candidate.durationSeconds!==plan.format.durationSeconds) throw new Error('Candidate narration/production target mismatch');
  const captions=validateAdaptiveCaptionPlan(readBoundRecord(candidate.captionPlan,root),candidate.narration,plan.format,direction,editorial.contentAsset);
  if(plan.captions.captionPlanSha256!==sha256Json(captions) || captions.fps!==plan.format.fps) throw new Error('Candidate caption identity mismatch');
  const platforms=new Set<string>();
  for(const preflight of candidate.platformPreflight){
    if(!plan.presentationProfiles?.some(p=>p.path===preflight.profile.path&&p.sha256===preflight.profile.sha256))throw new Error('Candidate preflight must use planned presentation profiles');
    const result=assessPresentationV3(readBoundRecord(preflight.evidence,root),readBoundRecord(preflight.profile,root),candidate.media,registry,z.object({inspectedAt:z.iso.datetime()}).passthrough().parse(readBoundRecord(preflight.evidence,root)).inspectedAt,root);
    platforms.add(result.profile.platform);
    const midpoints=captions.cues.map(c=>Math.floor((c.startFrame+c.endFrame)/2));
    if(midpoints.some(f=>!result.evidence.coverage.captionMidpoints.includes(f)))throw new Error('Master preflight must inspect every caption midpoint');
  }
  const authority=cycleStartAuthoritySchema.parse(readBoundRecord(cycle.authority,root));
  if(authority.targetPlatforms.some(p=>!platforms.has(p)))throw new Error('Missing target platform preflight before master review');
  const probe=inspectMedia(registry.resolveFile(candidate.media));
  if(probe.width!==plan.format.width||probe.height!==plan.format.height||probe.fps!==plan.format.fps||Math.abs(probe.durationSeconds-candidate.durationSeconds)>0.12)throw new Error('Actual candidate format differs from production plan');
  if(candidate.narration.some(n=>n.start+n.duration>plan.format.durationSeconds))throw new Error('Narration outside candidate timeline');
  candidate.qa.reports.forEach(r=>{const report=z.object({mediaSha256:digest,scriptSha256:digest,checks:z.object({technical:z.literal('passed'),typography:z.literal('passed'),captions:z.literal('passed'),audio:z.literal('passed')}).strict()}).passthrough().parse(readBoundRecord(r,root));if(report.mediaSha256!==candidate.media.sha256||report.scriptSha256!==candidate.scriptSha256)throw new Error('QA report detached from exact candidate');});
  const bundle=z.object({cues:z.array(z.object({id:text,transcript:text,start:z.number(),duration:z.number()})),provenance:z.object({provider:text,modelId:text,voiceId:text,speed:z.number().positive(),generatedAt:z.iso.datetime(),approvedScriptSha256:digest,cueArtifacts:z.array(z.object({id:text,sha256:digest}))})}).passthrough().parse(readBoundRecord(candidate.narrationBundle,root));
  if(bundle.provenance.approvedScriptSha256!==candidate.scriptSha256||bundle.provenance.voiceId!==plan.executionPolicy?.narrator.voiceId||bundle.provenance.provider!==plan.executionPolicy.narrator.provider||bundle.cues.length!==candidate.narration.length||bundle.provenance.cueArtifacts.length!==candidate.narration.length)throw new Error('Narration generation provenance is detached from current script/voice/clips');
  for(const n of candidate.narration){const source=bundle.cues.find(c=>c.id===n.id);const artifact=bundle.provenance.cueArtifacts.find(c=>c.id===n.id);if(!source||source.transcript!==n.transcript||source.start!==n.start||source.duration!==n.duration||artifact?.sha256!==n.media.sha256||!registry.get(n.media).mediaType.startsWith('audio/'))throw new Error('Narration clip identity/timing mismatch');}
  registry.resolveFile(candidate.media);candidate.narration.forEach(n=>registry.resolveFile(n.media));candidate.qa.reports.forEach(r=>readBoundRecord(r,root));
  return candidate;
};
export const validateCycle = (input: unknown, registry: MediaRegistry, root = process.cwd()) => {
  const cycle = cycleSchema.parse(input);
  const authority = cycleStartAuthoritySchema.parse(readBoundRecord(cycle.authority,root));
  if (authority.cycleId !== cycle.id) throw new Error('Cycle start authority mismatch');
  if (cycle.history.length !== cycle.revision || cycle.history.some((h,i)=>h.revision!==i+1)) throw new Error('Cycle revision/history mismatch');
  cycle.history.forEach(h=>readBoundRecord(h.evidence,root));
  for(const r of cycle.receipts) readBoundRecord(r.record,root);
  const required = cycle.stage==='discovery'?[]:cycle.stage==='editorial'?['discovery']:cycle.stage==='creative'?['discovery','editorial']:cycle.stage==='production'?['discovery','editorial','creative']:['discovery','editorial','creative','production'];
  if(required.some(stage=>!cycle.receipts.some(r=>r.stage===stage)))throw new Error('Cycle state skips required internal evidence');
  if(cycle.stage==='master-review'||['presentation','publication-review','authorized','closed'].includes(cycle.stage)) {
    if(!cycle.candidate || cycle.receipts.filter(r=>r.stage==='production').at(-1)?.record.sha256!==cycle.candidate.sha256)throw new Error('Current candidate must bind its production receipt');
    validateCandidateReceipt(cycle,cycle.candidate,registry,root);
  }
  if(['presentation','publication-review','authorized','closed'].includes(cycle.stage)) {
    if(!cycle.masterDecision||!cycle.candidate||requireOwnerDecision(cycle.masterDecision,cycle.id,'master-review',readBoundRecord(cycle.candidate,root),root).decision!=='approve')throw new Error('Cycle cannot cross master review without exact owner approval');
  }
  if(['publication-review','authorized','closed'].includes(cycle.stage)&&!cycle.release)throw new Error('Missing exact release review target');
  if(cycle.release)validatePlatformCoverage(cycle,readBoundRecord(cycle.release,root),root);
  if(['authorized','closed'].includes(cycle.stage)) {
    if(!cycle.publicationDecision||!cycle.release)throw new Error('Missing exact publication owner decision');
    resolveAuthorizedCycleUpload(readBoundRecord(cycle.release,root),cycle.publicationDecision,registry,root);
  }
  if(cycle.workInProgress&&cycle.workInProgress.stage!==cycle.stage)throw new Error('In-progress work does not bind current internal stage');
  if(cycle.exception&&cycle.exception.resumeStage!==cycle.stage)throw new Error('Exceptional state cannot change lifecycle location');
  return cycle;
};
const eventSchema = z.discriminatedUnion('type',[
  z.object({type:z.literal('begin-internal'),stage:z.enum(internalStages),record:ref,at:z.iso.datetime()}).strict(),
  z.object({type:z.literal('complete-internal'),stage:z.enum(internalStages),record:ref,at:z.iso.datetime()}).strict(),
  z.object({type:z.literal('owner-decision'),record:ref,at:z.iso.datetime()}).strict(),
  z.object({type:z.literal('escalate'),reason:text,record:ref,at:z.iso.datetime()}).strict(),
  z.object({type:z.literal('close'),record:ref,at:z.iso.datetime()}).strict(),
  z.object({type:z.literal('retry-internal'),stage:z.enum(['discovery','editorial','creative','production']),record:ref,at:z.iso.datetime()}).strict(),
  z.object({type:z.literal('observe'),kind:z.enum(['scheduled-owner-reported','published','presentation-observed','metrics']),record:ref,at:z.iso.datetime()}).strict(),
]);
export type CycleEvent=z.infer<typeof eventSchema>;
/** Every transition consumes real bound evidence. No stage implies external publication. */
export const transitionCycle = (input: Cycle, eventInput: unknown, registry: MediaRegistry, root = process.cwd()): Cycle => {
  const cycle=validateCycle(input,registry,root); const event=eventSchema.parse(eventInput); const next=structuredClone(cycle);
  readBoundRecord(event.record,root);
  if(event.type==='escalate') {
    if(cycle.exception) throw new Error('An exceptional decision is already pending');
    const scope=z.object({cycleId:text.optional()}).passthrough().parse(readBoundRecord(event.record,root));
    if(scope.cycleId){if(scope.cycleId!==cycle.id)throw new Error('Exception scope belongs to another cycle');}
    else {const editorial=editorialFor(cycle,root);validateCreativeDirection(scope,editorial.knowledgePackage,editorial.contentAsset);}
    next.exception={reason:event.reason,target:event.record,resumeStage:cycle.stage};
  } else if(event.type==='owner-decision') {
    if(cycle.exception) {
      const decision=requireOwnerDecision(event.record,cycle.id,'exception',cycle.exception,root);
      if(decision.decision!=='approve') throw new Error('Exceptional condition remains unresolved');
      if(decision.lifecycle==='superseded'||(decision.validUntil&&event.at>decision.validUntil)||event.at<decision.enteredAt)throw new Error('Exceptional authority is expired, superseded or not yet valid');
      next.exception=null;
    } else if(cycle.stage==='master-review') {
      if(!cycle.candidate) throw new Error('No master candidate');
      const target=readBoundRecord(cycle.candidate,root);
      const decision=requireOwnerDecision(event.record,cycle.id,'master-review',target,root);
      if(decision.decision==='approve') {next.masterDecision=event.record;next.stage='presentation';}
      else {next.stage='production';next.candidate=null;next.masterDecision=null;next.release=null;next.publicationDecision=null;}
    } else if(cycle.stage==='publication-review') {
      if(!cycle.release) throw new Error('No release target');
      const target=readBoundRecord(cycle.release,root);
      const decision=requireOwnerDecision(event.record,cycle.id,'publication-review',target,root);
      if(decision.decision==='approve') {resolveAuthorizedCycleUpload(target,event.record,registry,root);next.publicationDecision=event.record;next.stage='authorized';}
      else {next.stage='presentation';next.release=null;next.publicationDecision=null;}
    } else throw new Error('No normal owner gate is pending');
  } else if(event.type==='begin-internal') {
    if(cycle.exception||cycle.stage!==event.stage||cycle.workInProgress)throw new Error('Cannot begin an unsupported or already active internal stage');
    const start=z.object({cycleId:text,stage:z.enum(internalStages),action:text}).strict().parse(readBoundRecord(event.record,root));
    if(start.cycleId!==cycle.id||start.stage!==event.stage)throw new Error('Internal start receipt mismatch');
    next.workInProgress={stage:event.stage,record:event.record,startedAt:event.at};
  } else if(event.type==='close') {
    if(cycle.stage!=='authorized'||cycle.exception||!cycle.release)throw new Error('Only an authorized, evidenced cycle can close');
    const release=cycleReleaseSchema.parse(readBoundRecord(cycle.release,root));
    const publications=cycle.observations.filter(o=>o.kind==='published').map(o=>publicationRecordSchema.parse(readBoundRecord(o.record,root)));
    if(release.deliveries.some(d=>!publications.some(p=>p.source.platformVariant.id===d.variant.id)))throw new Error('Scheduling or missing publication evidence cannot close a cycle');
    const closure=z.object({cycleId:text,releaseSha256:digest,unresolvedConsequentialIssues:z.array(text),analyticsState:z.enum(['not-observed','evidence-recorded'])}).strict().parse(readBoundRecord(event.record,root));
    if(closure.cycleId!==cycle.id||closure.releaseSha256!==cycle.release.sha256||closure.unresolvedConsequentialIssues.length)throw new Error('Closure requires exact release and resolution/escalation of consequential issues');
    next.stage='closed';
  } else if(event.type==='retry-internal') {
    const retry=z.object({cycleId:text}).passthrough().parse(readBoundRecord(event.record,root));
    if(retry.cycleId!==cycle.id)throw new Error('Retry evidence belongs to another cycle');
    if(cycle.exception || !['discovery','editorial','creative','production'].includes(cycle.stage))throw new Error('Internal retry cannot cross a human gate or locked-master boundary');
    if(internalStages.indexOf(event.stage)>internalStages.indexOf(cycle.stage as typeof internalStages[number]))throw new Error('Retry cannot skip forward');
    next.workInProgress=null;next.stage=event.stage;next.candidate=null;next.masterDecision=null;next.release=null;next.publicationDecision=null;
    next.receipts=cycle.receipts.filter(r=>internalStages.indexOf(r.stage)<internalStages.indexOf(event.stage));
  } else if(event.type==='complete-internal') {
    if(cycle.exception || cycle.stage!==event.stage) throw new Error('Unsupported transition or owner escalation pending');
    if(event.stage==='discovery') {
      const selected=validateTopicSelection(readBoundRecord(event.record,root),root);
      if(selected.cycleId!==cycle.id)throw new Error('Discovery evidence belongs to another cycle');
      if(selected.outcome!=='selected') throw new Error('Continue discovery or escalate; no eligible selection');
      next.stage='editorial';
    } else if(event.stage==='editorial') {
      next.receipts.push({stage:event.stage,record:event.record});editorialFor(next,root,event.at);next.receipts.pop();next.stage='creative';
    } else if(event.stage==='creative') {
      next.receipts.push({stage:event.stage,record:event.record});const d=directionFor(next,root);next.receipts.pop();
      if(d.ownerReview.required){
        const fields=(direction:typeof d)=>({knowledgePackage:direction.knowledgePackage,contentAsset:direction.contentAsset,approvedScriptSha256:direction.approvedScriptSha256,creativeThesis:direction.creativeThesis,viewerExperience:direction.viewerExperience,emotionalTarget:direction.emotionalTarget,visualThesis:direction.visualThesis,decisions:direction.decisions,convergenceReview:direction.convergenceReview,risks:direction.risks});
        const authorized=cycle.history.filter(h=>h.event==='owner-decision').some(h=>{
          const decision=ownerDecisionSchema.parse(readBoundRecord(h.evidence,root));
          if(decision.gate!=='exception'||decision.decision!=='approve'||decision.lifecycle==='superseded'||(decision.validUntil&&event.at>decision.validUntil)||!decision.scope||d.ownerReview.decision?.id!==decision.id||d.ownerReview.decision.revision!==decision.revision||d.ownerReview.decision.sha256!==sha256Json(decision))return false;
          const proposal=creativeDirectionSchema.safeParse(readBoundRecord(decision.scope,root));return proposal.success&&proposal.data.id===d.id&&sha256Json(fields(proposal.data))===sha256Json(fields(d));
        });
        if(!authorized)throw new Error('Significant direction requires its exact exceptional owner authority, not an unrelated prior gate');
      }
      if(d.state!=='ready-for-production-planning') throw new Error('Direction not ready');next.stage='production';
    } else if(event.stage==='production') {
      validateCandidateReceipt(cycle,event.record,registry,root);
      next.candidate=event.record;next.stage='master-review';
    } else {
      const release=cycleReleaseSchema.parse(readBoundRecord(event.record,root));
      if(!cycle.candidate || !cycle.masterDecision) throw new Error('Presentation requires an owner-approved master');
      const c=candidateSchema.parse(readBoundRecord(cycle.candidate,root));
      if(requireOwnerDecision(cycle.masterDecision,cycle.id,'master-review',c,root).decision!=='approve') throw new Error('Master not approved');
      if(release.cycleId!==cycle.id) throw new Error('Release cycle mismatch');
      validatePlatformCoverage(cycle,release,root);
      inspectCycleRelease(release,registry,event.at,root);
      const editorial=editorialFor(cycle,root);
      for(const d of release.deliveries){const manifest=cycleDeliverySchema.parse(readBoundRecord(d.manifest,root));const metadata=releaseMetadataSchema.parse(readBoundRecord(manifest.metadata,root));if(metadata.claimIds.some(id=>!editorial.contentAsset.selectedClaimIds.includes(id)))throw new Error('Packaging cannot silently introduce unselected claims');}
      const captionPlan=z.object({cues:z.array(z.object({startFrame:z.number(),endFrame:z.number()}))}).passthrough().parse(readBoundRecord(c.captionPlan,root));
      const expectedMidpoints=captionPlan.cues.map(cue=>Math.floor((cue.startFrame+cue.endFrame)/2));
      for(const {variant} of release.deliveries) {
        if(sha256Json(variant.master)!==sha256Json(c.media)) throw new Error('Variant detached from locked master');
        const result=assessPresentationV3(readBoundRecord(variant.presentation,root),readBoundRecord(variant.profile,root),variant.media,registry,event.at,root);
        let requiredMidpoints=expectedMidpoints;
        if(variant.presentationInputs){
          const bundle=z.object({cues:z.array(z.object({id:text,transcript:text,start:z.number(),duration:z.number()})),provenance:z.object({approvedScriptSha256:digest,voiceId:text,provider:text,cueArtifacts:z.array(z.object({id:text,sha256:digest}))})}).passthrough().parse(readBoundRecord(variant.presentationInputs.narrationBundle,root));
          const masterPlan=validateInternalProductionPlanReferences(readBoundRecord(c.productionPlan,root),editorial.knowledgePackage,editorial.contentAsset,directionFor(cycle,root));
          if(bundle.provenance.approvedScriptSha256!==c.scriptSha256||bundle.provenance.voiceId!==masterPlan.executionPolicy?.narrator.voiceId||bundle.provenance.provider!==masterPlan.executionPolicy.narrator.provider)throw new Error('Derivative narration cannot silently change approved words/voice');
          for(const clip of bundle.provenance.cueArtifacts){const m=registry.byHash(clip.sha256);if(!m||!m.mediaType.startsWith('audio/'))throw new Error('Derivative narration clip missing');registry.resolveFile({id:m.id,sha256:m.sha256});}
          const captions=validateAdaptiveCaptionPlan(readBoundRecord(variant.presentationInputs.captionPlan,root),bundle.cues,result.profile.canvas,directionFor(cycle,root),editorial.contentAsset);
          if(captions.fps!==result.evidence.fps)throw new Error('Derivative captions and evaluated frames differ');
          requiredMidpoints=captions.cues.map(cue=>Math.floor((cue.startFrame+cue.endFrame)/2));
          const report=result.evidence.reports.map(r=>readBoundRecord(r,root)).find(r=>{const parsed=z.object({mediaSha256:digest,scriptSha256:digest,checks:z.object({technical:z.literal('passed'),typography:z.literal('passed'),captions:z.literal('passed'),audio:z.literal('passed')})}).safeParse(r);return parsed.success&&parsed.data.mediaSha256===variant.media.sha256&&parsed.data.scriptSha256===c.scriptSha256;});
          if(!report)throw new Error('Derivative requires its own exact-media production QA');
        }
        if(requiredMidpoints.some(frame=>!result.evidence.coverage.captionMidpoints.includes(frame)))throw new Error('Presentation must inspect every caption midpoint from the actual caption plan');
        if(result.collisions.length) throw new Error('Known collision requires derivative and new evidence');
      }
      next.release=event.record;next.stage='publication-review';
    }
    next.workInProgress=null;next.receipts.push({stage:event.stage,record:event.record});
  } else {
    if(cycle.exception || !cycle.publicationDecision || !cycle.release) throw new Error('Operational observations require an authorized release');
    if(cycle.observations.some(o=>o.kind===event.kind&&o.record.sha256===event.record.sha256))return cycle;
    const release=cycleReleaseSchema.parse(readBoundRecord(cycle.release,root));
    resolveAuthorizedCycleUpload(release,cycle.publicationDecision,registry,root);
    const observation=readBoundRecord(event.record,root);
    if(event.kind==='published') {
      const editorial=editorialFor(cycle,root);
      validateCyclePublication(observation,{release,decision:cycle.publicationDecision,knowledgePackage:editorial.knowledgePackage,contentAsset:editorial.contentAsset},registry,root);
      const publication=publicationRecordSchema.parse(observation);
      for(const prior of cycle.observations.filter(o=>o.kind==='published')){const p=publicationRecordSchema.parse(readBoundRecord(prior.record,root));if(p.id===publication.id||(p.remote&&publication.remote&&p.platform===publication.platform&&p.remote.postId===publication.remote.postId))throw new Error('Conflicting duplicate publication observation');}
    } else if(event.kind==='metrics') {
      const metric=metricSnapshotSchema.parse(observation);
      if(!cycle.observations.some(o=>o.kind==='published' && publicationRecordSchema.parse(readBoundRecord(o.record,root)).id===metric.publicationId)) throw new Error('Metric requires recorded publication');
    } else {
      const o=z.object({cycleId:text,variantId:text,media:mediaReferenceSchema,manifestSha256:digest,evidenceBasis:z.literal('explicit-owner-message'),observedAt:z.iso.datetime().nullable()}).passthrough().parse(observation);
      const authorized=release.deliveries.find(d=>d.variant.id===o.variantId);
      if(!authorized||sha256Json(authorized.variant.media)!==sha256Json(o.media)||authorized.manifest.sha256!==o.manifestSha256)throw new Error('Operational observation must identify exact authorized media/manifest');
      if(o.cycleId!==cycle.id || !release.deliveries.some(d=>d.variant.id===o.variantId)) throw new Error('Observation cycle/variant mismatch');
    }
    next.observations.push({kind:event.kind,record:event.record});
  }
  next.revision++;
  next.history.push({revision:next.revision,previousSha256:sha256Json(cycle),event:event.type==='complete-internal'?event.stage:event.type==='begin-internal'?`begin-${event.stage}`:event.type,at:event.at,evidence:event.record});
  return cycleSchema.parse(next);
};
export const nextAction = (cycle: Cycle) => cycle.exception ? {kind:'owner' as const,gate:'exception',reason:cycle.exception.reason} : ['master-review','publication-review'].includes(cycle.stage) ? {kind:'owner' as const,gate:cycle.stage} : cycle.stage==='authorized' ? {kind:'manual-publication' as const,gate:null} : cycle.stage==='closed' ? {kind:'none' as const,gate:null} : {kind:'internal' as const,stage:cycle.stage};
/** Session/agent adapters perform real work; this controller resumes until a real gate. No daemon. */
export const runUntilGate = async (cycle: Cycle, registry: MediaRegistry, execute: (stage: typeof internalStages[number], cycle: Cycle) => Promise<CycleEvent>, persist: (previous: Cycle, next: Cycle, event: CycleEvent) => void, root=process.cwd()) => {
  let current=validateCycle(cycle,registry,root);
  while(nextAction(current).kind==='internal') {
    const stage=z.enum(internalStages).parse(current.stage);
    const event=await execute(stage,structuredClone(current));
    if(event.type!=='complete-internal' && event.type!=='escalate' && event.type!=='retry-internal' && event.type!=='begin-internal') throw new Error('Internal adapter cannot forge an owner or operational event');
    const next=transitionCycle(current,event,registry,root);persist(current,next,event);current=next;
  }
  return current;
};

/** Concise deterministic operator view; detailed evidence remains referenced. */
export const cycleStatus = (cycle: Cycle, root=process.cwd(), registry:MediaRegistry=loadMediaRegistry(root)) => {
  const selection=cycle.receipts.some(r=>r.stage==="discovery") ? validateTopicSelection(receiptFor(cycle,"discovery",root),root) : null;
  const editorial=cycle.receipts.some(r=>r.stage==="editorial") ? editorialFor(cycle,root) : null;
  const candidate=cycle.candidate ? candidateSchema.parse(readBoundRecord(cycle.candidate,root)) : null;
  const release=cycle.release ? cycleReleaseSchema.parse(readBoundRecord(cycle.release,root)) : null;
  return {id:cycle.id,revision:cycle.revision,stage:cycle.stage,next:nextAction(cycle),topic:selection ? {id:selection.selectedId,rationale:selection.rationale} : null,research:editorial ? {reviewSha256:sha256Json(editorial.review),package:editorial.knowledgePackage.id,verifiedClaimIds:editorial.review.claims.filter(c=>c.disposition==="verify").map(c=>c.id)} : null,narration:editorial ? {scriptSha256:sha256Json(editorial.contentAsset.script),text:editorial.contentAsset.script.segments.map(s=>s.text).join(" ")} : null,direction:cycle.receipts.filter(r=>r.stage==="creative").at(-1)?.record ?? null,productionBegun:cycle.history.some(h=>h.event==="production"||h.event==="begin-production"),workInProgress:cycle.workInProgress,candidate:candidate ? {media:candidate.media,durationSeconds:candidate.durationSeconds,factualSafeguards:candidate.factualSafeguards,unusualProduction:candidate.unusualProduction,platformPreflight:candidate.platformPreflight.map(p=>{const result=assessPresentationV3(readBoundRecord(p.evidence,root),readBoundRecord(p.profile,root),candidate.media,registry,z.object({inspectedAt:z.iso.datetime()}).passthrough().parse(readBoundRecord(p.evidence,root)).inspectedAt,root);return {platform:result.profile.platform,surface:result.profile.surface,collisions:result.collisions,unknowns:result.unknowns,evidence:p.evidence,profile:p.profile};}),uncertainties:candidate.uncertainties} : null,masterApproved:cycle.masterDecision!==null,masterDecision:cycle.masterDecision,platformMedia:release?.deliveries.map(d=>({variantId:d.variant.id,platform:d.variant.platform,surface:d.variant.surface,media:d.variant.media,relationship:d.variant.relationship,presentation:d.variant.presentation,manifest:d.manifest})) ?? [],publicationAuthorized:cycle.publicationDecision!==null,observations:cycle.observations};
};
