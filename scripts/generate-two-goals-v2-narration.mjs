import console from 'node:console';
import {mkdirSync,readFileSync,writeFileSync,existsSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {correctGrenadaPhonemes} from '../src/ai/grenada-pronunciation.ts';
import {createLocalNarrator,generateWithGrenadaPronunciation} from '../src/ai/providers/kokoro-local.mjs';
const base='content-intelligence/cycles/cycle-9/pronunciation-revision-v2';
const old=JSON.parse(readFileSync('src/production/narration/two-goals.json','utf8'));
const narrator=await createLocalNarrator(),audits=[],cues=[];let frame=0;
mkdirSync('public/audio/two-goals/narration-v2',{recursive:true});
for(const [i,c] of old.cues.entries()){
 let cue={...c,start:frame/30};
 if([7,8,10].includes(i)){
  const file=`audio/two-goals/narration-v2/cue-${i+1}.wav`;
  if(existsSync(`public/${file}`))throw new Error('Preserve generated revision');
  const result=await generateWithGrenadaPronunciation(narrator,c.transcript,correctGrenadaPhonemes,{voice:'af_heart',speed:1});
  await result.audio.save(`public/${file}`);
  cue={...cue,file,sampleRate:result.audio.sampling_rate,samples:result.audio.audio.length,duration:result.audio.audio.length/result.audio.sampling_rate};
  audits.push({...result.audit,cueId:c.id,file});
 }
 cues.push(cue);frame+=Math.ceil(cue.duration*30)+Math.round(([0,6,9].includes(i)?.35:.2)*30);
 console.log(cue.id,cue.duration);
}
const hash=p=>createHash('sha256').update(readFileSync(p)).digest('hex');
writeFileSync(`${base}/phonetic-input-audit.json`,JSON.stringify({enteredAt:new Date().toISOString(),method:'Public full-context tokenizer input captured without baseline waveform generation, exact token round-trip verified; only four Grenada phoneme occurrences corrected. Entire affected units synthesized once.',voice:'af_heart',speed:1,target:'gre-NAY-duh; second-syllable stress; /ɡɹənˈeɪdə/',audits,providerSha256:hash('src/ai/providers/kokoro-local.mjs'),repairSha256:hash('src/ai/grenada-pronunciation.ts'),limitation:'Input pronunciation and stress verified; acoustic output and contextual listening require separate inspection.'},null,2)+'\n',{flag:'wx'});
writeFileSync('src/production/narration/two-goals-v2.json',JSON.stringify({...old,cues,durationFrames:frame,format:{...old.format,durationSeconds:frame/30},measuredNarrationSeconds:cues.reduce((s,c)=>s+c.duration,0),provenance:{...old.provenance,generatedAt:new Date().toISOString(),sourceNarration:{path:'src/production/narration/two-goals.json',sha256:hash('src/production/narration/two-goals.json')},pronunciationAudit:{path:`${base}/phonetic-input-audit.json`,sha256:hash(`${base}/phonetic-input-audit.json`)},cueArtifacts:cues.map(c=>({id:c.id,sha256:hash(`public/${c.file}`)}))}},null,2)+'\n',{flag:'wx'});
