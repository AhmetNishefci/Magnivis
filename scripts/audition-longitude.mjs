import console from 'node:console';
import {mkdirSync,readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {createLocalNarrator,modelId} from '../src/ai/providers/kokoro-local.mjs';
const asset=JSON.parse(readFileSync('content-intelligence/reviews/longitude-clock-approved-v3/content-asset.approved.json','utf8'));
const text=[asset.script.segments[0].text,asset.script.segments[2].text,asset.script.segments[5].text,asset.script.segments[6].text,asset.script.segments[9].text].join(' ');
const folder='public/audio/longitude-clock/auditions';mkdirSync(folder,{recursive:true});
const tts=await createLocalNarrator();const samples=[];
for (const voice of ['bf_emma','bf_isabella','bm_george']) {
 const result=await tts.generate(text,{voice,speed:0.95});const path=`${folder}/${voice}.wav`;await result.save(path);
 samples.push({voiceId:voice,path,transcript:text,speed:0.95,duration:result.audio.length/result.sampling_rate,sampleRate:result.sampling_rate,sha256:createHash('sha256').update(readFileSync(path)).digest('hex')});
 console.log(voice,samples.at(-1).duration);
}
mkdirSync('content-intelligence/reviews/longitude-clock-production-v1',{recursive:true});
writeFileSync('content-intelligence/reviews/longitude-clock-production-v1/audition-samples.json',JSON.stringify({schemaVersion:1,generatedAt:new Date().toISOString(),provider:'kokoro-local',modelId,samples},null,2)+'\n');
