import {readFileSync, writeFileSync} from 'node:fs';
import {loadMediaRegistry, mediaHash, mediaReference, registerMediaArtifact} from '../src/artifacts/media';
const registry = loadMediaRegistry();
const [command, path] = process.argv.slice(2);
if (command === 'reference' && path) {
  const artifact = registry.byHash(mediaHash(path));
  if (!artifact) throw new Error('Payload not registered: register a provenance-bound MediaArtifact first');
  registry.resolveFile(mediaReference(artifact));
  console.log(JSON.stringify({mediaArtifact: mediaReference(artifact), canonicalPath: artifact.canonicalPath}, null, 2));
} else if (command === 'register' && path) {
  const next = registerMediaArtifact(registry, JSON.parse(readFileSync(path, 'utf8')));
  writeFileSync('artifacts/media-catalog.json', JSON.stringify({schemaVersion: 2, artifacts: next.list()}, null, 2) + '\n');
  console.log('Registered exact existing bytes by reference; no media copied or authority granted.');
} else if (command === 'verify') {
  for (const artifact of registry.list()) registry.resolveFile(mediaReference(artifact));
  console.log(JSON.stringify({passed: true, mediaArtifacts: registry.list().length}));
} else throw new Error('Usage: pnpm artifacts:media verify | reference <file> | register <artifact.json>');
