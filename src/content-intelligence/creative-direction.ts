import brandPolicy from '../design/brand-execution-policy.json';
import {generateStructured, type AIProvider, type PromptWorkflow} from '../ai/provider';
import type {KnowledgePackage} from '../knowledge/schema';
import type {ContentAsset} from '../content-assets/schema';
import {creativeDirectionDraftSchema, type CreativeDirection} from '../content-assets/creative-direction';
import {validateCreativeDirection} from '../content-assets/creative-direction-integrity';
import {sha256Json} from './run-schema';
import {recentApprovedVisualWorks} from '../content-assets/visual-convergence';
import {readBoundRecord,type RecordReference} from '../workflow/evidence';

export type CreativeDirectionRequest = {
  knowledgePackage: KnowledgePackage; contentAsset: ContentAsset;
  recentAssets: ContentAsset[]; brief: string;
  visualInspectionRecord:RecordReference;
};
export const creativeDirectionWorkflow: PromptWorkflow<CreativeDirectionRequest, CreativeDirection> = {
  id:'workflow.creative-direction',version:3,outputSchemaId:'schema.creative-direction.v1',
  outputSchema:creativeDirectionDraftSchema,
  systemInstructions:[
    'Magnivis is a brand, not a video template. Derive experience from this story and evidence.',
    'Keep approved claims, qualifications, hook, exact narration, beats and VisualPlan intact. If they need change, repeat V3 internal editorial verification; only genuine exceptional conditions require owner escalation.',
    'Evaluate medium, art/color/camera/transition language, narration voice/delivery, captions, sound, pacing and platform presentation with story-specific rationale.',
    `No domain style rules. Default to current primary narrator ${brandPolicy.primaryNarrator.provider}/${brandPolicy.primaryNarrator.voiceId}; material deviations require explicit rationale, never domain change alone. No routine narrator auditions. No mandatory palette, font, soundtrack, duration or hook formula. Silence and restrained/no-motion choices are valid. Soundscape/captions/visuals remain story-specific; runtime is story-led, with no monetization-only padding.`,
    'Within convergenceReview, compare the bounded recent approved masters and their actual rendered visual evidence and available CreativeDirections, not documentation labels alone. Record exact approved master/approval/direction, inspectedVisuals and hash-bound inspectionRecord; never claim visual inspection from text metadata.',
    'Assess overall viewer/feed impression and relevant dimensions with open text: background luminance/environment, palette/contrast, medium/rendering language, composition, typography/captions, camera/motion/transitions, objects/materials, diagrams/metaphor, lighting/texture/depth/density, opening and payoff. This is descriptive, not a mandatory scoring rubric.',
    'Distinguish story-justified continuity, intentional brand continuity and convenience-driven convergence. Similarity is not failure. A similar treatment may remain strongest for this story. Brand continuity means intentional clarity/hierarchy/narration/caption/readability/pacing/truthfulness, not an inherited surface template.',
    'If convenience, available renderer/assets or habit drive convergence, explore a materially different alternative internally and record story tradeoffs and chosenForStory before readiness. Reusable engineering earns no creative preference solely from availability. No new normal owner gate.',
    'No light/dark alternation, color/font/background bans, category-to-style mappings, finite treatment whitelist, novelty quota or numeric visual-distance/diversity score. Story is the creative authority; restrained or rich, familiar or new treatments remain open.',
    'Do not invent prior success or analytics. Do not grant source, editorial, master, device or publication approval.',
    'Return a proposal without an owner decision. State risks and significant owner-review needs; tiny style choices do not need new approval.',
  ],
  buildUserPrompt: request => {
    const recent=recentApprovedVisualWorks(new Date().toISOString(),request.contentAsset.id);
    return JSON.stringify({...request,recentApprovedMasters:recent,visualInspection:readBoundRecord(request.visualInspectionRecord),recentDirections:recent.filter(w=>w.creativeDirection).map(w=>({master:w.master,direction:readBoundRecord(w.creativeDirection!)}))});
  },
};
export const proposeCreativeDirection = async (provider: AIProvider, request: CreativeDirectionRequest) => {
  // Validate upstream authority before any provider invocation.
  const refs={knowledgePackage:{id:request.knowledgePackage.id,revision:request.knowledgePackage.revision,sha256:sha256Json(request.knowledgePackage)},contentAsset:{id:request.contentAsset.id,revision:request.contentAsset.revision,sha256:sha256Json(request.contentAsset)},script:sha256Json(request.contentAsset.script)};
  if (request.knowledgePackage.editorialStatus!=='approved' || !['approved','production-ready'].includes(request.contentAsset.editorialStatus)
    || request.contentAsset.knowledgePackageId!==request.knowledgePackage.id
    || request.contentAsset.selectedClaimIds.some(id=>request.knowledgePackage.claims.find(c=>c.id===id)?.verificationStatus!=='verified')) throw new Error('Creative direction requires approved verified editorial inputs');
  readBoundRecord(request.visualInspectionRecord);
  const generated=await generateStructured({provider,workflow:creativeDirectionWorkflow,input:request,inputReferences:[refs.knowledgePackage.id,refs.contentAsset.id,...request.recentAssets.map(a=>a.id),`visual-inspection.${request.visualInspectionRecord.sha256}`],schema:creativeDirectionDraftSchema});
  const d=validateCreativeDirection(generated.artifact,request.knowledgePackage,request.contentAsset);
  const supplied=request.recentAssets.map(a=>({id:a.id,revision:a.revision,sha256:sha256Json(a)}));
  if (d.convergenceReview.recentAssets.length!==supplied.length || supplied.some(ref=>!d.convergenceReview.recentAssets.some(p=>sha256Json(p.contentAsset)===sha256Json(ref)))) throw new Error('Creative convergence review must inspect the exact supplied recent assets');
  return generated;
};
