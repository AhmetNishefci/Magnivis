import {createHash} from 'node:crypto';
import {existsSync, readFileSync} from 'node:fs';
import {captionPlanToDerivedCaptions, captionsToWebVtt} from '../src/captions/derive';
import {woodFrogCaptionPlan} from '../src/captions/plans/wood-frog';
import {validateCaptionPlanAgainstNarration} from '../src/captions/plan';
import {woodFrog} from '../src/content/videos/wood-frog';
import {
  validateWoodFrogProductionPlan,
  validateWoodFrogVideoSpec,
} from '../src/production/integrity';

const sha256 = (path: string) => createHash('sha256')
  .update(readFileSync(path))
  .digest('hex');

const requestedId = process.argv[2];
if (requestedId !== woodFrog.id) {
  throw new Error(`Unknown production target: ${requestedId ?? '(missing)'}. Available: ${woodFrog.id}`);
}

const productionPlan = validateWoodFrogProductionPlan();
validateWoodFrogVideoSpec(woodFrog);
validateCaptionPlanAgainstNarration(
  woodFrogCaptionPlan,
  woodFrog.audio.narrationCues,
  woodFrog.production?.safeAreaProfileId ?? woodFrogCaptionPlan.safeAreaProfileId,
);

const provenance = woodFrog.audio.provenance;
if (!provenance) throw new Error('Wood Frog audio provenance is missing');
const soundscapePath = `public/${woodFrog.audio.file}`;
if (!existsSync(soundscapePath)) throw new Error(`Missing soundscape: ${soundscapePath}`);
if (sha256(soundscapePath) !== provenance.soundscape.sha256) {
  throw new Error('Wood Frog soundscape hash does not match its VideoSpec provenance');
}

for (const cue of woodFrog.audio.narrationCues) {
  const artifact = provenance.narration.cueArtifacts.find(({id}) => id === cue.id);
  if (!artifact) throw new Error(`Missing narration provenance for cue: ${cue.id}`);
  const path = `public/${cue.file}`;
  if (!existsSync(path)) throw new Error(`Missing narration cue: ${path}`);
  if (sha256(path) !== artifact.sha256) {
    throw new Error(`Narration cue hash mismatch: ${cue.id}`);
  }
}

if (provenance.narration.cueArtifacts.length !== woodFrog.audio.narrationCues.length) {
  throw new Error('Narration provenance contains stale or duplicate cue artifacts');
}

const captionPath = woodFrog.captions[0]?.file;
if (!captionPath || !existsSync(captionPath)) {
  throw new Error(`Missing caption artifact: ${captionPath ?? '(unspecified)'}`);
}
const expectedCaptions = `${captionsToWebVtt(
  captionPlanToDerivedCaptions(woodFrogCaptionPlan),
).trimEnd()}\n`;
if (readFileSync(captionPath, 'utf8') !== expectedCaptions) {
  throw new Error('Wood Frog caption artifact is stale or does not preserve narration timing/text');
}

if (productionPlan.status === 'owner-visual-approved') {
  const approval = productionPlan.visualApproval;
  if (!approval || !existsSync(approval.artifact.path)) {
    throw new Error('Owner-approved Wood Frog render artifact is missing');
  }
  if (sha256(approval.artifact.path) !== approval.artifact.sha256) {
    throw new Error('Wood Frog render does not match its exact owner visual approval');
  }
}

console.log(JSON.stringify({
  videoSpec: woodFrog.id,
  compositionId: woodFrog.compositionId,
  productionPlan: woodFrog.production?.productionPlanId,
  status: woodFrog.production?.outputReviewState,
  visualApproval: productionPlan.visualApproval,
  soundscapeSha256: provenance.soundscape.sha256,
  narrationCueCount: woodFrog.audio.narrationCues.length,
  captionPlan: woodFrogCaptionPlan.id,
  burnedInCaptionCueCount: woodFrogCaptionPlan.cues.length,
  captions: captionPath,
  passed: true,
}, null, 2));
