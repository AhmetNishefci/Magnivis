/** Read-only canonical decision/history capture for this authorized discovery session. */
import {readFileSync, writeFileSync} from 'node:fs';
import {editorialDecisionContext} from '../../../src/workflow/editorial-learning';
import {loadProjectCycles} from '../../../src/workflow/store';
import {loadMediaRegistry} from '../../../src/artifacts/media';
import {readBoundRecord} from '../../../src/workflow/evidence';
const base = 'content-intelligence/cycles/cycle-14';
const put = (name: string, value: unknown) => writeFileSync(`${base}/${name}.json`, JSON.stringify(value, null, 2) + '\n', {flag: 'wx'});
put('editorial-decision-context', editorialDecisionContext());
put('history-snapshot', loadProjectCycles(process.cwd(), loadMediaRegistry()).filter(c => c.id !== 'cycle.14').map(c => {
 const discovery = c.history.filter(h => h.event === 'discovery').map(h => ({reference: h.evidence, selection: readBoundRecord(h.evidence)}));
 return {id: c.id, revision: c.revision, stage: c.stage, discovery, masterDecisions: c.history.filter(h => h.event === 'owner-decision').map(h => ({reference: h.evidence, decision: readBoundRecord(h.evidence)}))};
}));
const instructions = readFileSync(`${base}/owner-instruction.md`, 'utf8');
if (!instructions.includes('discovery and premise selection review only')) throw new Error('Discovery scope missing');
console.log('Captured all current journal selections and owner decisions; no state mutated.');
