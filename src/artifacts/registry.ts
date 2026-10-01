import {existsSync,readFileSync} from 'node:fs';
import {parseManifests} from './schema';
/** Append-only content collections preserve the exact historical manifest file. */
export const loadArtifactRegistry = () => parseManifests([
 ...parseManifests(JSON.parse(readFileSync('artifacts/manifests.json','utf8'))),
 ...['artifacts/longitude-clock-manifests.json','artifacts/longitude-clock-v2-manifests.json','artifacts/longitude-clock-platform-manifests.json','artifacts/longitude-clock-publication-manifests.json','artifacts/chocolate-crystal-choice-manifests.json'].flatMap(path => existsSync(path)?parseManifests(JSON.parse(readFileSync(path,'utf8'))):[]),
]);
