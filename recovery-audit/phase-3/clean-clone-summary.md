# Clean-clone recovery proof

Tested committed artifact/source baseline: 6648d1b4650e7cad806a3726cdd293196596abe4. Used git clone --no-local --single-branch from the original repository to an initially empty ignored directory. Git objects were independently transferred without hardlinks; operational output/cache/local artifact-store were absent. No private workstation artifacts were copied into the clone. Local transport was chosen for a bounded clean-checkout proof; GitHub remote HEAD is separately verified after push.

pnpm install --frozen-lockfile succeeded with supported Node22/pnpm10.17.1. Full 253-test suite/typecheck/lint/diff passed. Brain routing/source integrity, 110 required Git archive identities, pre-restore aggregate artifact verification, exact restoration, post-restore verification, all eight draft packages, recovered master/derivative production chains and both caption validations passed. The missing historical Wood Frog expectation is explicitly reported without claiming corruption or recovery. Optional absent frame/marker state is distinct.

All eight committed QA recipes ran on restored durable media (no new video render), and **all 82 regenerable PNGs exactly matched their Phase 2 recovery identities**. New report timestamps are new recovery-generated evidence, not original files. Tracked clone tree stayed clean. Frame/QA/dependency workspaces remain ignored. All machine receipts and 20 command logs accompany this record.

The final follow-up audit commit contains only proof/report documentation; artifact/source code is unchanged from the tested baseline. Recovery closure remains an owner decision. No Meta geometry/device pass or publication metadata was invented.
