# Magnivis recovery — Phase 0 forensic inventory

**FORENSIC ONLY. NO RESTORATION. NOT CANONICAL PROJECT STATE.** Observed 2026-09-30. Owner recovery target: Magnivis through the Wood Frog produced/uploaded milestone, retaining its established procedural/original explanatory style. Later Bridge cinematic experiments are separate post-checkpoint evidence.

## Findings

- Main ae79799 has 222 tracked files and ends at Wood Frog private-preview delivery preparation. It preserves the source/editorial/approval system but not approved rendered masters, generated QA or delivery packages. Owner's later uploaded checkpoint extends beyond that durable status.
- Recovery branch began this audit at b74cfc6, four commits ahead of main, synchronized with its remote. Those commits are reconstructed Bridge content/design/prototype and selected recovery/generic engineering. No wholesale merge recommended.
- Clean initial index/working tree: no interrupted Milestone 5 files. Reflog begins at post-reset clone. Seven unreachable blobs are Bridge source/SVG/manifest variants; zero unreachable commits. Seven reported lost later commit IDs are absent.
- Wood Frog ten-source/eleven-claim review, ten eligible verified claims, uncertain circulation exclusion, owner editorial snapshots r2, ProductionPlan r3, CaptionPlan r2/18 cues and original audio survive. Exact approved master SHA256 `4c5354d9368908f11f5f9b5767371694c2e51ad895786b2c31f7e329b83eaac2` survives; MP4 is missing. Audio hashes were recomputed and match. Four variant definitions survive; all private-preview-only in main. No surviving Wood Frog upload/publication URL or Meta device QA proves later outcomes.
- Six historical stories survive: Earth, Ocean, Billion Dollars, Speed, Human Engineering, Wood Frog. V001–004 have recorded public YouTube URLs (not live-inspected); V005 locally reviewed/platform pending. Cosmic-distance draft and Universe long-form brief survive; long-form implementation explicitly not begun.
- All eight routed MP4s, eight routed QA trees and eight recorded canonical delivery folders are absent. Exact Speed published master hash survives too. Delivery copy/templates/caption originals survive; exact original manifests/checklists/times/package hashes do not. Hash-locked Wood Frog delivery cannot simply accept a similar re-render.
- Brand/strategy/topic universe/roadmap/CI/review/caption/platform/delivery/operations/tests are recoverable at exact main refs. HEAD documentation includes later priorities and some stale handoffs; those were not edited. TikTok V1→V2 history survives, YouTube V2 does not. Meta grid/feed evidence is owner-required; geometry unknown.
- One modern PublicationRecord (Speed YouTube), four legacy public URLs, two accounts, three early prose performance snapshots, zero production MetricSnapshots. No publishing automation. Raw metric discrepancies and platform/spec runtime differences remain explicit.

## Reports

- [Recovery matrix](recovery-matrix.md): primary decision artifact; 119 recovery units, exactly one classification each, dependencies/actions/owner needs.
- [Machine inventory](inventory.json): matrix, content fields, 222-main/363-HEAD per-file Git identities, historical removed source, orphan blob identities and validation.
- [Git forensics](git-forensics.md), [raw Git evidence](git-evidence.txt), [unreachable blobs](unreachable-objects.json).
- [Content inventory](content-inventory.md), [system inventory](system-inventory.md).
- [Missing artifacts](missing-artifacts.md), [disaster analysis](disaster-analysis.md).
- [Proposed phases and next human gate](proposed-recovery-phases.md).

## Classification counts

EXACT_SURVIVOR: 62; EXTERNAL_SURVIVOR: 4; HASH_ONLY: 2; HISTORICAL_SUPERSEDED: 5; OWNER_EVIDENCE_REQUIRED: 6; POST_CHECKPOINT_EXPERIMENT: 7; RECONSTRUCTABLE: 2; REGENERABLE: 20; UNKNOWN_OR_LOST: 11.

Counts are matrix recovery units, not file totals; per-file indexes are separate. EXTERNAL_SURVIVOR means a durable recorded platform URL exists, **not** a live availability/download/hash verification. REGENERABLE means equivalent output appears possible from inputs, not a promise of identical MP4 bytes or inherited approval. UNKNOWN_OR_LOST also labels explicitly unimplemented/never-evidenced state; it does not establish historical data loss.

## Owner evidence needed

Exact Wood Frog master and historical delivery/QA folders; later Wood Frog upload URLs/IDs/visibility/approval; Meta actual screenshots/device/surface evidence, Instagram cover, Facebook derivative if any; YouTube V2 original profile/diff; missing account confirmations; original Speed master/package bytes; later analytics captures if they exist. Historical delivery timestamps/hashes/checklist decisions cannot be inferred. Other unknown candidate/lost local file evidence may be supplied if relevant. No credentials requested.

## Validation and Git receipt

`pnpm check` passed typecheck/lint and 17 test files / 249 tests on the current recovery branch, initially with Node24.21.0 (outside declared engine), pnpm10.17.1. Supported Node22.23.3 check result is appended below when complete. Main's reported 208-test baseline is historical, not rerun on main. `git diff --check` passed. No renders, production regeneration or external platform actions. Initial status/diff/HEAD captured in git-evidence.txt. Only recovery-audit/phase-0 may be staged. Final audit commit hash/push result are reported in the operator's final response; the committed report does not claim its own future commit identity.

## Stop gate

Ahmet and ChatGPT review and approve/correct the matrix and checkpoint/evidence gaps. Only a subsequent explicit instruction starts bounded Phase 1. No recovery begins in this turn.

Supported-runtime verification: `PATH=/Users/ahmetnishefci/.nvm/versions/node/v22.23.3/bin:$PATH pnpm check` passed (exit 0), typecheck/lint, 17 test files and 249 tests. No engine warning. Test run 2026-09-30 20:47:57 local, 4.15 seconds. Only audit files are untracked; canonical diff remains empty.
