import {resolveDeliveryUpload} from '../src/delivery/media-bindings';
import {selectDeliveryVariants} from './delivery-cli';
import {generateDeliveryPackage} from './delivery-packages';

try {
  const variants = selectDeliveryVariants(process.argv.slice(2));
  const generatedAt = new Date().toISOString();
  for (const variant of variants) {
    const result = generateDeliveryPackage({
      variantId: variant.id,
      generatedAt,
    });
    console.log(`${result.manifest.state}: ${result.directory}`);
    if (result.manifest.schemaVersion === 3) console.log(`Exact canonical upload: ${resolveDeliveryUpload(result.manifest).uploadFile}`);
  }
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}
