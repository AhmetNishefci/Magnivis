# RECOVERY-GENERATED delivery reconstruction

Eight complete replacement packages generated/validated locally: four Wood Frog, four Speed of Light. No upload/publication. No historical package hashes/timestamps were available, so none is claimed an exact original package.

## Surviving definitions and recipe

`src/platform-variants/variants/wood-frog.ts`: YouTube r4; TikTok/Instagram/Facebook r1; approved source ProductionPlan r3/CaptionPlan r2/master identity, original English packaging/copy/hashtags, caption mode, cover intent/operator guidance. YouTube/Instagram/Facebook expect exact locked master; TikTok expects existing V2 +90px top-safe derivative. Only YouTube package includes copied aligned WebVTT; all Wood Frog contain designed burned-in captions. Caption choices and all factual packaging are preserved. No covers were generated.

`src/platform-variants/variants/speed-of-light.ts`: four platform variants, canonical TikTok r2, original copy/hashtags/cover/caption choices. Only YouTube includes external VTT; the older optional/generated caption treatment remains unchanged. The Speed master exactly matches its publication hash, but the derivative has no recovered original comparison hash. No broader platform approval transfers to new package identities.

Unchanged `scripts/delivery-packages.ts` writes video.mp4, metadata.json, upload-copy.txt, review.md, manifest.json, plus applicable captions.en.vtt. It validates schemas/source references/hash/bytes/media/profile/copy and review gates. `scripts/recovery-deliveries.ts` uses its existing dependency-injection interface to isolate paths/variant identities; no default delivery validator was loosened.

## Recovery boundary

New in-memory IDs append `.recovery-phase-1`, revision1, editorial-review, no inherited approval, preview not-ready and preview required. Packaging/captions/safe-area definitions are copied unchanged. Canonical registries are not promoted or edited. Source master lock may be retained at a relocated staging path **only if actual SHA equals its trusted historical expectation**. Otherwise the old sourceMaster is omitted from the live candidate manifest, and saved separately as historical provenance. This does not make the historical chain pass: the frozen default validator still rejects missing/different locked bytes.

Every replacement package: draft-review, publishEligible false, publicationAuthorized false; new actual generation timestamp and incomplete checklist. Parent RECOVERY.md/recovery-provenance.json label the package as RECOVERY-GENERATED DELIVERY PACKAGE. Provenance preserves original variant/historical chain and candidate hash while preventing identity/approval conflation. Labels are outside each standard validated package to preserve its strict file-set checks.

## Commands and locations

```sh
node --import tsx scripts/recovery-deliveries.ts wood-frog deliveries-complete
node --import tsx scripts/recovery-deliveries.ts speed-of-light
```

Wood Frog complete package root: recovery-work/wood-frog/deliveries-complete/packages/. Speed root: recovery-work/speed-of-light/deliveries/packages/. Each contains video-specific youtube-shorts/tiktok-feed/instagram-reels/facebook-reels folder. All paths, manifest SHA256 and per-file hashes/bytes, original/recovery variant snapshots, operator guidance and validations are committed in delivery-reproduction.json; binaries remain ignored staging.

An early Wood Frog delivery attempt started before the TikTok render completed: two packages were produced, then it failed on missing derivative. That partial attempt is preserved at recovery-work/wood-frog/deliveries/, excluded from eight completed-package counts. A preflight now requires every staged input before creating a new package root; existing staging directories are never silently overwritten. Final complete attempt passed for all four. This is an operational attempt failure, not a remaining artifact regeneration failure.

## Exactness and readiness

Speed's recovered video copy is exact historical master bytes; package manifest/checklist identity remains new. Wood Frog's video copies are nonidentical regeneration candidates; original visual approval not transferred. Applicable VTT copies match committed source bytes. Metadata/copy/hashtags retain exact registered values. Technical delivery validation does not authorize owner visual/platform review, preview upload or public publication. Original package identities/ticks remain lost pending owner backups.
