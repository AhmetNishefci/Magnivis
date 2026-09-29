import {createHash} from 'node:crypto';
import {existsSync, readFileSync} from 'node:fs';
import {assertCaptionRegionIsSafe, magnivisCaptionDesignSystem} from '../src/captions/design-system';
import {captionPlanToDerivedCaptions, captionsToWebVtt} from '../src/captions/derive';
import {woodFrogCaptionPlan} from '../src/captions/plans/wood-frog';
import {validateCaptionPlanAgainstNarration} from '../src/captions/plan';
import {woodFrog, woodFrogTiktok} from '../src/content/videos/wood-frog';
import {safeAreaProfileIds} from '../src/design/safe-areas';
import {woodFrogYoutubeReviewVariant} from '../src/platform-variants/variants/wood-frog';
import {woodFrogApprovalHashes} from '../src/production/integrity';

const requestedId = process.argv[2];
const video = requestedId === woodFrog.id
  ? woodFrog
  : requestedId === woodFrogTiktok.id
    ? woodFrogTiktok
    : undefined;
if (!video) throw new Error(`Unknown caption QA target: ${requestedId ?? '(missing)'}. Available: ${woodFrog.id}, ${woodFrogTiktok.id}`);

validateCaptionPlanAgainstNarration(
  woodFrogCaptionPlan,
  video.audio.narrationCues,
  video.production?.safeAreaProfileId ?? woodFrogCaptionPlan.safeAreaProfileId,
);
if (
  woodFrogCaptionPlan.approvedScriptSha256 !== woodFrogApprovalHashes.script
  || video.production?.captionPlanSha256 !== woodFrogApprovalHashes.captionPlan
) {
  throw new Error('CaptionPlan is not bound to the approved script/source-chain hash');
}
if (!woodFrogYoutubeReviewVariant.captions.designedBurnedIn) {
  throw new Error('Wood Frog PlatformVariant does not declare designed burned-in captions');
}

const platformProfiles = [
  safeAreaProfileIds.youtubeShorts,
  safeAreaProfileIds.tiktokFeed,
  safeAreaProfileIds.instagramReels,
  safeAreaProfileIds.facebookReels,
];
for (const cue of woodFrogCaptionPlan.cues) {
  for (const profileId of platformProfiles) {
    assertCaptionRegionIsSafe(cue.placement, profileId);
  }
}

const captionPath = woodFrog.captions[0]?.file;
if (!captionPath || !existsSync(captionPath)) throw new Error('Caption WebVTT is missing');
const expected = `${captionsToWebVtt(
  captionPlanToDerivedCaptions(woodFrogCaptionPlan),
).trimEnd()}\n`;
const actual = readFileSync(captionPath, 'utf8');
if (actual !== expected) throw new Error('Caption WebVTT does not match CaptionPlan');

console.log(JSON.stringify({
  captionPlan: woodFrogCaptionPlan.id,
  videoSpec: video.id,
  revision: woodFrogCaptionPlan.revision,
  sha256: woodFrogApprovalHashes.captionPlan,
  designSystem: magnivisCaptionDesignSystem.id,
  cueCount: woodFrogCaptionPlan.cues.length,
  emphasisCount: woodFrogCaptionPlan.cues.reduce((sum, cue) => sum + cue.emphasis.length, 0),
  placements: [...new Set(woodFrogCaptionPlan.cues.map(({placement}) => placement))],
  animations: [...new Set(woodFrogCaptionPlan.cues.map(({animation}) => animation))],
  validatedPlatformProfiles: platformProfiles,
  webVtt: {
    path: captionPath,
    sha256: createHash('sha256').update(actual).digest('hex'),
  },
  passed: true,
}, null, 2));
