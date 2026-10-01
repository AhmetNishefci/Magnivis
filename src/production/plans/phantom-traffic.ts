import snapshot from '../../../content-intelligence/reviews/phantom-traffic-master-lock-v1/production-plan.locked.json';
import {productionPlanSchema} from '../schema';
export const phantomTrafficProductionPlan=productionPlanSchema.parse(snapshot);
export const phantomTrafficProductionFrames=Math.round(phantomTrafficProductionPlan.format.durationSeconds*30);
