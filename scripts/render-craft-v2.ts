import {existsSync,mkdirSync,readFileSync,writeFileSync} from 'node:fs';
import {createRequire} from 'node:module';
import {createHash} from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {craftV2Target} from './production-video-targets';
const smoke=process.argv.includes('--smoke'),intermediate='output/craft-escape-render-v2.mp4';
if(!smoke&&existsSync(craftV2Target.output))throw new Error('Preserve retained master; revisions need a new identity.');
mkdirSync(smoke?'output':'artifacts/masters',{recursive:true});
const result=spawnSync('pnpm',['exec','remotion','render',craftV2Target.entryPoint,craftV2Target.spec.compositionId,smoke?'output/craft-escape-v2-smoke.mp4':intermediate,'--codec=h264','--audio-codec=aac','--video-bitrate=4M','--audio-bitrate=192K','--pixel-format=yuv420p','--concurrency=2',...(smoke?['--frames=0-89']:[])],{stdio:'inherit'});
if(result.error)throw result.error;if(result.status!==0)process.exit(result.status??1);
if(!smoke){
 const ffmpeg=createRequire(import.meta.url)('ffmpeg-static') as string;
 // Measure the actual full mix; compute a conservative voice-forward gain below -2 dBTP.
 const measure=spawnSync(ffmpeg,['-hide_banner','-i',intermediate,'-af','loudnorm=I=-19:TP=-2:LRA=7:print_format=json','-f','null','-'],{encoding:'utf8'});
 if(measure.status!==0)throw new Error(measure.stderr);
 const match=measure.stderr.match(/\{\s*"input_i"[\s\S]*?\}/);if(!match)throw new Error('Missing measured loudness');
 const values=JSON.parse(match[0]) as {input_i:string;input_tp:string};
 const gain=Math.min(-19-Number(values.input_i),-2.2-Number(values.input_tp));
 const master=spawnSync(ffmpeg,['-hide_banner','-i',intermediate,'-map','0:v:0','-map','0:a:0','-c:v','copy','-af',`volume=${gain}dB`,'-c:a','aac','-b:a','192k','-movflags','+faststart',craftV2Target.output],{encoding:'utf8'});
 if(master.status!==0)throw new Error(master.stderr);
 const hash=(p:string)=>createHash('sha256').update(readFileSync(p)).digest('hex');
 writeFileSync('content-intelligence/cycles/cycle-10/revision-v2/audio-mastering-v2.json',JSON.stringify({enteredAt:new Date().toISOString(),method:'Measured whole-mix constant gain, copied video stream; no narration wording/timing changes.',renderIntermediate:{path:intermediate,sha256:hash(intermediate),retention:'temporary'},candidate:{path:craftV2Target.output,sha256:hash(craftV2Target.output)},inputMeasurements:values,gainDb:gain,rationale:'Improve voice audibility while reserving true-peak headroom; final exact-media loudness independently checked.'},null,2)+'\n',{flag:'wx'});
}
