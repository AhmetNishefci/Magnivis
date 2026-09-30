# Magnivis recovery — Phase 1

RECOVERY milestone only. Clean source checkpoint through Wood Frog; no new editorial production, creative changes, upload/publication, artifact-storage upload, main merge or Bridge work. Generated binaries remain ignored local staging and are not durably archived yet.

## Outcome

Created recovery/wood-frog-canonical directly from origin/main ae797996382c337759612265fd8229e8d5f06eef. Preserved Phase0 via audit-only cherry-picks 4e70856→e1cdeef and 9f289d4→b6ca084; excluded all four Bridge parent commits. Original recovery/magnivis-post-reset stays unchanged at9f289d4 and pushed.

Baseline Node22.23.3/pnpm10.17.1 check: 208 tests /13 files. Recovery helper tests bring final check to212 tests /14 files. Original canonical source/docs/audio/captions/approvals/profiles/strategy unchanged; only .gitignore adds recovery-work exclusion, alongside additive isolated recovery helpers/tests/reports.

Eight staged renders succeeded; eight QA directories reconstructed and contact sheets inspected; eight new draft-review recovery delivery packages generated/validated. All20 Phase0 REGENERABLE units covered explicitly. Primary count scope: eight media +eight QA directories +eight destination packages =24 units. One EXACT_REPRODUCTION (Speed of Light);23 equivalent technical regeneration candidates; zero unresolved generation failures. Exact historical identity/bytes for23 original units remain unavailable, overlapping those candidate successes. Diagnostic repeat/stills and copied surviving captions excluded from these counts.

Wood Frog historical SHA256: `4c5354d9368908f11f5f9b5767371694c2e51ad895786b2c31f7e329b83eaac2`. Recovery candidate: `400edeccbfceb7a0269ec0926a88737b2421adb811d6be9b8aa64c77b5e242e1` — NOT MATCHED. No historical visual approval transfer. Full historical production/hash gate deliberately remains unsatisfied. Source/audio/caption/safe-region checks and media QA pass. Repeat render differs in video, audio matches; SSIM0.999999. Three repeated PNG samples match. Historical decoded equality cannot be determined without original media.

Speed of Light SHA256: `f157f7ef91740ecd7c679156c6a227318b462fe33d13018ff39ab708ef480f24` — EXACT historical published master reproduction. Historical approval can be associated with these identical video bytes; no new package/platform/publication approval is granted. Other six routed media lack original comparison hashes and remain candidates.

New delivery IDs are isolated `.recovery-phase-1` variants; copy/captions/hashtags/safe-area selection preserved, inherited approval removed, status draft-review/preview not-ready/publication false. Historical Wood Frog sourceMaster is preserved as an expectation in provenance, not relabeled as the nonidentical candidate's approved source. Strict default production/delivery gates unchanged. Early incomplete delivery attempt preserved separately, preflight added before complete retry.

Ahmet's statement that Wood Frog was uploaded and latest uploaded video is recorded as OWNER-PROVIDED HISTORICAL EVIDENCE. Platform/URL/ID/date/settings/visibility/hash/analytics unknown. Meta Reel versus grid/feed presentation leads remain owner-evidence pending; no new geometry activated. Publication registry unchanged.

## Reports and evidence

- [Baseline and ancestry](baseline.md), [pre-switch Git evidence](prebranch-evidence.json), [baseline capture](baseline.json).
- [Wood Frog reproduction and mismatch assessment](wood-frog-reproduction.md), source/audio/media/QA validation JSON, repeat-stream/SSIM/raster diagnostics and environment fingerprints.
- [Artifact reproduction matrix](artifact-reproduction-matrix.md), [machine matrix/counts/Phase0 coverage](artifact-reproduction-matrix.json), [media records](media-reproduction.json).
- [Delivery reconstruction](delivery-reconstruction.md), [package identities/provenance/file hashes](delivery-reproduction.json).
- [Local staging SHA ledger](staging-artifact-ledger.json); no media binary added to Git.
- [Artifact Storage V1 proposal](artifact-storage-v1.md): Git manifests/approvals/recipes, immutable external binaries, disposable local caches; provider-neutral interface; future status/verify/restore with strict hashes and no silent approved-byte substitution. Design only; credentials/remote writes not added.
- [Owner evidence and pending Meta leads](owner-evidence.md), [machine owner record](owner-evidence.json).
- [Next human gate](next-phase.md).

## Replay and validation

Render operator replay: `python3 recovery-audit/phase-1/render-staging.py <checkpoint-video-id>`. Refuses existing staging output; browser process/download may require sandbox permission. Uses unchanged checkpoint render flags. Recovery delivery helper: `node --import tsx scripts/recovery-deliveries.ts <wood-frog|speed-of-light>` with optional `deliveries-complete` attempt directory. Neither command uploads nor promotes canonical state. Successful staging artifacts/hashes are recorded; normal pnpm check remains credential-free.

Source/caption/media/delivery/hash validation results and final diff status accompany this report. Strict Wood Frog approved-byte validation is intentionally a recorded failure, not bypassed. The final operator response supplies actual audit commit/push hashes; this report does not claim its own future commit identity.

## Stop

Ahmet and ChatGPT review candidates/exact original gaps; explicitly choose original search versus new Wood Frog candidate review and approve a bounded storage implementation/archive scope. Phase2 has not begun. No staging candidate or delivery is newly approved for upload/publication.
