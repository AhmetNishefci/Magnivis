# Video system

This is the implemented production subsystem. The higher-level knowledge-package, distribution, analytics, and operations boundaries are defined in `docs/ARCHITECTURE.md`; they are not yet implemented unless `docs/PROJECT-STATE.md` says otherwise.

## Architecture

```text
KnowledgePackage → ContentAsset → optional ProductionPlan → optional PlatformVariant
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
- `src/knowledge/`: reusable verified knowledge packages and their registry; currently implemented for Videos 002, 004 and approved Wood Frog.
- `src/content-assets/`: platform-neutral editorial assets, script traceability, narrative intent, and visual plans.
- `src/production/`: the approved VisualPlan-to-implementation bridge, exact editorial source hashes, frame allocation, and production integrity checks.
- `src/platform-variants/`: destination packaging, dated constraint profiles, safe-area selection, and production/readiness intent.
- `src/content/videos/`: production metadata, timing, files, and exactly one reference to legacy facts, a content asset, or a platform variant.
- `src/components/`: reusable visual primitives with no video-specific claims.
- `src/compositions/`: video-specific choreography that consumes structured content.
- `src/design/`: typography, color, safe-area, and motion tokens.
- `scripts/`: deterministic asset generation, render routing, and media QA.

This is deliberately a typed code specification rather than YAML/JSON. V1 needs derived values, validation, and refactorability more than non-developer editing. The content boundary remains explicit and could later gain another authoring format.

Video specifications are production representations, not reusable research or editorial assets. A migrated video references either a ContentAsset ID or the PlatformVariant it implements; an unmigrated video continues to use legacy `factIds`. The schema requires exactly one path. Video 002 references its ContentAsset directly. Video 004 references the YouTube Shorts PlatformVariant, which resolves to its ContentAsset. Wood Frog additionally binds its VideoSpec to an approved ProductionPlan and exact source hashes. Narration text comes from ContentAssets, while cue timing, audio files, scenes, format, and choreography remain in VideoSpec/Remotion.

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
- TikTok revision 2: `Magnivis-Speed-Of-Light-TikTok` / `output/speed-of-light-tiktok-narrated.mp4`; it preserves the same editorial, scene, timing, and audio inputs while applying the real-device-approved `safe-area.tiktok-feed.v2` to every top information block. The completed Earth-laps counter remains the correct 7.5×.

## Video 005

- ID: `human-engineering`
- Remotion composition: `Magnivis-Human-Engineering`
- Format: 1080×1920, 30 fps, 31 seconds
- Visuals: original procedural Burj Khalifa silhouette, Three Gorges dam abstraction, animated LHC ring, Gotthard tunnel run, and 69-Burj closing comparison
- Audio: original deterministic industrial soundscape plus six modular English narration cues
- Captions: `captions/human-engineering.en.vtt` (optional positioned YouTube track); `captions/human-engineering.en.srt` is the unpositioned fallback
- Output: `output/human-engineering-narrated.mp4`

## Wood Frog production master

- ID: `wood-frog`
- Remotion composition: `Magnivis-Wood-Frog`
- Format: 1080×1920, 30 fps, 40 seconds
- Editorial source: approved `wood-frog-freeze-tolerance` package revision 2 and `wood-frog-freeze-tolerance.asset.how-freezing-works` revision 2
- Production source: `production-plan.wood-frog-freeze.v1` revision 3, with exact package/asset/owner/script/CaptionPlan hashes, exact master visual approval, and explicit circulation-cessation exclusion
- Visuals: original procedural frog, forest, cardiac trace, extracellular-tissue/cell diagrams, cryoprotectant phase sequence, and ordered recovery indicators
- Audio: deterministic original soundscape plus six hash-recorded local Kokoro narration cues from the approved script
- Captions: 18 speech-first designed burned-in cues from `caption-plan.wood-frog.v1` revision 2; `captions/wood-frog.en.vtt` is the aligned optional accessibility track
- Output: `output/wood-frog-narrated.mp4`
- QA: `qa/wood-frog-narrated/`; exact-frame extraction and an 18-sample contact sheet inspect every designed-caption cue across all scientific beats
- Status: exact master owner visually approved; private platform preview, cover selection, disclosure review, and explicit publication approval are still required
- TikTok derivative: `Magnivis-Wood-Frog-TikTok` / `output/wood-frog-tiktok-narrated.mp4`; applies only `safe-area.tiktok-feed.v2`, has its own QA directory, and remains private-preview-only

## Commands

```bash
pnpm dev                         # Remotion Studio
pnpm render earth-to-stars       # full production render
pnpm render ocean-depth          # Video 002 production render
pnpm render billion-dollars      # Video 003 production render
pnpm render speed-of-light       # Video 004 production render
pnpm render speed-of-light-tiktok # TikTok revision 2 dedicated safe-area render
pnpm render human-engineering    # Video 005 production render
pnpm render wood-frog            # Re-rendering invalidates the recorded Wood Frog master approval
pnpm render wood-frog-tiktok     # Dedicated TikTok V2 safe-area candidate
pnpm render:smoke ocean-depth    # first 90 frames only
pnpm qa earth-to-stars           # ffprobe checks + frames + contact sheet
pnpm qa ocean-depth              # Video 002 media QA and contact sheet
pnpm qa billion-dollars          # Video 003 media QA and contact sheet
pnpm qa wood-frog-tiktok         # TikTok-safe Wood Frog media/caption contact sheet
pnpm qa speed-of-light           # Video 004 media QA and contact sheet
pnpm qa speed-of-light-tiktok    # TikTok revision 2 media QA and contact sheet
pnpm qa human-engineering        # Video 005 media QA and contact sheet
pnpm qa wood-frog                # Wood Frog exact-frame QA and contact sheet
pnpm delivery speed-of-light     # generate all four Speed of Light operator packages
pnpm delivery:validate speed-of-light # validate delivery references, files, hashes and media
pnpm assets                      # regenerate original procedural audio
pnpm assets:ocean                # regenerate Video 002 soundscape and narration
pnpm assets:money                # regenerate Video 003 soundscape and narration
pnpm assets:light                # regenerate Video 004 soundscape and narration
pnpm assets:engineering          # regenerate Video 005 soundscape and narration
pnpm assets:wood-frog            # regenerate Wood Frog soundscape and narration
pnpm captions:wood-frog          # derive WebVTT from approved narration cues
pnpm captions:validate wood-frog # validate CaptionPlan, narration, safe areas and WebVTT
pnpm production:validate wood-frog # validate approved source chain and artifact hashes
pnpm check                       # typecheck, lint, tests, diff check
```

The render router rejects unknown video IDs. Production renders use an 8 Mbps H.264 target and 192 kbps AAC target to preserve typography and gradients through platform transcoding. QA validates resolution, display aspect ratio, frame rate, duration tolerance, H.264 video, AAC audio, audio levels, and both streams. Frame QA uses exact decoded-frame selection rather than approximate keyframe seeking; the contact-sheet layout expands to include every configured sample.

## Authoring rules

- Keep factual/copy/timing changes in content/data files where feasible.
- Add a composition only when a story needs distinctive choreography; reuse primitives without forcing visual sameness.
- No random value may vary between renders. Seed procedural fields and derive animation solely from frame/config.
- Do not access networks during preview or render.
- Treat `output/` and `qa/` as generated review artifacts, not source assets.

## Caption placement

- Every new Magnivis short-form master contains designed burned-in captions rendered through the constrained CaptionPlan system. The design uses phrase-level chunks, selective emphasis, one of the registered placement regions, and the active safe-area profile.
- WebVTT or platform-native captions may also support accessibility. They remain platform-controlled, can visually duplicate burned-in captions, and must be checked during private platform review. They never replace the designed layer.
- Known approved narration text and timing drive CaptionPlan and WebVTT. Do not add speech recognition when those inputs exist.
- Existing approved or published videos are not re-rendered solely to adopt the new rule. See `docs/CAPTIONS.md` for the canonical design and AI boundary.

## Recovery QA routing

`pnpm qa <video-id> --recovered` selects the Git-manifest identity, verifies its hash, and generates new RECOVERY-GENERATED QA under recovery-work/phase-2-qa/<video-id>. Existing recovery QA directories are preserved rather than overwritten. This inspects accepted/candidate recovery bytes without rendering a video or treating QA as approval. Historical default render/QA routing remains unchanged.
