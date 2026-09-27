# System architecture

This document owns the boundary between implemented systems and the planned knowledge-media engine. `docs/VIDEO-SYSTEM.md` remains authoritative for the implemented Remotion production subsystem.

## Implemented today

Magnivis is a local, deterministic TypeScript/React/Remotion production repository. It contains typed video specifications, source-backed facts, reusable visual primitives, modular audio and narration, render routing, timed captions, ffprobe media validation, representative QA frames, and manual performance snapshots.

Knowledge Package V1 is implemented as version-controlled TypeScript/Zod. It supports quantitative and qualitative claims, evidence traceability, verification states, package approval, hooks, narrative/visual opportunities, a deterministic registry, and one production package for `speed-of-light`. Video 004 reaches that package through its ContentAsset, while an explicit compatibility projection preserves its existing composition inputs.

Content Asset V1 is also implemented as version-controlled TypeScript/Zod. Two editorial assets reference the `speed-of-light` package: the published Video 004 story and a distinct unproduced cosmic-distance story. Assets own selected angles, hooks, claims, traceable scripts, narrative beats, visual intent, and narration direction. Video 004's VideoSpec references the published asset while retaining exact production choreography.

There is no database, queue, worker fleet, web application, CMS, provider orchestration layer, publishing API, analytics ingestion service, or deployment configuration. Upload and publication are manual human operations.

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
story assets (short, long-form, article)
    ↓
platform variants
    ↓
human approval
    ↓
manual or approved publishing adapter
    ↓
raw analytics snapshots + interpreted learning
```

A knowledge package can support multiple assets, but each asset must have a distinct editorial purpose. The implemented ContentAsset layer proves this one-to-many relationship. Future platform variants may change packaging, safe areas, duration, CTA, cover, caption track, and metadata; they may not silently alter verified claims.

## Planned domain boundaries

- **Editorial intelligence:** topic candidates, scoring rationale, timeliness, pillars, hook variants, and story angles.
- **Research:** sources, claims, evidence notes, uncertainty, and review status.
- **Knowledge packages:** approved topic understanding, verified claims, narrative/visual opportunities, and related questions.
- **Content assets:** platform-neutral editorial purpose, story angle, selected hook/claims, traceable script, narrative structure, visual intent, and narration direction.
- **Production:** exact format, timing, narration/audio files, licensed assets, Remotion compositions, captions, renders, and QA. This is the mature existing subsystem.
- **Distribution:** per-platform variants, approval state, remote identifiers, idempotency keys, and publication attempts. Public release remains a separate human action.
- **Analytics:** immutable raw observations with platform definitions, plus explicitly derived internal metrics.
- **Operations:** stage runs, input/output hashes, attempts, provider usage, cost, logs, and resumability.

## Storage progression

Start with version-controlled TypeScript data validated by Zod. It is reviewable, works offline, and matches the existing repository. Generated media remains outside Git. Add a relational database only when concurrent workers, high-volume analytics, remote publishing state, or query needs make files materially unsafe or cumbersome.

## Automation progression

Every stage should be identifiable as `manual`, `assisted`, or `automated`. V1 remains manual or assisted through approval and publishing. Automation must preserve stage outputs and allow resuming a failed stage without rerunning unrelated expensive work.

When job execution is justified, use stable run IDs, input hashes, explicit state transitions, bounded retries, per-stage logs, and an idempotency key for every external mutation. Never combine upload and public release into one implicit operation.

## Provider policy

Introduce a provider interface only at an actual integration boundary. Current local Kokoro narration may become the first small TTS adapter, but research, LLM, image, video, transcription, and publishing abstractions should wait until a second provider or operational need exists. Persist provider/model/version, usage, estimated cost, and license/provenance with generated outputs.

## Completed migration slices

Knowledge Package V1, Content Asset V1, and the first `speed-of-light` package are implemented. One package backs two distinct assets, while the published asset continues through the existing production system without changing its rendered output. Platform variants, publication records, and workflow automation remain intentionally unimplemented.
