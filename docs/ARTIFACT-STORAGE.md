# Artifact Storage V1

Authority: binary identity, provider boundary, backup and clean-machine restore. Implemented locally in Phase 2; independent archival durability remains pending. This system does not grant publication authority.

Git owns source, canonical docs, KnowledgePackages, ContentAssets, scripts, ProductionPlans, CaptionPlans, VideoSpecs, PlatformVariants, PublicationRecords, approvals, manifests, hashes, provenance and recipes. Independent artifact storage must own important exact binaries. Cache/scratch state is disposable. Ordinary Git is not an MP4 archive.

## Implemented records

`artifacts/manifests.json` is a strict versioned deterministic registry: artifactId/contentId/type/revision, identity (SHA-256/bytes/MIME), creation time or explicit unknown reason, recorded time, source commit, production/caption/variant/decision references, approval scope, publication relationship, local path, provider/key/replica durability, historical/recovery provenance, parent/replacement identity, exact-byte importance and reproducibility recipe/evidence.

The source commit describes surviving generation inputs and audit provenance, not an invented original creation commit. Exact ProductionPlan r3 and CaptionPlan r2 bindings, audio/font/runtime/lock fingerprints and eight recipes remain in Phase 1 source-validation/environment/reproduction reports. These reports are referenced evidence; archived delivery manifests retain their original source revisions.

Provenance values: HISTORICAL_EXACT, RECOVERY_EXACT_REPRODUCTION, RECOVERY_EQUIVALENT_REGENERATION, DERIVED_RECOVERY_ARTIFACT, RECONSTRUCTED_FROM_EVIDENCE, DISPOSABLE. HISTORICAL_EXACT describes an expected historical identity; availability is independently measured and may be missing. Regeneration alone cannot manufacture historical approval. Unknown historical byte size/creation times stay null.

Historical Wood Frog and accepted operational replacement have separate manifest IDs and paths. `artifacts/recovery-decision.json` records the new owner decision; it does not modify the historical approval. The historical path remains reserved/missing. Speed of Light is exact reproduction of recorded published bytes. Other encodes lack original comparison bytes/hashes where noted; no exactness is implied.

## Provider and operators

`ArtifactStore` exposes availability and retrieval. `LocalArtifactStore` implements offline filesystem retrieval; future S3/R2/S3-compatible providers implement that same interface without vendor dependencies in domain models. Provider alias/key carry no secrets. Cloud adapter, credentials, uploads, retention jobs and automatic regeneration are unimplemented.

```sh
pnpm artifacts:status
pnpm artifacts:verify
pnpm artifacts:restore
# Optional exact artifact ID filter follows each command
pnpm artifacts:verify wood-frog.recovered-master
```

Configure `MAGNIVIS_ARTIFACT_LOCAL_ROOT` to the root containing the recorded `sha256/<prefix>/<digest>` keys. Status reports NOT_CONFIGURED separately from missing archive bytes. Verify fails on missing/corrupt files. Restore retrieves expected bytes, verifies hash/size and atomically installs an absent destination; existing conflicts are rejected. Symlinks/traversal are rejected. Restore never renders or substitutes another identity. Historical Wood Frog without archive location remains an explicit restore/verify failure. A manifest listing a location does not prove that archive exists.

Phase 2 copied 156 operational files into `.artifact-store/` for a local restore drill. This ignored copy is still on this workstation: **it is not an independent durable backup**. Configure an independently retained accessible archive, copy immutable keys under future owner authorization, verify and record archive receipts before declaring durability complete. Current manifests explicitly say local-only.

## Backup policy

MUST archive owner-approved/known published masters and derivatives, important platform derivatives, approved covers, irreplaceable generated source assets, important final QA/device evidence, approved delivery packages and their full file sets. Git must retain manifests, publication metadata, approvals, source/license provenance and regeneration recipes. Current recovery draft deliveries are retained as important recovery evidence, not approved historical packages.

MAY discard caches, temporary frames/encodes, scratch renders and intermediate QA without approval/evidence significance. Keep original sources/audio currently committed; migration requires a separate decision. Exact approved identities are immutable. Never replace archived bytes in place; add a new identity and explicit decision. Keep at least one independently stored verified replica, push source/manifest refs, and exercise clean-clone restore periodically and after milestone changes. Archive upload is a separate authorized operation.

## Clean-machine recovery

Use Node 22.23.3 and pnpm 10.17.1 (engine range >=20.19 <23). Install dependencies with committed lockfile. Rendering additionally needs Remotion 4.0.527, its browser and matching fonts/audio; Phase 1 environment.json records the tested encoder/runtime. No render is implicit in restore.

```sh
git clone <authorized-repository-url>
cd Magnivis
git switch recovery/wood-frog-canonical
pnpm install --frozen-lockfile
pnpm check
pnpm artifacts:status
# Configure a verified archive location before restore
pnpm artifacts:restore
pnpm artifacts:verify
pnpm recovery:validate
pnpm production:validate wood-frog --recovered
pnpm captions:validate wood-frog
```

Without an archive provider a fresh clone reconstructs source/expectations, not ignored binaries. Restore/verify explicitly report missing historical Wood Frog and unavailable local archive. Once configured, 156 recovered identities can restore exactly from archived recovery bytes; their original historical equivalence remains as recorded. The missing historical Wood Frog master cannot be silently regenerated. Future explicit regeneration goes to staging with a new identity/decision. Meta geometry/screenshots, Wood Frog upload metadata/analytics and other unrecorded historical bytes still require evidence. No cloud credentials or external mutation is needed for tests.
