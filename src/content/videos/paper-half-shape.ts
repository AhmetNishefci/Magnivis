import {videoSpecSchema} from '../schema';
import plan from '../../production/plans/paper.json';
import asset from '../../../content-intelligence/cycles/cycle-4/content-asset.ready.json';
import narration from '../../production/narration/paper.json';
/** V3 internal editorial authority lives in the bound plan/cycle; no owner decision invented. */
export const paperHalfShape=videoSpecSchema.parse({id:'paper-half-shape',compositionId:'Magnivis-Paper-Half-Shape',workingTitle:'The hidden geometry of A4',titleCandidates:['Why A4 keeps its shape when cut in half'],descriptionCandidates:['An original geometrical demonstration of A-series paper proportions.'],hook:asset.script.segments[0]!.text,pillar:'technology-built-world',status:'production',language:'en',contentAssetId:asset.id,captions:[{language:'en',label:'English',file:plan.captions.file}],format:plan.format,scenes:plan.beats.map(b=>({id:b.sceneType,start:b.frames.start/30,end:b.frames.end/30,purpose:b.objective})),audio:{file:narration.cues[0]!.file,layers:['narration','silence'],narration:true,narrationCues:narration.cues}});
