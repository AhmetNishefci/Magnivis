import type {MediaRegistry} from '../artifacts/media';
import {sha256Json} from '../content-intelligence/run-schema';
import {cycleReleaseSchema, inspectCycleRelease} from './release';
import {cycleStatus,type Cycle} from './cycle';
import {readBoundRecord} from './evidence';
/** Owner attention is focused on new judgment; the receipt graph remains available. */
export const ownerHandoff=(cycle:Cycle,media:MediaRegistry,root=process.cwd())=>{
  const status=cycleStatus(cycle,root,media);
  if(cycle.exception)return {gate:'exception',reason:cycle.exception.reason,evidence:cycle.exception.target,targetSha256:sha256Json(cycle.exception)};
  if(cycle.stage==='master-review'&&status.candidate&&cycle.candidate)return {
    gate:'MASTER REVIEW',cycleId:cycle.id,
    candidateFile:media.resolveFile(status.candidate.media),durationSeconds:status.candidate.durationSeconds,
    narration:status.narration,factualSafeguards:status.candidate.factualSafeguards,unusualProduction:status.candidate.unusualProduction,platformPreflight:status.candidate.platformPreflight,uncertainties:status.candidate.uncertainties,
    evidence:cycle.candidate,targetSha256:sha256Json(readBoundRecord(cycle.candidate,root)),
    decision:'Approve exact master, request revision, or reject. Approval permits internal presentation/delivery work; publication remains a separate decision.',
  };
  if(cycle.stage==='publication-review'&&cycle.release){
    const release=cycleReleaseSchema.parse(readBoundRecord(cycle.release,root));
    return {gate:'PUBLICATION REVIEW / AUTHORIZATION',cycleId:cycle.id,
      platforms:release.deliveries.map(d=>({platform:d.variant.platform,surface:d.variant.surface,uploadFile:media.resolveFile(d.variant.media),relationship:d.variant.relationship,delivery:d.manifest,presentation:d.variant.presentation,profile:d.variant.profile})),
      presentationUncertainties:inspectCycleRelease(release,media,new Date().toISOString(),root).unknowns,
      uniqueVideoPayloads:new Set(release.deliveries.map(d=>d.variant.media.sha256)).size,
      evidence:cycle.release,targetSha256:sha256Json(release),
      decision:'Review copy, covers, exact files and scoped presentation uncertainties. Approve owner manual release or request revision. No upload/scheduling/publication is performed by this system.',
    };
  }
  throw new Error('No owner review is pending');
};
