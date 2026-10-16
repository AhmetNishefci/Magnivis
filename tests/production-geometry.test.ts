import {describe,it,expect} from 'vitest';
import {inspectRenderedBounds} from '../src/production/qa/geometry';
import {codeGeometry,codePosition,referenceBranch} from '../src/production/voyager-v2/model';
const safe={x:84,y:240,width:806,height:1370};
describe('Production bounds inspection',()=>{
 it('detects actual critical labels as well as legacy label tags',()=>{expect(inspectRenderedBounds([{...safe,width:200,height:50,kind:'critical',text:'Heading'},{x:100,y:260,width:150,height:40,kind:'label',text:'Second label'}],safe)).toContain('Text overlap: Heading / Second label');});
 it('rejects SVG bounds outside the inset and visual obstruction of captions',()=>{const bounds=[{x:70,y:800,width:200,height:200,kind:'critical-visual',text:'Failed chip'},{x:120,y:1450,width:700,height:140,kind:'caption-midpoint',text:'Speech'},{x:500,y:1430,width:240,height:100,kind:'critical-visual',text:'Code section'}];expect(inspectRenderedBounds(bounds,safe)).toEqual(expect.arrayContaining(['Safe-region collision: Failed chip','Critical visual overlaps caption: Code section']));});
 it('does not mistake intended overlapping diagram regions for conflicting speech labels',()=>{expect(inspectRenderedBounds([{x:570,y:620,width:270,height:104,kind:'critical-visual',text:'Working memory'},{x:585,y:640,width:240,height:64,kind:'critical-visual',text:'Instructions'}],safe)).toEqual([]);});
});
describe('Voyager relocation continuity',()=>{
 it('keeps sections constant and joined code genuinely too tall for one location',()=>{expect(codeGeometry.joinedHeight).toBe(codeGeometry.sectionHeight*3);expect(codeGeometry.joinedHeight).toBeGreaterThan(codeGeometry.destinationHeight);expect(codeGeometry.sectionHeight).toBeLessThan(codeGeometry.destinationHeight);expect(codeGeometry.width).toBeLessThan(codeGeometry.destinationWidth);for(let i=0;i<3;i++){expect(codePosition(2,140,i)).toEqual(codePosition(3,0,i));expect(codePosition(3,70,i)).toEqual(codePosition(4,0,i));}});
 it('connects every reference branch to its actual code section and preserves the destination',()=>{for(let i=0;i<3;i++){const p=codePosition(4,180,i),r=referenceBranch(i);expect(r.end).toEqual({x:p.x,y:p.y+codeGeometry.sectionHeight/2});expect(p.y).toBeGreaterThan(codeGeometry.destinationYs[i]!);expect(p.y+codeGeometry.sectionHeight).toBeLessThan(codeGeometry.destinationYs[i]!+codeGeometry.destinationHeight);}});
});
