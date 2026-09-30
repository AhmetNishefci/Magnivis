import {millenniumBridgeClaimIds as c, millenniumBridgeHookIds, millenniumBridgeKnowledgePackage} from '../../knowledge/packages/millennium-bridge';
import {contentAssetSchema} from '../schema';

export const millenniumBridgeAssetId = 'millennium-bridge.asset.balance-feedback';
const scriptId = (suffix: string) => `${millenniumBridgeAssetId}.script.${suffix}`;
const beatId = (suffix: string) => `${millenniumBridgeAssetId}.beat.${suffix}`;
const factual = (suffix: string, text: string, claimIds: string[]) => ({id: scriptId(suffix), type: 'factual' as const, text, claimIds});
const segments = [
  factual('hook', millenniumBridgeKnowledgePackage.hooks.find(({id}) => id === millenniumBridgeHookIds.balanceFeedback)!.text, [c.footPlacement, c.negativeDamping]),
  factual('opening', 'On opening day, London’s Millennium Bridge moved sideways.', [c.lateral]),
  factual('foot-placement', 'When a walkway shifts, people adjust where they step to stay upright.', [c.footPlacement]),
  factual('energy-in', 'In a crowd, those sideways forces can feed energy back into the bridge.', [c.negativeDamping]),
  factual('growth', 'Instead of dying away, the sway can grow.', [c.growth]),
  factual('without-synchrony', 'That can begin without everyone matching footsteps.', [c.withoutSynchrony]),
  factual('qualification', 'Later coordination may change the motion; its exact role that day remains uncertain.', [c.laterCoherence, c.dayUncertainty]),
  factual('damping', 'Engineers added dampers to take energy out of the movement, suppressing the sway.', [c.dampingRetrofit]),
];
const beats = [
  {suffix: 'balance-paradox', label: 'Balance paradox / immediate hook', purpose: 'Pose the balance paradox.', scripts: ['hook'], claims: [c.footPlacement, c.negativeDamping], objective: 'Introduce a recognizable lateral walkway and a person correcting balance.', guardrail: 'A question, not a claim that every correction destabilizes every bridge.'},
  {suffix: 'opening-day', label: 'Opening-day sideways movement', purpose: 'Locate the historical event.', scripts: ['opening'], claims: [c.lateral], objective: 'Show London’s bridge moving sideways in an illustrative setting.', guardrail: 'No vertical-bounce or weight-capacity explanation; no claim this is documentary footage.'},
  {suffix: 'corrective-steps', label: 'Human corrective foot placement', purpose: 'Explain lateral balance control.', scripts: ['foot-placement'], claims: [c.footPlacement], objective: 'Show sideways stance-foot placement relative to body balance on a moving surface.', guardrail: 'Do not present a single model as measured trajectories from opening day.'},
  {suffix: 'crowd-feedback', label: 'Crowd-scale forces feeding structural response', purpose: 'Reveal energy input and conditional growth.', scripts: ['energy-in', 'growth'], claims: [c.negativeDamping, c.growth], objective: 'Aggregate varied pedestrian phases into a shared lateral response; show energy entering and sway growing.', guardrail: 'Footsteps stay varied. Do not imply forces must cancel or growth is unlimited.'},
  {suffix: 'coherence-qualification', label: 'Synchronization/coherence qualification and uncertainty', purpose: 'Separate possible onset from later coordination and event uncertainty.', scripts: ['without-synchrony', 'qualification'], claims: [c.withoutSynchrony, c.laterCoherence, c.dayUncertainty], objective: 'Maintain varied phases; permit limited later coherence while visibly qualifying its historical role.', guardrail: 'Never unanimous lockstep; never claim synchronization had no role. Later coherence can moderate or amplify.'},
  {suffix: 'energy-out', label: 'Dampers remove energy and suppress response', purpose: 'Resolve the feedback with damping.', scripts: ['damping'], claims: [c.dampingRetrofit], objective: 'Show an original damper abstraction taking energy out while the lateral response diminishes.', guardrail: 'Leave residual movement possible; this is not a guarantee against all future motion.'},
];

export const millenniumBridgeContentAsset = contentAssetSchema.parse({
  id: millenniumBridgeAssetId, revision: 1, knowledgePackageId: millenniumBridgeKnowledgePackage.id,
  assetType: 'short-form-video', editorialPurpose: 'Explain a counterintuitive human–structure feedback mechanism.',
  storyAngle: 'The balance-feedback reveal, with synchronization and historical-attribution caveats.',
  hookId: millenniumBridgeHookIds.balanceFeedback,
  selectedClaimIds: [...new Set(segments.flatMap(({claimIds}) => claimIds))],
  durationIntentSeconds: {minimum: 30, maximum: 50},
  script: {language: 'en', segments},
  narrativeStructure: beats.map((beat) => ({id: beatId(beat.suffix), label: beat.label, purpose: beat.purpose, scriptSegmentIds: beat.scripts.map(scriptId)})),
  visualPlan: beats.map((beat) => ({
    id: `${millenniumBridgeAssetId}.visual.${beat.suffix}`, narrativeBeatId: beatId(beat.suffix),
    objective: beat.objective, visualType: 'animation', suggestedPrimitive: 'bespoke',
    scriptSegmentIds: beat.scripts.map(scriptId), claimIds: beat.claims,
    assetRequirements: ['Original procedural/vector bridge, pedestrians, force and energy indications; no copied footage or scientific figures.'],
    notes: `${beat.guardrail} Mechanism scenes must disclose SIMPLIFIED EXPLANATORY MODEL and MOTION EXAGGERATED. Preserve cinematic minimalism and designed burned-in captions in any separately authorized future production. No design frames or production timing are approved here.`,
  })),
  narrationPlan: {mode: 'narrated', voiceDirection: 'Clear, curious, measured English; preserve all can/may/uncertainty qualifications.', pronunciationNotes: ['Millennium Bridge; lateral motion; dampers.']},
  editorialStatus: 'editorial-review',
});
