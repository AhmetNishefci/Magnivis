import snapshot from '../../../content-intelligence/reviews/phantom-traffic-approved-v3/content-asset.approved.json';
import {contentAssetSchema} from '../schema';

// Exact owner-approved editorial state; master visual approval remains pending.
export const phantomTrafficContentAsset = contentAssetSchema.parse(snapshot);
