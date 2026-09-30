import {readFileSync,writeFileSync,mkdtempSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {validateMotionInspection} from '../src/motion-proof/millennium-bridge/inspection';
import {beforeAll, describe, expect, it} from 'vitest';
import {validateBApproval} from '../src/motion-proof/millennium-bridge/approval';
import {motionState, proofSize, proofSamples} from '../src/motion-proof/millennium-bridge/model';
import {prepareProofInputs, renderProofFrame, openingDisplacement, type ProofInputs} from '../src/motion-proof/millennium-bridge/composition';
import {fileSha256} from '../src/design-exploration/raster-source';
import {warpRaster} from '../src/motion-proof/continuous-raster';
let inputs:ProofInputs;
beforeAll(async()=>{inputs=await prepareProofInputs();});
describe('Hash-bound B approval and controlled opening proof',()=>{
  it('binds current owner approval without full production authority',()=>{
    const decision=validateBApproval();
    expect(decision.authority.controlledOpeningMotionProof).toBe(true);
    expect(decision.authority.completeVideo).toBe(false);
    expect(decision.authority.finalCaptionPlan).toBe(false);
    expect(decision.authority.metaReconstruction).toBe(false);
    expect(()=>validateBApproval({...decision,manifestFileSha256:'0'.repeat(64)})).toThrow('manifest identity');
    expect(()=>validateBApproval({...decision,authority:{...decision.authority,completeVideo:true}})).toThrow();
  });
  it('starts support motion before compensation and free-foot search',()=>{
    const early=motionState(8),reaction=motionState(15),search=motionState(36),placed=motionState(45);
    expect(early.deck).toBeGreaterThan(10);
    expect(Math.abs(early.torso)).toBe(0);
    expect(early.step).toBe(0);
    expect(reaction.torso).toBeLessThan(0);
    expect(reaction.step).toBe(0);
    expect(search.step).toBeGreaterThan(0);
    expect(search.lift).toBeGreaterThan(0);
    expect(placed.step).toBe(14);
    expect(placed.lift).toBe(0);
  });
  it('restricts render authority to 180 frames and explicit nearest-frame samples',()=>{
    expect(proofSize.durationSeconds).toBe(6);
    expect(()=>motionState(180)).toThrow('authorized');
    expect(()=>motionState(-1)).toThrow();
    expect(()=>motionState(.5)).toThrow();
    expect(proofSamples[1].frame).toBe(8);
    expect(proofSamples.at(-1)?.frame).toBe(179);
  });
  it('keeps planted contact displacement close to adjacent support',()=>{
    for(const frame of [8,17,30,36,45]){
      const sole=openingDisplacement(inputs,frame,361,1183);
      const support=openingDisplacement(inputs,frame,361,1220);
      expect(Math.abs(sole.dx-support.dx)).toBeLessThan(3);
      expect(Math.abs(sole.dy)).toBeLessThan(.5);
    }
  });
  it('keeps the continuous inverse field orientation without foldovers in sampled opening region',()=>{
    let minimum=Infinity;
    for(let frame=0;frame<=90;frame+=3)for(let y=300;y<1300;y+=24)for(let x=200;x<900;x+=24){
      const p=openingDisplacement(inputs,frame,x,y),px=openingDisplacement(inputs,frame,x+2,y),py=openingDisplacement(inputs,frame,x,y+2);
      const determinant=(1-(px.dx-p.dx)/2)*(1-(py.dy-p.dy)/2)-(py.dx-p.dx)*(px.dy-p.dy)/4;
      minimum=Math.min(minimum,determinant);
    }
    expect(minimum).toBeGreaterThan(.25);
  });
  it('retains exact approved source bytes with single-channel authored influence masks',()=>{
    expect(inputs.selected).toHaveLength(2);
    for(const selected of inputs.selected)expect(fileSha256(selected.bytes)).toBe(selected.source.sha256);
    for(const mask of Object.values(inputs.masks))expect(mask.length).toBe(1080*1920);
  });
  it('repeats byte-identical rendered frames and actually changes early motion',()=>{
    const first=renderProofFrame(inputs,8);
    expect(renderProofFrame(inputs,8).equals(first)).toBe(true);
    expect(renderProofFrame(inputs,0).equals(first)).toBe(false);
    expect(first.length).toBe(1080*1920*4);
    expect(motionState(123).macroMix).toBeCloseTo(.5);
    expect(motionState(179).macroMix).toBe(1);
  },10000);
  it('preserves opaque pixels and enforces matching composition buffers',()=>{
    const raster={width:4,height:4,rgba:new Uint8Array(4*4*4).fill(100)};
    const output=warpRaster(raster,()=>({dx:0,dy:0}),{scale:1,x:2,y:2});
    expect(output.length).toBe(64);
    for(let i=3;i<output.length;i+=4)expect(output[i]).toBe(255);
  });
  it('records prototype-only provenance, masks and silent media with no temporal generation',()=>{
    const dir='motion-reviews/millennium-bridge-opening-proof-v1/';
    const manifest=JSON.parse(readFileSync(`${dir}manifest.json`,'utf8'));
    expect(manifest.authority.motionProofApproved).toBe(false);
    expect(manifest.provenance.independentAIFrames).toBe(false);
    expect(manifest.provenance.newGeneratedAssets).toBe(false);
    expect(fileSha256(readFileSync(`${dir}opening-proof.mp4`))).toBe(manifest.mp4.sha256);
    const report=JSON.parse(readFileSync(`${dir}media-report.json`,'utf8'));
    expect(report.passed).toBe(true);
    expect(report.observed.streams.some((s:{codec_type:string})=>s.codec_type==='audio')).toBe(false);
  });
  it('binds visual sample inspection to the exact MP4 and denies stale/new approval',()=>{
    const dir='motion-reviews/millennium-bridge-opening-proof-v1';
    const inspection=validateMotionInspection(dir);
    expect(inspection.artifacts).toHaveLength(13);
    expect(inspection.ownerMotionApproval).toBe(false);
    const temp=mkdtempSync(join(tmpdir(),'magnivis-motion-inspection-'));
    try {
      for(const path of ['local-qa.json','local-qa.sha256'])writeFileSync(join(temp,path),readFileSync(join(dir,path)));
      writeFileSync(join(temp,'opening-proof.mp4'),'changed');
      expect(()=>validateMotionInspection(temp)).toThrow('inspection is stale');
    } finally {rmSync(temp,{recursive:true,force:true});}
  });

});
