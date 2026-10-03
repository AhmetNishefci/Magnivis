import {videoSpecSchema} from '../schema';
import plan from '../../production/plans/heat.json';
import asset from '../../../content-intelligence/cycles/cycle-6/revision-2/content-asset.ready.json';
import narration from '../../production/narration/heat.json';
/** V3 internal editorial authority lives in the bound plan/cycle; no owner decision invented. */
export const heatBarrier=videoSpecSchema.parse({id:'heat-barrier',compositionId:'Magnivis-Heat-Barrier',workingTitle:'Why hotter can last longer',titleCandidates:['Why can a hotter pan make water last longer?'],descriptionCandidates:['Original qualitative explanation of vapor-supported heat transfer.'],hook:asset.script.segments[0]!.text,pillar:'science-reality',status:'production',language:'en',contentAssetId:asset.id,captions:[{language:'en',label:'English',file:plan.captions.file}],format:plan.format,scenes:plan.beats.map(b=>({id:b.sceneType,start:b.frames.start/30,end:b.frames.end/30,purpose:b.objective})),audio:{file:narration.cues[0]!.file,layers:['narration','silence'],narration:true,narrationCues:narration.cues}});
