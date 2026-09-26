# Roadmap

## V1 — first Short and production foundation

- Strict TypeScript/React/Remotion project
- Reusable design, celestial, text, background, and timing primitives
- Structured video specification and independently inspectable scientific records
- Deterministic procedural visuals and original procedural sound design
- Preview, render, validation, snapshots, and contact sheet
- Video 001: Earth → Jupiter → Sun → Rigel → Betelgeuse

## Publishing ramp-up

- Week 1: publish 3 premium Shorts and validate the complete production workflow; long-form is not required yet.
- Week 2: publish 4 premium Shorts and 1 long-form video; demonstrate measurable reuse without quality loss.
- Weeks 3–4: target 5 premium Shorts and 1 premium long-form video per week.
- After Week 4: target 5 Shorts and 1 long-form video per week, approximately 24–26 total videos per month.

The detailed cadence, editorial roles, candidate topics, and quality guardrails are authoritative in `docs/STRATEGY.md`. The targets are conditional on quality and are not permission to publish filler.

## Near-term engineering work

- Complete Video 005 private platform review and use the first five releases to refine hook, pacing, and caption-safe composition.
- Add landscape/long-form composition patterns only when implementing the first long-form story.
- Refine primitives based on real authoring friction and audience results.
- Establish a repeatable metadata, private-review, caption, and release checklist.
- Use performance data once the sample is meaningful; preserve editorial judgment when data is sparse.

## Later, when evidence justifies it

- Alternate narration voices, multilingual audio, and dubbing experiments
- Dedicated thumbnail compositions and metadata assistance
- Research/storyboard automation with explicit human fact approval
- Private YouTube upload automation with a separate publish approval
- Analytics ingestion and rendering infrastructure

## Skills recommendation

Codex supports repository-local skills under `.agents/skills`. V1 deliberately does not add one: the research, storyboard, render, and QA workflows have each been exercised only once, so encoding them as agent skills would freeze premature assumptions. `AGENTS.md`, focused docs, and deterministic scripts are sufficient. Reconsider a minimal skill only after a workflow is repeated, stable, and benefits from an explicit trigger.
