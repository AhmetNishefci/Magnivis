import {videoSpecSchema} from '../schema';
import plan from '../../production/plans/oklo-v4.json';
import asset from '../../../content-intelligence/cycles/cycle-8/editorial-revision-v4/compression-pass-2/content-asset.ready.json';
import narration from '../../production/narration/oklo-v4-r2.json';
/** V3 internal editorial authority lives in the bound plan/cycle; no owner decision invented. */
export const okloV5=videoSpecSchema.parse({id:'oklo-v5',compositionId:'Magnivis-Oklo-V5',workingTitle:'The nuclear reactors nobody built',titleCandidates:['The nuclear reactors nobody built'],descriptionCandidates:['An investigation leads from isotope evidence to the geological conditions for natural fission.'],hook:asset.script.segments[0]!.text,pillar:'interdisciplinary',status:'production',language:'en',contentAssetId:asset.id,captions:[{language:'en',label:'English',file:plan.captions.file}],format:plan.format,scenes:plan.beats.map(b=>({id:b.sceneType,start:b.frames.start/30,end:b.frames.end/30,purpose:b.objective})),audio:{file:narration.cues[0]!.file,layers:['narration','silence'],narration:true,narrationCues:narration.cues}});
