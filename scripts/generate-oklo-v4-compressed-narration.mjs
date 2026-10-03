import console from 'node:console';
import {existsSync, mkdirSync, readFileSync, writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {createRequire} from 'node:module';
import {execFileSync} from 'node:child_process';
const ffprobe=createRequire(import.meta.url)('ffprobe-static').path;
import {createLocalNarrator, modelId} from '../src/ai/providers/kokoro-local.mjs';
const base='content-intelligence/cycles/cycle-8/editorial-revision-v4/compression-pass-2';
const asset=JSON.parse(readFileSync(`${base}/content-asset.ready.json`,'utf8'));
const output='src/production/narration/oklo-v4-r2.json';
if(existsSync(output))throw new Error('Preserve prior measured narration; revisions require a new identity.');
const parts=asset.script.segments.map((s,i)=>[s.text,i]);
if(parts.map(p=>p[0]).join(' ')!==asset.script.segments.map(s=>s.text).join(' '))throw new Error('Script reconstruction failed.');
const narrator=await createLocalNarrator();
const cues=[];let frame=0;
const gaps=parts.map((_,i)=>[0,2,6].includes(i)?.30:.16);
mkdirSync('public/audio/oklo-v4-r2/narration',{recursive:true});
for(const [i,[transcript,beatIndex]] of parts.entries()){
 const file=`audio/oklo-v4-r2/narration/cue-${i+1}.wav`;
 let duration,sampleRate,samples;
 if(existsSync(`public/${file}`)){
  const p=JSON.parse(execFileSync(ffprobe,['-v','error','-show_format','-show_streams','-of','json',`public/${file}`]));duration=Number(p.format.duration);sampleRate=Number(p.streams[0].sample_rate);samples=Math.round(duration*sampleRate);
 }else{
  const result=await narrator.generate(transcript,{voice:'af_heart',speed:0.97});await result.save(`public/${file}`);sampleRate=result.sampling_rate;samples=result.audio.length;duration=samples/sampleRate;
 }
 cues.push({id:`oklo-v4-r2-cue-${i+1}`,transcript,file,start:frame/30,duration,beatIndex,sourceScriptSegmentId:asset.script.segments[beatIndex].id,samples,sampleRate});
 frame+=Math.ceil(duration*30)+Math.round(gaps[i]*30);
 console.log(`Cue ${i+1}: ${duration.toFixed(3)}s`);
}
const canonical=v=>Array.isArray(v)?v.map(canonical):v&&typeof v==='object'?Object.fromEntries(Object.entries(v).sort(([a],[b])=>a.localeCompare(b)).map(([k,x])=>[k,canonical(x)])):v;
const hash=p=>createHash('sha256').update(readFileSync(p)).digest('hex');
mkdirSync('src/production/narration',{recursive:true});
writeFileSync(output,JSON.stringify({schemaVersion:1,cues,durationFrames:frame,format:{width:1080,height:1920,fps:30,durationSeconds:frame/30},measuredNarrationSeconds:cues.reduce((s,c)=>s+c.duration,0),provenance:{provider:'kokoro-local',modelId,voiceId:'af_heart',speed:0.97,generatedAt:new Date().toISOString(),approvedScriptSha256:createHash('sha256').update(JSON.stringify(canonical(asset.script))).digest('hex'),cueArtifacts:cues.map(c=>({id:c.id,sha256:hash(`public/${c.file}`)}))}},null,2)+'\n',{flag:'wx'});
console.log(`Timeline: ${frame/30}s`);
