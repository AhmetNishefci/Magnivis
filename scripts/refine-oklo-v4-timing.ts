import {mkdirSync,readFileSync,writeFileSync} from 'node:fs';
import {sha256Json} from '../src/content-intelligence/run-schema';
import narration from '../src/production/narration/oklo-v4-r2.json';
const base='content-intelligence/cycles/cycle-8/editorial-revision-v4/compression-pass-2';
const read=(p:string)=>JSON.parse(readFileSync(p,'utf8'));
const captions=read('src/captions/plans/oklo-v4.json'),plan=read('src/production/plans/oklo-v4.json');
mkdirSync(`${base}/production-drafts`,{recursive:true});
for(const [name,data] of [['captions-v1',captions],['plan-v1',plan]])writeFileSync(`${base}/production-drafts/${name}.json`,JSON.stringify(data,null,2)+'\n',{flag:'wx'});
// Sentence anchors corroborated by actual clip ASR; phrase boundaries remain authored estimates.
// Numerals are spoken as multiple words, so literal written-word weighting is inadequate.
const starts=[[0,2.05,3.64],[0,1.95,3.35,6.20],[0,1.3,2.2,3.15,4.7,5.6],[0,.75,2.75,5,6.65],[0,1.45,3,4.2,5.2,6],[0,1.6,2.8],[0,2.45,3.55,4.65,6.35],[0,1.7,4.18,5.55,7.25]];
// Cue5 has seven groups: helping them split, then more uranium.
starts[4]!.push(7.1);
for(const [i,n] of narration.cues.entries()){
 const groups=captions.cues.filter((c:{sourceNarrationCueId:string})=>c.sourceNarrationCueId===n.id);
 if(groups.length!==starts[i]!.length)throw new Error('Phrase boundary mismatch');
 for(const [j,c] of groups.entries()){
 c.startFrame=Math.round((n.start+starts[i]![j]!)*30);
 c.endFrame=Math.round((n.start+(starts[i]![j+1]??n.duration))*30);
 c.presentationIntent='Authored phrase timing within measured complete clips, with ASR sentence anchors and expanded-numeral adjustment; not word-level forced alignment.';
 }
}
captions.revision=2;plan.captions.captionPlanRevision=2;plan.captions.captionPlanSha256=sha256Json(captions);
writeFileSync('src/captions/plans/oklo-v4.json',JSON.stringify(captions,null,2)+'\n');writeFileSync('src/production/plans/oklo-v4.json',JSON.stringify(plan,null,2)+'\n');
const stamp=(f:number)=>{const ms=Math.round(f/30*1000);return `${String(Math.floor(ms/3600000)).padStart(2,'0')}:${String(Math.floor(ms/60000)%60).padStart(2,'0')}:${String(Math.floor(ms/1000)%60).padStart(2,'0')}.${String(ms%1000).padStart(3,'0')}`;};
writeFileSync(plan.captions.file,'WEBVTT\n\n'+captions.cues.map((c:{startFrame:number;endFrame:number;lines:string[]},i:number)=>`${i+1}\n${stamp(c.startFrame)} --> ${stamp(c.endFrame)}\n${c.lines.join('\n')}\n`).join('\n'));
writeFileSync(`${base}/production-drafts/timing-refinement.json`,JSON.stringify({enteredAt:new Date().toISOString(),evidence:`${base}/clip-sentence-inspection.json`,sentenceAnchorsSeconds:{cue1:3.64,cue3:4.7,cue4:5,cue5:[3,6],cue8:4.18},phraseStarts:starts,narrationChanged:false,scope:'Speech-first phrase timing, not word alignment. Available local model lacks cross-attention outputs needed for word timestamps; no forced-alignment claim. Numeral and isotope pronunciations expand written tokens. Subjective synchrony remains an owner-review judgment.'},null,2)+'\n',{flag:'wx'});
