import console from 'node:console';
import {existsSync, mkdirSync, readFileSync, writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {createRequire} from 'node:module';
import {execFileSync} from 'node:child_process';
const ffprobe=createRequire(import.meta.url)('ffprobe-static').path;
import {createLocalNarrator, modelId, generateWithGrenadaPronunciation} from '../src/ai/providers/kokoro-local.mjs';
const base='content-intelligence/cycles/cycle-23';
const asset=JSON.parse(readFileSync(`${base}/content-asset.ready.json`,'utf8'));
const output='src/production/narration/yamaguchi-two-bombs.json';
if(existsSync(output))throw new Error('Preserve prior measured narration; revisions require a new identity.');
const parts=asset.script.segments.map((s,i)=>[s.text,i]);
if(parts.map(p=>p[0]).join(' ')!==asset.script.segments.map(s=>s.text).join(' '))throw new Error('Script reconstruction failed.');
const narrator=await createLocalNarrator();
const cues=[];let frame=0;
const gaps=parts.map((_,i)=>[3,4,5,6,8,10,12].includes(i)?.36:.16);
mkdirSync('public/audio/yamaguchi-two-bombs/narration',{recursive:true});
for(const [i,[transcript,beatIndex]] of parts.entries()){
 const file=`audio/yamaguchi-two-bombs/narration/cue-${i+1}.wav`;
 let duration,sampleRate,samples;
 if(existsSync(`public/${file}`)){
  const p=JSON.parse(execFileSync(ffprobe,['-v','error','-show_format','-show_streams','-of','json',`public/${file}`]));duration=Number(p.format.duration);sampleRate=Number(p.streams[0].sample_rate);samples=Math.round(duration*sampleRate);
 }else{
  let result;
  if(i===1){const r=await generateWithGrenadaPronunciation(narrator,transcript,(_text,before)=>{const old='tsˈuːɾəmˌuː jˌæmɐɡˈʌtʃi';if(!before.includes(old))throw new Error('Unexpected name normalization');return {phonemes:before.replace(old,'tsˈuːtoʊmˌuː jˌɑːmɑːɡˈuːtʃi'),occurrences:[]};},{voice:'af_heart',speed:1});result=r.audio;}else result=await narrator.generate(transcript,{voice:'af_heart',speed:1});
  await result.save(`public/${file}`);sampleRate=result.sampling_rate;samples=result.audio.length;duration=samples/sampleRate;
  if(i===1){execFileSync(createRequire(import.meta.url)('ffmpeg-static'),['-y','-v','error','-i',`public/${file}`,'-af','atrim=end=4.45,asetpts=PTS-STARTPTS','-c:a','pcm_s16le','/tmp/magnivis-yamaguchi-name-trim.wav']);const {copyFileSync}=await import('node:fs');copyFileSync('/tmp/magnivis-yamaguchi-name-trim.wav',`public/${file}`);duration=4.45;samples=106800;}
 }
 cues.push({id:`yamaguchi-two-bombs-cue-${i+1}`,transcript,file,start:frame/30,duration,beatIndex,sourceScriptSegmentId:asset.script.segments[beatIndex].id,samples,sampleRate});
 frame+=Math.ceil(duration*30)+Math.round(gaps[i]*30);
 if(i===4)frame+=75; // Deliberate picture-only travel pause, no stretched speech.
 console.log(`Cue ${i+1}: ${duration.toFixed(3)}s`);
}
const canonical=v=>Array.isArray(v)?v.map(canonical):v&&typeof v==='object'?Object.fromEntries(Object.entries(v).sort(([a],[b])=>a.localeCompare(b)).map(([k,x])=>[k,canonical(x)])):v;
const hash=p=>createHash('sha256').update(readFileSync(p)).digest('hex');
mkdirSync('src/production/narration',{recursive:true});
writeFileSync(output,JSON.stringify({schemaVersion:1,cues,durationFrames:frame,format:{width:1080,height:1920,fps:30,durationSeconds:frame/30},measuredNarrationSeconds:cues.reduce((s,c)=>s+c.duration,0),provenance:{provider:'kokoro-local',modelId,voiceId:'af_heart',speed:1.0,generatedAt:new Date().toISOString(),approvedScriptSha256:createHash('sha256').update(JSON.stringify(canonical(asset.script))).digest('hex'),cueArtifacts:cues.map(c=>({id:c.id,sha256:hash(`public/${c.file}`)}))}},null,2)+'\n',{flag:'wx'});
console.log(`Timeline: ${frame/30}s`);
