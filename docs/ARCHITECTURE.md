# System architecture

This document owns the boundary between implemented systems and the planned knowledge-media engine. `docs/VIDEO-SYSTEM.md` remains authoritative for the implemented Remotion production subsystem.

## Implemented today

Magnivis is a local, deterministic TypeScript/React/Remotion production repository. It contains typed video specifications, source-backed facts, reusable visual primitives, modular audio and narration, render routing, timed captions, ffprobe media validation, representative QA frames, and manual performance snapshots.

Knowledge Package V1 is implemented as version-controlled TypeScript/Zod. It supports quantitative and qualitative claims, scalar and range quantities, explicit precision/uncertainty, evidence traceability, verification states, package approval, hooks, narrative/visual opportunities, and a deterministic registry. Production packages exist for `speed-of-light` and `ocean-depth`; Videos 004 and 002 reach them through ContentAssets while narrow compatibility projections preserve existing composition inputs.

Content Asset V1 is also implemented as version-controlled TypeScript/Zod. Two editorial assets reference the `speed-of-light` package, one production asset references `ocean-depth`, and the approved Wood Frog asset supplies the first hash-locked ProductionPlan. Assets own selected angles, hooks, claims, traceable scripts, narrative beats, visual intent, and narration direction.

ProductionPlan V1 is implemented for Wood Frog. It translates an approved VisualPlan into frame ranges, scene types, on-screen factual text, animation/transition/audio intent, and provenance-bound assets without replacing VideoSpec or Remotion choreography. Validation binds exact package, asset, owner-decision, and script hashes; rejects stale revisions and non-verified/excluded claims; and keeps successful rendering below human visual/platform approval. See `docs/PRODUCTION-PLANS.md`.

CaptionPlan V1 is implemented through Wood Frog. It sits between approved narration cues and Remotion caption rendering, owns semantic phrase grouping, line breaks, controlled emphasis, placement, timing, and treatment intent, and generates both the designed burned-in layer and optional WebVTT accessibility copy. The renderer—not AI output—owns typography, colors, geometry, motion limits, and active safe-area enforcement. See `docs/CAPTIONS.md`.

The knowledge taxonomy is open-ended: packages have one broad analytics pillar plus normalized domain/topic slugs. Pillars organize the portfolio rather than authorize subjects. PlatformVariant V1 is implemented for the production Speed of Light ContentAsset across YouTube Shorts, TikTok, Instagram Reels, and Facebook Reels. Dated constraint profiles and safe-area profiles isolate mutable platform knowledge. Video 004 references its YouTube variant; Video 002 continues to reference its ContentAsset directly. Both retain exact production choreography.

Platform Delivery Package V1 resolves a variant's explicit VideoSpec production reference and generates an ignored, portable operator folder containing exact upload copy, structured metadata, review instructions, source revisions, observed media metadata, and SHA-256 artifact hashes. For modern locked productions it also carries ProductionPlan, CaptionPlan, locked-master relationship, private-preview state, and operator disclosure/native-caption guidance. It validates registry references and media with ffprobe. Reused masters and already-rendered dedicated variants use the same integrity path; delivery does not trigger rendering. Ready delivery is not publication authorization.

Content Intelligence V1 adds a manual TopicCandidate registry, categorical evaluation, an explicitly unverified research workspace, claim-safe hook proposals, and safe ContentAsset drafting. AI calls use one provider-neutral structured-generation interface and versioned prompt definitions. A production-capable OpenAI Responses adapter is optional at the boundary; fixture providers keep the complete system testable without credentials or network calls. Workflow envelopes persist exact inputs/outputs, hashes, provenance, validation, derived artifacts, and human-review state.

The first operational-truth slice records nonsecret platform accounts, one generalized Speed of Light YouTube PublicationRecord, platform settings/disclosures, and a raw MetricSnapshot schema. It remains local and file-backed. No production metric snapshots have been fabricated or migrated.

There is no database, queue, worker fleet, web application, CMS, publishing API, analytics ingestion service, or deployment configuration. Live OpenAI execution requires an owner-supplied environment key and remains staged; upload, publication, source verification, claim verification, and final editorial approval are manual human operations.

## Target boundary

The durable editorial object will be a **knowledge package**:

```text
topic signals
    ↓
topic evaluation
    ↓
sources + claim-level verification
    ↓
knowledge package
    ↓
content assets (short or long-form story)
    ↓
platform variants (packaging + delivery intent)
    ↓
production representation
    ↓
delivery package (artifacts + hashes + operator review)
    ↓
human approval
    ↓
manual or approved publishing adapter
    ↓
raw analytics snapshots + interpreted learning
```

A knowledge package can support multiple assets, but each asset must have a distinct editorial purpose. The implemented ContentAsset layer proves this one-to-many relationship. Implemented platform variants may change packaging, safe areas, duration intent, CTA, cover, caption behavior, and metadata; they may not silently alter verified claims.

## Planned domain boundaries

- **Editorial intelligence:** manual candidates, evaluation rationale, prompt workflows, persisted runs, hook proposals, and draft assets are implemented; external discovery inputs remain planned.
- **Research:** an unverified AI-assisted workspace, a minimal known-URL text retriever, and file-backed claim-review/promotion boundary are implemented. Evidence inspection remains human/agent-assisted work; only an explicit owner decision can promote reviewed claims. Automated source discovery remains planned.
- **Knowledge packages:** approved topic understanding, verified claims, narrative/visual opportunities, and related questions.
- **Content assets:** platform-neutral editorial purpose, story angle, selected hook/claims, traceable script, narrative structure, visual intent, and narration direction.
- **Production:** exact format, timing, narration/audio files, licensed assets, CaptionPlans, designed burned-in captions, optional accessibility tracks, Remotion compositions, renders, and QA. This is the mature existing subsystem.
- **Platform adaptation:** implemented per-platform packaging, dated constraint profile, safe-area profile, approval/readiness, and production intent.
- **Delivery:** implemented local, hashed artifact/copy/manifest/checklist packaging and validation; no external mutation.
- **Distribution/publication:** a file-backed record exists for manually completed publication; upload attempts, idempotency keys, and API mutations remain future work. Public release remains a separate human action.
- **Analytics:** the raw MetricSnapshot schema/registry is implemented; production snapshots, imports, and derived analysis remain future work.
- **Operations:** file-backed Content Intelligence stage runs now preserve input/output hashes and provider usage/cost; retries, attempt history, logs, and generic resumability remain future work.

## Storage progression

Start with version-controlled TypeScript data validated by Zod. It is reviewable, works offline, and matches the existing repository. Generated media remains outside Git. Add a relational database only when concurrent workers, high-volume analytics, remote publishing state, or query needs make files materially unsafe or cumbersome.

## Automation progression

Every stage should be identifiable as `manual`, `assisted`, or `automated`. V1 remains manual or assisted through approval and publishing. Automation must preserve stage outputs and allow resuming a failed stage without rerunning unrelated expensive work.

When job execution is justified, use stable run IDs, input hashes, explicit state transitions, bounded retries, per-stage logs, and an idempotency key for every external mutation. Never combine upload and public release into one implicit operation.

## Provider policy

One LLM-shaped interface exists because Content Intelligence V1 is an actual integration boundary. The OpenAI adapter uses that interface, while domain workflows remain vendor-neutral. Structured output is locally validated and records provider/model/response/workflow/usage/cost provenance. Current local Kokoro narration remains separate. Image, video, transcription, and publishing abstractions should still wait for operational need.

## Completed migration slices

Knowledge Package V1, Content Asset V1, open-ended taxonomy, PlatformVariant V1, Platform Delivery Package V1, file-backed Content Intelligence runs, claim review/promotion, ProductionPlan V1, and CaptionPlan V1 are implemented. Speed of Light proves one package can back multiple editorial assets and platform adaptations; Ocean Depth proves cross-domain claim modeling; Wood Frog proves a new topic can cross evidence review and explicit owner approval into a hash-locked, captioned production master. Its exact master has automated technical/caption QA and owner visual approval, while private platform and publication gates remain separate. Videos 001, 003, and 005 intentionally remain on legacy facts. Publishing adapters and automated approval remain intentionally unimplemented.
