import {readFileSync,mkdirSync,copyFileSync} from 'node:fs';
import {dirname,join} from 'node:path';
import {mediaHash} from '../../src/artifacts/media';
import {recentApprovedVisualWorks} from '../../src/content-assets/visual-convergence';
import type {CreativeDirection} from '../../src/content-assets/creative-direction';
import {contentAssetSchema} from '../../src/content-assets/schema';
const inspectionPath='system-audits/cross-cycle-creative-convergence/visual-history-inspection.json';
export const inspectionReference={path:inspectionPath,sha256:mediaHash(inspectionPath)};
/** Synthetic creative judgments over real immutable references; never production evidence. */
export const convergenceFixture=(at='2026-10-03T00:00:00.000Z',exclude='fixture.asset')=>{
 const inspection=JSON.parse(readFileSync(inspectionPath,'utf8')) as {works:{master:{sha256:string};inspectedVisuals:{id:string;sha256:string}[];findings:string[]}[]};
 const works=recentApprovedVisualWorks(at,exclude);
 return {recentAssets:works.map(w=>({contentAsset:w.contentAsset,learnedPrinciple:'Clear causal referents support comprehension.',applicability:'Synthetic test of principle transfer, never a new video.',similarities:['Light/minimal stage where applicable; disciplined hierarchy.'],differences:['Test story and independently authored visual mechanism.'],assessment:'justified-reuse' as const,rationale:'Story and brand principles independently justify this synthetic treatment.',visualComparison:{master:w.master,approval:w.approval,creativeDirection:w.creativeDirection,inspectedVisuals:inspection.works.find(i=>i.master.sha256===w.master.sha256)!.inspectedVisuals,inspectionRecord:inspectionReference,overallImpression:'Synthetic comparison: similar light demonstration stage, with different explanatory objects.',dimensions:[{dimension:'environment and hierarchy',observed:'Actual inspected work findings are retained in the bound report.',proposed:'Light stage and centered causal demonstration for this fixture.',reason:'Separation of causal objects serves the test story.'}],similarityCauses:[{similarity:'Clear centered demonstration',cause:'story-justified' as const,justification:'Fixture story requires stable referents, independently of renderer availability.'},{similarity:'Readable exact caption phrases',cause:'brand-continuity' as const,justification:'Deliberate accessibility and comprehension principle; surface typography remains adaptive.'}]}})),unresolvedConvenienceReuse:[],conclusion:'Synthetic story-first judgment; similarity does not imply failure.',portfolioReview:{selectionRationale:'Four latest available exact approved masters by entry time; exclude self. Synthetic test fixture only.',proposedFeedImpression:'Light explanatory stage, independently selected; resemblance is permitted.',toolingBiasCheck:'Availability gives no creative preference. Materially different media remain eligible and may require an adapter.'}} satisfies CreativeDirection['convergenceReview'];
};
export const recentAssetFixtures=()=>{
 const paths=['content-intelligence/cycles/cycle-4/content-asset.ready.json','content-intelligence/reviews/chocolate-crystal-choice-approved-v3/content-asset.approved.json','content-intelligence/reviews/longitude-clock-approved-v3/content-asset.approved.json','content-intelligence/reviews/phantom-traffic-approved-v3/content-asset.approved.json'];
 return paths.map(p=>contentAssetSchema.parse(JSON.parse(readFileSync(p,'utf8'))));
};
export const copyComparisonEvidence=(root:string,review:CreativeDirection['convergenceReview'])=>{
 const paths=new Set(review.recentAssets.flatMap(r=>[r.visualComparison!.approval.path,...(r.visualComparison!.creativeDirection?[r.visualComparison!.creativeDirection.path]:[]),inspectionPath]));
 for(const path of paths){mkdirSync(dirname(join(root,path)),{recursive:true});copyFileSync(path,join(root,path));}
};
