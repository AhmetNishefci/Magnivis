import {videoSpecSchema} from '../schema';
import plan from '../../production/plans/chladni.json';
import asset from '../../../content-intelligence/cycles/cycle-5/content-asset.ready.json';
import narration from '../../production/narration/chladni.json';
/** V3 internal editorial authority lives in the bound plan/cycle; no owner decision invented. */
export const chladniSand=videoSpecSchema.parse({id:'chladni-sand',compositionId:'Magnivis-Chladni-Sand',workingTitle:'A map of stillness',titleCandidates:['Why vibration draws patterns in sand'],descriptionCandidates:['An original explanatory plate-mode illustration.'],hook:asset.script.segments[0]!.text,pillar:'science-reality',status:'production',language:'en',contentAssetId:asset.id,captions:[{language:'en',label:'English',file:plan.captions.file}],format:plan.format,scenes:plan.beats.map(b=>({id:b.sceneType,start:b.frames.start/30,end:b.frames.end/30,purpose:b.objective})),audio:{file:narration.cues[0]!.file,layers:['narration','ambient','silence'],narration:true,narrationCues:narration.cues}});
