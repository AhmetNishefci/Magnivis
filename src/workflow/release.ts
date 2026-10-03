import {assertGitMediaSize} from '../artifacts/durability';
import {assertMediaProductionEligible} from '../artifacts/retention';
import {z} from 'zod';
import {inspectMedia,inspectImage} from '../artifacts/inspection';
import {mediaReferenceSchema,type MediaRegistry,type MediaReference} from '../artifacts/media';
import {platformSchema} from '../platform-variants/schema';
import {sha256Json} from '../content-intelligence/run-schema';
import {assessPresentationV3} from './presentation';
import {recordReferenceSchema,text,digest,requireOwnerDecision,readBoundRecord,readBoundFile} from './evidence';
export const cycleVariantSchema=z.object({
  id:text,revision:z.number().int().positive(),platform:platformSchema,surface:text,
  media:mediaReferenceSchema,master:mediaReferenceSchema,
  relationship:z.enum(['exact-master','derivative']),adaptationReason:text.nullable(),
  presentation:recordReferenceSchema,profile:recordReferenceSchema,
  presentationInputs:z.object({captionPlan:recordReferenceSchema,narrationBundle:recordReferenceSchema}).strict().optional(),
}).strict().superRefine((v,ctx)=>{if(v.relationship==='derivative'&&!v.presentationInputs)ctx.addIssue({code:'custom',message:'Derivative must bind its own caption/timing inputs'});});
export const cycleDeliverySchema=z.object({
  schemaVersion:z.literal(3),id:text,cycleId:text,variantSha256:digest,media:mediaReferenceSchema,
  artifacts:z.array(z.object({role:z.enum(['video','cover']),media:mediaReferenceSchema,presentation:recordReferenceSchema.optional(),profile:recordReferenceSchema.optional()}).strict().superRefine((a,ctx)=>{if(a.role==='cover'&&(!a.presentation||!a.profile))ctx.addIssue({code:'custom',message:'Cover requires independent exact-media evidence/profile'});})).min(1),
  metadata:recordReferenceSchema,uploadCopy:recordReferenceSchema,state:z.literal('prepared'),
}).strict();
export const cycleReleaseSchema=z.object({schemaVersion:z.literal(3),cycleId:text,deliveries:z.array(z.object({variant:cycleVariantSchema,manifest:recordReferenceSchema}).strict()).min(1)}).strict();
export type CycleRelease=z.infer<typeof cycleReleaseSchema>;
export const releaseMetadataSchema=z.object({cycleId:text,variantId:text,platform:platformSchema,surface:text,media:mediaReferenceSchema,claimIds:z.array(text)}).passthrough();
/** Same inspection before review and before authorized lookup. Unknowns are surfaced, collisions block. */
export const inspectCycleRelease=(input:unknown,registry:MediaRegistry,at:string,root=process.cwd())=>{
  const release=cycleReleaseSchema.parse(input);const ids=new Set<string>();const manifestIds=new Set<string>();const unknowns:string[]=[];
  const uploads=release.deliveries.map(({variant,manifest})=>{
    if(ids.has(variant.id))throw new Error('Duplicate release variant');ids.add(variant.id);
    const delivery=cycleDeliverySchema.parse(readBoundRecord(manifest,root));
    if(manifestIds.has(delivery.id))throw new Error('Duplicate delivery identity');manifestIds.add(delivery.id);
    if(delivery.cycleId!==release.cycleId||delivery.variantSha256!==sha256Json(variant)||sha256Json(delivery.media)!==sha256Json(variant.media))throw new Error('Authorized manifest/variant/media binding mismatch');
    if(delivery.artifacts.filter(a=>a.role==='cover').length>1)throw new Error('Delivery must identify one selected cover, not ambiguous alternatives');
    if(delivery.artifacts.filter(a=>a.role==='video').length!==1||!delivery.artifacts.some(a=>a.role==='video'&&sha256Json(a.media)===sha256Json(variant.media)))throw new Error('Delivery video identity mismatch');
    const presentation=assessPresentationV3(readBoundRecord(variant.presentation,root),readBoundRecord(variant.profile,root),variant.media,registry,at,root);
    if(presentation.profile.platform!==variant.platform||presentation.profile.surface!==variant.surface||presentation.evidence.platform!==variant.platform||presentation.evidence.surface!==variant.surface)throw new Error('Presentation destination differs from exact variant destination');
    assertMediaProductionEligible(variant.media,root);assertMediaProductionEligible(variant.master,root);
    assertGitMediaSize(registry.resolveFile(variant.media),root);assertGitMediaSize(registry.resolveFile(variant.master),root);
    const probe=inspectMedia(registry.resolveFile(variant.media));const envelope=presentation.profile.export;
    if(presentation.evidence.medium!=='video'||registry.get(variant.media).mediaType!=='video/mp4'||!envelope.containers.includes('mp4')||probe.width!==presentation.profile.canvas.width||probe.height!==presentation.profile.canvas.height||!envelope.fps.includes(probe.fps)||!envelope.videoCodecs.includes(probe.videoCodec)||!envelope.audioCodecs.includes(probe.audioCodec)||probe.durationSeconds<envelope.duration.minimum||probe.durationSeconds>envelope.duration.maximum)throw new Error('Actual upload media is outside versioned presentation export profile');
    if(presentation.evidence.fps!==probe.fps||Math.abs(presentation.evidence.durationFrames/probe.fps-probe.durationSeconds)>0.12)throw new Error('Presentation timeline detached from actual media');
    if(presentation.collisions.length)throw new Error('Known presentation collision requires a derivative; owner waiver cannot approve it');
    unknowns.push(...presentation.unknowns.map(u=>`${variant.id}: ${u}`));
    const metadata=releaseMetadataSchema.parse(readBoundRecord(delivery.metadata,root));
    if(metadata.cycleId!==release.cycleId||metadata.variantId!==variant.id||metadata.platform!==variant.platform||metadata.surface!==variant.surface||sha256Json(metadata.media)!==sha256Json(variant.media))throw new Error('Delivery copy/metadata destination or media mismatch');
    if(!readBoundFile(delivery.uploadCopy,root).toString('utf8').trim())throw new Error('Upload copy is empty');
    registry.resolveFile(variant.master);
    if(variant.relationship==='exact-master'&&sha256Json(variant.master)!==sha256Json(variant.media))throw new Error('Exact master must use identical bytes');
    if(variant.relationship==='derivative'){
      if(!variant.adaptationReason||variant.master.sha256===variant.media.sha256)throw new Error('Derivative needs different bytes and presentation reason');
      const seen=new Set<string>();
      const descends=(ref:MediaReference):boolean=>{if(ref.id===variant.master.id&&ref.sha256===variant.master.sha256)return true;if(seen.has(ref.id))return false;seen.add(ref.id);return registry.get(ref).parents.some(descends);};
      if(!descends(variant.media))throw new Error('Derivative detached from locked master');
    }
    for(const artifact of delivery.artifacts.filter(a=>a.role==='cover')){
      if(!artifact.presentation||!artifact.profile||!registry.get(artifact.media).mediaType.startsWith('image/'))throw new Error('Cover media/evidence identity missing');
      const cover=assessPresentationV3(readBoundRecord(artifact.presentation,root),readBoundRecord(artifact.profile,root),artifact.media,registry,at,root);
      const dimensions=inspectImage(registry.resolveFile(artifact.media));
      if(cover.evidence.medium!=='image'||cover.profile.platform!==variant.platform||dimensions.width!==cover.profile.canvas.width||dimensions.height!==cover.profile.canvas.height)throw new Error('Cover presentation platform/dimensions mismatch');
      if(cover.collisions.length)throw new Error('Cover has known presentation collisions');
      unknowns.push(...cover.unknowns.map(u=>`${variant.id}/cover.${artifact.media.id}: ${u}`));
    }
    return {variantId:variant.id,platform:variant.platform,files:delivery.artifacts.map(a=>({role:a.role,media:a.media,path:registry.resolveFile(a.media)})),manifestSha256:manifest.sha256};
  });
  return {release,uploads,unknowns};
};
export const resolveAuthorizedCycleUpload=(input:unknown,decisionRef:z.infer<typeof recordReferenceSchema>,registry:MediaRegistry,root=process.cwd())=>{
  const release=cycleReleaseSchema.parse(input);
  const decision=requireOwnerDecision(decisionRef,release.cycleId,'publication-review',release,root);
  if(decision.decision!=='approve')throw new Error('Publication is not owner authorized');
  const result=inspectCycleRelease(release,registry,decision.enteredAt,root);
  if(result.unknowns.some(u=>!decision.acceptedUnknowns.includes(u)))throw new Error('Publication decision must explicitly accept each exact-media presentation uncertainty');
  return result.uploads.map(u=>({...u,ownerDecisionSha256:decisionRef.sha256}));
};
