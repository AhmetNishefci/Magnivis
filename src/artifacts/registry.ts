import {existsSync,readFileSync} from 'node:fs';
import {parseManifests} from './schema';
/** Append-only content collections preserve the exact historical manifest file. */
export const loadArtifactRegistry = () => parseManifests([
 ...parseManifests(JSON.parse(readFileSync('artifacts/manifests.json','utf8'))),
 ...['artifacts/longitude-clock-manifests.json'].flatMap(path => existsSync(path)?parseManifests(JSON.parse(readFileSync(path,'utf8'))):[]),
]);
