import console from 'node:console';
import {existsSync, mkdirSync, readFileSync, writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {createLocalNarrator, modelId} from '../src/ai/providers/kokoro-local.mjs';
const base='content-intelligence/cycles/cycle-5';
const asset=JSON.parse(readFileSync(`${base}/content-asset.ready.json`,'utf8'));
const output='src/production/narration/chladni.json';
if(existsSync(output))throw new Error('Preserve prior measured narration; revisions require a new identity.');
const parts=[
 ['These patterns are drawn by vibration.',0],
 ['Scatter sand on a metal plate,',1],['then make it vibrate at a resonant frequency.',1],
 ['The moving regions bounce the grains away.',2],
 ['But some lines stay still.',3],["They're called nodes.",3],
 ['Sand gathers there,',4],["tracing the plate's pattern of motion.",4],
 ['Change to a different vibration mode,',5],['and a different pattern can appear.',5],
 ['The shape also depends on the plate',6],["and how it's held.",6],
 ["So the sand isn't showing",7],['where the plate moves most.',7],
 ["It's revealing where it doesn't move.",7],
];
if(parts.map(p=>p[0]).join(' ')!==asset.script.segments.map(s=>s.text).join(' '))throw new Error('Script reconstruction failed.');
const narrator=await createLocalNarrator();
const cues=[];let frame=0;
const gaps=[0.8,0.12,0.6,0.35,0.22,0.45,0.14,0.5,0.24,0.75,0.18,0.45,0.10,0.24,1.0];
mkdirSync('public/audio/chladni/narration',{recursive:true});
for(const [i,[transcript,beatIndex]] of parts.entries()){
 const file=`audio/chladni/narration/cue-${i+1}.wav`;
 if(existsSync(`public/${file}`))throw new Error('Do not overwrite generated audio.');
 const result=await narrator.generate(transcript,{voice:'af_heart',speed:0.97});
 await result.save(`public/${file}`);
 const duration=result.audio.length/result.sampling_rate;
 cues.push({id:`chladni-cue-${i+1}`,transcript,file,start:frame/30,duration,beatIndex,sourceScriptSegmentId:asset.script.segments[beatIndex].id,samples:result.audio.length,sampleRate:result.sampling_rate});
 frame+=Math.ceil(duration*30)+Math.round(gaps[i]*30);
 console.log(`Cue ${i+1}: ${duration.toFixed(3)}s`);
}
const canonical=v=>Array.isArray(v)?v.map(canonical):v&&typeof v==='object'?Object.fromEntries(Object.entries(v).sort(([a],[b])=>a.localeCompare(b)).map(([k,x])=>[k,canonical(x)])):v;
const hash=p=>createHash('sha256').update(readFileSync(p)).digest('hex');
mkdirSync('src/production/narration',{recursive:true});
writeFileSync(output,JSON.stringify({schemaVersion:1,cues,durationFrames:frame,format:{width:1080,height:1920,fps:30,durationSeconds:frame/30},measuredNarrationSeconds:cues.reduce((s,c)=>s+c.duration,0),provenance:{provider:'kokoro-local',modelId,voiceId:'af_heart',speed:0.97,generatedAt:new Date().toISOString(),approvedScriptSha256:createHash('sha256').update(JSON.stringify(canonical(asset.script))).digest('hex'),cueArtifacts:cues.map(c=>({id:c.id,sha256:hash(`public/${c.file}`)}))}},null,2)+'\n',{flag:'wx'});
console.log(`Timeline: ${frame/30}s`);
