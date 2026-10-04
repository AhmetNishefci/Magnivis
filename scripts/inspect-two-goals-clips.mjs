import console from 'node:console';
import {readFileSync,writeFileSync} from 'node:fs';
import {createRequire} from 'node:module';
import {execFileSync} from 'node:child_process';
import {createLocalSpeechInspector} from '../src/ai/providers/kokoro-local.mjs';
const ffmpeg=createRequire(import.meta.url)('ffmpeg-static'),metadata=JSON.parse(readFileSync('src/production/narration/two-goals.json','utf8'));
const inspector=await createLocalSpeechInspector(),results=[];
for(const cue of metadata.cues){const bytes=execFileSync(ffmpeg,['-v','error','-i',`public/${cue.file}`,'-ar','16000','-ac','1','-f','f32le','-']);const result=await inspector(new Float32Array(bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.byteLength)),{return_timestamps:true});results.push({id:cue.id,exactText:cue.transcript,recognized:result.text,chunks:result.chunks});console.log(cue.id,result.text);}
writeFileSync('content-intelligence/cycles/cycle-9/narration-clip-inspection.json',JSON.stringify({enteredAt:new Date().toISOString(),method:'Actual decoded clips inspected with local Whisper tiny.en; approximate speech segment boundaries, not human listening or exact forced alignment.',results},null,2)+'\n',{flag:'wx'});
