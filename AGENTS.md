# Magnivis agent guide

Magnivis is a premium, faceless, English-language knowledge-media brand: **See the unimaginable.** Every published asset should help the viewer understand something fascinating or useful that they did not understand before. The repository is the durable source of truth; do not rely on context from earlier chats.

Current prospective workflow/gate authority: `docs/WORKFLOW-V3.md`. Project metadata: `workflow/project-state.json`; independent cycle journals at `workflow/cycles/` own state; `scripts/cycle.ts status` exposes the backlog and owner queues; historical milestone reports are evidence, not current continuation instructions. No new cycle starts without explicit cycle-start authority.

## Before changing anything

1. Inspect Git status, the current implementation, and recent history.
2. Read `workflow/project-state.json` and `docs/WORKFLOW-V3.md`, then the policy relevant to the task. Consult `docs/PROJECT-STATE.md` and dated handoffs for historical evidence when needed.
3. Reconcile code/documentation discrepancies explicitly.

## Permanent rules

- Every meaningful production correction must improve the current artifact and, when reusable, the existing production system. Before direction/production, read relevant prior master revision decisions in the cycle journals (premise-learning context alone is insufficient) and apply transferable lessons without copying a style. Before master handoff, perform the separate rendered-sequence editorial review in `docs/PRODUCTION-PLANS.md`; technical QA does not certify creative quality. Recurring owner corrections require evidence-based investigation and the smallest canonical process correction. Preserve exact feedback, application, actions and inspection limits in existing cycle evidence.
- Magnivis is a brand, not a video template. Preserve evidence-first, premium, clear knowledge storytelling; choose execution per story. `docs/CREATIVE-DIRECTION.md` owns brand constants versus adaptive variables, the asset-bound direction stage and convergence review. Before prospective readiness, inspect a bounded recent approved-master set and its overall feed impression; distinguish story/brand continuity from convenience-driven convergence, which requires internal alternative exploration. Similarity is allowed; forced visual diversity, alternation, style whitelists and numeric diversity authority are not goals. Historical videos are precedents, never automatic palettes/caption styles. Current primary narrator is Kokoro `af_heart` by explicit brand policy; material narrator deviations need rationale, and domain changes alone do not justify auditions. Soundscape, music/silence, visuals and captions remain independently adaptive; duration is story-led, never padded solely for monetization. Future ProductionPlans require a hash-bound direction; approved historical media remains unchanged.
- Magnivis is an open-ended curiosity and understanding brand: help viewers understand something fascinating or useful every day. **Discover first, classify second.** High-level pillars organize the portfolio; they are never a whitelist. Science, history, human behavior, philosophy, practical life skills, business, money, culture, and future legitimate domains all fit when treated as credible explanation—not generic motivation, shallow self-help, or advice spam. `docs/STRATEGY.md` owns the topic-universe rules.
- Treat a verified knowledge package—not a finished video—as the durable editorial unit. Platform assets should reference that package and adapt it without silently changing its claims.
- Model-proposed sources/claims remain unreviewed/unverified until actual evidence inspection. `docs/WORKFLOW-V3.md` owns prospective internal editorial verification and the prospective three normal human gates: premise review before full development/production, exact master review and publication authorization (historical cycles retain original gates). Internal readiness never impersonates owner approval.
- Keep AI providers behind the repository interface in `src/ai/`; validate structured output and preserve workflow/model/usage provenance. Do not scatter vendor SDK calls through domain code or make normal validation depend on credentials.
- Treat `content-intelligence/runs/*/review.md` as an operator handoff, not approval. Workflow envelopes are hashed audit records; regenerate them through `pnpm content:intelligence`, never edit hashes by hand. Historical live-stage pauses remain historical; prospective cycles follow `docs/WORKFLOW-V3.md`.
- Recovery checkpoint is through Wood Frog at ae79799. Preserve original editorial/claim/visual approvals and circulation-cessation exclusion. Missing historical master and accepted operational replacement are separate identities; use PROJECT-STATE.md and artifacts/recovery-decision.json. Recovery is CLOSED. No Bridge work or external upload/publication is authorized. New content work requires current explicit owner authorization; Phantom Traffic is owner-reported published and operationally closed; Longitude and Chocolate are owner-reported scheduled, with actual publication unknown. `workflow/project-state.json` indexes evidence. Restore exact manifest bytes; never silently regenerate or transfer approval.
- Distinguish content master, platform variant and presentation surface. Desktop/local QA cannot prove mobile safety. Follow PLATFORM-QA.md for covers, captions, versioned profiles and real-device evidence; never invent Meta crop geometry or missing publication metadata.
- All new Magnivis short-form productions use designed burned-in captions as part of the creative master. Their presentation is speech-first: favor natural spoken phrase boundaries over literal prose typography while preserving approved wording, meaning, provenance, and meaningful punctuation. Platform-native or external caption tracks remain optional accessibility artifacts and never substitute for the designed layer. Follow `docs/CAPTIONS.md`; do not retroactively regenerate approved legacy media without authorization.
- Keep video content/data separate from reusable rendering primitives. Avoid one-off monoliths and premature generic frameworks.
- Verify material claims against appropriate authoritative sources. Preserve claim-level evidence, status, caveats, URLs, and retrieval dates. Never fabricate citations or imply uncertain evidence is settled.
- Use only original, public-domain, CC0, or appropriately licensed assets. Update `docs/ASSET-LICENSES.md` for every production asset.
- Keep audio/narration modular. A silent concept must not hardwire the architecture to silence.
- Do not add databases, queues, cloud infrastructure, dashboards, publishing automation, or paid APIs without a current need and human approval.
- Never upload or publish to any platform without explicit human approval. Publishing credentials and public-release operations are sensitive.
- Treat generated delivery packages as hashed operator handoffs. Do not mark a review package publishable unless its registered PlatformVariant is `production-ready`; package generation never grants publication approval.
- At AHMET — PUBLICATION REVIEW / AUTHORIZATION, include complete ready-to-use manual instructions directly in the response for every platform, in upload order; package links alone are insufficient. Follow the owner-facing publication instructions in `docs/DELIVERY-PACKAGES.md`. Extract exact canonical copy/assets, distinguish packaged recommendations from live settings, and mark absent values/additions as proposals for owner review without silently changing packages or granting publication authority.
- Keep raw platform analytics and platform-specific definitions; never present incomparable metrics as normalized equivalents.
- Never commit secrets, credentials, personal data, or generated `.env` files. Use environment variables and maintain `.env.example`.
- Avoid destructive commands and history rewrites. Never force-push. Preserve unrelated work.
- Favor strict, maintainable TypeScript and deterministic rendering. Update decision/docs when architecture or product direction changes.
- Before completion, run `pnpm check`; for visual changes also render at least a smoke segment, and for releases render the full video plus `pnpm qa <video-id>` and inspect the contact sheet.

## Navigation

- Current status: `docs/PROJECT-STATE.md`
- System boundaries and target architecture: `docs/ARCHITECTURE.md`
- AI-assisted topic, research, hook, and asset drafting: `docs/CONTENT-INTELLIGENCE.md`
- Nonsecret accounts, publications, settings, and raw metrics: `docs/OPERATIONS.md`
- Knowledge package model and verification semantics: `docs/KNOWLEDGE-PACKAGES.md`
- Content asset model and editorial/production boundary: `docs/CONTENT-ASSETS.md`
- Approved VisualPlan to production implementation: `docs/PRODUCTION-PLANS.md`
- Designed burned-in captions and accessibility tracks: `docs/CAPTIONS.md`
- Platform adaptation, constraint profiles, and safe areas: `docs/PLATFORM-VARIANTS.md`
- Manual delivery packages and validation: `docs/DELIVERY-PACKAGES.md`
- Adaptive creative direction: `docs/CREATIVE-DIRECTION.md`
- Brand and creative direction: `docs/BRAND.md`, `docs/CONTENT-BIBLE.md`
- Architecture and commands: `docs/VIDEO-SYSTEM.md`
- Scientific sourcing: `docs/RESEARCH-STANDARDS.md`
- Product direction: `docs/STRATEGY.md`, `docs/ROADMAP.md`
- Significant decisions: `docs/DECISIONS.md`
- Asset provenance: `docs/ASSET-LICENSES.md`
- Published-video performance snapshots: `docs/PERFORMANCE.md`

- Artifact identity, backup and clean-machine restore: `docs/ARTIFACT-STORAGE.md`
- Multi-surface/device QA and cover capability: `docs/PLATFORM-QA.md`
- Document authority and current recovery evidence: `recovery-audit/phase-2/agent-context-verification.md`

- Operational recovery status/closure and historical gaps: `docs/RECOVERY.md`
- Accepted historical closure candidate/procedure: `docs/RECOVERY-CLOSE-CANDIDATE.md`

## Canonical media architecture V2

Follow `docs/ARTIFACT-ARCHITECTURE-V2.md`: create media according to presentation needs and deduplicate only actually identical payloads. New durable media has one immutable SHA-256-bound canonical binary; PlatformVariants, deliveries, authorization and publication records reference its identity. Lifecycle promotion never copies media. Distinct platform presentations remain eligible whenever quality requires them; storage convenience gives no creative advantage. Historical paths/approvals/QA/recovery evidence remain frozen. Independent same-byte evidence snapshots require an explicit hash-bound exception. Run `pnpm check` and `pnpm artifacts:durable`; resolve manual upload files with `pnpm exec tsx scripts/resolve-delivery-media.ts <manifest.json>`. Never delete historical duplicates as cleanup.
