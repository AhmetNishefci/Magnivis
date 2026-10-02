# Cycle #4 — authorized Ahmet manual release

Your explicit **APPROVE PUBLICATION** authorizes your manual release on **YouTube, TikTok, Instagram and Facebook**, with the exact listed presentation and operational uncertainties accepted. [Owner decision](owner-publication-decision-v1.json), [authorization bindings](authorization-bindings-v1.json) and [resolved files](authorized-media-resolution-v1.json) bind the unchanged reviewed release. No additional normal owner gate is pending.

## Files to use

All four destinations use [this same approved MP4](../../../../artifacts/masters/paper-half-shape-candidate-v1.mp4):

`artifacts/masters/paper-half-shape-candidate-v1.mp4`

SHA-256: `93955c8959157fd01c680c195d0f4ed9bcdb883fe4472e92e7af5c9505dd74b7`

9,540,171 bytes; 1080×1920, 30 fps, H.264/yuv420p, AAC 48 kHz. Picture: 52.0667 seconds; MP4 container: 52.118 seconds. No new encoding, duplicate video or media promotion copy was made.

| Platform | Cover selection | Exact copy and settings |
|---|---|---|
| YouTube | [Original centered PNG](../../../../artifacts/covers/paper-half-shape-cover-v1.png), where the actual live custom-cover control is available | [Approved copy](authorized-upload-copy-v1.txt), [YouTube settings](youtube/metadata-v1.json); category recommendation **Education** |
| TikTok | Select the final payoff around 49.9 seconds in-app; [decoded PNG reference](../../../../artifacts/qa-evidence/paper-half-shape-v1/frame-43-49.9s.png) | [Approved copy](authorized-upload-copy-v1.txt), [TikTok settings](tiktok/metadata-v1.json) |
| Instagram | [Original centered PNG](../../../../artifacts/covers/paper-half-shape-cover-v1.png), where the live custom-cover control is available | [Approved copy](authorized-upload-copy-v1.txt), [Instagram settings](instagram/metadata-v1.json) |
| Facebook | Select the final payoff around 49.9 seconds in-app; [decoded PNG reference](../../../../artifacts/qa-evidence/paper-half-shape-v1/frame-43-49.9s.png) | [Approved copy](authorized-upload-copy-v1.txt), [Facebook settings](facebook/metadata-v1.json) |

Custom PNG SHA-256: `f5f6192ce3b7b306136b7c02b6dd2d29b7e5a92165d18c2ff83449e9a0277594`. Decoded payoff PNG SHA-256: `1b29a3ee4dd867a03c998501c2ce1c6e1366970ec29486ac93e020792064a55f`. Both are 1080×1920. The payoff PNG is the local selection reference; native extraction/encoding may differ. Cover upload availability, native crops and persistence remain accepted uncertainties. Do not substitute different artwork or alter the approved master silently.

## Manual upload guidance

1. Confirm the actual Magnivis destination account and select the canonical MP4 above.
2. Paste the destination's exact title/description or caption from [authorized-upload-copy-v1.txt](authorized-upload-copy-v1.txt). TikTok/Instagram use the post caption; no separate title field is assumed.
3. Preserve the original narration and designed captions. Add no music or duplicate visible caption layer. YouTube's optional [English WebVTT](../../../../captions/paper-half-shape.en.vtt) is an accessibility artifact, not replacement artwork.
4. Use available AI/synthetic disclosure controls for synthetic narration and retain the written disclosure. Confirm the live audience/settings selectors using the approved destination recommendations. No account control has been inspected or set by this system.
5. Select the indicated cover or payoff frame where supported. Your exact risk acceptance permits manual release without a new prepublication device gate. It does not establish a device pass; an actual discovered failure must be addressed rather than waived.
6. Manually publish or schedule at your chosen date. **20:00 Kosovo local** remains the provisional test window; this handoff sets no date or schedule.

The original metadata/manifests remain immutable **prepared** receipts. Their generation-time pending-approval fields are historical; the separate V3 owner decision and replayed **authorized** cycle state supply current authority. No legacy registry status, approval, QA, profile geometry or media identity was silently rewritten. [Original review handoff](owner-review.md) remains the preauthorization snapshot.

## Verification and subsequent evidence

The authorized resolver replays the cycle and validates the exact release, decision, media, manifests, presentation evidence and accepted risk set:

```sh
pnpm exec tsx scripts/resolve-delivery-media.ts --authorized content-intelligence/cycles/cycle-4/publication/release-v1.json content-intelligence/cycles/cycle-4/publication/owner-publication-decision-reference-v1.json
```

It resolves files only; it never uploads. [Authorization validation](authorization-validation-v1.json) records repository checks and canonical durability. No media was regenerated; the existing full render, master QA and cover inspection remain bound to their approved bytes.

Cycle journal revision **9** is **authorized**, awaiting your actual scheduling/publication evidence. No external action, schedule, PublicationRecord, device result or analytics is claimed. [Evidence intake](publication-evidence-intake-v1.json) keeps unknowns null. Once you act, supply actual platform URLs/IDs, publication or scheduling time, visibility/settings and any observed crop/UI/audio issue. Scheduling alone cannot close the cycle; all four variants need actual publication evidence.
