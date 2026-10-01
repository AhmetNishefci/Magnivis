import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import lockedDecision from '../../content-intelligence/reviews/phantom-traffic-approved-v3/owner-decision.json';
import reviewedPackage from '../../content-intelligence/reviews/phantom-traffic-finalization-v2/knowledge-package.review.json';
import reviewedAsset from '../../content-intelligence/reviews/phantom-traffic-finalization-v2/content-asset.review.json';
import reviewedClaims from '../../content-intelligence/reviews/phantom-traffic-finalization-v2/claim-review.json';
import captionSnapshot from './narration/phantom-traffic-caption-plan.json';
import metadata from './narration/phantom-traffic.json';
import {knowledgePackageSchema} from '../knowledge/schema';
import {contentAssetSchema} from '../content-assets/schema';
import {createContentAssetRegistry} from '../content-assets/registry';
import {createKnowledgePackageRegistry} from '../knowledge/registry';
import {phantomTrafficKnowledgePackage as pkg} from '../knowledge/packages/phantom-traffic';
import {phantomTrafficContentAsset as asset} from '../content-assets/assets/phantom-traffic';
import {applyEditorialLock} from '../content-intelligence/editorial-lock';
import {sha256Json} from '../content-intelligence/run-schema';
import {phantomTrafficProductionPlan as plan} from './plans/phantom-traffic';
import {validateProductionPlanReferences} from './schema';
import {phantomTrafficCaptionPlan as captions} from '../captions/plans/phantom-traffic';
import {validateCaptionPlanAgainstNarration} from '../captions/plan';
import {captionPlanToDerivedCaptions, captionsToWebVtt} from '../captions/derive';
import {assertCaptionRegionIsSafe} from '../captions/design-system';
import {safeAreaProfileIds, safeAreaProfileRegistry} from '../design/safe-areas';
import {phantomTraffic as video} from '../content/videos/phantom-traffic';

export const fileSha256 = (path: string) => createHash('sha256').update(readFileSync(path)).digest('hex');
export const validatePhantomTrafficProduction = () => {
  const replay = applyEditorialLock({decision: lockedDecision, knowledgePackage: knowledgePackageSchema.parse(reviewedPackage),
    contentAsset: contentAssetSchema.parse(reviewedAsset), review: reviewedClaims});
  if (sha256Json(replay.knowledgePackage) !== sha256Json(pkg) || sha256Json(replay.contentAsset) !== sha256Json(asset)) {
    throw new Error('Approved snapshots differ from exact editorial decision replay');
  }
  createContentAssetRegistry([asset], createKnowledgePackageRegistry([pkg]));
  validateProductionPlanReferences(plan, pkg, asset);
  if (sha256Json([...plan.excludedClaimIds].sort()) !== sha256Json(pkg.claims.filter(c=>c.verificationStatus==='unverified').map(c=>c.id).sort())) throw new Error('Excluded scientific claims changed');
  const bindings = [[plan.knowledgePackage.sha256, sha256Json(pkg)], [plan.contentAsset.sha256, sha256Json(asset)],
    [plan.ownerDecision.sha256, sha256Json(replay.decision)], [plan.approvedScriptSha256, sha256Json(asset.script)],
    [plan.captions.captionPlanSha256, sha256Json(captions)], [sha256Json(captionSnapshot), sha256Json(captions)]];
  if (bindings.some(([expected, actual]) => expected !== actual)) throw new Error('Production source/hash binding mismatch');
  if (video.production?.approvedScriptSha256 !== plan.approvedScriptSha256
    || video.production?.approvedPackageSha256 !== plan.knowledgePackage.sha256
    || video.production?.approvedContentAssetSha256 !== plan.contentAsset.sha256
    || video.production?.ownerDecisionSha256 !== plan.ownerDecision.sha256
    || video.production?.captionPlanSha256 !== plan.captions.captionPlanSha256
    || video.production?.productionPlanRevision !== plan.revision
    || sha256Json(video.audio.narrationCues) !== sha256Json(metadata.cues)
    || sha256Json(video.format) !== sha256Json(plan.format)) throw new Error('VideoSpec source-chain binding mismatch');
  if (plan.status !== 'rendered-candidate-visual-review-required' || plan.visualApproval || video.platformVariantId
    || video.production?.outputReviewState !== 'visual-review-required' || captions.status !== 'review-required') throw new Error('Candidate incorrectly grants approval');
  validateCaptionPlanAgainstNarration(captions, metadata.cues, plan.safeAreaProfileId);
  for (const cue of captions.cues) {
    assertCaptionRegionIsSafe(cue.placement, safeAreaProfileIds.verticalShortMaster);
    // Existing known insets only; this is a geometric screen, never a platform/device approval.
    assertCaptionRegionIsSafe(cue.placement, safeAreaProfileIds.youtubeShortsV2);
    assertCaptionRegionIsSafe(cue.placement, safeAreaProfileIds.tiktokFeed);
  }
  const critical = {left:130, right:860, top:260, bottom:1345};
  for (const id of [safeAreaProfileIds.verticalShortMaster, safeAreaProfileIds.youtubeShortsV2, safeAreaProfileIds.tiktokFeed]) {
    const p = safeAreaProfileRegistry.get(id);
    if (critical.left < p.insets.left || critical.right > p.canvas.width-p.insets.right || critical.top < p.insets.top || critical.bottom > p.canvas.height-p.insets.bottom) throw new Error('Critical scene bounds exceed known insets');
  }
  if (metadata.cues.length !== asset.script.segments.length || metadata.cues.some((cue,i) => cue.transcript !== asset.script.segments[i]?.text)) throw new Error('Narration text differs from exact approved script');
  if (readFileSync(plan.captions.file,'utf8') !== `${captionsToWebVtt(captionPlanToDerivedCaptions(captions)).trimEnd()}\n`) throw new Error('Stale accessibility captions');
  for (const cue of metadata.cues) {
    if (fileSha256(`public/${cue.file}`) !== metadata.provenance.cueArtifacts.find(a => a.id === cue.id)?.sha256) throw new Error(`Changed narration audio: ${cue.id}`);
    if (cue.start+cue.duration > plan.format.durationSeconds) throw new Error('Narration exceeds production duration');
  }
  if (fileSha256(`public/${video.audio.file}`) !== video.audio.provenance?.soundscape.sha256) throw new Error('Changed soundscape audio');
  if (plan.beats[0]?.frames.start !== 0 || plan.beats.at(-1)?.frames.end !== metadata.durationFrames
    || plan.beats.some((beat,i) => i>0 && beat.frames.start !== plan.beats[i-1]?.frames.end)) throw new Error('Production beat coverage is incomplete');
  return {passed:true, package:pkg.id, packageRevision:pkg.revision, asset:asset.id, assetRevision:asset.revision,
    productionPlan:plan.id, productionPlanRevision:plan.revision, captionPlan:captions.id, captionCueCount:captions.cues.length,
    verifiedClaims:asset.selectedClaimIds.length, excludedClaims:plan.excludedClaimIds.length,
    measuredNarrationSeconds:metadata.measuredNarrationSeconds, narrationBundleSha256:sha256Json(metadata.provenance.cueArtifacts),
    platformApprovalGranted:false, ownerMasterVisualApproval:false, publicationApprovalGranted:false};
};
