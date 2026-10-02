import {readFileSync} from 'node:fs';
import {recentApprovedVisualWorks} from '../src/content-assets/visual-convergence';
import {execFileSync} from 'node:child_process';
import {describe,it,expect} from 'vitest';
import {loadMediaRegistry} from '../src/artifacts/media';
import {loadCycle} from '../src/workflow/store';
import {cycleSchema,nextAction} from '../src/workflow/cycle';
describe('Cycle #5 actual V3 gate',()=>{
 it('preserves the first master-review checkpoint of the explicitly authorized fifth cycle without changing the fourth release',()=>{
  const registry=loadMediaRegistry();
  const cycle=cycleSchema.parse(JSON.parse(execFileSync('git',['show','00a5758:workflow/cycles/cycle.5/state.json'],{encoding:'utf8'}))),prior=loadCycle(process.cwd(),'cycle.4',registry);
  expect(nextAction(cycle)).toEqual({kind:'owner',gate:'master-review'});
  expect(cycle.masterDecision).toBeNull();expect(cycle.release).toBeNull();expect(cycle.publicationDecision).toBeNull();
  expect(prior.stage).toBe('authorized');expect(prior.revision).toBe(9);
 });
 it('binds subsequent presentation to the actual owner-approved unchanged master',()=>{
  const cycle=loadCycle(process.cwd(),'cycle.5',loadMediaRegistry());
  const decision=JSON.parse(readFileSync(cycle.masterDecision!.path,'utf8'));
  expect(recentApprovedVisualWorks(decision.enteredAt,'fixture.asset')[0]!.master.sha256).toBe('76fb050dd348c307b07489cf62de3cab59adcd6dfc3eb5b983bc30b584a5c3df');
  expect(cycle.masterDecision?.path).toBe('content-intelligence/cycles/cycle-5/master-owner-decision-v1.json');
  expect(cycle.candidate?.sha256).toBe('4964407447431d51d8f316e3c8129ba56b531ef89a7d4d03af153a59e78022be');
  expect(cycle.release?.path).toBe('content-intelligence/cycles/cycle-5/publication/release-v1.json');
 });
});
