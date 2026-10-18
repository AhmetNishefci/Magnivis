import {existsSync,mkdirSync,writeFileSync} from 'node:fs';
import {createRequire} from 'node:module';
import {execFileSync,spawnSync} from 'node:child_process';
import {mediaHash} from '../src/artifacts/media';
import {anglerfishFusionV3Target as target} from './anglerfish-v3-video-target';
const smoke=process.argv.includes('--smoke'),picture=smoke?'output/anglerfish-fusion-v3-smoke.mp4':'output/anglerfish-fusion-v3-picture.mp4';
if(!smoke&&existsSync(target.output))throw new Error('Preserve existing candidate.');
mkdirSync('output',{recursive:true});
const from=Number(process.argv.find(a=>a.startsWith('--from='))?.slice(7)??0);
const r=spawnSync('pnpm',['exec','remotion','render',target.entryPoint,target.spec.compositionId,picture,'--codec=h264','--video-bitrate=6M','--pixel-format=yuv420p','--concurrency=2','--muted',...(smoke?[`--frames=${from}-${from+89}`]:[])],{stdio:'inherit'});
if(r.error)throw r.error;if(r.status!==0)process.exit(r.status??1);
if(!smoke){
 const ffmpeg=createRequire(import.meta.url)('ffmpeg-static') as string,original='artifacts/masters/anglerfish-fusion-cycle22-candidate-v1.mp4';
 execFileSync(ffmpeg,['-v','error','-i',picture,'-i',original,'-map','0:v:0','-map','1:a:0','-c','copy','-movflags','+faststart',target.output]);
 const audioHash=(file:string)=>execFileSync(ffmpeg,['-v','error','-i',file,'-map','0:a:0','-c','copy','-f','hash','-hash','sha256','-'],{encoding:'utf8'}).trim();
 const audioIdentityPassed=audioHash(original)===audioHash(target.output);if(!audioIdentityPassed)throw new Error('Audio changed');
 writeFileSync('content-intelligence/cycles/cycle-22/revision-v3/audio-preservation.json',JSON.stringify({checkedAt:new Date().toISOString(),method:'Copy exact V1 AAC audio packets into new V3 picture; no resynthesis, editing or mastering.',audioIdentityPassed,audioPacketSha256:audioHash(original),v1:{path:original,sha256:mediaHash(original)},v2:{path:target.output,sha256:mediaHash(target.output)}},null,2)+'\n',{flag:'wx'});
}
