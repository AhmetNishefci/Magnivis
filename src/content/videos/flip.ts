import {videoSpecSchema} from '../schema';
import plan from '../../production/plans/flip.json';
import asset from '../../../content-intelligence/cycles/cycle-12/development-v1/content-asset.ready.json';
import narration from '../../production/narration/flip.json';
import sound from '../../production/narration/flip-soundscape.json';
export const flipLaboratory=videoSpecSchema.parse({id:'flip',compositionId:'Magnivis-FLIP-Laboratory',workingTitle:'Why tip a floating laboratory upright?',titleCandidates:['Why tip a floating laboratory upright?'],descriptionCandidates:['Ballast, submerged geometry and a better reference for ocean research.'],hook:asset.script.segments[0]!.text,pillar:'technology-built-world',status:'production',language:'en',contentAssetId:asset.id,captions:[{language:'en',label:'English',file:plan.captions.file}],format:plan.format,scenes:plan.beats.map(b=>({id:b.sceneType,start:b.frames.start/30,end:b.frames.end/30,purpose:b.objective})),audio:{file:sound.file,layers:['narration','ambient','transition'],narration:true,narrationCues:narration.cues}});
