# Phantom Traffic — OWNER MASTER VISUAL REVIEW

Owner: Ahmet Nishefci. State: **candidate awaiting owner review**. No owner visual, platform/device or publication approval is recorded.

## Exact candidate

- Durable MP4: [phantom-traffic-candidate-v1.mp4](../../../artifacts/masters/phantom-traffic-candidate-v1.mp4)
- Working MP4: `output/phantom-traffic-narrated.mp4` (same bytes)
- SHA-256: `bdf22d48b4fe1b873fd659a487954c09c1573dd5466795656128c08d03208d4b`
- Size: 26,945,449 bytes. 1080×1920, 30 fps, H.264/full-range 4:2:0 (`yuvj420p` as reported by ffprobe), AAC stereo 48 kHz. Render requested 8 Mb/s video and 192 kb/s audio; measured aggregate bitrate 6,299,529 b/s.
- Timeline: 1025 frames / 34.1667 seconds. Measured media: 34.219 seconds, including encoded audio padding; within established QA tolerance.
- Measured narration clips: 29.675 seconds total, with natural within-clip pauses plus separately timed inter-clip spacing. Voice: established local Kokoro-82M `af_heart`, speed 1.0.
- Narration bundle SHA-256 (normalized cue ID/hash list): `b0d5cc3e35206dc75d68dcea56e1b85cb3a84fe5a29d273ab26442050e1f8765`. Six individual WAV hashes/durations are retained in [narration metadata](../../../src/production/narration/phantom-traffic.json).

## Approved source chain

Ahmet approved finalized editorial commit `21c3a5539cf02b1c4a88b8ff89aca0139a7ec079`. The [full editorial lock decision](../phantom-traffic-approved-v3/owner-decision.json), `owner-decision.phantom-traffic.editorial-lock.v1` revision 1, binds exact package/asset/review/script and every claim statement/status. Decision entered at `2026-10-01T08:29:45.021Z`; this is the recorded entry instant, **not a supplied owner review timestamp**.

- KnowledgePackage `phantom-traffic` revision 3: **approved**; six verified narration claims, thirteen supported reserves, eleven excluded/unverified statements. All prior evidence, qualifications, exclusions and source limitations preserved.
- ContentAsset `phantom-traffic.asset.backward-wave` revision 3: **approved editorial state**; exact approved script, six beats and conceptual visual intents unchanged.
- ProductionPlan `production-plan.phantom-traffic.v1` revision 1: **rendered-candidate-visual-review-required**.
- CaptionPlan `caption-plan.phantom-traffic.v1` revision 1: **review-required**; 15 designed burned-in cues, not transcription captions.
- [Candidate bindings](candidate-bindings.json) record exact normalized source references, implementation file/audio/QA hashes and the MP4 identity. Editorial approval is separate from master visual approval.

Promoted claims remain `no-obstruction`, `vehicles`, `conditional-growth`, `backward-pattern`, `turnover`, `bottleneck-distinction` under the `phantom-traffic.claim.` prefix. The exact claim ledger and original limitations remain in the preserved research/finalization handoffs. No reserve or excluded claim is newly promoted.

## Exact narration — unchanged

The cars move forward. But a traffic jam can move backward.

Researchers put twenty-two cars on a circular track. No obstruction. Yet stop-and-go traffic formed.

In dense traffic, small speed changes can sometimes grow as drivers adjust to the cars ahead.

Cars join the slow patch at the back and leave at the front.

The cars change. The pattern moves backward.

Not every jam starts this way. But this kind needs no blocked road.

74 words under the established whitespace count; meaningful hyphens preserved. Selected hook is the opening two sentences.

## What is implemented

| Timeline | Beat | Visual implementation |
|---|---|---|
| 0–4.53 s | Opposing motion | Road-fixed overhead physical roadway from frame zero. Gold tracked car travels upward; amber slow region moves downward. Body orientation, lights, changing spacing and actual motion establish the contrast before explanation. |
| 4.53–12.03 s | Controlled evidence | Original circular track and exactly 22 shaded cars. Uniform initial flow develops a slow cluster. Persistent `EXPERIMENT RECONSTRUCTION`; no scientific figure or footage copied. |
| 12.03–18.97 s | Conditional growth | One illustrative small speed disturbance followed by staggered slowdown responses. Several followers respond less strongly than preceding followers; the response grows overall. Caption emphasis retains `can sometimes grow`. |
| 18.97–23.27 s | Membership turnover | Gold rear-entry car and cyan front-exit car show distinct identities. Vehicles move forward through the road-fixed, upstream-moving region. |
| 23.27–28.07 s | Payoff | Wider view of the same continuing road motion. The gold car emerges ahead; other cars replace it in the upstream-moving cluster. Hold after narration lets the visual explanation breathe. |
| 28.07–34.17 s | Qualified resolution | Keep the clear roadway and moving slow region visible. Exact `Not every jam` wording retains scope; scene text describes the clear road shown, not a rule diagnosing actual queues. |

The art direction uses original shaded vehicles, varied body colors, asphalt/roadside texture, soft terrain lighting and restrained amber/cyan identity cues. Controlled procedural motion is central because the explanation depends on temporal consistency. Existing rendering tools support this physical scene directly; an externally generated environment adds no necessary explanatory information. No static slideshow or dependent stock footage is used.

Road trajectories are analytic, periodic and order-preserving. Each car advances or briefly stops; its slow phase changes over time. The phase/region travels upstream independently of which cars currently occupy it. The explanatory model's arbitrary units and speeds are not narrated or presented as experiment measurements. The circular scene is also illustrative, not a calibrated recreation of recorded trajectories. Numerical tests cover forward motion, separation, initial uniform flow, cluster growth and turnover.

`SIMPLIFIED EXPLANATORY MODEL` is persistent on all explanatory road scenes, including opening/mechanism/payoff/ending. The ring uses `EXPERIMENT RECONSTRUCTION`. Disclosures sit above the action. Captions sit below it, use speech-first semantic phrases and selectively emphasize opposing directions/conditional language. They reconstruct every approved sentence exactly. Sentence changes are anchored to measured WAV pauses; one within-sentence experiment split is manually estimated. Optional WebVTT is derived from the same plan.

Original deterministic stereo road texture and soft synthesized transition accents sit beneath narration (bed gain 0.22, narration gain 0.86). No external samples or music. Media mean level −25.1 dBFS, peak −4.4 dBFS; no clipping detected. Complete listening/creative sound review remains part of the owner gate.

## Review evidence and limits

- [Media report](../../../artifacts/qa-evidence/phantom-traffic-candidate-v1/report.json)
- [30-frame contact sheet](../../../artifacts/qa-evidence/phantom-traffic-candidate-v1/contact-sheet.jpg)
- [First frame](../../../artifacts/qa-evidence/phantom-traffic-candidate-v1/frame-01-0.0s.png)
- [0.5-second frame](../../../artifacts/qa-evidence/phantom-traffic-candidate-v1/frame-02-0.5s.png)
- [1-second frame](../../../artifacts/qa-evidence/phantom-traffic-candidate-v1/frame-04-1.0s.png)
- [Agent frame-inspection findings](visual-inspection.md), distinct from owner approval

The 30 captures include every caption midpoint, experiment/mechanism/turnover/payoff/ending. Known master/YouTube V2/TikTok V2 insets were screened geometrically; no real-device/platform approval is claimed. Meta grid/feed geometry remains unknown. Critical action stays central for later adaptation. Actual mute-mode motion, legibility on a phone, narration pronunciation/synchronization and overall premium-quality acceptance require reviewing the full candidate.

Two independent renders of payoff frame 768 matched exactly. Soundscape regeneration is deterministic. Full MP4 re-encoding identity and exact fresh TTS regeneration are not claimed: retained original bytes are authoritative. One candidate MP4, seven WAVs and 32 bounded QA files are `DURABLE_REQUIRED` in Git; smoke renders, model/browser caches and superseded scratch frames remain ignored. Asset provenance is recorded in `docs/ASSET-LICENSES.md`.

## Validation result

Full `pnpm check` passes: typecheck, lint, 274 tests in 20 files (10 new Phantom Traffic tests), and diff checks. Native exact-commit/approval/package/asset/claim/evidence/production/caption/audio/candidate validators pass. The original research-v1 and finalization-v2 validators pass unchanged. Scoped secret scan passes; one unchanged documentation placeholder is explicitly recognized. All 150 required Git-durable artifacts verify, including the 40 new production records; all 201 prior manifest records retain their values. See [validation receipt](validation.json) and [changed-file inventory](files-changed.json).

## Exact next gate

Ahmet watches/listens to the **exact candidate MP4 with SHA-256 above**, checks the forward-car/backward-pattern distinction with audio muted, and either approves it as the locked master or requests revisions. No further production variants, platform uploads, covers, device approvals, delivery packages, scheduling or publication are authorized by this handoff. After master approval: renewed platform presentation/device QA, necessary covers/derivatives, delivery, then separate publication authorization.
