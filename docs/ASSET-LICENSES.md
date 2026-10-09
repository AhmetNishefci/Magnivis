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
