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
- The durable strategy now defines Magnivis as an open-ended curiosity/understanding brand whose fundamental editorial unit is a reusable knowledge package. Discovery precedes classification; broad pillars support analytics and never whitelist subjects.
- Knowledge Package V1 is implemented with quantitative/qualitative claims, evidence references, five verification states, reviewed approval metadata, claim-linked hooks/opportunities, and a deterministic duplicate-safe registry.
- `speed-of-light` is the first production knowledge package. Video 004 reaches its package/claim/hook selection through a ContentAsset, and `src/data/light.ts` projects unchanged numeric inputs for the existing composition without duplicating factual values.
- Content Asset V1 is implemented with platform-neutral purpose/angle, package hook and claim selection, factual script traceability, narrative beats, visual intent, narration direction, approval state, and a deterministic registry.
- The `speed-of-light` package backs two assets: the production-ready published Video 004 story and a distinct unproduced cosmic-distance draft. Video 004 reaches the production asset through its YouTube Shorts variant and derives narration text from the asset without changing render inputs.
- Ocean Depth generalization is complete. The production `ocean-depth` KnowledgePackage models qualitative claims, a conventional approximate range, scalar measurement uncertainty, and survey-dependent context; its production ContentAsset supplies Video 002's unchanged narration, and the compatibility projection supplies unchanged numeric composition inputs.
- The KnowledgePackage taxonomy now uses seven broad analytics pillars plus open normalized domains/topics. Existing Speed of Light and Ocean Depth packages are migrated, and validation proves philosophy, medicine/anatomy, biology, and movie-plus-physics classification requires no domain enum or source-code authorization.
- PlatformVariant V1 is implemented for YouTube Shorts, TikTok, Instagram Reels, and Facebook Reels using dated platform profiles, versioned safe-area profiles, claim-safe packaging, approval/readiness invariants, and deterministic registration.
- One production Speed of Light ContentAsset now backs four meaningful platform adaptations. The YouTube and TikTok revision 2 variants are production-ready; Instagram and Facebook remain in editorial review. None publishes anything automatically.
- Platform Delivery Package V1 generates and validates portable manual-upload folders for all four Speed of Light variants. Every folder contains the verified master, exact metadata/copy, a review checklist, source revisions, ffprobe media facts, and SHA-256 hashes; YouTube also contains the reviewed WebVTT.
- The YouTube and canonical TikTok revision 2 deliveries are `ready-for-manual-upload`; Instagram and Facebook remain `draft-review`. Ready means the artifacts passed their defined gates, not that public publication has been authorized.
- TikTok private iPhone preview pass 1 failed because native top navigation crowded the top-left information block. Revision 2 moves all top information blocks down 90 px with `safe-area.tiktok-feed.v2`. It passed private Only Me visual/editorial QA on an iPhone 17 Pro Max on 2026-09-27, including UI clearance, cover crop, audio, animation, and confirmation that the completed counter reaches 7.5×. The revision 1 delivery is superseded.
- Videos 001, 003, and 005 intentionally remain on the legacy fact path. PublicationRecord and publishing integrations remain planned and unimplemented.

## NOW

- Replace Video 001's unpositioned YouTube SRT with `captions/earth-to-stars.en.vtt`, then confirm placement on desktop and mobile.
- Revisit Video 002 when its audience-retention curve finishes processing; use the exact early drop-off to inform future hooks.
- Revisit Video 003 when its detailed retention curve and unique-viewer reports finish processing; identify the first material drop before drawing scene-level conclusions.
- Keep the approved TikTok revision 2 package unchanged until explicit publication approval. Perform first Instagram and Facebook draft/private previews separately.
- Upload Video 005 privately with `captions/human-engineering.en.vtt` for YouTube HD, copyright, caption-on/off, desktop, and mobile review.
- Preserve the current manual, human-approved publishing workflow. Delivery generation and validation perform no external action.

## NEXT

- Record Video 001's seven-day performance snapshot without overreacting to a single upload.
- Record Video 004's first 24-hour performance snapshot after its reports have processed.
- Publish Video 005 manually only after the private platform review passes and the spacing decision is confirmed.
- After real-platform previews, update only the packaging/safe-area/caption details proven necessary and approve variants individually. Do not implement publishing APIs without approval.
- Add long-form production only after the content-intelligence and asset boundaries are proven.

## LATER

- Topic discovery assistance, PublicationRecords, 6–12 minute landscape production, alternate narration voices, localization, analytics ingestion, owned-site publishing, approved private-upload adapters, queues/databases, and cloud rendering only when justified by the phased roadmap.

## NOT PLANNED

- Autonomous public publishing, monetization/AdSense/account-geography tooling, fake engagement or identity, content-farm generation, speculative infrastructure, or premature multi-brand expansion.

## Human gates

Human approval remains mandatory before any platform upload/publication, paid API usage, questionable-license asset, major infrastructure expansion, or irreversible external action.
