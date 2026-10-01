import {readFileSync,writeFileSync,readdirSync,statSync} from 'node:fs';
import {extname} from 'node:path';
import {artifactManifestSchema,parseManifests} from '../src/artifacts/schema';
import {fileSha256} from '../src/production/phantom-traffic-integrity';
import {trafficPresentationDecision as decision} from '../src/platform-variants/phantom-traffic-presentation-approval';
const file='artifacts/manifests.json',original=readFileSync(file,'utf8'),existing=parseManifests(JSON.parse(original));
const walk=(dir:string):string[]=>readdirSync(dir).flatMap(n=>{const p=`${dir}/${n}`;return statSync(p).isDirectory()?walk(p):[p];});
const paths=[...walk('artifacts/deliveries/phantom-traffic-v1'),...walk('content-intelligence/reviews/phantom-traffic-delivery-v1')];
const recordedAt=new Date().toISOString();
const added=paths.map(path=>artifactManifestSchema.parse({schemaVersion:1,artifactId:`phantom-traffic.delivery-v1.${path.replace(/[^a-z0-9]/g,'-')}`,contentId:'phantom-traffic',artifactType:'delivery-file',revision:1,
 identity:{sha256:fileSha256(path),bytes:statSync(path).size,mimeType:extname(path)==='.mp4'?'video/mp4':extname(path)==='.json'?'application/json':'text/plain'},
 createdAt:null,creationUnknownReason:'Owner review time unknown. Decision and package generation entry times are separately labeled in their native records.',recordedAt,sourceCommit:'fb7c6ebafa5c2a9fbcfde961a1a4a08124e28582',productionPlanId:'production-plan.phantom-traffic.v1',captionPlanId:'caption-plan.phantom-traffic.v1',platformVariantId:null,approvalDecisionId:decision.id,approvalScope:'none',publication:'not-authorized',localPath:path,locations:[{provider:'git',key:path,durability:'git-tracked'}],retention:'DURABLE_REQUIRED',provenance:'ORIGINAL_PRODUCTION',historicalSha256:null,historicalStatus:'new-production',replacesArtifactId:null,parentArtifactIds:['phantom-traffic.locked-master.v1'],exactBytesMatter:true,
 reproducibility:{status:'hash-only',recipe:null,evidence:['Durable owner-report and delivery-preparation snapshot. No specific surface or cover test inferred from unscoped statement.','Master copied byte-for-byte without rendering; native delivery validation binds package, asset, variants and media.','Publication not authorized. Future scope confirmation requires a new immutable decision/delivery revision.']}})).filter(m=>{const old=existing.find(r=>r.artifactId===m.artifactId);if(old&&old.identity.sha256!==m.identity.sha256)throw new Error('Do not overwrite delivery artifact');return !old;});
parseManifests([...existing,...added]);
if(added.length)writeFileSync(file,original.replace(/\s*\]\s*$/,'')+`,\n${added.map(r=>JSON.stringify(r,null,2).split('\n').map(l=>'  '+l).join('\n')).join(',\n')}\n]\n`);
console.log(JSON.stringify({added:added.length,previousRecordsPreserved:existing.length}));
