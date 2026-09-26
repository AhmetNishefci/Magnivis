# Project state

Last updated: 2026-09-26

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
- Video 004, `speed-of-light`, has verified NIST/NASA data, original procedural visuals/audio, synthetic narration, positioned captions, and a production master that passed automated media QA and representative/transition-frame review.
- Video 004 was uploaded privately for YouTube processing and final platform review.
- Mobile review showed that the Shorts player overrides WebVTT placement, so Video 004 now has a replacement master with deterministic bottom-centered open captions. The reusable `ShortOpenCaptions` primitive and structured cue model apply to narrated Shorts from Video 004 onward.
- The first long-form candidate, `The True Scale of the Universe`, has a bounded research/story brief in `docs/LONGFORM-001-BRIEF.md`; implementation has not begun.

## NOW

- Replace Video 001's unpositioned YouTube SRT with `captions/earth-to-stars.en.vtt`, then confirm placement on desktop and mobile.
- Revisit Video 002 when its audience-retention curve finishes processing; use the exact early drop-off to inform future hooks.
- Revisit Video 003 when its detailed retention curve and unique-viewer reports finish processing; identify the first material drop before drawing scene-level conclusions.
- Begin Week 2 planning: four premium Shorts and one first long-form video, with quality remaining the hard gate.
- Replace Video 004's original private upload with the open-caption master, then complete YouTube HD, copyright, and mobile playback review before manual publication.
- Research and storyboard the first long-form video against `docs/LONGFORM-001-BRIEF.md` before building a landscape composition.

## NEXT

- Record Video 001's seven-day performance snapshot without overreacting to a single upload.
- Publish Video 004 manually after its platform review and an approximately 24-hour gap from Video 003.
- Measure whether reusable components are reducing production time without lowering quality.

## LATER

- 6–12 minute landscape engine, alternate narration voices, subtitles/localization, research assistance, dedicated thumbnails, metadata assistance, private-upload automation, analytics feedback, and cloud rendering only when justified.

## NOT PLANNED

- Automated public publishing, monetization/AdSense/account-geography tooling, content-farm generation, databases, queues, microservices, or speculative infrastructure.

## Human gates

Human approval remains mandatory before any upload/publication, paid API usage, questionable-license asset, major infrastructure expansion, or irreversible external action.
