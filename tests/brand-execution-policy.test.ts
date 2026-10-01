import {execFileSync} from 'node:child_process';
import adoption from '../src/design/brand-policy-adoption-baseline.json';
import {sha256Json} from '../src/content-intelligence/run-schema';
import {describe,it,expect} from 'vitest';
import {defaultExecutionPolicy,validateExecutionPolicy,predatesBrandPolicy} from '../src/design/brand-execution-policy';
import plan from '../src/production/plans/longitude-clock.json';
describe('Primary narrator without aesthetic or sound templating',()=>{
 it('defaults to af_heart with independent story-specific execution and runtime',()=>{expect(validateExecutionPolicy(defaultExecutionPolicy())).toMatchObject({narrator:{voiceId:'af_heart'},universalMusicRequired:false,durationAuthority:'story-led'});});
 it('requires material rationale for another narrator but permits deliberate evolution or requirements',()=>{
  const p=defaultExecutionPolicy();p.narrator.voiceId='bf_emma';
  expect(()=>validateExecutionPolicy(p)).toThrow('rationale');
  expect(()=>validateExecutionPolicy({...p,narrator:{...p.narrator,deviationRationale:'Different domain'}})).toThrow('Domain');
  expect(validateExecutionPolicy({...p,narrator:{...p.narrator,deviationRationale:'Quotation character differentiation required by approved editorial treatment'}}).narrator.voiceId).toBe('bf_emma');
 });
 it('rejects fixed sound, universal music, fixed visual/caption treatment and monetization-only padding',()=>{
  const p=defaultExecutionPolicy();
  for(const [field,value] of [['soundscapeAuthority','fixed'],['visualAuthority','fixed'],['captionAuthority','fixed'],['universalMusicRequired',true],['durationAuthority','monetization-threshold'],['monetizationOnlyPadding',true]])expect(()=>validateExecutionPolicy({...p,[field as string]:value})).toThrow();
 });
 it('binds every adoption exception to exact pre-decision Git bytes',()=>{
  expect(adoption.map(a=>a.path).sort()).toEqual(['src/production/plans/longitude-clock.json','src/production/plans/phantom-traffic.json']);
  for(const a of adoption)expect(sha256Json(JSON.parse(execFileSync('git',['show',`919d18ce20e39209d3279893781669b5d5eeccbd:${a.path}`],{encoding:'utf8'})))).toBe(a.sha256);
 });
 it('preserves only exact pre-policy plans and rejects stale/missing policy',()=>{
  expect(predatesBrandPolicy(plan)).toBe(true);expect(predatesBrandPolicy({...plan,revision:99})).toBe(false);
  expect(()=>validateExecutionPolicy(undefined)).toThrow();expect(()=>validateExecutionPolicy({...defaultExecutionPolicy(),policySha256:'0'.repeat(64)})).toThrow('Stale');
 });
});
