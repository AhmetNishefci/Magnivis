# Platform variants

PlatformVariant V1 is the implemented adaptation layer between a platform-neutral ContentAsset and a concrete production representation. It answers **how this story should be packaged and reviewed for one distribution surface**. It does not upload, schedule, publish, store credentials, or record remote publication state.

```text
KnowledgePackage → ContentAsset → PlatformVariant → VideoSpec / Remotion
                                                        ↓
                                         future PublicationRecord
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
- caption behavior and human-review requirement;
- whether production reuses the master or needs a new render, plus platform-preview intent;
- readiness status and approval metadata.

The registry validates ContentAsset references, permits packaging claims only from the asset's selected claims, rejects duplicate IDs or duplicate asset/surface combinations, validates platform/profile/safe-area compatibility, and returns deterministic sorted results.

## Responsibility boundaries

- **KnowledgePackage** owns reusable sources, claims, evidence, uncertainty, and editorial opportunities.
- **ContentAsset** owns the particular story angle, selected hook/claims, traceable script, narrative beats, visual intent, and narration direction.
- **PlatformVariant** owns destination-specific packaging, constraints, safe-area selection, caption behavior, cover intent, and adaptation/readiness notes.
- **VideoSpec / Remotion** owns exact frames, coordinates, cue timing, audio files, animation, and render choreography.
- A future **PublicationRecord** will own upload/publication state, remote identifiers, attempts, and idempotency. No such record or publishing integration exists today.

A variant may emphasize or omit parts of its asset in packaging, but it may reference only claims already selected by the ContentAsset. It cannot introduce new research or silently change a verified claim.

## Versioned platform knowledge

`src/platform-variants/platform-profiles.ts` contains dated, source-linked compatibility profiles. V1 deliberately validates one conservative Magnivis delivery envelope shared by all four surfaces: 1080×1920, 9:16, 30 fps, MP4/H.264/AAC, and 3–60 seconds. This is a tested internal export target, **not** a claim that every platform has the same complete limits.

Profiles include a review date and source URLs because platform capabilities change. Change a profile revision or add a newly dated profile after reviewing current official documentation; do not bury mutable upload limits in ContentAsset or KnowledgePackage.

V1 references current official documentation for [YouTube Shorts](https://support.google.com/youtube/answer/15424877?hl=en), [TikTok media transfer](https://developers.tiktok.com/docs/en/content-posting-api-media-transfer-guide), [TikTok creator capability checks](https://developers.tiktok.com/docs/en/content-sharing-guidelines), [Meta Reels creative](https://www.facebook.com/business/ads/facebook-instagram-reels-ads), and [Facebook Reels](https://www.facebook.com/help/262748009210134/). These profiles were reviewed on 2026-09-27 and must be rechecked before any publishing adapter is designed.

## Safe-area architecture

`src/design/safe-areas.ts` owns versioned 1080×1920 profiles for the shared vertical master and each V1 surface. `ShortSafeArea` resolves one profile instead of embedding insets in every composition. The master profile is a conservative union whose usable content area fits inside every V1 platform area and preserves the pre-migration Video 004 values exactly.

Safe areas are internal design profiles based on conservative UI review, not official guarantees. Platform controls, captions, devices, and experiments can move. Each variant therefore records whether an actual platform preview remains required. New compositions should use the master profile when one shared render will serve several destinations and use a platform profile only when making a platform-specific render.

## Speed of Light variants

The four V1 variants all reference `speed-of-light.asset.earth-to-proxima` and reuse the existing 33-second clean master where appropriate:

- **YouTube Shorts:** searchable title and source-aware description; optional reviewed external WebVTT; production-ready because this is a retrospective record of the published, human-reviewed version.
- **TikTok:** compact first-frame-complementing caption, question CTA, platform-generated captions, and mandatory pre-post UI/caption/cover preview.
- **Instagram Reels:** save-oriented copy tied to the light-year misconception, profile-grid cover intent, generated captions, and mandatory preview.
- **Facebook Reels:** self-contained explanatory copy and conversational CTA for discovery beyond followers, generated captions, and mandatory preview.

The records reuse facts and the master where that is honest; they do not invent four different videos or fake metadata differences.

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
- PublicationRecord and remote platform identifiers;
- platform API clients or capability discovery;
- alternate platform renders for the V1 Speed of Light variants;
- databases, queues, workers, services, dashboards, analytics, or monetization/location tooling.

All distribution remains a separate manual, human-approved operation.
