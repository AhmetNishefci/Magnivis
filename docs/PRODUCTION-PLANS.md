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
