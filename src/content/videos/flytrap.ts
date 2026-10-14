import {videoSpecSchema} from '../schema';
import plan from '../../production/plans/flytrap.json';
import asset from '../../../content-intelligence/cycles/cycle-15/development-v1/content-asset.ready.json';
import narration from '../../production/narration/flytrap.json';
export const flytrap=videoSpecSchema.parse({id:'flytrap',compositionId:'Magnivis-Flytrap-Memory',workingTitle:'Venus Flytrap’s Fading Touch Memory',titleCandidates:['Venus Flytrap’s Fading Touch Memory'],descriptionCandidates:['A temporary biochemical state retains recent stimulus information without a brain.'],hook:asset.script.segments[0]!.text,pillar:'science',status:'production',language:'en',contentAssetId:asset.id,captions:[{language:'en',label:'English',file:plan.captions.file}],format:plan.format,scenes:plan.beats.map(b=>({id:b.sceneType,start:b.frames.start/30,end:b.frames.end/30,purpose:b.objective})),audio:{file:narration.cues[0]!.file,layers:['narration'],narration:true,narrationCues:narration.cues}});
