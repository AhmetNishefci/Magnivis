import {createLocalSpeechInspector} from '../../../../src/ai/providers/kokoro-local.mjs';
import {createRequire} from 'node:module';
import {execFileSync} from 'node:child_process';
import {writeFileSync} from 'node:fs';
const ff=createRequire(import.meta.url)('ffmpeg-static'),asr=await createLocalSpeechInspector();
const b=execFileSync(ff,['-v','error','-i','public/audio/voyager/narration/cue-7.wav','-ar','16000','-ac','1','-f','f32le','-']);
const signal=new Float32Array(b.buffer.slice(b.byteOffset,b.byteOffset+b.byteLength));
const result=await asr(signal,{return_timestamps:'word'});writeFileSync('content-intelligence/cycles/cycle-16/revision-v2/qa/source-word-timing.json',JSON.stringify({checkedAt:new Date().toISOString(),source:'public/audio/voyager/narration/cue-7.wav',cueTimelineStart:32.9,method:'Local existing Whisper tiny.en word timestamps; machine approximation, not subjective listening or forced alignment.',result},null,2)+'\n');
process.stdout.write(JSON.stringify(result));
