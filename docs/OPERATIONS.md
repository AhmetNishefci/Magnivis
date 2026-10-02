> Current prospective orchestration and two-gate authority: [WORKFLOW-V3](WORKFLOW-V3.md). Current machine state: [project-state](../workflow/project-state.json). Dated milestones below retain their historical meaning; V3 does not reapprove or rewrite them.

# Platform operations and measurement

## Current scheduling and publishing cadence — 2026-10-01

**OWNER-REPORTED SCHEDULING EVIDENCE:** Ahmet manually scheduled Longitude Clock’s exact authorized packages on YouTube Shorts, TikTok, Instagram Reels and Facebook Reels for **2026-10-02 at 20:00 Kosovo local time (Europe/Pristina as supplied)**. [Append-only scheduling report](../content-intelligence/operations/longitude-clock-scheduling-v1/owner-report.json) binds the unchanged final release record and each delivery manifest file hash. Record-entry time is labeled separately from the unknown scheduling-action time. No inferred UTC conversion or platform-side timestamp is recorded.

Scheduled is not published. No completed Longitude PublicationRecord, content ID, public URL, actual publication time, screenshot, device/presentation result or analytics exists from this update. Ahmet will provide live evidence afterward. Existing postpublication intake and original release artifacts remain unchanged; no assistant platform action occurred.

Current publishing target is approximately **one excellent unique short-form video/day**, not a quota. Research, evidence, human gates and adaptive creative deliberation are never weakened to meet cadence. Production may build a backlog and operates separately. **20:00 Kosovo local time is a provisional test window**, not proven optimal by analytics. Frequency/window may change with adequate native evidence; long-form roadmap remains preserved.

Reconciliation: older “prepared, unpublished”/review-only Longitude sections below are historical pre-authorization milestones. Current release authority is longitude-clock-publication-v1; current external scheduling status is this owner report. The existing source variants and prepared packages retain their exact identities.

## Phantom Traffic current publication state — 2026-10-01

Four canonical `published-owner-reported` records now exist in `src/operations/phantom-traffic.ts`, registered alongside historical Speed of Light. Owner-supplied public URLs: [YouTube](https://www.youtube.com/shorts/3jmxLXcowC8), [Facebook](https://www.facebook.com/reel/2300822597344788), [Instagram](https://www.instagram.com/p/Dd89-PvFDqn/). TikTok is published by explicit owner report, with public URL/video ID unknown; `https://www.tiktok.com/tiktokstudio/content` is management context only. Date is 2026-10-01; exact posting time is unknown. Logical TikTok/Facebook account records do not invent actual handles or remote account IDs. Actual visibility/reuse/disclosure settings remain unknown.

Final source variants remain revision 3/production-ready under the original accepted-risk authorization, not retroactively private-preview-passed. Publication records bind exact package manifest file hashes and prepared media identity; owner-reported use does not independently verify platform transcoded bytes. Comments are owner-reported posted using the intended copy, with unknown IDs/time/pin state/metrics.

[Closure evidence](../content-intelligence/reviews/phantom-traffic-closure-v1/owner-decision.json) records broad live desktop/mobile acceptance where applicable. Individually named grid/feed tests and measured QA remain unknown. Append later precise observations; preserve the original decisions and evidence. TikTok permalink and optional native settings/analytics are follow-ups, not closure blockers.

Schema semantics: legacy `published` retains its remote/date requirements. Distinct `published-owner-reported` requires explicit dated owner evidence, exact ready-delivery manifest hash and authorization; missing public identity is explicit rather than manufactured. Approval uses labeled decision-entry time when owner review time is not supplied.


This document owns the implemented nonsecret operational state that sits after delivery. It does not contain credentials and does not authorize external actions.

## Implemented V1

`src/operations/` provides file-backed Zod schemas and deterministic registries for:

- `PlatformAccount`: nonsecret platform identity and lifecycle only;
- `PublicationRecord`: exact platform/account, source revisions, VideoSpec, delivery ID/state, uploaded video hash, remote identity, settings/disclosures, and human approval;
- `MetricSnapshot`: raw platform-native observations with capture time, observation window, source, units, and definitions.

No API client, OAuth flow, scheduler, upload command, or analytics importer exists.

## Confirmed platform identity and state

- **Instagram:** `@magnivis.media`; bio: “Understand something fascinating every day. 🌍🧠✨”; configured externally. The current Reels variant still requires real-platform preview and approval.
- **YouTube:** active with four public Shorts. The exact platform-specific handle is not asserted in the account record because historical documentation used `@Magnivis` as general shorthand. Video 004 has the first generalized PublicationRecord.
- **TikTok:** the Speed of Light revision 2 artifact passed private real-device QA. No public publication is recorded and no handle is guessed.
- **Facebook:** a review-only PlatformVariant exists; account identity and real-platform preview remain unconfirmed.

Wood Frog now has review-only deliveries for all four surfaces. Every package requires private/draft visibility, preserves original audio and designed burned-in captions, records current-policy confirmation for AI disclosure, and keeps publication unauthorized. TikTok recommends enabling its AI-generated-content label based on the actual synthetic-narration/procedural-visual provenance and prior Magnivis review practice; YouTube and Meta surfaces require operator confirmation of their current UI/policy rather than a hardcoded claim.

## Publication truth

`publication.youtube.speed-of-light` records the existing public Video 004 with its PlatformVariant, ContentAsset, KnowledgePackage, VideoSpec, uploaded video SHA-256, remote ID/URL, publication date, and human approval. Its delivery reference is explicitly a `retrospective-match`: the validated package contains the same artifact but was created after the original manual publication, so it is not falsely described as the upload source.

Settings not supported by durable evidence are recorded as `unknown`; they are not reconstructed from memory. Videos 001–003 retain their legacy YouTube publication fields until a bounded migration can establish equivalent artifact and settings provenance.

A `ready-for-manual-upload` delivery is required for a new `published` record, but readiness is not publication authorization. PublicationRecord describes an external action after a human performed it; it never performs that action.

## Raw metrics

MetricSnapshot preserves platform-native names and definitions. It does not normalize a YouTube engaged view into a TikTok view or hide the observation window. No production MetricSnapshot is committed yet because the existing prose snapshots predate the generalized publication records and should not be migrated with invented timestamps or definitions.

Future manual entry/import should record exact capture time, source, platform definition, and sample window. Derived comparisons should be separate and explicit.

## Security boundary

Never add passwords, cookies, access/refresh tokens, API keys, payment data, or personal identity material to these records. The strict account schema rejects undeclared fields, but code review and secret hygiene remain mandatory.

## Recovery and community guidance

Wood Frog latest historical upload occurrence is confirmed by Ahmet, with platform/URL/ID/time/visibility/hash/settings/analytics unknown. artifacts/owner-evidence.json supplements the earlier pending checkpoint; it does not fabricate a PublicationRecord. Future reconciliation must request actual account/post/settings/approval evidence. No recovery command uploads or publishes.

Organic community participation may include natural replies, relevant discussion, follows/likes and useful comments. Replies should be human, concise, curious and accurate, with speculation separated from evidence. Avoid generic AI essays, spam, mass-following and deceptive engagement. Social activity does not replace content quality; this guideline authorizes no automated external action. Future analytics collection may use authorized APIs/integrations with legitimate permissions and raw native definitions; no scraping/credential hacks or analytics fabrication.

## Longitude Clock — prepared, unpublished

Exact V2 master is owner-locked; four platform variants/delivery packages remain review-only. The owner checklist is `content-intelligence/reviews/longitude-clock-platform-v1/publication-checklist.md`. Current official disclosure/thumbnail sources and inspection limits are in `policy-inspection.json`; settings are recommendations, never claims about account UI. Original non-photoreal animation, synthetic narration and H4 explanatory reconstruction are disclosed accurately; no historical footage is claimed.

`publication-evidence-intake.json` prepares eventual URL/ID/date/exact released variant/delivery/presentation/comment evidence with unknown values null. `analytics-readiness.json` contains no metric snapshots; later capture must preserve native definitions, source and observation windows after actual publication. Neither file is a PublicationRecord. No Longitude upload, publication, scheduling or performance is claimed.

## Longitude manual release and story-specific YouTube category

`content-intelligence/reviews/longitude-clock-publication-v1/` binds explicit owner release authorization, exact prepared copy/media/cover, risk acceptance and final revision-2 variants/delivery hashes. Zero prepublication device passes; no additional private/device check blocks this release. Unknown live controls/settings remain unknown. Only Ahmet uploads; no external action or publication record is created by preparation. Postpublication inspection captures actual URLs/IDs, success, desktop/mobile/crop/UI/audio observations and comments. No automatic remediation or analytics fabrication.

YouTube category is a **story-specific distribution decision**, not a permanent brand setting. `src/platform-variants/youtube-category-policy.ts` has no default category. For Longitude prefer **Science & Technology** when it fits available live categories; use Education only when materially more appropriate. Future stories may use other categories. This is independent of the current primary narrator and adaptive visual/caption/sound/duration choices.

## Artifact Architecture V2 — prospective canonical media

`docs/ARTIFACT-ARCHITECTURE-V2.md` now owns canonical binary identity and reference-only Delivery Manifest V3. Prior V1/V2 descriptions above remain historical compatibility behavior. New durable handoffs reference one SHA-256-bound MediaArtifact per unique payload; platform-specific binaries remain supported for presentation quality. State transitions and authorization never copy media. Historical media/package/approval/recovery paths remain exact legacy evidence. Upload resolution: `pnpm exec tsx scripts/resolve-delivery-media.ts <manifest.json>`. Explicit evidence exceptions retain independent review provenance; no historical deletion/migration occurs.
