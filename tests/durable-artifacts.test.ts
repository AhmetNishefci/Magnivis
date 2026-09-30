import {readFileSync,existsSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {describe,it,expect} from 'vitest';
import data from '../artifacts/manifests.json';
import profiles from '../artifacts/presentation-profiles.json';
import {artifactManifestSchema,parseManifests} from '../src/artifacts/schema';
import {artifactDisposition} from '../src/artifacts/store';
import {resolveVideoTarget} from '../scripts/video-targets';
const manifests=parseManifests(data);
const missing={state:'MISSING' as const,sha256:null,bytes:null};
describe('Git-backed retention and historical integrity',()=>{
 it('binds every required artifact to an existing hash-verified Git archive path',()=>{
  for(const m of manifests.filter(m=>m.retention==='DURABLE_REQUIRED')){
   const location=m.locations.find(l=>l.provider==='git')!;
   expect(location.durability).toBe('git-tracked');
   const bytes=readFileSync(location.key);
   expect(bytes.length).toBe(m.identity.bytes);
   expect(createHash('sha256').update(bytes).digest('hex')).toBe(m.identity.sha256);
  }
 });
 it('reports absent original Wood Frog as historical expectation rather than corruption',()=>{
  const m=manifests.find(m=>m.artifactId==='wood-frog.historical-master')!;
  expect(m.locations).toEqual([]);expect(artifactDisposition(m,missing)).toBe('HISTORICAL_MISSING_EXPECTATION');
  expect(existsSync(m.localPath)).toBe(false);
 });
 it('cannot assign an archive location to the missing historical expectation',()=>{
  const m=structuredClone(manifests.find(m=>m.artifactId==='wood-frog.historical-master')!);
  m.locations=[{provider:'git',key:'artifacts/fake.mp4',durability:'git-tracked'}];expect(()=>artifactManifestSchema.parse(m)).toThrow();
 });
 it('does not require ignored routine frames for a clean clone',()=>{
  const m=manifests.find(m=>m.retention==='REGENERABLE')!;
  expect(m.reproducibility.recipe).not.toBeNull();expect(artifactDisposition(m,missing)).toBe('OPTIONAL_MISSING');
 });
 it('accepts a verified archive while still reporting restore needed for missing workspace bytes',()=>{
  const m=manifests.find(m=>m.artifactId==='wood-frog.recovered-master')!;
  expect(artifactDisposition(m,missing,true)).toBe('RESTORE_AVAILABLE');
  expect(artifactDisposition(m,missing,false)).toBe('REQUIRED_MISSING');
 });
 it('never hides corruption behind an optional or historical retention class',()=>{
  for(const m of manifests)expect(artifactDisposition(m,{state:'CORRUPT',sha256:'a'.repeat(64),bytes:1},true)).toBe('CORRUPT');
 });
 it('preserves six historical content identities and exact narration source bindings',()=>{
  for(const id of ['earth-to-stars','ocean-depth','billion-dollars','speed-of-light','human-engineering','wood-frog']){
   const target=resolveVideoTarget(id);expect(target.spec.id).toBe(id);
   expect(manifests.some(m=>m.contentId===id&&m.artifactId===id+'.recovered-master')).toBe(true);
   for(const cue of target.spec.audio.narrationCues)expect(manifests.some(m=>m.localPath===`public/${cue.file}`&&m.provenance==='HISTORICAL_EXACT')).toBe(true);
  }
 });
 it('retains independent Meta surfaces with no fabricated grid/feed coordinates',()=>{
  expect(profiles.find(p=>p.surface==='instagram-profile-grid')?.insets).toBeNull();
  expect(profiles.find(p=>p.surface==='facebook-page-feed')?.insets).toBeNull();
 });
});
