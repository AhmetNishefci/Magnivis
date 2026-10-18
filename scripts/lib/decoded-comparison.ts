import {createRequire} from 'node:module';
import {spawnSync} from 'node:child_process';
import {existsSync} from 'node:fs';
import {inspectMedia} from '../../src/artifacts/inspection';
import {mediaHash} from '../../src/artifacts/media';
/** Decode exact matched frame indices from two masters, preserving source identity.
 * No simulated before image, source-component still, or inferred playback review. */
export const renderMatchedComparison=({before,after,frames,fps,output,width=360}:{before:string;after:string;frames:number[];fps:number;output:string;width?:number})=>{
 if(existsSync(output))throw new Error('Preserve existing comparison evidence: '+output);
 const a=inspectMedia(before),b=inspectMedia(after);
 if(a.fps!==fps||b.fps!==fps||a.width!==b.width||a.height!==b.height)throw new Error('Comparison requires identical source FPS and canvas');
 if(!frames.length||frames.some((f,i)=>!Number.isInteger(f)||f<0||f/fps>=Math.min(a.durationSeconds,b.durationSeconds)||(i>0&&f<=frames[i-1]!)))throw new Error('Invalid comparison checkpoints');
 const select=frames.map(f=>`eq(n\\,${f})`).join('+'),height=Math.round(width*a.height/a.width),ffmpeg=createRequire(import.meta.url)('ffmpeg-static') as string;
 const r=spawnSync(ffmpeg,['-v','error','-i',before,'-i',after,'-filter_complex',`[0:v]select=${select},setpts=N/FRAME_RATE/TB,scale=${width}:${height}[a];[1:v]select=${select},setpts=N/FRAME_RATE/TB,scale=${width}:${height}[b];[a][b]hstack,tile=1x${frames.length}:nb_frames=${frames.length}:padding=6:margin=6:color=0x102C3B`,'-frames:v','1','-q:v','2',output],{encoding:'utf8'});
 if(r.status!==0)throw new Error(r.stderr);
 return {path:output,sha256:mediaHash(output),columnOrder:['V1','V2'],frames,timestamps:frames.map(f=>f/fps),before:{path:before,sha256:mediaHash(before)},after:{path:after,sha256:mediaHash(after)},scope:'Exact decoded timestamp-matched samples; not continuous AV or device verification.'};
};
