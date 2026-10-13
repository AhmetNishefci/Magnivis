import {describe,it,expect} from 'vitest';
import configuration from '../content-intelligence/cycles/cycle-14/development-v1/mathematics/configuration.json';
import {faces,topology,counterChoice,enumerate,branches,type DieId} from '../src/production/dice-v4/model';
import {projectedCubeBounds} from '../src/production/dice-v4/projection';
import {poseAt} from '../src/production/dice-v4/choreography';
describe('V4 fixed faces and visual proof model',()=>{
 it('keeps every physical plane and explanatory face token in the verified multiset',()=>{for(const die of configuration.dice){const id=die.id as DieId;expect([...topology[id]].sort()).toEqual([...die.faces].sort());expect(faces[id]).toEqual(die.faces);expect(new Set(topology[id]).size).toBe(new Set(die.faces).size);}});
 it('counts all36indexed pairs for each favored reply and preserves12losses',()=>{for(let i=0;i<counterChoice.length-1;i++){const pairs=enumerate(counterChoice[i+1]!,counterChoice[i]!);expect(pairs).toHaveLength(36);expect(new Set(pairs.map(p=>`${p.winnerFace}:${p.opponentFace}`)).size).toBe(36);expect(pairs.filter(p=>p.win)).toHaveLength(24);expect(pairs.filter(p=>!p.win)).toHaveLength(12);expect(pairs.some(p=>p.tie)).toBe(false);}});
 it('derives progressive mixed route weights from multiplicities',()=>{for(const [kind,b] of Object.entries(branches)){const pairs=enumerate(b.winner,b.opponent),first=pairs.filter(p=>p.win&&p.a===b.firstValue),second=pairs.filter(p=>p.win&&p.a===b.secondValue);expect([first.length,second.length]).toEqual(kind==='green'?[18,6]:[12,12]);expect(first.length+second.length).toBe(24);expect(pairs.filter(p=>!p.win)).toHaveLength(12);}});
 it('does not turn the favored-cycle fact into an all-pairs claim',()=>{expect(enumerate('orange','blue').filter(p=>p.win)).toHaveLength(20);expect(enumerate('yellow','green').filter(p=>p.win)).toHaveLength(18);});
 it('measures the actual shader camera envelope at the flagged transit frame',()=>{const t=1324/30-(43+22/30),view=.20+.08*Math.sin(t*.4),p=poseAt(6,'yellow',t),bounds=projectedCubeBounds(p,view);expect(bounds.x).toBeGreaterThanOrEqual(84);expect(bounds.x+bounds.width).toBeLessThanOrEqual(890);expect(bounds.y).toBeGreaterThanOrEqual(240);});
 it('carries each die from its previous settled position and size',()=>{for(let scene=1;scene<9;scene++)for(const id of counterChoice.slice(0,4)){const a=poseAt(scene-1,id,10),b=poseAt(scene,id,0);expect([b.x,b.y,b.size]).toEqual([a.x,a.y,a.size]);}});
});
