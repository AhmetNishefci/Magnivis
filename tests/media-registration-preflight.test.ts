import{mkdtempSync,mkdirSync,writeFileSync,truncateSync,readFileSync,existsSync,rmSync}from'node:fs';
import{tmpdir}from'node:os';
import{join}from'node:path';
import{describe,it,expect}from'vitest';
import{assertGitMediaSize,gitMediaByteLimit,preflightMediaRegistration}from'../src/artifacts/durability';
import{persistMediaArtifact}from'../src/artifacts/catalog';
import type{MediaArtifact}from'../src/artifacts/media';
const fixture=()=>{const root=mkdtempSync(join(tmpdir(),'magnivis-size-'));mkdirSync(join(root,'artifacts'));writeFileSync(join(root,'artifacts/media-catalog.json'),JSON.stringify({schemaVersion:2,artifacts:[]}));return root;};
describe('Pre-registration Git media durability',()=>{
 it('checks actual files at the exclusive100MiB ceiling without trusting declared metadata',()=>{
  const root=fixture();try{writeFileSync(join(root,'oversize.mp4'),'');truncateSync(join(root,'oversize.mp4'),gitMediaByteLimit);
   const before=readFileSync(join(root,'artifacts/media-catalog.json'));
   const artifact:MediaArtifact={id:`media.${'0'.repeat(64)}`,sha256:'0'.repeat(64),canonicalPath:'oversize.mp4',mediaType:'video/mp4',bytes:1,provenance:{kind:'original-production',sourceCommit:'0'.repeat(40),sourceRecords:['source.json'],createdAt:null,creationTimeUnknownReason:'Fixture'},parents:[]};
   expect(()=>persistMediaArtifact(artifact,root)).toThrow(/exceeds current Git file policy/);
   expect(readFileSync(join(root,'artifacts/media-catalog.json'))).toEqual(before);
   expect(existsSync(join(root,'artifacts/.media-catalog-lock'))).toBe(false);
   expect(existsSync(join(root,'artifacts/media-catalog.pending.json'))).toBe(false);
   truncateSync(join(root,'oversize.mp4'),gitMediaByteLimit-1);expect(assertGitMediaSize('oversize.mp4',root)).toBe(gitMediaByteLimit-1);
  }finally{rmSync(root,{recursive:true,force:true});}
 });
 it('preflights the full proposed batch so a late oversized master cannot leave earlier registrations',()=>{
  const root=fixture();try{writeFileSync(join(root,'cue.wav'),'small');writeFileSync(join(root,'master.mp4'),'');truncateSync(join(root,'master.mp4'),gitMediaByteLimit+1);
   expect(()=>preflightMediaRegistration(['cue.wav','master.mp4'],root)).toThrow(/master.mp4/);
   expect(JSON.parse(readFileSync(join(root,'artifacts/media-catalog.json'),'utf8')).artifacts).toEqual([]);
  }finally{rmSync(root,{recursive:true,force:true});}
 });
});
