import {videoSpecSchema} from '../schema';
import plan from '../../production/plans/dice-v4.json';
import asset from '../../../content-intelligence/cycles/cycle-14/revision-v2/content-asset.ready.json';
import narration from '../../production/narration/dice-v4.json';
import sound from '../../production/narration/dice-v4-soundscape.json';
export const diceV4=videoSpecSchema.parse({id:'dice-v4',compositionId:'Magnivis-Dice-Puzzle-V4',workingTitle:'The Dice With No Best Choice',titleCandidates:['The Dice With No Best Choice'],descriptionCandidates:['Four dice, circular advantages and choosing a favorable reply.'],hook:asset.script.segments[0]!.text,pillar:'mathematics',status:'production',language:'en',contentAssetId:asset.id,captions:[{language:'en',label:'English',file:plan.captions.file}],format:plan.format,scenes:plan.beats.map(b=>({id:b.sceneType,start:b.frames.start/30,end:b.frames.end/30,purpose:b.objective})),audio:{file:sound.file,layers:['narration','transition'],narration:true,narrationCues:narration.cues}});
