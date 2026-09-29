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

`src/delivery/schema.ts` validates schema version, delivery ID/time/state, source revisions, VideoSpec/composition, destination profiles, observed media, upload metadata and claim IDs, designed-burned-in plus accessibility/native caption handling, approval/review status, and artifact records.

Every video, caption, metadata, upload-copy, and review artifact receives a SHA-256 hash and byte count. The manifest is written last and is not recursively self-hashed. Validation reparses the manifest, resolves every registry reference, rejects missing/extra/tampered files, reruns ffprobe, checks media against VideoSpec/PlatformVariant/platform profile, and rejects unresolved placeholder markers.

Generation is deterministic for the same registered sources, master bytes, and explicit `generatedAt` input. The operator CLI records the real generation time, so two separate operational runs intentionally have different manifest timestamps while their content-artifact hashes remain stable.

## Readiness semantics

- `production-ready` variant → `ready-for-manual-upload`, `publishEligible: true`.
- `approved` variant → `approved-review`, `publishEligible: false` until production readiness is recorded.
- `draft` or `editorial-review` variant → `draft-review`, `publishEligible: false`.
- `archived` variant → generation rejected.

Draft/review packages may be used for an explicitly private or draft platform upload needed to inspect captions, crop, UI obstruction, and cover behavior. They must not be publicly published. Generating or validating a package never changes variant status.

For the current Speed of Light set, YouTube is ready because that exact master and caption track previously passed human review. TikTok revision 2 is also ready after its dedicated safe-area render passed private visual/editorial QA on an iPhone 17 Pro Max. Its canonical package is `deliveries/speed-of-light-tiktok/tiktok-feed/`; the superseded revision 1 package formerly generated at `deliveries/speed-of-light/tiktok-feed/` has been removed and must not be recreated or used. Instagram and Facebook still require first real-platform previews. A ready package remains inert until a human separately approves and performs publication.

Wood Frog variant revision 3 generates `deliveries/wood-frog/youtube-shorts/` as `draft-review`. Its exact owner-visually-approved master and CaptionPlan-derived WebVTT are hash-checked, but the registered variant remains `editorial-review`, `publishEligible` is false, no platform cover is approved, and private YouTube preview remains outstanding.

## Intentionally unimplemented

- automatically rendering platform-specific transformations (a declared, already-rendered alternate VideoSpec can be packaged);
- automated cover or thumbnail generation;
- OAuth, accounts, uploads, scheduling, or publication;
- automatic PublicationRecord creation, remote-ID capture, or publication attempts;
- databases, queues, workers, dashboards, or analytics.
