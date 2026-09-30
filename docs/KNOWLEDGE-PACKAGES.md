# Knowledge packages

Knowledge Package V1 is the implemented editorial layer above production. It owns reusable knowledge and editorial intelligence; it does not own rendering, platform metadata, publication, analytics, or provider orchestration.

## Implemented model

`src/knowledge/schema.ts` validates:

- stable package ID and positive integer revision;
- topic, central question, thesis, and viewer payoff;
- an open-ended taxonomy containing one broad analytics pillar plus normalized domains and topics;
- `evergreen`, `trend-assisted`, or `timely` classification;
- traceable sources and quantitative/qualitative claims;
- package caveats, hook variants, narrative opportunities, and visual opportunities;
- related questions and follow-up opportunities;
- editorial status and approval metadata.

`src/knowledge/registry.ts` validates packages again at registration, rejects duplicate package IDs, provides deterministic sorted lookup, indexes reusable sources, and rejects conflicting records that reuse one global source ID.

Source records may preserve an exact publication date or a truthful month/year label, authors and stable identifiers such as DOI or PMID in addition to organization, title, type, URL and retrieval date. Do not invent a day when a source exposes only month/year. These identity fields improve auditability; they do not prove that the source supports a particular claim. Claim-level evidence still needs an exact locator and assessment.

## Claim types

A quantitative claim has a structured quantity, free-form unit, precision (`exact`, `rounded`, or `approximate`), evidential basis, and display value. A quantity is either a scalar or a bounded range. Scalars may record a positive symmetric `plusMinus` uncertainty and an optional confidence description. Ranges require a maximum greater than the minimum. Numeric values are not restricted to positive values because legitimate subjects may require zero or negative quantities.

Precision and verification answer different questions. `approximate` describes how the number should be interpreted; `verified` describes whether the scoped claim, including that approximation or range, passed editorial verification. A well-supported conventional range can therefore be verified without becoming falsely exact.

A qualitative claim has no numeric payload. Both types require a human-readable statement, one or more evidence references with notes, a verification status, caveats, and review metadata when verified.

## Verification semantics

- `unverified`: recorded for investigation but not yet evaluated against adequate evidence.
- `supported`: at least one relevant credible source supports the statement, but the full editorial verification step—such as corroboration, derivation checking, scope review, or explicit human sign-off—is incomplete.
- `conflicting`: credible evidence materially disagrees; the disagreement must be represented rather than silently resolved.
- `uncertain`: evidence is incomplete, estimated, model-dependent, volatile, or otherwise unable to justify a settled statement.
- `verified`: the cited evidence has been traced to the statement, important scope/derivations have been checked, caveats are recorded, and review metadata identifies human editorial review.

`verified` does not mean metaphysical certainty. It means the claim passed the defined editorial verification process. A material `supported` claim must not be relabeled `verified` merely because its wording sounds plausible.

An approved package may include `uncertain` or `conflicting` claims only when the uncertainty or disagreement is part of the approved story and is communicated honestly. Package approval does not overwrite claim status.

For the Wood Frog trial, `src/content-intelligence/claim-review.ts` implements the first explicit review/promotion boundary. An AI-assisted `ClaimReviewBundle` may recommend verification, revision or rejection, but it cannot supply human authority. The owner decision binds to exact claim-statement hashes and requires reviewer identity/time plus explicit decisions. Promotion rejects stale wording, uncertain claims approved without a revised evidence review, rejected claims in an approved asset, and hooks that depend on rejected claims. See `docs/CONTENT-INTELLIGENCE.md`.

## IDs and traceability

- Package IDs use stable slugs such as `speed-of-light`.
- Claim IDs are package-namespaced, such as `speed-of-light.claim.vacuum-speed`.
- Hook IDs are package-namespaced, such as `speed-of-light.hook.impossible-laps`.
- Source IDs use a global `source.*` namespace so the same authoritative record can be reused across packages without collision.
- Every claim evidence reference must resolve to a source in its package.
- Every caveat, hook, narrative opportunity, and visual opportunity claim reference must resolve within the package.

## Taxonomy semantics

`taxonomy.pillar` is one of seven intentionally broad, stable groupings: `human-life`, `society-culture`, `science-reality`, `earth-nature`, `history-stories`, `technology-built-world`, or `interdisciplinary`. A pillar supports coarse portfolio reporting; it is not editorial permission and does not define Magnivis's subject limits.

`taxonomy.domains` and `taxonomy.topics` are unique normalized lowercase slugs. They are deliberately open-ended, so a package about philosophy, medicine, biology, film analysis, or an unforeseen legitimate field does not require an enum change. Multiple domains represent cross-disciplinary work naturally. Use specific, meaningful terms rather than synonyms added merely to inflate metadata. The canonical discover-first/classify-second policy is in `docs/STRATEGY.md`.

## Relationship to content assets and video production

KnowledgePackage is the reusable research source. ContentAsset selects one editorial angle, package hook, and subset of claims, then adds a traceable script, narrative structure, visual intent, and narration direction. See `docs/CONTENT-ASSETS.md`.

`VideoSpec` is the concrete production representation. A video uses exactly one of:

- legacy `factIds`, for productions not yet migrated; or
- `contentAssetId`, for a migrated production without a platform adaptation; or
- `platformVariantId`, when a concrete production implements a platform adaptation.

Video 002 references its production ContentAsset. Video 004 references its YouTube Shorts PlatformVariant, which references its production ContentAsset. Their packages remain the source of truth for sources and claims. `src/data/ocean.ts` and `src/data/light.ts` are narrow compatibility projections that convert package claims into the existing numeric inputs consumed by unchanged compositions. They contain no duplicated factual values.

The editorial script belongs to ContentAsset. Exact scene timing, narration files and cue starts, sound, and composition choreography remain production concerns in `VideoSpec` and Remotion. Platform packaging, caption behavior, duration constraints, cover intent, and safe-area selection belong to PlatformVariant. Actual publication is a separate implemented file-backed boundary (OPERATIONS.md); legacy VideoSpec fields remain until a bounded migration is approved.

## Adding the next package

1. Create `src/knowledge/packages/<package-id>.ts` and parse the production object with `knowledgePackageSchema`.
2. Reuse stable global source IDs when the exact source record already exists; never reuse an ID for different source metadata.
3. Add claim evidence and caveats, then assign verification states according to this document.
4. Add genuinely different hook archetypes and claim-linked narrative/visual opportunities.
5. Register the package in `src/knowledge/registry.ts`.
6. Create and register a ContentAsset that selects the package hook and claims.
7. Create/register a PlatformVariant when platform adaptation is in scope; otherwise link through `VideoSpec.contentAssetId`. A production implementing a variant links through `VideoSpec.platformVariantId`. Remove duplicated legacy fact IDs for that video.
8. If the existing composition still requires the legacy fact shape, derive it in a narrow compatibility projection.
9. Add schema, registry, reference, and production-regression tests.
10. Update `docs/PROJECT-STATE.md` and relevant research notes.

## Intentionally unimplemented

- Automatic owner approval or unsupervised package promotion
- Topic scoring and discovery automation
- Publishing adapters and automatic analytics ingestion
- Databases, queues, workers, APIs, dashboards, or CMS

These remain planned boundaries, not implemented features.

## Component claim approval without a supplied review date

For traffic waves, an explicit owner decision approved six exact narration claims while leaving final wording and the complete editorial package pending. The native scoped-decision boundary promotes only those claims and records an explicit decision-entry timestamp. Claim review metadata may use `decisionEnteredAt` with `reviewTimeBasis: decision-entry` when no owner review date was supplied; it must not also pretend that entry time is a supplied `reviewedAt`. Existing human supplied-date records remain unchanged. The package remains `review` and has no full approval metadata. Deferred reserve claims remain `supported`; excluded formulations remain unverified and rejected. Exact-state bindings and tests prevent approval being transferred to changed evidence or wording.
