import {validatePhantomTrafficLockedMaster} from '../src/production/phantom-traffic-master-integrity';
import {parseManifests, type ArtifactManifest} from '../src/artifacts/schema';
import {validateRecoveryDecision} from '../src/artifacts/recovery';
import {createHash} from 'node:crypto';
import {existsSync, readFileSync} from 'node:fs';
import {captionPlanToDerivedCaptions, captionsToWebVtt} from '../src/captions/derive';
import {woodFrogCaptionPlan} from '../src/captions/plans/wood-frog';
import {validateCaptionPlanAgainstNarration} from '../src/captions/plan';
import {woodFrog, woodFrogTiktok} from '../src/content/videos/wood-frog';
import {
  validateWoodFrogProductionPlan,
  validateWoodFrogVideoSpec,
} from '../src/production/integrity';

const sha256 = (path: string) => createHash('sha256')
  .update(readFileSync(path))
  .digest('hex');

const requestedId = process.argv[2];
if (requestedId === 'phantom-traffic') {
  console.log(JSON.stringify(validatePhantomTrafficLockedMaster(), null, 2));
  process.exit(0);
}
const video = requestedId === woodFrog.id
  ? woodFrog
  : requestedId === woodFrogTiktok.id
    ? woodFrogTiktok
    : undefined;
if (!video) throw new Error(`Unknown production target: ${requestedId ?? '(missing)'}. Available: ${woodFrog.id}, ${woodFrogTiktok.id}`);

const productionPlan = validateWoodFrogProductionPlan();
validateWoodFrogVideoSpec(video);
validateCaptionPlanAgainstNarration(
  woodFrogCaptionPlan,
  video.audio.narrationCues,
  video.production?.safeAreaProfileId ?? woodFrogCaptionPlan.safeAreaProfileId,
);

const provenance = video.audio.provenance;
if (!provenance) throw new Error('Wood Frog audio provenance is missing');
const soundscapePath = `public/${video.audio.file}`;
if (!existsSync(soundscapePath)) throw new Error(`Missing soundscape: ${soundscapePath}`);
if (sha256(soundscapePath) !== provenance.soundscape.sha256) {
  throw new Error('Wood Frog soundscape hash does not match its VideoSpec provenance');
}

for (const cue of video.audio.narrationCues) {
  const artifact = provenance.narration.cueArtifacts.find(({id}) => id === cue.id);
  if (!artifact) throw new Error(`Missing narration provenance for cue: ${cue.id}`);
  const path = `public/${cue.file}`;
  if (!existsSync(path)) throw new Error(`Missing narration cue: ${path}`);
  if (sha256(path) !== artifact.sha256) {
    throw new Error(`Narration cue hash mismatch: ${cue.id}`);
  }
}

if (provenance.narration.cueArtifacts.length !== video.audio.narrationCues.length) {
  throw new Error('Narration provenance contains stale or duplicate cue artifacts');
}

const captionPath = video.captions[0]?.file;
if (!captionPath || !existsSync(captionPath)) {
  throw new Error(`Missing caption artifact: ${captionPath ?? '(unspecified)'}`);
}
const expectedCaptions = `${captionsToWebVtt(
  captionPlanToDerivedCaptions(woodFrogCaptionPlan),
).trimEnd()}\n`;
if (readFileSync(captionPath, 'utf8') !== expectedCaptions) {
  throw new Error('Wood Frog caption artifact is stale or does not preserve narration timing/text');
}

const recovered = process.argv.includes('--recovered');
let operationalArtifact: ArtifactManifest | undefined;
if (recovered) {
  const manifests=parseManifests(JSON.parse(readFileSync('artifacts/manifests.json','utf8')));
  const {replacement,historical}=validateRecoveryDecision(JSON.parse(readFileSync('artifacts/recovery-decision.json','utf8')),manifests);
  if (historical.identity.sha256 !== productionPlan.visualApproval?.artifact.sha256) throw new Error('Recovery decision conflicts with historical ProductionPlan approval');
  operationalArtifact = replacement;
  if (!existsSync(replacement.localPath) || sha256(replacement.localPath)!==replacement.identity.sha256) throw new Error('Accepted operational replacement missing or corrupt');
  if (video.id===woodFrogTiktok.id) {
    const derivative=manifests.find(m=>m.artifactId==='wood-frog-tiktok.recovered-master')!;
    operationalArtifact = derivative;
    if (!existsSync(derivative.localPath)||sha256(derivative.localPath)!==derivative.identity.sha256) throw new Error('Recovered TikTok derivative missing or corrupt');
  }
} else if (productionPlan.status === 'owner-visual-approved') {
  const approval = productionPlan.visualApproval;
  if (!approval || !existsSync(approval.artifact.path)) {
    throw new Error('Owner-approved Wood Frog render artifact is missing');
  }
  if (sha256(approval.artifact.path) !== approval.artifact.sha256) {
    throw new Error('Wood Frog render does not match its exact owner visual approval');
  }
}

console.log(JSON.stringify({
  videoSpec: video.id,
  compositionId: video.compositionId,
  productionPlan: video.production?.productionPlanId,
  status: recovered ? video.id === woodFrog.id ? 'recovered-operational-replacement' : 'recovery-derivative-review' : video.production?.outputReviewState,
  historicalVisualApproval: productionPlan.visualApproval,
  operationalArtifact: operationalArtifact ? {artifactId:operationalArtifact.artifactId,path:operationalArtifact.localPath,sha256:operationalArtifact.identity.sha256,provenance:operationalArtifact.provenance,approvalScope:operationalArtifact.approvalScope} : null,
  soundscapeSha256: provenance.soundscape.sha256,
  narrationCueCount: video.audio.narrationCues.length,
  captionPlan: woodFrogCaptionPlan.id,
  burnedInCaptionCueCount: woodFrogCaptionPlan.cues.length,
  captions: captionPath,
  recoveryMode: recovered,
  historicalApprovalTransferred: false,
  passed: true,
}, null, 2));
