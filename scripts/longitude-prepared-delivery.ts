import {createPlatformVariantRegistry} from '../src/platform-variants/registry';
import {longitudePlatformVariants} from '../src/platform-variants/variants/longitude-clock';
import {deliveryDependencies} from './delivery-packages';

/** Immutable revision-1 handoffs are validated against their exact historical variant revision. */
export const longitudePreparedDeliveryDependencies = {
  ...deliveryDependencies, variantRegistry: createPlatformVariantRegistry(longitudePlatformVariants),
};
