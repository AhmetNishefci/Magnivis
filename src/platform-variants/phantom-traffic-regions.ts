import type {CriticalRegion,PresentationProfile} from './presentation';
import {validatePresentationRegions} from './presentation';
export const phantomTrafficRegions:CriticalRegion[]=[
 {kind:'brand',bounds:{x:150,y:270,width:150,height:28}},
 {kind:'disclosure',bounds:{x:150,y:308,width:620,height:32}},
 {kind:'critical-visual',bounds:{x:130,y:345,width:730,height:1000}},
 {kind:'number',bounds:{x:355,y:740,width:240,height:120}},
 {kind:'caption',bounds:{x:110,y:1418,width:754,height:166}},
 {kind:'decorative',bounds:{x:0,y:0,width:1080,height:1920}},
];
export const assessPhantomTrafficSurface=(profile:PresentationProfile)=>{
 const native=validatePresentationRegions(profile,phantomTrafficRegions);
 const i=profile.insets;
 const containment=i?phantomTrafficRegions.filter(r=>r.kind!=='decorative').map(r=>({kind:r.kind,contained:r.bounds.x>=i.left&&r.bounds.y>=i.top&&r.bounds.x+r.bounds.width<=1080-i.right&&r.bounds.y+r.bounds.height<=1920-i.bottom})):null;
 return {profileId:profile.id,surface:profile.surface,lifecycle:profile.lifecycle,evidenceLevel:profile.evidenceLevel,insets:i,
  nativeAssessment:native,insetContainment:containment,
  captionRegion:profile.captionRegion,exclusionZones:profile.exclusionZones,
  geometryStatus:i?'insets-screened-native-geometry-incomplete':'unmeasured',
  decorativeCroppingAllowed:true,realDeviceReviewRequired:true,platformApprovalGranted:false};
};
