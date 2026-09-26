# Project state

Last updated: 2026-09-27

## DONE

- YouTube channel, public brand, handle, channel settings, and content positioning established externally.
- V1 repository architecture and durable project documentation established.
- Remotion composition, procedural visual system, structured astronomy facts, modular soundscape and narration, render scripts, and automated QA implemented.
- Video 001, `earth-to-stars`, rendered locally with a licensed synthetic voice and checked at 1080×1920 / 30 fps.
- The narrated master passed human review, received timed English captions, and was published manually at `https://www.youtube.com/shorts/bvgmCR2Dtcs`.
- Video 001's initial performance snapshot was recorded in `docs/PERFORMANCE.md` and informed Video 002's shorter, faster structure.
- Video 002, `ocean-depth`, passed research, render, automated QA, private HD/caption review, and was published manually at `https://www.youtube.com/shorts/rfVe_wqDKAQ`.
- Video 002's first 1 day 6 hour performance snapshot was recorded in `docs/PERFORMANCE.md`; its reach was limited, its opening selection was weak, and it nevertheless gained one subscriber.
- Video 003, `billion-dollars`, passed research, render, automated QA, private HD/caption/mobile review, and was published manually at `https://www.youtube.com/shorts/-t6xICbP68s`.
- Video 003's first 21-hour performance snapshot was recorded in `docs/PERFORMANCE.md`; it received a meaningful feed test but had weak opening selection and only 13 seconds average view duration on a 36-second runtime.
- Publishing-ramp Week 1 is complete with three premium Shorts.
- Video 004, `speed-of-light`, has verified NIST/NASA data, original procedural visuals/audio, synthetic narration, a positioned WebVTT track, and a clean production master without burned-in captions. The replacement master passed automated media QA and representative/transition-frame review.
- Video 004 passed private HD, copyright, caption, desktop, and mobile review and was published manually at `https://www.youtube.com/shorts/ATPAdRdrRRw`. A burned-in-caption revision was rejected during private review because enabling YouTube captions produced duplicate text.
- The caption policy now keeps narration captions as optional YouTube tracks. WebVTT requests bottom-center placement, but YouTube clients—especially the mobile Shorts player—retain final control and may override it.
- Video 005, `human-engineering`, has first-party Emaar/CTG/CERN/Swiss government research, original procedural engineering visuals and sound, six modular narration cues, positioned optional captions, and a 31-second production master that passed automated media QA, representative-frame review, and local human review.
- The first long-form candidate, `The True Scale of the Universe`, has a bounded research/story brief in `docs/LONGFORM-001-BRIEF.md`; implementation has not begun.
- The Phase 0 repository audit confirmed a clean `main` branch synchronized with `origin/main`, a passing typecheck/lint/39-test suite, five compilable Remotion compositions, and a passing Video 005 ffprobe/frame QA run.
- The durable strategy now defines Magnivis as one multi-pillar, multi-platform knowledge-media brand whose fundamental editorial unit is a reusable knowledge package. `docs/ARCHITECTURE.md` distinguishes this planned engine from the implemented production subsystem.

## NOW

- Replace Video 001's unpositioned YouTube SRT with `captions/earth-to-stars.en.vtt`, then confirm placement on desktop and mobile.
- Revisit Video 002 when its audience-retention curve finishes processing; use the exact early drop-off to inform future hooks.
- Revisit Video 003 when its detailed retention curve and unique-viewer reports finish processing; identify the first material drop before drawing scene-level conclusions.
- Complete Phase 0 by reviewing and approving the audit/migration proposal before changing production architecture.
- Upload Video 005 privately with `captions/human-engineering.en.vtt` for YouTube HD, copyright, caption-on/off, desktop, and mobile review.
- Preserve the current publishing workflow while the new cross-platform content model is introduced incrementally.

## NEXT

- Record Video 001's seven-day performance snapshot without overreacting to a single upload.
- Record Video 004's first 24-hour performance snapshot after its reports have processed.
- Publish Video 005 manually only after the private platform review passes and the spacing decision is confirmed.
- Implement Knowledge Package V1 after approval, migrate one existing topic, and link its current video spec without changing the render.
- Add long-form and platform adaptation only after the content-intelligence boundary is proven.

## LATER

- Topic discovery assistance, platform export manifests, 6–12 minute landscape production, alternate narration voices, localization, analytics ingestion, owned-site publishing, approved private-upload adapters, queues/databases, and cloud rendering only when justified by the phased roadmap.

## NOT PLANNED

- Autonomous public publishing, monetization/AdSense/account-geography tooling, fake engagement or identity, content-farm generation, speculative infrastructure, or premature multi-brand expansion.

## Human gates

Human approval remains mandatory before any platform upload/publication, paid API usage, questionable-license asset, major infrastructure expansion, or irreversible external action.
