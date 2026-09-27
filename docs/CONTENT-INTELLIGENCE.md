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

## First real operator trial

The first new topic is `topic.wood-frog-freeze`: **How wood frogs survive being frozen**. It was selected because the stopped-heart/recovery contradiction is immediately understandable, the physical and chemical mechanism has strong visual potential, and peer-reviewed plus government sources can support a focused evergreen short.

The registered `wood-frog-freeze-tolerance` KnowledgePackage and its draft ContentAsset are real review material, not toy fixtures. They preserve:

- four retrieved source records: Journal of Experimental Biology, PLOS ONE, PubMed, and the U.S. National Park Service;
- seven claim records with evidence locations and population/experimental caveats;
- no `verified` claims and no human approval metadata;
- four genuinely distinct hook archetypes;
- a 32–40 second claim-linked script draft;
- platform-neutral narrative beats and timed visual intent.

The deterministic operator artifact is committed at `content-intelligence/runs/wood-frog-freeze-fixture-v1/`. `review.md` is the human entry point. The run proves serialization, validation, provenance, hashing, gates, and downstream shape without pretending that a paid model ran. Every workflow envelope truthfully records `provider: fixture` and awaits human review.

## Operator commands

Generate and validate the offline deterministic trial:

```bash
pnpm content:intelligence -- trial wood-frog-freeze --provider fixture \
  --output content-intelligence/runs/wood-frog-freeze-fixture-v1
pnpm content:intelligence -- validate wood-frog-freeze \
  --output content-intelligence/runs/wood-frog-freeze-fixture-v1
```

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

## Current human gates

Before this wood-frog draft can move to production, an owner/editor must:

1. inspect all four linked sources independently;
2. verify or revise each claim and its evidence locator;
3. confirm the stopped-heart/breathing wording against an appropriate primary source;
4. approve a hook, script, narrative, and visual plan;
5. review asset rights/provenance;
6. later approve final render, audio, captions, disclosures, platform preview, and public release.

## Intentionally unimplemented

- trend/search/social discovery adapters;
- automatic source discovery, crawling, PDF parsing, or package promotion;
- automatic human verification or approval;
- retries/caching for paid live calls;
- exact VideoSpec or Remotion generation from a visual plan;
- production rendering for the wood-frog draft;
- publishing or analytics APIs.

The main bottleneck exposed by the trial is now editorial verification and promotion, not another schema layer. The next slice should make that review/promotion procedure explicit and use it to approve or revise this real package before any production automation work.
