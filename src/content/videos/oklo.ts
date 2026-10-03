import {videoSpecSchema} from '../schema';
import plan from '../../production/plans/oklo.json';
import asset from '../../../content-intelligence/cycles/cycle-8/content-asset.ready.json';
import narration from '../../production/narration/oklo.json';
/** V3 internal editorial authority lives in the bound plan/cycle; no owner decision invented. */
export const oklo=videoSpecSchema.parse({id:'oklo',compositionId:'Magnivis-Oklo',workingTitle:'The nuclear reactors nobody built',titleCandidates:['The nuclear reactors nobody built'],descriptionCandidates:['Original illustrated geological journey explains natural fission and qualified zone-specific cycling.'],hook:asset.script.segments[0]!.text,pillar:'interdisciplinary',status:'production',language:'en',contentAssetId:asset.id,captions:[{language:'en',label:'English',file:plan.captions.file}],format:plan.format,scenes:plan.beats.map(b=>({id:b.sceneType,start:b.frames.start/30,end:b.frames.end/30,purpose:b.objective})),audio:{file:narration.cues[0]!.file,layers:['narration','silence'],narration:true,narrationCues:narration.cues}});
