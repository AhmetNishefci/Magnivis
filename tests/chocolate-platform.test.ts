import {describe,it,expect} from 'vitest';
import {readFileSync} from 'node:fs';
import {chocolateMasterDecision as decision,validateChocolateLockedMaster} from '../src/production/chocolate-master-integrity';
import {chocolatePlatformVariants} from '../src/platform-variants/variants/chocolate-crystal-choice';
import {validateDeliveryPackage} from '../scripts/delivery-packages';
import {chocolatePreparedDeliveryDependencies as dependencies} from '../scripts/chocolate-prepared-delivery';
import {applyMasterVisualApproval} from '../src/production/master-approval';
import {productionPlanSchema} from '../src/production/schema';
const root='content-intelligence/reviews/chocolate-crystal-choice-master-lock-v1';
describe('Chocolate exact-byte master approval and pending platform release',()=>{
 it('rejects authority transfer to different master bytes',()=>{const plan=productionPlanSchema.parse(JSON.parse(readFileSync(root+'/production-plan.reviewed.json','utf8')));const bindings=JSON.parse(readFileSync(root+'/reviewed-bindings.json','utf8'));expect(()=>applyMasterVisualApproval({...decision,artifact:{...decision.artifact,sha256:'0'.repeat(64)}},plan,bindings)).toThrow();expect(validateChocolateLockedMaster().ownerMasterApproved).toBe(true);});
 it('keeps all four exact-master packages outside publication eligibility',()=>{const index=JSON.parse(readFileSync('content-intelligence/reviews/chocolate-crystal-choice-platform-v1/delivery-index.json','utf8'));expect(index.packages).toHaveLength(4);for(const e of index.packages){const m=validateDeliveryPackage(e.directory,dependencies);expect(m.publishEligible).toBe(false);expect(m.state).toBe('draft-review');expect(readFileSync(e.directory+'/video.mp4').equals(readFileSync(decision.artifact.path))).toBe(true);}for(const v of chocolatePlatformVariants){expect(v.status).toBe('editorial-review');expect(v.approval).toBeUndefined();}});
});
