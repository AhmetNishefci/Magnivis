import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {z} from 'zod';
import {parseManifests} from '../src/artifacts/schema';
import {longitudeFileHash} from '../src/production/longitude-integrity';
import {validateLongitudeLockedMaster} from '../src/production/longitude-master-integrity';
import {longitudePlatformVariants} from '../src/platform-variants/variants/longitude-clock';
import {coverAssetSchema, presentationOutputSchema, presentationQaSchema} from '../src/platform-variants/presentation';
import {platformVariantRegistry} from '../src/platform-variants/registry';
import {publicationRegistry, metricSnapshotRegistry} from '../src/operations/registry';
import {validateDeliveryPackage} from './delivery-packages';
import {sha256Json} from '../src/content-intelligence/run-schema';

const read = (path: string) => JSON.parse(readFileSync(path, 'utf8'));
const root = 'content-intelligence/reviews/longitude-clock-platform-v1';
const master = validateLongitudeLockedMaster();
const index = read(`${root}/delivery-index.json`);
if (index.platformApproved || index.publicationAuthorized || index.packages.length !== 4) throw new Error('Invalid pending delivery scope');
for (const entry of index.packages) {
  const manifest = validateDeliveryPackage(entry.directory);
  const variant = platformVariantRegistry.get(manifest.source.platformVariant.id);
  if (manifest.state !== 'draft-review' || manifest.publishEligible || variant.status !== 'editorial-review' || variant.approval || variant.previewStatus !== 'ready-for-private-preview') throw new Error('Inferred platform/publication approval');
  if (longitudeFileHash(`${entry.directory}/video.mp4`) !== master.artifact.sha256 || longitudeFileHash(`${entry.directory}/manifest.json`) !== entry.manifestFileSha256 || sha256Json(manifest) !== entry.manifestSha256 || manifest.deliveryId !== entry.deliveryId) throw new Error('Delivery identity drift');
}
for (const variant of longitudePlatformVariants) {
  if (variant.productionIntent.renderStrategy !== 'reuse-existing-master' || variant.sourceMaster?.artifact.sha256 !== master.artifact.sha256 || variant.duration.targetSeconds !== 47 || variant.packaging.claimIds.length !== 8) throw new Error('Master reuse/editorial binding drift');
}
const qas = z.array(presentationQaSchema).parse(read(`${root}/presentation-qa.json`));
const outputs = z.array(presentationOutputSchema).parse(read(`${root}/presentation-outputs.json`));
const covers = z.array(coverAssetSchema).parse(read('artifacts/longitude-clock-cover-assets.json'));
if (qas.length !== 9 || outputs.length !== 9 || covers.length !== 1) throw new Error('Missing surface/cover evaluation');
for (const qa of qas) {
  if (qa.mediaSha256 !== master.artifact.sha256 || qa.testedAt || qa.reviewer || qa.device || qa.os || qa.appVersion || !['LOCAL_APPROXIMATION', 'PRIVATE_PREVIEW_PENDING'].includes(qa.state)) throw new Error('Invented real-device evidence');
  for (const path of qa.evidence) readFileSync(path);
}
for (const output of outputs) if (output.derivativeArtifactId || output.masterArtifactId !== master.masterArtifactId) throw new Error('Unnecessary derivative');
for (const cover of covers) if (cover.status !== 'review' || cover.approvalDecisionId || cover.crop || cover.sourceVideoSha256 !== master.artifact.sha256 || longitudeFileHash('artifacts/covers/longitude-clock-instagram-cover-v1.png') !== cover.sha256) throw new Error('Cover drift/approval/crop invention');
const intake = read(`${root}/publication-evidence-intake.json`);
if (intake.publicationAuthorized || intake.purpose !== 'prepared-intake-not-publication-record') throw new Error('Invalid publication intake');
for (const entry of intake.entries) if (entry.publicUrl || entry.platformContentId || entry.publishedAt || entry.publishedOn || entry.ownerPresentationResult || entry.actualUploadedVariant || entry.actualUploadedDelivery) throw new Error('Fabricated publication');
if (publicationRegistry.list().some(r => r.id.includes('longitude-clock')) || metricSnapshotRegistry.list().some(r => JSON.stringify(r).includes('longitude-clock'))) throw new Error('Premature publication or analytics record');
const analytics = read(`${root}/analytics-readiness.json`);
if (analytics.metricSnapshots.length || analytics.publicationRecords.length || analytics.captureAt || analytics.observationWindow) throw new Error('Fabricated analytics');
const coverProvenance = read(`${root}/cover-provenance.json`);
for (const binding of coverProvenance.sourceBindings) if (longitudeFileHash(binding.path) !== binding.sha256) throw new Error('Cover implementation/provenance drift');
if (coverProvenance.ownerApproved || coverProvenance.museumPixelsUsed || coverProvenance.externalProductionImagery || coverProvenance.crop) throw new Error('Invented cover approval/rights/crop');
const records = parseManifests(read('artifacts/longitude-clock-platform-manifests.json'));
for (const record of records) {
  if (longitudeFileHash(record.localPath) !== record.identity.sha256 || readFileSync(record.localPath).length !== record.identity.bytes || record.publication !== 'not-authorized') throw new Error('Retained artifact identity drift');
  if (record.artifactId === master.masterArtifactId ? record.approvalScope !== 'owner-visual' : record.approvalScope !== 'none') throw new Error('Approval transfer');
}
const checkpoint = 'e6fd1653d98a9e9049087f56262885e2a05a3018';
const protectedPaths = execFileSync('git', ['ls-tree', '-r', '--name-only', checkpoint], {encoding: 'utf8'}).trim().split('\n').filter(path => path.includes('/longitude-clock-production-') || path.startsWith('artifacts/qa-evidence/longitude-clock-candidate-') || path.startsWith('public/audio/longitude-clock') || path.startsWith('public/fonts/longitude-clock') || path.startsWith('src/production/plans/longitude-clock') || path.startsWith('src/captions/plans/longitude-clock') || ['artifacts/manifests.json', 'artifacts/presentation-profiles.json', 'artifacts/presentation-qa.json', 'artifacts/cover-assets.json', 'artifacts/longitude-clock-manifests.json', 'artifacts/longitude-clock-v2-manifests.json', 'artifacts/masters/longitude-clock-candidate-v1.mp4', master.artifact.path, 'AGENTS.md', 'docs/CREATIVE-DIRECTION.md'].includes(path));
for (const path of protectedPaths) if (!readFileSync(path).equals(execFileSync('git', ['show', `${checkpoint}:${path}`], {maxBuffer: 64*1024*1024}))) throw new Error('Historical/master dependency drift: '+path);
z.object({passed: z.literal(true), fullVideoAndAudioDecode: z.literal(true), masterModified: z.literal(false), realDevicePasses: z.literal(0)}).passthrough().parse(read('artifacts/qa-evidence/longitude-clock-platform-v1/media-decode.json'));
const captionInspection = read('artifacts/qa-evidence/longitude-clock-platform-v1/caption-midpoints.json');
const approvedCues = read('src/captions/plans/longitude-clock-v2.json').cues;
if (!captionInspection.passed || captionInspection.realDevicePasses || captionInspection.mediaSha256 !== master.artifact.sha256 || captionInspection.captionPlanSha256 !== master.captionPlan.sha256 || captionInspection.inspectedCaptionMidpoints !== approvedCues.length) throw new Error('Caption midpoint review binding drift');
const observations = captionInspection.sheets.flatMap((sheet: {observations: unknown[]}) => sheet.observations);
if (sha256Json(observations) !== sha256Json(approvedCues.map((cue: {id: string; startFrame: number; endFrame: number; lines: string[]}) => ({cueId: cue.id, frame: Math.floor((cue.startFrame+cue.endFrame)/2), lines: cue.lines})))) throw new Error('Caption midpoint coverage drift');
for (const sheet of captionInspection.sheets) if (longitudeFileHash(sheet.path) !== sheet.sha256) throw new Error('Decoded caption sheet drift');
console.log(JSON.stringify({passed: true, master, variants: longitudePlatformVariants.map(v => ({id: v.id, status: v.status})), packages: index.packages.length, surfaces: qas.length, realDevicePasses: 0, covers: covers.length, retainedArtifacts: records.length, preservedFiles: protectedPaths.length, publicationAuthorized: false}, null, 2));
