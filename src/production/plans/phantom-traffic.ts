import snapshot from './phantom-traffic.json';
import {productionPlanSchema} from '../schema';
export const phantomTrafficProductionPlan=productionPlanSchema.parse(snapshot);
export const phantomTrafficProductionFrames=Math.round(phantomTrafficProductionPlan.format.durationSeconds*30);
