import {createHash} from 'node:crypto';
import {readFileSync, realpathSync, statSync} from 'node:fs';
import {isAbsolute, relative, resolve, sep} from 'node:path';
import {z} from 'zod';

export const mediaDigestSchema = z.string().regex(/^[a-f0-9]{64}$/);
export const mediaReferenceSchema = z.object({
  id: z.string().regex(/^media\.[a-f0-9]{64}(?:\.[a-z0-9-]+)?$/),
  sha256: mediaDigestSchema,
}).strict().superRefine((ref, ctx) => {
  if (ref.id.split('.')[1] !== ref.sha256) ctx.addIssue({code: 'custom', message: 'Media ID must bind its exact SHA-256'});
});
const repositoryPath = z.string().min(1).refine(p => !isAbsolute(p) && !p.includes('\\') && p.split('/').every(s => s && s !== '.' && s !== '..'), 'Safe repository-relative path required');
export const mediaArtifactSchema = z.object({
  id: mediaReferenceSchema.shape.id,
  sha256: mediaDigestSchema,
  canonicalPath: repositoryPath,
  mediaType: z.string().regex(/^(?:(?:video|audio|image|font)\/[^\s]+|application\/octet-stream)$/),
  bytes: z.number().int().positive(),
  provenance: z.object({
    kind: z.enum(['legacy-preserved', 'original-production', 'platform-adaptation', 'evidence-snapshot']),
    sourceCommit: z.string().regex(/^[a-f0-9]{40}$/),
    sourceRecords: z.array(repositoryPath).min(1),
    createdAt: z.iso.datetime({offset: true}).nullable(),
    creationTimeUnknownReason: z.string().min(1).nullable(),
  }).strict(),
  parents: z.array(mediaReferenceSchema),
  exception: z.object({
    kind: z.enum(['immutable-evidence-snapshot', 'compatibility']),
    duplicateOf: mediaReferenceSchema,
    reason: z.string().min(1),
    decision: z.object({path: repositoryPath, sha256: mediaDigestSchema}).strict(),
  }).strict().optional(),
}).strict().superRefine((m, ctx) => {
  if (!mediaReferenceSchema.safeParse({id: m.id, sha256: m.sha256}).success) ctx.addIssue({code: 'custom', message: 'Media identity/hash mismatch'});
  if (m.id !== `media.${m.sha256}` && !m.exception) ctx.addIssue({code: 'custom', message: 'Separate same-content identity requires explicit snapshot/compatibility exception'});
  if (m.exception && m.id === `media.${m.sha256}`) ctx.addIssue({code: 'custom', message: 'Exception needs a separate immutable identity'});
  if (m.provenance.kind === 'platform-adaptation' && !m.parents.length) ctx.addIssue({code: 'custom', message: 'Platform adaptation requires exact generation parents'});
  if (m.provenance.createdAt === null && !m.provenance.creationTimeUnknownReason) ctx.addIssue({code: 'custom', message: 'Unknown creation time must be explained'});
});
export type MediaReference = z.infer<typeof mediaReferenceSchema>;
export type MediaArtifact = z.infer<typeof mediaArtifactSchema>;
export const mediaReference = (artifact: MediaArtifact): MediaReference => ({id: artifact.id, sha256: artifact.sha256});
export const mediaHash = (path: string) => createHash('sha256').update(readFileSync(path)).digest('hex');

/** Catalog validation is content-aware; different payloads never require an exception. */
export const createMediaRegistry = (input: unknown, root = process.cwd()) => {
  const artifacts = z.array(mediaArtifactSchema).parse(input);
  const ids = new Set<string>();
  const paths = new Set<string>();
  const canonical = new Map<string, MediaArtifact>();
  for (const m of artifacts) {
    if (ids.has(m.id) || paths.has(m.canonicalPath)) throw new Error('Duplicate media ID/canonical path');
    ids.add(m.id); paths.add(m.canonicalPath);
    if (!m.exception) {
      if (canonical.has(m.sha256)) throw new Error('Unnecessary duplicate durable payload; reference canonical media');
      canonical.set(m.sha256, m);
    }
  }
  const get = (ref: MediaReference) => {
    mediaReferenceSchema.parse(ref);
    const artifact = artifacts.find(m => m.id === ref.id);
    if (!artifact || artifact.sha256 !== ref.sha256) throw new Error('Missing/stale exact media reference');
    return structuredClone(artifact);
  };
  for (const m of artifacts) {
    for (const parent of m.parents) {
      if (parent.id === m.id) throw new Error('Media cannot be its own parent');
      get(parent);
    }
    if (m.exception) {
      const original = get(m.exception.duplicateOf);
      if (original.exception || original.sha256 !== m.sha256 || original.bytes !== m.bytes || original.mediaType !== m.mediaType) throw new Error('Invalid duplicate snapshot exception');
    }
  }
  const visiting = new Set<string>(); const visited = new Set<string>();
  const visit = (m: MediaArtifact) => {
    if (visiting.has(m.id)) throw new Error('Cyclic media generation relationship');
    if (visited.has(m.id)) return;
    visiting.add(m.id); m.parents.forEach(p => visit(get(p))); visiting.delete(m.id); visited.add(m.id);
  };
  artifacts.forEach(visit);
  const safeFile = (path: string) => {
    const file = realpathSync(resolve(root, path));
    const rel = relative(realpathSync(root), file);
    if (rel.startsWith(`..${sep}`) || rel === '..' || isAbsolute(rel) || !statSync(file).isFile()) throw new Error('Media path escapes repository or is not a file');
    return file;
  };
  const resolveFile = (ref: MediaReference) => {
    const artifact = get(ref);
    const file = safeFile(artifact.canonicalPath);
    if (statSync(file).size !== artifact.bytes || mediaHash(file) !== artifact.sha256) throw new Error('Canonical media byte integrity failed');
    for (const p of artifact.provenance.sourceRecords) safeFile(p);
    if (artifact.exception && mediaHash(safeFile(artifact.exception.decision.path)) !== artifact.exception.decision.sha256) throw new Error('Media exception decision drift');
    return file;
  };
  return {list: () => structuredClone(artifacts), get, resolveFile, byHash: (sha256: string) => { const m = canonical.get(sha256); return m ? structuredClone(m) : undefined; }};
};
export type MediaRegistry = ReturnType<typeof createMediaRegistry>;
export const loadMediaRegistry = (root = process.cwd()) => {
  const catalog = z.object({schemaVersion: z.literal(2), artifacts: z.array(mediaArtifactSchema)}).strict().parse(JSON.parse(readFileSync(resolve(root, 'artifacts/media-catalog.json'), 'utf8')));
  return createMediaRegistry(catalog.artifacts, root);
};
/** Register existing generated bytes by reference; never copies, renders or changes lifecycle state. */
export const registerMediaArtifact = (registry: MediaRegistry, artifact: MediaArtifact, root = process.cwd()) => {
  const candidate = mediaArtifactSchema.parse(artifact);
  const existing = registry.byHash(candidate.sha256);
  if (existing && !candidate.exception) throw new Error(`Unnecessary duplicate media: use ${existing.id} at ${existing.canonicalPath}`);
  const next = createMediaRegistry([...registry.list(), candidate], root);
  next.resolveFile(mediaReference(candidate));
  return next;
};
