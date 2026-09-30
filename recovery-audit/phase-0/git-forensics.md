# Git forensics — observation, not restoration

Observed 2026-09-30 after successful `git fetch --all --prune`. The initial sandbox attempt could not write `.git/FETCH_HEAD`; the authorized escalated fetch succeeded. Fetch updates remote metadata; no history was rewritten.

- Branch: `recovery/magnivis-post-reset`.
- Initial HEAD and origin/recovery branch: `b74cfc671d9666d593867cf50efd161290a19f62`.
- Local main and origin/main: `ae797996382c337759612265fd8229e8d5f06eef`.
- Two local branches: main and recovery/magnivis-post-reset. Two remote branches plus origin/HEAD → origin/main. No tags.
- Working tree/index were clean before report creation, including untracked files. Output/QA/deliveries contained only `.gitkeep`. No interrupted Milestone 5 changes were observed. Unsaved editor state and earlier lost untracked files cannot be inferred.
- Reflogs start at this clone on 2026-09-30 16:55:48 +0200, followed by branch creation and four reconstruction commits/pushes. No pre-reset reflog survived in this clone.
- `git fsck --full --no-reflogs --unreachable`: seven unreachable blobs; zero unreachable commits/trees reported. All seven contain Bridge reconstruction source/SVG/manifest/hash material. No creation timestamp can be obtained from a blob. Identity, sizes and forensic excerpts are in `unreachable-objects.json`; objects remain untouched.
- Reported lost identifiers e069193, 9bd2964975ab5bd14bbc48cb5e0a4070223ce47a, cb3cf5c1a96dae63ca12f958fce57e2798d87936, 5f2d45e01a9cb7bee9bbeb2c4e1a9c1433ae1dcf, f4e42118da26a5dad4168a20429ef40dc90c7572, f93913459c11b985e9a9a3d2cba19e7ba166c3a2 and 0d80f5c4e1b9ed05c386a73e9f361e8aa40c2ab5 all fail `git cat-file -e <id>^{commit}` (128). Their descriptions in docs/RECOVERY.md are later owner-report provenance, not original commit contents.

## Last complete pushed tree

Main ae79799 (`feat: prepare wood frog platform deliveries`, 2026-09-29) has 222 tracked files: production source, six stories, audio, captions, approved Wood Frog snapshots, fixture runs, schema/registry/CLI systems, tests, agent rules and documentation. It does not contain the generated masters/QA/delivery bytes its status describes. A clean clone reconstructs authored inputs and editorial approval records, not the complete operating workstation or approved binary chain. Main is behind the owner's produced/uploaded checkpoint; no claim is made that its pending platform state is the final historical truth.

HEAD has 363 tracked files. The four-commit delta touches 158 files with 9544 additions/19 deletions. Exact trees/paths/blob identities for both refs and the sole removed historical source (`ShortOpenCaptions.tsx`) are indexed in inventory.json. Exact main objects survive even when HEAD documentation is overlaid.

## Every recovery-branch commit after main

| Commit | Audit categories | Findings |
|---|---|---|
| 8be2020 | A / C / E | Post-reset provenance and fresh eight-source-family/18-claim Bridge reconstruction; new candidate/package/asset/review/CLI/tests. This is new evidence inspection, not recovered original research bytes. |
| 3c34212 | C / D / E | New owner editorial approval with current timestamp, approved snapshots and five vector design replacements (Exploration A), inspection tooling/tests. A subsequently rejected visually. |
| 317ea9d | D / E | Five newly generated cinematic imagery sources, deterministic compositing/review artifacts, prompts/hashes/licensing and generic raster helper. Later design experiment, not Wood Frog style baseline. |
| b74cfc6 | D / E / A | New B art-direction approval, six-second controlled opening prototype, semantic masks, frames/MP4/QA, motion utilities/tests and recovery documentation. Proof awaits owner motion review; full film unauthorized. |

A=forensic/recovery infrastructure; B=faithful reconstruction supported by historical evidence; C=Bridge-specific reconstruction; D=later creative experimentation; E=potentially useful generic infrastructure; F=interrupted/unapproved work. Commits can contain multiple categories. No commit qualifies wholesale as B: historical hook/intent reports may support individual reconstruction choices, but original source/artifact bytes were not recovered. Pending prototype approval is a gate within D, not evidence of uncommitted F. No F working-tree files observed. No wholesale merge recommendation.

## Safety and validation

No reset, clean, gc, merge, rebase, branch deletion, render, production generation or platform action was run. Existing `pnpm check` passed typecheck, lint, 17 test files / 249 tests on HEAD with Node 24.21.0 and pnpm 10.17.1, after launcher DNS failure required authorized registry access. A supported Node 22 check is recorded in README when completed. Main's 208-test result is historical documentation, not a new checkout test. Tests may create/dispose temporary fixtures as normal baseline validation; no production artifact was regenerated. `git diff --check` passed. Full raw Git command output and initial empty tracked/staged diffs: git-evidence.txt. Audit commit/push details are finalized separately after output review; no canonical path may be staged.

Supported-runtime verification: `PATH=/Users/ahmetnishefci/.nvm/versions/node/v22.23.3/bin:$PATH pnpm check` passed (exit 0), typecheck/lint, 17 test files and 249 tests. No engine warning. Test run 2026-09-30 20:47:57 local, 4.15 seconds. Only audit files are untracked; canonical diff remains empty.
