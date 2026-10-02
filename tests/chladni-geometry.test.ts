import {describe,expect,it} from 'vitest';
import {grainModes,illustrationModes,modeField,sectionDisplacement,grainsForMode} from '../src/production/chladni-geometry';
import captions from '../src/captions/plans/chladni.json';
import narration from '../src/production/narration/chladni.json';
import asset from '../content-intelligence/cycles/cycle-5/content-asset.ready.json';
describe('Chladni explanatory model fidelity',()=>{
 it('settles every grain near an actual zero of its disclosed spatial field',()=>{
  for(const [i,grains] of grainModes.entries()){
   const [m,n]=illustrationModes[i]!;
   for(const g of grains){expect(Math.abs(modeField(g.targetX,g.targetY,m,n))).toBeLessThan(.025);expect(Math.abs(g.targetX)).toBeLessThanOrEqual(1);expect(Math.abs(g.targetY)).toBeLessThanOrEqual(1);}
  }
 });
 it('keeps the side-view nodes stationary through a complete cycle while adjacent lobes move in opposition',()=>{
  for(let i=0;i<120;i++){const phase=2*Math.PI*i/120;expect(Math.abs(sectionDisplacement(.25,phase))).toBeLessThan(1e-12);expect(Math.abs(sectionDisplacement(.75,phase))).toBeLessThan(1e-12);expect(sectionDisplacement(0,phase)).toBeCloseTo(-sectionDisplacement(.5,phase),12);}
  expect(Math.abs(sectionDisplacement(.5,Math.PI/2))).toBe(1);
 });
 it('is deterministic and retains every exact spoken qualifier in the captions',()=>{
  expect(grainsForMode(1,2,10)).toEqual(grainsForMode(1,2,10));
  const speech=narration.cues.map(c=>c.transcript).join(' ');
  expect(speech).toBe(asset.script.segments.map(s=>s.text).join(' '));
  expect(captions.cues.map(c=>c.lines.join(' ')).join(' ')).toBe(speech);
  expect(speech).toContain('can appear');
  expect(speech).toContain("how it's held");
 });
});
