import {flipTarget} from './flip-video-target';
import {resolveProductionVideoTarget as resolveHistoricalProductionTarget} from './production-video-targets';
// Historical target bytes are bound by exact approved-media validation.
export const resolveProductionVideoTarget=(id:string)=>id==='flip'?flipTarget:resolveHistoricalProductionTarget(id);
