import {readFileSync,writeFileSync,mkdirSync,existsSync} from 'node:fs';
import {stableJson,sha256Json} from '../src/content-intelligence/run-schema';
import {knowledgePackageSchema} from '../src/knowledge/schema';
import {contentAssetSchema} from '../src/content-assets/schema';
import {creativeDirectionSchema} from '../src/content-assets/creative-direction';
import {adaptiveCaptionPlanSchema,validateAdaptiveCaptionPlan} from '../src/captions/adaptive-plan';
import {productionPlanSchema,validateProductionPlanReferences} from '../src/production/schema';
import metadata from '../src/production/narration/longitude-clock-v2.json';
import {defaultExecutionPolicy} from '../src/design/brand-execution-policy';
if(existsSync('artifacts/masters/longitude-clock-candidate-v2.mp4'))throw new Error('Preserve retained candidate inputs; new revision needs explicit authorization.');
const read=(p:string):unknown=>JSON.parse(readFileSync(p,'utf8'));
const pkg=knowledgePackageSchema.parse(read('content-intelligence/reviews/longitude-clock-approved-v3/knowledge-package.approved.json'));
const asset=contentAssetSchema.parse(read('content-intelligence/reviews/longitude-clock-approved-v3/content-asset.approved.json'));
const direction=creativeDirectionSchema.parse(read('content-intelligence/reviews/longitude-clock-production-v2/creative-direction.revision-3.json'));
const owner=read('content-intelligence/reviews/longitude-clock-production-v2/owner-decision.json') as {id:string;revision:number};
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
const caption=adaptiveCaptionPlanSchema.parse({schemaVersion:2,id:'caption-plan.longitude-clock.v2',revision:2,status:'review-required',creativeDirection:ref(direction),approvedScriptSha256:sha256Json(asset.script),fps:30,coverage:'complete-narration',visualTreatment:{fontAsset:'public/fonts/longitude-clock/SourceSans3-Semibold.otf',fontFamily:'Longitude Source Sans',fontSize:48,fontWeight:600,lineHeight:1.15,foreground:'#322D3A',emphasisMethod:'Phrase weight and stable hold; no per-word bounce or ice/gold treatment.',backdrop:'Quiet matte ivory caption field, separate from diagram labels.',animation:'Restrained opacity onset; no slide or scaling.',rendererId:'caption-renderer.object-theatre.v2',rationale:'Reading rhythm supports the causal proof. Numeric notation belongs to spatial labels; captions preserve exact spoken wording.'},cues:phraseRanges});
validateAdaptiveCaptionPlan(caption,metadata.cues,{width:1080,height:1920},direction,asset);
mkdirSync('src/production/plans',{recursive:true});mkdirSync('src/captions/plans',{recursive:true});
writeFileSync('src/captions/plans/longitude-clock-v2.json',stableJson(caption,2)+'\n');
const previous=productionPlanSchema.parse(read('src/production/plans/longitude-clock.json'));
const plan=productionPlanSchema.parse({...previous,revision:3,status:'implementation-ready',ownerDecision:ref(owner),creativeDirection:ref(direction),executionPolicy:defaultExecutionPolicy(),format:metadata.format,beats:previous.beats.map((b,i)=>({...b,frames:{start:Math.round(metadata.cues[i]!.start*30),end:i===previous.beats.length-1?metadata.durationFrames:Math.round(metadata.cues[i+1]!.start*30)}})),assets:previous.assets.map(a=>a.kind==='narration'?{...a,path:a.path!.replace('longitude-clock/narration','longitude-clock/v2/narration'),provenance:{...a.provenance,origin:'Kokoro local CPU af_heart, exact locked script',evidence:'src/production/narration/longitude-clock-v2.json'}}:a.kind==='original-audio'?{...a,path:'public/audio/longitude-clock/v2/soundscape.wav',provenance:{...a.provenance,evidence:'src/production/narration/longitude-clock-v2-soundscape.json'}}:a),captions:{...previous.captions,file:'captions/longitude-clock-v2.en.vtt',captionPlanRevision:caption.revision,captionPlanSha256:sha256Json(caption)}});
validateProductionPlanReferences(plan,pkg,asset,direction);writeFileSync('src/production/plans/longitude-clock-v2.json',stableJson(plan,2)+'\n');
const time=(f:number)=>{const ms=Math.round(f/30*1000);return `${String(Math.floor(ms/3600000)).padStart(2,'0')}:${String(Math.floor(ms/60000)%60).padStart(2,'0')}:${String(Math.floor(ms/1000)%60).padStart(2,'0')}.${String(ms%1000).padStart(3,'0')}`;};
writeFileSync('captions/longitude-clock-v2.en.vtt','WEBVTT\n\n'+caption.cues.map(c=>`${c.id}\n${time(c.startFrame)} --> ${time(c.endFrame)}\n${c.lines.join('\n')}\n`).join('\n'));
console.log({captionCues:caption.cues.length,frames:metadata.durationFrames,seconds:metadata.format.durationSeconds});
