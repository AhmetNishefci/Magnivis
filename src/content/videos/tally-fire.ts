import {videoSpecSchema} from '../schema';
import plan from '../../production/plans/tally.json';
import asset from '../../../content-intelligence/cycles/cycle-6/content-asset.ready.json';
import narration from '../../production/narration/tally.json';
/** V3 internal editorial authority lives in the bound plan/cycle; no owner decision invented. */
export const tallyFire=videoSpecSchema.parse({id:'tally-fire',compositionId:'Magnivis-Tally-Fire',workingTitle:'The receipts behind the fire',titleCandidates:['How old receipts set Parliament on fire'],descriptionCandidates:['Original historical reconstruction of the 1834 disposal fire.'],hook:asset.script.segments[0]!.text,pillar:'history-stories',status:'production',language:'en',contentAssetId:asset.id,captions:[{language:'en',label:'English',file:plan.captions.file}],format:plan.format,scenes:plan.beats.map(b=>({id:b.sceneType,start:b.frames.start/30,end:b.frames.end/30,purpose:b.objective})),audio:{file:narration.cues[0]!.file,layers:['narration','ambient','silence'],narration:true,narrationCues:narration.cues}});
