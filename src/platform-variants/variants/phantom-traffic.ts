import {phantomTrafficProductionPlan as plan} from '../../production/plans/phantom-traffic';
import {phantomTrafficContentAsset as asset} from '../../content-assets/assets/phantom-traffic';
import {platformProfileIds} from '../platform-profiles';
import {safeAreaProfileIds} from '../../design/safe-areas';
import {platformVariantSchema,type Platform} from '../schema';
const destinations=[
 {platform:'youtube',surface:'youtube-shorts',profile:platformProfileIds.youtubeShorts,safe:safeAreaProfileIds.youtubeShortsV2},
 {platform:'tiktok',surface:'tiktok-feed',profile:platformProfileIds.tiktokFeed,safe:safeAreaProfileIds.tiktokFeed},
 {platform:'instagram',surface:'instagram-reels',profile:platformProfileIds.instagramReels,safe:safeAreaProfileIds.instagramReels},
 {platform:'facebook',surface:'facebook-reels',profile:platformProfileIds.facebookReels,safe:safeAreaProfileIds.facebookReels},
] as const;
const approval=plan.visualApproval;
if(!approval)throw new Error('Phantom Traffic variants require exact master visual approval');
export const phantomTrafficPlatformVariantId=(platform:Platform)=>`${asset.id}.variant.${destinations.find(d=>d.platform===platform)!.surface}`;
export const phantomTrafficPlatformVariants=destinations.map(d=>platformVariantSchema.parse({
 id:phantomTrafficPlatformVariantId(d.platform),revision:1,contentAssetId:asset.id,platform:d.platform,surface:d.surface,platformProfileId:d.profile,
 language:'en',packaging:{title:'The Traffic Jam With Nothing at the Front',claimIds:asset.selectedClaimIds},
 editorialAdaptationNotes:['Exact owner-approved master reused with unchanged narration, captions, disclosures, science and motion.',
  'Local profile screening is incomplete: native exclusions and caption-specific geometry remain unknown. Phantom Traffic-specific real-device evidence is required.',
  d.platform==='instagram'?'Reel playback and profile/grid are independent. Dedicated original cover candidate requires review; crop remains unknown.':d.platform==='facebook'?'Dedicated Reel viewer and Page/feed are independent; no feed derivative without measured need.':'Historical profile knowledge is not approval of this media.'],
 duration:{targetSeconds:plan.format.durationSeconds,minimumSeconds:3,maximumSeconds:60},aspectRatio:'9:16',safeAreaProfileId:d.safe,
 cover:{strategy:d.platform==='instagram'?'custom-image':'frame-selection',intent:d.platform==='instagram'?'Test original cover candidate phantom-traffic.instagram-cover.v1 independently on profile/grid; no measured crop claimed.':'Frame selection remains operator/device-review dependent; no extra cover generated.'},
 captions:{behavior:'burned-in',designedBurnedIn:true,language:'en',humanReviewRequired:true},
 productionIntent:{renderStrategy:'reuse-existing-master',videoSpecId:'phantom-traffic',platformPreviewRequired:true,notes:'Use exact locked MP4. No assistant upload or publication authorized. Review on-device; surface results remain pending.'},
 previewStatus:'ready-for-private-preview',sourceMaster:{videoSpecId:'phantom-traffic',artifact:approval.artifact,productionPlan:{id:plan.id,revision:plan.revision},captionPlan:approval.captionPlan,relationship:'exact-master'},
 status:'editorial-review',
}));
