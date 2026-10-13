import console from 'node:console';
import {readFileSync,writeFileSync,mkdirSync,renameSync,existsSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {createRequire} from 'node:module';
import {execFileSync} from 'node:child_process';
import {createLocalNarrator,generateWithGrenadaPronunciation} from '../src/ai/providers/kokoro-local.mjs';
const base='content-intelligence/cycles/cycle-13/production-v1',path='src/production/narration/devils-hole.json';
if(existsSync(`${base}/pronunciation-repair.json`))throw new Error('Already repaired');
const n=JSON.parse(readFileSync(path,'utf8')),audit=JSON.parse(readFileSync(`${base}/phoneme-audit.json`,'utf8')),dir='artifacts/qa-evidence/devils-hole-cycle13-authoring-first-pass';
mkdirSync(dir,{recursive:true});writeFileSync(`${base}/narration-first-pass.json`,JSON.stringify(n,null,2)+'\n',{flag:'wx'});
const narrator=await createLocalNarrator(),probe=createRequire(import.meta.url)('ffprobe-static').path,repairs=[];
for(const [index,before,after] of [[1,'kˈæmtʃætkə','kæmˈtʃætkə'],[6,'sˈaɪk','sˈeɪʃ']]){
 const cue=n.cues[index],original=`public/${cue.file}`,retained=`${dir}/cue-${index+1}.wav`;
 const result=await generateWithGrenadaPronunciation(narrator,cue.transcript,(_text,phonemes)=>{if(!phonemes.includes(before))throw new Error('Unexpected pronunciation');return {phonemes:phonemes.replace(before,after),occurrences:1};},{voice:'af_heart',speed:1});
 renameSync(original,retained);await result.audio.save(original);
 const meta=JSON.parse(execFileSync(probe,['-v','error','-show_format','-show_streams','-of','json',original]));
 cue.duration=Number(meta.format.duration);cue.samples=Math.round(cue.duration*cue.sampleRate);
 repairs.push({cueId:cue.id,sourceTranscriptUnchanged:true,original:retained,corrected:original,...result.audit});
 audit.units[index].phonemes=result.audit.after;audit.units[index].substitutions=[{before,after,scope:'Full-context phoneme repair; approved written transcript unchanged.'}];
}
let frame=0;for(const [i,c]of n.cues.entries()){c.start=frame/30;frame+=Math.ceil(c.duration*30)+Math.round(([0,3,5,7,9,10].includes(i)?.24:.12)*30);}
n.durationFrames=frame;n.format.durationSeconds=frame/30;n.measuredNarrationSeconds=n.cues.reduce((s,c)=>s+c.duration,0);
n.provenance.cueArtifacts=n.cues.map(c=>({id:c.id,sha256:createHash('sha256').update(readFileSync(`public/${c.file}`)).digest('hex')}));
n.provenance.pronunciationRepair=`${base}/pronunciation-repair.json`;
writeFileSync(path,JSON.stringify(n,null,2)+'\n');writeFileSync(`${base}/phoneme-audit-corrected.json`,JSON.stringify(audit,null,2)+'\n',{flag:'wx'});
writeFileSync(`${base}/pronunciation-repair.json`,JSON.stringify({enteredAt:new Date().toISOString(),repairs,referenceEvidence:{Kamchatka:'Cambridge Dictionary primary search excerpt /kæmˈtʃæt.kə/; direct page denied403. Second-syllable stress corroborated by Collins.',seiche:'Inspected USGS seismic-seiche source defines pronunciation SAYSH.'},inspectionLimits:'Input phoneme/token audit, not subjective listening or proof of output prosody.'},null,2)+'\n',{flag:'wx'});
console.log({frames:frame,seconds:frame/30,repairs:repairs.map(r=>r.cueId)});
