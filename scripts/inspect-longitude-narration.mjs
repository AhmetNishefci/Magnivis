import process from 'node:process';
import console from 'node:console';
import {readFileSync,writeFileSync} from 'node:fs';
import {createRequire} from 'node:module';
import {execFileSync} from 'node:child_process';
import {createLocalSpeechInspector} from '../src/ai/providers/kokoro-local.mjs';
const require=createRequire(import.meta.url);const ffmpeg=require('ffmpeg-static');
const v2=process.argv.includes('--v2');
const metadata=JSON.parse(readFileSync(v2?'src/production/narration/longitude-clock-v2.json':'src/production/narration/longitude-clock.json','utf8'));
const inspect=await createLocalSpeechInspector();const results=[];
for(const cue of metadata.cues){
 const raw=execFileSync(ffmpeg,['-v','error','-i',`public/${cue.file}`,'-ar','16000','-ac','1','-f','f32le','-'],{maxBuffer:64*1024*1024});
 const signal=new Float32Array(raw.buffer.slice(raw.byteOffset,raw.byteOffset+raw.byteLength));
 const result=await inspect(signal,{return_timestamps:true});
 results.push({cueId:cue.id,approvedText:cue.transcript,recognizedText:result.text,segments:result.chunks});console.log(cue.id,result.text);
}
writeFileSync(`content-intelligence/reviews/longitude-clock-production-${v2?'v2':'v1'}/narration-inspection.json`,JSON.stringify({schemaVersion:1,checkedAt:new Date().toISOString(),model:'onnx-community/whisper-tiny.en',method:'Local independent ASR; numerical orthography differences do not alter audio or canonical transcript. ASR is corroboration, not human listening.',results},null,2)+'\n');
