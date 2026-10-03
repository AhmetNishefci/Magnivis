import console from 'node:console';
import {existsSync, mkdirSync, readFileSync, writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {createLocalNarrator, modelId} from '../src/ai/providers/kokoro-local.mjs';
const base='content-intelligence/cycles/cycle-6';
const asset=JSON.parse(readFileSync(`${base}/content-asset.ready.json`,'utf8'));
const output='src/production/narration/tally.json';
if(existsSync(output))throw new Error('Preserve prior measured narration; revisions require a new identity.');
const parts=[
 ['In 1834,',0],["Britain’s Parliament caught fire",0],["because workers were destroying old receipts.",0],
 ['The receipts were wooden sticks.',1],
 ['For centuries,',2],['the government recorded payments with notches,',2],['then split the wood',2],['so both sides kept a matching record.',2],
 ['When that system became obsolete,',3],['two cartloads of sticks were left to dispose of.',3],
 ['Workers fed them into heating furnaces',4],['beneath the House of Lords.',4],
 ['A chimney fire smouldered',5],['under the chamber floor.',5],['Heat and smoke were noticed,',5],['but the burning continued.',5],
 ['That evening, flames broke through.',6],
 ['Both parliamentary chambers were destroyed.',7],['Westminster Hall survived.',7],
 ['The dangerous part wasn’t',8],['keeping records on wood.',8],['It was choosing where to burn them.',8],
];
if(parts.map(p=>p[0]).join(' ')!==asset.script.segments.map(s=>s.text).join(' '))throw new Error('Script reconstruction failed.');
const narrator=await createLocalNarrator();
const cues=[];let frame=0;
const gaps=parts.map((_,i)=>[3,7,9,11,15,16,18,21].includes(i)?.5:.12);
mkdirSync('public/audio/tally/narration',{recursive:true});
for(const [i,[transcript,beatIndex]] of parts.entries()){
 const file=`audio/tally/narration/cue-${i+1}.wav`;
 if(existsSync(`public/${file}`))throw new Error('Do not overwrite generated audio.');
 const result=await narrator.generate(transcript,{voice:'af_heart',speed:0.97});
 await result.save(`public/${file}`);
 const duration=result.audio.length/result.sampling_rate;
 cues.push({id:`tally-cue-${i+1}`,transcript,file,start:frame/30,duration,beatIndex,sourceScriptSegmentId:asset.script.segments[beatIndex].id,samples:result.audio.length,sampleRate:result.sampling_rate});
 frame+=Math.ceil(duration*30)+Math.round(gaps[i]*30);
 console.log(`Cue ${i+1}: ${duration.toFixed(3)}s`);
}
const canonical=v=>Array.isArray(v)?v.map(canonical):v&&typeof v==='object'?Object.fromEntries(Object.entries(v).sort(([a],[b])=>a.localeCompare(b)).map(([k,x])=>[k,canonical(x)])):v;
const hash=p=>createHash('sha256').update(readFileSync(p)).digest('hex');
mkdirSync('src/production/narration',{recursive:true});
writeFileSync(output,JSON.stringify({schemaVersion:1,cues,durationFrames:frame,format:{width:1080,height:1920,fps:30,durationSeconds:frame/30},measuredNarrationSeconds:cues.reduce((s,c)=>s+c.duration,0),provenance:{provider:'kokoro-local',modelId,voiceId:'af_heart',speed:0.97,generatedAt:new Date().toISOString(),approvedScriptSha256:createHash('sha256').update(JSON.stringify(canonical(asset.script))).digest('hex'),cueArtifacts:cues.map(c=>({id:c.id,sha256:hash(`public/${c.file}`)}))}},null,2)+'\n',{flag:'wx'});
console.log(`Timeline: ${frame/30}s`);
