# Magnivis agent guide

Magnivis is a premium, faceless, English-language knowledge-media brand: **See the unimaginable.** Every published asset should help the viewer understand something fascinating or useful that they did not understand before. The repository is the durable source of truth; do not rely on context from earlier chats.

## Before changing anything

1. Inspect Git status, the current implementation, and recent history.
2. Read `docs/PROJECT-STATE.md`, then the documentation relevant to the task.
3. Reconcile code/documentation discrepancies explicitly.

## Permanent rules

- Preserve the cinematic, minimal, scientifically credible brand in `docs/BRAND.md` and `docs/CONTENT-BIBLE.md`.
- Magnivis is an open-ended curiosity and understanding brand: help viewers understand something fascinating or useful every day. **Discover first, classify second.** High-level pillars organize the portfolio; they are never a whitelist. Science, history, human behavior, philosophy, practical life skills, business, money, culture, and future legitimate domains all fit when treated as credible explanation—not generic motivation, shallow self-help, or advice spam. `docs/STRATEGY.md` owns the topic-universe rules.
- Treat a verified knowledge package—not a finished video—as the durable editorial unit. Platform assets should reference that package and adapt it without silently changing its claims.
- AI-assisted research output is a proposal, never evidence of its own correctness. Model-proposed sources begin unreviewed, model-proposed claims begin unverified, and model-generated editorial assets remain drafts until a human approves them.
- Keep AI providers behind the repository interface in `src/ai/`; validate structured output and preserve workflow/model/usage provenance. Do not scatter vendor SDK calls through domain code or make normal validation depend on credentials.
- Treat `content-intelligence/runs/*/review.md` as an operator handoff, not approval. Workflow envelopes are hashed audit records; regenerate them through `pnpm content:intelligence`, never edit hashes by hand. Follow the live-stage pause documented in `docs/CONTENT-INTELLIGENCE.md`.
- Recovery checkpoint is through Wood Frog at ae79799. Preserve original editorial/claim/visual approvals and circulation-cessation exclusion. Missing historical master and accepted operational replacement are separate identities; use PROJECT-STATE.md and artifacts/recovery-decision.json. No Bridge work/new production or external upload/publication is currently authorized; PROJECT-STATE.md owns the current recovery scope. Restore exact manifest bytes; never silently regenerate or transfer approval.
- Distinguish content master, platform variant and presentation surface. Desktop/local QA cannot prove mobile safety. Follow PLATFORM-QA.md for covers, captions, versioned profiles and real-device evidence; never invent Meta crop geometry or missing publication metadata.
- All new Magnivis short-form productions use designed burned-in captions as part of the creative master. Their presentation is speech-first: favor natural spoken phrase boundaries over literal prose typography while preserving approved wording, meaning, provenance, and meaningful punctuation. Platform-native or external caption tracks remain optional accessibility artifacts and never substitute for the designed layer. Follow `docs/CAPTIONS.md`; do not retroactively regenerate approved legacy media without authorization.
- Keep video content/data separate from reusable rendering primitives. Avoid one-off monoliths and premature generic frameworks.
- Verify material claims against appropriate authoritative sources. Preserve claim-level evidence, status, caveats, URLs, and retrieval dates. Never fabricate citations or imply uncertain evidence is settled.
- Use only original, public-domain, CC0, or appropriately licensed assets. Update `docs/ASSET-LICENSES.md` for every production asset.
- Keep audio/narration modular. A silent concept must not hardwire the architecture to silence.
- Do not add databases, queues, cloud infrastructure, dashboards, publishing automation, or paid APIs without a current need and human approval.
- Never upload or publish to any platform without explicit human approval. Publishing credentials and public-release operations are sensitive.
- Treat generated delivery packages as hashed operator handoffs. Do not mark a review package publishable unless its registered PlatformVariant is `production-ready`; package generation never grants publication approval.
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

- Recovery closure candidate and later main reconciliation gate: `docs/RECOVERY-CLOSE-CANDIDATE.md`
