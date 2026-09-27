import {resolve} from 'node:path';
import {selectDeliveryVariants} from './delivery-cli';
import {
  deliveryDependencies,
  validateDeliveryPackage,
} from './delivery-packages';

try {
  const variants = selectDeliveryVariants(process.argv.slice(2));
  for (const variant of variants) {
    const production = deliveryDependencies.productionResolver(variant);
    const directory = resolve('deliveries', production.spec.id, variant.surface);
    const manifest = validateDeliveryPackage(directory);
    console.log(`valid ${manifest.state}: ${directory}`);
  }
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}
