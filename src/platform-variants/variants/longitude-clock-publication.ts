import {longitudePlatformVariants as prepared} from './longitude-clock';
import {longitudePublicationAuthorization as decision} from '../longitude-publication';
import {sha256Json} from '../../content-intelligence/run-schema';
import {platformVariantSchema} from '../schema';

const reference = {id: decision.id, revision: decision.revision, sha256: sha256Json(decision)};
export const longitudePublicationVariants = prepared.map(variant => platformVariantSchema.parse({
  ...variant, revision: 2, status: 'production-ready', previewStatus: 'owner-risk-accepted',
  cover: variant.platform === 'instagram' ? {...variant.cover, intent: 'Exact prepared original cover authorized for manual publication; unmeasured grid/crop risk accepted, no device pass.'} : variant.cover,
  editorialAdaptationNotes: ['Exact prepared platform copy, narration, captions, sound, assets, fonts, runtime and master bytes preserved.', 'Owner accepts documented local/provisional and unmeasured presentation risks for this release; zero prepublication device passes.', 'Postpublication observations inform future engineering; material remediation requires an explicit owner decision.'],
  productionIntent: {...variant.productionIntent, platformPreviewRequired: false, notes: 'Owner manual publication authorized under accepted presentation uncertainty. Assistant upload, scheduling and publishing remain prohibited.'},
  operatorGuidance: {...variant.operatorGuidance, manualPublication: {visibility: 'public', authorization: reference}, notes: [
    ...variant.operatorGuidance!.notes.filter(note => !note.startsWith('Do not upload/publish') && !note.startsWith('Public visibility')),
    'Owner may manually publish publicly now; no further private/device preview required. This is risk acceptance, not a presentation pass. Automatic cross-posting remains off.',
    'Follow actual live disclosure wording. Transparently disclose synthetic narration when applicable; original animation/H4 reconstruction is not realistic historical footage.',
    ...(variant.platform === 'youtube' ? ['YouTube category is story-specific. Prefer Science & Technology for Longitude; Education only when materially more appropriate among live available categories. No universal Magnivis category.'] : []),
  ]},
  presentationRiskAcceptance: {decision: reference, reason: 'Explicit owner acceptance of remaining documented presentation uncertainty without prepublication real-device review.', realDevicePassGranted: false},
  approval: {approvedBy: decision.owner, decisionEnteredAt: decision.enteredAt, reviewTimeBasis: 'decision-entry', ownerDecision: reference, notes: 'Exact prepared variant authorized for owner manual release with risk acceptance; no verified device or crop approval.'},
}));
