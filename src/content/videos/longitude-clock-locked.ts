import {videoSpecSchema} from '../schema';
import {longitudeClockV2} from './longitude-clock-v2';
import {longitudeLockedPlan} from '../../production/longitude-master-integrity';
// Logical distribution identity for the exact same approved MP4; never a new render.
export const longitudeClockLocked=videoSpecSchema.parse({...longitudeClockV2,id:'longitude-clock-locked',status:'reviewed',production:{...longitudeClockV2.production,productionPlanRevision:longitudeLockedPlan.revision,outputReviewState:'owner-visual-approved'}});
