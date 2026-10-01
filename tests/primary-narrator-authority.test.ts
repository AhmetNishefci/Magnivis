import {describe,it,expect} from 'vitest';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {validateCanonicalNarratorAmendment} from '../scripts/primary-narrator-authority-integrity';
describe('Exact owner-authorized policy amendment preserves historical authority',()=>{
 for(const path of ['AGENTS.md','docs/CREATIVE-DIRECTION.md'])it(`accepts only exact old/new owner-bound bytes: ${path}`,()=>{
  const old=execFileSync('git',['show',`919d18ce20e39209d3279893781669b5d5eeccbd:${path}`]);const current=readFileSync(path);
  expect(validateCanonicalNarratorAmendment(path,old,current)).toBe('exact-owner-authorized-narrator-policy-amendment');
  expect(()=>validateCanonicalNarratorAmendment(path,old,Buffer.concat([current,Buffer.from('unapproved edit')]))).toThrow();
  expect(()=>validateCanonicalNarratorAmendment(path,Buffer.from('rewritten history'),current)).toThrow();
  expect(()=>validateCanonicalNarratorAmendment('artifacts/manifests.json',old,current)).toThrow();
 });
});
