import {readFileSync,writeFileSync,mkdirSync,existsSync} from 'node:fs';
import {stableJson,sha256Json} from '../src/content-intelligence/run-schema';
import {knowledgePackageSchema} from '../src/knowledge/schema';
import {contentAssetSchema} from '../src/content-assets/schema';
import {creativeDirectionSchema} from '../src/content-assets/creative-direction';
import {adaptiveCaptionPlanSchema,validateAdaptiveCaptionPlan} from '../src/captions/adaptive-plan';
import {productionPlanSchema,validateProductionPlanReferences} from '../src/production/schema';
import metadata from '../src/production/narration/longitude-clock.json';
if(existsSync('artifacts/masters/longitude-clock-candidate-v1.mp4'))throw new Error('Preserve retained candidate inputs; new revision needs explicit authorization.');
const read=(p:string):unknown=>JSON.parse(readFileSync(p,'utf8'));
const pkg=knowledgePackageSchema.parse(read('content-intelligence/reviews/longitude-clock-approved-v3/knowledge-package.approved.json'));
const asset=contentAssetSchema.parse(read('content-intelligence/reviews/longitude-clock-approved-v3/content-asset.approved.json'));
const direction=creativeDirectionSchema.parse(read('content-intelligence/creative-directions/longitude-clock-time-to-position-approved-v2/direction.json'));
const owner=read('content-intelligence/creative-directions/longitude-clock-time-to-position-approved-v2/owner-decision.json') as {id:string;revision:number};
const ref=(v:{id:string;revision:number})=>({id:v.id,revision:v.revision,sha256:sha256Json(v)});
const phrases=[['How can a clock tell','a ship where it is?'],['By keeping the time','at a known reference point.'],['Sailors use the Sun','to find local time,','corrected to match','the clock’s timekeeping.'],['Compare them','at the same moment.'],['Earth’s turning links','that time difference to longitude:','fifteen degrees per hour.'],['Twelve at the reference.','Two in the afternoon locally.'],['Two hours ahead.','Thirty degrees east.'],['Harrison’s H4 helped demonstrate','accurate timekeeping at sea.'],['Other astronomical methods','remained useful too.'],['The clock carries time.','Observation and calculation','reveal longitude.']];
const lines=(text:string)=>{
 if(text.length<=29)return [text];
 const words=text.split(' ');let split=1;
 for(let i=1;i<words.length;i++)if(Math.abs(words.slice(0,i).join(' ').length-words.slice(i).join(' ').length)<Math.abs(words.slice(0,split).join(' ').length-words.slice(split).join(' ').length))split=i;
 return [words.slice(0,split).join(' '),words.slice(split).join(' ')];
};
// Boundaries derive from measured WAV span and snap to nearby low-energy gaps.
// They remain authored estimates within measured cues, not fabricated forced alignment.
const phraseRanges=metadata.cues.flatMap((cue,i)=>{
 const wav=readFileSync(`public/${cue.file}`);const dataAt=wav.indexOf(Buffer.from('data'));const samples=wav.subarray(dataAt+8);
 // Kokoro RawAudio saves float WAV. Use header format rather than assuming PCM16.
 const fmtAt=wav.indexOf(Buffer.from('fmt '));const format=wav.readUInt16LE(fmtAt+8);const bits=wav.readUInt16LE(fmtAt+22);const sampleRate=wav.readUInt32LE(fmtAt+12);
 const sampleBytes=bits/8;const sampleCount=samples.length/sampleBytes;
 const rms=(at:number)=>{let sum=0,n=0;for(let j=Math.max(0,Math.round(at*sampleRate));j<Math.min(sampleCount,Math.round((at+0.03)*sampleRate));j++) {const v=format===3?samples.readFloatLE(j*sampleBytes):samples.readInt16LE(j*sampleBytes)/32768;sum+=v*v;n++;}return n?Math.sqrt(sum/n):1;};
 const texts=phrases[i]!;if(texts.join(' ')!==cue.transcript)throw new Error('Caption words changed');
 const weights=texts.map(t=>t.split(' ').length),total=weights.reduce((a,b)=>a+b,0);let before=0,last=Math.round(cue.start*30);
 return texts.map((text,k)=>{
  before+=weights[k]!;let end=Math.round((cue.start+cue.duration)*30);
  if(k<texts.length-1){const target=cue.duration*before/total;let best=target,energy=Infinity;
   for(let t=Math.max(0.25,target-0.22);t<Math.min(cue.duration-0.2,target+0.22);t+=1/30){const score=rms(t)+Math.abs(t-target)*0.02;if(score<energy){energy=score;best=t;}}
   end=Math.max(last+8,Math.round((cue.start+best)*30));
  }
  const c={id:`longitude-caption.${i+1}.${k+1}`,sourceNarrationCueId:cue.id,startFrame:last,endFrame:end,lines:lines(text),bounds:{x:140,y:1450,width:710,height:132},presentationIntent:'Narration-faithful phrase in its own quiet ivory field; full wording and meaningful punctuation. Authored within measured WAV, boundary snapped to low-energy gap; requires owner listening review.'};last=end;return c;
 });
});
const caption=adaptiveCaptionPlanSchema.parse({schemaVersion:2,id:'caption-plan.longitude-clock.v2',revision:1,status:'review-required',creativeDirection:ref(direction),approvedScriptSha256:sha256Json(asset.script),fps:30,coverage:'complete-narration',visualTreatment:{fontAsset:'public/fonts/longitude-clock/SourceSans3-Semibold.otf',fontFamily:'Longitude Source Sans',fontSize:48,fontWeight:600,lineHeight:1.15,foreground:'#322D3A',emphasisMethod:'Phrase weight and stable hold; no per-word bounce or ice/gold treatment.',backdrop:'Quiet matte ivory caption field, separate from diagram labels.',animation:'Restrained opacity onset; no slide or scaling.',rendererId:'caption-renderer.object-theatre.v2',rationale:'Reading rhythm supports the causal proof. Numeric notation belongs to spatial labels; captions preserve exact spoken wording.'},cues:phraseRanges});
validateAdaptiveCaptionPlan(caption,metadata.cues,{width:1080,height:1920},direction,asset);
mkdirSync('src/production/plans',{recursive:true});mkdirSync('src/captions/plans',{recursive:true});
writeFileSync('src/captions/plans/longitude-clock.json',stableJson(caption,2)+'\n');
const beatNames=['object-question','reference-time','solar-correction','same-instant','rotation-link','paired-readings','east-proof','h-four-watch','complementary-methods','causal-payoff'];
const assets=[
 {id:'longitude-clock.visual.object-theatre',kind:'original-vector',path:'src/components/LongitudeObjects.tsx',origin:'Original SVG/2.5D procedural construction',rights:'Magnivis original',notes:'Original ship, ocean, Sun/observation cards, globe and simplified H4. No imported photograph.',evidence:'content-intelligence/reviews/longitude-clock-production-v1/h4-reference.json'},
 ...['SourceSerif4-Regular.otf','SourceSans3-Regular.otf','SourceSans3-Semibold.otf'].map((name,i)=>({id:`longitude-clock.font.${i+1}`,kind:'licensed-font',path:`public/fonts/longitude-clock/${name}`,origin:'Adobe official repository, pinned release commit',rights:'SIL Open Font License 1.1',notes:'Bundled exact font and license; no operating-system fallback.',evidence:'public/fonts/longitude-clock/provenance.json'})),
 ...metadata.cues.map((c,i)=>({id:`longitude-clock.audio.${i+1}`,kind:'narration',path:`public/${c.file}`,origin:'Kokoro local CPU, bf_emma, exact locked script',rights:'Apache-2.0 model; provenance and exact weights/voice hashes retained',notes:'No cloning or historical voice imitation.',evidence:'src/production/narration/longitude-clock.json'})),
 {id:'longitude-clock.soundscape',kind:'original-audio',path:'public/audio/longitude-clock/soundscape.wav',origin:'Seeded original synthesis',rights:'Magnivis original',notes:'No music; ocean texture and sparse taps. Silent comparison/proof.',evidence:'src/production/narration/longitude-clock-soundscape.json'},
];
const plan=productionPlanSchema.parse({schemaVersion:1,id:'production-plan.longitude-clock.v1',revision:1,status:'implementation-ready',knowledgePackage:ref(pkg),contentAsset:ref(asset),ownerDecision:ref(owner),approvedScriptSha256:sha256Json(asset.script),creativeDirection:ref(direction),excludedClaimIds:pkg.claims.filter(c=>!asset.selectedClaimIds.includes(c.id)).map(c=>c.id),format:metadata.format,safeAreaProfileId:'safe-area.youtube-shorts.v2',beats:asset.visualPlan.map((v,i)=>({id:`longitude-clock.production.beat.${i+1}`,sourceVisualPlanId:v.id,narrativeBeatId:v.narrativeBeatId,scriptSegmentIds:v.scriptSegmentIds,claimIds:v.claimIds,frames:{start:i===0?0:Math.round(metadata.cues[i]!.start*30),end:i===9?metadata.durationFrames:Math.round(metadata.cues[i+1]!.start*30)},sceneType:beatNames[i],objective:v.objective,onScreenText:[{text:['REFERENCE TIME ≠ POSITION','REFERENCE TIME','OBSERVATION → CORRECTION → LOCAL MEAN TIME','BOTH MEAN SOLAR TIME · SAME INSTANT','15° PER HOUR','REFERENCE 12:00 | LOCAL 14:00','+2 HOURS → 30° EAST','H4 · LARGE LONGITUDE WATCH','ASTRONOMICAL METHODS REMAIN USEFUL','TIME + OBSERVATION + CALCULATION → LONGITUDE'][i]!,claimIds:v.claimIds}],animationIntent:'One leading transformation at a time within continuous matte workbench; stable reference/local roles. Plan-view proof uses positive east counterclockwise.',transitionIntent:'Motivated object continuity, restrained opacity transitions; no inherited scene-window or constant camera zoom.',audioIntent:'Exact measured narration; original low ambience only in context, silence under correction/comparison/proof.'})),assets:assets.map(a=>({id:a.id,kind:a.kind,path:a.path,provenance:{origin:a.origin,rights:a.rights,notes:a.notes,evidence:a.evidence}})),captions:{file:'captions/longitude-clock.en.vtt',captionPlanId:caption.id,captionPlanRevision:caption.revision,captionPlanSha256:sha256Json(caption),generatorId:'caption-generator.longitude-clock.v2',generatorVersion:1,source:'approved-narration-cues',designedBurnedIn:true,placement:'optional-platform-track-lower-center'},reviewRequirements:['Ahmet owner master visual and listening review of exact MP4; no approval inferred.','Same instant and mean-solar-time correction must remain readable.','North-pole east sign and angular span must be correct; longitude only.','H4 must remain watch-form, original explanatory reconstruction.','All captions and phone-size labels must fit; native UI/caption geometry remains incomplete.','Independent decoded-media/audio checks and exact durable artifact hashes.']});
validateProductionPlanReferences(plan,pkg,asset,direction);writeFileSync('src/production/plans/longitude-clock.json',stableJson(plan,2)+'\n');
const time=(f:number)=>{const ms=Math.round(f/30*1000);return `${String(Math.floor(ms/3600000)).padStart(2,'0')}:${String(Math.floor(ms/60000)%60).padStart(2,'0')}:${String(Math.floor(ms/1000)%60).padStart(2,'0')}.${String(ms%1000).padStart(3,'0')}`;};
writeFileSync('captions/longitude-clock.en.vtt','WEBVTT\n\n'+caption.cues.map(c=>`${c.id}\n${time(c.startFrame)} --> ${time(c.endFrame)}\n${c.lines.join('\n')}\n`).join('\n'));
console.log({captionCues:caption.cues.length,frames:metadata.durationFrames,seconds:metadata.format.durationSeconds});
// Keep schema JSON deterministic without touching any historical artifact.
for(const p of ['src/production/narration/longitude-clock.json','src/production/narration/longitude-clock-soundscape.json'])writeFileSync(p,stableJson(read(p),2)+'\n');
