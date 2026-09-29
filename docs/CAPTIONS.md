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

Caption presentation is **speech-first, not prose-first**. Phrase grouping and transitions should make narration feel natural at short-form reading speed. Canonical narration remains unchanged. Periods, commas, questions, apostrophes, numbers, percentages, and meaningful hyphens remain when they aid comprehension; the renderer does not globally strip punctuation.

## CaptionPlan

`src/captions/schema.ts` owns the typed editorial/rendering boundary. A plan records:

- stable plan ID, revision, status, and ContentAsset/script references;
- source narration cue IDs and exact frame ranges;
- one or two semantic lines per cue;
- selected emphasis spans using controlled level and tone tokens;
- one approved placement region and animation treatment;
- editorial intent and provenance, including whether direction was manual or AI-assisted.

`src/captions/plan.ts` derives frame-exact cue timing from the approved narration and validates complete, ordered, non-overlapping coverage. It rejects invented wording, timing outside source cues, unknown placements or treatments, invalid emphasis spans, and unsafe layout profiles.

When an approved rhetorical em or en dash is better communicated by a phrase transition, the following cue may record `sourceBoundaryBefore` with the exact source punctuation, the controlled `phrase-transition` treatment, and an editorial rationale. Canonical reconstruction reinserts that exact source fragment before comparing with narration. Only em/en dash boundaries are accepted: an ASCII hyphen cannot be presentation-only, so compounds such as `eight-week`, `freeze-tolerant`, and `real-time` must remain intact. This is an explicit provenance record, not general text normalization or permission to remove words.

Styled segmentation is text-preserving: emphasized and normal fragments are sliced directly from the source line, must reconstruct it byte-for-byte, and are each rendered with explicit whitespace preservation. Emphasis sizing participates in inline layout rather than using transforms that can paint over adjacent source spaces. Never repair a visual spacing defect by changing approved narration or inserting spaces that are not present in the source.

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

A future AI workflow may propose phrase grouping, line breaks, emphasis, placement, one allowed animation treatment, and an explicit rhetorical-dash phrase transition. It may not invent or remove words, alter claims, remove meaningful hyphens, invent punctuation that changes meaning, or bypass fonts, colors, sizes, placement regions, animations, or safety rules. AI provenance must be recorded and every proposal must pass the same canonical-reconstruction, timing, schema, and safe-area validation before rendering. AI output never grants editorial, visual, platform, or publication approval.

## Accessibility relationship

The same CaptionPlan can produce WebVTT through `captionPlanToDerivedCaptions`. This keeps the burned-in composition and accessibility artifact aligned without maintaining two copies of caption wording. Platform-native captions can visually duplicate burned-in captions, so each platform preview must check the actual experience and choose the appropriate accessibility setting. The burned-in layer remains present either way.

## Wood Frog V1

Wood Frog is the first implementation:

- CaptionPlan: `caption-plan.wood-frog.v1`, revision 2
- ProductionPlan: `production-plan.wood-frog-freeze.v1`, revision 3
- PlatformVariant: revision 3, still `editorial-review`
- 18 phrase-level cues and 18 selective emphasis spans
- CaptionPlan SHA-256: `7e76efd794140e3a0c9d8b54a2d92e045fb565505f9a2d1b8738f6c052ba7b51`
- WebVTT SHA-256: `6307d067a90bc6819fd903c18eb9c84317a2c09e9d93252bd63b210ac74feab1`
- Owner-approved master SHA-256: `4c5354d9368908f11f5f9b5767371694c2e51ad895786b2c31f7e329b83eaac2`

The hook and closing narration retain their canonical rhetorical em dashes. The designed layer presents each as consecutive spoken phrases and records each dash in `sourceBoundaryBefore`, allowing exact canonical reconstruction without displaying prose punctuation. The approved script, scientific claims, narration/audio, diagrams, emphasis, typography, and placement are unchanged. Ahmet Nishefci approved the exact master visually on 2026-09-29; platform preview, cover, and publication gates remain closed.

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
