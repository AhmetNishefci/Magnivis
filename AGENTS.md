# Magnivis agent guide

Magnivis is a premium, faceless visual-science media brand: **See the unimaginable.** The repository is the durable source of truth; do not rely on context from earlier chats.

## Before changing anything

1. Inspect Git status, the current implementation, and recent history.
2. Read `docs/PROJECT-STATE.md`, then the documentation relevant to the task.
3. Reconcile code/documentation discrepancies explicitly.

## Permanent rules

- Preserve the cinematic, minimal, scientifically credible brand in `docs/BRAND.md` and `docs/CONTENT-BIBLE.md`.
- Keep video content/data separate from reusable rendering primitives. Avoid one-off monoliths and premature generic frameworks.
- Verify scientific claims against authoritative sources. Record claim, value, units, uncertainty, URL, and retrieval date. Never fabricate citations or imply uncertain estimates are exact.
- Use only original, public-domain, CC0, or appropriately licensed assets. Update `docs/ASSET-LICENSES.md` for every production asset.
- Keep audio/narration modular. A silent concept must not hardwire the architecture to silence.
- Do not add databases, queues, cloud infrastructure, dashboards, publishing automation, or paid APIs without a current need and human approval.
- Never upload or publish to YouTube without explicit human approval. V1 output stays local for human review.
- Never commit secrets, credentials, personal data, or generated `.env` files. Use environment variables and maintain `.env.example`.
- Avoid destructive commands and history rewrites. Never force-push. Preserve unrelated work.
- Favor strict, maintainable TypeScript and deterministic rendering. Update decision/docs when architecture or product direction changes.
- Before completion, run `pnpm check`; for visual changes also render at least a smoke segment, and for releases render the full video plus `pnpm qa <video-id>` and inspect the contact sheet.

## Navigation

- Current status: `docs/PROJECT-STATE.md`
- Brand and creative direction: `docs/BRAND.md`, `docs/CONTENT-BIBLE.md`
- Architecture and commands: `docs/VIDEO-SYSTEM.md`
- Scientific sourcing: `docs/RESEARCH-STANDARDS.md`
- Product direction: `docs/STRATEGY.md`, `docs/ROADMAP.md`
- Significant decisions: `docs/DECISIONS.md`
- Asset provenance: `docs/ASSET-LICENSES.md`

