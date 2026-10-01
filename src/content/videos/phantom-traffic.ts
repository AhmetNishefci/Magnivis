import {videoSpecSchema} from '../schema';
import {phantomTrafficContentAsset as asset} from '../../content-assets/assets/phantom-traffic';
import {phantomTrafficProductionPlan as plan} from '../../production/plans/phantom-traffic';
import metadata from '../../production/narration/phantom-traffic.json';
import soundscape from '../../production/narration/phantom-traffic-soundscape.json';
export const phantomTraffic=videoSpecSchema.parse({
 id:'phantom-traffic',compositionId:'Magnivis-Phantom-Traffic',workingTitle:asset.storyAngle,
 titleCandidates:['The Traffic Jam With Nothing at the Front'],descriptionCandidates:['A controlled traffic experiment and a simplified visual explanation of how a congestion pattern can travel backward while cars move forward.'],hook:asset.script.segments[0]!.text,pillar:'engineering',status:'production',language:'en',
 captions:[{language:'en',label:'English',file:plan.captions.file}],format:plan.format,
 scenes:plan.beats.map(b=>({id:b.sceneType,start:b.frames.start/30,end:b.frames.end/30,purpose:b.objective})),contentAssetId:asset.id,
 production:{productionPlanId:plan.id,productionPlanRevision:plan.revision,knowledgePackageRevision:plan.knowledgePackage.revision,contentAssetRevision:asset.revision,approvedPackageSha256:plan.knowledgePackage.sha256,approvedContentAssetSha256:plan.contentAsset.sha256,ownerDecisionSha256:plan.ownerDecision.sha256,approvedScriptSha256:plan.approvedScriptSha256,captionPlanId:plan.captions.captionPlanId,captionPlanRevision:plan.captions.captionPlanRevision,captionPlanSha256:plan.captions.captionPlanSha256,safeAreaProfileId:plan.safeAreaProfileId,outputReviewState:'visual-review-required'},
 audio:{file:'audio/phantom-traffic.wav',layers:['ambient','transition','narration'],narration:true,narrationCues:metadata.cues,provenance:{soundscape,narration:metadata.provenance}},
});
