# Platform delivery packages

Platform Delivery Package V1 is the implemented local operator handoff between a PlatformVariant and manual platform work:

```text
KnowledgePackage → ContentAsset → PlatformVariant → VideoSpec / Remotion
                                                       ↓
                                                Delivery Package
                                                       ↓
                                          human preview / manual upload
```

It produces files for a human operator. It does not authenticate, upload, schedule, publish, select an account, or create a PublicationRecord.

## Commands

Generate every registered variant for a video:

```bash
pnpm delivery speed-of-light
```

Generate one destination:

```bash
pnpm delivery speed-of-light youtube-shorts
pnpm delivery speed-of-light tiktok
```

Generate using stable registry IDs:

```bash
pnpm delivery --variant speed-of-light.asset.earth-to-proxima.variant.instagram-reels
pnpm delivery --asset speed-of-light.asset.earth-to-proxima
```

Validate the same selections without regenerating them:

```bash
pnpm delivery:validate speed-of-light
pnpm delivery:validate --variant speed-of-light.asset.earth-to-proxima.variant.youtube-shorts
pnpm delivery:validate wood-frog
```

The production artifact declared by `productionIntent.videoSpecId` must already exist. A missing artifact produces a render command rather than silently starting an expensive render. A `new-render` variant is supported when its dedicated VideoSpec and completed render exist; delivery generation itself does not render.

## Output

Generated packages are written beneath:

```text
deliveries/<video-id>/<surface>/
  video.mp4
  captions.en.vtt       # only when the variant uses an external track
  metadata.json
  upload-copy.txt
  review.md
  manifest.json
```

`deliveries/*` is ignored by Git. Only `deliveries/.gitkeep` is committed. Each destination receives a portable video copy deliberately; V1 favors a folder that can be moved and reviewed independently over symlink or filesystem-deduplication complexity.

## Artifacts

- `video.mp4`: copied from the validated production artifact selected by the PlatformVariant. Reused and dedicated renders follow the same hash and ffprobe checks.
- `captions.en.vtt`: included only for an `external-track` variant. Platform-generated-caption variants do not receive a fabricated caption file.
- `metadata.json`: concise structured upload fields, cover intent, designed-burned-in status, accessibility/native caption behavior, and platform notes.
- `upload-copy.txt`: human-readable exact fields plus a combined copy/paste body.
- `review.md`: practical video, copy, provenance, and actual-platform checklist.
- `manifest.json`: immutable description of the generated handoff and the hashes of every other artifact.

Automated cover creation is intentionally absent. The package carries the registered cover intent and requires human selection/preview.

## Manifest and integrity

`src/delivery/schema.ts` validates schema version, delivery ID/time/state, source revisions, VideoSpec/composition, optional locked ProductionPlan/CaptionPlan/master provenance, destination profiles, observed media, upload metadata and claim IDs, designed-burned-in plus accessibility/native caption handling, operator settings, private-preview/publication gates, and artifact records. Manifest V2 adds those production-chain and operator-review fields while the validator can still read existing V1 manifests.

Every video, caption, metadata, upload-copy, and review artifact receives a SHA-256 hash and byte count. The manifest is written last and is not recursively self-hashed. Validation reparses the manifest, resolves every registry reference, rejects missing/extra/tampered files, reruns ffprobe, checks media against VideoSpec/PlatformVariant/platform profile, and rejects unresolved placeholder markers.

Generation is deterministic for the same registered sources, master bytes, and explicit `generatedAt` input. The operator CLI records the real generation time, so two separate operational runs intentionally have different manifest timestamps while their content-artifact hashes remain stable.

## Readiness semantics

- `production-ready` variant → `ready-for-manual-upload`, `publishEligible: true`.
- `approved` variant → `approved-review`, `publishEligible: false` until production readiness is recorded.
- `draft` or `editorial-review` variant → `draft-review`, `publishEligible: false`.
- `archived` variant → generation rejected.

Draft/review packages may be used for an explicitly private or draft platform upload needed to inspect captions, crop, UI obstruction, and cover behavior. They must not be publicly published. Generating or validating a package never changes variant status.

For the current Speed of Light set, YouTube is ready because that exact master and caption track previously passed human review. TikTok revision 2 is also ready after its dedicated safe-area render passed private visual/editorial QA on an iPhone 17 Pro Max. Its canonical package is `deliveries/speed-of-light-tiktok/tiktok-feed/`; the superseded revision 1 package formerly generated at `deliveries/speed-of-light/tiktok-feed/` has been removed and must not be recreated or used. Instagram and Facebook still require first real-platform previews. A ready package remains inert until a human separately approves and performs publication.

Wood Frog generates four `draft-review` packages with `previewStatus: ready-for-private-preview`, `publishEligible: false`, and `publicationAuthorized: false`:

- `deliveries/wood-frog/youtube-shorts/`
- `deliveries/wood-frog-tiktok/tiktok-feed/`
- `deliveries/wood-frog/instagram-reels/`
- `deliveries/wood-frog/facebook-reels/`

YouTube, Instagram, and Facebook package the exact locked master. TikTok packages its dedicated V2-safe derivative and records the locked master as its immutable source. YouTube includes the WebVTT; the other packages retain burned-in captions and ask the operator to evaluate native-caption duplication privately rather than fabricating an unsupported sidecar workflow.

## Intentionally unimplemented

- automatically rendering platform-specific transformations (a declared, already-rendered alternate VideoSpec can be packaged);
- automated cover or thumbnail generation;
- OAuth, accounts, uploads, scheduling, or publication;
- automatic PublicationRecord creation, remote-ID capture, or publication attempts;
- databases, queues, workers, dashboards, or analytics.

## Restored recovery handoffs

Eight Phase 1 draft package file sets are restored byte-for-byte relative to their recovery identities under `deliveries/recovered/`, with Git provenance in artifacts/deliveries.json and per-file manifests. These are DERIVED_RECOVERY_ARTIFACT, not exact historical packages. `pnpm recovery:validate` checks restored package media/copy/checklists/metadata/captions/source gates through the existing validator using persisted recovery variants, without requiring staging. All remain draft-review/publication false. New master replacement acceptance is recorded separately; it does not rewrite the package's historical approval relationships or grant platform readiness.


## Owner-reported presentation decisions

A qualitative real-device owner acceptance may lack device/app/test time or screenshots. Preserve that statement in an exact-master/variant-bound owner decision with labeled decision-entry time; never populate missing metadata. Specific surfaces and an exact cover require explicit scope confirmation. Unspecified “relevant surfaces” cannot populate individual passes. `OWNER_REPORTED_PASSED` records are separate from measured `REAL_DEVICE_PASSED` evidence; the latter still requires its original metadata. Approval may use decision-entry time plus a hashed owner decision instead of inventing an owner review date.

An exact-master variant may use hash-bound authored content bounds and local report evidence to demonstrate containment in known profile insets when entire authoring envelopes differ. Validate every nondecorative region, source media/variant/profile and evidence hashes. This is local containment only, never a native UI/crop pass or device acceptance. Registered cover assets are copied with exact hashes into a package only when explicitly selected. Draft-review packages remain nonpublishable; final technical readiness never grants publication authorization.
