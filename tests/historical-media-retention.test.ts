import {realpathSync,mkdtempSync,mkdirSync,writeFileSync,readFileSync,rmSync,truncateSync,existsSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {describe,it,expect} from 'vitest';
import {mediaHash,mediaReference,loadMediaRegistry,registerMediaArtifact,type MediaArtifact} from '../src/artifacts/media';
import {sha256Json} from '../src/content-intelligence/run-schema';
import {loadHistoricalMediaRetentions,validateHistoricalMediaRetention,assertMediaProductionEligible} from '../src/artifacts/retention';
import {validateCanonicalMediaDurability} from '../scripts/artifact-v2-integrity';
import {gitMediaByteLimit} from '../src/artifacts/durability';
const fixture=()=>{
 const root=mkdtempSync(join(tmpdir(),'magnivis-retention-'));const tracked:string[]=[];
 const put=(path:string,data:unknown,binary=false)=>{mkdirSync(join(root,path,'..'),{recursive:true});writeFileSync(join(root,path),binary?data as Buffer:JSON.stringify(data));tracked.push(path);return {path,sha256:mediaHash(join(root,path))};};
 const payload=Buffer.from('Exact failed historic bytes'),p='artifacts/masters/old.mp4';put(p,payload,true);tracked.pop();
 put('recipe.json',{});const sha256=mediaHash(join(root,p));
 const artifact:MediaArtifact={id:`media.${sha256}`,sha256,canonicalPath:p,mediaType:'video/mp4',bytes:payload.length,provenance:{kind:'original-production',sourceCommit:'0'.repeat(40),sourceRecords:['recipe.json'],createdAt:null,creationTimeUnknownReason:'Test'},parents:[]};
 put('artifacts/media-catalog.json',{schemaVersion:2,artifacts:[artifact]});
 const media=mediaReference(artifact),candidate=put('old-candidate.json',{cycleId:'cycle.test',media});
 const owner=put('owner.json',{schemaVersion:3,id:'owner-decision.test',revision:1,gate:'master-review',cycleId:'cycle.test',targetSha256:sha256Json({cycleId:'cycle.test',media}),decision:'revise',enteredAt:'2026-10-04T00:00:00Z',suppliedReviewTime:null,reviewer:'Owner',evidenceBasis:'explicit-owner-message',instruction:'Revise failed candidate',acceptedUnknowns:[]});
 const registration=put('workflow/cycles/cycle.test/event-1.json',{event:{type:'complete-internal',stage:'production',record:candidate}}),revision=put('workflow/cycles/cycle.test/event-2.json',{event:{type:'owner-decision',record:owner}});
 put('workflow/cycles/cycle.test/state.json',{revision:2,candidate:null});
 const authority=put('authority.json',{kind:'explicit-owner-retention-contract-repair',evidenceBasis:'explicit-owner-message',instruction:'Retain failed evidence only',media:[media]});
 const failure=put('failure.json',{exactMasterSha256:sha256,fileBytes:payload.length,durabilityCheck:'failed'});
 const part=put('artifacts/historical-media/test/part-001.bin',payload,true);
 const retention=put('retention.json',{schemaVersion:1,disposition:'failed',media,cycleId:'cycle.test',candidate,registrationEvent:registration,revisionEvent:revision,ownerDecision:owner,authority,failureEvidence:[failure],replacementCandidate:null,replacementEvent:null,storage:{kind:'exact-byte-parts',parts:[{...part,bytes:payload.length,offset:0}]}});
 put('artifacts/media-retentions.json',{schemaVersion:1,records:[retention]});
 put('system-audits/artifact-architecture-v2/legacy-binaries.json',{files:[]});put('system-audits/artifact-architecture-v2/historical-bindings.json',{files:[]});
 return {root,tracked,artifact,payload,put};
};
describe('Historical failed media retention',()=>{
 it('retains original identity, verifies durable parts and restores exactly without promoting eligibility',()=>{
  const f=fixture();try{
   const registry=loadMediaRegistry(f.root);expect(validateCanonicalMediaDurability(f.root,f.tracked).historicalRetentions).toBe(1);
   rmSync(join(f.root,f.artifact.canonicalPath));expect(existsSync(join(f.root,f.artifact.canonicalPath))).toBe(false);
   expect(registry.resolveFile(mediaReference(f.artifact))).toBe(realpathSync(join(f.root,f.artifact.canonicalPath)));expect(readFileSync(join(f.root,f.artifact.canonicalPath))).toEqual(f.payload);
   expect(()=>assertMediaProductionEligible(mediaReference(f.artifact),f.root)).toThrow(/ineligible/);
   writeFileSync(join(f.root,f.artifact.canonicalPath),'corrupt');expect(()=>registry.resolveFile(mediaReference(f.artifact))).toThrow(/integrity/);
  }finally{rmSync(f.root,{recursive:true,force:true});}
 });
 it('cannot exempt an active candidate, detach revision authority or lose/corrupt its archive',()=>{
  const f=fixture();try{
   const r=loadHistoricalMediaRetentions(f.root)[0]!.retention;
   f.put('workflow/cycles/cycle.test/state.json',{revision:2,candidate:r.candidate});expect(()=>validateHistoricalMediaRetention(r,f.artifact,f.root)).toThrow(/active candidate/);
   f.put('workflow/cycles/cycle.test/state.json',{revision:2,candidate:null});
   expect(()=>validateHistoricalMediaRetention({...r,revisionEvent:r.registrationEvent},f.artifact,f.root)).toThrow(/owner revision/);
   writeFileSync(join(f.root,r.storage.parts[0]!.path),'corrupt');expect(()=>validateHistoricalMediaRetention(r,f.artifact,f.root)).toThrow(/part integrity/);
   rmSync(join(f.root,r.storage.parts[0]!.path));expect(()=>validateHistoricalMediaRetention(r,f.artifact,f.root)).toThrow();
  }finally{rmSync(f.root,{recursive:true,force:true});}
 });
 it('still rejects active oversized binaries and all new oversized registrations, even with a retention ledger',()=>{
  const f=fixture();try{
   const path='large.mp4';writeFileSync(join(f.root,path),'');truncateSync(join(f.root,path),gitMediaByteLimit);
   const large={...f.artifact,id:`media.${'1'.repeat(64)}`,sha256:'1'.repeat(64),canonicalPath:path,bytes:gitMediaByteLimit};
   const registry=loadMediaRegistry(f.root);expect(()=>registerMediaArtifact(registry,large,f.root)).toThrow(/exceeds/);
   f.put('artifacts/media-catalog.json',{schemaVersion:2,artifacts:[f.artifact,large]});expect(()=>validateCanonicalMediaDurability(f.root,[...f.tracked,path])).toThrow(/exceeds/);
  }finally{rmSync(f.root,{recursive:true,force:true});}
 });
 it('requires archive and authority evidence to be durably tracked',()=>{
  const f=fixture();try{const r=loadHistoricalMediaRetentions(f.root)[0]!.retention;expect(()=>validateCanonicalMediaDurability(f.root,f.tracked.filter(p=>p!==r.storage.parts[0]!.path))).toThrow(/not Git tracked/);expect(()=>validateCanonicalMediaDurability(f.root,f.tracked.filter(p=>p!==r.authority.path))).toThrow(/not Git tracked/);}finally{rmSync(f.root,{recursive:true,force:true});}
 });
});
