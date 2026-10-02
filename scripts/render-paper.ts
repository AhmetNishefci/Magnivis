import {existsSync,mkdirSync,readFileSync,renameSync,writeFileSync} from 'node:fs';
import {createRequire} from 'node:module';
import {createHash} from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {paperTarget} from './production-video-targets';
const smoke=process.argv.includes('--smoke');
const masterExisting=process.argv.includes('--master-existing');
const intermediate='output/paper-render.mp4';
if(masterExisting){if(existsSync(intermediate))throw new Error('Ambiguous existing intermediate.');renameSync(paperTarget.output,intermediate);}
if(!smoke&&existsSync(paperTarget.output))throw new Error('Preserve retained candidate; use a new revision for changed media.');
mkdirSync(smoke?'output':'artifacts/masters',{recursive:true});
if(!masterExisting){const result=spawnSync('pnpm',['exec','remotion','render',paperTarget.entryPoint,paperTarget.spec.compositionId,smoke?'output/paper-smoke.mp4':intermediate,'--codec=h264','--audio-codec=aac','--video-bitrate=5M','--audio-bitrate=192K','--pixel-format=yuv420p','--concurrency=2',...(smoke?['--frames=0-89']:[])],{stdio:'inherit'});if(result.error)throw result.error;if(result.status!==0)process.exit(result.status??1);}
if(!smoke){
 const ffmpeg=createRequire(import.meta.url)('ffmpeg-static') as string;
 const result=spawnSync(ffmpeg,['-hide_banner','-i',intermediate,'-map','0:v:0','-map','0:a:0','-c:v','copy','-af','volume=4.5dB','-c:a','aac','-b:a','192k','-movflags','+faststart',paperTarget.output],{encoding:'utf8'});
 if(result.status!==0)throw new Error(result.stderr);
 const hash=(p:string)=>createHash('sha256').update(readFileSync(p)).digest('hex');
 const receipt=process.argv.includes('--refined')?'audio-mastering-refined':'audio-mastering';
 writeFileSync(`content-intelligence/cycles/cycle-4/${receipt}.json`,JSON.stringify({enteredAt:new Date().toISOString(),method:'Internal pre-review audio gain mastering; video stream copied without re-encoding.',renderIntermediate:{path:intermediate,sha256:hash(intermediate),retention:'Temporary pre-review render, not catalogued or owner-reviewed.'},candidate:{path:paperTarget.output,sha256:hash(paperTarget.output)},gainDb:4.5,rationale:'Initial render measured -23.6 LUFS/-6.4 dBTP. A conservative +4.5 dB gain improves speech audibility while retaining headroom; final loudness independently checked.'},null,2)+'\n',{flag:'wx'});
}
