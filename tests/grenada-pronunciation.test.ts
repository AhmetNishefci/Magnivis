import {describe,expect,it} from 'vitest';
import {correctGrenadaPhonemes} from '../src/ai/grenada-pronunciation';
describe('explicit Grenada pronunciation repair',()=>{
 it('repairs every authorized occurrence while retaining unrelated phonemes and possessive',()=>{
  expect(correctGrenadaPhonemes("Grenada and Grenada's",'x ɡɹɛnˈɑːdə ænd ɡɹɛnˈɑːdəz y')).toEqual({phonemes:'x ɡɹənˈeɪdə ænd ɡɹənˈeɪdəz y',occurrences:2});
 });
 it('rejects text without the scoped word',()=>expect(()=>correctGrenadaPhonemes('Granada','ɡɹɛnˈɑːdə')).toThrow());
 it('rejects absent or mismatched baseline rather than silently rewriting',()=>{
  expect(()=>correctGrenadaPhonemes('Grenada','ɡɹənˈeɪdə')).toThrow();
  expect(()=>correctGrenadaPhonemes('Grenada and Grenada','ɡɹɛnˈɑːdə')).toThrow();
 });
});
