import {platformVariantSchema} from '../schema';
import data from '../../../content-intelligence/reviews/chocolate-crystal-choice-platform-v1/platform-variants.json';
export const chocolatePlatformVariants=data.map(v=>platformVariantSchema.parse(v));
