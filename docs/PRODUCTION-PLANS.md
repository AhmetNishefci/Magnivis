> Current prospective orchestration and gate authority: [WORKFLOW-V3](WORKFLOW-V3.md). Current machine state: [project-state](../workflow/project-state.json). Dated milestones below retain their historical meaning; V3 does not reapprove or rewrite them.

# Production plans

ProductionPlan is the typed bridge between approved editorial intent and exact video implementation:

```text
KnowledgePackage
  -> ContentAsset + VisualPlan
  -> ProductionPlan
  -> VideoSpec
  -> Remotion composition
  -> rendered candidate
  -> human visual/platform review
```

It does not replace either side of that boundary. ContentAsset owns the approved story, script, claim traceability, narrative structure, and platform-neutral VisualPlan. ProductionPlan selects frame ranges, open normalized implementation-oriented scene-type hints, factual on-screen text, animation/transition/audio intent, and required assets. Scene types describe the plan; they are not a hardcoded template whitelist. VideoSpec owns the exact composition, audio cues, output format, and render identity. PlatformVariant owns destination packaging and platform-specific constraints.

## Integrity rules

A production plan must bind to exact approved KnowledgePackage, ContentAsset, owner-decision, and script SHA-256 values. Validation rejects stale revisions or hashes, non-verified claim references, excluded claims, incomplete VisualPlan coverage, or a VideoSpec whose narration differs from the approved script. A successful render does not cross the later human visual, platform-preview, or publication gates.

Run the current production-chain validation with:

```bash
pnpm production:validate wood-frog
```

## Production corrections and finished-sequence editorial review

Every meaningful correction improves both the current artifact and, if the failure exposes a reusable lesson, the existing process. Diagnose the actual failure before adding guidance: inspect owner feedback, direction, implementation and rendered evidence. Distinguish missing guidance, weak application, technical-only QA, tooling convenience and failed lesson transfer. Record the supported explanation, counterevidence, smallest correction and non-generalizations in the existing cycle revision/review evidence. A recurring correction warrants this investigation without another owner reminder; no separate knowledge ledger or new owner gate is needed.

Before direction/implementation, inspect relevant recent **master revision decisions** through the existing cycle journal history, not only `editorialDecisionContext` (which intentionally supplies premise judgments). Explain which production lesson applies to this story, which does not, and how the implementation will demonstrate it. Read the relevant prior rendered/review evidence where available. Previous approval is precedent, not proof that a treatment will work again.

During authoring, identify what the viewer learns or what changes visually at each consequential development. Carry objects, questions, spatial relations or evidence status forward when that clarifies the story. Visuals should unfold the discovery, conflict, transformation or mechanism where the subject supports it. Text, diagrams, archival stillness and restrained movement are legitimate choices; use them for clarity, not merely generation convenience. A direction's promise of progression must be realized in the composition and tested in the render.

Before **AHMET — MASTER REVIEW**, keep technical validation and **cold-viewer rendered-sequence editorial review** separate in the existing QA/visual-inspection record. Inspect the complete rendered result as tools permit, in chronological order, including opening, transitions, mechanisms and ending; inspect decoded phone-scale samples and every caption midpoint. Full playback/listening is preferable when available. When unavailable, use dense chronological decoded samples, enlarge important states and record exactly what was inspected; full decode is not subjective watching or listening. Bind findings to the exact master hash and inspection evidence.

Assess these questions with concrete scene/time references, not a score or a blanket pass:

- Does the opening create truthful curiosity, and can an unfamiliar viewer understand the central contradiction?
- Does the presentation evolve with the story; are consequential developments visible rather than only narrated?
- Do consecutive scenes unnecessarily repeat composition, static background or text arrangements? Does each retained repetition serve continuity or comprehension?
- Are text and diagrams the clearest treatment, or a shortcut? Is the mechanism understandable without excessive simultaneous information?
- Does the ending deliver the promised payoff, and would an unfamiliar viewer find the rendered experience worth watching?

Revise clear actionable weaknesses internally before handoff. Verify the changed stretches and their effect on the complete sequence. Stop when remaining refinements offer no material benefit or are subjective/unresolved; do not run an endless perfection loop. Escalate material trade-offs, factual uncertainty and unresolved consequential weaknesses honestly. Record remaining weaknesses, actions taken, reasons for retained choices, coverage and audio/device limitations. Internal judgment never impersonates owner approval or self-certifies excellence.

At the next production, the entry-point instruction above brings relevant correction evidence into planning automatically through normal session work. Detect recurrence by comparing the rendered sequence with those specific lessons and the selected direction. Geometry, decode, source/caption identity and evidence presence can be automated; curiosity, purposeful motion, repetition, explanatory adequacy and worth watching require accountable editorial judgment. No automated quality guarantee is made.

## Wood Frog V1

`production-plan.wood-frog-freeze.v1` revision 3 is the first implemented ProductionPlan. It binds approved package and asset revision 2, plus `caption-plan.wood-frog.v1` revision 2, to the 40-second, 1080x1920, 30 fps `Magnivis-Wood-Frog` composition. Its five beats preserve the approved scientific sequence:

1. labeled cardiac activity ceases during a survivable freeze;
2. ice is shown mainly outside cells, not uniformly throughout them;
3. water moves out as extracellular ice grows, while intracellular ice is only the avoided danger;
4. pre-freeze urea precedes freeze-triggered liver glucose;
5. thaw recovery is ordered heart, breathing, then hindleg reflex.

The uncertain circulation-cessation claim is explicitly excluded from the plan and all downstream production inputs.

The master is rendered at `output/wood-frog-narrated.mp4`. `qa/wood-frog-narrated/` contains a midpoint frame for every CaptionPlan cue plus the combined contact sheet. `deliveries/wood-frog/youtube-shorts/` is a draft review package only; its PlatformVariant remains `editorial-review` and is not publishable.

## Reusable visual grammar

Wood Frog extracted only three small domain-neutral diagram primitives: `DiagramPanel`, `ScientificLabel`, and `ProcessArrow`. It also reuses the existing safe-area, typography, scene-window, and brand systems. Frog anatomy, tissue/cell behavior, cryoprotectant phases, cardiac trace, and recovery indicators remain Wood Frog-specific. This is deliberately not a generic scene factory.

## Narration and captions

Narration uses the approved script exactly and records local Kokoro provider/model/voice, cue hashes, and approved-script hash. CaptionPlan deterministically derives 18 phrase-level cues from that text and timing; no speech-to-text provider is needed. Its explicit rhetorical-dash transition reconstructs the canonical narration exactly while presenting the final contrast as two spoken phrases. The constrained renderer burns those cues into the master, while the same plan produces `captions/wood-frog.en.vtt` as an optional accessibility artifact. See `docs/CAPTIONS.md`.

## Current status

Wood Frog's exact master at `output/wood-frog-narrated.mp4`, SHA-256 `4c5354d9368908f11f5f9b5767371694c2e51ad895786b2c31f7e329b83eaac2`, is **owner visually approved and locked**. The typed approval records Ahmet Nishefci, the 2026-09-29 review timestamp, exact CaptionPlan identity/hash, exact artifact hash, and explicit denial of platform/publication authority.

YouTube, Instagram, and Facebook review variants reuse that exact artifact. TikTok's stricter V2 top-safe profile requires `Magnivis-Wood-Frog-TikTok`, rendered separately to `output/wood-frog-tiktok-narrated.mp4`; this derivative changes only safe-area geometry and remains `visual-review-required`. All four variants are ready only for private platform preview. Cover selection, platform approval, and explicit publication approval remain outstanding.

## Phase 2 recovery boundary

Historical plan r3 and its exact visual approval remain unchanged. `pnpm production:validate wood-frog` continues to enforce the unavailable original hash and correctly fails until those bytes are recovered. `pnpm production:validate wood-frog --recovered` (and wood-frog-tiktok) validates original source/audio/caption bindings plus separately accepted operational artifact identities. It explicitly reports recovery mode and never transfers approval. Current paths/decisions are in PROJECT-STATE.md and artifacts/manifests.json. Re-rendering may change hashes; it must not overwrite accepted operational identities.

## Phantom Traffic candidate v1

ProductionPlan `production-plan.phantom-traffic.v1` revision 1 binds approved package/asset revision 3, exact editorial owner decision, locked script, six beats, approved visual intents, designed CaptionPlan and modular audio. Status is `rendered-candidate-visual-review-required`; no `visualApproval` exists. The [candidate receipt](../content-intelligence/reviews/phantom-traffic-production-v1/candidate-bindings.json) adds exact render implementation/audio/QA hashes and the durable MP4 identity.

`pnpm production:validate phantom-traffic` and `pnpm captions:validate phantom-traffic` perform native source-chain validation; `node --import tsx scripts/validate-phantom-traffic.ts` also checks the reviewed Git commit, measured WAV durations, media report and retained candidate/source/QA bytes. No platform variants or publication authority are created.

## Phantom Traffic exact master lock

Owner visual decision `owner-decision.phantom-traffic.master-visual.v1` binds candidate MP4, reviewed commit, original plan/captions, narration and implementation/QA receipt. ProductionPlan revision 2 is owner-visual-approved; its original revision 1 render input remains immutable. The visual-approval schema supports labeled decisionEnteredAt/reviewTimeBasis with exact owner-decision reference, mutually exclusive with supplied reviewedAt; legacy supplied timestamps remain valid. No owner review instant is fabricated.

`pnpm production:validate phantom-traffic` validates the locked state; the earlier research/production handoffs retain their historical states. Historical candidate source hashes are checked against their immutable reviewed Git commit, while current locked render dependencies remain exact and VideoSpec may change only authorized lifecycle metadata. No master re-encoding occurs.

## Adaptive creative direction — future content

Future plans require an exact CreativeDirection reference plus the actual ready companion in validateProductionPlanReferences. Only exact historical plan hashes listed in system-audits/adaptive-creative-direction-v1/historical-plans.json are exempt; IDs alone cannot bypass the gate. Format dimensions/FPS are explicit positive values; scene types remain open. Asset kind/origin/rights are explicit, with inspectable provenance/license evidence required for new plans. These fields do not establish license clearance or platform approval. Reuse engineering, not mandatory art direction; see CREATIVE-DIRECTION.md.

## Primary narrator and independently adaptive execution

Future plans bind `executionPolicy` to `src/design/brand-execution-policy.json`. Default narrator is the current primary voice; alternatives need material explicit rationale, not a domain change. Visual, caption and soundscape authority remain story-specific; no universal music and no monetization-only padding. Exact pre-policy plans retain original semantics through their hashes, never an ID-only exemption. This requirement supplements existing editorial/CreativeDirection gates.

Longitude candidate v2 uses separate narration, CaptionPlan revision 2, ProductionPlan revision 3 render inputs and direction revision 3 (narrator-only owner revision). Use `node --import tsx scripts/render-longitude-v2.ts`, `pnpm qa longitude-clock-v2`, `node --import tsx scripts/qa-longitude-layout.ts --v2` and `node --import tsx scripts/validate-longitude-v2.ts`. Existing v1 inputs/master remain immutable; candidate v2 still requires owner master review.
