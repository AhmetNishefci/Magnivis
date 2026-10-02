import {mkdirSync, readFileSync, writeFileSync} from 'node:fs';
import {mediaHash} from '../src/artifacts/media';
import {sha256Json} from '../src/content-intelligence/run-schema';
import {knowledgePackageSchema} from '../src/knowledge/schema';
import {contentAssetSchema} from '../src/content-assets/schema';
import {creativeDirectionSchema} from '../src/content-assets/creative-direction';
import {validateAdaptiveCaptionPlan} from '../src/captions/adaptive-plan';
import {validateInternalProductionPlanReferences} from '../src/production/schema';
import {defaultExecutionPolicy} from '../src/design/brand-execution-policy';
import narration from '../src/production/narration/paper.json';
const base='content-intelligence/cycles/cycle-4';
const read=(name:string):unknown=>JSON.parse(readFileSync(`${base}/${name}.json`,'utf8'));
const pkg=knowledgePackageSchema.parse(read('knowledge-package.ready'));
const asset=contentAssetSchema.parse(read('content-asset.ready'));
const direction=creativeDirectionSchema.parse(read('direction-v1'));
const bind=(v:{id:string;revision:number})=>({id:v.id,revision:v.revision,sha256:sha256Json(v)});
const lines=[
 ['Cut A4 paper in half.'],['Turn it.'],['It’s almost the same','shape, only smaller.'],
 ['A square cannot do that.'],['Halve it, and you get','a skinny rectangle.'],
 ['A-series paper is built','around a special ratio:'],['one to the','square root of two.'],
 ['Halve the long side,'],['then rotate the piece.'],['That ratio comes back.'],
 ['In the ideal system,'],['an A3 design shrinks to A4','without stretching.'],
 ['Each length shrinks to about','seventy-one percent.'],['The area halves.'],
 ['Real paper sizes are rounded','to whole millimetres.'],['The perfect rule lives','in the geometry.'],
 ['Half the paper.'],['Same proportions.'],
];
const captions=validateAdaptiveCaptionPlan({schemaVersion:2,id:'caption-plan.paper-half-shape.v1',revision:1,status:'review-required',creativeDirection:bind(direction),approvedScriptSha256:sha256Json(asset.script),fps:30,coverage:'complete-narration',visualTreatment:{fontAsset:'@fontsource/manrope@5.3.0/latin-600.css',fontFamily:'Manrope',fontSize:54,fontWeight:600,lineHeight:1.28,foreground:'#173E35',emphasisMethod:'Semantic phrase segmentation; fixed size and weight, no bouncing or word highlights.',backdrop:'Plain cream stage field beneath objects; no moving backplate.',animation:'Four-frame opacity entrance/exit; fixed glyph positions.',rendererId:'renderer.paper-phrases.v1',rationale:'Quiet large sentence-case print beneath the geometrical proof, with natural phrases and all qualifications.'},cues:narration.cues.map((n,i)=>({id:`paper-caption-${i+1}`,sourceNarrationCueId:n.id,startFrame:Math.round(n.start*30),endFrame:Math.round((n.start+n.duration)*30),lines:lines[i],bounds:{x:120,y:1380,width:750,height:180},presentationIntent:'Keep words clear beneath the paper; leave operation pauses uncaptained.'}))},narration.cues,narration.format,direction,asset);
mkdirSync('src/captions/plans',{recursive:true});
writeFileSync('src/captions/plans/paper.json',JSON.stringify(captions,null,2)+'\n',{flag:'wx'});
const rights={enteredAt:new Date().toISOString(),visuals:'Original Magnivis SVG/CSS construction; ideal dimensions computed, no protected figures/images/footage embedded.',font:{package:'@fontsource/manrope',version:'5.3.0',license:'SIL OFL 1.1',source:'https://github.com/sharanda/manrope',files:['node_modules/@fontsource/manrope/files/manrope-latin-600-normal.woff2','node_modules/@fontsource/manrope/files/manrope-latin-400-normal.woff2'].map(path=>({path,sha256:mediaHash(path)})),licenseSha256:mediaHash('node_modules/@fontsource/manrope/LICENSE')},narration:{provider:'kokoro-local',model:narration.provenance.modelId,voice:'af_heart',license:'Apache-2.0; established repository license evidence in docs/ASSET-LICENSES.md; no cloning.',cacheDisposition:'Disposable model cache; exact generated clips retained.'},sound:'No music, ambience or sampled effects; narration and silence only.',sourceFigures:'Consulted only, never production assets.',approvalScope:'none'};
writeFileSync(`${base}/rights-provenance.json`,JSON.stringify(rights,null,2)+'\n',{flag:'wx'});
writeFileSync(`${base}/Manrope-OFL.txt`,readFileSync('node_modules/@fontsource/manrope/LICENSE'),{flag:'wx'});
const vtt='WEBVTT\n\n'+captions.cues.map((c,i)=>{
 const stamp=(f:number)=>{const ms=Math.round(f/30*1000);return `${String(Math.floor(ms/3600000)).padStart(2,'0')}:${String(Math.floor(ms/60000)%60).padStart(2,'0')}:${String(Math.floor(ms/1000)%60).padStart(2,'0')}.${String(ms%1000).padStart(3,'0')}`;};
 return `${i+1}\n${stamp(c.startFrame)} --> ${stamp(c.endFrame)}\n${c.lines.join('\n')}\n`;
}).join('\n');
writeFileSync('captions/paper-half-shape.en.vtt',vtt,{flag:'wx'});
const plan=validateInternalProductionPlanReferences({schemaVersion:1,id:'production-plan.paper-half-shape.v1',revision:1,status:'implementation-ready',knowledgePackage:bind(pkg),contentAsset:bind(asset),internalEditorialAuthority:pkg.approval!.authority,presentationProfiles:['youtube','tiktok','instagram','facebook'].map(p=>({path:`${base}/profiles/${p}.json`,sha256:mediaHash(`${base}/profiles/${p}.json`)})),approvedScriptSha256:sha256Json(asset.script),creativeDirection:bind(direction),executionPolicy:defaultExecutionPolicy(),excludedClaimIds:[`${pkg.id}.claim.universal`],format:narration.format,safeAreaProfileId:'safe-area.youtube-shorts.v2',beats:asset.visualPlan.map((v,i)=>{const cue=narration.cues.find(n=>n.beatIndex===i)!;const next=narration.cues.find(n=>n.beatIndex===i+1);return {id:`paper.production.${i+1}`,sourceVisualPlanId:v.id,narrativeBeatId:v.narrativeBeatId,scriptSegmentIds:v.scriptSegmentIds,claimIds:v.claimIds,frames:{start:i===0?0:Math.round(cue.start*30),end:next?Math.round(next.start*30):narration.durationFrames},sceneType:['paper-halving','square-counterexample','diagonal-construction','edge-correspondence','uniform-layout-scaling','length-area-contrast','nominal-rounding','paper-payoff'][i],objective:v.objective,onScreenText:[],animationIntent:'Geometry-driven transformations with continuous visible edge tracking; no arbitrary shape morph.',transitionIntent:'Clean cut between logical demonstrations; moving paper elements within each proof.',audioIntent:'Measured af_heart narration with authored pauses; no other audio.'};}),assets:[{id:'paper.original-geometry',kind:'procedural-visual',provenance:{origin:'Original Magnivis code',rights:'Project-owned original artwork',notes:'No third-party figures or stock imagery.',evidence:`${base}/rights-provenance.json`}},{id:'paper.manrope',kind:'font',provenance:{origin:'Mikhail Sharanda / fontsource pinned package',rights:'SIL OFL 1.1',notes:'Existing installed font selected for readable print execution; unmodified.',evidence:`${base}/Manrope-OFL.txt`}},{id:'paper.narration',kind:'audio',path:'public/audio/paper/narration',provenance:{origin:'Local Kokoro af_heart from internally reviewed script',rights:'Project output under established Apache-2.0 model terms',notes:'No voice cloning or paid calls.',evidence:'src/production/narration/paper.json'}}],captions:{file:'captions/paper-half-shape.en.vtt',captionPlanId:captions.id,captionPlanRevision:1,captionPlanSha256:sha256Json(captions),generatorId:'generator.paper-phrases.v1',generatorVersion:1,source:'approved-narration-cues',designedBurnedIn:true,placement:'optional-platform-track-lower-center'},reviewRequirements:['Technical probe, full decode, typography and exact caption reconstruction.','Actual master and every caption midpoint decoded and inspected.','Inspect proof cut, rotation, ratio correspondence, scale factors and rounding caveat.','Preflight remains provisional local playback geometry; no device/crop pass.','AHMET — MASTER REVIEW required before presentation/publication preparation.']},pkg,asset,direction);
mkdirSync('src/production/plans',{recursive:true});
writeFileSync('src/production/plans/paper.json',JSON.stringify(plan,null,2)+'\n',{flag:'wx'});
console.log(`Prepared ${narration.durationFrames} frames, ${captions.cues.length} captions, eight beats.`);
