import {createRequire} from 'node:module';
import {execFileSync} from 'node:child_process';
import {mkdirSync,readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
const require=createRequire(import.meta.url),ffmpeg=require('ffmpeg-static'),master='artifacts/masters/craft-escape-cycle10-candidate-v3.mp4',dir='qa/craft-escape-v3',plan=JSON.parse(readFileSync('src/production/plans/craft-escape-v3.json','utf8'));
const groups=[{name:'scene-overview',frames:plan.beats.map(b=>b.frames.start+Math.floor((b.frames.end-b.frames.start)/2)),width:216,columns:5},{name:'motion-progression',frames:[300,398,446,490,515,595,1115,1183,1300,1396,1494,1550,1665,1775,2120,2417],width:270,columns:4},{name:'phone-readability',frames:[446,595,1396,1494,1775,2417],width:360,columns:3}];
mkdirSync(`${dir}/visual-proofs`,{recursive:true});
for(const g of groups){const h=Math.round(g.width*1920/1080);for(let i=0;i<g.frames.length;i++){execFileSync(ffmpeg,['-v','error','-y','-i',master,'-vf',`select=eq(n\\,${g.frames[i]}),scale=${g.width}:${h}:flags=lanczos`,'-frames:v','1',`${dir}/visual-proofs/${g.name}-${String(i).padStart(2,'0')}.png`]);}execFileSync(ffmpeg,['-v','error','-y','-framerate','1','-i',`${dir}/visual-proofs/${g.name}-%02d.png`,'-vf',`tile=${g.columns}x${Math.ceil(g.frames.length/g.columns)}`,'-frames:v','1','-q:v','2',`${dir}/${g.name}.jpg`]);}
writeFileSync(`${dir}/visual-proof-method.json`,JSON.stringify({createdAt:new Date().toISOString(),masterSha256:createHash('sha256').update(readFileSync(master)).digest('hex'),method:'Exact encoded frames selected by frame number; Lanczos reduction. Phone samples360x640 each; combined sheet does not enlarge individual panels. No real-device/nativeUI/crop proof.',groups},null,2)+'\n');
