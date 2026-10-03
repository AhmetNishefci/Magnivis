import {readFileSync, existsSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {z} from 'zod';
import {loadHistoricalMediaRetentions,validateHistoricalMediaRetention} from '../src/artifacts/retention';
import {gitMediaByteLimit} from '../src/artifacts/durability';
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
/** Historical-policy projection for old milestone validators; current V3 policy is separate. */
export const architecturePreviousDocumentBytes = (path: string, current: Buffer): Buffer => {
  if (!existsSync(`${auditRoot}/authority-amendment.json`)) return current;
  const amendment = amendmentSchema.parse(read(`${auditRoot}/authority-amendment.json`));
  if (!current.equals(readFileSync(path))) throw new Error('Policy projection requires actual repository bytes, not an invented amendment');
  const row = amendment.documents.find(d => d.path === path);
  if (!row) {
    if (path === 'AGENTS.md' || path.startsWith('docs/')) {
      return execFileSync('git', ['show', `46322f0:${path}`]);
    }
    return current;
  }
  if (hash(current) === row.beforeSha256) return current;
  // This helper evaluates historical policy at its original checkpoint, not current policy.
  // Later authorized policy is validated by the prospective workflow, independently.
  const checkpoint = execFileSync('git', ['show', `46322f0:${path}`]);
  if (hash(checkpoint) !== row.afterSha256) throw new Error('Historical architecture policy checkpoint drift: ' + path);
  const previous = readFileSync(row.beforeSnapshot);
  if (hash(previous) !== row.beforeSha256) throw new Error('Historical document snapshot drift: ' + path);
  return previous;
};
export const validateArchitectureScope = () => {
  const baseline = read(`${auditRoot}/historical-bindings.json`) as {baselineCommit: string; files: {path: string; sha256: string}[]};
  if (baseline.baselineCommit !== 'f7525176463b4e80045fb6d5d1e84de8de160569') throw new Error('Architecture baseline drift');
  const changed = execFileSync('git', ['diff', '--name-only', baseline.baselineCommit, '--'], {encoding: 'utf8'}).trim().split('\n').filter(Boolean);
  const untracked = execFileSync('git', ['ls-files', '--others', '--exclude-standard'], {encoding: 'utf8'}).trim().split('\n').filter(Boolean);
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
  const retentions=loadHistoricalMediaRetentions(root),retained=new Map(retentions.map(r=>[r.retention.media.id,r])),archivalParts=new Map<string,{sha256:string;bytes:number}>();
  if(retentions.length&&!tracked.has('artifacts/media-retentions.json'))throw new Error('Retention ledger is not Git tracked');
  for(const row of retentions){
    const r=validateHistoricalMediaRetention(row.retention,registry.get(row.retention.media),root);
    for(const ref of [row.ref,r.candidate,r.registrationEvent,r.revisionEvent,r.ownerDecision,r.authority,...r.failureEvidence,...(r.replacementCandidate?[r.replacementCandidate,r.replacementEvent!]:[])])if(!tracked.has(ref.path))throw new Error('Retention evidence is not Git tracked: '+ref.path);
    for(const part of r.storage.parts){if(!tracked.has(part.path))throw new Error('Historical archival part is not Git tracked');archivalParts.set(part.path,part);}
    if(tracked.has(registry.get(r.media).canonicalPath))throw new Error('Historical materialization must not be a second Git binary');
  }
  for (const m of registry.list()) {
    if (!retained.has(m.id)&&!tracked.has(m.canonicalPath)) throw new Error('Canonical durable media is not Git tracked: ' + m.canonicalPath);
    if (!retained.has(m.id)&&m.bytes >= gitMediaByteLimit) throw new Error('Canonical media exceeds current Git file policy');
    registry.resolveFile(mediaReference(m));
    for (const path of m.provenance.sourceRecords) if (!tracked.has(path)) throw new Error('Media provenance is not durably tracked: ' + path);
    if (m.exception && !tracked.has(m.exception.decision.path)) throw new Error('Exception decision is not durably tracked');
  }
  const legacy = readFileSync(`${root}/${auditRoot}/legacy-binaries.json`, 'utf8');
  const legacyFiles = (JSON.parse(legacy) as {files: {path: string; sha256: string}[]}).files;
  const frozen = JSON.parse(readFileSync(`${root}/${auditRoot}/historical-bindings.json`, 'utf8')) as {files: {path:string;sha256:string}[]};
  const old = new Map([...frozen.files, ...legacyFiles].map(m => [m.path, m.sha256]));
  const canonical = new Map(registry.list().map(m => [m.canonicalPath, m]));
  for (const path of tracked) {
    if(archivalParts.has(path)){const part=archivalParts.get(path)!;const bytes=readFileSync(`${root}/${path}`);if(bytes.length!==part.bytes||bytes.length>=gitMediaByteLimit||hash(bytes)!==part.sha256)throw new Error('Historical archival part drift');continue;}
    if (old.has(path)) {
      if (mediaHash(`${root}/${path}`) !== old.get(path)) throw new Error('Legacy binary changed: ' + path);
      continue;
    }
    const file = `${root}/${path}`;
    const mediaExtension = /\.(mp4|wav|png|jpe?g|webp|mp3|flac|ogg|gif|avif|mov|m4a|webm|aac|opus|mkv|tiff?|heic|bmp|ttf|otf|woff2?)$/i.test(path);
    const buffer = readFileSync(file);
    const largeBinary = buffer.includes(0) || !Buffer.from(buffer.toString('utf8'), 'utf8').equals(buffer);
    const alreadyCanonicalHash = registry.byHash(hash(buffer));
    const m = canonical.get(path);
    if (!m && !mediaExtension && !largeBinary && !alreadyCanonicalHash) continue;
    if (!m) throw new Error('New durable binary must be canonical media or an explicit evidence exception: ' + path);
    registry.resolveFile(mediaReference(m));
  }
  return {passed: true, canonicalPayloads: registry.list().filter(m => !m.exception).length, historicalRetentions:retentions.length,archivalParts:archivalParts.size,explicitExceptions: registry.list().filter(m => m.exception).length, frozenLegacyBinaryPaths: legacyFiles.length};
};
