import {flytrapV3Target} from './flytrap-v3-video-target';
import {diceV4Target} from './dice-v4-video-target';
import {flytrapTarget} from './flytrap-video-target';
import {flytrapV2Target} from './flytrap-v2-video-target';
import {diceTarget} from './dice-video-target';
import {flipTarget} from './flip-video-target';
import {resolveProductionVideoTarget as resolveHistoricalProductionTarget} from './production-video-targets';
// Historical target bytes are bound by exact approved-media validation.
export const resolveProductionVideoTarget=(id:string)=>id==='flytrap-v3'?flytrapV3Target:id==='flytrap-v2'?flytrapV2Target:id==='flytrap'?flytrapTarget:id==='dice-v4'?diceV4Target:id==='dice'?diceTarget:id==='flip'?flipTarget:resolveHistoricalProductionTarget(id);
