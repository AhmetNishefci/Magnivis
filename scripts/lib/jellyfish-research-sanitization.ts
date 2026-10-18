import {readFileSync} from 'node:fs';
import {mediaHash} from '../../src/artifacts/media';
import {readBoundRecord} from '../../src/workflow/evidence';

// One owner-authorized security amendment. Historical acquisition/QA/baselines
// retain their original hashes; no blanket exception for research or scripts.
export const jellyfishSanitizationReference={
 path:'content-intelligence/cycles/cycle-21/research/archive-sanitization-v1.json',
 sha256:'e8b1bc11ce2f58f8b87cff31d43053901d0b53de2fb27692597fcd35cde398bc',
};
type Amendment={
 kind:'owner-authorized-security-redaction';
 substitutions:{path:string;originalSha256:string;currentSha256:string}[];
 ownerInstruction:{path:string;sha256:string};
};
const amendment=readBoundRecord(jellyfishSanitizationReference) as Amendment;
if(amendment.kind!=='owner-authorized-security-redaction'||!Array.isArray(amendment.substitutions)||amendment.substitutions.length!==3||mediaHash(amendment.ownerInstruction.path)!==amendment.ownerInstruction.sha256||!readFileSync(amendment.ownerInstruction.path,'utf8').includes('OWNER APPROVAL GRANTED — IMPLEMENT.'))throw new Error('Invalid security-redaction authority');
export const isExactJellyfishSanitizationReplacement=(path:string,originalSha256:string,currentSha256:string)=>amendment.substitutions.some(file=>file.path===path&&file.originalSha256===originalSha256&&file.currentSha256===currentSha256);
export const matchesJellyfishPreservation=(path:string,expectedSha256:string)=>{
 const actual=mediaHash(path);
 return actual===expectedSha256||isExactJellyfishSanitizationReplacement(path,expectedSha256,actual);
};
