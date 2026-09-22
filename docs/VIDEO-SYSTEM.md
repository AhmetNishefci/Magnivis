# Video system

## Architecture

```text
verified data + video specification
               ↓
      composition choreography
               ↓
  reusable visual/audio primitives
               ↓
       Remotion deterministic render
               ↓
   ffprobe validation + QA snapshots
```

- `src/data/`: verified scientific records and source metadata.
- `src/content/videos/`: editorial metadata, timing, copy, and references to facts.
- `src/components/`: reusable visual primitives with no video-specific claims.
- `src/compositions/`: video-specific choreography that consumes structured content.
- `src/design/`: typography, color, safe-area, and motion tokens.
- `scripts/`: deterministic asset generation, render routing, and media QA.

This is deliberately a typed code specification rather than YAML/JSON. V1 needs derived values, validation, and refactorability more than non-developer editing. The content boundary remains explicit and could later gain another authoring format.

## Video 001

- ID: `earth-to-stars`
- Remotion composition: `Magnivis-Earth-To-Stars`
- Format: 1080×1920, 30 fps, 42 seconds
- Audio: original deterministic stereo ambient/transition/impact bed plus six modular English narration cues
- Captions: `captions/earth-to-stars.en.srt`
- Output: `output/earth-to-stars-narrated.mp4`

## Commands

```bash
pnpm dev                         # Remotion Studio
pnpm render earth-to-stars       # full production render
pnpm render:smoke                # first 90 frames only
pnpm qa earth-to-stars           # ffprobe checks + frames + contact sheet
pnpm assets                      # regenerate original procedural audio
pnpm check                       # typecheck, lint, tests, diff check
```

The render router rejects unknown video IDs. QA validates resolution, display aspect ratio, frame rate, duration tolerance, H.264 video, AAC audio, and the presence of both streams.

## Authoring rules

- Keep factual/copy/timing changes in content/data files where feasible.
- Add a composition only when a story needs distinctive choreography; reuse primitives without forcing visual sameness.
- No random value may vary between renders. Seed procedural fields and derive animation solely from frame/config.
- Do not access networks during preview or render.
- Treat `output/` and `qa/` as generated review artifacts, not source assets.
