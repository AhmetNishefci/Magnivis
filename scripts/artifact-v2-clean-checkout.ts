import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {loadArtifactRegistry} from '../src/artifacts/registry';
import {loadMediaRegistry, mediaHash} from '../src/artifacts/media';
import {validateCanonicalMediaDurability} from './artifact-v2-integrity';
import {resolveDeliveryUpload} from '../src/delivery/media-bindings';
const trackedList = process.argv[2];
if (!trackedList) throw new Error('Usage from isolated Git checkout: node --import tsx scripts/artifact-v2-clean-checkout.ts <snapshot-tracked-paths.json>');
const tracked = JSON.parse(readFileSync(trackedList, 'utf8')) as string[];
const media = validateCanonicalMediaDurability(process.cwd(), tracked);
const required = loadArtifactRegistry().filter(m => m.retention === 'DURABLE_REQUIRED');
for (const m of required) {
  const location = m.locations.find(l => l.provider === 'git');
  if (!location || !tracked.includes(location.key)) throw new Error('Missing required archive: ' + m.artifactId);
  const path = resolve(location.key);
  if (mediaHash(path) !== m.identity.sha256 || readFileSync(path).length !== m.identity.bytes) throw new Error('Required historical archive mismatch: ' + m.artifactId);
}
const bindings = JSON.parse(readFileSync('content-intelligence/reviews/chocolate-crystal-choice-publication-v1/final-bindings.json', 'utf8'));
const registry = loadMediaRegistry();
const uploads = bindings.packages.map((p: {directory: string}) => resolveDeliveryUpload(JSON.parse(readFileSync(`${p.directory}/manifest.json`, 'utf8')), registry));
console.log(JSON.stringify({passed: true, media, requiredNativeArtifactsVerified: required.length, chocolateUploads: uploads, generationPerformed: false, mediaModified: false}, null, 2));
