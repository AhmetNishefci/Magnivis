import {readFileSync,writeFileSync,renameSync,mkdirSync,rmSync} from 'node:fs';
import {resolve} from 'node:path';
import {assertGitMediaSize} from './durability';
import {sha256Json} from '../content-intelligence/run-schema';
import {loadMediaRegistry,registerMediaArtifact,type MediaArtifact,type MediaRegistry} from './media';

/** Append-only catalog view. Every operation sees committed catalog evolution;
 * existing identities cannot be removed or rewritten while a lifecycle runs. */
export const openMediaCatalog=(root=process.cwd()):MediaRegistry=>{
  let previous=loadMediaRegistry(root);
  let bytes=readFileSync(resolve(root,'artifacts/media-catalog.json'),'utf8');
  const current=()=>{
    const nextBytes=readFileSync(resolve(root,'artifacts/media-catalog.json'),'utf8');
    if(nextBytes!==bytes){
      const next=loadMediaRegistry(root);const identities=new Map(next.list().map(m=>[m.id,sha256Json(m)]));
      for(const m of previous.list())if(identities.get(m.id)!==sha256Json(m))throw new Error('Authoritative media catalog removed or rewrote immutable identity');
      previous=next;bytes=nextBytes;
    }
    return previous;
  };
  return {list:()=>current().list(),get:ref=>current().get(ref),resolveFile:ref=>current().resolveFile(ref),byHash:hash=>current().byHash(hash)};
};

/** Catalog is the persistent authority, not a mutable session registry. */
export const persistMediaArtifact=(artifact:MediaArtifact,root=process.cwd())=>{
  // Validate actual bytes before creating a lock or mutating the append-only catalog.
  assertGitMediaSize(artifact.canonicalPath,root);
  const directory=resolve(root,'artifacts');const lock=resolve(directory,'.media-catalog-lock');mkdirSync(lock);
  try{
    const current=loadMediaRegistry(root);const same=current.byHash(artifact.sha256);
    if(same&&!artifact.exception){current.resolveFile({id:same.id,sha256:same.sha256});if(same.canonicalPath!==artifact.canonicalPath)throw new Error('Duplicate payload: reference existing canonical file');if(sha256Json(same)!==sha256Json(artifact))throw new Error('Cannot rewrite immutable media metadata');return {id:same.id,sha256:same.sha256};}
    const next=registerMediaArtifact(current,artifact,root);
    const pending=resolve(directory,'media-catalog.pending.json');
    writeFileSync(pending,JSON.stringify({schemaVersion:2,artifacts:next.list()},null,2)+'\n',{flag:'wx'});
    renameSync(pending,resolve(directory,'media-catalog.json'));return {id:artifact.id,sha256:artifact.sha256};
  }finally{rmSync(lock,{recursive:true});}
};
