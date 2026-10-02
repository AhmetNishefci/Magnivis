import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {z} from 'zod';
import {validateArchitectureScope, validateCanonicalMediaDurability} from './artifact-v2-integrity';
import {loadMediaRegistry, mediaHash, mediaReference} from '../src/artifacts/media';
import {resolveDeliveryUpload} from '../src/delivery/media-bindings';
import {sha256Json} from '../src/content-intelligence/run-schema';
import {publicationRegistry, metricSnapshotRegistry} from '../src/operations/registry';
const read = (path: string) => JSON.parse(readFileSync(path, 'utf8'));
const scope = validateArchitectureScope();
const media = validateCanonicalMediaDurability();
const registry = loadMediaRegistry();
const imported = read('system-audits/artifact-architecture-v2/canonical-baseline.json') as {artifacts: {id: string; recordSha256: string}[]};
for (const row of imported.artifacts) {
  const current = registry.list().find(m => m.id === row.id);
  if (!current || sha256Json(current) !== row.recordSha256) throw new Error('Immutable imported media identity drift: ' + row.id);
}
const platforms = z.enum(['youtube', 'tiktok', 'instagram', 'facebook']);
const nullField = z.null();
const report = z.object({
  schemaVersion: z.literal(1), id: z.literal('owner-report.chocolate-crystal-choice.scheduling.v1'),
  evidenceClass: z.literal('OWNER-REPORTED SCHEDULING EVIDENCE'), owner: z.literal('Ahmet Nishefci'), authority: z.literal('explicit-owner-message'),
  recordedAt: z.iso.datetime({offset: true}), recordedAtMeaning: z.string().min(1), ownerSchedulingActionTime: nullField,
  scheduledPublication: nullField, scheduledPublicationUnknownReason: z.string().min(1),
  releaseBinding: z.object({path: z.literal('content-intelligence/reviews/chocolate-crystal-choice-publication-v1/final-bindings.json'), sha256: z.string().regex(/^[a-f0-9]{64}$/)}).strict(),
  master: z.object({artifactId: z.literal('chocolate-crystal-choice.locked-master.v1'), path: z.literal('artifacts/masters/chocolate-crystal-choice-candidate-v1.mp4'), sha256: z.literal('3491a81c031c459493909ef55dcf217699ac30d01a714942da90ce4e963814e7')}).strict(),
  platforms: z.array(z.object({platform: platforms, ownerReportedState: z.literal('manually-scheduled'), deliveryId: z.string(), manifestFileSha256: z.string().regex(/^[a-f0-9]{64}$/), platformContentId: nullField, publicUrl: nullField, publishedAt: nullField, presentationResults: nullField, deviceEvidence: nullField, screenshots: nullField, analytics: nullField}).strict()).length(4),
  publicationOccurred: z.literal(false), completedPublicationRecordsCreated: z.literal(false), assistantExternalAction: z.literal(false),
}).strict().parse(read('content-intelligence/operations/chocolate-crystal-choice-scheduling-v1/owner-report.json'));
if (mediaHash(report.releaseBinding.path) !== report.releaseBinding.sha256 || mediaHash(report.master.path) !== report.master.sha256 || new Set(report.platforms.map(p => p.platform)).size !== 4) throw new Error('Scheduling evidence binding drift');
const bindings = read(report.releaseBinding.path);
for (const p of report.platforms) {
  const original = bindings.packages.find((b: {platform: string}) => b.platform === p.platform);
  if (!original || p.deliveryId !== original.deliveryId || p.manifestFileSha256 !== original.manifestFileSha256) throw new Error('Scheduling report invented a different package');
}
if (publicationRegistry.list().some(p => p.id.includes('chocolate-crystal-choice')) || metricSnapshotRegistry.list().some(m => JSON.stringify(m).includes('chocolate-crystal-choice'))) throw new Error('Scheduled does not establish publication/analytics');
const uploads = bindings.packages.map((p: {directory: string}) => resolveDeliveryUpload(read(`${p.directory}/manifest.json`), registry));
if (uploads.length !== 4 || uploads.some((u: {mediaArtifact: {sha256: string}; uploadFile: string}) => u.mediaArtifact.sha256 !== report.master.sha256 || u.uploadFile !== report.master.path)) throw new Error('Canonical Chocolate resolution failed');
const tracked = new Set(execFileSync('git', ['ls-files', '-z'], {encoding: 'utf8'}).split('\0').filter(Boolean));
for (const path of ['artifacts/media-catalog.json', 'content-intelligence/operations/chocolate-crystal-choice-scheduling-v1/owner-report.json']) if (!tracked.has(path)) throw new Error('Required V2 record is not Git tracked: ' + path);
for (const m of registry.list()) registry.resolveFile(mediaReference(m));
console.log(JSON.stringify({passed: true, scope, media, schedulingEvidence: report.id, exactSchedulingDateTime: 'unknown', publicationEvidenceCreated: false, importedIdentitiesPreserved: imported.artifacts.length, chocolateCanonicalUploads: uploads.map((u: {uploadFile: string}) => u.uploadFile), historicalStrategy: 'B: frozen legacy, prospective reference delivery', mediaModified: false, cycle4Started: false, nextGate: 'AHMET — ARTIFACT ARCHITECTURE V2 OWNER REVIEW'}, null, 2));
