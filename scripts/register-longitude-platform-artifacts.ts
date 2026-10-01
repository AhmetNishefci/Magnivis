import {existsSync, readFileSync, readdirSync, writeFileSync} from 'node:fs';
import {extname} from 'node:path';
import {parseManifests, type ArtifactManifest} from '../src/artifacts/schema';
import {longitudeMasterDecision as decision} from '../src/production/longitude-master-integrity';
import {longitudeFileHash} from '../src/production/longitude-integrity';
import {stableJson} from '../src/content-intelligence/run-schema';

const collection = 'artifacts/longitude-clock-platform-manifests.json';
if (existsSync(collection)) throw new Error('Preserve the registered milestone; a changed artifact requires a new revision.');
const recordedAt = new Date().toISOString();
const files = (directory: string): string[] => readdirSync(directory, {withFileTypes: true}).flatMap(entry => entry.isDirectory() ? files(`${directory}/${entry.name}`) : [`${directory}/${entry.name}`]);
const paths = [decision.artifact.path, 'artifacts/covers/longitude-clock-instagram-cover-v1.png', 'artifacts/longitude-clock-cover-assets.json', ...files('content-intelligence/reviews/longitude-clock-master-lock-v1'), ...files('content-intelligence/reviews/longitude-clock-platform-v1'), ...files('artifacts/qa-evidence/longitude-clock-platform-v1'), ...files('artifacts/deliveries/longitude-clock-v1')].sort();
const records: ArtifactManifest[] = paths.map((path, index) => {
  const isMaster = path === decision.artifact.path;
  const isCover = path === 'artifacts/covers/longitude-clock-instagram-cover-v1.png';
  const extension = extname(path);
  const mimeType = extension === '.mp4' ? 'video/mp4' : extension === '.png' ? 'image/png' : extension === '.json' ? 'application/json' : 'text/plain';
  return {
    schemaVersion: 1, artifactId: isMaster ? decision.masterArtifactId : isCover ? 'longitude-clock.instagram-cover.v1' : `longitude-clock.platform-v1.${index}`,
    contentId: 'longitude-clock', artifactType: isMaster ? 'video-master' : isCover ? 'cover-image' : path.includes('/deliveries/') ? 'delivery-file' : 'qa-evidence', revision: 1,
    identity: {sha256: longitudeFileHash(path), bytes: readFileSync(path).length, mimeType},
    createdAt: null, creationUnknownReason: 'File creation time is not an authoritative editorial or approval event.', recordedAt,
    sourceCommit: decision.reviewedCommit, productionPlanId: decision.reviewedProductionPlan.id, captionPlanId: decision.captionPlan.id, platformVariantId: null,
    approvalDecisionId: isMaster ? decision.id : null, approvalScope: isMaster ? 'owner-visual' : 'none', publication: 'not-authorized', localPath: path,
    locations: [{provider: 'git', key: path, durability: 'git-tracked'}], provenance: 'ORIGINAL_PRODUCTION', retention: 'DURABLE_REQUIRED',
    historicalSha256: null, historicalStatus: 'new-production', replacesArtifactId: null, parentArtifactIds: isMaster ? [decision.candidateArtifactId] : [decision.masterArtifactId], exactBytesMatter: true,
    reproducibility: {status: isMaster ? 'hash-only' : 'derived', recipe: null, evidence: ['content-intelligence/reviews/longitude-clock-platform-v1/owner-review.md']},
  };
});
writeFileSync(collection, stableJson(parseManifests(records), 2)+'\n');
console.log({registered: records.length, masterArtifactId: decision.masterArtifactId, uniqueBytes: [...new Map(records.map(r => [r.identity.sha256, r.identity.bytes!])).values()].reduce((a, b) => a+b, 0)});
