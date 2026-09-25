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
- Captions: `captions/earth-to-stars.en.vtt` (positioned between upper headlines and lower metrics); `captions/earth-to-stars.en.srt` is the unpositioned fallback
- Output: `output/earth-to-stars-narrated.mp4`

## Video 002

- ID: `ocean-depth`
- Remotion composition: `Magnivis-Ocean-Depth`
- Format: 1080×1920, 30 fps, 32 seconds
- Visuals: original procedural water column, depth counter, particulate field, and scale-accurate Everest/Challenger Deep comparison
- Audio: original deterministic stereo deep-ocean soundscape plus seven modular English narration cues
- Captions: `captions/ocean-depth.en.vtt` (positioned for the lower Shorts safe area); `captions/ocean-depth.en.srt` is the unpositioned fallback
- Output: `output/ocean-depth-narrated.mp4`

## Video 003

- ID: `billion-dollars`
- Remotion composition: `Magnivis-Billion-Dollars`
- Format: 1080×1920, 30 fps, 35 seconds
- Visuals: original procedural $100-note abstraction, physically derived million-dollar stack and billion-dollar block, human silhouette, and scale-driven Burj Khalifa comparison
- Audio: original deterministic stereo soundscape plus seven modular English narration cues
- Captions: `captions/billion-dollars.en.vtt` (positioned above the lower Shorts metadata region); `captions/billion-dollars.en.srt` is the unpositioned fallback
- Output: `output/billion-dollars-narrated.mp4`

## Video 004

- ID: `speed-of-light`
- Remotion composition: `Magnivis-Speed-Of-Light`
- Format: 1080×1920, 30 fps, 33 seconds
- Visuals: deterministic photon laps, velocity tunnel, Earth–Moon and Sun–Earth light paths, light-year corridor, and Proxima comparison
- Audio: original deterministic stereo pulse/sweep soundscape plus six modular English narration cues
- Captions: `captions/speed-of-light.en.vtt` (positioned above the lower Shorts metadata region); `captions/speed-of-light.en.srt` is the unpositioned fallback
- Output: `output/speed-of-light-narrated.mp4`

## Commands

```bash
pnpm dev                         # Remotion Studio
pnpm render earth-to-stars       # full production render
pnpm render ocean-depth          # Video 002 production render
pnpm render billion-dollars      # Video 003 production render
pnpm render speed-of-light       # Video 004 production render
pnpm render:smoke ocean-depth    # first 90 frames only
pnpm qa earth-to-stars           # ffprobe checks + frames + contact sheet
pnpm qa ocean-depth              # Video 002 media QA and contact sheet
pnpm qa billion-dollars          # Video 003 media QA and contact sheet
pnpm qa speed-of-light           # Video 004 media QA and contact sheet
pnpm assets                      # regenerate original procedural audio
pnpm assets:ocean                # regenerate Video 002 soundscape and narration
pnpm assets:money                # regenerate Video 003 soundscape and narration
pnpm assets:light                # regenerate Video 004 soundscape and narration
pnpm check                       # typecheck, lint, tests, diff check
```

The render router rejects unknown video IDs. Production renders use an 8 Mbps H.264 target and 192 kbps AAC target to preserve typography and gradients through YouTube transcoding. QA validates resolution, display aspect ratio, frame rate, duration tolerance, H.264 video, AAC audio, audio levels, and the presence of both streams.

## Authoring rules

- Keep factual/copy/timing changes in content/data files where feasible.
- Add a composition only when a story needs distinctive choreography; reuse primitives without forcing visual sameness.
- No random value may vary between renders. Seed procedural fields and derive animation solely from frame/config.
- Do not access networks during preview or render.
- Treat `output/` and `qa/` as generated review artifacts, not source assets.
