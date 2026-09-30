# Content Intelligence V1

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

Millennium Bridge reconstruction revision 1 is now explicitly owner-approved, with 18 verified scoped claims, eight source inspections, and exact revalidated historical copy. The original review snapshots remain preserved; current approved snapshots and exact editorial/decision bindings live beside them. Five Candidate 3 design replacements await separate owner design review. Use `pnpm content:intelligence -- review millennium-bridge` and `pnpm content:intelligence -- validate millennium-bridge`. These offline review/validate commands cannot promote, generate production, or invoke paid stages. The explicit `approve millennium-bridge --decision <file> --confirm-owner-approval` path records a real owner decision through the existing promotion mechanism; it never authorizes full video or platform activity. See `docs/RECOVERY.md` and `content-intelligence/reviews/millennium-bridge-reconstruction-v1/review.md`.

The surviving Wood Frog claim/editorial and exact-master gates have been completed; its platform packages still await private real-device review. Future work must:

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
- Millennium Bridge production and reported lost Meta Mobile QA reconstruction;
- publishing or analytics APIs.

The previous statement that Wood Frog production was unimplemented was stale relative to the surviving ProductionPlan/master chain. The current reconstruction bottleneck is owner review of the five exact Candidate 3 design replacements. Generic VisualPlan-to-Remotion automation remains premature.
