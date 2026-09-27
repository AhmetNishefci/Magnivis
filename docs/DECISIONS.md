# Significant decisions

## 2026-09-27 — Keep AI assistance structurally below human verification and approval

**Decision:** Introduce one provider-neutral structured-generation boundary with versioned prompt workflows. Model-proposed sources begin unreviewed, model-proposed claims begin unverified, hook proposals may use only verified claims, and generated ContentAssets remain unapproved drafts. KnowledgePackage promotion and editorial approval stay human actions.

**Reason:** Content Intelligence needs real automation leverage without allowing plausible model prose to become evidence or silently enter production. Existing claim and asset schemas already provide the right trust boundaries.

**Alternatives:** Integrate one vendor directly throughout domain code (coupled and difficult to test); let a model emit approved packages/assets (unsafe); document future AI use without an executable boundary (no operational learning).

**Consequences:** Tests use deterministic fixture providers and require no network or credentials. A live provider can be added later at one interface, with validated output and provider/model/workflow/usage/cost provenance. Source retrieval, claim verification, and approvals remain manual.

## 2026-09-27 — Record operational truth without adding publishing automation

**Decision:** Store nonsecret PlatformAccounts, generalized manual PublicationRecords, settings/disclosures, and raw MetricSnapshot schemas in typed Git-visible files. Record the confirmed Instagram identity and the existing Speed of Light YouTube publication; leave unknown settings explicit and do not invent historical metric timestamps.

**Reason:** Platform identity and exact artifact/publication linkage are durable facts needed by future sessions and analytics, but they do not require OAuth, a database, or an uploader.

**Alternatives:** Keep operational truth in chats (lost between sessions); build publishing APIs now (premature and sensitive); migrate every historical record with incomplete provenance (false precision).

**Consequences:** Current operations remain manual. Videos 001–003 retain legacy publication fields, production MetricSnapshots remain empty, and future records can be added incrementally with exact evidence.

## 2026-09-27 — Give a failed TikTok safe-area review its own production render

**Decision:** Retain the byte-identical reviewed YouTube master and introduce TikTok variant revision 2 with a dedicated VideoSpec/composition using `safe-area.tiktok-feed.v2`. The complete top information region moves from 150 px to 240 px; all editorial, timing, audio, visualization, and lower-label geometry stays unchanged.

**Reason:** A private TikTok iPhone preview showed native top navigation crowding the Sun/Earth information block. Changing the shared master would regress the published YouTube production, while moving one scene with a hardcoded offset would leave the same systemic risk in every other top headline.

**Alternatives:** Change the shared master (rejected: unnecessary YouTube/Meta regression); add a Sun-scene magic number (rejected: does not express the platform constraint); move the apparent right-side Magnivis logo (rejected: it is TikTok's native profile control, not video content).

**Consequences:** `PlatformVariant.productionIntent.videoSpecId` now selects production deterministically. The delivery pipeline can package a completed dedicated render but still never renders or publishes automatically. TikTok revision 2 passed private real-device pass 2 on an iPhone 17 Pro Max and is now `production-ready`; its ready delivery still requires explicit human publication approval.

## 2026-09-27 — Use hashed local delivery packages as the manual publishing handoff

**Decision:** Materialize each PlatformVariant as an ignored, portable folder containing a master copy, applicable captions, exact upload copy, metadata, a review checklist, and a source-linked manifest with SHA-256 hashes. Package state is derived from—but never changes—the PlatformVariant status.

**Reason:** PlatformVariant definitions were architecturally sound but still forced an operator to inspect TypeScript and manually assemble files. A validated delivery folder creates immediate operational value and a stable future publisher input without introducing credentials or remote side effects.

**Alternatives:** Upload directly through APIs (premature and sensitive); keep a written manual checklist only (weak integrity and traceability); symlink one shared video into each package (less portable); rerender per platform (wasteful while all variants reuse the same master).

**Consequences:** At initial implementation, YouTube produced a ready package with WebVTT while TikTok, Instagram, and Facebook produced clearly marked draft-review packages without fabricated caption files. TikTok revision 2 later passed its real-device gate and now produces a ready package from its dedicated render. Portable folders duplicate their selected production artifact on disk by design. Publication state and remote IDs remain outside this model.

## 2026-09-27 — Discover first and classify second

**Decision:** Magnivis is an open-ended curiosity and understanding brand. Knowledge packages use seven stable high-level analytics pillars plus open normalized domain/topic slugs. Pillars organize reporting and editorial balance; they do not whitelist subjects. Cross-domain work can record multiple domains and use `interdisciplinary` when no single grouping honestly leads.

**Reason:** The original eight launch categories were useful prompts but became an accidental source-code permission gate. Future discovery must be able to find a strong philosophy, medical, cultural, historical, scientific, or unanticipated story before deciding where it belongs.

**Alternatives:** Keep the eight-value enum (blocks legitimate subjects); enumerate every possible domain (unbounded and brittle); use only free-form tags (loses a stable aggregate for portfolio analytics); build an ontology service (far beyond current need).

**Consequences:** Existing packages migrate to the new taxonomy. Domains and topics require normalized unique slugs but no enum changes. Editorial fit, evidence, rights, and viewer value authorize a story—not its classification. `docs/STRATEGY.md` is the canonical policy.

## 2026-09-27 — Separate platform adaptation from assets and publication

**Decision:** PlatformVariant V1 sits between ContentAsset and a production representation. It owns destination packaging, a dated platform-constraint reference, safe-area reference, caption/cover behavior, production intent, readiness, and approval. ContentAsset stays platform-neutral; PublicationRecord owns actual external state. At this decision point publication records were still planned; a file-backed manual foundation was added later on 2026-09-27.

**Reason:** One editorial story needs distinct packaging and review for different distribution surfaces without duplicating research, scripts, or renders. Platform rules change, so constraints must be dated and source-linked rather than embedded as timeless editorial facts.

**Alternatives:** Put all platforms in ContentAsset (couples story to distribution); copy ContentAssets per platform (fake editorial duplication); put publishing state in PlatformVariant (mixes desired adaptation with external side effects); build API clients now (not needed to prove the model).

**Consequences:** The production Speed of Light asset has four registered variants. Initially only its retrospective YouTube variant was production-ready; TikTok revision 2 later passed private real-device QA and became production-ready using a dedicated render. Instagram and Facebook still require manual platform previews. No variant causes an external action. Safe-area profiles are versioned internal design aids, not platform guarantees.

## 2026-09-27 — Model numeric shape separately from epistemic status

**Decision:** Quantitative claims use either a scalar quantity or a bounded range. Scalars may carry positive symmetric measurement uncertainty and an optional confidence description. Precision (`exact`, `rounded`, or `approximate`) remains separate from verification status.

**Reason:** Ocean Depth contains conventional 200–1,000 m light-zone boundaries and a 10,935 m ±6 m survey estimate. Forcing either into one exact scalar would erase scientific meaning, while marking every approximate measurement `uncertain` would confuse numeric precision with whether the scoped claim passed verification.

**Alternatives:** Keep scalar-only values and move ranges into prose (not machine-readable and encourages false precision); add more verification states (does not solve quantity shape); build a general measurement ontology (unnecessary for the current domains).

**Consequences:** Speed of Light remains backward-compatible through explicit scalar discriminants. Ocean Depth represents the light interval as a range and Challenger Deep as an approximate scalar with uncertainty. A verified claim can contain an approximate value or range when that qualified statement itself is evidence-backed and reviewed.

## 2026-09-27 — Separate editorial assets from production specifications

**Decision:** ContentAsset V1 is a platform-neutral editorial object between KnowledgePackage and downstream adaptation/production. It owns purpose, angle, selected package hook/claims, claim-linked script segments, narrative beats, visual intent, narration direction, and readiness. VideoSpec owns exact format, frames, timing, files, captions, audio cues, and Remotion choreography. PlatformVariant and PublicationRecord remain separate boundaries. PlatformVariant was implemented next; a file-backed manual PublicationRecord foundation was subsequently implemented on 2026-09-27 without adding publishing automation.

**Reason:** One researched topic must support multiple legitimate stories without copying research or turning production choreography into the editorial model. Script segment claim references provide useful fact-checking traceability without annotating connective language.

**Alternatives:** Keep VideoSpec as both editorial and production data (prevents clean reuse); put frames and coordinates in ContentAsset (couples editorial intent to Remotion); introduce platform variants in the same milestone (outside that proof and premature at that point).

**Consequences:** Video 004 references a production-ready ContentAsset and derives narration text from it. A second draft asset proves one-to-many reuse without a render. Existing legacy VideoSpecs remain unchanged. Some production/platform/publication-shaped fields remain in the legacy VideoSpec until a later bounded migration.

## 2026-09-27 — Preserve production through a knowledge compatibility projection

**Status:** The direct VideoSpec-to-KnowledgePackage reference described here was superseded by the Content Asset V1 decision above. The compatibility projection and all render-safety reasoning remain active.

**Decision:** Knowledge Package V1 uses global `source.*` IDs, package-namespaced claim/hook IDs, and claim-level evidence. Video 004 reaches its package through a downstream ContentAsset (and now a YouTube PlatformVariant), while `src/data/light.ts` projects quantitative package claims into the legacy fact shape consumed by its unchanged Remotion composition. `VideoSpec` permits exactly one legacy-fact, ContentAsset, or PlatformVariant reference path.

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
