import {videoSpecSchema} from '../schema';
import plan from '../../production/plans/devils-hole.json';
import asset from '../../../content-intelligence/cycles/cycle-13/development-v1/content-asset.ready.json';
import narration from '../../production/narration/devils-hole.json';
import sound from '../../production/narration/devils-hole-soundscape.json';
export const devilsHole=videoSpecSchema.parse({id:'devils-hole',compositionId:'Magnivis-Devils-Hole',workingTitle:'An earthquake made waves in a desert pool',titleCandidates:['An earthquake made waves in a desert pool'],descriptionCandidates:['Seismic energy, local water and a vulnerable desert habitat.'],hook:asset.script.segments[0]!.text,pillar:'science-nature',status:'production',language:'en',contentAssetId:asset.id,captions:[{language:'en',label:'English',file:plan.captions.file}],format:plan.format,scenes:plan.beats.map(b=>({id:b.sceneType,start:b.frames.start/30,end:b.frames.end/30,purpose:b.objective})),audio:{file:sound.file,layers:['narration','ambient','transition'],narration:true,narrationCues:narration.cues}});
