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
  }
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}
