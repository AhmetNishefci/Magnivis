import {describe,it,expect} from 'vitest';
import {loadMediaRegistry} from '../src/artifacts/media';
import {loadCycle} from '../src/workflow/store';
import {nextAction} from '../src/workflow/cycle';
describe('Cycle #5 actual V3 gate',()=>{
 it('stops the explicitly authorized fifth cycle at master review without changing the fourth release',()=>{
  const registry=loadMediaRegistry();
  const cycle=loadCycle(process.cwd(),'cycle.5',registry),prior=loadCycle(process.cwd(),'cycle.4',registry);
  expect(nextAction(cycle)).toEqual({kind:'owner',gate:'master-review'});
  expect(cycle.masterDecision).toBeNull();expect(cycle.release).toBeNull();expect(cycle.publicationDecision).toBeNull();
  expect(prior.stage).toBe('authorized');expect(prior.revision).toBe(9);
 });
});
