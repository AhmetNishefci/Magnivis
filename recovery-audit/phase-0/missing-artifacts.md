# Missing artifacts and local-only architecture

No missing production artifact was regenerated. Current output/, qa/ and deliveries/ contain only committed `.gitkeep`. The working tree had no additional untracked interruption files. Every expected matrix artifact has one classification; equivalent reproducibility is separate from exact historical identity/approval.

## Exclusions and clone behavior

| Excluded class | Recipe committed / exact source committed | Historical hash committed? | Approval committed? | Reproducible / irreplaceable / fresh clone |
|---|---|---|---|---|
| output/* production MP4s | Yes: VideoSpecs, compositions, audio, fonts/dependency pins, render flags | Wood Frog approved master and published Speed master yes; others/derivatives no trusted master hash found | Wood Frog exact visual approval yes; older reviews/publication in docs/VideoSpecs; derivative device review text for Speed TikTok | Equivalent output appears feasible after dependency/tool install. Exact encoded bytes not proven deterministic. A clone cannot deliver originals; exact approved identity requires original backup or matching hash, and any replacement requires new approval. |
| qa/* | Yes: media inspection, sample timestamps, frame/contact sheet recipes; exact source MP4 missing | No original reports/images hash ledger found | Textual pass and Wood Frog exact visual approval survive; original reports/screenshots/annotations absent | Frames/media facts can be recreated from recovered media. Timestamped report differs. Historical human observations/device screenshots are irreplaceable as evidence. |
| deliveries/* | Yes: variants, templates/validator and sources. Required MP4s absent | Hashes lived in ignored manifest.json; no full historical package hash set found | Variant readiness and some private approval text survive; completed review ticks/manifest identities absent | Content equivalent given exact source media, same revisions and explicit generatedAt. Exact historical generatedAt/ffprobe/report/checklist cannot be inferred. Wood Frog requires the hash-locked master, so current clone cannot pass delivery gate. |
| .remotion/, .cache/ | Rendering/cache configuration committed; exact downloaded runtime/cache binaries not generally tracked | No cache identity archive found | Not approval artifacts | Normally recreatable environment caches, possibly network-dependent. Loss of caches is not loss of authored content; renderer versions can affect byte identity. |
| node_modules/, .pnpm-store/, dist/, coverage/, tsbuildinfo/eslint cache | package.json/lock/config committed; generated tool artifacts absent by design | Lock has dependency resolution/integrity; not complete execution-environment archive | Not production approval | Install/rebuild sufficient for functional equivalents. Node/tool/browser/OS pinning incomplete for guaranteed old encoded bytes. |
| .env/.env.*, logs, .codex-log/ | .env.example survives; secrets intentionally excluded | Not expected | Not an approval store | Keys can be reconfigured privately. Logs might contain unarchived handoffs; current clone cannot prove what existed. No secret discovery/export attempted. |
| temporary reviews / artifact caches outside repository | No referenced pre-reset durable store or known path inventory found | Unknown | Unknown | Owner evidence required. No known surviving configured artifact cache/remote backup. Do not infer arbitrary home directories contain archives. |
| design-reviews/, motion-reviews/ | Not ignored; later review images/masks/MP4/prompts/manifests are committed | Yes for current post-reset artifacts | Current A rejection/B art-direction approval; proof motion review pending | Exact post-checkpoint artifacts survive in recovery branch, demonstrating a later different archival choice. They do not restore missing Wood Frog deliverables or redefine style. |
| content-intelligence/runs/, reviews/, public/audio/, captions/ | Not ignored; exact handoffs/approval JSON/WAV/VTT/SRT are committed | Workflow hashes/owner bindings/Wood Frog audio hashes survive | Exact Wood Frog editorial decisions survive | Fresh clone reconstructs these exact bytes. Claim review is not dependent solely on generated QA directories. |

## All eight routed master paths currently absent

- output/earth-to-stars-narrated.mp4
- output/ocean-depth-narrated.mp4
- output/billion-dollars-narrated.mp4
- output/speed-of-light-narrated.mp4
- output/speed-of-light-tiktok-narrated.mp4
- output/human-engineering-narrated.mp4
- output/wood-frog-narrated.mp4
- output/wood-frog-tiktok-narrated.mp4

Original Speed master SHA256: `f157f7ef91740ecd7c679156c6a227318b462fe33d13018ff39ab708ef480f24` in publication record. Locked Wood Frog master SHA256: `4c5354d9368908f11f5f9b5767371694c2e51ad895786b2c31f7e329b83eaac2` in ProductionPlan. These two master units are HASH_ONLY. Other routed renders are REGENERABLE equivalents, not recovered exact media. None is a license to render now or reuse previous approval on changed bytes.

## Missing QA paths/files

For each of the eight IDs above, `qa/<id>-narrated/` is absent. Scripts define report.json, timestamped `frame-<index>-<seconds>s.png` and contact-sheet.jpg. Wood Frog selects 18 CaptionPlan midpoint frames. Required source media are absent. No historical report timestamp/ffprobe facts/contact sheet hashes or original device captures were recovered. Equivalent technical reports are REGENERABLE; historical review decisions cannot be recreated by a passing technical test.

## Missing delivery paths/files

The eight recorded canonical folders are:

- deliveries/speed-of-light/youtube-shorts/
- deliveries/speed-of-light-tiktok/tiktok-feed/
- deliveries/speed-of-light/instagram-reels/
- deliveries/speed-of-light/facebook-reels/
- deliveries/wood-frog/youtube-shorts/
- deliveries/wood-frog-tiktok/tiktok-feed/
- deliveries/wood-frog/instagram-reels/
- deliveries/wood-frog/facebook-reels/

Every folder lacks video.mp4, metadata.json, upload-copy.txt, review.md and manifest.json; YouTube folders also lack their copied captions.en.vtt. Original captions/speed-of-light.en.vtt and captions/wood-frog.en.vtt survive. Template checklist and exact registry copy fields survive; historical generated package bytes/hashes/timestamp/checklist completion do not. Superseded Speed TikTok V1 folder deliveries/speed-of-light/tiktok-feed/ was intentionally removed before checkpoint; do not count its absence as a canonical restore target.

Speed YouTube and TikTok canonical packages were ready-for-manual-upload (not authorized public release); Speed Meta and all Wood Frog packages draft-review. Package generation is deterministic only with exact inputs/environment/explicit generatedAt. The current clone cannot deterministically regenerate the *historical package* from absent master and unknown manifest time. Even with a recovered master, newly written reports cannot claim old operator review ticks or final platform approval.

## Approval/media recovery dependencies

Highest priority is owner-held exact Wood Frog MP4 matching the locked hash, then exact Speed master/package/TikTok derivative evidence, then other original masters if available. Recorded public URLs provide potential external copies for V001–004; they were not inspected/downloaded here and likely offer transcoded media, not original hashes. No Wood Frog remote ID survives. Instagram grid/profile covers and Facebook Page/feed derivatives/geometry require original owner evidence. They are not inferable from safe-area V1 or ready preview packages.

## Exact routed QA filenames from surviving recipe

Read-only import of scripts/video-targets.ts; no QA execution/render. The filenames below are expectations, not recovered historical image identities.

### earth-to-stars

- qa/earth-to-stars-narrated/report.json
- qa/earth-to-stars-narrated/contact-sheet.jpg
- qa/earth-to-stars-narrated/frame-01-0.7s.png
- qa/earth-to-stars-narrated/frame-02-9.8s.png
- qa/earth-to-stars-narrated/frame-03-17.8s.png
- qa/earth-to-stars-narrated/frame-04-25.7s.png
- qa/earth-to-stars-narrated/frame-05-34.8s.png
- qa/earth-to-stars-narrated/frame-06-40.7s.png

### ocean-depth

- qa/ocean-depth-narrated/report.json
- qa/ocean-depth-narrated/contact-sheet.jpg
- qa/ocean-depth-narrated/frame-01-0.4s.png
- qa/ocean-depth-narrated/frame-02-4.8s.png
- qa/ocean-depth-narrated/frame-03-8.8s.png
- qa/ocean-depth-narrated/frame-04-13.2s.png
- qa/ocean-depth-narrated/frame-05-18.2s.png
- qa/ocean-depth-narrated/frame-06-22.2s.png
- qa/ocean-depth-narrated/frame-07-27.2s.png
- qa/ocean-depth-narrated/frame-08-30.5s.png

### billion-dollars

- qa/billion-dollars-narrated/report.json
- qa/billion-dollars-narrated/contact-sheet.jpg
- qa/billion-dollars-narrated/frame-01-0.4s.png
- qa/billion-dollars-narrated/frame-02-4.8s.png
- qa/billion-dollars-narrated/frame-03-9.8s.png
- qa/billion-dollars-narrated/frame-04-14.8s.png
- qa/billion-dollars-narrated/frame-05-20.4s.png
- qa/billion-dollars-narrated/frame-06-27.7s.png
- qa/billion-dollars-narrated/frame-07-32.6s.png
- qa/billion-dollars-narrated/frame-08-34.2s.png

### speed-of-light

- qa/speed-of-light-narrated/report.json
- qa/speed-of-light-narrated/contact-sheet.jpg
- qa/speed-of-light-narrated/frame-01-0.3s.png
- qa/speed-of-light-narrated/frame-02-2.8s.png
- qa/speed-of-light-narrated/frame-03-5.9s.png
- qa/speed-of-light-narrated/frame-04-10.8s.png
- qa/speed-of-light-narrated/frame-05-15.8s.png
- qa/speed-of-light-narrated/frame-06-21.8s.png
- qa/speed-of-light-narrated/frame-07-27.8s.png
- qa/speed-of-light-narrated/frame-08-32.1s.png

### speed-of-light-tiktok

- qa/speed-of-light-tiktok-narrated/report.json
- qa/speed-of-light-tiktok-narrated/contact-sheet.jpg
- qa/speed-of-light-tiktok-narrated/frame-01-0.3s.png
- qa/speed-of-light-tiktok-narrated/frame-02-2.8s.png
- qa/speed-of-light-tiktok-narrated/frame-03-5.9s.png
- qa/speed-of-light-tiktok-narrated/frame-04-10.8s.png
- qa/speed-of-light-tiktok-narrated/frame-05-15.8s.png
- qa/speed-of-light-tiktok-narrated/frame-06-21.8s.png
- qa/speed-of-light-tiktok-narrated/frame-07-27.8s.png
- qa/speed-of-light-tiktok-narrated/frame-08-32.1s.png

### human-engineering

- qa/human-engineering-narrated/report.json
- qa/human-engineering-narrated/contact-sheet.jpg
- qa/human-engineering-narrated/frame-01-0.3s.png
- qa/human-engineering-narrated/frame-02-2.8s.png
- qa/human-engineering-narrated/frame-03-4.8s.png
- qa/human-engineering-narrated/frame-04-8.8s.png
- qa/human-engineering-narrated/frame-05-13.8s.png
- qa/human-engineering-narrated/frame-06-19.8s.png
- qa/human-engineering-narrated/frame-07-25.8s.png
- qa/human-engineering-narrated/frame-08-30.2s.png

### wood-frog

- qa/wood-frog-narrated/report.json
- qa/wood-frog-narrated/contact-sheet.jpg
- qa/wood-frog-narrated/frame-01-1.3s.png
- qa/wood-frog-narrated/frame-02-3.1s.png
- qa/wood-frog-narrated/frame-03-4.5s.png
- qa/wood-frog-narrated/frame-04-6.6s.png
- qa/wood-frog-narrated/frame-05-8.7s.png
- qa/wood-frog-narrated/frame-06-10.2s.png
- qa/wood-frog-narrated/frame-07-11.9s.png
- qa/wood-frog-narrated/frame-08-13.7s.png
- qa/wood-frog-narrated/frame-09-16.1s.png
- qa/wood-frog-narrated/frame-10-18.7s.png
- qa/wood-frog-narrated/frame-11-21.3s.png
- qa/wood-frog-narrated/frame-12-24.0s.png
- qa/wood-frog-narrated/frame-13-26.8s.png
- qa/wood-frog-narrated/frame-14-29.4s.png
- qa/wood-frog-narrated/frame-15-31.3s.png
- qa/wood-frog-narrated/frame-16-33.4s.png
- qa/wood-frog-narrated/frame-17-35.7s.png
- qa/wood-frog-narrated/frame-18-37.8s.png

### wood-frog-tiktok

- qa/wood-frog-tiktok-narrated/report.json
- qa/wood-frog-tiktok-narrated/contact-sheet.jpg
- qa/wood-frog-tiktok-narrated/frame-01-1.3s.png
- qa/wood-frog-tiktok-narrated/frame-02-3.1s.png
- qa/wood-frog-tiktok-narrated/frame-03-4.5s.png
- qa/wood-frog-tiktok-narrated/frame-04-6.6s.png
- qa/wood-frog-tiktok-narrated/frame-05-8.7s.png
- qa/wood-frog-tiktok-narrated/frame-06-10.2s.png
- qa/wood-frog-tiktok-narrated/frame-07-11.9s.png
- qa/wood-frog-tiktok-narrated/frame-08-13.7s.png
- qa/wood-frog-tiktok-narrated/frame-09-16.1s.png
- qa/wood-frog-tiktok-narrated/frame-10-18.7s.png
- qa/wood-frog-tiktok-narrated/frame-11-21.3s.png
- qa/wood-frog-tiktok-narrated/frame-12-24.0s.png
- qa/wood-frog-tiktok-narrated/frame-13-26.8s.png
- qa/wood-frog-tiktok-narrated/frame-14-29.4s.png
- qa/wood-frog-tiktok-narrated/frame-15-31.3s.png
- qa/wood-frog-tiktok-narrated/frame-16-33.4s.png
- qa/wood-frog-tiktok-narrated/frame-17-35.7s.png
- qa/wood-frog-tiktok-narrated/frame-18-37.8s.png
