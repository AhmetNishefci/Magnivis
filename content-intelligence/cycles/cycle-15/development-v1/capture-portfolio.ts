/** Read-only selection of canonical recent approved masters; no new media. */
import {writeFileSync} from 'node:fs';
import {recentApprovedVisualWorks} from '../../../../src/content-assets/visual-convergence';
const now=new Date().toISOString();
const works=recentApprovedVisualWorks(now,'flytrap-touch-memory.asset.fading-trace');
writeFileSync('content-intelligence/cycles/cycle-15/development-v1/recent-approved-works.json',JSON.stringify({at:now,works},null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify(works.map(w=>({asset:w.contentAsset.id,master:w.master,approval:w.approval,direction:w.creativeDirection})),null,2));
