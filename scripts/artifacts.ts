import {loadMediaRegistry, mediaReference} from '../src/artifacts/media';
import {validateRecoveryDecision} from '../src/artifacts/recovery';
import {readFileSync} from 'node:fs';
import {parseManifests} from '../src/artifacts/schema';
import {loadArtifactRegistry} from '../src/artifacts/registry';
import {artifactDisposition, LocalArtifactStore, restoreArtifact, safePath, verifyArtifact, type ArtifactStore} from '../src/artifacts/store';
const command = process.argv[2];
if (!['status','verify','restore'].includes(command ?? '')) throw new Error('Use status, verify or restore; no implicit regeneration');
const filter = process.argv[3];
const legacyRegistry = parseManifests(JSON.parse(readFileSync('artifacts/manifests.json','utf8')));
validateRecoveryDecision(JSON.parse(readFileSync('artifacts/recovery-decision.json','utf8')),legacyRegistry);
const registry = loadArtifactRegistry();
const manifests = registry.filter(m => !filter || m.artifactId === filter);
if (!manifests.length) throw new Error('Unknown artifact selection');
const stores = new Map<string, ArtifactStore>([['git',new LocalArtifactStore(process.cwd(),'git')]]);
if (process.env.MAGNIVIS_ARTIFACT_LOCAL_ROOT) stores.set('local',new LocalArtifactStore(process.env.MAGNIVIS_ARTIFACT_LOCAL_ROOT));
let failures = 0;
for (const m of manifests) {
 try {
  const verification = await verifyArtifact(await safePath(process.cwd(),m.localPath),m.identity);
  const providers = await Promise.all(m.locations.map(async l => ({...l, availability: stores.has(l.provider) ? await stores.get(l.provider)!.available(l.key) ? 'AVAILABLE':'MISSING':'NOT_CONFIGURED'})));
  let disposition = artifactDisposition(m,verification);
  const result = command === 'restore' && m.retention === 'DURABLE_REQUIRED' ? await restoreArtifact(m,process.cwd(),stores) : null;
  for (const location of m.locations.filter(l=>l.provider==='git')) {
   const archived=await verifyArtifact(await safePath(process.cwd(),location.key),m.identity);
   if(archived.state!=='VERIFIED') throw new Error(`Git durable bytes failed: ${m.artifactId}`);
  }
  disposition = artifactDisposition(m,verification,m.locations.some(l=>l.provider==='git'));
  console.log(JSON.stringify({artifactId:m.artifactId,provenance:m.provenance,historicalStatus:m.historicalStatus,approvalDecisionId:m.approvalDecisionId,publication:m.publication,retention:m.retention,disposition,verification,providers,result}));
  if (command === 'verify' && ['CORRUPT','REQUIRED_MISSING'].includes(disposition)) failures++;
 } catch (error) { failures++; console.error(JSON.stringify({artifactId:m.artifactId,error:String(error)})); }
}
if (failures) process.exitCode = 1;

// V2 canonical paths are already Git-backed; verification never duplicates or regenerates them.
const canonicalMedia = loadMediaRegistry();
if (!filter) for (const artifact of canonicalMedia.list()) {
 try { canonicalMedia.resolveFile(mediaReference(artifact)); } catch (error) { failures++; console.error(String(error)); }
}
if (failures) process.exitCode = 1;
