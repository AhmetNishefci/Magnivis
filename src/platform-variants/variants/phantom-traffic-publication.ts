import {phantomTrafficDeliveryVariants as prepared} from './phantom-traffic-delivery';
import {trafficPublicationAuthorization as decision} from '../phantom-traffic-publication';
import {sha256Json} from '../../content-intelligence/run-schema';
import {platformVariantSchema} from '../schema';
const reference={id:decision.id,revision:decision.revision,sha256:sha256Json(decision)};
export const phantomTrafficPublicationVariants=prepared.map(v=>platformVariantSchema.parse({...v,revision:3,status:'production-ready',previewStatus:'owner-risk-accepted',
 cover:v.platform==='instagram'?{strategy:'custom-image',intent:'Existing original cover selected for publication with unmeasured grid/crop risk explicitly accepted; no device pass.',artifact:{id:'phantom-traffic.instagram-cover.v1',...decision.selectedInstagramCover}}:v.cover,
 editorialAdaptationNotes:['Exact prepared narration, visuals, captions, sound, claims and platform-specific publication copy unchanged.','Owner explicitly authorizes manual publication without completed six-surface prepublication review. All existing evidence remains local/provisional; no real-device pass.','Instagram cover selected for use only. No derivative justified. Postpublication observations require new evidence; no automatic remediation.'],
 productionIntent:{...v.productionIntent,platformPreviewRequired:false,notes:'Owner accepts remaining presentation uncertainty for this exact release. Postpublication surface review remains pending; assistant must not upload.'},
 presentationRiskAcceptance:{decision:reference,reason:'Explicit owner publication authorization accepting skipped prepublication real-device review.',realDevicePassGranted:false},
 approval:{approvedBy:decision.owner,decisionEnteredAt:decision.enteredAt,reviewTimeBasis:'decision-entry',ownerDecision:reference,notes:'Publication release approval under explicitly accepted presentation uncertainty, not a device/presentation pass.'},
}));
