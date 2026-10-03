import console from 'node:console';
import {existsSync,mkdirSync,readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {createRequire} from 'node:module';
import {execFileSync,spawnSync} from 'node:child_process';
import {createLocalNarrator,modelId} from '../src/ai/providers/kokoro-local.mjs';
const require=createRequire(import.meta.url),ffmpeg=require('ffmpeg-static'),ffprobe=require('ffprobe-static').path;
const base='content-intelligence/cycles/cycle-6/revision-3',original=JSON.parse(readFileSync('src/production/narration/heat.json','utf8'));
const output='src/production/narration/heat-v4.json';if(existsSync(output))throw new Error('Preserve measured narration; use new revision identity.');
const hash=p=>createHash('sha256').update(readFileSync(p)).digest('hex');
mkdirSync('public/audio/heat-v4/narration',{recursive:true});
const narrator=await createLocalNarrator();
// Existing stream splitter needs following text to yield a sentence. Only first yield
// is consumed; no following text is synthesized or included in the production.
const stream=narrator.stream(`${original.cues[7].transcript} Next`,{voice:'af_heart',speed:.97});
const {value}=await stream.next();await stream.return();
if(value.text!==original.cues[7].transcript)throw new Error('Sentence boundary changed');
const expected='ðɪs ɪz ðə lˈeɪdənfɹˌɔst ɪfˈɛkt.';
if(value.phonemes!==expected)throw new Error(`Unexpected phonemes: ${value.phonemes}`);
const phonemes='ðɪs ɪz ðə lˈaɪdənfɹˌɔst ɪfˈɛkt.';
const {input_ids}=narrator.tokenizer(phonemes,{truncation:false});
const generated=await narrator.generate_from_ids(input_ids,{voice:'af_heart',speed:.97});
const nameSource='public/audio/heat-v4/narration/name-source.wav';
if(existsSync(nameSource))throw new Error('Preserve pronunciation source');await generated.save(nameSource);
const cues=[],trims=[];let frame=0;
for(const [i,old] of original.cues.entries()){
 const source=i===7?nameSource:`public/${old.file}`;
 const probe=JSON.parse(execFileSync(ffprobe,['-v','error','-show_format','-show_streams','-of','json',source]));
 const duration=Number(probe.format.duration);
 const measure=spawnSync(ffmpeg,['-hide_banner','-i',source,'-af','silencedetect=noise=-40dB:d=0.3','-f','null','-'],{encoding:'utf8'});
 if(measure.status!==0)throw new Error(measure.stderr);
 const intervals=[...measure.stderr.matchAll(/silence_start: ([\d.]+)[\s\S]*?silence_end: ([\d.]+)/g)].map(m=>[Number(m[1]),Number(m[2])]);
 const leading=intervals.find(([a])=>a===0),trailing=intervals.find(([,b])=>Math.abs(b-duration)<.002);
 if(!leading||!trailing)throw new Error(`Missing silence boundaries: cue ${i+1}`);
 // Trim only outside sentence boundaries, keeping 75ms margin on either side.
 const start=Math.max(0,leading[1]-.075),end=Math.min(duration,trailing[0]+.075);
 const file=`audio/heat-v4/narration/cue-${i+1}.wav`;
 execFileSync(ffmpeg,['-v','error','-i',source,'-af',`atrim=start=${start}:end=${end},asetpts=PTS-STARTPTS`,'-c:a','pcm_s16le',`public/${file}`]);
 const p=JSON.parse(execFileSync(ffprobe,['-v','error','-show_format','-show_streams','-of','json',`public/${file}`]));
 const measured=Number(p.format.duration),sampleRate=Number(p.streams[0].sample_rate);
 const gap=i===11?.45:[0,4].includes(i)?.32:i===6?.38:.22;
 cues.push({...old,file,start:frame/30,duration:measured,sampleRate,samples:Math.round(measured*sampleRate)});
 trims.push({cueId:old.id,source:{path:source,sha256:hash(source)},sourceDuration:duration,detectedSilence:intervals,retainedRange:{start,end},boundaryMarginSeconds:.075,interBeatGapSeconds:gap,output:{path:`public/${file}`,sha256:hash(`public/${file}`)},internalSpeech:'Unchanged; no internal pause removal, time stretch or speech-rate increase.'});
 frame+=Math.ceil(measured*30)+Math.round(gap*30);
 console.log(`${old.id}: ${measured.toFixed(3)}s; starts ${cues.at(-1).start.toFixed(3)}`);
}
writeFileSync(output,JSON.stringify({...original,cues,durationFrames:frame,format:{...original.format,durationSeconds:frame/30},measuredNarrationSeconds:cues.reduce((s,c)=>s+c.duration,0),provenance:{...original.provenance,modelId,generatedAt:new Date().toISOString(),cueArtifacts:cues.map(c=>({id:c.id,sha256:hash(`public/${c.file}`)})),revisionTreatment:`${base}/narration-treatment.json`}},null,2)+'\n',{flag:'wx'});
writeFileSync(`${base}/narration-treatment.json`,JSON.stringify({enteredAt:new Date().toISOString(),unchangedScriptSha256:original.provenance.approvedScriptSha256,voice:'af_heart',speed:.97,semanticPolicy:'Every full sentence generated as one connected unit; caption breaks do not drive audio generation. Other eleven full-sentence sources unchanged before boundary trimming.',name:{exactText:original.cues[7].transcript,oldPhonemes:value.phonemes,newPhonemes:phonemes,intended:'LYE-den-frost effect',source:{path:nameSource,sha256:hash(nameSource)},treatment:'Existing narrator generate_from_ids with sentence-local bound phonemes; only first vowel changed from eɪ to aɪ. No text substitution, global lexicon, provider or narrator change.',pronunciationEvidence:`${base}/pronunciation-evidence.json`,status:'Intended phonetic input controlled; final audible intelligibility and prosody require owner listening, never inferred from ASR.'},pacing:{previousFrames:original.durationFrames,newFrames:frame,previousPictureSeconds:original.format.durationSeconds,newPictureSeconds:frame/30,rationale:'Previous sentence boundaries stacked roughly 0.8s generated edge silence with authored 0.25–0.55s gaps. Retain active speech and internal pauses; leave 75ms at both edges plus 0.22s typical semantic pause, 0.32s hook/cushion, 0.38s barrier reveal, 0.45s closing hold. Duration follows these beats, no target runtime.'},trims},null,2)+'\n',{flag:'wx'});
