import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {z} from 'zod';
import {sha256Json} from '../src/content-intelligence/run-schema';
import {narratorRevisionDecisionSchema} from '../src/production/longitude-v2-integrity';
const digest=z.string().regex(/^[a-f0-9]{64}$/);
const amendment=z.object({schemaVersion:z.literal(1),sourceCommit:z.literal('919d18ce20e39209d3279893781669b5d5eeccbd'),ownerDecision:z.object({path:z.literal('content-intelligence/reviews/longitude-clock-production-v2/owner-decision.json'),sha256:digest}).strict(),documents:z.array(z.object({path:z.enum(['AGENTS.md','docs/CREATIVE-DIRECTION.md']),historicalSnapshot:z.string(),beforeSha256:digest,afterSha256:digest}).strict()).length(2)}).strict().parse(JSON.parse(readFileSync('system-audits/primary-narrator-policy-v1/authority-amendment.json','utf8')));
const hash=(bytes:Buffer)=>createHash('sha256').update(bytes).digest('hex');
export const validateCanonicalNarratorAmendment=(path:string,historical:Buffer,current:Buffer)=>{
 const row=amendment.documents.find(r=>r.path===path);
 if(!row||hash(historical)!==row.beforeSha256||hash(current)!==row.afterSha256||hash(readFileSync(row.historicalSnapshot))!==row.beforeSha256)throw new Error('Unauthorized authority edit or historical snapshot drift');
 const decision=narratorRevisionDecisionSchema.parse(JSON.parse(readFileSync(amendment.ownerDecision.path,'utf8')));
 if(sha256Json(decision)!==amendment.ownerDecision.sha256)throw new Error('Authority amendment owner binding drift');
 return 'exact-owner-authorized-narrator-policy-amendment' as const;
};
