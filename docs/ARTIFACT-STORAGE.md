# Artifact Storage V1 — Git-backed durability

Authority: binary identity, retention, provider boundary and clean-machine restore. At current Magnivis scale the owner selects **normal Git/GitHub** for important artifacts. Phase 2's external-archive proposal is superseded for this phase; no S3/R2/cloud infrastructure or LFS is introduced. The generic provider interface/local adapter remains useful.

## Retention policy

| Class | Rule and current examples |
|---|---|
| DURABLE_REQUIRED | Exact approved/published bytes when available, accepted operational replacements, useful recovery regression masters/derivatives, final package file sets, important final QA reports/contact sheets, exact narration/audio, manifests/decisions/publication evidence. Commit and verify before milestone handoff. |
| DURABLE_WHEN_APPROVED | Candidate covers, new platform derivatives and device screenshots selected for approval/evidence. Approval/evidence-bearing bytes must become DURABLE_REQUIRED; no automatic owner approval. No lost cover/screenshot is recreated now. |
| REGENERABLE | Routine representative frames with committed recipe/source. Keep local/ignored; source media is durably retained. Rebuilt reports have new timestamps/identities, never original approval evidence. |
| TEMPORARY | Caches, intermediate/failed encodes, experimental/scratch renders, unimportant QA and disposable recovery markers. No archive requirement. |
| HISTORICAL_EXPECTATION_ONLY | Missing original Wood Frog master: trusted historical hash/approval, no file or claimed archive location. Absence is a known historical gap, not repository corruption. |

Eight recovery media are deliberately retained: exact Speed of Light, accepted Wood Frog replacement, two TikTok derivatives, and four other historical regeneration candidates useful for continuation/creative regression. This is bounded recovery retention, not a rule to commit every candidate render. Retain eight immutable draft delivery file sets as recovery evidence, not historically approved packages. Retain eight final QA reports and eight contact sheets; do not commit the 82 routine frames or disposable QA copies. Existing 44 WAV files stay at public/audio with new manifest bindings rather than duplicates.

Git-tracked areas: artifacts/masters, artifacts/platform-variants, artifacts/delivery-packages, artifacts/qa-evidence. Existing artifacts/manifests.json, recovery decision, owner evidence, presentation records, approved source snapshots and public/audio remain authoritative. Covers are represented by the typed model; no cover bytes survive/are created. No empty cover/audio hierarchy is needed just to mirror an example.

## Manifest and exact identities

The strict manifest registry binds artifact/content/type/revision, SHA-256/bytes/MIME, exact repository path through a git provider location, source commit/plan/caption/variant references, explicit decision scope, historical identity, replacement/parent relations, provenance and retention. All Phase 0/1/2 records remain unchanged. Provenance categories remain HISTORICAL_EXACT, RECOVERY_EXACT_REPRODUCTION, RECOVERY_EQUIVALENT_REGENERATION, DERIVED_RECOVERY_ARTIFACT, RECONSTRUCTED_FROM_EVIDENCE and DISPOSABLE.

Missing historical Wood Frog 4c5354d9… remains an expectation; accepted replacement 400edecc… has its own immutable bytes and decision. Speed f157f7ef… matches recorded published master. Other encodes/packages remain regenerated recovery identities. Exact cloned recovery bytes do not imply exact original historical bytes or platform/publication approval. Unknown original creation times stay null.

## Operators and clone procedure

The repository filesystem is the default read-only `git` artifact provider. Status/verify validate archived bytes separately from operational workspace copies. Restore copies exact Git bytes to ignored operational paths, verifies SHA-256/size and atomically installs only absent destinations. Conflicts/corruption fail; restore never renders. Optional missing regenerable files and the historical missing expectation are reported distinctly and do not fail aggregate verification. Corruption or missing DURABLE_REQUIRED bytes always fail. Optional local adapter remains configured by MAGNIVIS_ARTIFACT_LOCAL_ROOT; no cloud credentials.

```sh
git clone --branch main <repository-url>
cd Magnivis
# Tested Node 22.23.3 / pnpm 10.17.1
pnpm install --frozen-lockfile
pnpm check
pnpm recovery:brain
pnpm artifacts:status
pnpm artifacts:restore
pnpm artifacts:verify
pnpm recovery:validate
pnpm production:validate wood-frog --recovered
pnpm captions:validate wood-frog
```

Before restore, verified archive bytes are reported as RESTORE_AVAILABLE when the workspace copy is missing. Missing durable bytes or corrupt archive/workspace bytes fail; status separates these conditions. After exact workspace restoration, aggregate verification passes with the known historical expectation explicitly reported. Original-only production validation remains expected to fail because historical 4c… bytes are missing. The recovery mode uses a separate owner decision and does not rewrite approval.

Routine QA can be rebuilt explicitly with `pnpm qa <video-id> --recovered`, using stored media plus committed QA timestamps, static ffmpeg and scripts. It writes new RECOVERY-GENERATED QA to staging and refuses existing recovery-QA directories. PNG/contact-sheet reproduction is tested; new report timestamps prevent claiming original report identity. No video render is required. Source/render recipes/environment remain recorded in Phase 1; video render reproducibility is not guaranteed byte-identical except demonstrated Speed reproduction.

## GitHub size and continuity policy

Review individual files and unique Git blob growth before each binary archive commit. GitHub warns above 50 MiB and blocks above 100 MiB; stop oversized artifacts individually, never auto-install LFS or split active production files to evade limits. Owner-authorized historical failed-media retention uses verified exact-byte archival parts under the contract below; those parts cannot be delivered or promoted as production media. Source: [GitHub large-file guidance](https://docs.github.com/en/repositories/working-with-files/managing-large-files/about-large-files-on-github). Current largest new file is 42,978,901 bytes. Exact repeated delivery videos share Git blob identity; do not count them as distinct encodes. Record logical and unique byte growth in phase-3 artifact-migration.json. Reassess repository growth before scale makes normal Git impractical.

Push source and important exact binary identities together, verify remote HEAD, and test clean clone/restore. A workstation is disposable; pushed branch contains important current artifacts. Keep temporary output/qa/deliveries/.artifact-store/cache ignored. GitHub durability does not fill lost history or grant publication authority.

## New production review candidates

A single important master-review candidate and its exact narration, soundscape, final report/contact sheet and bounded review captures may be designated `DURABLE_REQUIRED` before owner visual approval. This preserves the bytes the owner must review; it does **not** approve them. Phantom Traffic candidate v1 retains one MP4, seven WAVs and 32 QA files (30 captures, report, contact sheet). Smoke renders, superseded local captures and Chromium/model caches stay ignored. Files remain below the normal Git/GitHub file limit.

New originals use provenance `ORIGINAL_PRODUCTION` with `historicalStatus: new-production`, separate from every recovery category. They have no historical/replacement identity, `approvalScope: none` and `publication: not-authorized`. `sourceCommit` is the owner-approved editorial base; the production implementation is hash-bound in its committed candidate receipt, avoiding a circular claim about the commit that contains its own manifest. Existing historical manifest records/identities remain unchanged.

The two independent payoff still renders demonstrate same-frame determinism only. Full MP4 re-encoding identity is not claimed; exact retained video/audio bytes remain the review authority.

## Locked master and presentation evidence

Master visual approval may add a new logical `owner-visual` identity for the same candidate path/blob; the original candidate manifest remains unchanged. This is explicit same-byte promotion, not historical approval transfer or silent replacement. CoverAsset PNGs use artifactType `cover-image`, independent review state and exact hashes. Phantom Traffic adds one cover candidate and seven bounded local sheet/report pairs as durable-required review evidence; no master copy or video derivative.

## Content-scoped original production collections

Longitude Clock preserves the exact historical `artifacts/manifests.json` file. `artifacts/longitude-clock-manifests.json` uses the same strict native ArtifactManifest schema for new original-production candidate/audio/QA records. `src/artifacts/registry.ts` combines these explicit collections and rejects identity collisions. Artifact status/verify/restore and durable verification consume the combined registry while the historical recovery decision validates its original registry separately. No historical identity or gate is changed. Exact original candidate, auditions, narration, sound, fonts/source and bounded QA evidence are committed; model/browser caches and superseded scratch encodes stay ignored.

Longitude Clock narrator revision v2 uses a separate `artifacts/longitude-clock-v2-manifests.json` collection, consumed by the same combined registry. Candidate v1 MP4/manifests/audio/QA/plans remain exact historical owner-review evidence. V2 receipt binds its separate master and essential render inputs; media remains unapproved with original-production provenance and no publication authority. Retiming does not overwrite old identities. Model caches and disposable scratch renders remain excluded.

## Longitude locked V2 and distribution review retention

`artifacts/longitude-clock-platform-manifests.json` adds a same-byte `longitude-clock.locked-master.v2` identity with explicit owner-visual decision, leaving both original candidate manifest collections unchanged. It also retains the cover, decoded local QA, approval/review plans/bindings, publication checklist/intake and each strict delivery file. Four upload copies share the exact master Git blob; no re-encode or derivative approval transfer. The combined artifact registry consumes this additional collection with existing exact-byte and durable checks. Source revision is the reviewed production commit; recording time is not a fabricated file creation or owner review time. Scratch cover repeat renders remain outside Git.

## Longitude release retention

`artifacts/longitude-clock-publication-manifests.json` is an additional native collection for final authorized handoffs, owner decision, cover selection, checklist and pending postpublication/intake evidence. New records are `authorized-not-published`; old candidate/master/draft collections remain exact. All four new video copies reuse the existing master Git blob. No new media encode, production asset or cover image is introduced. Required release artifacts survive a Git clone; model/browser caches and operational output remain unnecessary.

## Artifact Architecture V2 — prospective canonical media

`docs/ARTIFACT-ARCHITECTURE-V2.md` now owns canonical binary identity and reference-only Delivery Manifest V3. Prior V1/V2 descriptions above remain historical compatibility behavior. New durable handoffs reference one SHA-256-bound MediaArtifact per unique payload; platform-specific binaries remain supported for presentation quality. State transitions and authorization never copy media. Historical media/package/approval/recovery paths remain exact legacy evidence. Upload resolution: `pnpm exec tsx scripts/resolve-delivery-media.ts <manifest.json>`. Explicit evidence exceptions retain independent review provenance; no historical deletion/migration occurs.

## Failed historical binaries and physical Git durability

The owner-authorized Cycle #8 retention repair permits exact-byte archival storage for journal-proven historical failed/rejected/superseded candidates. See ARTIFACT-ARCHITECTURE-V2.md and `src/artifacts/retention.ts`. All physical Git files remain below the exclusive100MiB ceiling. The unchanged oversized original remains at its canonical path locally; Git durably retains its exact bytes in bounded, ordered, independently hashed parts plus the original catalog row, owner authority, workflow events and failure evidence. Clean-machine resolution restores the original without media regeneration. Its ignored path is a materialization rule, not a filename eligibility exemption: the lifecycle admission proof and production guards are general and mandatory.

This is archival preservation of an invalid artifact after owner-authorized revision, not a workaround for an oversized current candidate. It neither weakens the production limit nor grants approval. Catalog identity/hash/size/path, original events and failures remain immutable; archive integrity, provenance tracking and active-candidate exclusion remain mandatory. No cloud, LFS, remote upload or new publication mechanism is introduced.
