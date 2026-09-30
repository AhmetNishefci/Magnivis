# Magnivis

**See the unimaginable.**

Magnivis is a faceless English-language knowledge-media brand that turns fascinating ideas into cinematic, trustworthy stories. This repository currently contains the working TypeScript/React/Remotion production system; it is evolving incrementally toward reusable, verified knowledge packages and multi-platform assets. See `docs/ARCHITECTURE.md` for implemented versus planned boundaries.

Magnivis is open-ended: it discovers compelling knowledge opportunities first and classifies them second. High-level pillars are portfolio groupings, not a whitelist of permissible subjects. See `docs/STRATEGY.md`.

Content Intelligence V1 provides a provider-neutral, schema-validated path from a manual TopicCandidate through evaluation and an unverified research workspace to claim-safe hook and ContentAsset drafts. An optional OpenAI Responses adapter is implemented, while deterministic fixtures keep normal tests and review trials offline. The initial Wood Frog fixture is historical; approved package/asset revision 2, owner-reviewed production/captions and separately accepted recovery master are preserved. See `docs/CONTENT-INTELLIGENCE.md`.

## Requirements

- Node.js >=20.19 and <23; tested recovery runtime 22.23.3 (`.nvmrc` selects supported Node 20)
- pnpm 10.17.1 (pinned in package.json)
- macOS or Linux for local rendering

No API keys, paid services, or system FFmpeg installation are required for V1. Pinned FFmpeg/ffprobe binaries are installed with the project.

## Recover durable operational files first

```bash
pnpm install --frozen-lockfile
pnpm check
pnpm recovery:brain
pnpm artifacts:durable
pnpm artifacts:restore
pnpm artifacts:verify
pnpm recovery:validate
pnpm production:validate wood-frog --recovered
pnpm captions:validate wood-frog
```

Git contains 110 manifest-bound durable files. Restore copies exact bytes to ignored operational paths; it does not render or grant approval. The missing original Wood Frog master remains a historical expectation, separate from the accepted replacement. Read `docs/RECOVERY.md`, then `docs/PROJECT-STATE.md` and `AGENTS.md`. Later render examples are authoring references, not permission to overwrite approved/recovered artifacts or start a video.

## Start

```bash
corepack enable
pnpm install
pnpm dev
```

## Run the Content Intelligence operator trial

```bash
pnpm content:intelligence -- trial wood-frog-freeze --provider fixture \
  --output content-intelligence/runs/wood-frog-freeze-fixture-v1
pnpm content:intelligence -- validate wood-frog-freeze \
  --output content-intelligence/runs/wood-frog-freeze-fixture-v1
```

The readable review is `content-intelligence/runs/wood-frog-freeze-fixture-v1/review.md`. Live stages require `OPENAI_API_KEY`, but they remain separated by a mandatory source/claim review pause. No command verifies, approves, renders, or publishes the draft automatically.

## Render and inspect Video 001

```bash
pnpm render earth-to-stars
pnpm qa earth-to-stars
```

The final narrated video is written to `output/earth-to-stars-narrated.mp4`. QA metadata, representative frames, and a contact sheet are written under `qa/earth-to-stars-narrated/`.

The reviewed English caption track is `captions/earth-to-stars.en.vtt`, positioned between the upper headlines and lower metrics for Shorts playback. The SRT remains as an unpositioned fallback.

## Render and inspect Video 002

```bash
pnpm render ocean-depth
pnpm qa ocean-depth
```

The narrated master is written to `output/ocean-depth-narrated.mp4`. Its QA report, representative frames, and contact sheet are written under `qa/ocean-depth-narrated/`. Upload the positioned Shorts caption track at `captions/ocean-depth.en.vtt`; the SRT remains as an unpositioned fallback.

## Render and inspect Video 003

```bash
pnpm render billion-dollars
pnpm qa billion-dollars
```

The narrated master is written to `output/billion-dollars-narrated.mp4`. Its QA report, representative frames, and contact sheet are written under `qa/billion-dollars-narrated/`. Upload the positioned Shorts caption track at `captions/billion-dollars.en.vtt`; the SRT remains as an unpositioned fallback.

## Render and inspect Video 004

```bash
pnpm render speed-of-light
pnpm qa speed-of-light
```

The narrated master is written to `output/speed-of-light-narrated.mp4`. Its QA report, representative frames, and contact sheet are written under `qa/speed-of-light-narrated/`. Upload the positioned Shorts caption track at `captions/speed-of-light.en.vtt`; the SRT remains as an unpositioned fallback.

## Render and inspect Video 005

```bash
pnpm render human-engineering
pnpm qa human-engineering
```

The narrated master is written to `output/human-engineering-narrated.mp4`. Its QA report, representative frames, and contact sheet are written under `qa/human-engineering-narrated/`. Upload the optional positioned caption track at `captions/human-engineering.en.vtt`; the SRT remains as an unpositioned fallback.

## Knowledge packages

Videos 004 and 002 are migrated from video-first facts to reusable Knowledge Packages. Speed of Light proves multi-asset reuse; Ocean Depth validates approximate ranges, context-dependent boundaries, mixed claim types, and measurement uncertainty. See `docs/KNOWLEDGE-PACKAGES.md` for the schema, verification semantics, package-to-asset boundary, and authoring procedure.

## Content assets

The Speed of Light package supports two platform-neutral ContentAssets, while Ocean Depth has one production asset for published Video 002. See `docs/CONTENT-ASSETS.md` for script traceability, hook ownership, visual planning, and the ContentAsset-to-VideoSpec boundary.

## Platform variants

The published Speed of Light ContentAsset has four V1 adaptations for YouTube Shorts, TikTok, Instagram Reels, and Facebook Reels. They share verified claims while recording meaningful packaging, caption, cover, safe-area, and review differences. YouTube, Instagram, and Facebook resolve the original master; the approved TikTok revision 2 resolves a dedicated safe-area render after the shared master failed its first real-device top-UI review. No upload or publishing integration is implemented. See `docs/PLATFORM-VARIANTS.md`.

## Generate manual delivery packages

```bash
pnpm delivery speed-of-light
pnpm delivery:validate speed-of-light
```

This creates four ignored, human-reviewable delivery folders, each containing the selected production video, exact upload copy, metadata, hashed manifest, and review checklist. YouTube also receives its reviewed WebVTT file. YouTube and TikTok are ready for separately authorized manual upload; Instagram and Facebook remain explicitly review-only until real-platform preview and approval. Delivery readiness never authorizes public publication. See `docs/DELIVERY-PACKAGES.md`.

## Operational records

Nonsecret platform identity, generalized publication provenance, disclosure/settings snapshots, and raw MetricSnapshot schemas live under `src/operations/`. The confirmed Instagram identity is `@magnivis.media`; no credentials are stored. One modern record represents the existing Speed of Light YouTube publication, while historical publications remain on the legacy VideoSpec path. See `docs/OPERATIONS.md`.

Run all non-rendering checks with:

```bash
pnpm check
```

See `docs/VIDEO-SYSTEM.md` for architecture, authoring workflow, and render details. Read `AGENTS.md` before agent-assisted changes.
