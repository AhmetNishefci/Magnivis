# Content Intelligence V1

Content Intelligence V1 is the implemented, provider-neutral upstream workflow between a discovered idea and Magnivis's existing KnowledgePackage/ContentAsset system. It assists editorial work without granting a model authority to verify facts or approve content.

## Implemented boundary

```text
manual TopicCandidate
  → AI-assisted TopicEvaluation draft
  → AI-assisted ResearchWorkspace draft
  → human source retrieval + claim review
  → approved KnowledgePackage
  → AI-assisted HookProposal batch
  → human hook promotion/selection
  → AI-assisted ContentAsset draft
  → human editorial approval
  → existing PlatformVariant / production / delivery path
```

The workflow deliberately does not convert an AI research draft directly into an approved KnowledgePackage. Source retrieval, claim comparison, caveat review, and verification remain explicit human gates.

## TopicCandidate

`src/content-intelligence/schema.ts` records a stable candidate ID, proposed package ID, title/question, discovery provenance, open taxonomy, timeliness, editorial hypotheses, status, and review metadata. Ratings are not stored on the candidate.

The evaluation workflow uses categorical `weak`, `mixed`, `strong`, or `unknown` assessments with rationale and uncertainty across curiosity, surprise, usefulness, visual/story potential, verifiability, originality, brand fit, short-form suitability, and long-form depth. It does not calculate a fake virality score.

`topic.speed-of-light` is the first registered candidate. It is explicitly retrospective: its original discovery date was not reconstructed.

## ResearchWorkspace

The research workspace separates source leads from claim candidates:

- a provider-proposed source is a lead with `reviewStatus: unreviewed`;
- a provider-proposed claim must have `verificationStatus: unverified` and no review metadata;
- every claim evidence reference must resolve to a source lead;
- claim IDs use the proposed KnowledgePackage namespace;
- open questions and conflicts remain visible.

The schema rejects model output that self-promotes a source or claim. A human must retrieve sources, confirm that they say what the claim asserts, compare credible evidence, record caveats, and deliberately create or update the KnowledgePackage.

Source leads intentionally do not carry a `retrieved` date. That field belongs to an actually inspected KnowledgePackage source and must not be fabricated by a model merely proposing a URL.

## Hooks and ContentAssets

Hook generation accepts only an approved KnowledgePackage and rejects proposals referencing anything except verified claims. Proposals are not silently inserted into the package. A human may review and promote a genuinely useful proposal into the package's durable hook collection.

ContentAsset drafting requires:

- an approved KnowledgePackage;
- verified selected claims;
- an existing package hook whose required claims are selected;
- locked package, hook, claim, and asset identities.

The returned asset must be an unapproved `draft`. Existing ContentAsset validation still enforces script-to-claim traceability, narrative coverage, visual references, and package relationships. A model cannot approve its own output.

## Provider architecture

`src/ai/provider.ts` defines the only current AI integration boundary. `generateStructured` sends a versioned workflow prompt to an `AIProvider`, validates the unknown output with Zod, and returns it with provenance:

- provider and model;
- generation timestamp;
- workflow and output-schema version;
- input references;
- optional token usage;
- optional estimated/actual cost.

No vendor SDK or live provider is installed. Tests use an in-memory deterministic fixture provider, so `pnpm check` is offline and credential-free. A future adapter receives both the stable output-schema ID and the Zod schema, may translate that schema into the provider's structured-output mechanism, and must still return unknown data for local validation. It must document environment variables in `.env.example` and never change the human approval rules.

## Prompt architecture

Versioned prompt workflows live in `src/content-intelligence/prompts.ts`:

- `workflow.topic-evaluation` v1;
- `workflow.research-workspace` v1;
- `workflow.hook-generation` v1;
- `workflow.content-asset-drafting` v1.

Each definition has a stable ID, version, output-schema ID, explicit system constraints, and one input serializer. Prompts are discoverable through a registry and tested. Research assistance, claim extraction, and conflict capture share the research-workspace boundary in V1; they should split only when real provider behavior proves that separate steps improve reliability.

## Intentionally manual or deferred

- trend/search/social discovery adapters;
- a live LLM provider and provider selection;
- automated URL retrieval or source-content storage;
- human claim-verification UI or transition CLI;
- automatic KnowledgePackage promotion;
- automatic hook promotion;
- exact VideoSpec/Remotion generation;
- provider retries, caching, and persisted workflow-run files.

The next provider experiment should run against a new, manually approved TopicCandidate and save every generated artifact for review before any package or asset is promoted.

## Production automation direction

ContentAsset visual plans already describe **what** should communicate each beat without frames or pixels. The next production slice should introduce a small scene-blueprint layer only after reviewing several new assets. It should map common visual intentions—typography, comparisons, diagrams, timelines, maps, charts, and callouts—to reusable Remotion primitives while retaining bespoke compositions for stories that need them.

Do not build a universal template engine before that evidence exists.

## Caption and audio direction

Approved narration text and cue timing should eventually generate caption drafts directly; transcription is unnecessary when the approved text already exists. Human timing/readability review remains required. PlatformVariant continues to decide external-track, platform-generated, burned-in, or no-caption behavior.

Future audio work should measure and document an integrated loudness/true-peak target before changing existing masters. Do not normalize published regressions opportunistically.
