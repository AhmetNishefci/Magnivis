import {chocolatePreparedDeliveryDependencies as prepared} from './chocolate-prepared-delivery';
import {createPlatformVariantRegistry} from '../src/platform-variants/registry';
import {chocolatePublicationVariants} from '../src/platform-variants/variants/chocolate-crystal-choice-publication';
import type {DeliveryDependencies} from './delivery-packages';
export const chocolatePublicationDeliveryDependencies:DeliveryDependencies={...prepared,variantRegistry:createPlatformVariantRegistry(chocolatePublicationVariants,prepared.assetRegistry)};
