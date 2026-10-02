import {existsSync, readdirSync, readFileSync, writeFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {extname} from 'node:path';
import {parseManifests, type ArtifactManifest} from '../src/artifacts/schema';
import {chocolatePublicationAuthorization as decision} from '../src/platform-variants/chocolate-publication';
import {chocolateFileHash} from '../src/production/chocolate-master-integrity';
import {stableJson} from '../src/content-intelligence/run-schema';

const collection = 'artifacts/chocolate-crystal-choice-publication-manifests.json';
try{execFileSync('git',['cat-file','-e',`HEAD:${collection}`],{stdio:'pipe'});throw new Error('Committed release immutable; create new revision.');}catch(e){if(e instanceof Error&&e.message.startsWith('Committed release'))throw e;}
const previous:ArtifactManifest[]=existsSync(collection)?parseManifests(JSON.parse(readFileSync(collection,'utf8'))):[];for(const m of previous)if(chocolateFileHash(m.localPath)!==m.identity.sha256)throw new Error('Registered release bytes changed: '+m.localPath);
const files = (folder: string): string[] => readdirSync(folder, {withFileTypes: true}).flatMap(entry => entry.isDirectory() ? files(`${folder}/${entry.name}`) : [`${folder}/${entry.name}`]);
const paths = [...files('content-intelligence/reviews/chocolate-crystal-choice-publication-v1'), ...files('artifacts/deliveries/chocolate-crystal-choice-publication-v1')].sort();
const recordedAt = new Date().toISOString();
const records: ArtifactManifest[] = [...previous,...paths.filter(path=>!previous.some(m=>m.localPath===path)).map((path, offset):ArtifactManifest => ({
  schemaVersion: 1, artifactId: `chocolate-crystal-choice.publication-v1.${previous.length+offset}`, contentId: 'chocolate-crystal-choice', artifactType: path.includes('/deliveries/') ? 'delivery-file' : 'qa-evidence', revision: 1,
  identity: {sha256: chocolateFileHash(path), bytes: readFileSync(path).length, mimeType: extname(path) === '.mp4' ? 'video/mp4' : extname(path) === '.png' ? 'image/png' : extname(path) === '.json' ? 'application/json' : 'text/plain'},
  createdAt: null, creationUnknownReason: 'Archive recording time is not an authoritative file creation or owner review time.', recordedAt, sourceCommit: decision.reviewedCommit,
  productionPlanId: 'production-plan.chocolate-crystal-choice.material-cutaway', captionPlanId: 'caption-plan.chocolate-crystal-choice.material-cutaway', platformVariantId: null,
  approvalDecisionId: null, approvalScope: 'none', publication: 'authorized-not-published', localPath: path,
  locations: [{provider: 'git', key: path, durability: 'git-tracked'}], provenance: 'ORIGINAL_PRODUCTION', retention: 'DURABLE_REQUIRED', historicalSha256: null, historicalStatus: 'new-production', replacesArtifactId: null, parentArtifactIds: [decision.masterArtifactId], exactBytesMatter: true,
  reproducibility: {status: 'derived', recipe: null, evidence: ['content-intelligence/reviews/chocolate-crystal-choice-publication-v1/owner-decision.json', 'content-intelligence/reviews/chocolate-crystal-choice-publication-v1/final-bindings.json']},
}))];
writeFileSync(collection, stableJson(parseManifests(records), 2)+'\n');
console.log({retainedReleaseArtifacts: records.length, publicationOccurred: false});
