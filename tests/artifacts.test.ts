import {createHash} from 'node:crypto';
import {mkdtempSync, realpathSync, rmSync, writeFileSync, mkdirSync, readFileSync, symlinkSync, existsSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {afterEach, describe, expect, it} from 'vitest';
import manifestData from '../artifacts/manifests.json';
import decision from '../artifacts/recovery-decision.json';
import {artifactManifestSchema, parseManifests, provenanceSchema} from '../src/artifacts/schema';
import {validateRecoveryDecision} from '../src/artifacts/recovery';
import {LocalArtifactStore, restoreArtifact, safePath, verifyArtifact} from '../src/artifacts/store';
const manifests=parseManifests(manifestData);
const scratch:string[]=[];
afterEach(()=>scratch.splice(0).forEach(path=>rmSync(path,{recursive:true,force:true})));
const fixture=()=>{
 const root=mkdtempSync(join(realpathSync(tmpdir()),'magnivis-artifact-'));scratch.push(root);
 const source=join(root,'archive');mkdirSync(source);
 writeFileSync(join(source,'bytes'),'fixture bytes');
 const m=structuredClone(manifests.find(m=>m.artifactId==='speed-of-light.recovered-master')!);
 m.identity={sha256:createHash('sha256').update('fixture bytes').digest('hex'),bytes:13,mimeType:'video/mp4'};
 m.localPath='destination/video.mp4';m.locations=[{provider:'local',key:'bytes',durability:'local-only'}];
 return {root,source,m,stores:new Map([['local',new LocalArtifactStore(source)]])};
};
describe('artifact identities and recovery authority',()=>{
 it('validates the committed registry and all provenance categories',()=>{
  expect(manifests.some(m=>m.artifactId==='wood-frog.historical-master')).toBe(true);
  expect(provenanceSchema.options).toHaveLength(6);
 });
 it('binds separate historical and recovered Wood Frog identities',()=>{
  const result=validateRecoveryDecision(decision,manifests);
  expect(result.historical.identity.sha256).not.toBe(result.replacement.identity.sha256);
  expect(result.historical.identity.bytes).toBeNull();
  expect(result.replacement.approvalScope).toBe('operational-replacement');
  expect(decision.publicationAuthorized).toBe(false);
 });
 it('rejects a replacement decision claiming different bytes',()=>expect(()=>validateRecoveryDecision({...decision,replacementSha256:'a'.repeat(64)},manifests)).toThrow());
 it('rejects inherited historical approval on equivalent bytes',()=>{
  const m=structuredClone(manifests.find(m=>m.artifactId==='wood-frog.recovered-master')!);m.approvalScope='historical-visual';
  expect(()=>artifactManifestSchema.parse(m)).toThrow();
 });
 it('requires historical equality for exact reproduction',()=>{
  const m=structuredClone(manifests.find(m=>m.artifactId==='speed-of-light.recovered-master')!);
  expect(m.identity.sha256).toBe(m.historicalSha256);m.historicalSha256='a'.repeat(64);
  expect(()=>artifactManifestSchema.parse(m)).toThrow();
 });
 it('preserves draft delivery provenance and false publication gates',()=>{
  const records=JSON.parse(readFileSync('artifacts/deliveries.json','utf8')) as {provenance:string;publicationAuthorized:boolean;state:string}[];
  expect(records).toHaveLength(8);
  expect(records.every(r=>r.provenance==='DERIVED_RECOVERY_ARTIFACT' && !r.publicationAuthorized && r.state==='draft-review')).toBe(true);
 });
 it('rejects duplicate registry identities',()=>expect(()=>parseManifests([...manifestData,manifestData[0]])).toThrow());
 it('rejects unknown fields rather than preserving credentials',()=>expect(()=>artifactManifestSchema.parse({...manifests[0],secret:'bad'})).toThrow());
});
describe('exact local provider restore',()=>{
 it('restores exact bytes and verifies their identity',async()=>{
  const {root,m,stores}=fixture();expect((await restoreArtifact(m,root,stores)).state).toBe('RESTORED_EXACT_BYTES');
  expect((await verifyArtifact(join(root,m.localPath),m.identity)).state).toBe('VERIFIED');
 });
 it('is idempotent for already verified bytes',async()=>{
  const {root,m,stores}=fixture();await restoreArtifact(m,root,stores);
  expect((await restoreArtifact(m,root,stores)).state).toBe('ALREADY_VERIFIED');
 });
 it('rejects corrupted archive bytes without installing them',async()=>{
  const {root,source,m,stores}=fixture();writeFileSync(join(source,'bytes'),'corrupt');
  await expect(restoreArtifact(m,root,stores)).rejects.toThrow('corruption');
  expect(existsSync(join(root,m.localPath))).toBe(false);
 });
 it('rejects existing conflicting destination bytes',async()=>{
  const {root,m,stores}=fixture();mkdirSync(join(root,'destination'));writeFileSync(join(root,m.localPath),'preserve');
  await expect(restoreArtifact(m,root,stores)).rejects.toThrow('overwrite');expect(readFileSync(join(root,m.localPath),'utf8')).toBe('preserve');
 });
 it('reports unavailable provider without regenerating',async()=>{
  const {root,m}=fixture();await expect(restoreArtifact(m,root,new Map())).rejects.toThrow('No configured provider');expect(existsSync(join(root,m.localPath))).toBe(false);
 });
 it('reports missing archive without regenerating',async()=>{
  const {root,m,stores}=fixture();m.locations[0]!.key='absent';await expect(restoreArtifact(m,root,stores)).rejects.toThrow('unavailable');
 });
 it('distinguishes missing local bytes from corrupt bytes',async()=>{
  const {root,m}=fixture();expect((await verifyArtifact(join(root,'absent'),m.identity)).state).toBe('MISSING');
  writeFileSync(join(root,'bad'),'bad');expect((await verifyArtifact(join(root,'bad'),m.identity)).state).toBe('CORRUPT');
 });
 it('rejects unsafe provider and destination paths',async()=>{
  const {root}=fixture();await expect(safePath(root,'../escape')).rejects.toThrow();await expect(safePath(root,'/absolute')).rejects.toThrow();
 });
 it('rejects symlinks rather than following them',async()=>{
  const {root,source}=fixture();symlinkSync(source,join(root,'linked'));await expect(safePath(root,'linked/bytes')).rejects.toThrow('Symlink');
 });
 it('reports provider availability independently of local files',async()=>{
  const {stores}=fixture();expect(await stores.get('local')!.available('bytes')).toBe(true);expect(await stores.get('local')!.available('absent')).toBe(false);
 });
});
