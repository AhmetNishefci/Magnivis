# Multi-surface platform QA

Authority: presentation profiles, device/surface evidence, covers and QA gates. PlatformVariant remains the adaptation layer; content master, variant and presentation surface are separate identities. A valid 1080x1920 encode does not prove mobile presentation safety.

Typed capabilities live in `src/platform-variants/presentation.ts`; versioned knowledge lives in `artifacts/presentation-profiles.json`. `artifacts/presentation-qa.json` contains no fabricated device reports. Desktop/web, local approximation and real mobile review are distinct. States: NOT_TESTED, LOCAL_APPROXIMATION, PRIVATE_PREVIEW_PENDING, REAL_DEVICE_PASSED, REAL_DEVICE_FAILED, SUPERSEDED. Passes bind exact media/cover hash, surface, device, time, reviewer and evidence; unknown OS/app values stay null. Desktop passes never satisfy mobile gates.

## Versioned knowledge

| Profile/surface | Current knowledge and lifecycle |
|---|---|
| YouTube V1 / Shorts viewer | Git survivor: top150/right190/bottom310/left84. Owner reports desktop review missed upper-left native back/navigation collision. Historical/superseded for new production; original videos retain original binding. |
| YouTube V2 / Shorts viewer | New-production default policy, ACTIVE but renewed preview pending. Owner supplied approximate top240. Right190/bottom310/left84 are explicitly provisional carry-forward from V1, not recovered V2 measurements. Original V2 source does not survive Git. Exact upper-left exclusion geometry unknown; native controls must be reviewed before trust. |
| TikTok V1 / feed | Git survivor: 140/190/300/72. Historical failed top navigation review, superseded. |
| TikTok V2 / feed | Git survivor: 240/190/310/84. ACTIVE, historical Speed of Light iPhone17 ProMax private pass 2026-09-27. This supports internal design knowledge, not every video/device or universal official guarantees. Native account control is not an in-video watermark. |
| Instagram V1 / Reel playback | Git survivor: conservative 130/170/280/72, PROVISIONAL. Owner reports Wood Frog playback acceptable; exact tested bytes/device evidence unavailable. |
| Instagram profile/grid | Distinct surface, unmeasured. Opening headline historically cropped; preferred dedicated cover. Lost screenshots have not been recovered. |
| Facebook V1 / dedicated viewer | Git survivor: conservative 120/160/270/72, PROVISIONAL. Owner reports broadly acceptable playback. |
| Facebook Page/feed | Distinct surface, unmeasured. Upper opening content historically obstructed/cropped; derivative may be appropriate. Lost screenshots have not been recovered. |
| YouTube/TikTok cover surfaces | Future supported cover capability, geometry NOT_TESTED. |

New policy profiles never mutate the old render/source inputs. ACTIVE does not mean proven for this new artifact; all relevant surface/media hashes still need review. Exact unknown exclusion zones and caption-specific geometry stay null. No new Meta coordinates are activated. TikTok historical profile trust cannot automatically approve recovered Wood Frog's derivative.

## Critical regions and captions

Hook/headline, factual text/numbers, necessary labels, captions, important CTA and required brand marks must clear selected safe regions and native exclusion zones. Decorative background/atmosphere/particles may bleed. `validatePresentationRegions` distinguishes these, checks rectangle containment and UI intersection, and returns UNMEASURED/INCOMPLETE when geometry is unknown. `assessActiveProfiles` supports regression over every ACTIVE profile. Caption region is independent; a visual-safe rectangle does not silently become caption-safe. Reviewed checkpoint CaptionPlan/renderer checks remain valid for their original binding only.

For captions separately inspect top navigation, right rail, bottom description/navigation, optional native overlay and observed device differences. Keep phrase-level speech-first designed captions; do not redesign them during recovery.

## Output strategy and covers

Use ONE_MASTER when it passes relevant surfaces; MASTER_PLUS_COVER when playback works but grid needs framing; SAFE_AREA_DERIVATIVE for native UI collision; SURFACE_DERIVATIVE for Page/feed differences. `PresentationOutput` records master/variant/surface/cover/derivative/evidence independently. It does not auto-render anything.

`CoverAsset` records source video identity/frame, crop, headline region, platform/surface, artifact/hash, provenance, status and approval decision. Unknown crop may remain planned. Approved cover needs its own hashed artifact and owner decision. Covers can support Instagram grid, YouTube Shorts, TikTok and Facebook; no historical cover bytes or fabricated approvals are created here. Surface-specific derivative capability already exists through separate VideoSpecs and explicit artifact relations; the new presentation model records its reason and surface. Meta derivatives are pending measured evidence.

## Renewed real-device checklist

Before trusting a new profile: authorize private preview separately; record exact master/variant/cover hash, platform, surface, mobile device, OS/app version if known, actual test time, reviewer and screenshots/video evidence. Inspect opening hook, all necessary labels/numbers, caption transitions/overlays, right rail and bottom UI, audio and terminal payoff. Record pass/fail and observed collisions. Review desktop/web separately.

Required distinct reviews: YouTube mobile Shorts plus desktop; TikTok mobile feed plus cover; Instagram Reel playback plus profile/grid/cover; Facebook dedicated viewer plus Page/feed. Ask whether a single master works, whether cover solves the issue, or whether measured derivative is necessary. Do not shrink every master into one restrictive rectangle or create unnecessary renders. Changed UI requires a new version, preserved failed/superseded evidence and renewed review. Private preview is an external action requiring separate explicit approval; none is authorized/executed in recovery.

Operator geometry regression: `pnpm platform:qa <critical-regions.json>` checks explicit rectangles against all ACTIVE profiles. It exits nonzero for collisions or incomplete/unmeasured geometry; its output never grants real-device approval. The new-production YouTube default token is `newProductionSafeAreaProfileIds.youtubeShorts`; existing immutable tokens retain V1.

## Phantom Traffic platform milestone

The exact owner-approved master is unchanged at `artifacts/masters/phantom-traffic-candidate-v1.mp4`; logical identity `phantom-traffic.locked-master.v1` is separately recorded with owner-visual scope. Four variants remain editorial-review/ready-for-private-preview; seven distinct context/surface records are local models or pending previews. No upload or device approval. See [owner handoff](../content-intelligence/reviews/phantom-traffic-platform-v1/owner-review.md) and [simple real-device checklist](../content-intelligence/reviews/phantom-traffic-platform-v1/real-device-checklist.md).

Authored region kinds now explicitly distinguish `critical-visual` and `disclosure` from captions/decorative content. Surviving profile geometry remains byte-identical. Native profile regression remains INCOMPLETE because caption regions/exclusion zones are unknown; no gate is weakened. `node --import tsx scripts/validate-traffic-platform-qa.ts` verifies source/evidence integrity and pending state, never grants platform readiness. Instagram has one original cover candidate with null crop; Facebook feed has no speculative derivative.


## Phantom Traffic owner publication exception

Ahmet explicitly accepts the uncompleted six-surface review and authorizes manual publication of this exact locked release. This is an exception recorded in `content-intelligence/reviews/phantom-traffic-publication-v1/owner-decision.json`, not a profile/device pass and not a new universal gate policy. The original cover is selected for publication without claiming device testing. Existing local QA, unknown geometry and historical reports remain unchanged.

Review moves after live publication for YouTube mobile/desktop, TikTok mobile, Instagram playback/grid and Facebook viewer/Page-feed, plus any materially different observed surface. Record actual URL/media identity, observation, context and strongest available evidence; unknown metadata stays unknown. Qualitative owner reports can support observations, not invented coordinates. Append evidence and distinguish hypotheses from verified profile revisions. Lessons may influence future safe-area, caption, critical-region, cover or derivative engineering. Do not modify published Phantom Traffic without explicit remediation authorization or turn its art direction into a template.


## Phantom Traffic postpublication learning

Owner reports correct live desktop/web and mobile presentation where applicable across all four target platforms. Durable record: content-intelligence/reviews/phantom-traffic-closure-v1/owner-live-presentation.json. It is platform/context-level owner evidence, not a measured device capture or individually enumerated grid/feed pass. Historical local/prepublication records stay unchanged; operational review is complete with measured gaps preserved. No profile coordinates or renderer defaults change. Future stories must independently check captions, critical regions and covers; reported success is a hypothesis for applicable engineering, never automatic safe-area truth or art-direction reuse.

## Longitude Clock V2 local review

The exact approved master has nine content-scoped surface assessments under `content-intelligence/reviews/longitude-clock-platform-v1/` and decoded local model sheets under `artifacts/qa-evidence/longitude-clock-platform-v1/`. The model sheets draw only surviving insets, never simulated native UI. Known YouTube/TikTok/Instagram/Facebook playback insets clear critical text/objects and measured typography. Complete native exclusion zones/caption-region geometry remain incomplete. YouTube desktop and all cover/grid/feed crop behavior remain unmeasured. No `testedAt`, device, app, reviewer or real-device pass is invented.

Instagram's centered original cover is a separate review artifact with `crop: null`. Other platforms receive distinct decoded representative-frame recommendations, subject to actual frame-selection/thumbnail controls. Current YouTube guidance permits custom Shorts thumbnails in eligible desktop accounts; historical UI lessons are not a universal current restriction. Actual account verification and controls remain unknown.

The next owner may authorize private/device preview or explicitly accept presentation uncertainty before publication authorization. Local QA and master approval alone grant neither. Frozen historical profile/QA files are unchanged; new records live in content-scoped collections.
