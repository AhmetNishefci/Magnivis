import {existsSync, readdirSync, readFileSync, writeFileSync} from 'node:fs';
import {extname} from 'node:path';
import {parseManifests, type ArtifactManifest} from '../src/artifacts/schema';
import {longitudePublicationAuthorization as decision} from '../src/platform-variants/longitude-publication';
import {longitudeFileHash} from '../src/production/longitude-integrity';
import {stableJson} from '../src/content-intelligence/run-schema';

const collection = 'artifacts/longitude-clock-publication-manifests.json';
if (existsSync(collection)) throw new Error('Preserve the registered release revision.');
const files = (folder: string): string[] => readdirSync(folder, {withFileTypes: true}).flatMap(entry => entry.isDirectory() ? files(`${folder}/${entry.name}`) : [`${folder}/${entry.name}`]);
const paths = [...files('content-intelligence/reviews/longitude-clock-publication-v1'), ...files('artifacts/deliveries/longitude-clock-publication-v1')].sort();
const recordedAt = new Date().toISOString();
const records: ArtifactManifest[] = paths.map((path, index) => ({
  schemaVersion: 1, artifactId: `longitude-clock.publication-v1.${index}`, contentId: 'longitude-clock', artifactType: path.includes('/deliveries/') ? 'delivery-file' : 'qa-evidence', revision: 1,
  identity: {sha256: longitudeFileHash(path), bytes: readFileSync(path).length, mimeType: extname(path) === '.mp4' ? 'video/mp4' : extname(path) === '.png' ? 'image/png' : extname(path) === '.json' ? 'application/json' : 'text/plain'},
  createdAt: null, creationUnknownReason: 'Archive recording time is not an authoritative file creation or owner review time.', recordedAt, sourceCommit: decision.reviewedCommit,
  productionPlanId: 'production-plan.longitude-clock.v1', captionPlanId: 'caption-plan.longitude-clock.v2', platformVariantId: null,
  approvalDecisionId: null, approvalScope: 'none', publication: 'authorized-not-published', localPath: path,
  locations: [{provider: 'git', key: path, durability: 'git-tracked'}], provenance: 'ORIGINAL_PRODUCTION', retention: 'DURABLE_REQUIRED', historicalSha256: null, historicalStatus: 'new-production', replacesArtifactId: null, parentArtifactIds: [decision.masterArtifactId], exactBytesMatter: true,
  reproducibility: {status: 'derived', recipe: null, evidence: ['content-intelligence/reviews/longitude-clock-publication-v1/owner-decision.json', 'content-intelligence/reviews/longitude-clock-publication-v1/final-bindings.json']},
}));
writeFileSync(collection, stableJson(parseManifests(records), 2)+'\n');
console.log({retainedReleaseArtifacts: records.length, publicationOccurred: false});
