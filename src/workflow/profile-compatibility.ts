import {presentationProfileSchema} from '../platform-variants/presentation';
import {platformProfileRegistry} from '../platform-variants/platform-profiles';
import {readBoundRecord,readBoundFile,type RecordReference} from './evidence';
import {sha256Json} from '../content-intelligence/run-schema';
import {presentationProfileV3Schema} from './presentation';
/** Preserve known historical geometry as provisional input, never a new device measurement. */
export const projectLegacyPresentationProfile=(input:unknown,source:RecordReference,exportSource:RecordReference,inspectedAt:string,root=process.cwd())=>{
  const profile=presentationProfileSchema.parse(input);
  const stored=readBoundRecord(source,root);
  if(!Array.isArray(stored)||!stored.some(p=>sha256Json(p)===sha256Json(profile)))throw new Error('Legacy profile projection requires exact source record');
  readBoundFile(exportSource,root);
  const exp=platformProfileRegistry.list().find(p=>p.platform===profile.platform)!;
  const known=(regions:{x:number;y:number;width:number;height:number}[]|null,rationale:string)=>({state:regions===null?'unknown' as const:'provisional' as const,regions,rationale,provenance:regions===null?[]:[source]});
  const i=profile.insets;
  const envelope=exp.validatedEnvelope;
  return presentationProfileV3Schema.parse({
    schemaVersion:3,id:`presentation-profile.compatibility.${profile.id}`,revision:profile.revision,platform:profile.platform,surface:profile.surface,canvas:profile.canvas,
    reviewedAt:inspectedAt,reviewAfter:inspectedAt,lifecycle:profile.lifecycle==='HISTORICAL_SUPERSEDED'?'superseded':'current',
    compositionSafe:known(i?[{x:i.left,y:i.top,width:profile.canvas.width-i.left-i.right,height:profile.canvas.height-i.top-i.bottom}]:null,`Repository projection only. ${profile.source}; ${profile.notes}`),
    nativeExclusions:known(profile.exclusionZones,'Legacy native exclusions; null stays unknown.'),
    captionSafe:known(profile.captionRegion?[profile.captionRegion]:null,'Legacy caption geometry; null stays unknown.'),
    cropSafe:known(null,'No legacy measured crop model; nothing inferred.'),
    export:{containers:[envelope.container],videoCodecs:[envelope.videoCodec],audioCodecs:[envelope.audioCodec],fps:[envelope.fps],duration:envelope.durationSeconds,provenance:[exportSource],rationale:'Historical conservative export envelope only. Future evidence-backed versions may change dimensions, FPS, codec and duration; not complete native platform limits.'},
  });
};
