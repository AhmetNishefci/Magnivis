# Preserved-master owner selection

Additive implementation note for WORKFLOW-V3; normal owner gates and publication authority are unchanged. The original WORKFLOW-V3 bytes remain frozen because historical discovery records bind them.

## Owner selection of a preserved master

`select-preserved-master` permits explicit exact owner selection of a previously journaled candidate at an inactive master/presentation/publication-review boundary. It binds the current candidate/release, a same-cycle journal-proven production receipt and its original creative receipt, and valid owner master approval of the selected candidate. Full candidate, rights/production, narration, captions, actual-media and QA contracts are revalidated. The transition restores that creative/production chain, clears the superseded release/publication decision and returns to internal presentation preparation without rendering. All earlier events, candidates, decisions and releases remain historical. It rejects selections after scheduling/publication observations or publication authorization, unjournaled candidates, stale current references and unrelated creative/owner targets. Selecting a master does not authorize platform actions.

The recent-approved-master comparison reader recognizes exact selected candidate/creative/decision references in a preserved-master journal event. It still checks the complete journal chain and current-state hash; a detached selection cannot stand in for approval. Internal adapters cannot forge this owner event.
