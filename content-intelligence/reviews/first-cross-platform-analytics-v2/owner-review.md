# Magnivis — verified CSV integration and creative intelligence, V2

Prepared 2026-10-11 for **AHMET — ANALYTICS EVIDENCE & CREATIVE INTELLIGENCE OWNER REVIEW**. Five original exports are preserved and parsed; TikTok remains owner-reported. Cycle #12 discovery/production is unstarted. No platform action, historical-media change or broad architecture change occurred.

This report is an **append-only successor** to [V1](../first-cross-platform-analytics-v1/owner-review.md), not a rewrite or retroactive approval. The [intake baseline](../../operations/analytics-intake-2026-10-11-v1/baseline.json) binds all five previous review files and inspected canonical documents/journals. V1's missing-file statements accurately describe its earlier inspection; the evidence has now arrived. Its benchmarks retain their original storyboard-only/audio/transcript inspection limits.

## 1. Decisions supported now

Improve the opening promise, consequential visual progression and earned runtime through the existing creative process. The CSVs confirm view concentration and Instagram Hotter Pan's save concentration; they do **not** establish why those results occurred. Publication age, feed exposure and viewing denominators remain major confounders. Do not convert a popular subject, short runtime or creator style into a production rule.

Three practical findings matter immediately:

- **Verified source observation:** YouTube reports 6,825 aggregate views, while the 16 listed video rows sum to **6,814**. Preserve the unexplained 11-view difference. Daily chart coverage is only five selected videos.
- **Verified source observation:** Instagram Hotter Pan contributes **1,676 of 3,184 lifetime Views** and **11 of 12 Saves** in this exported cohort. Three posts each report three Follows; Hotter Pan is not uniquely strongest on that metric.
- **Interpretation/proposal:** prioritize understanding why a viewer should continue, then visibly reward that promise. The case for this process is strengthened by prior owner production corrections; no current export isolates a specific opening, scene, sound or narrator as the cause of outcomes.

Evidence labels: **V** = directly inspected native CSV values (source fidelity, not independent platform auditing); **R** = existing repository/production evidence; **O** = owner report without inspected native material; **X** = external benchmark evidence with its original inspection limits; **I** = interpretation; **E** = proposed experiment. Calculations use inspected V inputs and are separately identified. Confidence in transcription/arithmetic can be high while creative causality remains unconfirmed.

## 2. Repository reconciliation and scope

Baseline branch remains `content/cycle-11-discovery`, HEAD `d9f089e626f1c0eb27e9dbe6c2a1ca7a092d97ef`. Prior V1 work was already uncommitted; it is preserved. Read AGENTS, project metadata, WORKFLOW-V3 and the requested canonical guidance. Existing dated “current” sections in PROJECT-STATE, OPERATIONS, CONTENT-INTELLIGENCE and ROADMAP remain historical checkpoints; project metadata indexes the present reconciliation. Several whole documentation files are hash-bound by historical discovery/direction evidence, so they remain byte-identical. New [analytics guidance](../../../docs/ANALYTICS.md) describes the implemented extension without rebinding old evidence.

The CSVs contain Craft entries dated October 10 on all three supplied platforms, and other previously scheduled stories. They provide native post/date evidence for these exported rows, not exact uploaded bytes, settings, native-device QA or retrospective authorization. They do not prove TikTok publication. No publication state or journal is rewritten. Native Cycle #10/#11 publication-review revisions26/20 remain unchanged; #11 scheduling remains owner-reported and no Vermeer row appears in this batch.

Existing reuse:

- `src/operations/schema.ts` supplies metric units/definitions and strict snapshots; `registry.ts` supplies existing publication identities. Intake reuses the existing metric-list validation and repository-bound file/hash reader.
- `src/workflow/learning.ts` requires real capture/publication-bound MetricSnapshots; it remains unchanged. Strong audience signals require maturity/support, never invented timestamps.
- `editorial-learning.ts` remains premise-decision context. Master corrections are consulted separately, as AGENTS/PRODUCTION-PLANS already require.
- Content Intelligence remains session-driven and provider-neutral. The new read-only performance context is consulted through an offline command and referenced in existing comparison/history or review prose; it does not automate selection or alter historical prompts/receipts.

## 3. Source inventory, provenance and windows

All original bytes are preserved once under [the intake](../../operations/analytics-intake-2026-10-11-v1/manifest.json), in `sources/youtube`, `sources/instagram` and `sources/facebook`. The manifest records original filenames, owner-supplied paths, bytes, hashes, exact column order and expected record counts. Source paths are public/business analytics context, not credentials. No personal viewer records or credentials were observed in these five exports. Instagram identifies `magnivis.media` / Magnivis, native Account ID `17841417393077629`; Facebook identifies Magnivis, native Page ID `1336222216247095`. Numeric filename suffixes are not assumed to be account/page IDs. YouTube exports omit account/channel ID; owner handoff and exact known post IDs provide the association, not an invented channel identity.

| Source | Data records / columns | Bytes | Original SHA-256 |
|---|---:|---:|---|
| youtube-table | 17 / 9 | 1,805 | `d575e9148cbffd12dd30e454345ab2e252d0e59d48099b587d050abeb3f4580d` |
| youtube-chart | 140 / 6 | 11,907 | `770c3a9ea343966cf6f2acd0b9c850f19495640707deedb9ca401a8d3fbcf13e` |
| youtube-totals | 28 / 2 | 410 | `fb5028f50da533992b4d57a39b7a3913c800153e85baec790f8a6edc5dd91caf` |
| instagram-posts | 11 / 18 | 7,056 | `af703b660e2699bb3adb9000cdda91061ad26ee2d47284785c1af4c72d38b3b8` |
| facebook-videos | 11 / 112 | 9,872 | `1493bbf59a27434bcd32c39e6f9254caa98a72966a773cd78b7113b0d82b3888` |

**207 data records** = YouTube Table17 (one native Total +16 videos), Chart140 (five series ×28 dates), Totals28, Instagram11, Facebook11. Header rows excluded. **38 post records** carry native metrics. CSV record numbers count logical records including the header as record1; Meta multiline descriptions also retain physical line spans. Identifiers remain strings, including Instagram IDs longer than JavaScript's safe integer precision. Leading whitespace in the Billion YouTube ID is preserved in `raw` and trimmed only for normalized identity comparison. Empty cells remain null in parsed native metrics, never zero.

**Collection/export timestamps and timezones remain unknown.** Intake-entry time is explicitly a different field. File modification timestamps, path dates and the present message are not capture evidence. A metadata question was sent; no answer was available when preparing this report.

| Source | Window/grain actually supported | What remains unresolved |
|---|---|---|
| YouTube Chart/Totals | Explicit daily dates **2026-09-13 through 2026-10-10**, inclusive; calendar date bins | Native report timezone and capture instant; latest day's completeness |
| YouTube Table | Same supplied export-folder cohort and exact native aggregate Views reconciliation support association with that selected range; table itself has no range header | Association is inferred from export context, not an explicit table date field; owner/export-settings confirmation desirable |
| Instagram | Every `Date` cell explicitly **Lifetime**; filename range Sep13–Oct10 identifies selected-content context | Lifetime endpoint/capture time; publication timezone; full account scope/crosspost/paid attribution |
| Facebook | Every `Date` cell explicitly **Lifetime**; same filename selection context | Lifetime endpoint, publication timezone, definitions/tooltips and precise remote mappings |

No metric is relabeled lifetime or fixed-window merely to make platforms comparable. Native Meta Publish time is `MM/DD/YYYY HH:mm`, with normalized **date only** alongside the original string; no UTC/Kosovo conversion is inferred. The 11:00/11:01 pattern does not prove a schedule change. YouTube publication dates are date-only; true elapsed post ages cannot be calculated. Calendar dates show older and newer cohorts, but not exact age-at-capture or equally mature windows.

## 4. Mapping and publication integrity

[Mappings](../../operations/analytics-intake-2026-10-11-v1/mappings.json) explicitly disposition every post row:

| Disposition | Rows | Evidence and limit |
|---|---:|---|
| Exact existing PublicationRecord | **3** | YouTube Speed of Light ID `ATPAdRdrRRw`, YouTube Traffic `3jmxLXcowC8`, Instagram Traffic shortcode `Dd89-PvFDqn`. Instagram numeric Post ID and shortcode remain separate; `/p/` and `/reel/` paths share the recorded shortcode |
| Exact legacy remote ID | **3** | YouTube Earth, Billion and Ocean match legacy URLs in PERFORMANCE. No fabricated generalized publication/source chain |
| Candidate story/production association | **32** | Ten other YouTube titles/dates/durations, ten Instagram descriptions/dates/durations and eleven tentative Facebook date/duration correspondences |
| Entirely unassigned story | **0** | Every row has a plausible story candidate, but this does not resolve the 32 ambiguous exact-publication mappings |

Facebook has blank **Title**, **Universal video ID** and no Permalink column in every row. Its Traffic candidate asset ID `1124639570513284` differs from existing Reel post ID `2300822597344788`; asset/post identity equivalence is **not** asserted. All eleven Facebook story associations remain tentative. Do not treat the publishing cadence as proof that no alternative/reupload exists.

Prepared-release candidates are hash-bound when available, identifying possible cycle/variant/media relationships. They are not assigned as confirmed uploaded PlatformVariants. Rounded platform durations (e.g. 81/82/83 seconds across Meta/YouTube) are native observations, not evidence of a creative change or exact-media match. Canonical upload/delivery identity requires additional evidence. Dates/remote IDs alone do not supply missing publication authorization or device QA.

## 5. YouTube findings and discrepancies

**V:** native Total Views **6,825**; daily Totals sum **6,825**. Video rows sum **6,814**. Total thumbnail impressions **3,921** versus video-row sum **3,912**. Total Watch time **16.9105h** versus row sum **16.8539h**: difference **0.0566h** (203.76s). The difference is not repaired or attributed. Possible report scope, refresh, filtering or omitted allocation must be checked with native export settings; none is established as the cause.

Top six sum **5,945**: **87.1% of the native total**, or **87.2% of the listed-row sum**. V1's top-video values and 87.1% native-total share are confirmed. Its implied remaining-ten **880** is corrected: the ten listed rows actually sum **869**, with11 additional aggregate views unallocated. No per-video total or watch-hour discrepancy is silently normalized.

| Candidate video / production | YouTube ID | Native publish date | Duration s | Views | AVD s | AVD/duration* | Watch h |
|---|---|---|---:|---:|---:|---:|---:|
| speed-of-light | `ATPAdRdrRRw` | 2026-09-26 | 34 | 1629 | 18 | 52.9% | 3.8542 |
| phantom-traffic | `3jmxLXcowC8` | 2026-10-01 | 35 | 1342 | 24 | 68.6% | 4.6948 |
| earth-to-stars | `bvgmCR2Dtcs` | 2026-09-22 | 43 | 1082 | 20 | 46.5% | 2.5815 |
| billion-dollars | `-t6xICbP68s` | 2026-09-25 | 36 | 871 | 15 | 41.7% | 1.6617 |
| human-engineering | `UTZmqCFew_I` | 2026-09-27 | 32 | 521 | 19 | 59.4% | 1.1204 |
| chladni-sand | `PS0K2amRIuo` | 2026-10-05 | 43 | 500 | 16 | 37.2% | 1.0438 |
| wood-frog | `OkZxSqAfbps` | 2026-09-29 | 41 | 218 | 14 | 34.1% | 0.2705 |
| paper-half-shape | `BrT6aLMvu68` | 2026-10-04 | 53 | 161 | 19 | 35.8% | 0.1661 |
| ocean-depth | `rfVe_wqDKAQ` | 2026-09-24 | 33 | 104 | 19 | 57.6% | 0.2247 |
| chocolate-crystal-choice | `cojsKD4YLxA` | 2026-10-03 | 40 | 97 | 18 | 45.0% | 0.1937 |
| heat-barrier-v4 | `TW7pFCcjn4s` | 2026-10-06 | 42 | 82 | 17 | 40.5% | 0.2168 |
| oklo-v5 | `nypxYEoWZFI` | 2026-10-08 | 60 | 66 | 42 | 70.0% | 0.383 |
| two-goals-v2 | `x4-sZpeFdHc` | 2026-10-09 | 83 | 64 | 34 | 41.0% | 0.2451 |
| interaction-free-v3 | `BkprrNo_tE0` | 2026-10-07 | 54 | 30 | 22 | 40.7% | 0.0566 |
| longitude-clock-locked | `LDNHrp0RdMU` | 2026-10-02 | 48 | 28 | 24 | 50.0% | 0.0667 |
| craft-escape-v3 | `hkofIk-YiCU` | 2026-10-10 | 82 | 19 | 32 | 39.0% | 0.0743 |

*Derived descriptive average/duration ratio, **not completion** or whole-audience retention. It inherits native AVD's engaged-view denominator. [YouTube's official engagement documentation](https://support.google.com/youtube/answer/9313698?hl=en), inspected 2026-10-11, identifies engaged views and corresponding watch time as the basis. Raw Shorts Views count starts/replays without a minimum watch-time requirement under the [official Shorts definition](https://support.google.com/youtube/answer/10059070?hl=en). Do not reconstruct engaged-view counts from rounded AVD/watch hours or divide watch hours by raw Views to replace native AVD.

**V:** Chart includes only Billion871, Traffic1,342, Light1,629, Engineering521 and Earth1,082: total **5,445**, exactly matching those five table rows. This is **not** missing1,380 from channel totals; it is selected-series coverage. Chart and Totals must not be added. Daily channel peak is Sep26 **1,402**, followed by Oct1 **1,358**; these are date-bin observations, not proof of preferred weekday/time or editing technique.

**V anomaly:** Billion Chart record 13 reports one view on Sep24, while native publish date is Sep25. Preserve both; unknown timezone, visibility transition or export inconsistency prevents treating that bin as a precise prepublication/public-post-age event. No first24h metric is reconstructed from calendar daily bins.

**I:** Light/Earth/Engineering scale treatments and Traffic are reasonable precedents for readable changing relations. They are older, differently distributed stories; no matched-cohort evidence shows a winning format/domain. Chladni's500 Views also cautions against equating owner premise preferences with audience outcomes. Oklo's42s native AVD on a60s post is a70.0% descriptive ratio at only66 raw Views; this contradicts a simplistic “all longer videos fail” claim, but does not validate its full completion or topic superiority. Recent Craft19 and Two Goals64 Views must not be judged against older posts' accumulated exposure. No export provides engaged-view counts, feed shown/stayed-to-watch, per-video traffic source, subscriber conversion, unique viewers or retention curves.

Thumbnail CTR is not Shorts-feed swipe selection. Oklo20.78% has77 thumbnail impressions; it establishes neither a feed-hook success nor a stable thumbnail rule. Different discovery surfaces and small denominators remain relevant.

## 6. Instagram findings

**V:** 11 Lifetime Reels sum **3,184 Views, 2,787 post Reach, 47 Likes, 36 Shares, 9 Follows, 11 Comments and12 Saves**. Reach is a sum of per-post values, not unique account reach. V1's owner totals and Hotter Pan figures are confirmed.

| Candidate video | Native publish date | Duration s | Views | Reach | Shares | Saves | Follows |
|---|---|---:|---:|---:|---:|---:|---:|
| craft-escape-v3 | 2026-10-10 | 81 | 138 | 109 | 5 | 0 | 0 |
| two-goals-v2 | 2026-10-09 | 82 | 153 | 140 | 5 | 0 | 0 |
| oklo-v5 | 2026-10-08 | 59 | 141 | 125 | 5 | 0 | 0 |
| interaction-free-v3 | 2026-10-07 | 53 | 58 | 110 | 4 | 0 | 0 |
| heat-barrier-v4 | 2026-10-06 | 41 | 1676 | 1442 | 6 | 11 | 3 |
| chladni-sand | 2026-10-05 | 42 | 135 | 114 | 0 | 1 | 0 |
| paper-half-shape | 2026-10-04 | 52 | 273 | 248 | 0 | 0 | 0 |
| chocolate-crystal-choice | 2026-10-03 | 39 | 150 | 133 | 1 | 0 | 0 |
| longitude-clock-locked | 2026-10-02 | 47 | 159 | 136 | 5 | 0 | 3 |
| phantom-traffic | 2026-10-01 | 34 | 238 | 185 | 5 | 0 | 3 |
| wood-frog | 2026-09-29 | 40 | 63 | 45 | 0 | 0 | 0 |

**Derived:** Hotter Pan52.6% of Views,51.7% of summed post Reach,91.7% of Saves,16.7% of Shares and33.3% of Follows. Its11 Saves /1,442 Reach is0.76 save events per100 reported reached accounts, not a proven unique-person save conversion. [Auditable inputs/formulas](analysis.json) preserve each exact cell.

**I:** A clear everyday expectation reversal with an explanatory payoff is worth testing across unrelated opportunities. One post is insufficient to establish topic, opening, animation, narration or music causality. Longitude and Traffic each report3 Follows too, despite159/238 Views; three events are too few for a stable conversion ranking, yet they directly rebut dismissing Longitude as without follow-worthy value. Do not infer comprehension or returning loyalty from saves/follows alone.

**V:** Interaction-Free Views58, Reach110. Preserve this apparent ordering; the export provides insufficient attribution/refresh/definition detail to force Views≥Reach. Do not “fix” it or derive a unique-viewing probability. Every row reports one Comment; prior owner comments exist, but this CSV contains no authors/text. These cannot be counted as11 independently demonstrated learning responses.

No watch-time, completion, repeat-viewing, traffic-source, geography or retention data is supplied. Meta help pages attempted on 2026-10-11 redirected to login; exact current export tooltips were unavailable. Native names remain intact, with attribution/uniqueness unknown where required. Neither historic Instagram watch-time guidance nor advertising guidance is used to invent absent metrics.

## 7. Facebook findings and retention limits

**V:** 11 Lifetime videos sum **2,157 post Reach,473 3-second video views,419 3-Second viewers,9 1-minute video views,10,307.713 Seconds viewed,22 Reactions,11 Comments and0 Shares**. Unique viewers must not be summed across videos as channel people. No general `Views` field is present; 3-second counts are not YouTube/Instagram Views. Native average seconds range **2.281–11.060**, confirming V1's approximate2.3–11.1.

| Tentative story association | Video asset ID | Duration s | Reach | 3-second views | Average Seconds viewed | Seconds viewed |
|---|---|---:|---:|---:|---:|---:|
| wood-frog (tentative) | `1090940843898143` | 41 | 186 | 35 | 3.921 | 800.069 |
| phantom-traffic (tentative) | `1124639570513284` | 35 | 127 | 47 | 4.999 | 731.954 |
| longitude-clock-locked (tentative) | `1684362383213138` | 48 | 225 | 33 | 4.624 | 1086.873 |
| chocolate-crystal-choice (tentative) | `1087423553879854` | 40 | 222 | 27 | 2.464 | 537.166 |
| paper-half-shape (tentative) | `1804692670558879` | 53 | 174 | 21 | 2.281 | 396.918 |
| chladni-sand (tentative) | `1432121365710907` | 43 | 205 | 70 | 4.742 | 962.628 |
| heat-barrier-v4 (tentative) | `1758074082113820` | 42 | 56 | 30 | 11.06 | 652.449 |
| interaction-free-v3 (tentative) | `1794364248273961` | 54 | 200 | 45 | 6.101 | 1170.136 |
| oklo-v5 (tentative) | `974079688354786` | 60 | 353 | 74 | 5.391 | 1940.864 |
| two-goals-v2 (tentative) | `1770659317537757` | 83 | 211 | 32 | 3.07 | 635.577 |
| craft-escape-v3 (tentative) | `2609598729500428` | 82 | 198 | 59 | 7.035 | 1393.079 |

**Derived/source observation:** Recommendation Seconds viewed sum **9,383.568**, Followers **924.145**; together equal total Seconds viewed. Recommendation watch seconds are **91.0%** of total native watch seconds. This is a watch-time-source share, not a TikTok For You traffic rate or a proportion of reached viewers. All Boosted-post average cells are0, but there is no complete paid/organic view breakdown; zero averages alone do not prove no boost/ad exposure.

Hotter Pan candidate has the highest average11.060s but the lowest Reach56, with30 3-second views/28 3-Second viewers. **I:** it merits attention as a potentially clearer/value-bearing treatment; this small differently distributed sample cannot establish a platform winner. Oklo candidate has the highest Reach353 but average5.391s; exposure and attention answer different questions. No cohort-weighted aggregate AVD is created because its native averaging denominator is unavailable. Seconds viewed/Reach or Seconds viewed/3-second views is not substituted for native Average Seconds viewed.

**Retention:** all112 columns are preserved. There are two distinct families, `Percentage of total views at interval N` and `Percentage of 15-second views at interval N`, each with indices0–40, in a nonchronological CSV header order. Values span0–1; these literal fractions are retained with explicit unverified semantics. Blank late Traffic cells remain absent, not0. Some curves rise between adjacent indices, and first cells are0.94/0.97 rather than always1. Do not smooth, clamp or renormalize them.

Indices are **not assumed to be seconds**, their viewing denominator is unverified, and values are not relabeled whole-video completion. For example Craft candidate total-family index5 is0.36, while15-second-family index5 is1: different denominators must stay separate. Without native tooltips/UI mapping, these fields cannot prove first-second drop-off, exact payoff timing or serve as real-time retention overlays on master scenes. General low native average seconds makes an attention/comprehension investigation reasonable; a scene-specific cause remains unknown.

## 8. TikTok remains provisional

**O only:** owner reports reviewing nine videos and weak early retention; five reported pairs remain Hotter Pan6.99s/2.9%, Ship's Clock3.82s/1.4%, Vibration4.15s/2.2%, A45.12s/1.9%, Frog5.25s/4.7%. Several screenshots reportedly showed largest departure around0:01; most observed traffic reportedly came from For You. Screenshots were not supplied or inspected. No TikTok native records, timestamps, view counts, processed lengths or validated LearningSignals are fabricated.

**Hypothesis:** unclear/delayed promise or competing opening information may contribute. **Alternatives:** audience mismatch, distribution, story familiarity, pace, accessibility, narration or platform presentation. Available evidence isolates none. Test opening comprehension first because it is controllable and editorially useful, not because0:01 proves its cause.

## 9. Reassessment and confidence

| V1 finding | V2 disposition/confidence |
|---|---|
| Owner YouTube total/top6 numbers | Confirmed native Total/top6; high source/arithmetic confidence. Listed-row aggregate differs; causal confidence absent |
| Remaining ten inferred880 | **Corrected to869 listed**,11 unallocated; high arithmetic confidence |
| Instagram totals/Hotter Pan standout | Confirmed Lifetime source values; high observation confidence, provisional reason. Follow leadership is tied |
| Facebook reach/average range | Confirmed; high transcription confidence. Story mappings and retention semantics remain limited |
| Reporting window unknown | Partly resolved:28 dated YT bins; Table association qualified; Meta explicitly Lifetime. Capture/zone remain unknown |
| Opening/progression/pacing priorities | Remain useful process proposals, strengthened by R corrections; audience causes unproven |
| Competitor creative lessons | Reused from exact V1 benchmark record; no new audio/full-video inspection or performance claims |
| Fixed duration, narrator replacement, domain narrowing or style cloning | Still unsupported |

The reusable context preserves four evidence levels without a quality score: verified source observations; supported repeated production corrections; plausible audience hypotheses; creative experiments. All contextual audience strength stays weak and maturity unknown. A production defect-prevention lesson can have strong practical confidence without being a strong statistical audience signal. No report grants owner approval.

## 10. Creative intelligence and Cycle #12 preparation

The intended viewer experience remains **Surprise → Curiosity → Understanding → Memorability → Anticipation**, not a compulsory scene template. Discover first, classify second. After separate start authority, select an independently compelling honest premise and valuable payoff across the open topic universe. Current measurements do not recommend a subject for #12.

| Priority / recommendation | Evidence/rationale | Expected benefit / risk | Existing home and validation |
|---|---|---|---|
| Opening image + first clause make the truthful promise legible | R creative standards; O early TikTok concern; V cannot isolate cause. High process, provisional audience confidence | Immediate reason to continue; risk of oversimplified or false shock | Existing hook candidates/CreativeDirection; compare materially different concepts when useful, check independent hook truth and cold-viewer understanding |
| Consequential narrative/visual progression | R Craft/Vermeer repeated master corrections; creator preview precedents | Viewer sees changing evidence/relations; decorative movement can obscure them | Existing VisualPlan/ProductionPlan and separate rendered editorial review; identify concrete scene/time developments |
| Meaningful visual explanation | V contrasting platform outcomes invite comprehension study, not animation attribution; X Steve Mould cutaways, Zack object continuity, Kurz explanatory system geometry | Demonstrate the relationship; risk of invented reconstruction or visual overload | Choose original2D, selective spatial depth, map/timeline/archive/typography per verified story; phone-scale/device QA remains distinct |
| Earned runtime and pauses | R Oklo compression; V Oklo longer AVD ratio argues against universal limits | Remove redundant setup while preserving necessary explanation/caveats | Script/narration/caption timing; compare two internal routes only when useful, judge retelling accuracy |
| Narration/pronunciation and restrained sound | R Grenada correction and modular pipeline; no V sound cause | Clear semantic delivery and appropriate suspense; masking/rights/rework risks | Retain Kokoro af_heart; inspect complete speech units/proper names and exact mixed master. Sound or silence serves story, not trend |
| Memorable resolution | Brand objective; save/follow counts are incomplete satisfaction proxies | Viewer can explain the idea; risk of repetitive CTA/forced moral | End at satisfying factual resolution, test caveat-preserving retelling/recall; no artificial cliffhanger |
| Platform-specific packaging | V metric/distribution differences; native processed lengths differ | Clear destination promise/readability; risk of causal thumbnail/CTR inference | Existing PlatformVariant copy/cover/native QA; distinct presentation when justified, exact master/version binding |

Cleo's contextual image/overlay progression and Veritasium's real demonstration/challenge are useful principles for a faceless treatment, not authority to copy host/voice/assets. V1 creator sources, publication dates and preview limits remain the benchmark evidence. First spoken sentences, emotional voice delivery, music mix, full transitions and exact payoff timing were not verified in those previews. No proprietary scripts, artwork, voice identities or unlicensed audio will be reused.

Original2D and existing Remotion/SVG/CSS primitives are sufficient to explore these recommendations. Selective3D or rights-cleared archival material is eligible when it solves a concrete explanation problem; no new engine, paid service or permanent format palette is justified. Burned-in captions remain speech-first, source-faithful and platform-safe. Primary narrator continuity is independent of adaptive music/silence. Existing documentation already requires prior master-correction application and exact rendered-sequence review; add no duplicate ledger/gate.

## 11. Controlled experiments and ongoing learning

**First experiment after separate production authority:** internal same-question opening comparison. Change the opening presentation only, preserving verified central promise, selected narrator and necessary downstream explanation. Describe the small human panel/inspection conditions; ask what question they expect answered after the opening. False expectations disqualify a hook regardless of attention. This is qualitative comprehension work, not randomized public-platform A/B evidence.

**Next, separately:** compare one continuous explanatory object/state treatment with an appropriate diagram/panel alternative for the same verified passage. Assess accurate one-view retelling and specific confusion; animation need not win. Later test earned compression, then a speech-matched licensed sound/silence comparison, then ending recall. Do not change all variables together. No reupload or alternative historical master is authorized.

For future approved publications, predeclare a native primary measure and comparison rationale. Collect exact-time first-day and approximately one-week snapshots when feasible; these are opportunities, not new gates. Compare within platform at aligned ages/windows, with duration, traffic source, sample size, paid context and publishing/variant differences explicit. YouTube needs engaged Views + shown-in-feed/stayed-to-watch + curves; Instagram needs watch/replay/retention and source context; Facebook needs interval/averaging definitions and post-identity corroboration; TikTok needs original screenshots with counts/labels/times. Small samples remain descriptive. Observational future cohorts do not isolate causality simply because other variables are recorded.

Use saves/shares/follows alongside actual comprehension feedback, repeat-viewing/returning-viewer scope where available, source trust and production cost. No current data verifies anticipation, loyalty, explanation comprehension or production efficiency. Native audience comments with authors/text would be useful; the one-per-post Comment counts cannot substitute. Record active effort, render time, rework and cost when actually measured; unknown otherwise.

## 12. Minimal implementation, validation and owner gate

Implemented: five immutable source files; provenance/mapping/baseline manifest; deterministic parsed observations/calculations; this V2 reconciliation; bounded CSV importer; read-only Content Intelligence context; focused tests; additive analytics documentation and current project metadata. No vendor/API call, credentials, database, model optimizer, publishing adapter, historical schema migration or render change.

Run commands and future-batch preparation are in [ANALYTICS](../../../docs/ANALYTICS.md). Identical imports are idempotent; changed source/schema/mapping/output requires a new batch. Typed MetricSnapshot/validated LearningSignal promotion is deferred until real capture/window/publication prerequisites exist. The current source data is durably ingested even though zero strict snapshots are eligible.

Validation passed: **pnpm check** (typecheck, lint, **53 test files / 501 tests**, whitespace), **pnpm artifacts:durable** (957 canonical payloads / 731 existing durable artifacts), deterministic intake/context verification and independent source-cell arithmetic/preservation audit. Actual results and bindings are recorded in [validation](validation.json). Tests target CSV precision/quoting/blanks, source tampering, scope errors, exact/candidate mapping safety, independent sums, retention families and overwrite refusal. No smoke/full render is required because rendering did not change; future visual production still requires repository render/QA/editorial/device protocols.

Remaining follow-ups: exact download/capture times/timezones; native selected-range confirmation; YouTube aggregate gaps; Facebook asset↔post mapping and retention tooltips; exact upload identities; organic/paid and traffic denominators; TikTok screenshots; returning-viewer/comprehension/cost evidence. These limit inference, not preservation of verified CSV cells.

**AHMET — ANALYTICS EVIDENCE & CREATIVE INTELLIGENCE OWNER REVIEW.** Review this successor report and proposed application/experiments. Next: supply any available metadata/definition corrections, then separately authorize Cycle #12 discovery if ready. No topic has been selected, no production begun, and no broad architecture or main integration is authorized by this handoff.
