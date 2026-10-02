import {mkdtempSync, realpathSync, mkdirSync, writeFileSync, rmSync, readFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {describe, it, expect} from 'vitest';
import {createMediaRegistry, loadMediaRegistry, mediaHash, mediaReference, registerMediaArtifact, type MediaArtifact} from '../src/artifacts/media';
import {resolveDeliveryUpload} from '../src/delivery/media-bindings';
import {validateArchitectureScope, validateCanonicalMediaDurability, architecturePreviousDocumentBytes} from '../scripts/artifact-v2-integrity';
const create = () => {
  const root = mkdtempSync(join(tmpdir(), 'magnivis-media-'));
  writeFileSync(join(root, 'recipe.json'), '{}'); writeFileSync(join(root, 'one.wav'), 'synthetic audio');
  const sha256 = mediaHash(join(root, 'one.wav'));
  const media: MediaArtifact = {id: `media.${sha256}`, sha256, canonicalPath: 'one.wav', mediaType: 'audio/wav', bytes: 15, provenance: {kind: 'original-production', sourceCommit: 'f7525176463b4e80045fb6d5d1e84de8de160569', sourceRecords: ['recipe.json'], createdAt: null, creationTimeUnknownReason: 'Synthetic test fixture'}, parents: []};
  return {root, media};
};
describe('Media content identity, historical safety and durability', () => {
  it('enforces scoped historical preservation and canonical durability in pnpm check', () => {
    expect(validateArchitectureScope().passed).toBe(true);
    expect(validateCanonicalMediaDurability().passed).toBe(true);
  });
  it('rejects new same-byte durable copies and immutable identity rebinding', () => {
    const {root, media} = create();
    try {
      const registry = createMediaRegistry([media], root); writeFileSync(join(root, 'two.wav'), 'synthetic audio');
      expect(() => registerMediaArtifact(registry, {...media, canonicalPath: 'two.wav'}, root)).toThrow(/duplicate/);
      expect(() => registry.get({...mediaReference(media), sha256: '0'.repeat(64)})).toThrow();
      const obtained = registry.get(mediaReference(media)); obtained.canonicalPath = 'two.wav';
      expect(registry.get(mediaReference(media)).canonicalPath).toBe('one.wav');
      writeFileSync(join(root, 'one.wav'), 'modified audio'); expect(() => registry.resolveFile(mediaReference(media))).toThrow(/integrity/);
    } finally {rmSync(root, {recursive: true, force: true});}
  });
  it('permits an explicitly hash-bound immutable evidence snapshot and rejects a stale exception', () => {
    const {root, media} = create();
    try {
      writeFileSync(join(root, 'snapshot.wav'), 'synthetic audio'); writeFileSync(join(root, 'decision.json'), '{"testOnly":"independent immutable review context"}');
      const exception: MediaArtifact = {...media, id: `${media.id}.review-snapshot`, canonicalPath: 'snapshot.wav', provenance: {...media.provenance, kind: 'evidence-snapshot'}, exception: {kind: 'immutable-evidence-snapshot', duplicateOf: mediaReference(media), reason: 'Independent review snapshot required by the test evidence context.', decision: {path: 'decision.json', sha256: mediaHash(join(root, 'decision.json'))}}};
      const registry = registerMediaArtifact(createMediaRegistry([media], root), exception, root);
      expect(registry.resolveFile(mediaReference(exception))).toBe(realpathSync(join(root, 'snapshot.wav')));
      writeFileSync(join(root, 'decision.json'), 'changed'); expect(() => registry.resolveFile(mediaReference(exception))).toThrow(/decision drift/);
      expect(() => createMediaRegistry([{...media, parents: [mediaReference(exception)]}, {...exception, parents: [mediaReference(media)]}], root)).toThrow(/Cyclic/);
    } finally {rmSync(root, {recursive: true, force: true});}
  });
  it('keeps historical Chocolate, Longitude, Phantom and Wood Frog delivery identities verifiable', () => {
    const registry = loadMediaRegistry();
    const legacy = JSON.parse(readFileSync('system-audits/artifact-architecture-v2/legacy-binaries.json', 'utf8'));
    for (const row of legacy.files) expect(mediaHash(row.path)).toBe(row.sha256);
    for (const content of ['chocolate-crystal-choice-publication-v1/chocolate-crystal-choice-locked', 'longitude-clock-publication-v1/longitude-clock-locked']) {
      const m = JSON.parse(readFileSync(`artifacts/deliveries/${content}/youtube-shorts/manifest.json`, 'utf8'));
      expect(resolveDeliveryUpload(m, registry).legacyPackage).toBe(true);
      expect(resolveDeliveryUpload(m, registry).uploadFile).toContain('artifacts/masters/');
    }
    const catalog = registry.list();
    expect(catalog.some(m => m.canonicalPath.includes('phantom-traffic'))).toBe(true);
    expect(catalog.some(m => m.canonicalPath.includes('wood-frog'))).toBe(true);
  });
  it('rejects new unregistered/duplicate durable payloads and permits only explicit catalog entries', () => {
    const {root, media} = create();
    try {
      writeFileSync(join(root, 'artifacts.json'), '{}');
      // This fixture mirrors a checkout without requiring Git or external media services.
      const legacyRoot = join(root, 'system-audits/artifact-architecture-v2');
      mkdirSync(legacyRoot, {recursive: true}); mkdirSync(join(root, 'artifacts'));
      writeFileSync(join(legacyRoot, 'legacy-binaries.json'), '{"files":[]}');
      writeFileSync(join(root, 'artifacts/media-catalog.json'), JSON.stringify({schemaVersion: 2, artifacts: [media]}));
      const tracked = ['one.wav', 'recipe.json'];
      expect(validateCanonicalMediaDurability(root, tracked).passed).toBe(true);
      writeFileSync(join(root, 'duplicate.wav'), 'synthetic audio');
      expect(() => validateCanonicalMediaDurability(root, [...tracked, 'duplicate.wav'])).toThrow(/New durable binary/);
      writeFileSync(join(root, 'disguised-payload.dat'), 'synthetic audio');
      expect(() => validateCanonicalMediaDurability(root, [...tracked, 'disguised-payload.dat'])).toThrow(/New durable binary/);
      writeFileSync(join(root, 'new-large-payload.bin'), Buffer.alloc(1024 * 1024, 0));
      expect(() => validateCanonicalMediaDurability(root, [...tracked, 'new-large-payload.bin'])).toThrow(/New durable binary/);
      expect(() => validateCanonicalMediaDurability(root, ['recipe.json'])).toThrow(/not Git tracked/);
    } finally {rmSync(root, {recursive: true, force: true});}
  });
  it('accepts only the exact owner-authorized documentation amendment', () => {
    const current = readFileSync('AGENTS.md');
    const old = architecturePreviousDocumentBytes('AGENTS.md', current);
    expect(old.equals(readFileSync('system-audits/artifact-architecture-v2/documents-before/AGENTS.md'))).toBe(true);
    expect(() => architecturePreviousDocumentBytes('AGENTS.md', Buffer.concat([current, Buffer.from('arbitrary policy edit')]))).toThrow();
  });
});
