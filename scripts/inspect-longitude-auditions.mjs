import console from 'node:console';
import {readFileSync,writeFileSync} from 'node:fs';
import {createRequire} from 'node:module';
import {execFileSync,spawnSync} from 'node:child_process';
import {createLocalSpeechInspector} from '../src/ai/providers/kokoro-local.mjs';
const require=createRequire(import.meta.url);const ffmpeg=require('ffmpeg-static');
const samples=JSON.parse(readFileSync('content-intelligence/reviews/longitude-clock-production-v1/audition-samples.json','utf8'));
const inspect=await createLocalSpeechInspector();const observations=[];
for(const sample of samples.samples){
 const raw=execFileSync(ffmpeg,['-v','error','-i',sample.path,'-ar','16000','-ac','1','-f','f32le','-'],{maxBuffer:64*1024*1024});
 const signal=new Float32Array(raw.buffer.slice(raw.byteOffset,raw.byteOffset+raw.byteLength));
 const result=await inspect(signal,{return_timestamps:true});
 const level=spawnSync(ffmpeg,['-i',sample.path,'-af','volumedetect','-f','null','-'],{encoding:'utf8'});
 observations.push({voiceId:sample.voiceId,transcript:result.text,segmentTimestamps:result.chunks,method:'Independent local whisper-tiny.en ASR, not human listening or semantic proof',meanVolumeDb:Number(/mean_volume:\s*(-?[\d.]+)/.exec(level.stderr)?.[1]),peakDb:Number(/max_volume:\s*(-?[\d.]+)/.exec(level.stderr)?.[1])});
 console.log(sample.voiceId,result.text);
}
writeFileSync('content-intelligence/reviews/longitude-clock-production-v1/audition-inspection.json',JSON.stringify({schemaVersion:1,inspectedAt:new Date().toISOString(),inspectorModel:'onnx-community/whisper-tiny.en',observations},null,2)+'\n');
