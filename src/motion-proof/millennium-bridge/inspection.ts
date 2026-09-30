import {readFileSync,writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {z} from 'zod';
import {fileSha256 as hash} from '../../design-exploration/raster-source';
import {stableJson} from '../../content-intelligence/run-schema';
import {proofSamples} from './model';
const paths=['opening-proof.mp4','contact-sheet.png',...proofSamples.map(({frame})=>`decoded/frame-${String(frame).padStart(3,'0')}.jpg`)];
const schema=z.object({kind:z.literal('local-ai-assisted-motion-proof-sample-inspection'),inspectedBy:z.literal('Codex'),inspectedAt:z.iso.datetime(),method:z.literal('Inspected exact decoded MP4 frame samples and contact sheet; full decode checked separately. Tool inspection is sequential frames, not continuous video playback.'),artifacts:z.array(z.object({path:z.string(),sha256:z.string().regex(/^[a-f0-9]{64}$/)}).strict()).length(13),findings:z.array(z.string().min(1)).min(1),ownerMotionApproval:z.literal(false),realDeviceEvidence:z.literal(false),completeVideoAuthorized:z.literal(false)}).strict();
export const writeMotionInspection=(directory:string,inspectedAt:string,findings:string[])=>{
  const value=schema.parse({kind:'local-ai-assisted-motion-proof-sample-inspection',inspectedBy:'Codex',inspectedAt,method:'Inspected exact decoded MP4 frame samples and contact sheet; full decode checked separately. Tool inspection is sequential frames, not continuous video playback.',artifacts:paths.map((path)=>({path,sha256:hash(readFileSync(resolve(directory,path)))})),findings,ownerMotionApproval:false,realDeviceEvidence:false,completeVideoAuthorized:false});
  const bytes=Buffer.from(`${stableJson(value,2)}\n`);writeFileSync(resolve(directory,'local-qa.json'),bytes);writeFileSync(resolve(directory,'local-qa.sha256'),`${hash(bytes)}  local-qa.json\n`);
};
export const validateMotionInspection=(directory:string)=>{
  const bytes=readFileSync(resolve(directory,'local-qa.json'));const inspection=schema.parse(JSON.parse(bytes.toString()));
  if(readFileSync(resolve(directory,'local-qa.sha256'),'utf8')!==`${hash(bytes)}  local-qa.json\n`)throw new Error('Motion inspection identity changed');
  if(new Set(inspection.artifacts.map((a)=>a.path)).size!==13||!paths.every((path)=>inspection.artifacts.some((a)=>a.path===path)))throw new Error('Motion inspection missing required samples');
  for(const artifact of inspection.artifacts)if(hash(readFileSync(resolve(directory,artifact.path)))!==artifact.sha256)throw new Error('Motion visual inspection is stale');
  return inspection;
};
