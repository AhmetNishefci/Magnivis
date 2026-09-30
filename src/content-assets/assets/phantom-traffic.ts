import snapshot from '../../../content-intelligence/reviews/phantom-traffic-finalization-v2/content-asset.review.json';
import {contentAssetSchema} from '../schema';

// Platform-neutral editorial proposal; no production authorization or implementation.
export const phantomTrafficContentAsset = contentAssetSchema.parse(snapshot);
