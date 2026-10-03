import {mkdirSync, readFileSync, writeFileSync} from 'node:fs';
import {mediaHash} from '../src/artifacts/media';
import {sha256Json} from '../src/content-intelligence/run-schema';
import {knowledgePackageSchema} from '../src/knowledge/schema';
import {contentAssetSchema} from '../src/content-assets/schema';
import {creativeDirectionSchema} from '../src/content-assets/creative-direction';
import {validateAdaptiveCaptionPlan} from '../src/captions/adaptive-plan';
import {validateInternalProductionPlanReferences} from '../src/production/schema';
import {defaultExecutionPolicy} from '../src/design/brand-execution-policy';
import narration from '../src/production/narration/heat-v4.json';
const base='content-intelligence/cycles/cycle-6/revision-3',original='content-intelligence/cycles/cycle-6/revision-2';
const read=(name:string):unknown=>JSON.parse(readFileSync(`${original}/${name}.json`,'utf8'));
const pkg=knowledgePackageSchema.parse(read('knowledge-package.ready'));
const asset=contentAssetSchema.parse(read('content-asset.ready'));
const direction=creativeDirectionSchema.parse(read('direction-v1'));
const bind=(v:{id:string;revision:number})=>({id:v.id,revision:v.revision,sha256:sha256Json(v)});
const lines=[
 ['Why can a hotter pan make','a drop of water last longer?'],
 ['On a hot metal surface,','water can touch the metal','and boil away quickly.'],
 ['Heat it far enough,','and something changes.'],
 ['The bottom of the drop','turns to vapor almost instantly.'],
 ['That vapor forms a cushion,','lifting the rest of the water','off the metal.'],
 ['Now heat must cross','a poorly conducting gas layer.'],
 ['The hotter surface has created','a barrier to its own heat.'],
 ['This is the Leidenfrost effect.'],
 ['It doesn’t mean hotter always','makes water last longer.'],
 ['The transition depends on','the surface and the drop.'],
 ['Above it, more heat can','speed evaporation again.'],
 ['The surprise is that','a hotter surface can give water','less direct contact with the heat.'],
];
const captions=validateAdaptiveCaptionPlan({schemaVersion:2,id:'caption-plan.heat-barrier.v4',revision:4,status:'review-required',creativeDirection:bind(direction),approvedScriptSha256:sha256Json(asset.script),fps:30,coverage:'complete-narration',visualTreatment:{fontAsset:'@fontsource/manrope@5.3.0/latin-600.css',fontFamily:'Manrope',fontSize:48,fontWeight:600,lineHeight:1.25,foreground:'#EDF4F7',emphasisMethod:'Complete sentence captions preserve semantic contrast; stable typography without word animation.',backdrop:'Quiet graphite lower field; no backing card.',animation:'Four-frame opacity entrance/exit; fixed glyph positions.',rendererId:'renderer.heat-phrases.v1',rationale:'Large semantic sentences preserve conditional contrast below interface. Captions do not create TTS breaks.'},cues:narration.cues.map((n,i)=>({id:`heat-caption-${i+1}`,sourceNarrationCueId:n.id,startFrame:Math.round(n.start*30),endFrame:Math.round((n.start+n.duration)*30),lines:lines[i],bounds:{x:120,y:1370,width:760,height:220},presentationIntent:'Preserve complete semantic sentence and qualifiers below enlarged interface.'}))},narration.cues,narration.format,direction,asset);
mkdirSync('src/captions/plans',{recursive:true});
writeFileSync('src/captions/plans/heat-v4.json',JSON.stringify(captions,null,2)+'\n',{flag:'wx'});
const rights={enteredAt:new Date().toISOString(),visuals:'Original Magnivis metal/water macro and enlarged vapor-gap geometry, qualitative heat paths. No borrowed figures, photos or footage.',font:{package:'@fontsource/manrope',version:'5.3.0',license:'SIL OFL 1.1',source:'https://github.com/sharanda/manrope',files:['node_modules/@fontsource/manrope/files/manrope-latin-600-normal.woff2','node_modules/@fontsource/manrope/files/manrope-latin-400-normal.woff2'].map(path=>({path,sha256:mediaHash(path)})),licenseSha256:mediaHash('node_modules/@fontsource/manrope/LICENSE')},narration:{provider:'kokoro-local',model:narration.provenance.modelId,voice:'af_heart',license:'Apache-2.0; established docs/ASSET-LICENSES.md terms; no voice cloning.',cacheDisposition:'Disposable model cache; exact generated clips retained.'},sound:'Narration alone, deliberate silence; no music or synthetic experiment sounds.',sourceFigures:'Consulted only; never production assets.',approvalScope:'none'};
writeFileSync(`${base}/rights-provenance.json`,JSON.stringify(rights,null,2)+'\n',{flag:'wx'});

const vtt='WEBVTT\n\n'+captions.cues.map((c,i)=>{
 const stamp=(f:number)=>{const ms=Math.round(f/30*1000);return `${String(Math.floor(ms/3600000)).padStart(2,'0')}:${String(Math.floor(ms/60000)%60).padStart(2,'0')}:${String(Math.floor(ms/1000)%60).padStart(2,'0')}.${String(ms%1000).padStart(3,'0')}`;};
 return `${i+1}\n${stamp(c.startFrame)} --> ${stamp(c.endFrame)}\n${c.lines.join('\n')}\n`;
}).join('\n');
writeFileSync('captions/heat-barrier-v4.en.vtt',vtt,{flag:'wx'});
const plan=validateInternalProductionPlanReferences({schemaVersion:1,id:'production-plan.heat-barrier.v4',revision:4,status:'implementation-ready',knowledgePackage:bind(pkg),contentAsset:bind(asset),internalEditorialAuthority:pkg.approval!.authority,presentationProfiles:['youtube','tiktok','instagram','facebook'].map(p=>({path:`${original}/profiles/${p}.json`,sha256:mediaHash(`${original}/profiles/${p}.json`)})),approvedScriptSha256:sha256Json(asset.script),creativeDirection:bind(direction),executionPolicy:defaultExecutionPolicy(),excludedClaimIds:[`${pkg.id}.claim.always`],format:narration.format,safeAreaProfileId:'safe-area.youtube-shorts.v2',beats:asset.visualPlan.map((v,i)=>{const cue=narration.cues.find(n=>n.beatIndex===i)!;const next=narration.cues.find(n=>n.beatIndex===i+1);return {id:`heat.production.${i+1}`,sourceVisualPlanId:v.id,narrativeBeatId:v.narrativeBeatId,scriptSegmentIds:v.scriptSegmentIds,claimIds:v.claimIds,frames:{start:i===0?0:Math.round(cue.start*30),end:next?Math.round(next.start*30):narration.durationFrames},sceneType:['thermal-reversal','direct-contact','transition','bottom-vapor','pressure-support','gas-resistance','self-made-barrier','name','scope','conditions','continued-evaporation','contact-payoff'][i],objective:v.objective,onScreenText:[],animationIntent:'Deterministic material comparison to enlarged vapor interface; qualitative heat paths, never measured times or fluid simulation.',transitionIntent:'Paired comparison grows into enlarged interface; stable contact plane and water identity; return for scoped payoff.',audioIntent:'Measured af_heart full sentences; narration alone, no music or experiment recording.'};}),assets:[{id:'heat.original-geometry',kind:'procedural-visual',provenance:{origin:'Original Magnivis thermal-interface illustration code',rights:'Project-owned original artwork',notes:'No third-party visual assets; gap, heat paths and shrinkage are qualitative illustrations.',evidence:`${base}/rights-provenance.json`}},{id:'heat.manrope',kind:'font',provenance:{origin:'Mikhail Sharanda / fontsource pinned package',rights:'SIL OFL 1.1',notes:'Existing installed font selected for readable print execution; unmodified.',evidence:`${original}/Manrope-OFL.txt`}},{id:'heat.narration',kind:'audio',path:'public/audio/heat-v4/narration',provenance:{origin:'Local Kokoro af_heart from internally reviewed script',rights:'Project output under established Apache-2.0 model terms',notes:'No voice cloning or paid calls.',evidence:'src/production/narration/heat-v4.json'}}],captions:{file:'captions/heat-barrier-v4.en.vtt',captionPlanId:captions.id,captionPlanRevision:4,captionPlanSha256:sha256Json(captions),generatorId:'generator.heat-phrases.v1',generatorVersion:1,source:'approved-narration-cues',designedBurnedIn:true,placement:'optional-platform-track-lower-center'},reviewRequirements:['Technical probe, full decode, typography and exact caption reconstruction.','Actual master and every caption midpoint decoded and inspected.','Inspect contact-versus-gap behavior, vapor support, continuing evaporation and nonmonotonic qualification; persistent enlarged-gap disclosure.','Preflight remains provisional local playback geometry; no device/crop pass.','AHMET — MASTER REVIEW required before presentation/publication preparation.']},pkg,asset,direction);
mkdirSync('src/production/plans',{recursive:true});
writeFileSync('src/production/plans/heat-v4.json',JSON.stringify(plan,null,2)+'\n',{flag:'wx'});
console.log(`Prepared ${narration.durationFrames} frames, ${captions.cues.length} captions, twelve semantic sentence beats.`);
