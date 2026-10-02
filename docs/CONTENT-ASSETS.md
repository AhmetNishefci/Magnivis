> Current prospective orchestration and two-gate authority: [WORKFLOW-V3](WORKFLOW-V3.md). Current machine state: [project-state](../workflow/project-state.json). Dated milestones below retain their historical meaning; V3 does not reapprove or rewrite them.

# Content assets

Content Asset V1 is the implemented platform-neutral editorial layer between reusable knowledge and production. It answers **what this specific story communicates**. It does not own research, exact Remotion choreography, platform adaptation, publication, or analytics.

## Domain boundary

```text
KnowledgePackage
  reusable sources, claims, evidence, caveats, hook opportunities
        ↓
ContentAsset
  selected angle, hook, claims, script, narrative and visual intent
        ↓
ProductionPlan (when implemented)
  source-locked frame allocation and implementation intent
        ↓
PlatformVariant
  platform-specific adaptation, metadata, safe areas and CTA
        ↓
VideoSpec + Remotion
  exact format, frames, timing, coordinates, audio files and choreography
        ↓
PublicationRecord (after a human publishes)
  exact artifact, account, settings, remote identity and publication state
```

PlatformVariant V1 is implemented for the production Speed of Light asset. The file-backed PublicationRecord boundary is also implemented for manually completed publication, but no uploader or publishing API exists. See `docs/PLATFORM-VARIANTS.md` and `docs/OPERATIONS.md`.

## Implemented schema

`src/content-assets/schema.ts` validates:

- stable asset ID, positive revision, and KnowledgePackage ID;
- `short-form-video` or `long-form-video` asset type;
- editorial purpose, story angle, selected package hook and selected claims;
- an editorial duration range, which is guidance rather than platform metadata;
- ordered factual/editorial script segments;
- ordered narrative beats independent of frame timing;
- a structured visual plan;
- an optional platform-neutral narration plan;
- editorial status and approval metadata.

Content Asset V1 intentionally does not support articles or newsletters. Those types should be added only when a real asset needs them.

## Script-to-claim traceability

Script segments are deliberately small and explicit:

- `factual` segments require one or more selected KnowledgePackage claim IDs;
- `editorial` segments contain connective, interpretive, or rhetorical language and cannot carry claim IDs.

Only material factual assertions require annotations. The schema rejects factual references outside the asset's selected claims. The registry then verifies every selected claim against the referenced KnowledgePackage.

Every script segment belongs to exactly one narrative beat. Narrative beats describe editorial function and order, not exact seconds or frames.

## Hook ownership

The KnowledgePackage owns reusable hook identity, archetype, text, viewer promise, and supporting claims. A ContentAsset selects one package hook by ID and must select every claim required by that hook.

The asset does not copy or redefine the hook identity. Its opening script segment may derive the package hook text directly, as both Speed of Light assets do. If a new hook represents a reusable way into the topic, add it to the KnowledgePackage after claim review. Minor one-off delivery wording belongs in the asset script, not in a competing hook record.

## Visual plan

Each visual-plan item records:

- the narrative beat it serves;
- its communication objective;
- a platform-neutral visual type;
- associated script segments and claims where relevant;
- optional accuracy, provenance, or production notes.

Supported V1 visual types are footage, diagram, animation, map, chart, generated visual, motion typography, and archival/public-domain material. The plan does not select actual licensed files, coordinates, frames, animation parameters, or generation providers.

## Production assets

`speed-of-light.asset.earth-to-proxima` represents published Video 004. Its exact narration text is consumed by `VideoSpec`, while files, cue starts, scenes, format, and Remotion choreography remain production concerns. Four PlatformVariants adapt its packaging and delivery intent; the YouTube variant is the production reference used by Video 004.

`speed-of-light.asset.cosmic-distance` is a second, unproduced draft from the same package. It asks why light still takes years to reach the nearest neighboring star, explains a light-year as distance, and resolves the story with the scale of space. It deliberately omits the published asset's Earth-lap and Moon progression.

`ocean-depth.asset.everest-descent` represents published Video 002. It traces six factual narration segments to Ocean Depth claims while treating the Everest placement instruction as editorial. Its visual plan records that the 200- and 1,000-metre light-zone boundaries are conventional and that “total darkness” means no surface sunlight, not absence of bioluminescence.

`wood-frog-freeze-tolerance.asset.how-freezing-works` revision 2 is the first owner-approved asset to feed a typed ProductionPlan. Its script, narrative structure and VisualPlan remain editorial source-of-truth; `production-plan.wood-frog-freeze.v1` adds frame allocation and implementation intent without moving choreography into the asset. The uncertain circulation-cessation claim remains excluded.

`src/content-assets/registry.ts` validates the registered assets, rejects duplicate IDs, validates package/claim/hook references, enforces hook-claim selection, and returns deterministic sorted results.

## Adding another asset

1. Confirm the KnowledgePackage contains the verified claims and reusable hook needed by the angle.
2. Create the asset in `src/content-assets/assets/` and parse it with `contentAssetSchema`.
3. Select only claims the script or visual plan actually uses.
4. Mark material factual script segments and attach their claim IDs; leave connective language editorial.
5. Describe narrative beats without frame timing.
6. Describe visual objectives without production choreography or platform packaging.
7. Register the asset and add schema/reference tests.
8. Create a PlatformVariant when a destination-specific adaptation is required. Reference that variant from the VideoSpec implementing it; otherwise a direct ContentAsset reference remains valid. Retain regression coverage.

## Intentionally unimplemented

- Article and newsletter asset types
- automatic PublicationRecord creation and publishing APIs
- Editorial transition commands or workflow automation
- Asset sourcing/generation automation
- Databases, queues, workers, services, CMS, dashboards, or analytics ingestion

These are planned boundaries, not implemented features.

## Traffic-waves editorial proposal

`phantom-traffic.asset.backward-wave` revision 3 is **approved**, backed by approved `phantom-traffic` revision 3. Ahmet approved the exact revision 2 finalized state at commit `21c3a5539cf02b1c4a88b8ff89aca0139a7ec079`; [the editorial lock](../content-intelligence/reviews/phantom-traffic-approved-v3/owner-decision.json) binds its exact hashes and records decision-entry time rather than an invented owner date. Script, six verified claims, caveats, beats and conceptual VisualPlan remain unchanged. ProductionPlan/CaptionPlan and one master candidate now exist under explicit owner authorization; the exact rendered master is now owner-approved, with real-device platform review pending. Historical research-v1/finalization-v2 handoffs retain their original states. Editorial approval never grants platform or publication approval.

## Adaptive creative direction — future content

Future creative direction is a first-class companion owned by the ContentAsset responsibility, bound to exact package/asset/script hashes. It records experience, story-specific treatment rationale and recent-content convergence review without modifying the approved asset. ProductionPlan references its exact revision/hash. Bespoke and hybrid VisualPlan intents are permitted; no domain-to-medium rules. See CREATIVE-DIRECTION.md. Phantom Traffic is now master-approved under its exact separate decision; earlier candidate-only paragraphs describe historical stages, not the current gate.

## Longitude Clock — editorial approval with creative-only authority

The explicit owner approval at `d22145a86d791730c0a2e5dd03558a8d968473b4` verifies eight exact queued statements and approves narration/VisualPlan/comprehension contract. `src/content-intelligence/creative-stage-approval.ts` provides a strict separate boundary because the older full editorial-lock helper also grants master production. It binds every statement and reviewed object, preserves the 32 reserve states, records labeled decision-entry time and promotes approved revision-3 snapshots without production permission. No historical schema/gate is weakened. Original ClaimReviewBundle remains historical proposed evidence, resolved by the separate owner decision rather than rewritten.

[Approved snapshots](../content-intelligence/reviews/longitude-clock-approved-v3/owner-review.md) feed the [asset-bound direction proposal](../content-intelligence/creative-directions/longitude-clock-time-to-position/owner-review.md). Validate using `node --import tsx scripts/validate-longitude-direction.ts`. Direction remains `proposal`, owner approval required; production, platform and publication remain unauthorized.
