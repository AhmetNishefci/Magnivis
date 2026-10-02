import {describe,it,expect} from 'vitest';
import {adjacentLengthScale,idealSheet,rotatedHalf,nominalPaper,paperRatio} from '../src/production/paper-geometry';
describe('Paper proof geometry',()=>{
 it('preserves ratio after a long-dimension cut and 90-degree turn while halving area',()=>{
  for(const width of [1,340,210]){
   const original=idealSheet(width),half=rotatedHalf(width);
   expect(half.height/half.width).toBeCloseTo(original.height/original.width,12);
   expect(half.width*half.height/(original.width*original.height)).toBeCloseTo(.5,12);
   expect(half.height/original.height).toBeCloseTo(adjacentLengthScale,12);
  }
 });
 it('distinguishes exact ideal ratios from nominal sheet sizes and length from area',()=>{
  expect(adjacentLengthScale**2).toBeCloseTo(.5,12);
  expect(nominalPaper.a4.height/nominalPaper.a4.width).not.toBe(paperRatio);
  expect(nominalPaper.a4.height/nominalPaper.a4.width).toBeCloseTo(paperRatio,3);
  expect(nominalPaper.a4.height/2).not.toBe(nominalPaper.a5.width);
 });
});
