> Current prospective orchestration and gate authority: [WORKFLOW-V3](WORKFLOW-V3.md). Current machine state: [project-state](../workflow/project-state.json). Dated milestones below retain their historical meaning; V3 does not reapprove or rewrite them.

# Content Intelligence V1

## Current topic evaluation prompt

The preceding `workflow.topic-evaluation` version 2 strengthens existing qualitative `curiosityGap` and `narrativePotential` rationales with the cold-audience premise question, open story forms, honest reframing, optional sharing and provenance-bound learning. The existing output schema remains version 1; no ranking system or topic taxonomy is added. Stored version-1 runs still resolve the original prompt through version-aware registry lookup; their envelopes and hashes remain unchanged. V2 also reconciles historical human-retrieval wording with actual internal evidence inspection under V3, without an extra owner gate. This advisory evaluation does not replace V3’s autonomous selection receipt or later evidence inspection. [STRATEGY](STRATEGY.md) owns the objective and [WORKFLOW-V3](WORKFLOW-V3.md) owns prospective orchestration.

Current `workflow.topic-evaluation` version 3 projects the [STRATEGY editorial calibration](STRATEGY.md#editorial-calibration--intrinsic-pull-and-worthwhile-payoff) into existing curiosity/payoff rationales. It tests the plain premise without production polish, combines pre-answer pull with post-answer value, preserves example eligibility without preference, and distinguishes extraordinary-claim investigation from factual assertion. Versions 1 and 2 retain exact historical instructions; the historical prompt instructions remain unchanged. Prospective V3 selections additionally bind inspected preliminary premise/payoff assessment and contextual editorial-decision learning under WORKFLOW-V3; this does not change the calibrated selection philosophy.


## Session discovery and comparison practice

Apply STRATEGY's existing calibration in the session that actually discovers and compares opportunities. The advisory topic-evaluation prompt evaluates a supplied candidate; it is not an autonomous search engine. A complete V3 receipt makes judgment inspectable, not necessarily persuasive. The [cold-audience audit](../system-audits/cold-audience-fascination/audit.md) documents the evidence for these operational clarifications.

In existing `searchBreadth` and search-record prose, assess the routes that produced the leads, not just their domain labels. Repeated searches of familiar institutional explainers for “surprising” findings can yield different subjects with similar explanatory opportunities. Source authority governs verification; it need not limit where an unverified lead is noticed. Follow an unfamiliar event, observation, question or connection when warranted, then seek appropriate evidence. A provocative or unreliable origin neither verifies a claim nor automatically disqualifies a truthful investigation. Broaden or deepen when the current routes plausibly omit serious opportunities; do not impose source quotas, compulsory controversy, category rotation or an endless search for something better.

Use existing `comparison`, `explanatoryPayoff` and `poolReview.rationale` to challenge the proposed winner: what answer might a cold viewer already anticipate, and what worthwhile understanding remains beyond the headline or first reveal? A familiar mechanism can still support an exceptional consequence or human story; an unexpected answer is not mandatory. Give the strongest credible rival its fair editorial case. Distinguish a weaker publishing opportunity from one whose evidence is not yet accessible. Research access and production feasibility determine whether a promise can responsibly be delivered; they do not establish desire for that promise. Explain why the available comparison supports stopping, or preserve `continue-discovery` with a useful next search. More candidates or domain labels alone do not establish a competitive pool.

Consider conversational value explicitly for the selected opportunity using the existing optional `curiosityReview.shareability` or comparison prose: what understanding might someone want to tell another person, and why is it more than an isolated fact? Preserve meaningful qualifications in that imagined retelling. This is an editorial hypothesis, not a prediction of clicks, sharing behavior or virality. A neutral, uncertain or absent sharing case remains acceptable; it is neither a new selection gate nor a penalty for quiet stories. Do not retrofit historical nulls with invented assessments.

Apply the existing evidence distinctions to counterfactuals and unresolved mysteries as well: identify assumptions, established consequences, model-dependent estimates and speculation. The payoff can be understanding why an answer remains unknown. Do not turn a plausible social outcome into a prediction or create false balance when evidence resolves a claim. Story form remains open and CreativeDirection remains downstream of premise approval.

## Cycle #3 open-world discovery — owner selection pending

[Cycle #3 handoff](../content-intelligence/discovery/cycle-3-2026-10-01/owner-review.md) records 32 fresh external queries, limited access reconnaissance, 34 proposals (33 distinct ideas after a disclosed whale-earwax overlap), ten existing-schema evaluations and five finalists. Manual session-assisted proposals are not a paid provider workflow/envelope, research workspace, evidence verification or owner decision. Open-world eligibility and the live-stage source/claim pause remain intact. Recommendations of research are conditional on owner topic selection and explicit bounded-research authority.

Validate with `node --import tsx scripts/validate-discovery.ts content-intelligence/discovery/cycle-3-2026-10-01/discovery.json` and `node --import tsx scripts/validate-cycle-3.ts`. The latter checks scheduling bindings, owner-selection null state, complete handoff coverage, unchanged historical files and current cadence/window constraints. Existing unseen-domain, selection-injection and anti-whitelist regressions remain applicable. Creative conveniences have zero ranking advantage; no fixed duration or production style is chosen. **Next gate: AHMET — CONTENT CYCLE #3 TOPIC SELECTION.**

Content Intelligence V1 is the implemented upstream workflow between a discovered idea and Magnivis's existing KnowledgePackage/ContentAsset system. It assists editorial work without granting a model authority to verify facts, approve content, or publish anything.

## Implemented boundary

```text
manual TopicCandidate
  → AI-assisted TopicEvaluation draft
  → AI-assisted ResearchWorkspace draft
  → source retrieval + human claim review
  → reviewed/approved KnowledgePackage
  → AI-assisted HookProposal batch
  → AI-assisted ContentAsset draft
  → human hook, script, visual, and editorial approval
  → existing PlatformVariant / production / delivery path
```

The workflow deliberately cannot convert generated research directly into an approved package. A model-proposed source is a lead, a model-proposed claim is unverified, generated hooks are proposals, and generated ContentAssets remain drafts.

Topic discovery is intentionally broader than science. Manual candidates may come from human behavior, philosophy, critical thinking, practical life skills, communication, relationships, business, economics, financial literacy, culture, history, technology, or any future legitimate domain. The existing open domain/topic slugs already support this; do not add a closed subject enum. Candidate evaluation should apply the topic identity, anti-self-help boundaries, evidence distinctions, diversity signals, and flexible formats defined in `docs/STRATEGY.md`.

## Manual discovery cycle after recovery

Cycle #2 also reconciles an audit-only historical checkpoint discrepancy: the adaptive milestone's manifest baseline predates 61 owner-authorized Cycle #1 appended records. The original baseline, creative-direction authority and every historical input remain unchanged. `system-audits/adaptive-creative-direction-v1/cycle-1-closure-checkpoint.json` binds only the exact synchronized-main manifest hash plus the preserved 257-record prefix. The checker rejects all other edits/additions; regression coverage proves this. No production-plan exemption or approval gate changed.

Cycle #2's [open-world discovery handoff](../content-intelligence/discovery/cycle-2-2026-10-01/owner-review.md) uses the same manual session-assisted boundary: fresh broad search before classification, complete pool/triage and native evaluations, with a separate editorial companion for five finalists. It remains pending owner topic selection; no ResearchWorkspace or downstream artifact is created. Validate with `node --import tsx scripts/validate-discovery.ts content-intelligence/discovery/cycle-2-2026-10-01/discovery.json`. The validator reports `shortlist` rather than conflating all evaluated candidates with finalists, and accepts truthful `search-excerpt` access when no direct open was attempted. Historical Cycle #1 files remain unchanged. New discovery-boundary tests exercise an unseen legitimate domain through evaluation and serialized validation, plus rejection of selection/approval injection. Categories organize; they never authorize a subject.

The first owner-authorized post-recovery discovery handoff is [Cycle #1, 2026-09-30](../content-intelligence/discovery/cycle-1-2026-09-30/owner-review.md). Its `discovery.json` contains 40 existing-schema TopicCandidates, per-candidate proposed triage and duplicate checks, 11 existing-schema TopicEvaluationDrafts and unreviewed feasibility source leads. It records manual session-assisted provenance; it is **not** a provider workflow envelope, fixture run or paid live execution. Classification follows idea discovery. The cycle-scoped registry is checked together with existing canonical candidates without changing historical registrations or approvals.

Validate this discovery handoff with:

```sh
pnpm exec tsx scripts/validate-discovery.ts content-intelligence/discovery/cycle-1-2026-09-30/discovery.json
```

The read-only validator checks schema, identity collisions, candidate dates/states, complete triage, finalist/evaluation revisions, dated source leads and the pending owner-selection gate. It does not verify factual claims or call a provider. The existing topic-specific CLI remains unchanged; this manual discovery boundary does not require creating a ResearchWorkspace or package for every proposed topic. Evaluations recommending `research` are conditional proposals; no research begins before owner selection and authorization. No selected topic or owner decision exists in this handoff.

## First real operator trial

The first new topic is `topic.wood-frog-freeze`: **How wood frogs survive being frozen**. It was selected because the stopped-heart/recovery contradiction is immediately understandable, the physical and chemical mechanism has strong visual potential, and peer-reviewed plus government sources can support a focused evergreen short.

The registered `wood-frog-freeze-tolerance` KnowledgePackage and its draft ContentAsset are real review material, not toy fixtures. The original operator run remains a historical record under `content-intelligence/runs/wood-frog-freeze-fixture-v1/`; its claims and script were superseded by the claim-review revision rather than edited in place.

Human Claim Review V1 is now implemented for this topic. The reviewed package and asset are revision 2 and preserve:

- ten inspected source records, including primary ECG, pulmonary-ventilation, thaw-recovery, glucose, urea, water-redistribution and Alaskan freeze-tolerance research;
- eleven claim records with exact evidence locations and population/experimental caveats;
- exact pre-approval claim states plus a separately recorded, hash-bound owner decision;
- four genuinely distinct hook archetypes;
- a 30–38 second claim-linked script draft;
- platform-neutral narrative beats and timed visual intent.

The review corrected material oversimplifications. Heartbeat, pulmonary ventilation and circulation are separate claims. Cardiac arrest and ventilation cessation have primary experimental support; direct blood-flow-to-zero measurement was not located, so circulation cessation remains `uncertain` and is excluded from the asset. “Frozen solid” is replaced by extracellular-ice/cellular-dehydration language. The Alaskan endurance result is now stated as 2 of 4 frogs meeting the survival criterion after eight weeks at −4°C, following earlier severe freezes; all four frogs in the twelve-week group died. The −16°C record is scoped to four winter-acclimatized Interior Alaskan frogs in one staged, slow-cooling laboratory trial.

The evidence handoff is `content-intelligence/reviews/wood-frog-freeze-v1/owner-review.md`, with `claim-review.json` as its machine-readable companion. Ahmet Nishefci completed the explicit owner gate on 2026-09-28. `owner-decision.json`, `knowledge-package.approved.json`, and `content-asset.approved.json` are now the canonical approval record: ten eligible claims are verified, circulation cessation remains uncertain and excluded, and the approved hook/script/narrative/VisualPlan may enter production planning. This approval does not authorize rendering, platform upload or publication.

The deterministic operator artifact is committed at `content-intelligence/runs/wood-frog-freeze-fixture-v1/`. Its `review.md` is the historical trial handoff, not the current owner decision document. The run proves serialization, validation, provenance, hashing, gates, and downstream shape without pretending that a paid model ran. Every workflow envelope truthfully records `provider: fixture` and awaits human review.

## Operator commands

Generate and validate the offline deterministic trial:

```bash
pnpm content:intelligence -- trial wood-frog-freeze --provider fixture \
  --output content-intelligence/runs/wood-frog-freeze-fixture-v1
pnpm content:intelligence -- validate wood-frog-freeze \
  --output content-intelligence/runs/wood-frog-freeze-fixture-v1
```

Generate and validate the evidence-review handoff:

```bash
pnpm content:intelligence -- review wood-frog-freeze \
  --output content-intelligence/reviews/wood-frog-freeze-v1
```

This command never approves anything. It writes an intentionally invalid `owner-decision.template.json`; the owner must read the report, supply their identity/time and meaningful notes, confirm or change every suggested decision, and remove `templateInstructions`. The completed file must match `ownerEditorialDecisionSchema`. Promotion then requires both that file and a deliberate confirmation flag:

```bash
pnpm content:intelligence -- approve wood-frog-freeze \
  --decision /absolute/path/to/owner-decision.json \
  --confirm-owner-approval \
  --output content-intelligence/reviews/wood-frog-freeze-v1
```

The command records reviewer identity, time, per-claim decisions, exact statement hashes, selected hook and asset decision. It rejects stale wording, uncertain/rejected claims promoted as verified, rejected claims in the approved script, unapproved hook claims, missing reviewer metadata and missing explicit confirmation. On approval it writes reviewed snapshots; a later deliberate source update can register those snapshots. An LLM must never create or invoke the owner decision as if it were the human reviewer.

Live execution is deliberately staged so it cannot cross the source-verification pause automatically:

```bash
export OPENAI_API_KEY='set-outside-the-repository'

pnpm content:intelligence -- evaluate wood-frog-freeze --provider openai \
  --output content-intelligence/runs/wood-frog-freeze-live-v1
pnpm content:intelligence -- research wood-frog-freeze --provider openai \
  --output content-intelligence/runs/wood-frog-freeze-live-v1
```

After those two runs, a human must retrieve the proposed sources, compare evidence, update the review package, and deliberately choose claim states. Only then should `hooks` and `asset` be run. The all-stage `trial` command is fixture-only specifically to prevent a live model from stepping across this gate.

After that review is recorded in the registered package, the remaining live draft stages are:

```bash
pnpm content:intelligence -- hooks wood-frog-freeze --provider openai \
  --output content-intelligence/runs/wood-frog-freeze-live-v1
pnpm content:intelligence -- asset wood-frog-freeze --provider openai \
  --output content-intelligence/runs/wood-frog-freeze-live-v1
```

The V1 operator command intentionally supports only this trial topic. To add another trial, define and register its TopicCandidate, review package, draft request/fixture, and CLI topic dispatch explicitly; do not duplicate this topic's claims or bypass the review gate merely to make the CLI generic.

`OPENAI_MODEL` can override the configured model for a controlled experiment. Do not use it as permanent hidden configuration; update the versioned defaults when a model choice becomes canonical.

## Provider and model architecture

`src/ai/provider.ts` is the vendor-neutral domain boundary. The production adapter in `src/ai/providers/openai.ts` uses the official OpenAI JavaScript SDK's Responses structured-output path, disables provider-side response storage for these calls, and returns unknown structured output for local Zod validation.

Workflow-specific model configuration lives in `src/ai/model-config.ts`, not in domain code. It records the model, reasoning effort, output-token ceiling, and a dated pricing snapshot. Provenance records provider, returned model, provider response ID, generation time, workflow/schema versions, input references, token usage when returned, and estimated cost when pricing is configured.

No API key is required for installation, tests, fixture trials, or validation. `OPENAI_API_KEY` is read only at the live adapter boundary. Tests inject deterministic fixture providers or a mock Responses client and never call the network.

## Versioned prompts

Prompt workflows live in `src/content-intelligence/prompts.ts` and each owns a stable workflow ID, version, output-schema ID, Zod output schema, system constraints, and deterministic input serializer:

- `workflow.topic-evaluation` v1;
- `workflow.research-workspace` v1;
- `workflow.hook-generation` v1 for approved packages;
- `workflow.hook-generation-review` v1 for supported review material;
- `workflow.content-asset-drafting` v1 for approved packages;
- `workflow.content-asset-review-drafting` v1 for supported review material.

The review workflows exist to prepare human-reviewable work before final claim verification. They do not weaken the production path: strict hook/asset drafting still requires an approved package and verified selected claims.

## Workflow-run artifacts

`src/content-intelligence/run-schema.ts` and `run-store.ts` persist a complete, nonsecret operator envelope:

- candidate, package, and asset identities;
- workflow, schema, provider, model, and revision metadata;
- exact structured input/output plus deterministic SHA-256 hashes;
- input references and derived artifact references;
- validation result and timestamp;
- optional token/cost metadata;
- explicit human review status.

The files contain no credentials, hidden reasoning, or chain of thought. Validation rejects metadata drift, provenance drift, input/output tampering, invalid structured output, and approvals without reviewer identity/time.

## Research and source retrieval

`src/research/source-retriever.ts` defines a minimal retrieval boundary for a known HTTP(S) source. The current implementation accepts HTML or plain text, records URL/status/content type/retrieval time, hashes the complete response, and stores bounded normalized text. It is not a crawler, search engine, PDF extractor, or citation verifier.

Retrieval does not establish evidentiary support by itself. A human still confirms that the source is authoritative, the locator says what the claim asserts, context is preserved, conflicts are represented, and caveats are adequate. Generated prose never counts as evidence.

## Cycle #1 selected research/editorial handoff

Ahmet selected `topic.phantom-traffic` after discovery and explicitly authorized bounded research plus an editorial proposal. [The review bundle](../content-intelligence/reviews/phantom-traffic-v1/owner-review.md) uses existing ResearchWorkspaceDraft, KnowledgePackage, ContentAsset, HookProposalBatch and ClaimReviewBundle schemas. Initial source leads remain unreviewed and initial claims unverified in the preserved workspace; source inspection is recorded separately before the supported review snapshot. The original discovery handoff is not rewritten as an approval.

This is manual session-assisted source inspection and proposal authoring, **not a paid provider run or workflow envelope**. No live CLI stages or fabricated provider/usage records exist. The live-stage human evidence pause above remains unchanged. The explicit owner request permits these review drafts; it does not substitute for human verification or the editorial gate. Claims stay `supported`, package `review`, asset `editorial-review`; candidate revision 2 remains `researching` in its cycle-scoped registry. Review package/asset are registered for normal schema/reference lookup, with no production consumer.

Read-only validation: `node --import tsx scripts/validate-traffic-research.ts`. It validates native records, historical discovery identity/hash, initial-state boundaries, reviewed claim hashes/evidence, full ledger coverage, exclusion eligibility, hooks and deterministic artifact bytes. It does not fetch sources, call providers, promote approval or produce media. Only an explicit subsequent owner decision can promote eligible claims/editorial material; production planning remains outside this milestone.

## TopicCandidate and ResearchWorkspace

`src/content-intelligence/schema.ts` records stable topic identity, discovery provenance, open taxonomy, timeliness, rationale, status, and review metadata. Evaluation uses categorical `weak`, `mixed`, `strong`, or `unknown` assessments with rationale and uncertainty rather than a fake virality score.

ResearchWorkspace keeps source leads separate from claims. Sources begin `unreviewed`; claims begin `unverified` with no review metadata; claim evidence must resolve to a source lead; open questions and conflicts remain visible. A reviewed KnowledgePackage is authored only after source inspection.

## Hook, script, narrative, and visual rules

Hooks reference package claims and remain proposals until selected. Review proposals may cite only `supported` or `verified` claims; production proposals may cite only verified claims in an approved package.

Every material factual script segment references selected claim IDs. Editorial connective language need not carry fake citations. Visual plans describe the story beat, objective, visual type, possible reusable primitive, required assets/data, approximate timing, and claim/script references. They do not contain Remotion frames, coordinates, platform UI, or production choreography.

## Claim review and promotion boundary

`src/content-intelligence/claim-review.ts` separates an AI-assisted evidence audit from owner authority. A `ClaimReviewBundle` records one inspection per source, one review per claim, evidence locators, limitations, prior wording for revisions, recommended status and statement hashes. `SUPPORTED` continues to mean evidence aligns with the scoped wording but owner verification has not happened. `VERIFIED` is created only by the explicit owner decision path and carries reviewer metadata.

Changing reviewed claim wording changes its hash and invalidates a stale owner decision. An `uncertain` or audit-rejected claim cannot be approved through the command; the research/review artifact must first be revised with stronger evidence. This is an auditability control, not a substitute for editorial judgment.

## Current human gates

The Wood Frog claim/editorial gate has been completed. Production must now:

1. consume the approved revision 2 snapshots without restoring the uncertain circulation claim;
2. preserve the approved scientific visual guardrails and record asset rights/provenance;
3. retain human approval for the final render, audio, captions and platform preview;
4. retain a separate explicit gate for disclosures and public release.

## Intentionally unimplemented

- trend/search/social discovery adapters;
- automatic source discovery, crawling, or general PDF parsing;
- automatic human verification or approval;
- retries/caching for paid live calls;
- exact VideoSpec or Remotion generation from a visual plan;
- publishing or analytics APIs.

Wood Frog has since completed bounded ProductionPlan/VideoSpec/caption/render implementation through the checkpoint. Current recovery identity and remaining platform gates are in PROJECT-STATE.md. Generic VisualPlan-to-Remotion automation remains premature.

## Partial owner approval and editorial finalization

Traffic waves revision 2 records an explicit owner component decision in [phantom-traffic-finalization-v2](../content-intelligence/reviews/phantom-traffic-finalization-v2/owner-review.md). The original full-approval command remains unchanged: it requires all claim decisions, exact confirmation and a supplied review time. `src/content-intelligence/scoped-owner-decision.ts` adds a narrower native record for approving selected claims/concepts while deferring the final exact narration. It binds package/asset/review revisions and hashes, original research artifacts and every claim statement. Eligible selected claims may become verified; reserves are explicitly deferred and exclusions retained. It cannot grant full asset, production or publication approval.

Where the owner did not supply a review timestamp, the record stores `enteredAt`, `timeBasis: decision-entry`, and null `ownerSuppliedReviewTimestamp`. Claim metadata uses `decisionEnteredAt` and `reviewTimeBasis: decision-entry` without inventing `reviewedAt`. Legacy supplied-date metadata remains valid. The human identity and explicit instruction remain required; AI research alone never grants verification.

Read-only checks: `node --import tsx scripts/validate-traffic-research.ts` preserves validation of the original immutable research-v1 handoff; `node --import tsx scripts/validate-traffic-finalization.ts` validates the component decision, exact verified-claim set, revision 2 narration and final owner gate. This historical finalization-v2 handoff required another explicit owner approval before any ProductionPlan; that gate is now completed by the exact editorial lock described below.

## Exact editorial lock and production candidate

`src/content-intelligence/editorial-lock.ts` records full owner approval of an already claim-reviewed package/asset state. It binds the reviewed Git commit, normalized package/asset/review/script hashes, every claim statement/status and exact verified selection. Approval replay changes only revision, editorial status and truthful decision-entry approval metadata. It cannot approve the rendered master, platforms or publication. The original supplied-date full-approval and narrower component-decision workflows remain intact.

Phantom Traffic uses [approved-v3](../content-intelligence/reviews/phantom-traffic-approved-v3/owner-decision.json) and [production-v1](../content-intelligence/reviews/phantom-traffic-production-v1/owner-review.md). Read-only validation: `node --import tsx scripts/validate-phantom-traffic.ts`; it checks the exact owner-reviewed commit, approval replay, package/asset/claim/caption/audio/production bindings and candidate receipts. Next gate is OWNER MASTER VISUAL REVIEW.

## Adaptive creative direction — future content

Future creative assistance is workflow.creative-direction v1, implemented in src/content-intelligence/creative-direction.ts and registered with the existing prompt/run architecture. It consumes approved verified package/asset and exact recent assets, proposes experience/treatments with rationale and convergence review, and cannot rewrite editorial truth or invent approval. No live/provider call or new content cycle is started. CREATIVE-DIRECTION.md owns companion storage, agent autonomy and significant owner-review gates; the existing topic CLI and live source-review pause remain unchanged.

## Cycle #2 longitude — bounded research/editorial proposal

The owner selected the longitude-clock finalist for research only after discovery commit `c122a3a158ffa33dd31463839e7654229acfb441`. `content-intelligence/reviews/longitude-clock-v1/selection.json` records the separate decision and exact immutable discovery binding; the original discovery's null selection is historical, not the current owner gate. The review bundle uses native KnowledgePackage, ContentAsset, ResearchWorkspaceDraft, hook proposals and ClaimReviewBundle schemas, with scoped registries rather than production registration. `source-inspections.json` distinguishes inspected body/targeted PDF evidence, failed archive access and unused leads; no AI summary or search snippet is claim evidence.

`claim-ledger.json` maps SUPPORTED/QUALIFIED to `supported`, EXCLUDED to rejected `unverified`, UNKNOWN to `uncertain`; VERIFIED requires explicit owner approval and is absent. An initial draft intake snapshot is reconstructed at preparation time and labeled as such, not presented as a chronological pre-inspection provider run. Manual session provenance and local canonical artifact hashes are recorded; no fabricated workflow envelope, provider response ID or token usage exists. `node --import tsx scripts/validate-longitude-research.ts` validates native bindings, ledger/hook coverage, numerical direction/error arithmetic, exact narration handoff, immutable discovery hash and review artifact integrity offline. Regression tests guard inaccessible evidence, stale claim wording, excluded/unknown selection, sign/unit errors and inferred approval.

Next gate is **AHMET — CYCLE #2 EDITORIAL REVIEW**. Conceptual VisualPlan remains an editorial proposal. Adaptive Creative Direction, ProductionPlan, captions, media generation and all platform work remain separately gated and unstarted. No historical or live-provider gate changes.

## Cycle #2 longitude — editorial finalization, no verification inferred

The owner accepted the bounded research direction/evidence basis and authorized editorial finalization only after `c957692f87d376d5cfef1377042df2314d4eb638`. `content-intelligence/reviews/longitude-clock-finalization-v2/owner-instruction.json` binds all original research bytes and records acceptance with labeled decision-entry time, explicitly false claim/narration/VisualPlan approval and no CreativeDirection/production authority. The prior scoped-owner-decision promotion helper is intentionally not applied: this instruction explicitly reserves claim verification for the next gate.

Revision-2 KnowledgePackage preserves all research values except revision; revision-2 ContentAsset selects eight still-supported statements through narration and/or visual intent. `owner-verification-queue.json` binds exact statements, canonical hashes, evidence/caveats and every script/visual use. Thirty-two reserve/excluded/uncertain statements keep original states; the native ClaimReviewBundle still accounts for all forty. `editorial-finalization.json` binds exact package/asset/review/script/VisualPlan/instruction/queue hashes and the lexical word-count/runtime estimate. `visual-comprehension-contract.json` specifies what each beat communicates, prohibits, keeps continuous and discloses, with no final treatment or timing.

Validate offline with `node --import tsx scripts/validate-longitude-finalization.ts`; it revalidates original research, native schemas/registries/review, unchanged evidence and states, exact pending owner queue, solar correction/simultaneity/east safeguards, conceptual scope and artifact integrity. Regression tests reject inferred verification, reserve edits, lost correction or simultaneity, reversed east, stale/incomplete queues, production timing, self-approval and stale final bindings. Next gate: **AHMET — CYCLE #2 FINAL EDITORIAL APPROVAL**. No creative or production workflow starts.

## Longitude Clock — editorial approval with creative-only authority

The explicit owner approval at `d22145a86d791730c0a2e5dd03558a8d968473b4` verifies eight exact queued statements and approves narration/VisualPlan/comprehension contract. `src/content-intelligence/creative-stage-approval.ts` provides a strict separate boundary because the older full editorial-lock helper also grants master production. It binds every statement and reviewed object, preserves the 32 reserve states, records labeled decision-entry time and promotes approved revision-3 snapshots without production permission. No historical schema/gate is weakened. Original ClaimReviewBundle remains historical proposed evidence, resolved by the separate owner decision rather than rewritten.

[Approved snapshots](../content-intelligence/reviews/longitude-clock-approved-v3/owner-review.md) feed the [asset-bound direction proposal](../content-intelligence/creative-directions/longitude-clock-time-to-position/owner-review.md). Validate using `node --import tsx scripts/validate-longitude-direction.ts`. Direction remains `proposal`, owner approval required; production, platform and publication remain unauthorized.

## Cycle #3 chocolate research milestone

The owner selected chocolate crystallization/tempering for bounded research only from discovery commit d002612. [Research/editorial handoff](../content-intelligence/reviews/chocolate-crystal-choice-v1/owner-review.md) and `pnpm exec tsx scripts/validate-chocolate-research.ts` validate scoped native review snapshots, source-access accounting, complete claim ledger/statement hashes, unapproved narration and conceptual VisualPlan. The initial ResearchWorkspace remains unverified; assessed package claims remain supported/unverified/uncertain, never owner-verified. Manual web research has provenance but no invented workflow envelope/provider usage. Original discovery selection remains null as historical evidence; separate selection records actual authorization.

Thirty supported/qualified claims, ten exclusions, two unknowns; nine proposed narration claims await owner verification. Form V alone is insufficient: fat-crystal network matters. Other failure modes are separated. Discovery bank/open-world eligibility remains intact. No CreativeDirection or production starts; exact gate **AHMET — CYCLE #3 EDITORIAL REVIEW**. The prior discovery validator is milestone-scoped; validate its immutable bundle with native discovery validation and parent byte comparison, rather than widening that historical scope gate.

## Cycle #3 chocolate editorial finalization

[Final review](../content-intelligence/reviews/chocolate-crystal-choice-finalization-v2/owner-review.md) preserves the preferred recipe hook and exact 80-word narration after removing seeding. Eight needed claims are owner-verified by the explicit finalization instruction; seeding and 33 other reserves/exclusions/unknowns retain their research state. Original research bytes/evidence/statements/hashes are unchanged. Overall package/asset remains review; no final narration/VisualPlan/creative/production approval inferred. Actual decision-entry time is labeled; no owner timestamp fabricated.

`node --import tsx scripts/validate-chocolate-finalization.ts` enforces owner scope, statement metadata, immutable research, exact final script/bindings/reserves, conceptual comprehension and repository scope. The original research validator retains every semantic check and delegates any later extension to this stronger finalization gate instead of rejecting authorized downstream review files. No gate is removed or bypassed. Native snapshots remain outside production registries. Exact gate: **AHMET — CYCLE #3 FINAL EDITORIAL APPROVAL**.

## Cycle #3 editorial approval and material-cutaway direction proposal

Ahmet explicitly approved the exact finalization-v2 80-word story/eight verified claims/VisualPlan/comprehension contract and authorized CreativeDirection only. [Approved snapshots](../content-intelligence/reviews/chocolate-crystal-choice-approved-v3/owner-review.md) are revision 3; already-verified claim reviews and 34 reserve states are unchanged. The owner decision binds exact source commit/files with actual decision-entry time, no supplied review timestamp. Native creative-stage decision schema records confirmation of existing verification; the new scoped validator preserves that metadata instead of re-verifying/retiming supported claims through the older promotion helper. No shared approval gate or schema is weakened.

[Direction handoff](../content-intelligence/creative-directions/chocolate-crystal-choice-same-recipe/owner-review.md) compares three materially different media and all eight prior stories; original 3D material cutaway is proposed for causal continuity, not renderer convenience. Primary af_heart, adaptive captions/sound and story-led duration intact. No production assets, plans, captions, generated audio or rendering. `node --import tsx scripts/validate-chocolate-direction.ts` validates exact approval/source/claim bindings, native direction schema, alternatives, convergence, scientific contracts and strict repository scope. Prior finalization semantics remain unchanged; its later-extension scope delegates to the stronger creative-stage owner/hash gate.

**AHMET — CYCLE #3 CREATIVE DIRECTION APPROVAL**. No main merge or production authorization.
