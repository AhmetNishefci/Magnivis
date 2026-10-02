import {publicationRecordSchema,type PublicationRecord} from '../operations/schema';
import {platformAccountRegistry,type PlatformAccountRegistry} from '../operations/registry';
import type {MediaRegistry} from '../artifacts/media';
import type {KnowledgePackage} from '../knowledge/schema';
import type {ContentAsset} from '../content-assets/schema';
import {cycleReleaseSchema,cycleDeliverySchema,resolveAuthorizedCycleUpload} from './release';
import {readBoundRecord,requireOwnerDecision,type RecordReference} from './evidence';

/** Adapter: native operational records, prospective cycle variant/delivery authority. */
export const validateCyclePublication=(input:unknown,context:{release:unknown;decision:RecordReference;knowledgePackage:KnowledgePackage;contentAsset:ContentAsset},media:MediaRegistry,root=process.cwd(),accounts:PlatformAccountRegistry=platformAccountRegistry):PublicationRecord=>{
  const publication=publicationRecordSchema.parse(input);const release=cycleReleaseSchema.parse(context.release);
  resolveAuthorizedCycleUpload(release,context.decision,media,root);
  const decision=requireOwnerDecision(context.decision,release.cycleId,'publication-review',release,root);
  if(!['published','published-owner-reported'].includes(publication.state))throw new Error('Observation is not actual publication evidence');
  if(accounts.get(publication.platformAccountId).platform!==publication.platform)throw new Error('Publication account/platform mismatch');
  const d=release.deliveries.find(d=>d.variant.id===publication.source.platformVariant.id);
  if(!d)throw new Error('Publication variant absent from authorized release');
  const manifest=cycleDeliverySchema.parse(readBoundRecord(d.manifest,root));
  if(publication.platform!==d.variant.platform||publication.source.platformVariant.revision!==d.variant.revision||publication.source.mediaArtifact?.id!==d.variant.media.id||publication.source.mediaArtifact.sha256!==d.variant.media.sha256||publication.source.videoSha256!==d.variant.media.sha256||publication.source.delivery.id!==manifest.id||publication.source.delivery.manifestSha256!==d.manifest.sha256)throw new Error('Publication exact authorized manifest/variant/media binding mismatch');
  if(publication.source.contentAsset.id!==context.contentAsset.id||publication.source.contentAsset.revision!==context.contentAsset.revision||publication.source.knowledgePackage.id!==context.knowledgePackage.id||publication.source.knowledgePackage.revision!==context.knowledgePackage.revision||publication.approval.ownerDecision?.id!==decision.id||publication.approval.ownerDecision.revision!==decision.revision||publication.approval.ownerDecision.sha256!==context.decision.sha256)throw new Error('Publication editorial/owner authorization binding mismatch');
  return publication;
};
export const createCyclePublicationRegistry=(inputs:readonly unknown[],context:Parameters<typeof validateCyclePublication>[1],media:MediaRegistry,root=process.cwd())=>{
  const byId=new Map<string,PublicationRecord>();const remote=new Set<string>();
  for(const input of inputs){const p=validateCyclePublication(input,context,media,root);if(byId.has(p.id))throw new Error('Duplicate cycle publication');if(p.remote){const key=`${p.platform}:${p.remote.postId}`;if(remote.has(key))throw new Error('Duplicate remote publication');remote.add(key);}byId.set(p.id,p);}
  return {get:(id:string)=>{const p=byId.get(id);if(!p)throw new Error('Unknown cycle publication');return structuredClone(p);},list:()=>structuredClone([...byId.values()])};
};
