# Video system

This is the implemented production subsystem. The higher-level knowledge-package, distribution, analytics, and operations boundaries are defined in `docs/ARCHITECTURE.md`; they are not yet implemented unless `docs/PROJECT-STATE.md` says otherwise.

## Architecture

```text
KnowledgePackage → ContentAsset → optional PlatformVariant
                                      ↓
                              video specification
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
- `src/knowledge/`: reusable verified knowledge packages and their registry; currently implemented for Videos 002 and 004.
- `src/content-assets/`: platform-neutral editorial assets, script traceability, narrative intent, and visual plans.
- `src/platform-variants/`: destination packaging, dated constraint profiles, safe-area selection, and production/readiness intent.
- `src/content/videos/`: production metadata, timing, files, and exactly one reference to legacy facts, a content asset, or a platform variant.
- `src/components/`: reusable visual primitives with no video-specific claims.
- `src/compositions/`: video-specific choreography that consumes structured content.
- `src/design/`: typography, color, safe-area, and motion tokens.
- `scripts/`: deterministic asset generation, render routing, and media QA.

This is deliberately a typed code specification rather than YAML/JSON. V1 needs derived values, validation, and refactorability more than non-developer editing. The content boundary remains explicit and could later gain another authoring format.

Video specifications are production representations, not reusable research or editorial assets. A migrated video references either a ContentAsset ID or the PlatformVariant it implements; an unmigrated video continues to use legacy `factIds`. The schema requires exactly one path. Video 002 references its ContentAsset directly. Video 004 references the YouTube Shorts PlatformVariant, which resolves to its ContentAsset. Both derive narration text from their ContentAssets, while exact cue timing, audio files, scenes, format, and choreography remain in VideoSpec/Remotion. Their numeric render inputs are projected from package claims so the compositions remain unchanged.

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
- Editorial source: `ocean-depth.asset.everest-descent`, backed by the `ocean-depth` KnowledgePackage

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
- Platform adaptation: `speed-of-light.asset.earth-to-proxima.variant.youtube-shorts`; the composition uses the conservative shared master safe-area profile whose insets exactly preserve the published layout.

## Video 005

- ID: `human-engineering`
- Remotion composition: `Magnivis-Human-Engineering`
- Format: 1080×1920, 30 fps, 31 seconds
- Visuals: original procedural Burj Khalifa silhouette, Three Gorges dam abstraction, animated LHC ring, Gotthard tunnel run, and 69-Burj closing comparison
- Audio: original deterministic industrial soundscape plus six modular English narration cues
- Captions: `captions/human-engineering.en.vtt` (optional positioned YouTube track); `captions/human-engineering.en.srt` is the unpositioned fallback
- Output: `output/human-engineering-narrated.mp4`

## Commands

```bash
pnpm dev                         # Remotion Studio
pnpm render earth-to-stars       # full production render
pnpm render ocean-depth          # Video 002 production render
pnpm render billion-dollars      # Video 003 production render
pnpm render speed-of-light       # Video 004 production render
pnpm render human-engineering    # Video 005 production render
pnpm render:smoke ocean-depth    # first 90 frames only
pnpm qa earth-to-stars           # ffprobe checks + frames + contact sheet
pnpm qa ocean-depth              # Video 002 media QA and contact sheet
pnpm qa billion-dollars          # Video 003 media QA and contact sheet
pnpm qa speed-of-light           # Video 004 media QA and contact sheet
pnpm qa human-engineering        # Video 005 media QA and contact sheet
pnpm assets                      # regenerate original procedural audio
pnpm assets:ocean                # regenerate Video 002 soundscape and narration
pnpm assets:money                # regenerate Video 003 soundscape and narration
pnpm assets:light                # regenerate Video 004 soundscape and narration
pnpm assets:engineering          # regenerate Video 005 soundscape and narration
pnpm check                       # typecheck, lint, tests, diff check
```

The render router rejects unknown video IDs. Production renders use an 8 Mbps H.264 target and 192 kbps AAC target to preserve typography and gradients through YouTube transcoding. QA validates resolution, display aspect ratio, frame rate, duration tolerance, H.264 video, AAC audio, audio levels, and the presence of both streams.

## Authoring rules

- Keep factual/copy/timing changes in content/data files where feasible.
- Add a composition only when a story needs distinctive choreography; reuse primitives without forcing visual sameness.
- No random value may vary between renders. Seed procedural fields and derive animation solely from frame/config.
- Do not access networks during preview or render.
- Treat `output/` and `qa/` as generated review artifacts, not source assets.

## Caption placement

- Narrated Magnivis Shorts use optional YouTube caption tracks; do not burn narration captions into the production master. This preserves the viewer's ability to turn captions on or off and avoids duplicate text when YouTube captions are enabled.
- Positioned WebVTT files request horizontal centering in the lower safe area using `line:78% position:50% align:center`; `.srt` files are unpositioned fallbacks only.
- Caption positioning is best-effort. YouTube's desktop player may honor WebVTT placement while the mobile Shorts player may override it, including moving captions toward the top. The app—not the uploaded MP4—controls optional-caption rendering.
- Keep key visuals and headlines clear of both likely caption regions, and review every private Short with captions on and off in desktop and mobile clients before publication.
- Existing public videos are not re-uploaded solely to adjust optional-caption placement.
