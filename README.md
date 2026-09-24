# Magnivis

**See the unimaginable.**

Magnivis turns difficult-to-comprehend scale, science, technology, and numbers into cinematic visual experiences. This repository contains the TypeScript/React/Remotion production system and the source of truth for each video.

## Requirements

- Node.js 20 LTS (`.nvmrc`)
- pnpm 10
- macOS or Linux for local rendering

No API keys, paid services, or system FFmpeg installation are required for V1. Pinned FFmpeg/ffprobe binaries are installed with the project.

## Start

```bash
corepack enable
pnpm install
pnpm dev
```

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

Run all non-rendering checks with:

```bash
pnpm check
```

See `docs/VIDEO-SYSTEM.md` for architecture, authoring workflow, and render details. Read `AGENTS.md` before agent-assisted changes.
