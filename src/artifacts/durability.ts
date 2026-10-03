import{statSync}from'node:fs';
import{resolve}from'node:path';
/** The Git durability ceiling is exclusive, shared by registration and audit. */
export const gitMediaByteLimit=100*1024*1024;
export const assertGitMediaSize=(path:string,root=process.cwd())=>{
 const bytes=statSync(resolve(root,path)).size;
 if(bytes>=gitMediaByteLimit)throw new Error(`Canonical media exceeds current Git file policy: ${path} (${bytes} bytes; limit ${gitMediaByteLimit})`);
 return bytes;
};
/** Check the complete proposed set before any append-only catalog write. */
export const preflightMediaRegistration=(paths:readonly string[],root=process.cwd())=>paths.map(path=>({path,bytes:assertGitMediaSize(path,root)}));
