# Significant decisions

## 2026-09-27 — Model numeric shape separately from epistemic status

**Decision:** Quantitative claims use either a scalar quantity or a bounded range. Scalars may carry positive symmetric measurement uncertainty and an optional confidence description. Precision (`exact`, `rounded`, or `approximate`) remains separate from verification status.

**Reason:** Ocean Depth contains conventional 200–1,000 m light-zone boundaries and a 10,935 m ±6 m survey estimate. Forcing either into one exact scalar would erase scientific meaning, while marking every approximate measurement `uncertain` would confuse numeric precision with whether the scoped claim passed verification.

**Alternatives:** Keep scalar-only values and move ranges into prose (not machine-readable and encourages false precision); add more verification states (does not solve quantity shape); build a general measurement ontology (unnecessary for the current domains).

**Consequences:** Speed of Light remains backward-compatible through explicit scalar discriminants. Ocean Depth represents the light interval as a range and Challenger Deep as an approximate scalar with uncertainty. A verified claim can contain an approximate value or range when that qualified statement itself is evidence-backed and reviewed.

## 2026-09-27 — Separate editorial assets from production specifications

**Decision:** ContentAsset V1 is a platform-neutral editorial object between KnowledgePackage and VideoSpec. It owns purpose, angle, selected package hook/claims, claim-linked script segments, narrative beats, visual intent, narration direction, and readiness. VideoSpec owns exact format, frames, timing, files, captions, audio cues, and Remotion choreography. Future PlatformVariant and PublicationRecord remain separate and unimplemented.

**Reason:** One researched topic must support multiple legitimate stories without copying research or turning production choreography into the editorial model. Script segment claim references provide useful fact-checking traceability without annotating connective language.

**Alternatives:** Keep VideoSpec as both editorial and production data (prevents clean reuse); put frames and coordinates in ContentAsset (couples editorial intent to Remotion); introduce platform variants now (outside the current proof and premature).

**Consequences:** Video 004 references a production-ready ContentAsset and derives narration text from it. A second draft asset proves one-to-many reuse without a render. Existing legacy VideoSpecs remain unchanged. Some production/platform/publication-shaped fields remain in the legacy VideoSpec until a later bounded migration.

## 2026-09-27 — Preserve production through a knowledge compatibility projection

**Status:** The direct VideoSpec-to-KnowledgePackage reference described here was superseded by the Content Asset V1 decision above. The compatibility projection and all render-safety reasoning remain active.

**Decision:** Knowledge Package V1 uses global `source.*` IDs, package-namespaced claim/hook IDs, and claim-level evidence. Video 004 references its package directly, while `src/data/light.ts` projects quantitative package claims into the legacy fact shape consumed by its unchanged Remotion composition. `VideoSpec` permits either legacy facts or one package reference, never both.

**Reason:** This establishes the knowledge package as the factual source of truth without coupling reusable research to production choreography or risking changes to a published video. Global source IDs allow exact source records to be reused safely; package-scoped claim IDs remain unambiguous through the package reference.

**Alternatives:** Redesign every video and composition immediately (too broad and risky); duplicate facts in both systems (creates drift); make the package own scripts, timing, captions, or publication data (violates the editorial/production boundary).

**Consequences:** Existing videos can migrate incrementally. Compatibility projections are temporary and narrow; they must derive values rather than copy them. The registry rejects duplicate packages, conflicting global source records, and dangling downstream claim/hook references. No database or workflow engine is introduced.

## 2026-09-27 — Make the knowledge package the durable editorial root

**Decision:** Evolve Magnivis from a YouTube-focused video repository into one multi-pillar knowledge-media engine. A verified knowledge package will own topic understanding, sources, claims, caveats, hooks, story opportunities, and related questions. Videos, articles, and platform variants will reference it as downstream assets. The first implementation remains file-backed TypeScript/Zod and preserves the current Remotion system.

**Reason:** Research and factual review should be reusable across multiple valuable assets, while scripts, visuals, packaging, and platform behavior remain purpose-specific. Making a finished video the root duplicates research, weakens claim traceability, and makes cross-platform learning harder.

**Alternatives:** Continue with one isolated specification per YouTube video (working but poorly suited to multi-output reuse); immediately build a database, queue, CMS, and provider orchestration platform (premature before the domain stabilizes); create separate accounts or brands per pillar (unsupported by current evidence).

**Consequences:** Phase 1 begins with a Knowledge Package V1 schema and one migrated existing topic, not a rewrite. Publishing stays manual and human-approved. Database/queue/provider infrastructure remains deferred until concurrency, volume, or integration requirements justify it. The previous YouTube-only cadence is historical validation rather than the new cross-platform operating target.

## 2026-09-26 — Compare engineering structures by one-dimensional extent

**Decision:** Video 005 compares each structure by one explicitly named linear dimension: height, dam-axis length, ring circumference, or tunnel length. It does not rank unlike structures by an undefined notion of “size.”

**Reason:** “Largest thing humans built” becomes misleading when height, area, volume, mass, and network length are mixed. A single-dimensional escalation remains visually understandable and supports an honest derived closing comparison.

**Alternatives:** Rank structures by mass or volume (reliable like-for-like public data is inconsistent); mix multiple size metrics without qualification (rejected as misleading); focus on one structure only (scientifically clean but loses the repeated scale-reset story).

**Consequences:** On-screen labels name the relevant dimension, visuals are illustrative rather than common-scale engineering drawings, and the title avoids claiming a universal largest structure. Future comparisons must preserve the same metric discipline.

## 2026-09-26 — Toggleable YouTube captions, without burned-in narration text

**Decision:** Keep narration captions as optional YouTube caption tracks and do not burn them into production masters. Request lower-center placement in WebVTT while treating client-side positioning as best-effort.

**Reason:** A private Video 004 review showed that burned-in captions plus enabled YouTube captions produce distracting duplicate text. The audience must be able to turn narration captions on or off.

**Alternatives:** Burn in captions for deterministic placement (rejected because they cannot be disabled and duplicate YouTube captions); omit caption tracks (rejected because it harms accessibility and silent viewing); rely on automatic captions alone (less editorial control over wording and timing).

**Consequences:** Caption copy and timing remain controlled, but YouTube controls presentation. Its desktop player may honor lower-center WebVTT placement while its mobile Shorts player can move captions elsewhere. Video layouts must tolerate either placement, and private platform review with captions on and off remains mandatory.

## 2026-09-24 — Higher-bitrate YouTube upload masters

**Decision:** Render production masters with an 8 Mbps H.264 video target and a 192 kbps AAC audio target, while preserving 1080×1920, 30 fps, and `yuv420p` compatibility.

**Reason:** Private YouTube review of earlier videos exposed text softness after platform transcoding. A higher-quality upload master gives the encoder more source detail for typography, fine lines, and dark gradients without imposing an unreasonable file-size or render-time cost.

**Alternatives:** Keep the previous CRF 17 profile (smaller but produced lower-bitrate masters); render lossless intermediates (unnecessarily large for the current local/manual workflow); move immediately to 4K (not justified before testing whether bitrate alone resolves the issue).

**Consequences:** Masters are larger, and YouTube will still re-encode them. Human review after HD processing remains mandatory; upload bitrate cannot compensate for poor typography, unsafe placement, or an intrinsically low-resolution asset.

## 2026-09-22 — Progressive publishing ramp to a mixed-format weekly cadence

**Status:** Superseded as the long-term operating target by the 2026-09-27 knowledge-package and multi-platform strategy. It remains an accurate record of the initial YouTube renderer validation ramp.

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

**Consequences:** The narration is synthetic and its model/voice provenance must remain documented. Platform disclosure must be evaluated against the current platform policy and the actual use; non-impersonating synthetic narration is not automatically equivalent to a realistic altered-person claim. Voice cues remain separate from the soundscape and can be replaced without changing visual choreography.

## 2026-09-22 — No repository-local Codex skill in V1

**Decision:** Keep workflows in `AGENTS.md`, docs, and scripts until they have repeated and stabilized.

**Reason:** Codex supports `.agents/skills`, but a skill is most useful for a repeated stable workflow. V1 provides only one execution of each candidate workflow.

**Alternatives:** Immediately add research/render/QA skills.

**Consequences:** Less speculative agent machinery; reconsider after several videos expose genuine repetition.
