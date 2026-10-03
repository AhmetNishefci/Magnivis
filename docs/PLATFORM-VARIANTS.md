> Current prospective orchestration and gate authority: [WORKFLOW-V3](WORKFLOW-V3.md). Current machine state: [project-state](../workflow/project-state.json). Dated milestones below retain their historical meaning; V3 does not reapprove or rewrite them.

# Platform variants

PlatformVariant V1 is the implemented adaptation layer between a platform-neutral ContentAsset and a concrete production representation. It answers **how this story should be packaged and reviewed for one distribution surface**. It does not upload, schedule, publish, store credentials, or record remote publication state.

The implemented delivery-package operator workflow materializes these definitions without changing their approval state. See `docs/DELIVERY-PACKAGES.md`.

```text
KnowledgePackage → ContentAsset → PlatformVariant → VideoSpec / Remotion
                                                        ↓
                                manual delivery / human publication
                                                        ↓
                                             PublicationRecord
```

## Implemented schema

`src/platform-variants/schema.ts` validates:

- stable variant ID, revision, and ContentAsset reference;
- controlled platform and surface identifiers;
- a dated platform-profile reference;
- language and platform packaging: title, caption, description, hashtags, CTA, and factual claim references;
- editorial adaptation notes;
- target/minimum/maximum duration and aspect ratio;
- a versioned safe-area profile reference;
- cover or thumbnail intent;
- designed-burned-in status, accessibility/native caption behavior, and human-review requirement;
- whether production reuses the master or needs a new render, the exact VideoSpec ID, and platform-preview intent;
- readiness status and approval metadata.

The registry validates ContentAsset references, permits packaging claims only from the asset's selected claims, rejects duplicate IDs or duplicate asset/surface combinations, validates platform/profile/safe-area compatibility, and returns deterministic sorted results.

## Responsibility boundaries

- **KnowledgePackage** owns reusable sources, claims, evidence, uncertainty, and editorial opportunities.
- **ContentAsset** owns the particular story angle, selected hook/claims, traceable script, narrative beats, visual intent, and narration direction.
- **PlatformVariant** owns destination-specific packaging, constraints, safe-area selection, accessibility/native caption behavior, cover intent, and adaptation/readiness notes. Its `designedBurnedIn` flag records whether the selected production contains the required creative caption layer; it is distinct from external/platform caption behavior.
- **VideoSpec / Remotion** owns exact frames, coordinates, cue timing, audio files, animation, and render choreography.
- **PublicationRecord** owns the durable result of a manually completed external publication: account, exact source revisions and hash, settings/disclosures, remote identity, and approval. Upload attempts and idempotency belong to a future publishing integration; none exists today.

A variant may emphasize or omit parts of its asset in packaging, but it may reference only claims already selected by the ContentAsset. It cannot introduce new research or silently change a verified claim.

## Versioned platform knowledge

`src/platform-variants/platform-profiles.ts` contains dated, source-linked compatibility profiles. V1 deliberately validates one conservative Magnivis delivery envelope shared by all four surfaces: 1080×1920, 9:16, 30 fps, MP4/H.264/AAC, and 3–60 seconds. This is a tested internal export target, **not** a claim that every platform has the same complete limits.

Profiles include a review date and source URLs because platform capabilities change. Change a profile revision or add a newly dated profile after reviewing current official documentation; do not bury mutable upload limits in ContentAsset or KnowledgePackage.

V1 references current official documentation for [YouTube Shorts](https://support.google.com/youtube/answer/15424877?hl=en), [TikTok media transfer](https://developers.tiktok.com/docs/en/content-posting-api-media-transfer-guide), [TikTok creator capability checks](https://developers.tiktok.com/docs/en/content-sharing-guidelines), [Meta Reels creative](https://www.facebook.com/business/ads/facebook-instagram-reels-ads), and [Facebook Reels](https://www.facebook.com/help/262748009210134/). These profiles were reviewed on 2026-09-27 and must be rechecked before any publishing adapter is designed.

## Safe-area architecture

`src/design/safe-areas.ts` owns versioned 1080×1920 profiles for the shared vertical master and each V1 surface. `ShortSafeArea` resolves one profile instead of embedding insets in every composition. The master profile preserves the reviewed YouTube Video 004 geometry. TikTok's first private iPhone preview proved the original shared geometry was not a safe union: native top navigation crowded the information block. TikTok therefore has a V2 profile with a 240 px top inset and a dedicated production render, while the shared YouTube master stays byte-identical.

The failed TikTok V1 profile remains registered only as superseded historical platform knowledge and must not be selected for delivery. V2 changes only the top inset from the master's 150 px to 240 px. The 190 px right inset remains unchanged: the Magnivis mark observed in TikTok's right interaction rail is TikTok's native account/profile control, not an in-video watermark that Remotion can reposition. V2 passed private real-device visual/editorial QA on an iPhone 17 Pro Max on 2026-09-27.

Safe areas are internal design profiles based on conservative UI review, not official guarantees. Platform controls, captions, devices, and experiments can move. Each variant therefore records whether an actual platform preview remains required. New compositions should use the master profile when one shared render will serve several destinations and use a platform profile only when making a platform-specific render.

Caption placement regions are additionally validated inside these profiles. A PlatformVariant's `captions.behavior` describes optional accessibility/platform handling; `captions.designedBurnedIn` describes the creative master. New short-form variants require the latter, while historical variants remain truthful to their existing approved masters. See `docs/CAPTIONS.md`.

## Wood Frog variant

Wood Frog has four `editorial-review` variants with `previewStatus: ready-for-private-preview`. Every variant declares `designedBurnedIn: true`, retains a typed chain to ProductionPlan revision 3, CaptionPlan revision 2, and the locked owner-approved master hash, and keeps publication unauthorized.

- **YouTube Shorts revision 4:** reuses the exact master and includes the aligned WebVTT for optional accessibility review.
- **TikTok revision 1:** uses a dedicated derivative render with `safe-area.tiktok-feed.v2`; only the top information region moves down 90 px. The derivative still requires an Only Me/private real-device preview.
- **Instagram Reels revision 1:** reuses the exact master and records the confirmed `@magnivis.media` review context without embedding credentials.
- **Facebook Reels revision 1:** reuses the exact master and explicitly leaves the destination account identity for operator confirmation.

`previewStatus` records readiness for or completion of a private platform preview; it does not promote the variant's editorial/production status. `sourceMaster` binds an exact or safe-area-derivative relationship to the locked creative source. `operatorGuidance` records private visibility, original-audio preservation, disclosure recommendations with mutable-policy caveats, native-caption review, and location/link guidance. These fields are operator instructions, not API actions or publication approval.

## Speed of Light variants

The four V1 variants all reference `speed-of-light.asset.earth-to-proxima`. Each explicitly names its production VideoSpec so delivery resolution remains deterministic:

- **YouTube Shorts:** searchable title and source-aware description; optional reviewed external WebVTT; production-ready because this is a retrospective record of the published, human-reviewed version.
- **TikTok revision 2:** compact first-frame-complementing caption, question CTA, platform-generated captions, and the approved V2 safe-area render. Private Only Me QA confirmed navigation clearance, interaction-rail safety, lower-UI safety, cover crop, audio, animation, and the counter's completed 7.5× value. Revision 1 failed its first real-device review, was never public, and is superseded.
- **Instagram Reels:** save-oriented copy tied to the light-year misconception, profile-grid cover intent, generated captions, and mandatory preview.
- **Facebook Reels:** self-contained explanatory copy and conversational CTA for discovery beyond followers, generated captions, and mandatory preview.

YouTube, Instagram, and Facebook still reuse the original master. TikTok alone uses a dedicated render because a real-platform failure justified the production difference. No editorial facts, narration, timing, sound, or visual storytelling changed. TikTok's `production-ready` state means the exact revision 2 package may be used for a separately approved manual upload; it does not authorize publication.

## Adding a variant

1. Start from an approved or production-ready ContentAsset and choose a supported surface.
2. Review the current official platform documentation; create/revise a dated platform profile only when the validated envelope changes.
3. Choose a registered safe-area profile and write destination-specific packaging only where it improves the adaptation.
4. Reference only claims selected by the ContentAsset.
5. Record caption behavior, cover intent, render reuse/new-render intent, and whether a real platform preview is required.
6. Keep the variant in `draft` or `editorial-review` until human approval; approval metadata is mandatory for approved, production-ready, or archived variants.
7. Register it in `src/platform-variants/registry.ts`, add invariant tests, and connect a VideoSpec only when that production actually implements the variant.

## Intentionally unimplemented

- uploads, OAuth, scheduling, publication, or account automation;
- automated PublicationRecord creation, publication attempts, and idempotency;
- platform API clients or capability discovery;
- automated platform-specific transformation or render orchestration (the operator still renders a declared alternate VideoSpec explicitly);
- databases, queues, workers, services, dashboards, analytics, or monetization/location tooling.

All distribution remains a separate manual, human-approved operation.

## Presentation surfaces and recovery

PlatformVariant does not prove every mobile/web/feed/grid presentation. PLATFORM-QA.md owns the new typed surface/profile/cover/device evidence layer. Original variants and geometry remain historical checkpoint definitions; persisted recovery variants in artifacts/deliveries.json remain draft. Exact recovered artifacts are identified independently in artifacts/manifests.json. YouTube V2 new-production policy is separate from historical V1-bound media; Meta geometry is pending renewed evidence. No derivative is automatically generated.

## Phantom Traffic review variants

Four exact-master variants reference owner-visual-approved ProductionPlan revision 2 and unchanged CaptionPlan revision 1/hash. Status is editorial-review, previewStatus ready-for-private-preview, and platformPreviewRequired true. Presentation records distinguish playback from Instagram grid/Facebook Page/feed and YouTube desktop. No production-ready status or upload permission follows from file readiness.

Registry validation now permits explicitly versioned YouTube V1/V2 bindings: existing V1 variants remain unchanged; new Phantom Traffic selects the documented V2 default with its provisional authority. This changes compatibility routing, not geometry or device trust.

## Adaptive creative direction — future content

Adaptive execution never weakens MASTER → PLATFORM VARIANT → PRESENTATION SURFACE. CreativeDirection records presentation considerations, not measured geometry/device success. New typography/visual treatments still require region, readability and real-device review; unknown geometry stays unknown. Phantom Traffic variants, profiles and QA evidence are unchanged by this system milestone.

## Artifact Architecture V2 — prospective canonical media

`docs/ARTIFACT-ARCHITECTURE-V2.md` now owns canonical binary identity and reference-only Delivery Manifest V3. Prior V1/V2 descriptions above remain historical compatibility behavior. New durable handoffs reference one SHA-256-bound MediaArtifact per unique payload; platform-specific binaries remain supported for presentation quality. State transitions and authorization never copy media. Historical media/package/approval/recovery paths remain exact legacy evidence. Upload resolution: `pnpm exec tsx scripts/resolve-delivery-media.ts <manifest.json>`. Explicit evidence exceptions retain independent review provenance; no historical deletion/migration occurs.
