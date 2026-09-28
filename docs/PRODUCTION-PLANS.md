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

`production-plan.wood-frog-freeze.v1` is the first implemented ProductionPlan. It binds approved package and asset revision 2 to the 40-second, 1080x1920, 30 fps `Magnivis-Wood-Frog` composition. Its five beats preserve the approved scientific sequence:

1. labeled cardiac activity ceases during a survivable freeze;
2. ice is shown mainly outside cells, not uniformly throughout them;
3. water moves out as extracellular ice grows, while intracellular ice is only the avoided danger;
4. pre-freeze urea precedes freeze-triggered liver glucose;
5. thaw recovery is ordered heart, breathing, then hindleg reflex.

The uncertain circulation-cessation claim is explicitly excluded from the plan and all downstream production inputs.

The master is rendered at `output/wood-frog-narrated.mp4`. `qa/wood-frog-narrated/` contains exact-frame samples and a contact sheet. `deliveries/wood-frog/youtube-shorts/` is a draft review package only; its PlatformVariant remains `editorial-review` and is not publishable.

## Reusable visual grammar

Wood Frog extracted only three small domain-neutral diagram primitives: `DiagramPanel`, `ScientificLabel`, and `ProcessArrow`. It also reuses the existing safe-area, typography, scene-window, and brand systems. Frog anatomy, tissue/cell behavior, cryoprotectant phases, cardiac trace, and recovery indicators remain Wood Frog-specific. This is deliberately not a generic scene factory.

## Narration and captions

Narration uses the approved script exactly and records local Kokoro provider/model/voice, cue hashes, and approved-script hash. Captions are deterministically derived from the approved narration cue text and known cue timing; no speech-to-text provider is needed. Phrase grouping is mobile-readable, preserves the wording exactly, and produces the optional platform track `captions/wood-frog.en.vtt`.

## Current status

Wood Frog is a **rendered candidate requiring human visual review**. Automated media QA, production validation, and draft delivery validation do not make it production-ready, platform-approved, or authorized for publication.
