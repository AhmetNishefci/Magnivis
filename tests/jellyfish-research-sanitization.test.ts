import {describe,it,expect} from 'vitest';
import {mediaHash} from '../src/artifacts/media';
import {isExactJellyfishSanitizationReplacement,matchesJellyfishPreservation} from '../scripts/lib/jellyfish-research-sanitization';

const path='content-intelligence/cycles/cycle-21/research/smithsonian.html';
const original='f4d7fcd39f799aad4396177b656ffa916484d9b5b6e558e8c61f19314fabd165';
const sanitized='5f0d1d7038b0c58f9719eb736e980c27b1e8b57011ac48701b0d672220277ed5';
describe('Owner-authorized research sanitization boundary',()=>{
 it('resolves the historical digest to the exact sanitized archive',()=>{
  expect(mediaHash(path)).toBe(sanitized);
  expect(matchesJellyfishPreservation(path,original)).toBe(true);
 });
 it('rejects any further archive alteration',()=>{
  expect(isExactJellyfishSanitizationReplacement(path,original,'0'.repeat(64))).toBe(false);
 });
 it('does not authorize a different original acquisition',()=>{
  expect(isExactJellyfishSanitizationReplacement(path,'0'.repeat(64),sanitized)).toBe(false);
 });
 it('does not transfer the exception to another research file',()=>{
  expect(isExactJellyfishSanitizationReplacement(path.replace('smithsonian','genomics'),original,sanitized)).toBe(false);
 });
});
