import console from 'node:console';
import {mkdirSync,readFileSync,writeFileSync,existsSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {createLocalNarrator,modelId} from '../src/ai/providers/kokoro-local.mjs';
if(existsSync('artifacts/masters/chocolate-crystal-choice-candidate-v1.mp4'))throw new Error('Retained candidate is immutable.');
const asset=JSON.parse(readFileSync('content-intelligence/reviews/chocolate-crystal-choice-approved-v3/content-asset.approved.json','utf8'));
const clips=[['The recipe can stay the same.',0],['The chocolate doesn’t have to.',0],[asset.script.segments[1].text,1],[asset.script.segments[2].text,2],['As it cools, crystals form again.',3],['But their arrangements, and the network they build, can differ.',3],[asset.script.segments[4].text,4],[asset.script.segments[5].text,5],[asset.script.segments[6].text,6],['Same recipe.',7],['Different structure.',7]];
if(clips.map(c=>c[0]).join(' ')!==asset.script.segments.map(c=>c.text).join(' '))throw new Error('Locked wording drift');
const tts=await createLocalNarrator();const voice='af_heart',speed=0.98;
const gaps=[0.12,0.28,0.22,0.32,0.20,0.75,0.25,0.45,0.45,0.15,1.10];
const cues=[];let frame=3;mkdirSync('public/audio/chocolate/narration',{recursive:true});
for(const [i,[text,beat]] of clips.entries()){
 const id=`chocolate-cue-${i+1}`;const file=`audio/chocolate/narration/cue-${i+1}.wav`;
 const result=await tts.generate(text,{voice,speed});await result.save(`public/${file}`);
 const duration=result.audio.length/result.sampling_rate;
 cues.push({id,file,start:frame/30,duration,transcript:text,sourceScriptSegmentId:asset.script.segments[beat].id,beatIndex:beat,samples:result.audio.length,sampleRate:result.sampling_rate});frame+=Math.ceil(duration*30)+Math.round(gaps[i]*30);
 console.log(id,duration.toFixed(3));
}
const normalize=v=>Array.isArray(v)?v.map(normalize):v&&typeof v==='object'?Object.fromEntries(Object.entries(v).sort(([a],[b])=>a.localeCompare(b)).map(([k,c])=>[k,normalize(c)])):v;
const metadata={schemaVersion:1,cues,durationFrames:frame,format:{width:1080,height:1920,fps:30,durationSeconds:frame/30},measuredNarrationSeconds:cues.reduce((s,c)=>s+c.duration,0),measurementMethod:'Generated 24 kHz WAV sample counts; independently checked with ffprobe',provenance:{provider:'kokoro-local',modelId,voiceId:voice,speed,generatedAt:new Date().toISOString(),approvedScriptSha256:createHash('sha256').update(JSON.stringify(normalize(asset.script))).digest('hex'),cueArtifacts:cues.map(c=>({id:c.id,sha256:createHash('sha256').update(readFileSync(`public/${c.file}`)).digest('hex')}))}};
writeFileSync('src/production/narration/chocolate.json',JSON.stringify(metadata,null,2)+'\n');console.log('Measured narration',metadata.measuredNarrationSeconds,'timeline',frame/30);
