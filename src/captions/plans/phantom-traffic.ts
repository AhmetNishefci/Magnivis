import {phantomTrafficContentAsset as asset} from '../../content-assets/assets/phantom-traffic';
import metadata from '../../production/narration/phantom-traffic.json';
import {safeAreaProfileIds} from '../../design/safe-areas';
import {captionPlanSchema} from '../schema';
import {createCaptionPlan, type NarrationCaptionDirection, type CaptionChunkDirection} from '../plan';
const chunk = (lines: [string] | [string,string], emphasis?: string, tone: 'ice'|'gold' = 'gold'): CaptionChunkDirection => ({
  lines, placement: 'lower-safe', animation: emphasis ? 'focus-highlight' : 'fade-slide',
  ...(emphasis ? {emphasis:[{text:emphasis,level:'strong',tone}]} : {}),
  presentationIntent:'Speech-first semantic grouping; preserve exact wording and punctuation beneath the traffic action.',
});
const directions: NarrationCaptionDirection[] = [
 {narrationCueId:'hook',chunks:[chunk(['The cars move forward.'],'move forward','ice'),chunk(['But a traffic jam','can move backward.'],'can move backward.')]},
 {narrationCueId:'experiment',chunks:[chunk(['Researchers put','twenty-two cars'],'twenty-two cars'),chunk(['on a circular track.']),chunk(['No obstruction.'],'No obstruction.','ice'),chunk(['Yet stop-and-go traffic formed.'],'stop-and-go traffic')]},
 {narrationCueId:'mechanism',chunks:[chunk(['In dense traffic,']),chunk(['small speed changes','can sometimes grow'],'can sometimes grow'),chunk(['as drivers adjust','to the cars ahead.'])]},
 {narrationCueId:'membership',chunks:[chunk(['Cars join the slow patch','at the back'],'at the back','ice'),chunk(['and leave at the front.'],'at the front.')]},
 {narrationCueId:'payoff',chunks:[chunk(['The cars change.'],'cars change.','ice'),chunk(['The pattern moves backward.'],'moves backward.')]},
 {narrationCueId:'ending',chunks:[chunk(['Not every jam starts this way.'],'Not every','ice'),chunk(['But this kind needs','no blocked road.'],'no blocked road.')]},
];
const initialPlan = createCaptionPlan({
 id:'caption-plan.phantom-traffic.v1',revision:1,contentAsset:{id:asset.id,revision:asset.revision},
 approvedScriptSha256:metadata.provenance.approvedScriptSha256,safeAreaProfileId:safeAreaProfileIds.verticalShortMaster,
 fps:30,narrationCues:metadata.cues,directions,generatedAt:metadata.provenance.generatedAt,
 notes:'Manual designed semantic captions, not automatic transcription. Source text is exact; lower band stays separate from traffic action. Manual phrase boundaries use measured WAV sentence pauses and within-sentence grouping; exact reconstruction and rendered caption frames are checked. Owner listening and visual review remain pending.',
});

// Seconds within each retained narration clip. Sentence boundaries sit in measured
// silence intervals (ffmpeg -35 dB, >=120 ms); the one internal experiment split is
// a manually estimated spoken phrase, not a claim of forced word alignment.
const boundaries: Record<string, number[]> = {
 hook:[0,1.67,4.1], experiment:[0,1.85,3.27,4.60,7.05],
 mechanism:[0,1.38,3.92,6.55], membership:[0,2.36,3.85],
 payoff:[0,1.38,3.3], ending:[0,2.13,4.825],
};
export const phantomTrafficCaptionPlan = captionPlanSchema.parse({...initialPlan, cues:initialPlan.cues.map(cue=>{
 const narration=metadata.cues.find(c=>c.id===cue.sourceNarrationCueId)!;
 const group=initialPlan.cues.filter(c=>c.sourceNarrationCueId===narration.id);
 const index=group.findIndex(c=>c.id===cue.id), offsets=boundaries[narration.id]!;
 return {...cue,startFrame:Math.round((narration.start+offsets[index]!)*30),endFrame:Math.round((narration.start+offsets[index+1]!)*30)};
})});
