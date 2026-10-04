import console from 'node:console';
import {mkdirSync,readFileSync,writeFileSync,existsSync} from 'node:fs';
import {createRequire} from 'node:module';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
const ffmpeg=createRequire(import.meta.url)('ffmpeg-static'),base='content-intelligence/cycles/cycle-9/pronunciation-revision-v2',dir='artifacts/qa-evidence/two-goals-cycle9-v2';
const old=JSON.parse(readFileSync('src/production/narration/two-goals.json','utf8')),next=JSON.parse(readFileSync('src/production/narration/two-goals-v2.json','utf8')),hash=p=>createHash('sha256').update(readFileSync(p)).digest('hex');
mkdirSync(dir,{recursive:true});const comparisons=[];
for(const i of [7,8,10]){
 const a=old.cues[i],b=next.cues[i],path=`${dir}/pronunciation-cue-${i+1}-v1-then-v2.wav`;
 if(existsSync(path))throw new Error('Preserve audition evidence');
 execFileSync(ffmpeg,['-v','error','-i',`public/${a.file}`,'-i',`public/${b.file}`,'-filter_complex','[0:a]apad=pad_dur=0.8[a];[a][1:a]concat=n=2:v=0:a=1[out]','-map','[out]','-c:a','pcm_s16le',path]);
 comparisons.push({cueId:b.id,transcript:b.transcript,path,sha256:hash(path),order:'V1 complete unit, 0.8 seconds silence, V2 complete unit',v1:{path:`public/${a.file}`,sha256:hash(`public/${a.file}`)},v2:{path:`public/${b.file}`,sha256:hash(`public/${b.file}`)},v2StartsAtSeconds:a.duration+.8});
}
writeFileSync(`${base}/pronunciation-auditions.json`,JSON.stringify({enteredAt:new Date().toISOString(),target:'gre-NAY-duh; stress second syllable',comparisons,method:'Lossless decoded contextual A/B audition files; no isolated word splice. Correct phonetic input independently bound. ASR of affected clips recognizes Grenada; not used as pronunciation proof.',listeningStatus:'Audition evidence prepared for direct owner listening. Session has no independent human listener or reliable acoustic phoneme classifier; no human listening pass claimed.',remainingUncertainty:'Model input strongly supports intended pronunciation; synthesized realization, naturalness and emphasis require listening. Final master intervals independently decoded and inspected.'},null,2)+'\n',{flag:'wx'});
console.log('Three contextual V1/V2 pronunciation auditions prepared.');
