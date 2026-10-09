import console from 'node:console';
import {readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {createRequire} from 'node:module';
import {execFileSync,spawnSync} from 'node:child_process';
import {createLocalSpeechInspector} from '../src/ai/providers/kokoro-local.mjs';
const require=createRequire(import.meta.url),ffmpeg=require('ffmpeg-static'),ffprobe=require('ffprobe-static').path;
const metadata=JSON.parse(readFileSync('src/production/narration/craft-escape.json','utf8'));
const inspector=await createLocalSpeechInspector();
const signal=(path,args=[])=>{const bytes=execFileSync(ffmpeg,['-v','error','-i',path,...args,'-ar','16000','-ac','1','-f','f32le','-'],{maxBuffer:64*1024*1024});return new Float32Array(bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.byteLength));};
const results=[];
for(const cue of metadata.cues){const result=await inspector(signal(`public/${cue.file}`),{return_timestamps:true});const probe=JSON.parse(execFileSync(ffprobe,['-v','error','-show_format','-show_streams','-of','json',`public/${cue.file}`]));results.push({id:cue.id,exactText:cue.transcript,recognized:result.text,chunks:result.chunks,duration:Number(probe.format.duration),sampleRate:Number(probe.streams[0].sample_rate)});console.log(cue.id,result.text);}
const master='artifacts/masters/craft-escape-cycle10-candidate-v1.mp4';
const complete=await inspector(signal(master),{chunk_length_s:20,stride_length_s:3,return_timestamps:true});
const actualMasterCues=[];
for(const cue of metadata.cues){const result=await inspector(signal(master,['-ss',String(cue.start),'-t',String(cue.duration)]),{return_timestamps:true});actualMasterCues.push({id:cue.id,exactText:cue.transcript,recognized:result.text,start:cue.start,duration:cue.duration});console.log('ACTUAL MASTER',cue.id,result.text);}
const semanticUnits=metadata.cues.map(c=>({id:c.id,fullSentence:c.transcript,generatedAsSingleUnit:true,silenceReport:spawnSync(ffmpeg,['-hide_banner','-i',`public/${c.file}`,'-af','silencedetect=noise=-40dB:d=0.3','-f','null','-'],{encoding:'utf8'}).stderr.split('\n').filter(l=>l.includes('silence_'))}));
const hash=path=>createHash('sha256').update(readFileSync(path)).digest('hex');
const loudness=spawnSync(ffmpeg,['-hide_banner','-i',master,'-af','ebur128=peak=true','-vn','-f','null','-'],{encoding:'utf8'});
if(loudness.status!==0)throw new Error(loudness.stderr);
writeFileSync('qa/craft-escape/audio-inspection.json',JSON.stringify({checkedAt:new Date().toISOString(),masterPath:master,masterSha256:hash(master),method:'Local Whisper tiny.en ASR of each clip and full decoded master, plus independent ffprobe durations; machine corroboration, not human subjective listening. All exact decoded-master sentence intervals also inspected; whole-master recognition is secondary corroboration, never pronunciation/prosody acceptance.',model:'onnx-community/whisper-tiny.en',modelSha256:hash('.cache/longitude-ai/onnx-community/whisper-tiny.en/onnx/encoder_model_quantized.onnx'),narratorModelSha256:hash('.cache/longitude-ai/onnx-community/Kokoro-82M-v1.0-ONNX/onnx/model_quantized.onnx'),semanticUnits,generationBoundaryReview:{practice:'Complete semantic sentences generated together; caption line breaks never create TTS boundaries. No text substitutions; No phonetic substitution, global narrator modification or trimming; complete source clips retained.',limitation:'Acoustic silence and ASR are machine measurements. Sentence-internal prosody, correct stress and pronunciation remain listening judgments at master review.'},results,actualMasterCues,completeMasterRecognition:complete,loudnessSummary:loudness.stderr.slice(loudness.stderr.lastIndexOf('Summary:')),subjectiveListening:'Owner master review: voice naturalness, Ellen/William Craft and place-name pronunciation, complete sentence prosody and semantic contrast; ASR cannot establish pronunciation or naturalness.'},null,2)+'\n');
console.log('FULL MASTER',complete.text);
