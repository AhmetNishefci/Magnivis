import console from 'node:console';
import process from 'node:process';
import {mkdirSync,readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {createRequire} from 'node:module';
import {execFileSync,spawnSync} from 'node:child_process';
import {createLocalSpeechInspector} from '../src/ai/providers/kokoro-local.mjs';
const require=createRequire(import.meta.url),ffmpeg=require('ffmpeg-static'),meta=JSON.parse(readFileSync('src/production/narration/flytrap.json','utf8'));
const inspector=await createLocalSpeechInspector(),base='qa/flytrap-v2';mkdirSync(base,{recursive:true});
const hash=p=>createHash('sha256').update(readFileSync(p)).digest('hex');
const signal=(p,args=[])=>{const b=execFileSync(ffmpeg,['-v','error','-i',p,...args,'-ar','16000','-ac','1','-f','f32le','-'],{maxBuffer:64*1024*1024});return new Float32Array(b.buffer.slice(b.byteOffset,b.byteOffset+b.byteLength));};
if(process.argv.includes('--source-only')){
 const results=[];
 for(const c of meta.cues){const r=await inspector(signal(`public/${c.file}`),{return_timestamps:true});results.push({id:c.id,exactText:c.transcript,recognized:r.text,chunks:r.chunks,sourceSha256:hash(`public/${c.file}`)});console.log(c.id,r.text);}
 writeFileSync('content-intelligence/cycles/cycle-15/production-v1/qa/narration-alignment.json',JSON.stringify({enteredAt:new Date().toISOString(),method:'Source WAVs decoded at16kHz and recognized locally with Whisper tiny.en segment timestamps. Approximate sentence anchors, not forced word alignment or listening.',results},null,2)+'\n',{flag:'wx'});
}else{
 const master='artifacts/masters/flytrap-cycle15-candidate-v2.mp4',actualMasterCues=[];
 for(const c of meta.cues){const r=await inspector(signal(master,['-ss',String(c.start),'-t',String(c.duration)]),{return_timestamps:true});actualMasterCues.push({id:c.id,exactText:c.transcript,recognized:r.text,chunks:r.chunks,start:c.start,duration:c.duration});console.log(c.id,r.text);}
 const loudness=spawnSync(ffmpeg,['-hide_banner','-i',master,'-af','ebur128=peak=true','-vn','-f','null','-'],{encoding:'utf8'});if(loudness.status!==0)throw new Error(loudness.stderr);
 const semanticUnits=meta.cues.map(c=>({id:c.id,fullUnit:c.transcript,silenceReport:spawnSync(ffmpeg,['-hide_banner','-i',`public/${c.file}`,'-af','silencedetect=noise=-40dB:d=0.3','-f','null','-'],{encoding:'utf8'}).stderr.split('\n').filter(l=>l.includes('silence_'))}));
 writeFileSync(`${base}/audio-inspection.json`,JSON.stringify({checkedAt:new Date().toISOString(),masterPath:master,masterSha256:hash(master),method:'Actual decoded master recognized per complete source unit; independent EBU R128 signal/loudness and silence inspection. Machine evidence, not subjective audiovisual review.',model:'onnx-community/whisper-tiny.en',narrator:'Kokoro af_heart speed1',actualMasterCues,semanticUnits,loudnessSummary:loudness.stderr.slice(loudness.stderr.lastIndexOf('Summary:')),sourceAlignment:JSON.parse(readFileSync('content-intelligence/cycles/cycle-15/production-v1/qa/narration-alignment.json','utf8')),pronunciationInputEvidence:'content-intelligence/cycles/cycle-15/production-v1/phoneme-audit.json',limitations:['No callable subjective audio listening or continuous video playback available.','Whisper recognition cannot certify pronunciation, stress, naturalness or purposeful sound.','Caption phrases within ASR sentence chunks are authored approximate timing.'],subjectiveListening:'Required owner review of calcium pronunciation, signals versus touches, qualifiers, natural phrasing and caption synchronization.'},null,2)+'\n',{flag:'wx'});
}
