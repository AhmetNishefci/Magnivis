import {describe, expect, it} from 'vitest';
import {readFileSync} from 'node:fs';
import {longitudePublicationAuthorizationSchema, validateLongitudePublicationAuthorization} from '../src/platform-variants/longitude-publication';
import {longitudePublicationVariants as variants} from '../src/platform-variants/variants/longitude-clock-publication';
import {longitudePlatformVariants as prepared} from '../src/platform-variants/variants/longitude-clock';
import {platformVariantSchema} from '../src/platform-variants/schema';
import {deliveryManifestSchema} from '../src/delivery/schema';
import {createUploadCopy, validateDeliveryPackage} from '../scripts/delivery-packages';
import {youtubeCategoryPolicySchema, youtubeCategoryPolicy} from '../src/platform-variants/youtube-category-policy';

describe('Longitude owner manual release with accepted presentation uncertainty', () => {
  it('binds the exact approved master and prepared inputs without asserting publication', () => {
    expect(validateLongitudePublicationAuthorization()).toMatchObject({decision: 'PUBLICATION AUTHORIZED', masterArtifactId: 'longitude-clock.locked-master.v2', publicationOccurred: false, assistantUploadAuthorized: false, realDevicePassesGranted: []});
  });
  it('rejects invented devices, review timestamps, passes or assistant publication authority', () => {
    const decision = validateLongitudePublicationAuthorization();
    for (const field of ['realDevicePrepublicationReviewCompleted', 'assistantUploadAuthorized', 'publicationOccurred', 'coverDeviceApprovalGranted']) expect(longitudePublicationAuthorizationSchema.safeParse({...decision, [field]: true}).success).toBe(false);
    expect(longitudePublicationAuthorizationSchema.safeParse({...decision, metadata: {...decision.metadata, device: 'Imaginary device'}}).success).toBe(false);
    expect(longitudePublicationAuthorizationSchema.safeParse({...decision, ownerSuppliedReviewTimestamp: decision.enteredAt}).success).toBe(false);
    expect(longitudePublicationAuthorizationSchema.safeParse({...decision, platforms: ['youtube', 'youtube', 'instagram', 'facebook']}).success).toBe(false);
  });
  it('preserves distinct copy and exact media while promoting matching explicit risk acceptance', () => {
    for (const variant of variants) {
      const previous = prepared.find(p => p.id === variant.id)!;
      expect(variant.packaging).toEqual(previous.packaging);
      expect(variant.sourceMaster).toEqual(previous.sourceMaster);
      expect(variant).toMatchObject({revision: 2, status: 'production-ready', previewStatus: 'owner-risk-accepted', productionIntent: {platformPreviewRequired: false, renderStrategy: 'reuse-existing-master'}});
      expect(platformVariantSchema.safeParse({...variant, presentationRiskAcceptance: undefined}).success).toBe(false);
      expect(platformVariantSchema.safeParse({...variant, operatorGuidance: {...variant.operatorGuidance, manualPublication: {...variant.operatorGuidance!.manualPublication!, authorization: {...variant.operatorGuidance!.manualPublication!.authorization, sha256: '0'.repeat(64)}}}}).success).toBe(false);
      expect(createUploadCopy(variant)).toContain('Visibility: public (owner manual publication');
    }
  });
  it('does not permit public guidance in draft/private-only handoffs', () => {
    expect(platformVariantSchema.safeParse({...prepared[0], operatorGuidance: {...prepared[0]!.operatorGuidance, manualPublication: variants[0]!.operatorGuidance!.manualPublication}}).success).toBe(false);
    const path = 'artifacts/deliveries/longitude-clock-publication-v1/longitude-clock-locked/youtube-shorts';
    const manifest = validateDeliveryPackage(path);
    expect(manifest).toMatchObject({state: 'ready-for-manual-upload', publishEligible: true, review: {previewStatus: 'owner-risk-accepted', publicationAuthorized: false}});
    expect(deliveryManifestSchema.safeParse({...manifest, state: 'draft-review', publishEligible: false}).success).toBe(false);
  });
  it('forbids a permanent YouTube category and retains story-level preference', () => {
    expect(youtubeCategoryPolicy.defaultCategory).toBeNull();
    for (const category of ['Education', 'Science & Technology']) expect(youtubeCategoryPolicySchema.safeParse({...youtubeCategoryPolicy, defaultCategory: category}).success).toBe(false);
    expect(createUploadCopy(variants.find(v => v.platform === 'youtube')!)).toContain('Science & Technology');
  });
  it('keeps original cover identity and unmeasured crop separate from selection approval', () => {
    const original = JSON.parse(readFileSync('artifacts/longitude-clock-cover-assets.json', 'utf8'))[0];
    const selected = JSON.parse(readFileSync('content-intelligence/reviews/longitude-clock-publication-v1/cover-selection.json', 'utf8'));
    expect(selected).toMatchObject({id: original.id, sha256: original.sha256, crop: null, status: 'approved'});
    expect(original.status).toBe('review');
  });
});
