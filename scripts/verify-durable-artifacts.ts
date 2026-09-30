import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {parseManifests} from '../src/artifacts/schema';
import {safePath, verifyArtifact} from '../src/artifacts/store';
const manifests=parseManifests(JSON.parse(readFileSync('artifacts/manifests.json','utf8')));
const tracked=new Set(execFileSync('git',['ls-files','-z'],{encoding:'utf8'}).split('\0'));
const receipts=[];
for(const m of manifests.filter(m=>m.retention==='DURABLE_REQUIRED')){
 const location=m.locations.find(l=>l.provider==='git');
 if(!location || !tracked.has(location.key))throw new Error(`Required archive is not Git tracked: ${m.artifactId}`);
 const verification=await verifyArtifact(await safePath(process.cwd(),location.key),m.identity);
 if(verification.state!=='VERIFIED')throw new Error(`Durable identity failed: ${m.artifactId}`);
 if((verification.bytes??0)>=100*1024*1024)throw new Error(`GitHub file size exceeds policy: ${location.key}`);
 receipts.push({artifactId:m.artifactId,path:location.key,sha256:verification.sha256,bytes:verification.bytes,provenance:m.provenance});
}
console.log(JSON.stringify({passed:true,durableArtifactCount:receipts.length,historicalMissingExpectations:manifests.filter(m=>m.retention==='HISTORICAL_EXPECTATION_ONLY').map(m=>({artifactId:m.artifactId,sha256:m.identity.sha256})),receipts},null,2));
