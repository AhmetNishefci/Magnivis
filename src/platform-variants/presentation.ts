import {z} from 'zod';
import {digestSchema} from '../artifacts/schema';
export const presentationSurfaceSchema = z.enum(['youtube-shorts-viewer','youtube-shorts-cover','tiktok-feed','tiktok-cover','instagram-reels-playback','instagram-profile-grid','facebook-reels-viewer','facebook-page-feed']);
export const qaStateSchema = z.enum(['NOT_TESTED','LOCAL_APPROXIMATION','PRIVATE_PREVIEW_PENDING','REAL_DEVICE_PASSED','REAL_DEVICE_FAILED','SUPERSEDED']);
export const rectangleSchema = z.object({x:z.number().nonnegative(),y:z.number().nonnegative(),width:z.number().positive(),height:z.number().positive()}).strict();
export const presentationProfileSchema = z.object({
 id:z.string().min(1), platform:z.enum(['youtube','tiktok','instagram','facebook']), surface:presentationSurfaceSchema, revision:z.number().int().positive(),
 lifecycle:z.enum(['ACTIVE','PROVISIONAL','HISTORICAL_SUPERSEDED']), canvas:z.object({width:z.number().positive(),height:z.number().positive()}).strict(),
 insets:z.object({top:z.number().nonnegative(),right:z.number().nonnegative(),bottom:z.number().nonnegative(),left:z.number().nonnegative()}).strict().nullable(),
 captionRegion:rectangleSchema.nullable(), exclusionZones:z.array(rectangleSchema).nullable(),
 reviewedAt:z.iso.datetime().nullable(), reviewDate:z.iso.date().nullable(), deviceObservations:z.array(z.object({device:z.string().nullable(),os:z.string().nullable(),appVersion:z.string().nullable(),observedDate:z.iso.date().nullable(),source:z.string(),state:qaStateSchema}).strict()), source:z.string().min(1), evidenceLevel:z.enum(['git-survivor','owner-historical','reconstructed-policy']),
 qaState:qaStateSchema, trustedForProduction:z.boolean(), notes:z.string().min(1),
}).strict().superRefine((p,c)=>{
 if (p.insets && (p.insets.left+p.insets.right>=p.canvas.width || p.insets.top+p.insets.bottom>=p.canvas.height)) c.addIssue({code:'custom',message:'Insets leave no usable region'});
 if (p.trustedForProduction && (p.qaState!=='REAL_DEVICE_PASSED' || p.lifecycle!=='ACTIVE' || !p.insets)) c.addIssue({code:'custom',message:'Trusted profile requires real device pass and active geometry'});
});
export const presentationQaSchema = z.object({
 id:z.string().min(1), platformVariantId:z.string().min(1), masterArtifactId:z.string().min(1), profileId:z.string().min(1), surface:presentationSurfaceSchema,
 context:z.enum(['mobile-app','desktop-web']), state:qaStateSchema, mediaSha256:digestSchema, coverSha256:digestSchema.nullable(),
 device:z.string().nullable(), os:z.string().nullable(), appVersion:z.string().nullable(), testedAt:z.iso.datetime().nullable(), reviewer:z.string().nullable(), evidence:z.array(z.string()), notes:z.string(),
}).strict().superRefine((r,c)=>{
 if (['REAL_DEVICE_PASSED','REAL_DEVICE_FAILED'].includes(r.state) && (r.context!=='mobile-app' || !r.device || !r.testedAt || !r.reviewer || !r.evidence.length)) c.addIssue({code:'custom',message:'Real-device claim needs a mobile device, reviewer, time and evidence'});
});
export const coverAssetSchema = z.object({
 id:z.string().min(1), platform:z.enum(['youtube','tiktok','instagram','facebook']), surface:presentationSurfaceSchema,
 sourceArtifactId:z.string().min(1), sourceVideoSha256:digestSchema, frame:z.number().int().nonnegative(), crop:rectangleSchema.nullable(), headlineRegion:rectangleSchema.nullable(),
 artifactId:z.string().nullable(), sha256:digestSchema.nullable(), provenance:z.string().min(1), approvalDecisionId:z.string().nullable(), status:z.enum(['planned','review','approved']),
}).strict().superRefine((r,c)=>{if(r.status==='approved' && (!r.sha256 || !r.artifactId || !r.approvalDecisionId)) c.addIssue({code:'custom',message:'Approved cover requires artifact identity and decision'});});
export type PresentationProfile = z.infer<typeof presentationProfileSchema>;
export type PresentationQa = z.infer<typeof presentationQaSchema>;
export type CoverAsset = z.infer<typeof coverAssetSchema>;
export type CriticalRegion = {kind:'hook'|'fact'|'number'|'label'|'caption'|'cta'|'brand'|'decorative'; bounds:z.infer<typeof rectangleSchema>};
const contains = (outer: z.infer<typeof rectangleSchema>, inner: z.infer<typeof rectangleSchema>) => inner.x>=outer.x && inner.y>=outer.y && inner.x+inner.width<=outer.x+outer.width && inner.y+inner.height<=outer.y+outer.height;
const intersects = (a:z.infer<typeof rectangleSchema>,b:z.infer<typeof rectangleSchema>) => a.x<b.x+b.width && b.x<a.x+a.width && a.y<b.y+b.height && b.y<a.y+a.height;
export const validatePresentationRegions = (profile: PresentationProfile, regions: readonly CriticalRegion[]) => {
 presentationProfileSchema.parse(profile);
 if (!profile.insets) return {state:'UNMEASURED',violations:[],unresolved:['surface geometry']};
 const i=profile.insets; const visual={x:i.left,y:i.top,width:profile.canvas.width-i.left-i.right,height:profile.canvas.height-i.top-i.bottom};
 const violations:string[]=[];const unresolved:string[]=[];
 if (profile.exclusionZones===null) unresolved.push('native exclusion zones');
 for (const r of regions) {
  rectangleSchema.parse(r.bounds);
  if (r.kind==='decorative') continue;
  const safe = r.kind==='caption' ? profile.captionRegion : visual;
  if (!safe) {unresolved.push('caption region');continue;}
  if (!contains(safe,r.bounds) || profile.exclusionZones?.some(zone=>intersects(zone,r.bounds))) violations.push(r.kind);
 }
 return {state:violations.length?'FAILED':unresolved.length?'INCOMPLETE':'LOCAL_APPROXIMATION',violations,unresolved:[...new Set(unresolved)]};
};
// Desktop and local simulation never substitute for the exact mobile hash/surface review.
export const realDevicePassed = (records: readonly PresentationQa[], surface: PresentationQa['surface'], hash:string, coverHash:string|null=null) => records.some(r => {
 presentationQaSchema.parse(r);
 return r.surface===surface && r.context==='mobile-app' && r.state==='REAL_DEVICE_PASSED' && r.mediaSha256===hash && r.coverSha256===coverHash;
});
export const assessActiveProfiles = (profiles:readonly PresentationProfile[], regions:readonly CriticalRegion[]) => profiles.filter(p=>p.lifecycle==='ACTIVE').map(p=>({profileId:p.id,...validatePresentationRegions(p,regions),trustedForProduction:p.trustedForProduction}));
export const presentationOutputSchema = z.object({
 strategy:z.enum(['ONE_MASTER','MASTER_PLUS_COVER','SAFE_AREA_DERIVATIVE','SURFACE_DERIVATIVE']),
 masterArtifactId:z.string().min(1),platformVariantId:z.string().min(1),surface:presentationSurfaceSchema,
 coverArtifactId:z.string().nullable(),derivativeArtifactId:z.string().nullable(),evidence:z.array(z.string()),
}).strict().superRefine((output,context)=>{
 const fail=(message:string)=>context.addIssue({code:'custom',message});
 if(output.strategy==='ONE_MASTER'&&(output.coverArtifactId||output.derivativeArtifactId))fail('One master cannot silently include adaptation');
 if(output.strategy==='MASTER_PLUS_COVER'&&(!output.coverArtifactId||output.derivativeArtifactId))fail('Cover strategy requires an independent cover');
 if(['SAFE_AREA_DERIVATIVE','SURFACE_DERIVATIVE'].includes(output.strategy)&&(!output.derivativeArtifactId||!output.evidence.length))fail('Derivative requires its own identity and demonstrated need');
});
export type PresentationOutput=z.infer<typeof presentationOutputSchema>;
