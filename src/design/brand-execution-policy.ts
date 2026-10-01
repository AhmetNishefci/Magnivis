import {z} from 'zod';
import policy from './brand-execution-policy.json';
import adoption from './brand-policy-adoption-baseline.json';
import {sha256Json} from '../content-intelligence/run-schema';
export const executionPolicySchema=z.object({policySha256:z.string().regex(/^[a-f0-9]{64}$/),narrator:z.object({provider:z.string().min(1),voiceId:z.string().min(1),deviationRationale:z.string().trim().min(1).nullable()}).strict(),visualAuthority:z.literal('story-specific'),captionAuthority:z.literal('story-specific'),soundscapeAuthority:z.literal('story-specific'),universalMusicRequired:z.literal(false),durationAuthority:z.literal('story-led'),monetizationOnlyPadding:z.literal(false)}).strict();
export const defaultExecutionPolicy=()=>({policySha256:sha256Json(policy),narrator:{...policy.primaryNarrator,deviationRationale:null},visualAuthority:'story-specific' as const,captionAuthority:'story-specific' as const,soundscapeAuthority:'story-specific' as const,universalMusicRequired:false as const,durationAuthority:'story-led' as const,monetizationOnlyPadding:false as const});
export const validateExecutionPolicy=(input:unknown)=>{
 const record=executionPolicySchema.parse(input);
 if(record.policySha256!==sha256Json(policy))throw new Error('Stale brand execution policy');
 const deviation=record.narrator.provider!==policy.primaryNarrator.provider||record.narrator.voiceId!==policy.primaryNarrator.voiceId;
 if(deviation&&!record.narrator.deviationRationale)throw new Error('Narrator deviation requires a material explicit rationale; topic/domain alone is insufficient');
 if(deviation&&/^(?:different |new )?(?:topic|domain|subject)(?: changed)?[.!]?$/i.test(record.narrator.deviationRationale!))throw new Error('Domain alone cannot justify narrator deviation');
 return record;
};
/** Exact pre-decision plans retain their original semantics, never matching only by ID. */
export const predatesBrandPolicy=(plan:{id:string;revision?:number})=>adoption.some(p=>p.id===plan.id&&p.sha256===sha256Json(plan));
