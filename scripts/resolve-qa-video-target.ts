import {diceV4Target} from './dice-v4-video-target';
import {diceTarget} from './dice-video-target';
import {flipTarget} from './flip-video-target';
import {resolveProductionVideoTarget as resolveHistoricalProductionTarget} from './production-video-targets';
// Historical target bytes are bound by exact approved-media validation.
export const resolveProductionVideoTarget=(id:string)=>id==='dice-v4'?diceV4Target:id==='dice'?diceTarget:id==='flip'?flipTarget:resolveHistoricalProductionTarget(id);
