# CYCLE #23 V2 MASTER REVIEW

Candidate for owner review only. V1 is not approved as final; V2 has no master approval, delivery or publication authorization.

Master: `artifacts/masters/yamaguchi-two-bombs-cycle23-candidate-v2.mp4`
SHA-256: `9640763882f0056990eb41df6f1e0bb6bb43fdfc907881cd2e750a01fb6420c7`

Picture: **64.366667 seconds, 1,931 frames, 1080×1920, 30/1 fps**. MP4 container/audio duration 64.426000 seconds. H.264 High, 8-bit full-range 4:2:0(`yuvj420p`,pc range,bt470bg reported), 4,635,451 bit/s video. AAC-LC stereo 48,000 Hz, 192,127 bit/s. File 38,916,717 bytes; total 4,832,423 bit/s. Audio −18.9 LUFS, −3.3 dBTP. Short retained AAC tail is not added picture padding. Probe/full-decode evidence: [stream specifications](qa/stream-specifications.json).

Repository: `content/cycle-11-discovery`, HEAD and local origin tracking ref `8e0cc9ca4311eff2a6ff4954f8c5c9ec5a3d47bb`. Existing branch and synchronized checkpoint preserved; no fetch/push/commit/worktree. V1 entry already contained 137 staged production paths; V2 manifest measures changes relative to that entry, not HEAD, so it does not relabel V1 work as V2.

| Picture interval | V1 | Focused V2 |
|---|---|---|
|0–9.50s|Same portrait9.5s|Portrait0–2.40; two-city question2.40–4.87; engineering hands/ship plan4.87–9.50. Exact spoken hook retained.|
|9.50–20.13s|Street/light, then injured face|Intact street changes to matching damaged state16.27–17.27, then injured survivor. Same doorway/pole/viewpoint; no blast spectacle or graphic casualties.|
|20.13–27.50s|Map followed by seated train portrait|Departure map20.13–22.33, carriage-window travel22.33–25.93, arrival map25.93–27.50. Explicit departed7August/arrived8August; essential date labels 38 px. Geographic link is not a railway route.|
|27.50–38.37s|Near-identical seated office view10.87s|Standing workplace wide27.50–30.80; bandaged arm/table detail30.80–34.67; restrained flash33.80–35.57; recalled shelter beneath same table34.67–38.37.|
|38.37–47.53s|Repeated injured portrait, then ruins|Survival arm detail38.37–42.80; retained empty damaged street42.80–47.53. Wife/infant explicitly survived Nagasaki; no family scene or reunion invented.|
|47.53–64.37s|Journey map reused for recognition; empty1945desk|Original two-city exposure acknowledgment47.53–53.30; plural-survivor qualification53.30–56.27; aged illustrative continuity actor56.27–64.37 with later-life advocacy. No fake certificate or historical photograph.|

Repetition reduction is demonstrated by **19 exact timestamp-matched V1/V2 frame pairs** across six sheets, not inferred from a new camera move or asset count. Opening portrait hold drops9.50→2.40seconds; the10.87second office hold becomes wide/detail/shelter states; the injured portrait is no longer reused after Nagasaki; recognition no longer repeats the journey map. Eight new original plates serve those changes. Same street/table/window/dressing relations carry consequence across shots. Matched frame indices, source hashes and V1-left/V2-right order are in [comparison bindings](qa/comparison-bindings.json). Canonical sheets: `artifacts/qa-evidence/yamaguchi-two-bombs-cycle23-v2/comparison-*.jpg`. [Shot/state ledger](shot-ledger.json) records each purpose.

All historical evidence and factual qualifications remain as V1. [Verified chronology](../research/chronology.json), [claim/source package](../knowledge-package.ready.json) and [source inspections](../research/source-inspections.json) are unchanged. Under-desk shelter is depicted from Yamaguchi's retrospective translated2006testimony, printed107–108; exact room/blocking is illustrative, not independently recorded. No invented dialogue, precise rail route, immunity, radiation/cancer causation or sole-double-survivor claim. Nagasaki's2009acknowledgment concerns his exposure in both cities. Family survival concerns Nagasaki.

Audio/narration/caption preservation:

- Thirteen existing Kokoro `af_heart` WAV takes and soundscape unchanged. Finished V1 AAC copied without synthesis, gain, timing edits or remastering.
- AAC payload SHA-256 `655537279e32558b2b92625d39f50fab4c18294c46a1940ffb86111859e0a21c`; decoded PCM SHA-256 `3eae0a66d2e4979dea994a0cc3c51bc67b50ef3ad15a1c0abadb321c233a7b76`, equal in both masters. All 3,021 packet timestamp/duration/size/flags/skip-sample records also equal. [Audio identity](audio-preservation.json), [packet timeline](qa/audio-timeline-preservation.json).
- All 42 caption cue objects equal: wording, punctuation, line grouping and frame boundaries. Caption renderer markup/style equal: Manrope 600, 56 px, original placement/lower gradient. CaptionPlan identity/direction/provenance re-bound to V2 only; original VTT unchanged. [Caption preservation](caption-preservation.json).
- Exact 1,931-frame picture and narration cue timing retained. ASR/signal evidence supports machine fidelity; it does not certify pronunciation, prosody or fine subjective synchronization.

Exact preserved narration:

He survived an atomic bomb. Three days later, he survived another.

This is Tsutomu Yamaguchi, a Mitsubishi shipbuilding engineer.

August sixth, nineteen forty-five. He was in Hiroshima on business when the United States dropped an atomic bomb.

Severely burned, he survived.

The next day, he boarded a train. It carried him home to Nagasaki.

On August ninth, he was back at work. He recalled describing Hiroshima to his manager.

Then came another flash. The second atomic bomb had struck.

He survived again. His wife and infant son survived too.

The bombings killed tens of thousands and left lasting suffering.

In two thousand nine, Japan officially recognized his exposure in both cities.

He was not the only double survivor.

He lived until twenty ten, aged ninety-three.

In later years, he urged the world to abolish nuclear weapons.

QA: final `pnpm check` **passed 56 files / 519 tests**, typecheck and lint passed; 96.47 seconds. Full video/audio decode with FFmpeg error escalation passed. Media integrity, actual-master ASR/loudness, exact caption-plan validation and source bindings passed. Browser geometry measured 130 checkpoints, including actual SVG map text, all 42 caption midpoints and no sampled collisions/overflow. Final decoded review covered 65 one-second chronological frames,42 caption midpoints,18 phone-size 360 px samples,16 event states,24 motion states and19 matched comparison pairs. Essential journey dates were enlarged after phone review; measured 2–4 px SVG bounding-box overlaps were corrected without changing the validator. [QA receipt](qa/final-report.json), [command results](qa/command-results.json), [separate rendered-sequence editorial review](rendered-sequence-review.md).

Durability passed: 1,575 canonical payloads and 731 legacy durable artifacts. All 1,545 entry media records unchanged ; 30 new records (8 plates, 1 master, 21 decoded QA sheets). All 8,313 frozen entry files remain byte-identical. Five existing files intentionally advance: append-only catalog, current cycle head, project gate index, license append and prospective production-guidance application correction. Original 7 Cycle 23 events/history preserved; new revision 12 replays to master-review, masterDecision/release/publicationDecision null. [Preservation](qa/preservation.json), [durability](qa/durability.json), [journal replay](qa/journal-replay.json).

Four local presentation preflights report no sampled collisions, with owner-risk-review disposition. Provisional profile/native UI/caption/crop knowledge, unsampled motion and actual-device evidence remain unknown. Desktop360px proxies are not native mobile approval. No PlatformVariant or delivery created.

Resolved execution issues remain documented: original finalizer stopped after registration/QA on UTC timestamp syntax; first recovery script omitted a checks variable. The original records and old bound source are retained; an explicit source snapshot/addendum and hash-guarded continuation completed the candidate. Same instant normalized from+00:00toZ, no evidence overwritten or validator relaxed. A check run before local staging failed the new-media Git-tracking test(518pass/1fail); after scoped staging the unchanged test and complete suite passed. These are resolved implementation/audit issues, not hidden failures. [Recovery](finalization-resume.json), [source correction](finalization-source-correction.json), [implementation integrity](qa/implementation-integrity.json).

Global backlog status still fails on **11 previously documented historical discovery-document digest references** across Cycles 9, 10, 12–15. Every mismatch predates V2. Current PRODUCTION-PLANS receives a prospective application correction, advancing its current hash further; original historical references remain untouched. This is distinct from media integrity, which passes. No silent repair or weakened validation. [Historical mismatch investigation](qa/historical-status-investigation.json).

Rights/provenance: new artwork uses the built-in imagegen tool with only original V1/V2 images as references; exact prompts and frozen selected outputs retained in [artwork generation](artwork-generation.json) and [identities](artwork-identities.json). Original code supplies schematic geography, window-layer travel and acknowledgment typography. No external archival photograph, film or testimony audio acquired or licensed by implication. Research-only source excerpts remain unchanged with prior secret-scan identities verified. Existing Kokoro Apache2.0 and Manrope/SIL OFL terms retained. [Rights verification](rights-verification.json), [rights record](rights-provenance.json), `docs/ASSET-LICENSES.md`.

Remaining creative concerns: this remains **still reconstruction with purposeful state cuts**, not continuously performed acting. The recognition card 8.73 seconds and aged portrait 8.10 seconds are reflective holds and may still feel static. Their distinct information and life stage reduce repetition but do not self-certify a premium short-film result. Aged likeness, exact building/damage/gauze details and landscape remain illustrative. The schematic map is intentionally sparse. Owner continuous viewing/listening must judge pacing, emotional effect, name delivery and fine caption synchronization; real-device/native crop remains pending.

[Changed-file manifest](changed-files-v2.json) lists all new/changed V2 files with hashes and byte sizes relative to the captured entry state; it excludes its own recursively impossible hash and ignored scratch studies. Failed internal visual studies remain in `output/` under their recorded identities. Production/source/QA records are locally staged for tracking audits only. V1, prior cycles, masters, deliveries, publications and historical approvals preserved.

**STOP: owner V2 master review. No master approval, delivery preparation, commit, push, branch change, scheduling, upload or publication.**
