# Asset licenses and provenance

## Cycle #8 — Oklo master-review candidate

- Original geological relief, ore seams, groundwater flow, atomic fission and moderation artwork: Magnivis-authored `src/components/OkloWorld.tsx` and `src/compositions/Oklo.tsx`, project-owned. Illustrative reconstruction, not site footage, calibrated geometry, neutron tracks or visible radioactivity. Research figures and institutional media are consulted evidence only.
- Manrope400/600, pinned Fontsource5.3.0, unmodified SIL OFL1.1. Exact font/license hashes in `content-intelligence/cycles/cycle-8/rights-provenance.json`.
- Twelve original narration WAVs from established local Kokoro82M, `af_heart`, q8CPU, speed0.97, Apache2.0 model/output terms. Exact reviewed text and measured identities retained in `src/production/narration/oklo.json`; no paid API, cloned voice, music or sampled sound.
- Designed burned-in phrases and optional accessibility VTT are original text. Exact master and bounded decoded QA evidence are canonical SHA256-bound media; smoke/intermediate encodes and ordinary browser captures are disposable.

This records internal rights/provenance, not owner master or publication approval.

## Cycle #5 — Chladni sand master-review candidate

- Original plate/material drawing, analytic nodal fields, deterministic grain choreography, enlarged grain view and slowed side-view section: Magnivis-authored `src/components/ChladniPlate.tsx`, `src/production/chladni-geometry.ts` and `src/compositions/ChladniSand.tsx`; project-owned original artwork. These are explicitly qualitative illustrations, not calibrated plate dynamics or experimental footage. Smithsonian, Exploratorium and UNSW bodies were inspected as factual references; their photographs, figures, videos and sounds are not production assets.
- Manrope 400/600: existing pinned `@fontsource/manrope` 5.3.0, Mikhail Sharanda, unmodified SIL OFL 1.1. Exact chosen WOFF2 hashes and complete license retained in `content-intelligence/cycles/cycle-5/rights-provenance.json` and `Manrope-OFL.txt`; installed font binaries remain pinned dependencies.
- Fifteen exact narration WAVs: established local Kokoro-82M `af_heart`, q8 CPU, speed 0.97, Apache-2.0 model; exact reviewed narration with no cloning, auditions, paid calls or new provider. Measured cue identities/provenance and model digest retained.
- `public/audio/chladni/illustrative-tones.wav`: original Magnivis sinusoid synthesis by `scripts/generate-chladni-tones.mjs`, project-owned; two quiet illustrative tones, no recorded samples/music and no frequency-to-pattern calibration claim. Final measured audio gain changes no picture payload.
- Exact narration-derived burned-in captions and aligned optional VTT are original text. One canonical master, a decoded contact sheet and eight bounded review frames are retained; model/browser caches, smoke/intermediate encodes and routine captures remain disposable. All retained media has canonical SHA-256 identity; no platform payload duplication.

This records internal rights/provenance, not owner master or publication approval.

## Cycle #4 — paper geometry review candidate

- Original paper objects, unit-square diagonal, edge/cut/rotation choreography and abstract print artwork: Magnivis-authored SVG/CSS in `src/components/PaperObjects.tsx` and `src/compositions/PaperHalfShape.tsx`; project-owned original work. No institutional figure, PDF page, stock photograph, generated raster or logo embedded. Research pages are consulted evidence only.
- Manrope 400/600: existing pinned `@fontsource/manrope` 5.3.0, Mikhail Sharanda, unmodified SIL OFL 1.1. Exact chosen WOFF2 hashes and complete license in `content-intelligence/cycles/cycle-4/rights-provenance.json` and `Manrope-OFL.txt`. Font binaries remain reproducible pinned dependencies rather than redundant durable copies.
- Eighteen exact local Kokoro-82M `af_heart` narration WAVs: established Apache-2.0 model output from internally reviewed V3 narration, speed 0.96, q8 CPU; no cloning, auditions or paid provider. Exact clips are canonical media; model digest and independent speech-inspection provenance retained. Model cache remains disposable.
- Narration-only audio with operation pauses: no music, ambient or sampled effect assets. Internal gain mastering preserves video packet bytes; exact final loudness/provenance/QA bind the review master.
- Designed burned-in phrase captions and aligned optional VTT: original exact narration-derived text. MP4, decoded contact sheet and eight bounded review captures are canonical originals/evidence; no duplicate platform payloads or device screenshots.

This records rights/provenance and internal production only; owner master/publication approval remains absent.

| Asset | Source/author | License | Use and modifications |
|---|---|---|---|
| Manrope font files | `@fontsource/manrope`; original typeface by Mikhail Sharanda | SIL Open Font License 1.1 | Bundled npm font files; used for labels/body text. |
| Space Grotesk font files | `@fontsource/space-grotesk`; original typeface by Florian Karsten | SIL Open Font License 1.1 | Bundled npm font files; used for display typography. |
| Celestial bodies, star field, light, grain, and transitions | Original procedural code created for Magnivis | Project-owned original work | Deterministic SVG/CSS rendering; no external textures or imagery. |
| `earth-to-stars.wav` | Original procedural synthesis created for Magnivis | Project-owned original work | Deterministic stereo ambient bed, impacts, and transition sweeps generated by `scripts/generate-audio.mjs`. |
| Kokoro-82M v1.0 model and `af_heart` voice | hexgrad / onnx-community | Apache License 2.0 | Local text-to-speech generation only; model cache is not committed. Source: `https://huggingface.co/hexgrad/Kokoro-82M`. |
| Video 001 narration WAV files | Generated locally with Kokoro-82M `af_heart` from Magnivis-authored copy | Project output under Apache-2.0 model terms | Six timed narration cues generated by `scripts/generate-narration.mjs`; no cloned or identifiable person's voice. |
| Video 002 ocean column, particles, depth graphics, seafloor, and Everest silhouette | Original procedural code created for Magnivis | Project-owned original work | Deterministic SVG/CSS rendering; the silhouette is illustrative while its vertical scale is data-driven. |
| `ocean-depth.wav` | Original procedural synthesis created for Magnivis | Project-owned original work | Deterministic stereo ambience, impacts, descent sweeps, and restrained pings generated by `scripts/generate-ocean-audio.mjs`. |
| Video 002 narration WAV files | Generated locally with Kokoro-82M `af_heart` from Magnivis-authored copy | Project output under Apache-2.0 model terms | Seven timed narration cues generated by `scripts/generate-narration.mjs ocean-depth`; no cloned or identifiable person's voice. |
| Video 003 note, cash block, human figure, atmosphere, and Burj Khalifa comparison | Original procedural code created for Magnivis | Project-owned original work | Deterministic SVG/CSS rendering; no currency artwork, third-party imagery, building photograph, or logo is embedded. The Burj Khalifa silhouette is illustrative while its vertical scale is data-driven. |
| `billion-dollars.wav` | Original procedural synthesis created for Magnivis | Project-owned original work | Deterministic stereo ambience, impacts, count pulses, and transition effects generated by `scripts/generate-money-audio.mjs`. |
| Video 003 narration WAV files | Generated locally with Kokoro-82M `af_heart` from Magnivis-authored copy | Project output under Apache-2.0 model terms | Seven timed narration cues generated by `scripts/generate-narration.mjs billion-dollars`; no cloned or identifiable person's voice. |
| Video 004 photon trails, velocity tunnel, celestial diagrams, and Proxima comparison | Original procedural code created for Magnivis | Project-owned original work | Deterministic SVG/CSS rendering; no external imagery, footage, or textures. Celestial diagrams are illustrative and quantitative labels come from committed source data. |
| `speed-of-light.wav` | Original procedural synthesis created for Magnivis | Project-owned original work | Deterministic stereo ambience, orbital ticks, impacts, and transition sweeps generated by `scripts/generate-light-audio.mjs`. |
| Video 004 narration WAV files | Generated locally with Kokoro-82M `af_heart` from Magnivis-authored copy | Project output under Apache-2.0 model terms | Six timed narration cues generated by `scripts/generate-narration.mjs speed-of-light`; no cloned or identifiable person's voice. |
| Video 005 engineering structures, collider ring, tunnel, atmosphere, and scale graphics | Original procedural code created for Magnivis | Project-owned original work | Deterministic SVG/CSS rendering; no third-party photographs, footage, architectural drawings, maps, logos, or textures. Structure silhouettes are illustrative; quantitative labels come from committed first-party research. |
| `human-engineering.wav` | Original procedural synthesis created for Magnivis | Project-owned original work | Deterministic stereo ambience, impacts, transition sweeps, and rail ticks generated by `scripts/generate-engineering-audio.mjs`. |
| Video 005 narration WAV files | Generated locally with Kokoro-82M `af_heart` from Magnivis-authored copy | Project output under Apache-2.0 model terms | Six timed narration cues generated by `scripts/generate-narration.mjs human-engineering`; no cloned or identifiable person's voice. |
| Wood Frog frog, forest, cardiac trace, tissue, cell, cryoprotectant, and recovery visuals | Original procedural code created for Magnivis | Project-owned original work | Deterministic SVG/CSS rendering; explanatory abstraction only. No scientific figure, external photograph, footage, texture, or logo is embedded. |
| `wood-frog.wav` | Original procedural synthesis created for Magnivis | Project-owned original work | Deterministic restrained freeze, explanation, cryoprotection, and thaw soundscape generated by `scripts/generate-wood-frog-audio.mjs`; no samples or external music. |
| Wood Frog narration WAV files | Generated locally with Kokoro-82M `af_heart` from the owner-approved script | Project output under Apache-2.0 model terms | Six hash-recorded narration cues generated by `scripts/generate-narration.mjs wood-frog`; no cloned or identifiable person's voice. |
| `captions/wood-frog.en.vtt` | Derived deterministically from approved narration cue text and timing | Project-owned original work | Optional platform caption track; no external transcription or third-party text. |

| Phantom Traffic vehicles, circular track, roadway, terrain, lighting and traffic movement | Original Magnivis procedural SVG/CSS and analytic explanatory kinematics | Project-owned original work | Original physical overhead scenes; no paper figure, photograph, stock footage, generated raster environment or external texture. Ring is disclosed as reconstruction; trajectories are illustrative, not measured data. |
| Phantom Traffic narration WAVs | Established local Kokoro-82M `af_heart`, exact owner-approved script | Project output under Apache-2.0 model terms | Six retained, duration-measured and hash-bound cues; no cloned or identifiable person's voice. Exact bytes are durable; regenerated audio would have a new identity. |
| `phantom-traffic.wav` | Original seeded procedural synthesis | Project-owned original work | Quiet stereo road texture and restrained transition accents; no sampled effects or external music. Generator and SHA-256 retained. |
| Phantom Traffic designed captions and optional WebVTT | Exact approved narration, manual semantic grouping and measured-clip timing | Project-owned original work | Burned-in caption layer plus optional accessibility metadata. No third-party transcription. |

| Phantom Traffic Instagram cover candidate | Original Magnivis procedural SVG/CSS, reusing original vehicle shapes | Project-owned original work | Separate original still and two-line topic headline; no copied footage/figures/imagery. Crop unmeasured; cover approval pending. Master bytes unchanged. |
| Phantom Traffic platform local model sheets | Exact approved-master decoded frames plus original profile/region overlays | Project-owned original work | Clearly labeled local/provisional evidence; no synthetic native screenshots or invented crop/UI geometry. |

Scientific source pages are factual references, not embedded media assets. No third-party photos, video, music, sound effects, or logos are included in V1.

## Longitude Clock — original production candidate v1

| Asset | Origin / rights | Exact provenance |
|---|---|---|
| Workbench, ship/ocean, Sun/observation/correction cards, north-pole globe and meridian geometry | Original Magnivis SVG/2.5D construction; no stock or generated imagery | `src/components/LongitudeObjects.tsx`, `src/compositions/LongitudeClock.tsx`, `src/production/longitude-geometry.ts`; candidate receipt binds exact implementation hashes |
| H4 large-watch study | Original simplified reconstruction, not museum photography or historical footage | `content-intelligence/reviews/longitude-clock-production-v1/h4-reference.json`: RMG ZAA0037 catalog and front photograph inspected; silver case, bow, enamel/Roman dial and side tab; protected photo remains temporary reference outside Git and is never embedded or traced. Detailed engraving and internal mechanism omitted. Illustrative hand setting is not a trial observation. |
| Source Serif 4 Regular | Adobe, SIL Open Font License 1.1 | Official `source-serif` release commit `80d3f8894c09c937bebfa9011247d2e1c79fd6f4`; exact OTF and complete license bundled in `public/fonts/longitude-clock/` |
| Source Sans 3 Regular / Semibold | Adobe, SIL Open Font License 1.1 | Official `source-sans` release commit `87b37a2daaed80fcb8e8ccb0085c4d72ddade12e`; exact OTFs and complete license bundled; font hashes in `provenance.json` |
| Ten exact narration WAVs | Local Kokoro-82M v1.0 ONNX, Apache-2.0 model; installed kokoro-js 1.2.1; bf_emma | Exact approved words; speed 0.92. Model/voice/package hashes and generation time in narration/model provenance. No voice cloning, actor impersonation or paid API. Exact WAVs are authoritative, not a promise of byte-identical regeneration. |
| Three audition WAVs | Same local licensed backend: bf_emma, bf_isabella, bm_george | Same approved excerpts at 0.95; audition sample hashes, technical inspection and selection rationale retained. No human listening/owner voice approval fabricated. |
| Ocean texture and sparse tactile taps | Original deterministic noise synthesis, Magnivis | `scripts/generate-longitude-sound.mjs`, seed 2048; no music, licensed library samples or purported historical watch recording. Exact WAV/hash retained. |
| QA frames/contact sheets | Derived from original candidate/source renderer | Exact candidate and QA hashes in production receipt; local evidence, no device/platform approval. |

Font source URLs, copyright notices, licenses and file hashes are retained in the font provenance. Model cards inspected: https://huggingface.co/onnx-community/Kokoro-82M-v1.0-ONNX and https://huggingface.co/hexgrad/Kokoro-82M/blob/main/VOICES.md. Local Whisper inspection is a separate corroboration tool, not narration, claim evidence or human listening; its cached model hashes are recorded and disposable caches are not committed.

### Longitude Clock candidate v2 — narrator revision

Exact approved words are newly synthesized locally with Kokoro `af_heart`, speed 0.92, q8 CPU, using the existing Apache-2.0 model. Individual WAV hashes, sample-count durations and model/voice-embedding provenance are retained under the v2 production review; v1 remains immutable. Soundscape is the same original seeded ocean/tactile/no-music construction retimed to the measured narration. Existing original visual/H4/font provenance is reused by explicit owner-approved visual direction, not by aesthetic default. No museum photograph or new external production media is introduced.

### Longitude Clock platform review artwork

| Asset | Origin / rights | Provenance |
|---|---|---|
| Instagram cover candidate v1 | Original Magnivis object-theatre composition; project-owned | `src/platform-variants/LongitudeCoverRoot.tsx`; existing original watch/ship shapes and pinned Adobe OFL fonts; complete approved question, no museum pixels or new external imagery. Exact PNG/hash retained; crop and approval pending. |
| YouTube/TikTok/Facebook representative stills | Decoded exact owner-approved V2 master | Separate frame recommendations at 0.7s / 1.6s / 29.1s, no bespoke artwork or master change. Actual native selection/crop requires review. |
| Platform local model sheets | Original approved-master decoded frames with surviving inset outlines | No device screenshots, guessed native UI or speculative Meta crop; full decode and frame/hash evidence retained. |

No new voice, music, stock asset or font was introduced in delivery preparation. V1 and V2 original production/license evidence remains immutable.

## Chocolate crystal choice — owner-review candidate v1

- Original authored chocolate geometry, packing tokens, network domains and transitions: Magnivis-created source in `src/components/ChocolateMaterial.tsx` and `src/compositions/Chocolate.tsx`. No scientific diagram, microscopy, commercial food photograph or footage copied.
- Atkinson Hyperlegible Next: unmodified variable font from official Google Fonts `ofl/atkinsonhyperlegiblenext`; SIL OFL 1.1, copyright/license and upstream metadata retained in `public/fonts/chocolate/`. Weights 400/500/600; exact binary/license hashes and retrieval time in `provenance.json`. OFL permits embedding/distribution with retained license; no standalone resale or modified reserved-name assertion.
- Eleven original synthesized af_heart narration clips: local Kokoro 82M ONNX q8 CPU, Apache-2.0 model, no voice cloning or auditions. Current exact weights/voice hashes in the scoped production `model-provenance.json`; WAV hashes/timing in `src/production/narration/chocolate.json`. Previously inspected official model-card licensing retained as research context; model caches disposable, exact WAVs durable.
- Sparse original deterministic tactile waveform accents: `public/audio/chocolate/tactile.wav`, generator source `scripts/generate-chocolate-production.py`, exact hash/events in scoped `sound-provenance.json`. No sample library or continuous music. Illustrative macroscopic handling/fracture, never microscopic observations.
- Master, decoded QA, audio, licenses and source input bindings are retained for audit/reproduction. No assertion of byte-identical re-rendering.

Upstream OFL trailing whitespace: exact raw license bytes retained in `public/fonts/chocolate/OFL.upstream.gz`; readable `OFL.txt` removes trailing whitespace only. Provenance records both identities. Font binary and complete legal wording remain unchanged.

## Chocolate Crystal Choice — post-master review artwork and local QA

Separate Instagram cover: original Magnivis-authored still in `src/chocolate-cover-index.tsx`, consciously reusing this same story’s original chocolate geometry and licensed unmodified Atkinson Hyperlegible Next font. Exact PNG/source/font hashes in scoped cover-provenance.json; existing complete SIL OFL 1.1 and metadata retained. No new font, music, stock image, commercial footage or scientific figure. Cover review/crop remains pending; master approval does not transfer. Other platform references and local/phone QA images are decoded from the exact approved original master. Inset overlays are original local guides, not native screenshots or device evidence. Canonical copies preserve exact master bytes; no derivative or re-encoding.

## Cycle #4 — post-master cover and presentation preparation

One original 1080×1920 cover PNG in `artifacts/covers/paper-half-shape-cover-v1.png`, SHA-256 `f5f6192ce3b7b306136b7c02b6dd2d29b7e5a92165d18c2ff83449e9a0277594`: Magnivis-authored SVG/CSS/typography in `src/paper-cover-index.tsx`. Ideal paper geometry and half overlay are original, project-owned drawings; pinned Manrope 5.3.0 remains unmodified under the existing retained SIL OFL 1.1. No new stock asset, font, generated raster, voice, music or third-party illustration. Browser render and exact-image inspection are hash-bound in Cycle #4’s cover QA records. The selected terminal frame for TikTok/Facebook references the existing canonical decoded approved-master PNG, without a duplicate. One cover payload serves identical custom-cover presentation needs on YouTube/Instagram; these bindings require separate native crop review or explicit publication risk acceptance. Master approval does not approve the cover.

## Cycle #5 Chladni presentation cover — 2026-10-03

`artifacts/covers/chladni-sand-cover-v1.png` is original repository-native artwork, rendered from `src/chladni-cover-index.tsx` using the existing original Chladni plate/grain component and licensed Manrope fonts. Existing Cycle #5 OFL/license/provenance applies unchanged. No institutional image, third-party footage or AI-generated bitmap is embedded. The cover is a separate publication-review candidate; master approval does not approve it. TikTok/Facebook reference the already canonical decoded `frame-24-19.4s.png`; no new extract or duplicate was created.

## Cycle #6 — tally-fire master candidate

Original project-owned tally grain/split, two-cart illustration, old-Palace silhouette, furnace/chimney/floor cutaway and restrained fire in `src/components/TallyRecord.tsx`, `src/components/PalaceFireScene.tsx` and `src/compositions/TallyFire.tsx`. All geometry is disclosed reconstruction; no museum image, historical painting, source figure or third-party footage embedded. Furnace rumble/wood ticks are original deterministic synthesis in `scripts/generate-tally-sound.mjs`, not historical recordings or sampled music.

Twenty-two exact af_heart narration clips use established local Kokoro 82M ONNX q8 CPU / Apache-2.0 terms, with measured cue/sample/hash provenance in `src/production/narration/tally.json`. No voice cloning, auditions, paid calls or new service. Manrope 5.3.0 is unmodified under SIL OFL 1.1; complete license retained in `content-intelligence/cycles/cycle-6/Manrope-OFL.txt`, with font binary hashes and rights assessment in `rights-provenance.json`. Master/audio/selected decoded evidence are registered canonical payloads; no master approval or publication rights decision is implied by generation.

## Cycle #6 replacement: heat barrier (2026-10-03)

Original Magnivis water/metal interface artwork and qualitative thermal paths: `src/components/ThermalInterface.tsx`, `src/compositions/HeatBarrier.tsx`; project-owned code/art. No scientific figures, supplementary videos, NASA imagery, stock media or raster generation used in production. Source papers and university-hosted PDF are consultation evidence only. Vapor gap and animation deliberately uncalibrated.

Twelve exact full-sentence narration WAVs under `public/audio/heat/narration/` use the established local Kokoro model and primary `af_heart` voice, under the previously documented Apache-2.0 model terms; no cloning or paid generation. Narration is the only audio layer. Manrope 400/600 uses the existing pinned `@fontsource/manrope@5.3.0` files, SIL OFL 1.1; exact font/license hashes and copied license are in `content-intelligence/cycles/cycle-6/revision-2/rights-provenance.json` and `Manrope-OFL.txt`. Canonical master and retained internal render are separately hash registered; neither owner approval nor publication permission is granted by registration. Rejected Tally Fire assets and their provenance remain unchanged.

## Cycle #6 execution revision: heat barrier v4 (2026-10-03)

Same original thermal-interface direction and licensed Manrope typography; no external visual/audio assets added. Revised original geometry/labels are in `src/components/ThermalInterfaceV4.tsx` and `src/compositions/HeatBarrierV4.tsx`. Kokoro `af_heart` at 0.97 remains the narrator under the established model license: only the complete name sentence is newly synthesized through a bound production phonetic input, then all twelve clips receive boundary-only trimming. Original eleven sentence parents and new name-source parent are recorded by immutable media references; approved wording is unchanged. No global narrator/provider change, voice cloning, music or paid provider. See `content-intelligence/cycles/cycle-6/revision-3/rights-provenance.json`, `narration-treatment.json` and `pronunciation-evidence.json`. New unique narration/master/decoded QA payloads have canonical identities; every previous media identity remains unchanged.

## Cycle #6 publication cover — 2026-10-03

`artifacts/covers/heat-barrier-cover-v1.png` is original Magnivis procedural artwork generated from existing thermal-interface primitives in `src/heat-cover-index.tsx`, with the existing licensed Manrope typography (SIL OFL1.1). No photo/AI raster/third-party illustration added. It is one canonical PNG shared by the YouTube/Instagram recommendations; TikTok/Facebook reference the existing decoded2.0s frame. Cover rights/layout/visual/presentation evidence is under `content-intelligence/cycles/cycle-6/publication/qa/`; the owner-approved V4 video remains byte-identical. Cover selection/publication approval is pending at the existing publication gate.

## Cycle #7 — sealed scroll master candidate (2026-10-03)

Original Magnivis SVG charcoal/slice/surface geometry and sample marks: project-owned original artwork, `src/components/ScrollSurface.tsx` and `src/compositions/SealedScroll.tsx`. Marks are illustrative, never an original scan or Hebrew transcription. No source figure, artifact photograph, footage, music or soundscape is included. The Seales et al. CC BY-NC article and university pages are consultation evidence only.

Manrope 400/600 uses existing pinned `@fontsource/manrope@5.3.0`, SIL OFL 1.1; exact font/license hashes in `content-intelligence/cycles/cycle-7/rights-provenance.json`. Nine narration clips are original local Kokoro `af_heart` output under the established Apache-2.0 model terms; measured words/timing and clip hashes in `src/production/narration/scroll.json`. No cloning, paid API, purchases or new infrastructure. Candidate review grants no master or publication approval.

## Cycle #7 replacement — interaction-free detection (2026-10-03)

The replacement uses original project-owned optical apparatus, mounts, detector modules, topology, path-amplitude curves and trial indicators in `src/components/OpticalBench.tsx` and `src/compositions/InteractionFree.tsx`. These are an ideal-model illustration, not photographs, researcher figures, actual photon trajectories, measured optical traces or a replica of the reported experiment. The source papers and participant account were consulted for evidence only. No third-party figure/footage was copied.

Narration is generated locally with the existing Apache-2.0 Kokoro-82M-v1.0-ONNX model and primary `af_heart` voice; full reviewed semantic sentences are retained in `public/audio/ifm/narration/`. No voice cloning, external API or paid asset acquisition. Typography uses existing pinned `@fontsource/manrope@5.3.0`, Manrope Latin400/600 under SIL OFL1.1. Exact existing font/license hashes and source URL are bound in `content-intelligence/cycles/cycle-7/revision-2/rights-provenance.json`. No music or soundscape. Source/audio/QA/canonical master identities are registered before Master Review; registration grants no owner or publication approval. The rejected Sealed Scroll rights/media records remain unchanged.

## Cycle #7 Interaction-Free revised master v3 — 2026-10-03

Original progressive quantum-path ribbons, enlarged probability-amplitude comparison, absorber/detector event drawings and trial-outcome scene: Magnivis-authored procedural SVG, project-owned; no researcher images, figure pixels, footage or simulated recorded events. New sources: `src/components/QuantumPossibilities.tsx` and `src/compositions/InteractionFreeV3.tsx`. Existing pinned Manrope5.3.0 Latin400/600 under SIL OFL1.1; exact font/license hashes in revision-3 rights provenance. Kokoro local af_heart0.97 under established Apache-2.0 model terms; nine new connected clips under `public/audio/ifm-v3/narration/`, unchanged opening references existing canonical `public/audio/ifm/narration/cue-1.wav` without copying. Narration and silence; no new sound library, paid provider or cloned voice. Research remains consultation-only. Exact master and decoded QA proofs receive immutable canonical registry entries; source hashes and rights record accompany candidate. Earlier scroll and IFM media/rights remain unchanged.

## Cycle #7 publication cover — 2026-10-03

`artifacts/covers/interaction-free-cover-v1.png` is project-owned original procedural artwork in `src/ifm-cover-index.tsx`, using the unchanged approved QuantumPossibilities absorber/detector primitives. Existing Manrope Latin400/600, pinned5.3.0, SIL OFL1.1; exact font/license evidence remains in Cycle7 revision3 rights provenance. No external photograph/figure/AI raster or new audio. One immutable SHA-256-bound PNG shared by YouTube/Instagram; TikTok/Facebook use existing canonical decoded32.7s frame by reference. Cover review/rights/layout evidence under Cycle7 publication/qa; exact owner-approved master unchanged. Cover/publication approval pending.

Cycle #8 scoped V3 encoding replacement uses the exact same original visual implementation, designed captions and existing licensed/local narration assets as V2. No new external assets. Exact AAC and decoded PCM are unchanged. Candidate identity and encoding evidence: `content-intelligence/cycles/cycle-8/size-revision-v3/encoding.json`. V2 remains preserved as failed registered evidence.

Cycle #8 historical retention parts preserve exact existing V2 payload byte ranges for audit/recovery, with no new creative assets or rights change. Their concatenation binds the original source provenance and catalog identity; retained V2 is ineligible for production/delivery. V3 remains unchanged.

## Cycle #8 editorial revision — original illustrated discovery story

The V4 editorial render and corrected V5 candidate use original Magnivis SVG Earth, illustrative sample investigation, qualitative fission-evidence, geological and atomic artwork. No archival photographs, institutional figures, measured isotope plots or site footage are reproduced. Hydrogen/neutron geometry and ancient deposition are expressly schematic. The V5 change removes unintended open-path fills; V4 is retained as an immutable unsubmitted production intermediate.

Final narration consists of eight locally generated Kokoro `af_heart` clips at speed0.97, under established Apache-2.0 model terms. Manrope400/600 remains the pinned Fontsource5.3.0 font under SIL OFL1.1. No music or external sound assets. Exact font/license hashes and generation provenance: `content-intelligence/cycles/cycle-8/editorial-revision-v4/compression-pass-2/rights-provenance.json`. Final audio: `public/audio/oklo-v4-r2/narration/`; narration identity: `src/production/narration/oklo-v4-r2.json`. The superseded first narration experiment remains documented as unregistered scratch, not durable production media.

Canonical media: `artifacts/masters/oklo-cycle8-candidate-v4.mp4` and `artifacts/masters/oklo-cycle8-candidate-v5.mp4`, individually SHA-256 bound in the catalog. Decoded review evidence is retained under `artifacts/qa-evidence/oklo-cycle8-v4` and `artifacts/qa-evidence/oklo-cycle8-v5`; actually identical evidence payloads reuse existing canonical identities. None grants owner master approval or publication authority. V2, V3 and all original rights evidence are unchanged.

## Cycle #8 publication presentation — original cover

`artifacts/covers/oklo-cover-v1.png` is original Magnivis code-authored artwork, created with `src/oklo-cover-index.tsx`. It depicts a symbolic Earth and the text “Nuclear Reactors Before Humans” / “Natural fission • ~2 billion years ago.” No machine, person, archive photo, institutional figure, AI-generated bitmap or external image is included. Pinned Fontsource Manrope400/600 uses existing SIL OFL1.1 license and hashes in Cycle8's original rights record. Actual cover rendering/font/bounds and full-resolution inspection are documented under `content-intelligence/cycles/cycle-8/publication/qa/`. The exact corresponding2.833333s V5 frame reuses the existing byte-identical canonical V4 evidence PNG; a separate inspection records its V5 relation, without changing prior provenance. Video/audio/captions remain the owner-approved V5 bytes; no new narration or soundtrack. Cover selection remains pending Publication Review and does not prove native crops.

## Cycle #9 — Two Goals, master candidate v1 (2026-10-04)

Original SVG pitch, schematic team markers, ball, scoreboard and explanatory outcomes are Magnivis-owned artwork in `src/components/TwoGoalsPitch.tsx` and `src/compositions/TwoGoals.tsx`. No team logos, player portraits, match footage, newspaper scans or third-party diagrams appear. Player colors and positions are explicitly schematic. Historical sources are consultation only; no license to reproduce their media is asserted.

Narration uses the existing local Kokoro-82M `af_heart` workflow and established Apache-2.0 model terms; fourteen complete reviewed sentences, with source hashes in `src/production/narration/two-goals.json`. No voice cloning, paid call, music or crowd recording. Manrope600 is the existing pinned Fontsource5.3.0 font under SIL OFL1.1. Exact font/license hashes and rights scope are recorded in `content-intelligence/cycles/cycle-9/rights-provenance.json`. Canonical master, audio and retained QA captures are registered through the existing catalog; no owner master or publication authority is implied.

### Cycle #9 V2 scoped Grenada pronunciation revision — 2026-10-04

Three original complete-unit Kokoro af_heart/speed1 WAVs at `public/audio/two-goals/narration-v2/cue-{8,9,11}.wav` replace only affected units by new identity; eleven V1 WAVs are referenced unchanged. Existing Apache-2.0 local model/voice provenance and rights remain applicable; no voice cloning, paid provider or new third-party material. Three contextual V1-then-V2 audition WAVs under `artifacts/qa-evidence/two-goals-cycle9-v2/` derive solely from those project-generated recordings and preserve sentence context. V2 master and decoded QA frames reuse original project-owned pitch artwork and existing licensed Manrope font. Exact hashes/parents are in the canonical media catalog. No historical asset identity or rights record altered.

### Cycle #9 Publication Review original cover — 2026-10-04

`artifacts/covers/two-goals-cover-v1.png`, SHA-256 `709d424ed6a3125539af942a73868ca5d85c9022ad3ce8ff5a629c439bcd1923`, is original code-authored SVG/CSS pitch artwork rendered from `src/two-goals-cover-index.tsx`. Existing Manrope Fontsource5.3.0/SIL OFL1.1 typography; no broadcast footage, team logos, portrait, photograph or generated photorealistic imagery. Shows symbolic Barbados markers protecting opposite goals; marked illustrated reconstruction. The approved master is its registered parent. YouTube/Instagram reference that one cover payload. TikTok/Facebook reference existing project-owned decoded V2 frame1860 at62.0s, with unchanged canonical provenance and newly bound cover-selection evidence. No new music, third-party asset or video payload. Cover selection awaits separate publication approval.

## Cycle #10 — Craft documentary master candidate

- Exact archival pages: 1860 *Running a Thousand Miles for Freedom* frontispiece/title page and 1872 William Still portrait leaf. Public-domain nineteenth-century published works; faithful two-dimensional scans acquired via Internet Archive IIIF. Canonical files are in `public/visuals/craft-escape/`; exact URLs, SHA-256, inspected identity, rights rationale and limitations are in `content-intelligence/cycles/cycle-10/archival-assets.json`. CSS viewport crops do not change canonical bytes. Later portraits are labeled; the memoir’s stated omission of facial poultice is preserved. No generated likeness or reenactment.
- Modern register, bandaged-hand illustration and route sequence: original Magnivis explanatory linework, not authentic historical documents/objects or a measured route.
- Manrope 5.3.0, pinned Fontsource package: SIL OFL 1.1; exact font/license identities in Cycle #10 `rights-provenance.json`.
- Narration: local Kokoro af_heart under existing Apache-2.0 model terms; exact script/cue/model provenance retained. No paid API, cloned voice, music or third-party historical ambience.
- Research newspaper and scholarly facsimiles remain research evidence. They are not reproduced as production artwork. No publication authorization granted.

Cycle #10 V2 also presents the unchanged original newspaper crops `content-intelligence/cycles/cycle-10/research/singular-escape-inspected.png` (The Liberator, January 12, 1849) and `slave-hunters-inspected.png` (November 1, 1850). These are public-domain nineteenth-century newspaper reports, not escape-day imagery. Webpack imports reuse their existing canonical identities; no durable duplicate is created. The copyrighted Martinez scholarly reproduction remains consultation-only. V2's moving register, hand and route are original explanatory drawings, labeled as reconstructions/schematic rather than historical artifacts. Prior V1 rights records remain unchanged.

Cycle #10 V3 reuses the exact V2 narration, public-domain portraits and newspaper crops, and Manrope font under their existing provenance. New connected signature-line, bound-hand adaptation and Baltimore assurance-question graphics are original SVG/CSS in `src/components/CraftDocumentTheatreV3.tsx`; the interrupted line is expressly explanatory, not a reconstructed physical gate. No new archival acquisition, synthetic actor, historical footage, third-party asset or music is introduced. V2 media and licensing records remain preserved.

Cycle #10 publication cover V1: `artifacts/covers/craft-escape-cover-v1.png` is original code-authored typography/layout (`src/craft-cover-index.tsx`) using existing SIL-OFL Manrope and the already registered public-domain Ellen Craft1860 frontispiece and William Craft1872 engraving from `public/visuals/craft-escape/`. Later portrait dates are disclosed on the cover; no new historical scene or AI image. Native TikTok/Facebook cover reference is unchanged canonical V3 QA frame2313 (77.1s); its original archival licensing and master identity remain intact. No new audio/video or license transfer.


## Cycle #11 — Han van Meegeren candidate V1

- `public/visuals/vermeer-forgery/court.jpg`: Bram Wisman / Anefo, 29 October1947, Nationaal Archief934-6704. Current Commons crop, explicit CC0 1.0dedication. Source and exact hash: `content-intelligence/cycles/cycle-11/archival-assets.json`. A dated court photograph, never1945arrest footage or reenactment.
- `public/visuals/vermeer-forgery/emmaus.jpg`: Koos Raucamp / Anefo, October1945photograph of van Meegeren’s1937Emmaus painting, Nationaal Archief133-1145. Current Commons straightened reproduction, explicit CC0 1.0dedication. Same hash-bound provenance record. It is not the Adulteress painting sold to Göring.
- Original paint/support layers, schematic crack networks, material-comparison shapes and modern legal summaries: Magnivis-owned explanatory artwork; no actual scan, recovered paper or historical scene implied.
- Existing pinned Manrope400/600, SIL OFL1.1; existing local Kokoro82Maf_heart under established Apache2.0model terms. Exact font/model/output bindings accompany production. Narration and silence; no additional music, sound library or generated historical image.
- Scholarly and period reporting inspected for research only; no thesis/report PDF or copyrighted scientific figure reused as a production asset.

### Cycle #11 V2 revision

V2 reuses the exact two CC0 photographs, ten local Kokoro `af_heart` WAVs and pinned OFL Manrope font assets documented above. No new external asset or historical footage was acquired. `src/components/VermeerInvestigationV2.tsx` contains new Magnivis-owned empty attribution-frame, hardened paint-plane, schematic binder comparison and connected layer-network/legal-summary graphics. The binder motif is illustrative, not molecular structure, a real micrograph or a chemical fingerprint. Crack paths reuse the project-owned schematic primitive. V2's rights and preservation bindings are under `content-intelligence/cycles/cycle-11/revision-v2/`; no historical asset rights or approval changed.

## Cycle11 publication cover V1

`artifacts/covers/vermeer-forgery-cover-v1.png` is an original code-authored1080×1920 composition (`src/vermeer-cover-index.tsx`) using the existing CC0 Bram Wisman/Anefo1947 court photograph at `public/visuals/vermeer-forgery/court.jpg` and licensed Manrope typography. SHA-256 `91e6e2c0ec4bb8607e1b18fbc0d3bad1af22fd61de1cad416b786aad350d2e00`. “His defense? It’s a forgery” is a modern summary, explicitly not a quotation. No fabricated historical action or generative photographic asset. Canonical exact-master frame74 at74/30s (approximately2.47s) (`artifacts/qa-evidence/vermeer-cycle11-v2/frame-09-2.5s.png`) is reused for native frame-cover selection without copying media or changing its original provenance. Publication/cover approval and native crop/device checks remain pending.

## Cycle #12 — FLIP candidate V1

- `src/components/FlipHull.tsx` and `FlipOceanWorld.tsx`: original Magnivis code-authored hull/laboratory/boom silhouette, ocean cutaway, moving instrument/reference, schematic submarine, controlled ballast and wave-motion illustrations. Physical relationships follow the verified package; geometry and motion are explanatory. No source-image pixels, traced institutional artwork, copied scientific figure, archival footage or AI-generated raster asset. The Scripps brochure image remains consultation-only research evidence.
- `public/audio/flip/narration/cue-{1..11}.wav`: original complete-unit local Kokoro `af_heart`, speed1, under the established Apache-2.0 model terms. Exact script, model, phoneme input, output hashes and measured timing are retained. No voice cloning or paid provider.
- `public/audio/flip/ocean-process.wav`: original deterministic seeded procedural sea wash with brief illustrative water/air cues, authored in `scripts/generate-flip-soundscape.mjs`. No recorded FLIP operation, third-party sound library, music or licensed archival audio.
- Existing pinned Fontsource Manrope5.3.0 Latin400/600, SIL OFL1.1; exact font and license hashes in `content-intelligence/cycles/cycle-12/production-v1/rights-provenance.json`.
- The master and decoded QA images derive from this original artwork, licensed font and original audio. Canonical media identities are registered once; QA imagery is inspection evidence, not a platform asset. No rights or approval transfer to historical media, platform content or publication.
- `artifacts/qa-evidence/flip-cycle12-v1/voice-only-then-full-mix.wav` is a diagnostic comparison derived only from the original ballast narration and exact rendered mix, with0.5s of generated silence between versions. It is listening evidence, never an alternate published master. Both unreviewed authoring renders and their retained QA sheets use the same original graphics, narration, font and sound rights; they carry no owner approval.

## Cycle #13 — Devils Hole candidate

- Original geographic locator, qualitative outer-Earth seismic paths, warm limestone fissure/cave section, water/shelf/material and representative pupfish: Magnivis code in `src/components/SeismicConnection.tsx`, `src/components/SeicheBasin.tsx` and `src/compositions/DevilsHole.tsx`, project-owned. Explicit schematic reconstruction; no event footage, measured ground motion, wave-height convention, exact cavern survey or fish population depiction.
- Consulted NPS site/monitoring images and USGS/USFWS pupfish photograph are research references only; no pixels or traced artwork enter production. Pupfish photo page labels Public Domain/USFWS while image credits Olin Feuerbacher; discrepancy retained in production inspection, no external production clearance inferred.
- Pinned Manrope Fontsource5.3.0, unmodified SIL OFL1.1; exact selected WOFF2/license hashes in `cycle-13/production-v1/rights-provenance.json`.
- Eleven exact137-word narration units: established local Kokoro82M `af_heart`, q8CPU speed1, Apache2.0 model. Complete-unit Kamchatka/seiche phoneme repairs, original erroneous clips preserved. No cloning or paid API.
- `public/audio/devils-hole/local-water.wav`: original deterministic procedural water and one restrained connection cue; project-owned, no music, sampled recordings or disaster rumble. Final mastering applies measured constant audio gain and copies the video payload.
- Designed phrase captions and optional accessibility VTT are original text. One SHA256-bound canonical candidate and bounded decoded QA evidence; previous authoring renders and clips preserved as unapproved evidence. Dependencies/caches, browser captures and intermediates are temporary.

Candidate production authorization only; exact owner master and publication approval remain absent.

## Cycle #13 — Revision2 master-review candidate

- `public/images/devils-hole-v2/desert-pool-reconstruction.png`: original built-in image_gen locality key art under the authorized revision. Prompt, reference role and inspection in `cycle-13/revision-v2/image-generation.json`; broad limestone/fissure context informed by NPS site photo, with no pixel tracing, people/equipment/marks or exact surveyed geometry. In-frame illustrative-reconstruction disclosure; not actual site/event footage. Camera/optical water movement is original code, not a measured July wave series.
- `public/images/devils-hole-v2/nps-2025-07-30-shelf.png`: exact NPS-credited monitoring still from the July2025 event report, original hash `07feff2be4f11402a352ad0cf0b406413ab0c244b4c64a62cb40846f480b92f3`. Asset credit and official public-domain government-work policy reinspected. Displays July30following-day date, NPS credit and “No claim to original U.S. Government works”; no protected marks, quake-wave footage, adjacent before/after or numerical removal inference. Acquisition/rights records in revision-v2.
- Natural Earth110m land GeoJSON in `src/data/devils-hole-land.json`, Public Domain per inspected terms; original globe shading/motion. No political-boundary or new quantitative claim. Data/prompt/source and asset hashes bound in V2 rights provenance.
- New locality optics, dimensional near-surface rock/water/shelf and side-on seiche, geographic energy cues and representative fish: original Magnivis code in the versioned V2 components/shaders/projection helper. Motion/geometry/paths/time/fish scale remain expressly qualitative. No site survey, local waveform, universal ray path or calibrated amplitude/period.
- Existing exact137-word Kokoro af_heart narration WAVs and original procedural-water sound reused through canonical references, with no copies/voice change. V2 raises only original sound gain18.06dB; whole mix remeasured. No music or false archival/disaster audio. Manrope5.3.0OFL1.1font files/license unchanged.
- Distinct V2 master, generated/observational assets and bounded QA evidence get immutable canonical SHA256 identities; failed first authoring pictures/renders remain separately unapproved. V1 and all historical inputs/media/approvals preserved.

Candidate revision authorization only; no exact owner Master Review approval, release/publishing package or platform action.

## Cycle #14 — The Dice With No Best Choice candidate V1

- `src/components/TactileDie.tsx` and `src/compositions/DicePuzzle.tsx`: original Magnivis software-projected six-plane cubes, mineral-grey surface, face shading, shadows, six-face demonstrations, weighted outcome partitions, dots and counter-choice arrows. No imported or traced mathematical figure, stock image, recorded physical throw or experimental data. Face topology preserves the verified multisets; motion illustrates a mathematical puzzle.
- `public/audio/dice/narration/cue-{1..9}.wav`: exact approved128-word narration, local Kokoro82M `af_heart`, q8CPU speed1, established Apache2.0model terms. Complete-unit phoneme/token and measured output records accompany the production. No voice cloning or paid API.
- `public/audio/dice/tactile.wav`: original deterministic damped oscillator/filtered-noise placement cues from `scripts/generate-dice-soundscape.mjs`; no music or third-party sound recordings.
- Existing pinned Fontsource Manrope5.3.0 Latin600/700, SIL OFL1.1. Font/license hashes and source provenance in `content-intelligence/cycles/cycle-14/production-v1/rights-provenance.json`.
- Master and bounded decoded QA images derive from these sources. Immutable canonical media registration supplies unique identities and generation lineage; QA imagery and sound comparison are inspection evidence. Candidate-production authority grants no master acceptance, platform or publication permission.

## Cycle #14 — V4 visual revision

- `src/production/dice-v4/` and versioned V4 world/evidence/composition components: original bounded WebGL rounded-cube ray intersections, fixed six-plane Manrope glyph atlas, face material/lighting/contact shadows, procedural walnut surface, thick face tokens, equal outcome beads and counter arrows. No stock/generated photographic dice, copied source figure or recorded random rolls; all geometry/motion is illustrative. Glyphs use existing pinned Manrope5.3.0 under SIL OFL1.1, unchanged.
- Original nine approved128-word Kokoro `af_heart` WAVs are reused by canonical reference. New `dice-v4.json` changes only timeline start times/holds; no voice, speed, waveform or words changed. Existing Apache2.0model provenance retained.
- `public/audio/dice-v4/tactile.wav`: new original deterministic procedural contact/face-turn/placement cues. No external sound, music or physical experiment. Source and hashes in `dice-v4-soundscape.json`; voice remains foreground.
- Exact source/rights bindings at `content-intelligence/cycles/cycle-14/revision-v4/`. New master and retained prototype/decoded QA evidence have unique canonical identities; previous masters/assets and their rights remain unchanged. Candidate revision authority only, no publication permission.

## Cycle #15 — Venus Flytrap’s Fading Touch Memory candidate V1

- `public/images/flytrap/open-leaf.png`: original built-in `image_gen.imagegen` botanical surface plate, transparent background, exact prompt/tool/output hash in `content-intelligence/cycles/cycle-15/production-v1/`. Not filmed plant, microscopy or copied research imagery. Exterior reconstruction disclosed.
- `src/components/FlytrapLeaf.tsx`, `src/production/flytrap/model.ts` and composition: original Magnivis lobe/hair/probe articulation and qualitative organic tissue, electrical cues, calcium tint, fades and camera transitions. No empirical cell map, calibrated concentration, closure threshold or mechanics simulation.
- `public/audio/flytrap/narration/cue-{1..8}.wav`: exact locked116-word narration, local Kokoro82M `af_heart`, q8CPU speed1, established Apache2.0model terms. No cloned voice, paid API, third-party sound or music. Phoneme/audible machine inspection records retained.
- Existing pinned Fontsource Manrope5.3.0 Latin600 under SIL OFL1.1; license hash in production rights provenance.
- Master and bounded QA/authoring evidence derive from these sources and receive immutable canonical identities. Failed first pictures/render retained as unapproved evidence; all earlier cycles/assets/media/approvals unchanged. Candidate-production authority grants no master acceptance, delivery preparation or publication permission.

## Cycle 15 V2 revision — 2026-10-14

V1 and all historical provenance remain unchanged. Exact V2 source hashes and URLs are recorded in `content-intelligence/cycles/cycle-15/revision-v2/rights-provenance.json`.

- `public/images/flytrap-v2/lucy-bradley-cc0.jpg`: Lucy Bradley, CC0, explicitly identified by NC State at https://plants.ces.ncsu.edu/plants/dionaea-muscipula/ . Runtime cropping, enlargement and gradient; credited in film. No license inferred for other page images.
- Burri et al. 2020, PLOS Biology, DOI 10.1371/journal.pbio.3000740, CC BY 4.0: original S1/S2 AVI files retained in `artifacts/research-evidence/flytrap-v2/`. `public/video/flytrap-v2/first-stimulus.mp4` derives from S1: first-stimulus excerpt, source already slowed, cropped to remove charts, converted to 30 fps and held at its end. Author, DOI, license and modifications disclosed in the film. S2 consulted for trigger-hair movement only, not rendered. Source https://journals.plos.org/plosbiology/article?id=10.1371/journal.pbio.3000740 ; license https://creativecommons.org/licenses/by/4.0/ . Capture instants are unknown; acquisition records are not claimed as capture times.
- `public/images/flytrap-v2/inner-lobe-texture.png`: original generated illustrative tissue material via built-in image generation, exact prompt retained. No external reference image, observed microscopy or fluorescence claim.
- New curved mesh, camera choreography, WebGL shaders and qualitative calcium coloring: original repository-authored illustration. Existing af_heart narration, Manrope font and exact wording are reused with their original provenance.
- V2 master and QA images: original composite derivatives with parent identities in `artifacts/media-catalog.json`; first draft and prototype evidence remain separately preserved. No platform package or publication action.

## Cycle 15 targeted V3 revision — 2026-10-14

Exact URLs, source/derivative hashes, inspection and capture-date limits: `content-intelligence/cycles/cycle-15/revision-v3/rights-provenance.json`. V1/V2 and their original provenance remain unchanged.

- `public/images/flytrap-v3/open-trap.png` and `hair-macro.png`: original built-in generated botanical illustrations. Exact prompts/reference role retained in `revision-v3/image-prompts.txt`. The whole trap shows six sensory hairs; the macro illustrates three on a visible lobe. These are authored illustrative anatomy, not measured specimens or microscope photographs.
- `source-hair-bridge.png`: frame extracted from the existing Burri et al. 2020 S1 first-stimulus crop; CC BY 4.0. `recent-stimulus.mp4` and `one-movement.mp4` derive from the unchanged canonical S1/S2 AVI files. Temporal/spatial crops and muted 30fps conversion are documented. Single-movement crop retains hair base, source scale and annotations. Article: https://journals.plos.org/plosbiology/article?id=10.1371/journal.pbio.3000740 ; license: https://creativecommons.org/licenses/by/4.0/ . Author/year/DOI/license and modifications credited in film. Schematic signal timing appears outside documentary pixels and is not measured AP data.
- `artifacts/research-evidence/flytrap-v3/poppinga-s4.mov`: Poppinga et al. 2016, Beilstein Journal of Nanotechnology, supplementary S4 synchronous-closure movie, CC BY 2.0. Article copyright/license inspected: https://www.beilstein-journals.org/bjnano/articles/7/59 ; original: https://www.beilstein-journals.org/bjnano/content/supplementary/2190-4286-7-59-S4.mov ; license: https://creativecommons.org/licenses/by/2.0/ . The author/year, DOI, license, excerpt and original 5× slow motion are disclosed in film. Original capture instant unknown. `public/video/flytrap-v3/closure.mp4` is its 0.7–4.2s excerpt, muted, enlarged and converted to 30fps. No colorization or fabricated biological movement. It is labeled a separate observed specimen, not a paired calcium experiment.
- `artifacts/research-evidence/flytrap-v3/hirata-s1.gif`: Hirata et al. 2026, PLOS One, CC BY 4.0, DOI 10.1371/journal.pone.0349246. Two-angle closure GIF retained only as consulted/rejected source evidence; not rendered. Article/license and supporting caption inspected at https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0349246 . Source is 349×168 with ink markers; linked original data site returned 404. No improved original resolution or capture instant invented.
- Original V3 schematic marks and deterministic shot/medium controls are project-authored. Marks communicate relative calcium state, not molecule/cell counts, internal anatomy or observed fluorescence. Chemistry/strokes are disabled on documentary/context pixels.
- Existing Lucy Bradley CC0 photograph, original af_heart WAVs, Manrope and caption wording remain unchanged and reused by reference. V3's initial failed compositing draft and three diagnostic sheets remain preserved as rejected authoring evidence; its misplaced-photo credit is a recorded defect, never a production approval.

## Cycle15 delivery-v1 decoded cover — 2026-10-14

`artifacts/covers/flytrap-cycle15-delivery-v1/frame-90-3s.png` is an unmodified decoded frame90 (3.000s) from the exact selected V3 master, SHA-256 `d52e4b2440cfc4543702dae7bf5fa6ca4832913d2d52808b91e338173ee9e90a`. It contains original generated botanical illustration, code composition and bundled Manrope captions; no research footage appears in this frame. The parent master is `b43025461b0f2042d88444696048fbf1a1d83bb4991ee95d09adfc2baf9f7133`. Original on-image illustration disclosure retained. This is a proposed cover shared by four surface references, not a new production render or owner-approved native crop. See Cycle15 delivery-v1 selected-cover evidence and unchanged V3 rights provenance.

## Cycle15 final V2 selection — decoded delivery-v2 cover

`artifacts/covers/flytrap-cycle15-delivery-v2/frame-90-3s.png` is an unmodified decoded frame90 /3.000s from the exact preserved V2 master `cfd1b744e79631e940b3b009737be6addc96659501d520d7bfab61a9a7589582`. Cover SHA-256 `5fdd80fee901543bec55a200ab28f5b205468afa795dd5fae8c948b060ac6a09`;1080×1920 PNG. It contains original procedural botanical reconstruction, original generated tissue texture and bundled Manrope captions, with the existing reconstruction disclosure. No research movie pixels appear in this cover. New cover provenance points solely to V2, with no V3 media reuse. V2 rendered footage is Burri2020 S1 /CC BY4.0; photo Lucy Bradley /CC0; S2 consultation-only, no Poppinga/V3 illustrations. Original rights evidence and all earlier asset-license entries preserved. Proposed cover/native crops remain pending owner review.

## Voyager memory workaround — Cycle 16 candidate V1 (2026-10-16)

- `public/images/voyager/space.jpg`: [Voyager in Space, PIA17049](https://www.jpl.nasa.gov/images/pia17049-voyager-in-space-artist-concept/), NASA/JPL-Caltech artist concept. Official linked CDN original JPEG; source credit **Courtesy NASA/JPL-Caltech** burned into the candidate. Cropped/enlarged and gently reframed, never represented as recorded footage.
- `public/images/voyager/explorer.jpg`: [Voyager the Explorer, PIA17036](https://www.jpl.nasa.gov/images/pia17036-voyager-the-explorer/), NASA/JPL-Caltech artist concept. Same credit and disclosed treatment. Image pages identify no third-party credit or identifiable person.
- [JPL image-use policy](https://www.jpl.nasa.gov/jpl-image-use-policy/) permits public-site imagery use unless otherwise noted, requires credit and prohibits implied endorsement. Exact inspected policy, image pages, acquisition URLs and SHA-256 identities are retained in `content-intelligence/cycles/cycle-16/production-v1/rights-provenance.json`. No logo or endorsement is added.
- Original Magnivis memory/capacity/relocation, radio path and illustrative receiving-data graphics: project-authored SVG/React. These are explicitly simplified, with no claim to actual hardware layout, addresses, telemetry, real-time propagation or physically repaired memory.
- English narration: existing local Kokoro 82M q8 model, `af_heart`, speed 1; established Apache 2.0 model terms. Exact source text, model provenance, phoneme audit and eight WAV identities retained. No paid API or voice cloning.
- `public/audio/voyager/soundscape.wav`: original deterministic synthesized texture and sparse nonliteral cues, created by `scripts/generate-voyager-soundscape.mjs`; project-owned, no sampled recording or claim of actual spacecraft audio.
- Pinned Manrope 5.3.0 and Space Grotesk 5.3.0 via existing Fontsource packages, SIL Open Font License 1.1. License files remain in their installed packages. Burned-in captions use Manrope 600 at 54 px; no new typeface acquisition.

Every durable source/master/evidence payload has one immutable canonical catalog identity. Initial unapproved authoring render is preserved separately; no historical master or Flytrap asset is changed. These rights records grant no master approval or publication authorization.

## Voyager Cycle16 V2 editorial revision — October16,2026

Separate candidate `artifacts/masters/voyager-cycle16-candidate-v2.mp4` reuses the existing credited NASA/JPL-Caltech artist concepts, pinned OFL fonts, original Kokoro `af_heart` recordings and original synthesized soundscape under the unchanged V1 rights evidence. Revised memory/reference/signal graphics are original Magnivis code and explicitly illustrative. No new external media, generated image, paid service or literal spacecraft audio was introduced. The original failed chip remains disabled; the V1 ending renderer is reused. Full asset lineage and immutable binary identity: `content-intelligence/cycles/cycle-16/revision-v2/rights-provenance.json`, `implementation-bindings.json` and `master-candidate-v2.json`. This note grants no master/publication approval.

## Voyager Cycle16 approved-V2 delivery cover — October16,2026

`artifacts/covers/voyager-cycle16-delivery-v2/frame-90-3s.png` is a lossless decoded frame90(3.000s) of the exact owner-approved V2 master, with RGB24 equality checked against that MP4. It retains the NASA/JPL-Caltech artist-concept credit and illustrative-signal qualification. Existing NASA image rights, original Magnivis graphics and font provenance apply; no new external source media. One canonical cover serves four independent reference packages; no video duplication or new master. Source identity, frame extraction, dimensions and pending native crop/selector review are recorded in `content-intelligence/cycles/cycle-16/delivery-v2/qa/selected-cover-v2.json`.

## Cycle17 — SS Ohio V1 (2026-10-16)

Four actual official1942photographs from Imperial War Museums collections, downloaded as faithful public-domain scans via Wikimedia Commons: GM1505 (Sgt Deakin, frontal assisted formation), GM1480 (War Office official photographer, harbour), GM1469 (Lt H. E. Cook, aircraft-crash deck damage), A11498 (Lt J. E. Russell, discharging fuel into Boxall/Plumleaf). Exact files/hashes, inspected catalog/PD-scan/PD-UKGov records and rights rationale are in `content-intelligence/cycles/cycle-17/production-v1/rights-provenance.json`. Commercial use relies on expired Crown copyright, not the separately described IWM noncommercial license. No original claims of photo ownership, enhancement or endorsement. Images remain black-and-white archival stills; no AI filling or generated archival footage.

Original Magnivis geographic locator and qualitative tanker/escorts/tow/fuel diagrams, not exact plans or hydrodynamics. Original deterministic synthesized texture/tone, no third-party music or wartime recording. Narration uses existing local Kokoro82M q8 `af_heart`, Apache2.0 model; nine exact source WAV identities/settings in `src/production/narration/ohio.json`. Fonts: pinned Manrope5.3.0 and Space Grotesk5.3.0, SIL OFL1.1. IWM AYY193/19 footage and Wilkinson/RMG paintings evaluated and excluded; no paid licensing or preview extraction.

### Cycle #17 Ohio V2 — focused original rescue reconstruction

`src/compositions/ohio/RescueSequence.tsx` is original project-authored vector artwork: oblique ship volumes, compressed rescue movement, qualitative damage, surviving-fuel highlight and symbolic aircraft. No external mesh, generated historical photograph, stock footage, music or other new licensed dependency. Ship forms, dimensions, damage locations, connection lines, cargo space and aircraft shape are illustrative; they do not establish naval engineering or an exact fixed rescue formation. All four V1 public-domain official photographic binaries, credits, original soundscape and Kokoro `af_heart` narration remain unchanged. Rights/source inspection: `content-intelligence/cycles/cycle-17/revision-v2/rights-provenance.json`. V1 master/evidence remain unchanged; V2 is an unapproved owner-review candidate.


### Cycle #17 delivery V2 cover — 2026-10-17

`artifacts/covers/ohio-cycle17-delivery-v2/frame-107-3.567s.png` is an unretouched lossless decode of frame107 (3.566667s) of owner-approved Ohio V2 `e870cc600484eda2a366e921987db61d273ebd04a30bef25fa4019d12e6a9091`. Cover SHA-256 `b50cc40085c0c8d181ad526ee0d9c1ee23982f01f38b1597ad755636452a9f03`; one canonical payload referenced by four platforms. Original IWM GM1505 / Sgt Deakin official1942 photograph has expired Crown copyright (PD-UKGov / faithful scan), with existing original Magnivis type/captions and previously recorded font licenses. Same source image/provenance as the approved master; no new source, license reliance, retouch or generated historical imagery. Source inspection and rights remain in Cycle17 research and revision-v2/rights-provenance.json. Native cover crops and owner cover selection approval pending.

## Cycle #18 — Roadster V1 candidate

- Original approximate car exterior, curved surface, pressure arrows, reaction/rotation studies and abstract finite gas supply: Magnivis code in `src/components/roadster/` and `src/compositions/Roadster.tsx`. Qualitative original reconstruction/physics illustration, disclosed throughout; not Tesla CAD, copied frames, actual event footage, proprietary nozzle placement, internal architecture or measured force/trajectory. Research images/footage are excluded from production.
- Existing pinned Manrope 600 and Space Grotesk 500, Fontsource 5.3.0, unmodified SIL OFL 1.1. Exact license identities in Cycle18 `production-v1/rights-provenance.json`.
- Ten original exact-script local Kokoro82M q8 CPU `af_heart` speed1 narration WAVs; existing Apache2.0 model. Provenance, full-context phonemes and exact cue hashes retained; no paid service or cloned voice.
- Original deterministic synthesized low texture/air-like accent in `scripts/generate-roadster-soundscape.mjs`; no Tesla event sound, sampled recording or third-party music. Burned-in captions and optional VTT are original narration-derived text.

Source bodies are factual references only. No external footage license is assumed or required for this all-original visual production. Internal production does not grant owner master or publication approval.

### Cycle18 approved-V1 delivery cover

`artifacts/covers/roadster-cycle18-delivery-v1/frame-28-0.933s.png` is a lossless decoded frame28 (0.933333s) from exact approved original master `2172f0f77fc655f83bb00c8203204954625d7153a1612ea06261eec99fc25fdc`. Original Magnivis reconstruction, existing licensed fonts and burned-in captions/disclosures preserved; no external imagery, new text, crop or retouch. Pixel equality and parent media identity are bound in `content-intelligence/cycles/cycle-18/delivery-v1/qa/selected-cover-v1.json`. Cover is recommended for owner delivery review; native crop and selection controls remain unverified.

## Cycle #19 — mirror eyes V1 (2026-10-17)

- Original deterministic illustrated person, mirror, irises, eye section, sensitivity/masking schematics and playback motifs: Magnivis-authored in `src/components/mirror-eyes/MirrorWorld.tsx` and `src/compositions/MirrorEyes.tsx`. No external portrait, stock, scientific figure or footage. Illustrative anatomy, expanded movement and subjective schematics are disclosed.
- Narration: existing local Kokoro82M q8, `af_heart`, Apache2.0 model via repository provider; original exact script output. `src/production/narration/mirror-eyes.json` and Cycle19 phoneme audit preserve measured timing, input correction for “saccade” and provenance.
- Sound: original synthesized room tone and tactile recording/replay cues, no samples or third-party music; `scripts/generate-mirror-soundscape.mjs`.
- Fonts: existing pinned Manrope5.3.0 and Space Grotesk5.3.0, SIL Open Font License1.1; package LICENSE files bound in Cycle19 rights provenance.
- Scientific text excerpts remain research evidence only; no publisher imagery or figure rights inferred. Sources, acquisition limits, retrieval date and claim qualifications are retained in `content-intelligence/cycles/cycle-19/research/` and its verified knowledge package. No delivery, upload or publication authority.


### Cycle #19 delivery V1 selected cover

`artifacts/covers/mirror-eyes-cycle19-delivery-v1/frame-136-4.533s.png` is an exact lossless decoded frame 136 (4.533333s) from the owner-approved original Magnivis master, SHA-256 `c06b3f746fdff2ec22d8b7820d36079ae73b79bd619d13656bc954a767c9cc6d`. Cover SHA-256 `f1f1ee7bd4586283655defd59b3bb97d522f0bf4d733cadde9ff3276ae672760`. Original code artwork and existing licensed fonts retain production provenance; no external imagery, added text, retouch or new video. Parent identity and pixel equality are recorded in Cycle19delivery-v1/qa/selected-cover-v1.json. Selection is recommended for owner delivery review; native crop and separate cover approval unknown.

## Cycle #20 — Self-tickle V1 candidate

Original Magnivis procedural sculpted adult, articulated hands, skin-contact illustration, prediction model and simplified robot study: `src/components/self-tickle/TouchWorld.tsx`, `src/compositions/SelfTickle.tsx`. Original code artwork; no stock, scientific figures, reproduced apparatus imagery or third-party generated pictures. Anatomy, responses, magnitudes and timing are illustrative. Original synthesized sound: `scripts/generate-tickle-soundscape.mjs`; no samples or recorded laughter. Local existing Kokoro82M q8 `af_heart`, speed1.04, produces ten original script-bound narration WAVs; existing model Apache2.0 terms and provider boundary retained. Manrope600 (rendered) and existing Space Grotesk500 (imported) use pinned Fontsource5.3.0 / SIL OFL1.1, with exact installed license hashes in `content-intelligence/cycles/cycle-20/production-v1/rights-provenance.json`. Scientific article extracts are research evidence only, not production media. Exact candidate/QA identities recorded at owner master handoff; no master or publication approval granted.

## Cycle #20 — focused V2 candidate

Original procedural tactile close-ups, clothed flank, articulated hands, curved skin/contact study, anticipated impression and controller/follower robot are authored in `src/components/self-tickle/TactileFilm.tsx` and `src/compositions/SelfTickleV2.tsx`. Shading, camera transforms, depth and motion are code-generated; no stock, external imagery, copied research figures or generated bitmap assets. These are qualitative illustrations, not neural recordings, measured signal amplitudes or exact apparatus geometry. V2 copies the exact V1 AAC narration/synthesized-sound stream; all ten local af_heart takes, original soundscape, script, fonts and existing licenses remain unchanged. New direction/implementation and inherited font/model rights are bound in `content-intelligence/cycles/cycle-20/revision-v2/rights-provenance.json` and implementation bindings. V1 retains its independent immutable identity. No delivery or publication authority.

### Cycle #20 V2 delivery cover

`artifacts/covers/self-tickle-cycle20-delivery-v1/frame-1431-47.700s.png` is a lossless decoded frame1431 (47.700seconds) of the exact creatively approved V2 `8c457201205fcdc811a4894b59cfdd9472d110b2f12c45dc70e02f4b722c32ac`. Cover SHA-256 `72a47daf30bfcbd3749823db206148a518812d0ca3fddc9e5327860f7c4762a5`. Original Magnivis code artwork and existing licensed fonts; no new text, composite, retouch, crop or external imagery. Pixel equality and parent identity are bound in Cycle20 delivery-v1/qa/selected-cover-v1.json. One canonical PNG is referenced by all four prepared packages; selection is recommended for owner delivery review, with native controls/crops untested. No new video or approval transfer.

### Cycle #21 — jellyfish life-cycle reversal V1

All marine artwork is original deterministic Magnivis code in `src/components/jellyfish/LifeForms.tsx` and `src/compositions/JellyfishReversal.tsx`: species-informed transparent medusa, attached hydroid colony, medusa buds, regressing form, cyst, stolon, substrate, water/light and qualitative tissue field. Anatomical references are research evidence only; no scientific figure, stock photo, footage or external species image appears in the production. The cellular scene is an original explanatory illustration, not microscopy or an observed cell-lineage recording. Stage timing is compressed and scale changes per shot.

Narration is original output from the existing local Kokoro82M q8 model (`af_heart`, speed1.02; existing Apache2.0 model authority). Exact source text, input phoneme repairs, measured durations and WAV hashes are retained in Cycle21 and `src/production/narration/jellyfish-reversal.json`. The underwater air and harmonic transformation accents are original deterministic synthesis in `scripts/generate-jellyfish-soundscape.mjs`, with no samples or external music. Manrope600 comes from the pinned Fontsource5.3.0 package under SIL OFL1.1. Provenance and license hashes: `content-intelligence/cycles/cycle-21/production-v1/rights-provenance.json`. V1 is an owner-review candidate; no delivery or publication approval.

## Cycle21 focused cinematic V2 — 2026-10-18

Original Magnivis procedural assets in `src/components/jellyfish/MarineFilm.tsx` and `ConnectedTissue.tsx`: species-informed translucent medusa, regressing/folded bell, cyst, stolon, hydroid colony, qualitative connected tissue and underwater/substrate layers. Project-owned artwork; no outside footage, scientific figures, stock assets or species-substitution imagery. Optical contours and tissue shapes are illustrative, not measured anatomy or molecular observations. V1 research remains the claim authority.

The exact V1 mastered AAC stream is copied into the V2 picture. Existing Kokoro af_heart narration, synthesized soundscape, font licenses and canonical audio identities remain referenced without new synthesis or audio copies. V2 rights/provenance: `content-intelligence/cycles/cycle-21/revision-v2/rights-provenance.json`. V1 and historical assets retain their original identities and approvals/dispositions.

## Cycle21 approved V2 delivery cover — 2026-10-18

`artifacts/covers/jellyfish-reversal-cycle21-delivery-v1/frame-0080-2.667s.png` is an untouched full-frame PNG decoded from approved Magnivis original V2 master frame80 at80/30seconds, SHA-256 `def8dd2aacd26e3f6a644f15a02f0fc3df005615198c2a2212c289ff97a49994`. Pixel equality independently checked; no crop, added lettering, scientific-image retouch or external artwork. Parent master and original animation/audio rights remain in Cycle21 revision-v2/rights-provenance.json. `artifacts/qa-evidence/jellyfish-reversal-cycle21-delivery-v1/cover-candidates-phone.jpg` is an original internal evidence sheet of decoded frames30/80/150/1280/1540/1580 at360px width. Both canonical media reference the exact approved V2 parent; package manifests reference these payloads without duplicates. Selected cover is recommended for owner delivery review; native crops/controls untested.
