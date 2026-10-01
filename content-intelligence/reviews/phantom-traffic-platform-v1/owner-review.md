# Phantom Traffic — locked master and platform presentation handoff

**Next gate: PHANTOM TRAFFIC REAL-DEVICE PLATFORM REVIEW.** Only the exact master is owner-approved. No platform/cover/device approval or publication permission is inferred.

## Master lock

[Owner visual decision](../phantom-traffic-master-lock-v1/owner-decision.json): `owner-decision.phantom-traffic.master-visual.v1` revision 1. Its `enteredAt` records decision entry, not an owner-supplied review timestamp. The decision binds the reviewed production commit, KnowledgePackage/ContentAsset, editorial approval, exact script, ProductionPlan/CaptionPlan, narration and candidate implementation/QA receipt.

Logical locked-master identity: **`phantom-traffic.locked-master.v1`**. Physical path remains `artifacts/masters/phantom-traffic-candidate-v1.mp4`; SHA-256 **`bdf22d48b4fe1b873fd659a487954c09c1573dd5466795656128c08d03208d4b`**. No copy, rename or re-encoding occurred. The manifest adds a locked logical identity for the same file/blob; the original candidate record remains unchanged. ProductionPlan revision 2 is `owner-visual-approved`. The exact CaptionPlan revision 1/hash is approved within this rendered master; its original standalone review record and render inputs are preserved.

## Local findings

| Context/surface | Surviving authority and finding | Outstanding gate |
|---|---|---|
| YouTube Shorts mobile | V1 150/190/310/84 survives but is historical. V2 uses owner-reported approximate top 240; right190/bottom310/left84 are provisional V1 carry-forward. Current brand/disclosure/action/captions clear both inset envelopes. No derivative justified locally. | Phantom Traffic mobile evidence; exact top-control exclusions and caption geometry unknown. |
| YouTube desktop/web | Full portrait-frame reference inspected; intrinsic composition/captions remain complete. No modeled website controls, desktop crop coordinates or derivative created. | Actual web player presentation remains unmeasured; cannot satisfy mobile review. |
| TikTok mobile feed | Git-surviving V2 240/190/310/84 used as historical design knowledge. Current action, captions and disclosures clear these insets. V1 failure history retained. | Phantom Traffic-specific navigation/right rail/bottom UI evidence; no inherited device pass. |
| Instagram Reel playback | Surviving conservative V1 130/170/280/72 is provisional. Current composition clears that inset model. | Actual native exclusions/caption presentation on-device. |
| Instagram profile/grid | Crop unknown; **no guessed crop model**. First frame lacks a compact topic headline before speech and historical grid framing failed. An original dedicated cover candidate provides topic framing without modifying playback. | Test exact cover and actual grid crop; approve/revise cover independently. |
| Facebook dedicated Reel viewer | Surviving conservative V1 120/160/270/72 is provisional. Current composition clears the inset model. | Exact Reel viewer UI and captions on-device. |
| Facebook Page/feed | Crop/UI geometry unknown. Historical failure is a reason to test this surface, not evidence that Phantom Traffic needs a particular reframe. | Actual Page/feed evidence; no speculative derivative created. |

All playback inset screens have zero containment violations for authored brand/disclosure, critical action, experiment number and caption rectangles. Captions occupy their separate lower band (x110–864, y1418–1584); critical action is central (x130–860, y345–1345); disclosure is above it (x150, y308). These are authored content coordinates, **not invented platform measurements**. Decorative background may crop without changing the explanation.

Caption-specific platform regions and native exclusion zones remain null in every surviving profile. The native regression gate correctly reports **INCOMPLETE** for YouTube/TikTok, with no known inset violations; unmeasured grid/feed geometry remains **UNMEASURED**. It is not converted into a local/device pass. No profile dates, dimensions, device observations or trust levels were rewritten.

## Instagram cover candidate

File: `artifacts/covers/phantom-traffic-instagram-cover-v1.png`.

SHA-256: **`3494907b3759b03146d1f050c17be653e807ba0b5b75abaafa0e87e79e0ccef5`**.

Original Magnivis procedural still: compact central headline **A JAM. NO BLOCKED ROAD.**, physical roadway/cars and highlighted slow patch. `SIMPLIFIED EXPLANATORY MODEL` is included. Headline binds the approved no-obstruction claim about this kind of jam; it does not assert every jam is spontaneous. No external imagery or scientific figure. The source frame field references the opening concept, not literal extracted footage. Crop remains null/unmeasured; status is `review`, approval decision null. Two independent cover renders matched exactly.

## Platform variants

All four revision-1 variants reference the exact master and use `reuse-existing-master`. Native status **editorial-review**; preview status **ready-for-private-preview**; preview required **true**. This describes file readiness, not upload permission or device success.

- `phantom-traffic.asset.backward-wave.variant.youtube-shorts` — YouTube V2 policy profile, partial authority retained.
- `phantom-traffic.asset.backward-wave.variant.tiktok-feed` — TikTok V2 historical profile.
- `phantom-traffic.asset.backward-wave.variant.instagram-reels` — provisional Reel profile; grid/cover independently recorded.
- `phantom-traffic.asset.backward-wave.variant.facebook-reels` — provisional dedicated-viewer profile; Page/feed independently recorded.

No variant approval, production-ready state, private-preview pass, delivery package or PublicationRecord was created. No video derivatives. No additional desktop, YouTube or TikTok cover files.

## Durable evidence

[Seven local model sheets/reports](../../../artifacts/qa-evidence/phantom-traffic-platform-v1/) use actual approved-master decoded frames: opening 0/0.5/1 s, experiment, representative conditional caption, turnover, payoff and qualified ending. Every sheet states **LOCAL MODEL / PROVISIONAL / REAL-DEVICE REQUIRED**. Unknown crop models show the full frame only; no synthetic device screenshots/buttons are drawn. Instagram grid includes the cover candidate reference.

[Platform bindings](platform-bindings.json) identify exact decision/master, source/profile/variant/cover hashes and preview identities. The native presentation QA registry contains seven distinct context/surface entries with device, OS, app version, test time and reviewer null. No real-device evidence is fabricated. One model was independently rerendered to confirm deterministic output; generated report entry times are not device-test times.

The master, cover candidate and meaningful local sheets/reports are Git-durable. The original 241 artifact records remain unchanged; the locked-master alias and new cover/QA records are separately added. Browser/model caches and temporary props/repeat images stay ignored/outside Git. Asset provenance is recorded in `docs/ASSET-LICENSES.md`.

## Simple owner action

Use [the two-file, three-moment checklist](real-device-checklist.md). Review each named surface independently; record pass/fail/not-tested plus exact hash and useful actual evidence. Upload-based testing needs separate authorization; no upload/publication/scheduling has occurred. Device findings will determine whether the current master and cover suffice or a measured derivative is needed.
