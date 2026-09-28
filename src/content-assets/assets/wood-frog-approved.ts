import approvedSnapshot from '../../../content-intelligence/reviews/wood-frog-freeze-v1/content-asset.approved.json';
import {contentAssetSchema} from '../schema';

export const woodFrogApprovedContentAsset = contentAssetSchema.parse(approvedSnapshot);
