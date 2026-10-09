import {execFileSync} from 'node:child_process';
import {readdirSync,statSync,writeFileSync} from 'node:fs';
import {mediaArtifactSchema,mediaHash,type MediaReference} from '../src/artifacts/media';
import {openMediaCatalog,persistMediaArtifact} from '../src/artifacts/catalog';
const base='content-intelligence/cycles/cycle-10',registry=openMediaCatalog(),sourceCommit=execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim();
const paths=[...readdirSync(`${base}/research`).filter(f=>/\.(pdf|png)$/.test(f)).map(f=>`${base}/research/${f}`),...readdirSync('public/visuals/craft-escape').map(f=>`public/visuals/craft-escape/${f}`)];
const records=paths.map(path=>{const sha256=mediaHash(path),prior=registry.byHash(sha256);if(prior){if(prior.canonicalPath!==path)throw new Error('Duplicate source payload');return {path,media:{id:prior.id,sha256}};}
 const media=persistMediaArtifact(mediaArtifactSchema.parse({id:`media.${sha256}`,sha256,canonicalPath:path,mediaType:path.endsWith('.pdf')?'application/octet-stream':path.endsWith('.png')?'image/png':'image/jpeg',bytes:statSync(path).size,provenance:{kind:'evidence-snapshot',sourceCommit,sourceRecords:[`${base}/${path.startsWith('public')?'archival-assets.json':'research/evidence-access-log.json'}`],createdAt:statSync(path).birthtime.toISOString(),creationTimeUnknownReason:null},parents:[] as MediaReference[]}));return {path,media};});
writeFileSync(`${base}/source-media-identities.json`,JSON.stringify({enteredAt:new Date().toISOString(),records,note:'Canonical source bytes only. Research crops are distinct payload evidence; no lifecycle copies or new same-byte evidence snapshots.'},null,2)+'\n',{flag:'wx'});
