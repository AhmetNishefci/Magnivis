import {videoSpecSchema} from '../schema';
import plan from '../../production/plans/scroll.json';
import asset from '../../../content-intelligence/cycles/cycle-7/content-asset.ready.json';
import narration from '../../production/narration/scroll.json';
/** V3 internal editorial authority lives in the bound plan/cycle; no owner decision invented. */
export const sealedScroll=videoSpecSchema.parse({id:'sealed-scroll',compositionId:'Magnivis-Sealed-Scroll',workingTitle:'Reading a closed burned scroll',titleCandidates:['How can a closed burned scroll be read?'],descriptionCandidates:['Original schematic of virtual unwrapping, with material-dependent ink detection.'],hook:asset.script.segments[0]!.text,pillar:'interdisciplinary',status:'production',language:'en',contentAssetId:asset.id,captions:[{language:'en',label:'English',file:plan.captions.file}],format:plan.format,scenes:plan.beats.map(b=>({id:b.sceneType,start:b.frames.start/30,end:b.frames.end/30,purpose:b.objective})),audio:{file:narration.cues[0]!.file,layers:['narration','silence'],narration:true,narrationCues:narration.cues}});
