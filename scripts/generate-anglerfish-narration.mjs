import process from 'node:process';
import console from 'node:console';
import {existsSync,mkdirSync,readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {createRequire} from 'node:module';
import {execFileSync} from 'node:child_process';
const base='content-intelligence/cycles/cycle-22/production-v1';
const asset=JSON.parse(readFileSync('content-intelligence/cycles/cycle-22/content-asset.ready.json','utf8'));
const output='src/production/narration/anglerfish-fusion.json';
const repair=process.argv.includes('--retime');
if(existsSync(output)&&!repair)throw new Error('Preserve prior narration identity.');
if(repair&&JSON.parse(readFileSync('artifacts/media-catalog.json','utf8')).artifacts.some(a=>a.canonicalPath.startsWith('public/audio/anglerfish-fusion/')))throw new Error('Registered Cycle22 audio is immutable; revisions need new paths and identities.');
const {createLocalNarrator,modelId}=await import('../src/ai/providers/kokoro-local.mjs');
const ffprobe=createRequire(import.meta.url)('ffprobe-static').path,narrator=await createLocalNarrator(),cues=[],phonemes=[];
let frame=0;
mkdirSync('public/audio/anglerfish-fusion/narration',{recursive:true});
for(const [i,segment] of asset.script.segments.entries()){
 const transcript=segment.text,file=`audio/anglerfish-fusion/narration/cue-${i+1}.wav`;
 // Capture public full-context normalization, prove token round-trip and synthesize those exact IDs.
 const capture=Object.create(narrator);capture.generate_from_ids=async ids=>ids;
 let ids=await capture.generate(transcript,{voice:'af_heart',speed:1.04});
 let originalIds=Array.from(ids.data,Number),normalized=narrator.tokenizer.model.convert_ids_to_tokens(originalIds.slice(1,-1)).join('');
 const substitutions=[];
 if(transcript.includes('triplewart')){const before=normalized;normalized=normalized.replace('tɹˈɪpluːˌɔːɹt','tɹˈɪpəlwˌɔːɹt');if(before===normalized)throw new Error('Triplewart pronunciation anchor missing');substitutions.push({before,after:normalized,reason:'Compound triple-wart; avoid a letter-like loo-wart normalization. Exact written script retained.'});}
 const sourceNormalized=narrator.tokenizer.model.convert_ids_to_tokens(originalIds.slice(1,-1)).join('');
 const roundtrip=Array.from(narrator.tokenizer(sourceNormalized,{truncation:true}).input_ids.data,Number);
 if(JSON.stringify(roundtrip)!==JSON.stringify(originalIds))throw new Error('Phoneme round-trip failed');
 phonemes.push({sourceScriptSegmentId:segment.id,text:transcript,phonemes:normalized,tokenRoundtrip:true,substitutions,interpretation:'Input phonemes are inspectable pronunciation evidence, not subjective listening.'});
 if(!existsSync(`public/${file}`)||repair){const audio=await narrator.generate_from_ids(narrator.tokenizer(normalized,{truncation:true}).input_ids,{voice:'af_heart',speed:1.04});await audio.save(`public/${file}`);}
 const probe=JSON.parse(execFileSync(ffprobe,['-v','error','-show_format','-show_streams','-of','json',`public/${file}`]));
 const duration=Number(probe.format.duration),sampleRate=Number(probe.streams[0].sample_rate);
 cues.push({id:`anglerfish-fusion-cue-${i+1}`,transcript,file,start:frame/30,duration,beatIndex:i,sourceScriptSegmentId:segment.id,samples:Math.round(duration*sampleRate),sampleRate});
 const gap=[0.12,0.12,0.12,0.18,0.34,0.18,0.12,0.12,0.12,0.2,0.5][i];
 frame+=Math.ceil(duration*30)+Math.round(gap*30);console.log(`Cue${i+1} ${duration.toFixed(3)}s: ${normalized}`);
}
const canonical=v=>Array.isArray(v)?v.map(canonical):v&&typeof v==='object'?Object.fromEntries(Object.entries(v).sort(([a],[b])=>a.localeCompare(b)).map(([k,x])=>[k,canonical(x)])):v;
const hash=p=>createHash('sha256').update(readFileSync(p)).digest('hex');
writeFileSync(output,JSON.stringify({schemaVersion:1,cues,durationFrames:frame,format:{width:1080,height:1920,fps:30,durationSeconds:frame/30},measuredNarrationSeconds:cues.reduce((s,c)=>s+c.duration,0),provenance:{provider:'kokoro-local',modelId,voiceId:'af_heart',speed:1.04,generatedAt:new Date().toISOString(),approvedScriptSha256:createHash('sha256').update(JSON.stringify(canonical(asset.script))).digest('hex'),cueArtifacts:cues.map(c=>({id:c.id,sha256:hash(`public/${c.file}`)}))}},null,2)+'\n',{flag:repair?'w':'wx'});
writeFileSync(`${base}/phoneme-audit.json`,JSON.stringify({enteredAt:new Date().toISOString(),modelId,voice:'af_heart',units:phonemes,scope:'Exact complete script units with complete-context phoneme capture; input verification does not certify output pronunciation or prosody.'},null,2)+'\n',{flag:repair?'w':'wx'});
console.log(`Timeline ${frame/30}s`);
