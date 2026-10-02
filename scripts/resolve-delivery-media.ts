import {readFileSync} from 'node:fs';
import {resolveDeliveryUpload} from '../src/delivery/media-bindings';
import {resolveAuthorizedCycleUpload} from '../src/workflow/release';
import {recordReferenceSchema} from '../src/workflow/evidence';
import {loadMediaRegistry} from '../src/artifacts/media';
import {loadCycle} from '../src/workflow/store';
import {cycleReleaseSchema} from '../src/workflow/release';
import {sha256Json} from '../src/content-intelligence/run-schema';
import {readBoundRecord} from '../src/workflow/evidence';
const [mode,release,decision]=process.argv.slice(2);
const read=(path:string)=>JSON.parse(readFileSync(path,'utf8'));
if(mode==='--authorized') {
  if(!release||!decision)throw new Error('Authorized resolution requires release.json and decision-reference.json');
  const input=cycleReleaseSchema.parse(read(release));const authority=recordReferenceSchema.parse(read(decision));const registry=loadMediaRegistry();
  const cycle=loadCycle(process.cwd(),input.cycleId,registry);
  if(!['authorized','closed'].includes(cycle.stage)||!cycle.release||!cycle.publicationDecision||sha256Json(readBoundRecord(cycle.release))!==sha256Json(input)||sha256Json(cycle.publicationDecision)!==sha256Json(authority))throw new Error('Upload requires the exact replayed authorized cycle release and decision');
  console.log(JSON.stringify(resolveAuthorizedCycleUpload(input,authority,registry),null,2));
} else {
  if(!mode)throw new Error('Usage: node --import tsx scripts/resolve-delivery-media.ts <legacy-manifest.json> | --authorized <release.json> <decision-reference.json>');
  console.log(JSON.stringify({purpose:'byte-lookup-only; no publication authorization',...resolveDeliveryUpload(read(mode))},null,2));
}
