import {execFileSync} from 'node:child_process';
import {readFileSync} from 'node:fs';
import {mediaHash} from '../artifacts/media';
import {deliveryManifestSchema, type DeliveryManifest} from '../delivery/schema';
export type PublicationDeliveryEvidence = {manifest: DeliveryManifest; fileSha256: string; authorization?: unknown};
export type PublicationDeliveryResolver = (deliveryId: string) => PublicationDeliveryEvidence;
/** Historical packages are found by identity, never by asserted publication digests. */
export const createRepositoryDeliveryResolver = (): PublicationDeliveryResolver => {
  const paths=execFileSync('git',['ls-files','-z'],{encoding:'utf8'}).split('\0').filter(p=>p.endsWith('/manifest.json'));
  const byId=new Map<string, PublicationDeliveryEvidence[]>();
  for(const path of paths) {
    const parsed=deliveryManifestSchema.safeParse(JSON.parse(readFileSync(path,'utf8')));
    if(parsed.success) {const entries=byId.get(parsed.data.deliveryId) ?? [];entries.push({manifest:parsed.data,fileSha256:mediaHash(path)});byId.set(parsed.data.deliveryId,entries);}
  }
  return id=>{const matches=byId.get(id)??[];if(matches.length!==1)throw new Error('Publication requires exactly one resolved delivery manifest or an explicit evidence resolver');return structuredClone(matches[0]!);};
};
