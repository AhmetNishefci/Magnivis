# Magnivis Artifact Storage V1 — design proposal only

Status: PROPOSED; no provider integration, cloud credentials, remote storage creation or artifact upload in Phase 1. This design prevents a source clone from silently losing the exact binaries needed by approvals. It does not make today's local recovery staging durable.

## Storage responsibilities

| Store | Contents |
|---|---|
| Git | Source, canonical docs, research/KnowledgePackages/ContentAssets, scripts/ProductionPlans/CaptionPlans/VideoSpecs, PlatformVariants/PublicationRecords, explicit approvals, artifact manifests/hashes, source/recipe/environment provenance, recovery/availability decisions. |
| Durable binary archive | Exact approved masters and derivatives, important review candidates/QA/device evidence, approved delivery package bytes with original manifests/checklists, approved covers, irreplaceable generated sources. Each original is immutable and hash-addressed; important package manifests/approval binding also survive in Git. |
| Disposable local state | Remotion/browser/download caches, intermediates, scratch frames and temporary renders. Recovery staging remains local, ignored and unapproved unless separately reviewed. |

Committing every MP4 to Git is not the remedy. Neither is calling a rerender equivalent to an exact approved binary. Original soundscape/narration already committed must remain preserved; future binary storage migration is a separate decision, not automatic removal from Git.

## Durable manifest

Proposed versioned schema stored at `artifacts/manifests/<artifactId>/r<revision>.json`, indexed by a small deterministic file-backed registry. No database required. Stable artifact identity/revision is distinct from content ID and byte hash. A manifest has:

- schemaVersion, artifactId, contentId, artifactType, revision;
- sha256 (64 lowercase hex), bytes, mimeType;
- createdAt (actual artifact creation UTC or null with explicit unknown reason for historical missing bytes), recordedAt;
- sourceCommit, sourceTreeSha256 and sourceDirtyInputs when a recovery tool was uncommitted; sourceCommit identifies recipe/source provenance, not proof of original creation if that commit is unknown;
- productionPlanId/revision/hash, captionPlanId/revision/hash where relevant;
- platformVariantId/revision and approved KnowledgePackage/ContentAsset/owner-decision/script references where relevant;
- approvalDecisionId, approvalScope and approvedArtifactSha256, with null for pending/unapproved bytes; editorial, visual, platform and publication gates are separate;
- storageKey, storageProvider, availability and optional multiple verified replicas; no credentials/presigned URLs;
- reproducibility status plus recipe and executionEnvironment;
- historical/recovery provenance, originalVsRegenerated, parentArtifactIds and replacesArtifactId without overwriting the historical record.

Strict validation rejects missing required known fields, undeclared secret fields, unsafe IDs/storage keys, mismatched hash/approval, malformed revision chains and claims of exact recovery without a matching historical hash. Nullable unknowns are explicit, never guessed. A historical HASH_ONLY expectation can exist before its bytes/size/storage copy are available; it cannot claim archived/verified availability.

Example manifest shape (illustrative fields, **not** a new owner approval or deployed registry):

```json
{
  "schemaVersion": 1,
  "artifactId": "artifact.wood-frog.master.recovery-phase-1",
  "contentId": "wood-frog",
  "artifactType": "video-master",
  "revision": 1,
  "sha256": "400edeccbfceb7a0269ec0926a88737b2421adb811d6be9b8aa64c77b5e242e1",
  "bytes": 18493823,
  "mimeType": "video/mp4",
  "createdAt": null,
  "createdAtUnknownReason": "Initial staging command timing was not independently captured; subsequent diagnostic runs have actual start/end records.",
  "sourceCommit": "ae797996382c337759612265fd8229e8d5f06eef",
  "productionPlanId": "production-plan.wood-frog-freeze.v1",
  "captionPlanId": "caption-plan.wood-frog.v1",
  "platformVariantId": null,
  "approvalDecisionId": null,
  "storageKey": null,
  "storageProvider": "unassigned",
  "availability": "local-staging-only",
  "reproducibility": "equivalent-regeneration-candidate",
  "originalVsRegenerated": "regenerated",
  "provenance": {
    "kind": "recovery",
    "historicalExpectedSha256": "4c5354d9368908f11f5f9b5767371694c2e51ad895786b2c31f7e329b83eaac2",
    "historicalApprovalTransferred": false
  }
}
```

The proposed real schema also carries complete typed recipe/environment/source/approval references above. A separate original-master expectation retains the historical hash and visual approval even while availability is missing. Regenerated candidate gets a new ID/hash and no visual approval. Exact bytes matching the historical hash may satisfy the old expectation; a nonidentical candidate never rewrites it.

## Regeneration provenance

Record composition/source revision, exact command/options, input audio/assets/fonts hashes, package/lock hashes, Node/pnpm/Remotion/browser/compositor/ffmpeg versions and binary digests, OS/architecture, concurrency, pixel/image formats, codecs/bitrates, timestamps and observed media. When practical archive the encoder input or frame/sample decoded fingerprints for important approved milestones. Record full decoded audiovisual hashes in addition to container identity; a near-perfect SSIM is useful diagnostic evidence, not an approval-equivalence rule.

Reproducibility statuses distinguish `exact-survivor`, `hash-only`, `exact-reproduction-proven`, `equivalent-regeneration-candidate`, `derived-regeneration-allowed`, `owner-evidence-required`, and `unavailable`. Exact reproducibility requires an observed equal historical digest, not a deterministic source claim. No guaranteed identical MP4 assumption: Phase 1's same-recipe repeat already differs in encoded/decoded pixels.

## Provider boundary

Domain code depends on `ArtifactStore` methods such as `stat(key)`, `read(key)`/stream and an explicitly authorized `writeImmutable(key, stream, expectedHash)` operation. A local filesystem adapter supports tests/offline restore. A future S3-compatible adapter may implement the same boundary behind configuration; no vendor SDK or bucket URL leaks into KnowledgePackage/ContentAsset/approval models. Credential use stays at provider boundary. Availability and storage failures are explicit; never treat a missing credential as proof an artifact does not exist.

Proposed key shape: `sha256/<first-two>/<full-digest>/<safe-filename>`. No overwrite of different bytes at an existing key. Metadata references a provider alias, key and optional provider version identifier; checksums are always verified independently of ETag. Delivery packages may be archived as an immutable deterministic bundle plus per-file hashes/manifest; archive digest and file-set digest are separate identities. Approved screenshots/covers keep original bytes, device/surface/context and owner approval references. A cost/retention policy is a future human decision.

## Future operator commands — designed, not implemented

- `pnpm artifacts:status`: compare Git expectations, local verified bytes and configured remote availability; report missing/unknown/staging/unapproved without automatic mutation or credentials in normal validation.
- `pnpm artifacts:verify`: hash streamed local files/bundles, validate byte count/MIME/source references and approval bindings; report tampered/changed/missing data. No approval promotion.
- `pnpm artifacts:restore`: read configured durable copy into a temporary same-filesystem location, verify expected SHA256/bytes, atomically place it only when destination absent or already identical. Reject symlink/path traversal and existing conflicting bytes; preserve/quarantine rather than overwrite. Return a machine-readable receipt. Read-only remote retrieval is separate from archive upload.
- `pnpm artifacts:regenerate`: optional future explicit command for manifests permitting regeneration; render to staging/new identity, verify and report. Approved bytes are restored preferentially, never silently replaced.
- An archive/backup upload command remains a separate owner-authorized operation, not hidden in status/check/render/publish.

Fresh clone flow: install dependencies → read manifests → status → restore available approved binaries → verify hashes → explicitly regenerate permitted derived outputs → report unresolved originals/evidence. Publication stays separately authorized. Offline validation uses a local store fixture and needs no secrets/network.

## Durability and disaster recovery controls

Use source push verification at approved milestones; archive exact approved binary plus important review/QA/delivery/owner evidence before declaring the milestone durable. Store manifest and archive receipt in Git. Keep at least an independent backup/replica policy approved by the owner; test access/restore rather than assuming the sole workstation or sole bucket is sufficient. Add a periodic clean-clone + archive restore drill through Wood Frog, hash verification and an unresolved-item report. Preserve original generation times/checklist ticks; newly generated packages receive actual current times and empty reviews. Do not archive every cache/frame automatically: retention is based on irreplaceability, review importance and cost.

## Phase 2 decision required

Owner selects storage provider/location/cost/retention and archive scope, decides exact-original search versus explicit candidate review, and authorizes the smallest implementation. No cloud infrastructure or remote writes are approved merely by this proposal.
