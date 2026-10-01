import {cpSync,mkdtempSync,readFileSync,rmSync,writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {resolve} from 'node:path';
import {describe,expect,it} from 'vitest';
import {chocolateApprovalDirectory,chocolateDirectionDirectory,validateChocolateDirection} from '../scripts/validate-chocolate-direction';
const withCopy=(operation:(direction:string,approval:string)=>void)=>{
  const root=mkdtempSync(resolve(tmpdir(),'magnivis-chocolate-direction-'));const direction=resolve(root,'direction');const approval=resolve(root,'approval');
  try {cpSync(chocolateDirectionDirectory,direction,{recursive:true});cpSync(chocolateApprovalDirectory,approval,{recursive:true});operation(direction,approval);}
  finally {rmSync(root,{recursive:true,force:true});}
};
const mutate=(directory:string,name:string,operation:(value:Record<string,unknown>)=>void)=>{
  const path=resolve(directory,name);const value=JSON.parse(readFileSync(path,'utf8')) as Record<string,unknown>;operation(value);writeFileSync(path,JSON.stringify(value));
};
describe('Chocolate exact editorial approval and direction proposal',()=>{
  it('preserves eight verified statements and requires owner direction approval',()=>{
    expect(validateChocolateDirection()).toMatchObject({passed:true,state:'proposal',alternatives:3,recentVideos:8,beats:8,
      verifiedClaims:8,reserveClaimsUnchanged:34,unresolvedConvenienceReuse:0,productionAuthorized:false});
  });
  it('rejects a creative draft attached to the wrong approved script',()=>withCopy((dir,approval)=>{
    mutate(dir,'direction-v1.json',v=>{v.approvedScriptSha256='0'.repeat(64);});
    expect(()=>validateChocolateDirection(dir,approval)).toThrow(/stale editorial authority/);
  }));
  it('rejects verification metadata rewritten during final approval',()=>withCopy((dir,approval)=>{
    mutate(approval,'knowledge-package.approved.json',v=>{
      const claims=v.claims as Array<{review?:{decisionEnteredAt:string}}>;claims[0]!.review!.decisionEnteredAt='2026-10-02T00:00:00.000Z';
    });
    expect(()=>validateChocolateDirection(dir,approval)).toThrow(/Approved package\/claim metadata/);
  }));
  it('rejects production authority or synthetic owner review time',()=>withCopy((dir,approval)=>{
    mutate(approval,'owner-decision.json',v=>{v.productionAuthorized=true;v.ownerSuppliedReviewTimestamp='2026-10-02T00:00:00Z';});
    expect(()=>validateChocolateDirection(dir,approval)).toThrow();
  }));
  it('rejects unresolved convenience reuse even in proposal',()=>withCopy((dir,approval)=>{
    mutate(dir,'direction-v1.json',v=>{(v.convergenceReview as {unresolvedConvenienceReuse:string[]}).unresolvedConvenienceReuse=['Use the Longitude stage because it exists'];});
    expect(()=>validateChocolateDirection(dir,approval)).toThrow(/convergence\/owner gate/);
  }));
  it('rejects missing model disclosure',()=>withCopy((dir,approval)=>{
    mutate(dir,'comprehension-realization.json',v=>{(v.beats as Array<{disclosure:string}>)[3]!.disclosure='Actual microscopy';});
    expect(()=>validateChocolateDirection(dir,approval)).toThrow(/Scientific prohibition\/disclosure/);
  }));
  it('rejects alternatives that merely repeat one medium',()=>withCopy((dir,approval)=>{
    mutate(dir,'creative-options.json',v=>{const a=v.approaches as Array<{visualMedium:string}>;a[0]!.visualMedium=a[1]!.visualMedium;});
    expect(()=>validateChocolateDirection(dir,approval)).toThrow(/Alternatives repeat/);
  }));
  it('rejects missing historical stories in convergence comparison',()=>withCopy((dir,approval)=>{
    mutate(dir,'recent-content-comparison.json',v=>{(v.comparisons as unknown[]).pop();});
    expect(()=>validateChocolateDirection(dir,approval)).toThrow();
  }));
});
