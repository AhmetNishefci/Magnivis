import {describe,it,expect} from 'vitest';
import {readFileSync} from 'node:fs';
import {chocolatePublicationAuthorizationSchema,validateChocolatePublicationAuthorization} from '../src/platform-variants/chocolate-publication';
import {chocolatePublicationVariants} from '../src/platform-variants/variants/chocolate-crystal-choice-publication';
import {validateDeliveryPackage} from '../scripts/delivery-packages';
import {chocolatePublicationDeliveryDependencies as dependencies} from '../scripts/chocolate-publication-delivery';
describe('Chocolate owner-only release with accepted presentation uncertainty',()=>{
 it('rejects assistant publication permission and invented prepublication device passes',()=>{const d=validateChocolatePublicationAuthorization();expect(()=>chocolatePublicationAuthorizationSchema.parse({...d,assistantUploadAuthorized:true})).toThrow();expect(()=>chocolatePublicationAuthorizationSchema.parse({...d,realDevicePrepublicationReviewCompleted:true})).toThrow();expect(()=>chocolatePublicationAuthorizationSchema.parse({...d,metadata:{...d.metadata,device:'Invented device'}})).toThrow();});
 it('makes four final packages eligible while preserving exact approved video bytes',()=>{const d=validateChocolatePublicationAuthorization();const b=JSON.parse(readFileSync('content-intelligence/reviews/chocolate-crystal-choice-publication-v1/final-bindings.json','utf8'));expect(b.packages).toHaveLength(4);for(const p of b.packages){const m=validateDeliveryPackage(p.directory,dependencies);expect(m.publishEligible).toBe(true);expect(m.state).toBe('ready-for-manual-upload');expect(readFileSync(p.uploadFile).equals(readFileSync(d.master.path))).toBe(true);}for(const v of chocolatePublicationVariants){expect(v.status).toBe('production-ready');expect(v.previewStatus).toBe('owner-risk-accepted');expect(v.productionIntent.platformPreviewRequired).toBe(false);expect(v.presentationRiskAcceptance?.realDevicePassGranted).toBe(false);}});
});
