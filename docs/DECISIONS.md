# Significant decisions

## 2026-09-22 — Remotion with typed content specifications

**Decision:** Use React/Remotion and strict TypeScript content modules validated by Zod.

**Reason:** The owner already works in TypeScript, Remotion provides deterministic frame-based rendering, and typed modules allow derived scientific comparisons without live services.

**Alternatives:** JSON/YAML (friendlier to non-code editing but weaker for derived values/refactors); a custom Canvas/WebGL engine (more control, much higher V1 cost).

**Consequences:** Content remains inspectable and separated, while composition choreography can be bespoke. A future CMS/import format can target the same schema.

## 2026-09-22 — Procedural 2D celestial art, no Three.js

**Decision:** Build deterministic SVG/CSS celestial bodies and star fields.

**Reason:** Video 001 depends on legible silhouette, surface character, glow, and extreme scale transitions—not free 3D camera movement. 2D rendering is faster, easier to tune, and reproducible.

**Alternatives:** Three.js/WebGL; external NASA textures; generated raster art.

**Consequences:** No external image license or GPU/WebGL dependency. Future stories can add 3D selectively without changing the data/composition boundary.

## 2026-09-22 — Original procedural V1 soundscape

**Decision:** Generate a deterministic layered WAV in-repository instead of sourcing music.

**Reason:** It provides intentional sound, zero copyright ambiguity, offline rendering, and modular replacement later.

**Alternatives:** Licensed library music; silence; temporary placeholders.

**Consequences:** The first mix is atmospheric rather than melodic and must receive human listening review. Narration remains independently addable.

## 2026-09-22 — No repository-local Codex skill in V1

**Decision:** Keep workflows in `AGENTS.md`, docs, and scripts until they have repeated and stabilized.

**Reason:** Codex supports `.agents/skills`, but a skill is most useful for a repeated stable workflow. V1 provides only one execution of each candidate workflow.

**Alternatives:** Immediately add research/render/QA skills.

**Consequences:** Less speculative agent machinery; reconsider after several videos expose genuine repetition.

