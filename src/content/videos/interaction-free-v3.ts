import {videoSpecSchema} from '../schema';
import plan from '../../production/plans/ifm-v3.json';
import asset from '../../../content-intelligence/cycles/cycle-7/revision-3/content-asset.ready.json';
import narration from '../../production/narration/ifm-v3.json';
/** V3 internal editorial authority lives in the bound plan/cycle; no owner decision invented. */
export const interactionFreeV3=videoSpecSchema.parse({id:'interaction-free-v3',compositionId:'Magnivis-Interaction-Free-V3',workingTitle:'Detection without absorption',titleCandidates:['How can light reveal an obstacle without being absorbed or reflected by it?'],descriptionCandidates:['Progressive original ideal-model possibilities and separate trial events.'],hook:asset.script.segments[0]!.text,pillar:'interdisciplinary',status:'production',language:'en',contentAssetId:asset.id,captions:[{language:'en',label:'English',file:plan.captions.file}],format:plan.format,scenes:plan.beats.map(b=>({id:b.sceneType,start:b.frames.start/30,end:b.frames.end/30,purpose:b.objective})),audio:{file:narration.cues[0]!.file,layers:['narration','silence'],narration:true,narrationCues:narration.cues}});
