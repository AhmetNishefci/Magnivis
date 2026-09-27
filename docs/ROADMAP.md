# Roadmap

This roadmap describes sequence, not promises or permission to sacrifice quality. `docs/PROJECT-STATE.md` records current execution state; `docs/ARCHITECTURE.md` records system boundaries.

## Phase 0 — audit and foundation (complete)

- Preserve the working Remotion production and QA system.
- Reconcile the original YouTube-only data model with the multi-platform knowledge-package strategy.
- Keep tests/builds healthy and configuration free of secrets.
- Establish clear durable strategy, architecture, editorial, research, and project-state documentation.

## Phase 1 — content intelligence (current)

- Knowledge Package V1, the eight pillars, timeliness, hook archetypes, claim verification states, and a deterministic registry are implemented.
- Video 004 is migrated without changing its rendered output.
- Content Asset V1 is implemented; one Speed of Light package now backs two distinct editorial assets, and Video 004 references its production-ready asset.
- Next work requires explicit approval: either migrate one additional researched package or introduce a minimal PlatformVariant boundary.
- Topic-score rationale and human research/story review workflows remain unimplemented.
- Add human review checks for sources, claims, hooks, script, and visual plan.
- Keep discovery/research manual or AI-assisted; do not require paid providers.

## Phase 2 — production

- Link scripts, narration, visual plans, assets, captions, renders, QA, provenance, and approximate production cost to a knowledge package.
- Generalize brand and format configuration only where existing authoring friction proves a need.
- Build long-form 16:9 patterns when the first approved long-form story enters production.

## Phase 3 — multi-platform distribution

- Define platform variants for YouTube Shorts, TikTok, Facebook Reels, and Instagram Reels.
- Begin with export manifests and manual posting checklists.
- Add official API adapters only after platform/account approval and operational need.
- Separate upload from public release; use idempotency and human approval for every external mutation.

## Phase 4 — analytics

- Store raw platform snapshots, metric definitions, observation windows, and provenance.
- Add explicit normalized/derived metrics only when formulas are defensible.
- Report topic, hook, pillar, format, platform, geography, and cost performance without hiding sample size or latency.

## Phase 5 — feedback loop

- Use historical first-party data to inform topic prioritization, format decisions, publishing time, and controlled experiments.
- Keep recommendations interpretable; do not introduce predictive ML before clean data and sufficient samples exist.

## Phase 6 — owned distribution

- Expose approved knowledge packages to a website/article pipeline.
- Add source-rich topic pages, search, SEO, related stories, and newsletter capture when justified.

## Phase 7 — monetization and scale

- Add revenue observations, sponsorship/affiliate workflows, and unit economics.
- Consider additional brands only after evidence shows one brand is operationally mature and audience segmentation requires it.

## Explicitly deferred

- Autonomous public publishing
- Databases, queues, cloud rendering, microservices, and dashboards before operational need
- A speculative provider framework or ML recommendation engine
- A multi-account content farm
- Monetization-account, residency, tax, or payment automation

## Skills recommendation

Codex supports repository-local skills under `.agents/skills`, but none is justified yet. The broadened workflow has not stabilized. Keep rules in `AGENTS.md`, focused documentation, typed schemas, and deterministic scripts; reconsider a minimal skill only after a repeated workflow is stable.
