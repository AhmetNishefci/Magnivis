import {validateRecoveryDecision} from '../src/artifacts/recovery';
import {readFileSync} from 'node:fs';
import {parseManifests} from '../src/artifacts/schema';
import {LocalArtifactStore, restoreArtifact, safePath, verifyArtifact, type ArtifactStore} from '../src/artifacts/store';
const command = process.argv[2];
if (!['status','verify','restore'].includes(command ?? '')) throw new Error('Use status, verify or restore; no implicit regeneration');
const filter = process.argv[3];
const registry = parseManifests(JSON.parse(readFileSync('artifacts/manifests.json','utf8')));
validateRecoveryDecision(JSON.parse(readFileSync('artifacts/recovery-decision.json','utf8')),registry);
const manifests = registry.filter(m => !filter || m.artifactId === filter);
if (!manifests.length) throw new Error('Unknown artifact selection');
const stores = new Map<string, ArtifactStore>();
if (process.env.MAGNIVIS_ARTIFACT_LOCAL_ROOT) stores.set('local',new LocalArtifactStore(process.env.MAGNIVIS_ARTIFACT_LOCAL_ROOT));
let failures = 0;
for (const m of manifests) {
 try {
  const verification = await verifyArtifact(await safePath(process.cwd(),m.localPath),m.identity);
  const providers = await Promise.all(m.locations.map(async l => ({...l, availability: stores.has(l.provider) ? await stores.get(l.provider)!.available(l.key) ? 'AVAILABLE':'MISSING':'NOT_CONFIGURED'})));
  const result = command === 'restore' ? await restoreArtifact(m,process.cwd(),stores) : null;
  console.log(JSON.stringify({artifactId:m.artifactId,provenance:m.provenance,historicalStatus:m.historicalStatus,approvalDecisionId:m.approvalDecisionId,publication:m.publication,verification,providers,result}));
  if (command === 'verify' && verification.state !== 'VERIFIED') failures++;
 } catch (error) { failures++; console.error(JSON.stringify({artifactId:m.artifactId,error:String(error)})); }
}
if (failures) process.exitCode = 1;
