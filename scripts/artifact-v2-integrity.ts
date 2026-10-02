import {readFileSync, existsSync, statSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {z} from 'zod';
import {loadMediaRegistry, mediaReference, mediaHash} from '../src/artifacts/media';
const auditRoot = 'system-audits/artifact-architecture-v2';
const hash = (bytes: Buffer) => createHash('sha256').update(bytes).digest('hex');
const read = (path: string) => JSON.parse(readFileSync(path, 'utf8'));
const digest = z.string().regex(/^[a-f0-9]{64}$/);
const amendmentSchema = z.object({
  schemaVersion: z.literal(1),
  baselineCommit: z.literal('f7525176463b4e80045fb6d5d1e84de8de160569'),
  authority: z.literal('explicit-owner-artifact-architecture-v2-instruction'),
  documents: z.array(z.object({path: z.string(), beforeSnapshot: z.string(), beforeSha256: digest, afterSha256: digest}).strict()),
}).strict();
/** Exact scoped documentation amendment, never a general historical-policy exemption. */
export const architecturePreviousDocumentBytes = (path: string, current: Buffer): Buffer => {
  if (!existsSync(`${auditRoot}/authority-amendment.json`)) return current;
  const amendment = amendmentSchema.parse(read(`${auditRoot}/authority-amendment.json`));
  const row = amendment.documents.find(d => d.path === path);
  if (!row) return current;
  if (hash(current) === row.beforeSha256) return current;
  if (hash(current) !== row.afterSha256) throw new Error('Unauthorized architecture authority/document edit: ' + path);
  const previous = readFileSync(row.beforeSnapshot);
  if (hash(previous) !== row.beforeSha256) throw new Error('Historical document snapshot drift: ' + path);
  return previous;
};
const allowedFiles = new Set([
  'AGENTS.md', 'artifacts/media-catalog.json', 'package.json',
  'docs/ARCHITECTURE.md', 'docs/ARTIFACT-STORAGE.md', 'docs/DELIVERY-PACKAGES.md', 'docs/PLATFORM-VARIANTS.md', 'docs/OPERATIONS.md', 'docs/PROJECT-STATE.md', 'docs/DECISIONS.md', 'docs/ARTIFACT-ARCHITECTURE-V2.md',
  'src/artifacts/media.ts', 'src/delivery/schema.ts', 'src/delivery/media-bindings.ts', 'src/platform-variants/schema.ts', 'src/platform-variants/registry.ts', 'src/operations/schema.ts', 'src/operations/registry.ts',
  'scripts/delivery-packages.ts', 'scripts/delivery.ts', 'scripts/verify-durable-artifacts.ts', 'scripts/artifacts.ts', 'scripts/resolve-delivery-media.ts', 'scripts/media-artifacts.ts', 'scripts/artifact-v2-clean-checkout.ts', 'scripts/artifact-v2-integrity.ts', 'scripts/validate-artifact-v2.ts',
  'scripts/primary-narrator-authority-integrity.ts', 'scripts/validate-chocolate-finalization.ts', 'scripts/validate-chocolate-publication.ts', 'scripts/validate-chocolate-direction.ts', 'scripts/validate-chocolate-research.ts', 'scripts/validate-longitude-publication.ts', 'scripts/validate-longitude-platform.ts',
  'tests/media-artifacts.test.ts', 'tests/reference-delivery.test.ts',
]);
export const validateArchitectureScope = () => {
  const baseline = read(`${auditRoot}/historical-bindings.json`) as {baselineCommit: string; files: {path: string; sha256: string}[]};
  if (baseline.baselineCommit !== 'f7525176463b4e80045fb6d5d1e84de8de160569') throw new Error('Architecture baseline drift');
  const changed = execFileSync('git', ['diff', '--name-only', baseline.baselineCommit, '--'], {encoding: 'utf8'}).trim().split('\n').filter(Boolean);
  const untracked = execFileSync('git', ['ls-files', '--others', '--exclude-standard'], {encoding: 'utf8'}).trim().split('\n').filter(Boolean);
  for (const p of [...changed, ...untracked]) if (!allowedFiles.has(p) && !p.startsWith(`${auditRoot}/`) && !p.startsWith('content-intelligence/operations/chocolate-crystal-choice-scheduling-v1/')) throw new Error('Artifact V2 scope violation: ' + p);
  const frozenChanged = execFileSync('git', ['diff', '--name-only', baseline.baselineCommit, '--', ...baseline.files.map(f => f.path)], {encoding: 'utf8'}).trim();
  if (frozenChanged) throw new Error('Frozen historical/review/recovery/media drift: ' + frozenChanged);
  // Untracked deletions/changes and byte identities are checked even before staging.
  for (const f of baseline.files) if (mediaHash(f.path) !== f.sha256) throw new Error('Historical exact-byte drift: ' + f.path);
  const amendment = amendmentSchema.parse(read(`${auditRoot}/authority-amendment.json`));
  for (const doc of amendment.documents) architecturePreviousDocumentBytes(doc.path, readFileSync(doc.path));
  return {passed: true, frozenHistoricalFiles: baseline.files.length, changedFiles: changed.length, untrackedFiles: untracked.length};
};
/** Reject every newly tracked/required durable binary outside the frozen legacy list unless catalogued. */
export const validateCanonicalMediaDurability = (root = process.cwd(), trackedPaths?: readonly string[]) => {
  const registry = loadMediaRegistry(root);
  const tracked = new Set(trackedPaths ?? execFileSync('git', ['ls-files', '-z'], {cwd: root, encoding: 'utf8'}).split('\0').filter(Boolean));
  for (const m of registry.list()) {
    if (!tracked.has(m.canonicalPath)) throw new Error('Canonical durable media is not Git tracked: ' + m.canonicalPath);
    if (m.bytes >= 100 * 1024 * 1024) throw new Error('Canonical media exceeds current Git file policy');
    registry.resolveFile(mediaReference(m));
    for (const path of m.provenance.sourceRecords) if (!tracked.has(path)) throw new Error('Media provenance is not durably tracked: ' + path);
    if (m.exception && !tracked.has(m.exception.decision.path)) throw new Error('Exception decision is not durably tracked');
  }
  const legacy = readFileSync(`${root}/${auditRoot}/legacy-binaries.json`, 'utf8');
  const legacyFiles = (JSON.parse(legacy) as {files: {path: string; sha256: string}[]}).files;
  const old = new Map(legacyFiles.map(m => [m.path, m.sha256]));
  const canonical = new Map(registry.list().map(m => [m.canonicalPath, m]));
  for (const path of tracked) {
    if (old.has(path)) {
      if (mediaHash(`${root}/${path}`) !== old.get(path)) throw new Error('Legacy binary changed: ' + path);
      continue;
    }
    const file = `${root}/${path}`;
    const mediaExtension = /\.(mp4|wav|png|jpe?g|webp|mp3|flac|ogg|gif|avif|mov|m4a|webm|aac|opus|mkv|tiff?|heic|bmp)$/i.test(path);
    const bytes = statSync(file).size;
    const largeBinary = bytes >= 1024 * 1024 && (readFileSync(file).includes(0) || !Buffer.from(readFileSync(file).toString('utf8'), 'utf8').equals(readFileSync(file)));
    const alreadyCanonicalHash = registry.byHash(mediaHash(file));
    const m = canonical.get(path);
    if (!m && !mediaExtension && !largeBinary && !alreadyCanonicalHash) continue;
    if (!m) throw new Error('New durable binary must be canonical media or an explicit evidence exception: ' + path);
    registry.resolveFile(mediaReference(m));
  }
  return {passed: true, canonicalPayloads: registry.list().filter(m => !m.exception).length, explicitExceptions: registry.list().filter(m => m.exception).length, frozenLegacyBinaryPaths: legacyFiles.length};
};
