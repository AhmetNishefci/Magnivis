# Magnivis caption system

## Permanent short-form policy

Every new Magnivis short-form master for YouTube Shorts, TikTok, Instagram Reels, and Facebook Reels contains designed burned-in captions. They are part of the composition and provide a consistent, silent-viewing experience. A reviewed WebVTT track or platform-native captions may also be supplied for accessibility, but they do not replace the designed layer.

This is a forward-looking production rule. Existing approved or published masters are not regenerated solely to add burned-in captions. The historical Speed of Light decision remains part of the audit trail.

## Implemented pipeline

```text
approved script
  -> approved narration cues and known timing
  -> CaptionPlan
  -> MagnivisCaptionRenderer
  -> designed burned-in master
  -> optional WebVTT accessibility artifact
```

No speech-to-text system is used when approved narration text and timing already exist. A CaptionPlan must reconstruct the exact narration, remain within its timing, and pass source-chain validation.

## CaptionPlan

`src/captions/schema.ts` owns the typed editorial/rendering boundary. A plan records:

- stable plan ID, revision, status, and ContentAsset/script references;
- source narration cue IDs and exact frame ranges;
- one or two semantic lines per cue;
- selected emphasis spans using controlled level and tone tokens;
- one approved placement region and animation treatment;
- editorial intent and provenance, including whether direction was manual or AI-assisted.

`src/captions/plan.ts` derives frame-exact cue timing from the approved narration and validates complete, ordered, non-overlapping coverage. It rejects invented wording, timing outside source cues, unknown placements or treatments, invalid emphasis spans, and unsafe layout profiles.

## Design system

`caption-design.magnivis-short-form.v1` uses existing Magnivis typography and palette. It favors phrase-level chunks, a maximum of two lines, strong contrast, a restrained backdrop, and selective semantic emphasis. It does not use per-word bouncing, arbitrary colors, random sizes, emoji, or unrestricted motion.

The V1 animation vocabulary is intentionally small:

- `fade-slide`
- `soft-scale`
- `focus-highlight`

The V1 placement vocabulary is:

- `middle-lower`
- `lower-safe`

Both placement rectangles are validated against the active registered safe-area profile. The Wood Frog master is also checked against YouTube Shorts V1, TikTok V2, Instagram Reels V1, and Facebook Reels V1. Actual platform UI still requires private real-device review.

## AI art-direction boundary

A future AI workflow may propose phrase grouping, line breaks, emphasis, placement, and one allowed animation treatment. It may not invent narration, fonts, colors, sizes, placement regions, animations, or safety rules. AI provenance must be recorded and every proposal must pass the same schema, narration-integrity, timing, and safe-area validation before rendering. AI output never grants editorial, visual, platform, or publication approval.

## Accessibility relationship

The same CaptionPlan can produce WebVTT through `captionPlanToDerivedCaptions`. This keeps the burned-in composition and accessibility artifact aligned without maintaining two copies of caption wording. Platform-native captions can visually duplicate burned-in captions, so each platform preview must check the actual experience and choose the appropriate accessibility setting. The burned-in layer remains present either way.

## Wood Frog V1

Wood Frog is the first implementation:

- CaptionPlan: `caption-plan.wood-frog.v1`, revision 1
- ProductionPlan: `production-plan.wood-frog-freeze.v1`, revision 2
- PlatformVariant: revision 2, still `editorial-review`
- 17 phrase-level cues and 18 selective emphasis spans
- CaptionPlan SHA-256: `97aa4a0e94d60b011a602c3d3fb4faf6931cba0dc8422e807879bbc96e980836`
- WebVTT SHA-256: `8cefeb2b1ffbb3a58a2b067c5e0575641488dd829b1765cf5970eb1263431756`

The approved script, scientific claims, narration, timing, diagrams, and audio were not changed. The new render remains a candidate requiring owner visual review.

## Operator commands

```bash
pnpm captions:wood-frog
pnpm captions:validate wood-frog
pnpm production:validate wood-frog
pnpm render wood-frog
pnpm qa wood-frog
pnpm delivery wood-frog
pnpm delivery:validate wood-frog
```
