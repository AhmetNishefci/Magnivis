import console from 'node:console';
import {existsSync,mkdirSync,readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {createRequire} from 'node:module';
import {execFileSync} from 'node:child_process';
import {createLocalNarrator,modelId} from '../src/ai/providers/kokoro-local.mjs';
const base='content-intelligence/cycles/cycle-14/production-v1';
const asset=JSON.parse(readFileSync('content-intelligence/cycles/cycle-14/revision-v2/content-asset.ready.json','utf8'));
const output='src/production/narration/dice.json';
if(existsSync(output))throw new Error('Preserve prior narration identity.');
const ffprobe=createRequire(import.meta.url)('ffprobe-static').path,narrator=await createLocalNarrator(),cues=[],phonemes=[];
let frame=0;
mkdirSync('public/audio/dice/narration',{recursive:true});
for(const [i,segment] of asset.script.segments.entries()){
 const transcript=segment.text,file=`audio/dice/narration/cue-${i+1}.wav`;
 // Capture public full-context normalization, prove token round-trip and synthesize those exact IDs.
 const capture=Object.create(narrator);capture.generate_from_ids=async ids=>ids;
 const ids=await capture.generate(transcript,{voice:'af_heart',speed:1});
 const originalIds=Array.from(ids.data,Number),normalized=narrator.tokenizer.model.convert_ids_to_tokens(originalIds.slice(1,-1)).join('');
 const roundtrip=Array.from(narrator.tokenizer(normalized,{truncation:true}).input_ids.data,Number);
 if(JSON.stringify(roundtrip)!==JSON.stringify(originalIds))throw new Error('Phoneme round-trip failed');
 phonemes.push({sourceScriptSegmentId:segment.id,text:transcript,phonemes:normalized,tokenRoundtrip:true,substitutions:[],interpretation:'Input phonemes are inspectable pronunciation evidence, not subjective listening.'});
 if(!existsSync(`public/${file}`)){const audio=await narrator.generate_from_ids(ids,{voice:'af_heart',speed:1});await audio.save(`public/${file}`);}
 const probe=JSON.parse(execFileSync(ffprobe,['-v','error','-show_format','-show_streams','-of','json',`public/${file}`]));
 const duration=Number(probe.format.duration),sampleRate=Number(probe.streams[0].sample_rate);
 cues.push({id:`dice-cue-${i+1}`,transcript,file,start:frame/30,duration,beatIndex:i,sourceScriptSegmentId:segment.id,samples:Math.round(duration*sampleRate),sampleRate});
 const gap=[0.8,0.5,0.9,0.8,1.8,1.8,0.4,0.6,1.1][i];
 frame+=Math.ceil(duration*30)+Math.round(gap*30);console.log(`Cue${i+1} ${duration.toFixed(3)}s: ${normalized}`);
}
const canonical=v=>Array.isArray(v)?v.map(canonical):v&&typeof v==='object'?Object.fromEntries(Object.entries(v).sort(([a],[b])=>a.localeCompare(b)).map(([k,x])=>[k,canonical(x)])):v;
const hash=p=>createHash('sha256').update(readFileSync(p)).digest('hex');
writeFileSync(output,JSON.stringify({schemaVersion:1,cues,durationFrames:frame,format:{width:1080,height:1920,fps:30,durationSeconds:frame/30},measuredNarrationSeconds:cues.reduce((s,c)=>s+c.duration,0),provenance:{provider:'kokoro-local',modelId,voiceId:'af_heart',speed:1,generatedAt:new Date().toISOString(),approvedScriptSha256:createHash('sha256').update(JSON.stringify(canonical(asset.script))).digest('hex'),cueArtifacts:cues.map(c=>({id:c.id,sha256:hash(`public/${c.file}`)}))}},null,2)+'\n',{flag:'wx'});
writeFileSync(`${base}/phoneme-audit.json`,JSON.stringify({enteredAt:new Date().toISOString(),modelId,voice:'af_heart',units:phonemes,scope:'Exact complete script units, no phonetic substitutions; input verification does not certify actual output pronunciation or prosody.'},null,2)+'\n',{flag:'wx'});
console.log(`Timeline ${frame/30}s`);
