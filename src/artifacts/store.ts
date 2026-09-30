import {createHash, randomUUID} from 'node:crypto';
import {createReadStream} from 'node:fs';
import {access, copyFile, link, lstat, mkdir, stat, unlink} from 'node:fs/promises';
import {dirname, join, resolve} from 'node:path';
import {relativePathSchema, type ArtifactManifest} from './schema';
export type ArtifactVerification = {state:'VERIFIED'|'MISSING'|'CORRUPT'; sha256: string|null; bytes: number|null};
export interface ArtifactStore {
 readonly provider: string;
 available(key: string): Promise<boolean>;
 retrieve(key: string, temporaryDestination: string): Promise<void>;
}
// Reject every symlink component, including roots, before operating on a path.
export const safePath = async (root: string, key: string) => {
 relativePathSchema.parse(key);
 const target = resolve(root,key);
 let component = resolve('/');
 for (const part of target.split('/').filter(Boolean)) {
  component = join(component,part);
  try { if ((await lstat(component)).isSymbolicLink()) throw new Error(`Symlink forbidden: ${component}`); }
  catch (error) { if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error; }
 }
 return target;
};
export const verifyArtifact = async (path: string, identity: ArtifactManifest['identity']): Promise<ArtifactVerification> => {
 try {
  if (!(await lstat(path)).isFile()) throw new Error('Artifact must be a regular file');
  const hash = createHash('sha256');
  for await (const chunk of createReadStream(path)) hash.update(chunk);
  const sha256 = hash.digest('hex'); const bytes = (await stat(path)).size;
  return {state: sha256 === identity.sha256 && (identity.bytes === null || bytes === identity.bytes) ? 'VERIFIED':'CORRUPT',sha256,bytes};
 } catch (error) { if ((error as NodeJS.ErrnoException).code === 'ENOENT') return {state:'MISSING',sha256:null,bytes:null}; throw error; }
};
export class LocalArtifactStore implements ArtifactStore {
 readonly provider = 'local';
 constructor(readonly root: string) {}
 async available(key: string) {
  const path = await safePath(this.root,key);
  try { await access(path); return true; } catch (error) { if ((error as NodeJS.ErrnoException).code === 'ENOENT') return false; throw error; }
 }
 async retrieve(key: string, destination: string) { await copyFile(await safePath(this.root,key),destination,1); }
}
export const restoreArtifact = async (manifest: ArtifactManifest, root: string, stores: ReadonlyMap<string, ArtifactStore>) => {
 const destination = await safePath(root,manifest.localPath);
 const existing = await verifyArtifact(destination,manifest.identity);
 if (existing.state === 'VERIFIED') return {artifactId:manifest.artifactId,state:'ALREADY_VERIFIED'};
 if (existing.state === 'CORRUPT') throw new Error(`Refusing to overwrite conflicting bytes: ${manifest.artifactId}`);
 const location = manifest.locations.find(location => stores.has(location.provider));
 if (!location) throw new Error(`No configured provider: ${manifest.artifactId}`);
 const store = stores.get(location.provider)!;
 if (!await store.available(location.key)) throw new Error(`Archive bytes unavailable: ${manifest.artifactId}`);
 await mkdir(dirname(destination),{recursive:true});
 const temporary = `${destination}.${randomUUID()}.partial`;
 try {
  await store.retrieve(location.key,temporary);
  if ((await verifyArtifact(temporary,manifest.identity)).state !== 'VERIFIED') throw new Error(`Archive corruption: ${manifest.artifactId}`);
  await safePath(root,manifest.localPath);
  // Hard link is atomic and refuses an existing destination; regeneration is never invoked.
  await link(temporary,destination);
  return {artifactId:manifest.artifactId,state:'RESTORED_EXACT_BYTES'};
 } finally { await unlink(temporary).catch(error => {if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error;}); }
};
