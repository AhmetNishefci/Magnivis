# Clean recovery source baseline

Fetch succeeded before switching. Original evidence branch origin/recovery/magnivis-post-reset was synchronized at 9f289d4a05714b3daf0bcc47f9b8e481600eaae5; original working tree clean. prebranch-evidence.json captures refs/status/branches/audit paths. Main exactly matched owner checkpoint ae797996382c337759612265fd8229e8d5f06eef.

Created recovery/wood-frog-canonical directly from origin/main. Inspected audit commits 4e70856 and 9f289d4: all paths under recovery-audit/phase-0/. Cherry-picked only their diffs, producing e1cdeef and b6ca084. Phase0 directory byte-identical to the preserved evidence branch. HEAD for baseline validation: b6ca084170a54fc2638bae7abcd2e1236943cb1d. Main ancestor verified. 8be2020, 3c34212, 317ea9d and b74cfc6 each fail merge-base --is-ancestor against this branch. No Bridge source/asset/doc overlay imported. Original branch unmodified.

## Before regeneration

Node v22.23.3, pnpm10.17.1. Existing dependencies sufficient; no install/package/lock change needed. `pnpm check` passed typecheck/lint and 13 files / 208 tests (2026-09-30 21:01:24 local). The tracked HEAD was checkpoint plus audit-only changes; Phase1 evidence directory was being created. baseline.json's statusAfterAuditCopy was captured later after staging-ignore/helper creation, not asserted to be the initial clean status. No interrupted production work existed.

The only checkpoint file modified by Phase1 is .gitignore's new /recovery-work/ exclusion. All 221 other checkpoint tracked files were hash-checked identical to origin/main. Canonical compositions, data, approvals, captions, narration, docs, strategy and profiles remain unchanged. New isolated recovery delivery helpers/tests/audit records are additive. No render wrote output/, qa/ or deliveries/.

## Reconciliation

Main's pending Wood Frog previews describe its last pushed state. The owner's new historical statement establishes a later upload occurrence at owner-evidence level; missing platform/ID/time/settings/hash fields remain unknown. No old PublicationRecord was rewritten. Current source/delivery gates continue to demand exact locked Wood Frog bytes, which recovery regeneration did not reproduce.

## Final validation

After adding recovery delivery safeguards, supported-runtime `pnpm check` passed 14 files / 212 tests. Four new tests exercise no approval transfer, staging-only TikTok resolution, mismatching Wood Frog lock removal in isolated recovery variants, and preservation of a trusted hash for relocated exact bytes. Final command/diff/ancestry/ref results are recorded at completion. No dependencies or creative inputs changed; no platform or remote artifact-storage action occurred.
