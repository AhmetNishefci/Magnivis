import console from 'node:console';
import {existsSync, mkdirSync, readFileSync, writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {createLocalNarrator, modelId} from '../src/ai/providers/kokoro-local.mjs';
const base='content-intelligence/cycles/cycle-4';
const asset=JSON.parse(readFileSync(`${base}/content-asset.ready.json`,'utf8'));
const output='src/production/narration/paper.json';
if(existsSync(output))throw new Error('Preserve prior measured narration; revisions require a new identity.');
const parts=[
 ['Cut A4 paper in half.',0],['Turn it.',0],['It’s almost the same shape, only smaller.',0],
 ['A square cannot do that.',1],['Halve it, and you get a skinny rectangle.',1],
 ['A-series paper is built around a special ratio:',2],['one to the square root of two.',2],
 ['Halve the long side,',3],['then rotate the piece.',3],['That ratio comes back.',3],
 ['In the ideal system,',4],['an A3 design shrinks to A4 without stretching.',4],
 ['Each length shrinks to about seventy-one percent.',5],['The area halves.',5],
 ['Real paper sizes are rounded to whole millimetres.',6],['The perfect rule lives in the geometry.',6],
 ['Half the paper.',7],['Same proportions.',7],
];
if(parts.map(p=>p[0]).join(' ')!==asset.script.segments.map(s=>s.text).join(' '))throw new Error('Script reconstruction failed.');
const narrator=await createLocalNarrator();
const cues=[];let frame=3;
const gaps=[0.24,0.36,0.35,0.28,0.35,0.18,0.50,0.20,0.38,0.45,0.14,0.4,0.32,0.5,0.30,0.5,0.28,1.2];
mkdirSync('public/audio/paper/narration',{recursive:true});
for(const [i,[transcript,beatIndex]] of parts.entries()){
 const file=`audio/paper/narration/cue-${i+1}.wav`;
 if(existsSync(`public/${file}`))throw new Error('Do not overwrite generated audio.');
 const result=await narrator.generate(transcript,{voice:'af_heart',speed:0.96});
 await result.save(`public/${file}`);
 const duration=result.audio.length/result.sampling_rate;
 cues.push({id:`paper-cue-${i+1}`,transcript,file,start:frame/30,duration,beatIndex,sourceScriptSegmentId:asset.script.segments[beatIndex].id,samples:result.audio.length,sampleRate:result.sampling_rate});
 frame+=Math.ceil(duration*30)+Math.round(gaps[i]*30);
 console.log(`Cue ${i+1}: ${duration.toFixed(3)}s`);
}
const canonical=v=>Array.isArray(v)?v.map(canonical):v&&typeof v==='object'?Object.fromEntries(Object.entries(v).sort(([a],[b])=>a.localeCompare(b)).map(([k,x])=>[k,canonical(x)])):v;
const hash=p=>createHash('sha256').update(readFileSync(p)).digest('hex');
mkdirSync('src/production/narration',{recursive:true});
writeFileSync(output,JSON.stringify({schemaVersion:1,cues,durationFrames:frame,format:{width:1080,height:1920,fps:30,durationSeconds:frame/30},measuredNarrationSeconds:cues.reduce((s,c)=>s+c.duration,0),provenance:{provider:'kokoro-local',modelId,voiceId:'af_heart',speed:0.96,generatedAt:new Date().toISOString(),approvedScriptSha256:createHash('sha256').update(JSON.stringify(canonical(asset.script))).digest('hex'),cueArtifacts:cues.map(c=>({id:c.id,sha256:hash(`public/${c.file}`)}))}},null,2)+'\n',{flag:'wx'});
console.log(`Timeline: ${frame/30}s`);
