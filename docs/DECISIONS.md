# Significant decisions

## 2026-09-26 — Deterministic open captions for narrated Shorts

**Decision:** Render bottom-centered open captions into narrated Shorts through a reusable component and structured cue data. Retain WebVTT only as an optional accessibility/translation track whose placement is best-effort.

**Reason:** Private mobile review showed that YouTube's mobile Shorts player can move correctly positioned WebVTT captions to the top of the frame even while desktop respects the same file. This collides with Magnivis headlines and makes platform-controlled placement unsuitable for the primary mobile experience.

**Alternatives:** Rely on WebVTT positioning (inconsistent across clients); move captions in YouTube's mobile editor (manual and not reproducible); omit captions (weakens comprehension and silent viewing).

**Consequences:** Caption placement becomes deterministic and part of render QA. English text is always visible in the master, while viewers who also enable a soft caption track may see duplicate text. Existing public videos will not be re-uploaded merely to retrofit this decision; it applies from Video 004 onward.

## 2026-09-24 — Higher-bitrate YouTube upload masters

**Decision:** Render production masters with an 8 Mbps H.264 video target and a 192 kbps AAC audio target, while preserving 1080×1920, 30 fps, and `yuv420p` compatibility.

**Reason:** Private YouTube review of earlier videos exposed text softness after platform transcoding. A higher-quality upload master gives the encoder more source detail for typography, fine lines, and dark gradients without imposing an unreasonable file-size or render-time cost.

**Alternatives:** Keep the previous CRF 17 profile (smaller but produced lower-bitrate masters); render lossless intermediates (unnecessarily large for the current local/manual workflow); move immediately to 4K (not justified before testing whether bitrate alone resolves the issue).

**Consequences:** Masters are larger, and YouTube will still re-encode them. Human review after HD processing remains mandatory; upload bitrate cannot compensate for poor typography, unsafe placement, or an intrinsically low-resolution asset.

## 2026-09-22 — Progressive publishing ramp to a mixed-format weekly cadence

**Decision:** Ramp from 3 premium Shorts in Week 1, to 4 Shorts plus 1 long-form video in Week 2, then 5 Shorts plus 1 long-form video per week in Weeks 3–4 and steady state. This corresponds to a target of approximately 20–22 Shorts and 4 long-form videos per month.

**Reason:** Shorts provide discovery and fast editorial learning, while long-form builds deeper viewer relationships, durable value, and monetization-oriented watch hours. A staged ramp validates that the V1 engine and reusable primitives can support higher throughput without weakening the brand.

**Alternatives:** Remain at one or two Shorts per week (safer but too slow for the chosen learning and growth goals); immediately produce the steady-state volume (rejected because the workflow has not yet proven quality at that scale); pursue a Shorts-only strategy (rejected because it underuses long-form storytelling and watch-hour growth).

**Consequences:** Cadence is a target rather than a quota. Quality, accuracy, licensing, mobile review, and human publication approval remain hard gates. Reduce cadence rather than publish filler, repetitive work, or weak research. Candidate topics may change in response to meaningful performance data and creative findings.

## 2026-09-22 — Remotion with typed content specifications

**Decision:** Use React/Remotion and strict TypeScript content modules validated by Zod.

**Reason:** The owner already works in TypeScript, Remotion provides deterministic frame-based rendering, and typed modules allow derived scientific comparisons without live services.

**Alternatives:** JSON/YAML (friendlier to non-code editing but weaker for derived values/refactors); a custom Canvas/WebGL engine (more control, much higher V1 cost).

**Consequences:** Content remains inspectable and separated, while composition choreography can be bespoke. A future CMS/import format can target the same schema.

## 2026-09-22 — Procedural 2D celestial art, no Three.js

**Decision:** Build deterministic SVG/CSS celestial bodies and star fields.

**Reason:** Video 001 depends on legible silhouette, surface character, glow, and extreme scale transitions—not free 3D camera movement. 2D rendering is faster, easier to tune, and reproducible.

**Alternatives:** Three.js/WebGL; external NASA textures; generated raster art.

**Consequences:** No external image license or GPU/WebGL dependency. Future stories can add 3D selectively without changing the data/composition boundary.

## 2026-09-22 — Original procedural V1 soundscape

**Decision:** Generate a deterministic layered WAV in-repository instead of sourcing music.

**Reason:** It provides intentional sound, zero copyright ambiguity, offline rendering, and modular replacement later.

**Alternatives:** Licensed library music; silence; temporary placeholders.

**Consequences:** The first mix is atmospheric rather than melodic and must receive human listening review. Narration remains independently addable.

## 2026-09-22 — Local Apache-licensed narration

**Decision:** Generate modular narration cues locally with Kokoro-82M v1.0 and its `af_heart` voice, both published under Apache 2.0.

**Reason:** Human review found the ambient-only cut too understated. Local synthesis avoids paid services and credentials while preserving commercial-use provenance and deterministic regeneration.

**Alternatives:** Apple system voices (rejected because Apple's license prohibits public/commercial redistribution); paid TTS APIs (require cost and credentials); ambient-only audio (failed the listening review).

**Consequences:** The narration is synthetic and should be disclosed in the YouTube upload metadata. Voice cues remain separate from the soundscape and can be replaced without changing visual choreography.

## 2026-09-22 — No repository-local Codex skill in V1

**Decision:** Keep workflows in `AGENTS.md`, docs, and scripts until they have repeated and stabilized.

**Reason:** Codex supports `.agents/skills`, but a skill is most useful for a repeated stable workflow. V1 provides only one execution of each candidate workflow.

**Alternatives:** Immediately add research/render/QA skills.

**Consequences:** Less speculative agent machinery; reconsider after several videos expose genuine repetition.
