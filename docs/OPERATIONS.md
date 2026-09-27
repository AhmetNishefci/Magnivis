# Platform operations and measurement

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

## Publication truth

`publication.youtube.speed-of-light` records the existing public Video 004 with its PlatformVariant, ContentAsset, KnowledgePackage, VideoSpec, uploaded video SHA-256, remote ID/URL, publication date, and human approval. Its delivery reference is explicitly a `retrospective-match`: the validated package contains the same artifact but was created after the original manual publication, so it is not falsely described as the upload source.

Settings not supported by durable evidence are recorded as `unknown`; they are not reconstructed from memory. Videos 001–003 retain their legacy YouTube publication fields until a bounded migration can establish equivalent artifact and settings provenance.

A `ready-for-manual-upload` delivery is required for a new `published` record, but readiness is not publication authorization. PublicationRecord describes an external action after a human performed it; it never performs that action.

## Raw metrics

MetricSnapshot preserves platform-native names and definitions. It does not normalize a YouTube engaged view into a TikTok view or hide the observation window. No production MetricSnapshot is committed yet because the existing prose snapshots predate the generalized publication records and should not be migrated with invented timestamps or definitions.

Future manual entry/import should record exact capture time, source, platform definition, and sample window. Derived comparisons should be separate and explicit.

## Security boundary

Never add passwords, cookies, access/refresh tokens, API keys, payment data, or personal identity material to these records. The strict account schema rejects undeclared fields, but code review and secret hygiene remain mandatory.
