import console from 'node:console';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {createRequire} from 'node:module';
import {execFileSync} from 'node:child_process';
import {createLocalSpeechInspector} from '../src/ai/providers/kokoro-local.mjs';
const require=createRequire(import.meta.url),ffmpeg=require('ffmpeg-static'),meta=JSON.parse(readFileSync('src/production/narration/vermeer-forgery.json','utf8')),inspector=await createLocalSpeechInspector();
const results=[];
for(const c of meta.cues){const b=execFileSync(ffmpeg,['-v','error','-i',`public/${c.file}`,'-ar','16000','-ac','1','-f','f32le','-']);const result=await inspector(new Float32Array(b.buffer.slice(b.byteOffset,b.byteOffset+b.byteLength)),{return_timestamps:true});results.push({id:c.id,exactText:c.transcript,recognized:result.text,chunks:result.chunks});console.log(c.id,result.text);}
mkdirSync('qa/vermeer-forgery',{recursive:true});writeFileSync('qa/vermeer-forgery/narration-alignment.json',JSON.stringify({enteredAt:new Date().toISOString(),method:'Actual source WAVs decoded to16kHz and locally recognized with Whisper tiny.en segment timestamps; word timestamps unavailable in installed model export. Approximate alignment aid, not subjective pronunciation approval; exact script/captions remain authority.',results},null,2)+'\n');
