# Knowledge packages

Knowledge Package V1 is the implemented editorial layer above production. It owns reusable knowledge and editorial intelligence; it does not own rendering, platform metadata, publication, analytics, or provider orchestration.

## Implemented model

`src/knowledge/schema.ts` validates:

- stable package ID and positive integer revision;
- topic, central question, thesis, and viewer payoff;
- one of the eight approved content pillars;
- `evergreen`, `trend-assisted`, or `timely` classification;
- traceable sources and quantitative/qualitative claims;
- package caveats, hook variants, narrative opportunities, and visual opportunities;
- related questions and follow-up opportunities;
- editorial status and approval metadata.

`src/knowledge/registry.ts` validates packages again at registration, rejects duplicate package IDs, provides deterministic sorted lookup, indexes reusable sources, and rejects conflicting records that reuse one global source ID.

## Claim types

A quantitative claim has a structured numeric value, free-form unit, precision (`exact`, `rounded`, or `approximate`), evidential basis, and display value. Numeric values are not restricted to positive values because future topics may legitimately require zero or negative quantities.

A qualitative claim has no numeric payload. Both types require a human-readable statement, one or more evidence references with notes, a verification status, caveats, and review metadata when verified.

## Verification semantics

- `unverified`: recorded for investigation but not yet evaluated against adequate evidence.
- `supported`: at least one relevant credible source supports the statement, but the full editorial verification step—such as corroboration, derivation checking, scope review, or explicit human sign-off—is incomplete.
- `conflicting`: credible evidence materially disagrees; the disagreement must be represented rather than silently resolved.
- `uncertain`: evidence is incomplete, estimated, model-dependent, volatile, or otherwise unable to justify a settled statement.
- `verified`: the cited evidence has been traced to the statement, important scope/derivations have been checked, caveats are recorded, and review metadata identifies human editorial review.

`verified` does not mean metaphysical certainty. It means the claim passed the defined editorial verification process. A material `supported` claim must not be relabeled `verified` merely because its wording sounds plausible.

An approved package may include `uncertain` or `conflicting` claims only when the uncertainty or disagreement is part of the approved story and is communicated honestly. Package approval does not overwrite claim status.

## IDs and traceability

- Package IDs use stable slugs such as `speed-of-light`.
- Claim IDs are package-namespaced, such as `speed-of-light.claim.vacuum-speed`.
- Hook IDs are package-namespaced, such as `speed-of-light.hook.impossible-laps`.
- Source IDs use a global `source.*` namespace so the same authoritative record can be reused across packages without collision.
- Every claim evidence reference must resolve to a source in its package.
- Every caveat, hook, narrative opportunity, and visual opportunity claim reference must resolve within the package.

## Relationship to video production

`VideoSpec` is the current concrete content-asset model. A video uses exactly one of:

- legacy `factIds`, for productions not yet migrated; or
- `knowledge`, containing a package ID, selected claim IDs, and selected hook ID.

Video 004, `speed-of-light`, is the first migrated asset. Its package is the source of truth for sources and claims. `src/data/light.ts` is a temporary compatibility projection that converts package quantitative claims into the legacy fact shape consumed by the unchanged composition. It contains no duplicated factual values.

The script, scene timing, narration, captions, sound, publication record, composition choreography, and platform behavior remain production concerns in `VideoSpec` and the Remotion composition.

## Adding the next package

1. Create `src/knowledge/packages/<package-id>.ts` and parse the production object with `knowledgePackageSchema`.
2. Reuse stable global source IDs when the exact source record already exists; never reuse an ID for different source metadata.
3. Add claim evidence and caveats, then assign verification states according to this document.
4. Add genuinely different hook archetypes and claim-linked narrative/visual opportunities.
5. Register the package in `src/knowledge/registry.ts`.
6. Link the downstream video through `VideoSpec.knowledge`; remove duplicated legacy fact IDs for that video.
7. If the existing composition still requires the legacy fact shape, derive it in a narrow compatibility projection.
8. Add schema, registry, reference, and production-regression tests.
9. Update `docs/PROJECT-STATE.md` and relevant research notes.

## Intentionally unimplemented

- A generic `ContentAsset` schema beyond the current `VideoSpec`
- Editorial transition commands or workflow automation
- Topic scoring and discovery automation
- Platform variants and publishing records
- Analytics and cost records
- Databases, queues, workers, APIs, dashboards, CMS, or provider abstractions

These remain planned boundaries, not implemented features.
