import {readFileSync} from 'node:fs';
import {resolveDeliveryUpload} from '../src/delivery/media-bindings';
const manifest = process.argv[2];
if (!manifest) throw new Error('Usage: node --import tsx scripts/resolve-delivery-media.ts <manifest.json>');
console.log(JSON.stringify(resolveDeliveryUpload(JSON.parse(readFileSync(manifest, 'utf8'))), null, 2));
