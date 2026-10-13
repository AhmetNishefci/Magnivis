# Manual analytics evidence and creative learning

This additive guide describes the bounded offline CSV intake implemented on 2026-10-11. STRATEGY and WORKFLOW-V3 retain editorial/workflow authority. OPERATIONS/PERFORMANCE and other dated records remain exact historical evidence where their bytes are bound. Current project metadata points to the latest review.

The first integrated batch is [analytics-intake-2026-10-11-v1](../content-intelligence/operations/analytics-intake-2026-10-11-v1/manifest.json), with its [V2 owner review](../content-intelligence/reviews/first-cross-platform-analytics-v2/owner-review.md). The original V1 report is unchanged. Native CSV cells are verified against supplied files; audience hypotheses and owner-reported TikTok observations remain separate.

## Prepare a future batch

Use a new dated/versioned directory under `content-intelligence/operations/`; preserve original CSV bytes once in its `sources/` folder. Inspect files before creating the manifest. Record original filenames, owner handoff path/method, byte counts/SHA-256, actual headers/order/counts, account context, capture/export times and timezone **only when known**, and metric windows independently of filename/content-selection range. Do not use filesystem timestamps or record-entry time as capture time.

The current importer supports the five inspected export layouts: YouTube `Table data.csv`, `Chart data.csv`, `Totals.csv`; Instagram post export; Facebook video export. It is a bounded adapter, not a universal analytics framework. A future batch of these layouts can use the same source IDs and manifest shape with its own hashes, counts, header list, dates and mappings. A different shape or incomplete set needs a focused reviewed adaptation; unknown columns fail rather than silently becoming counts. Record-count/schema changes alone are not errors when actually inspected and explicitly recorded in the new manifest.

Preserve CSV IDs as strings. Logical record numbers include header record1; descriptions can span physical lines. Native blanks mean absent, not zero. Duration, percentages, counts and clock-formatted AVD have distinct units. `Date=Lifetime` overrides any assumption that a Meta filename range represents metric accrual. YouTube daily selected-series charts do not automatically cover all video rows. Do not add channel totals, post totals and daily observations together.

Author a mapping companion with a disposition for every post row. Prefer exact platform/account/post ID or permalink/shortcode plus timestamp corroboration. Existing `PublicationRecord` matches stay distinct from legacy-ID matches, candidate story/production associations and unassigned rows. Keep prepared-release/variant/media references as candidates until upload identity is established. A Facebook Video asset ID is not automatically its Reel post ID. No matching exercise changes release authority, journals or historical publications.

Create an intake baseline binding the previous review and relevant historical evidence. The manifest binds raw files, mappings, prior review and baseline through the existing repository-relative hash reader. Preserve the earlier report in place; append a separately versioned successor with explicit confirmations/corrections and limitations. Raw source changes, mapping corrections and later captures get a new batch/version; do not rehash old sources in place.

## Reproduce and validate

Use supported Node20.19–22 and the repository's pinned pnpm. For the first batch:

```sh
pnpm exec tsx scripts/analytics.ts write content-intelligence/operations/analytics-intake-2026-10-11-v1/manifest.json
pnpm exec tsx scripts/analytics.ts verify content-intelligence/operations/analytics-intake-2026-10-11-v1/manifest.json
pnpm exec tsx scripts/analytics.ts context content-intelligence/operations/analytics-intake-2026-10-11-v1/manifest.json
pnpm check
pnpm artifacts:durable
```

`write` deterministically creates `parsed.json`; an identical rerun succeeds, and an existing different output is rejected. `verify` rebuilds from source bytes and compares the complete stored observations/calculations. It checks source hashes/bytes, schema and count, quoting/multiline fields, dates, numeric precision, units, identities, mapping coverage and exact existing publication matches. Totals discrepancies become visible warnings, not invented rows or silently “fixed” metrics. Do not claim reconciliation passed merely because parsing passed; inspect warnings.

Parsed records preserve every original cell, logical/physical locators, normalized native metrics, date/window/capture uncertainty, mapping and source hash. Calculations exclude native aggregate rows from post sums and retain formula/input-cell references. Review-specific shares, differences and extrema remain in the separately source-bound `analysis.json`, with an independent arithmetic audit. No cross-platform normalized “view” or quality score is created. Retention families retain literal native values and absent cells; coordinate/denominator interpretation requires actual source documentation/UI evidence.

New intake files are ordinary file-backed review evidence, not production media. Historical durable-artifact validation remains unchanged; passing it does not automatically register new CSVs for external backup. The batch has SHA-256-bound source evidence but no commit, remote backup or clean-machine restore is claimed until separately performed and verified.

## Use evidence in existing Content Intelligence

`context` verifies the original files and bound context before returning six interpretable observations/hypotheses for this first batch. `src/content-intelligence/performance-context.ts` is a read-only session adapter. It does not change prompts, call providers, start discovery, rank topics, add owner gates, or modify `editorial-learning.ts`.

For future **authorized** discovery, consult the current source-bound context before comparison. Reference its exact bytes through existing `historyReviewed`/comparison prose where appropriate; explain how a story property applies and what does not generalize. Revisit the relevant context during approved direction/production alongside prior master revision decisions. Premise decisions, production corrections, measured audience observations, external benchmarks and experiments answer different questions; do not merge them into a taste score.

The first batch uses verified-source observations, multiple production observations, plausible unconfirmed audience hypotheses and creative experiments. Contextual signal strength remains weak and maturity unknown; causality and style-copy permission are explicitly false. Owner review is pending. A historical production defect can justify a practical prevention lesson without establishing an audience effect. An observed save concentration cannot establish a preferred domain or exact visual treatment.

`MetricSnapshot` still requires an actual ISO capture instant, a real publication linkage and exact timestamps for non-lifetime windows. These prerequisites are unavailable in the first batch. Parsed native-export evidence is therefore durably ingested with **zero strict MetricSnapshots and zero validated LearningSignals**; it is not a second relaxed publication or snapshot registry. Date-only/unknown information remains honest intake evidence.

When prerequisites are supplied, preserve that new evidence and deliberately create eligible snapshots using the existing schemas/registry. Use `validateLearningSignal` with real hash-bound snapshots; strong audience signals still require mature supported observations. Do not substitute intake-entry time, guessed midnight, scheduled dates or candidate media identity. Propose a small compatible schema extension only if actual repeated intake demonstrates the need; no broad analytics architecture is approved by this guide.

Experiment through existing review records: identify one changed property, same-question internal comparison when practical, comprehension guardrails, exact native outcome/denominator/window and confounders. Compare within platform at appropriate ages; retain sample size and distribution. No fixed duration, domain quotas, compulsory music/3D, algorithm rule or historical rerender follows from this batch.

The next gate is owner review of the V2 evidence integration. Cycle #12 requires separate start authority. All exact-master and publication gates remain mandatory; no command here uploads, schedules or alters live content.
