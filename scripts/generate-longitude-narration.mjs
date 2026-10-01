import console from 'node:console';
import {mkdirSync,readFileSync,writeFileSync,existsSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {createLocalNarrator,modelId} from '../src/ai/providers/kokoro-local.mjs';
const asset=JSON.parse(readFileSync('content-intelligence/reviews/longitude-clock-approved-v3/content-asset.approved.json','utf8'));
if(existsSync('artifacts/masters/longitude-clock-candidate-v1.mp4'))throw new Error('Retained candidate audio is immutable; create a separately authorized revision.');
const tts=await createLocalNarrator();const voice='bf_emma',speed=0.92;
const gaps=[0.30,0.25,0.40,0.55,0.70,0.90,1.15,0.25,0.30,0.85];
const cues=[];let start=0.10;
mkdirSync('public/audio/longitude-clock/narration',{recursive:true});
for(const [i,s] of asset.script.segments.entries()){
 const id=`beat-${i+1}`;const file=`audio/longitude-clock/narration/${id}.wav`;
 const result=await tts.generate(s.text,{voice,speed});await result.save(`public/${file}`);
 const duration=result.audio.length/result.sampling_rate;
 cues.push({id,file,start:Math.round(start*30)/30,duration,transcript:s.text});start=cues.at(-1).start+duration+gaps[i];
 console.log(id,duration.toFixed(3),s.text);
}
const durationFrames=Math.ceil((start+0.35)*30);
mkdirSync('src/production/narration',{recursive:true});
writeFileSync('src/production/narration/longitude-clock.json',JSON.stringify({schemaVersion:1,cues,durationFrames,format:{width:1080,height:1920,fps:30,durationSeconds:durationFrames/30},measuredNarrationSeconds:cues.reduce((s,c)=>s+c.duration,0),measurementMethod:'Generated WAV sample counts at 24 kHz; independently verify with ffprobe.',provenance:{provider:'kokoro-local',modelId,voiceId:voice,speed,generatedAt:new Date().toISOString(),approvedScriptSha256:'1db5aee0fc71aa5f4c5e7677352e81fa4066d173c2c20040ee7a5c0ae809fbdb',cueArtifacts:cues.map(c=>({id:c.id,sha256:createHash('sha256').update(readFileSync(`public/${c.file}`)).digest('hex')}))}},null,2)+'\n');
