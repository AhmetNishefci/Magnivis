import {mkdirSync,existsSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import {longitudeTarget as target} from './production-video-targets';
import {validateLongitudeProduction} from '../src/production/longitude-integrity';
validateLongitudeProduction();
const smoke=process.argv.includes('--smoke');
if(!smoke&&existsSync('artifacts/masters/longitude-clock-candidate-v1.mp4'))throw new Error('Retained review candidate is immutable; authorize a new revision before rendering another master.');mkdirSync('output',{recursive:true});
const result=spawnSync('pnpm',['exec','remotion','render',target.entryPoint,target.spec.compositionId,smoke?'output/longitude-clock-smoke.mp4':target.output,'--codec=h264','--audio-codec=aac','--video-bitrate=5M','--audio-bitrate=192K','--pixel-format=yuv420p','--concurrency=2',...(smoke?['--frames=0-89']:[])],{stdio:'inherit'});
if(result.error)throw result.error;process.exit(result.status??1);
