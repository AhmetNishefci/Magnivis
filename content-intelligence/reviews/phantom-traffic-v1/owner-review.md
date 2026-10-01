# Traffic waves — Cycle 1, Milestone 2 owner review

**Owner: Ahmet Nishefci. Status: ready for owner decision; no editorial or production approval.** Prepared on 2026-10-01 Europe/Belgrade (2026-09-30 UTC). Topic selection authorizes bounded research and an editorial proposal only. The historical discovery snapshot stays immutable; `selection.json` records the new instruction and candidate revision 2 remains `researching`.

## Research conclusion

Phantom jams are real in the important, limited sense that stop-and-go traffic can form without a physical obstruction or external bottleneck. Cars interact through following responses; differences in speed and spacing can attenuate or amplify. Under unstable conditions, growing disturbances can produce a slow/stopped cluster. Density changes available spacing and the operating state, but does not guarantee instability. No unique guilty driver or necessary deliberate brake tap was established.

In the observed ring jam, cars entered the slow cluster at its rear and accelerated out at its front. Its membership changed. The slow/stopped **pattern moved upstream relative to the road**, while cars continued in their forward travel direction. “A traffic jam can move backward” is a defensible hook when the scene immediately identifies the moving pattern. “Cars move backward” is false. Do not confuse passing a disturbance backward through the vehicle sequence with proof of upstream motion relative to the road; the experimental trajectories establish the latter here.

An empty road at the end of a queue does not diagnose its origin. A prior obstruction may already have cleared. Bottleneck queues and internally generated waves can both occur; wave behavior does not make accidents, ramps or roadworks irrelevant.

## Original experiment: what was inspected and demonstrated

Sugiyama et al., 2008, New Journal of Physics 10, 033001, DOI 10.1088/1367-2630/10/3/033001. Full seven-page article inspected from the institutional PDF, with figures 2–4 visually inspected from the original. Web access failed; a direct institutional download succeeded. The PDF has two cover pages before article page 1.

- Flat, homogeneous circular lane, 230 m circumference, 22 vehicles (article p. 4 / figure 2).
- Before the experiment, vehicles were brought to approximately 30 km/h with almost uniform spacing. Drivers were instructed to try to maintain that speed while following safely. The selected spacing/speed was deliberately demanding and intended to favor instability; the paper does not report instructing a particular driver to brake.
- Small headway fluctuations appeared and grew. Some cars stopped briefly. Figure 3 contrasts the initial flow with a snapshot three minutes later; five cars are in the jam at that particular instant. Neither three minutes nor five cars is a universal onset/size rule.
- The cluster moved opposite to the driving direction at roughly 20 km/h (pp. 5–6 / figure 4). That is a scoped approximate observation, not a universal speed. No wave-speed number is proposed in narration.
- A central 360-degree camera supplied the individual trajectories shown over a two-minute interval in figure 4. Cluster turnover is described explicitly on p. 5. A 23-car trial is also mentioned, but this paper did not systematically map the instability density range.
- Conclusion supported here: no external bottleneck is necessary for this mechanism in this setup. Not demonstrated: every highway jam has this origin; density alone determines every outcome; reaction delay is the sole cause; one driver caused the jam; all drivers brake progressively harder; universal thresholds/speeds.
- Limitations: short periodic ring, fixed vehicle count, no ramps/lane changes, constrained speed/spacing conditions; no independent raw-video/data analysis or causal isolation of driver response parameters. Figure 5 reuses earlier highway trajectories; that underlying dataset was not independently inspected.

## Broader mechanism and terminology

**Density** counts vehicles per road length; greater density constrains average spacing. **Following distance/headway** describes separation, with conventions that can include vehicle length. **Time gap** is a temporal separation measure; **reaction delay** is response timing. They are not interchangeable.

Drivers adjust acceleration/deceleration to vehicles ahead. Finite acceleration response, delay, desired gap and anticipation affect stability in car-following models. **String instability** means disturbances can grow through a sequence of vehicles; local stability of one following pair does not ensure string stability of the whole line. Treiber/Kesting/Helbing explicitly discuss instability even without an explicit reaction-delay term, so “reaction time causes phantom jams” is too narrow.

For some conditions small disturbances decay; in others they grow. Finite disturbances and nonlinear responses can give different outcomes from infinitesimal linear perturbations. The 2013 follow-up provides indications of metastability at intermediate density and a very-high-density nearly homogeneous slow-flow session. Do not convert “sufficiently dense under unstable conditions” into “all traffic beyond one density must jam.” This milestone does not choose or validate a quantitative traffic simulator.

**Stop-and-go wave** describes recurring slowdown/acceleration patterns or moving clusters. A **kinematic wave** describes propagation of a traffic state; a **shockwave** is an abrupt transition/boundary between states with different speed, density and flow. A cluster can have multiple boundaries. Bottleneck queues also have moving boundaries, and not every forming/recovery boundary moves backward. The proposed short explains one internally generated, backward-moving slow cluster; it does not teach a universal shockwave equation.

The longer 2013 indoor experiment used a 314 m ring and 19 sessions with 10–40 cars, with laser position measurements. Its main text, table 1, key figure captions and Appendix A were inspected. Driver caution/training varied, and the authors excluded several first-day sessions from principal analyses. Its numerical density estimates are not transferable universal constants and are omitted from the short.

## Evidence-backed claims proposed for owner promotion

No claim is currently `verified`. Repository-native `supported` means the inspected evidence aligns with the exact scope while human verification is pending. The audit recommends verification of retained claims only **if Ahmet approves**. The exact hashes and decisions are in `claim-review.json`; rejected statements stay `unverified` and are excluded.

- **`phantom-traffic.claim.backward-pattern`** — A slow or stopped traffic pattern can move backward relative to the road while the cars travel forward. Evidence: `source.traffic.sugiyama-2008` — Article pp. 5–6; figure 4
- **`phantom-traffic.claim.vehicles`** — The reported 2008 circular-road experiment used 22 vehicles. Evidence: `source.traffic.sugiyama-2008` — Article p. 4; figure 2 caption
- **`phantom-traffic.claim.no-obstruction`** — Stop-and-go traffic can form without a physical obstruction or external bottleneck. Evidence: `source.traffic.sugiyama-2008` — Article pp. 4–5; figures 2–4
- **`phantom-traffic.claim.conditional-growth`** — In dense traffic, small speed changes can grow through following responses when the flow is unstable. Evidence: `source.traffic.treiber-2007` — Author manuscript pp. 3, 6–10; string stability, simulations and discussion
- **`phantom-traffic.claim.turnover`** — Cars enter the slow cluster at its rear and accelerate out at its front, changing the cluster’s membership. Evidence: `source.traffic.sugiyama-2008` — Article p. 5, paragraph beginning We observed the instability
- **`phantom-traffic.claim.bottleneck-distinction`** — Some congestion is generated by bottlenecks or incidents; internally generated waves are a different possibility. Evidence: `source.traffic.fhwa-2017` — Appendix A, forming and recovery wave examples

## Qualified/reserve claims

“Small speed changes can grow” requires the unstable-flow condition, retained in the proposed narration. “The jam travels backward” must identify the congestion pattern relative to the road and use “can” for the general claim. Density alone is not sufficient. Reaction delay is one influence, not a sole or universally necessary cause. The observed roughly 20 km/h wave speed belongs only to the reported experiment. The native ledger uses `supported` plus caveats for accurate qualified wording; QUALIFIED is an editorial grouping, not an invented schema status.

Other retained claims are reusable research reserves, not automatically selected narration or on-screen copy. Any later script addition must select its claim, preserve its scope and pass another owner review.

## Excluded formulations

- **One tiny brake tap always creates a traffic jam.** Stable regimes attenuate disturbances; the ring study did not prescribe an initiating brake tap.
- **A traffic jam appears from nothing.** No obstruction does not mean no cause: growing fluctuations and unstable conditions were present.
- **Drivers overreact and create all traffic jams.** A response can amplify under some conditions; universal blame and all-jam causality are unsupported.
- **Reaction time alone causes phantom traffic jams.** Instability can occur in models without explicit reaction delay; other responses matter.
- **Nobody caused the traffic jam.** No unique initiating driver was identified; this does not demonstrate absence of human contributions or causes.
- **All traffic jams are spontaneous backward-moving waves.** Bottleneck queues exist and boundaries have different propagation directions.
- **Traffic jam waves always travel backward at 20 km/h.** This is an approximate reported experiment value; no universal-speed conclusion is warranted.
- **All sufficiently dense traffic must become unstable.** Very-high-density homogeneous slow flow and differing intermediate-density outcomes prevent this claim.
- **Autonomous vehicles automatically eliminate congestion.** Anticipation improves stability in specified models; automation does not automatically remove demand/capacity bottlenecks.
- **Finding nothing ahead proves a phantom jam formed spontaneously.** A cleared obstruction can also produce this experience.
- **The cars in a jam drive backward.** The backward entity is the cluster/pattern; individual trajectories move forward.

Also exclude “every following driver brakes harder,” a single inevitable density threshold, claims the ring represents every highway, and claims models reproduce every real situation. “One tiny brake tap can create a jam” is not approved wording here: it can conceal the necessary traffic conditions and suggests an experimentally manipulated initiating action that the ring paper did not report. The accurate replacement is the conditional small-speed-disturbance claim.

## Source inspection and limitations

### Traffic jams without bottlenecks—experimental evidence for the physical mechanism of the formation of a jam

Yuki Sugiyama, Minoru Fukui, Macoto Kikuchi, Katsuya Hasebe, Akihiro Nakayama, Katsuhiro Nishinari, Shin-ichi Tadaki, Satoshi Yukawa; 2008-03-04; peer-reviewed. [Osaka University institutional copy; New Journal of Physics](https://ir.library.osaka-u.ac.jp/repo/ouka/all/93262/NewJPhys_10_033001.pdf). DOI 10.1088/1367-2630/10/3/033001. Access: **inspected**. Inspected: Article pp. 1–7; figures 2–4 visually inspected on pp. 4–6; figure 5 is a reproduction of earlier highway trajectories, not independently inspected data.

Web PDF access failed; direct institutional download succeeded (HTTP 200, 1,961,378 bytes), all seven article pages extracted with PDFKit. Figures 2–4 also viewed from the original PDF. Supplementary movies and raw trajectory data not inspected. Short fixed-vehicle ring; no ramps/lane changes. Target speed and spacing deliberately favored instability; no identified deliberate initiating brake tap. Does not isolate reaction delay or establish a universal density threshold, wave speed, or prevalence on highways.

### Phase transition in traffic jam experiment on a circuit

Shin-ichi Tadaki, Macoto Kikuchi, Minoru Fukui, Akihiro Nakayama, Katsuhiro Nishinari, Akihiro Shibata, Yuki Sugiyama, Taturu Yosida, Satoshi Yukawa; 2013-10-30; peer-reviewed. [Osaka University institutional copy; New Journal of Physics](https://ir.library.osaka-u.ac.jp/repo/ouka/all/93261/NewJPhys_15_103034.pdf). DOI 10.1088/1367-2630/15/10/103034. Access: **partially-inspected**. Inspected: Article sections 1–4 (pp. 2–12), table 1, captions and accompanying text of figures 4–8; Appendix A (pp. 12–13).

Full PDF accessible; targeted main-text/measurement sections inspected, not every appendix derivation or raw data. Driver training/caution varied by session; several first-day sessions excluded from principal analyses by authors. Intermediate-density free and jammed sessions; very-high-density homogeneous slow session. No universal monotonic density rule. Cover says CC BY-NC-SA 4.0 while article says CC BY 3.0; rights wording differs. No figure, photograph or footage reuse proposed.

### Influence of Reaction Times and Anticipation on Stability of Vehicular Traffic Flow

Martin Treiber, Arne Kesting, Dirk Helbing; 2007; peer-reviewed. [Author-hosted manuscript; Transportation Research Record 1999](https://www.mtreiber.de/publications/timedelay_TRR07_final.pdf). DOI 10.3141/1999-03. Access: **partially-inspected**. Inspected: Author manuscript abstract, introduction, model, simulation and discussion (pp. 2–10); string-stability definition, section 3, discussion.

Author manuscript, not the publisher typeset version. Publisher identity/DOI corroborated. Theoretical and numerical models, not a controlled measurement of a unique cause in the 2008 experiment. Thresholds depend on chosen model, parameters and perturbation size; no driving prescription or universal acceleration/reaction-time numbers.

### Recurring Traffic Bottlenecks: A Primer, Fourth Edition — Appendix A. Additional Principles on Traffic Flow and Bottlenecks

Federal Highway Administration; November 2017; government. [U.S. Federal Highway Administration](https://ops.fhwa.dot.gov/publications/fhwahop18013/appa.htm). Access: **inspected**. Inspected: Complete Appendix A HTML: Shock Waves and the Accordion Effect; forming/recovery boundaries; cleared incident example.

Bottleneck primer, not an experimental test of spontaneous jams. Its blanket concluding bottleneck sentence cannot be generalized to negate the no-bottleneck ring experiment. Use only scoped boundary definitions and cleared-incident caution.

The Orosz/Wilson/Stépán 2010 review was an unused lead: bibliographic identity checked on the Michigan author homepage, PDF fetch timed out and direct access returned HTTP 403. No claim depends on it. The primary 2008 full article, 2013 experimental follow-up, inspected 2007 model manuscript and government boundary definitions provide the evidence foundation. No search-result snippet is used as claim evidence.

A real source tension is retained: FHWA's appendix concludes that a bottleneck explains its discussed cases. Generalizing that sentence to all traffic jams would conflict with the ring experiment. This proposal uses the scoped incident/bottleneck examples and boundary definitions, and excludes the blanket assertion. No manufactured scientific conflict is assigned to the scoped package claims.

Source text/figures are evidence, not production assets. The 2013 institutional cover and article have differing rights labels; do not reuse figures or photographs. There are no production assets in this milestone and no new asset license entries are warranted. The temporary PDF views were solely research inspection.

## Five hook approaches

### No obstruction ahead. So how can traffic still stop?

`phantom-traffic.hook.empty-road`

- comprehension: Strong; recognizable queue with a clear-road mystery.
- curiosity: Strong; asks how a queue can exist.
- accuracy: Usable as a possibility question; visible absence is not proof of internal origin.
- visualPayoff: Clear road then internal wave.
- explanationFit: Good, but requires separating cleared incidents.
- clickbaitRisk: Moderate if it diagnoses every everyday queue.
- magnivisFit: Strong everyday system explanation.

### The cars move forward. But a traffic jam can move backward.

`phantom-traffic.hook.backward-wave`

- comprehension: Strong with an overhead scene and two distinct motion cues.
- curiosity: Strong contradiction between object and pattern motion.
- accuracy: Strong with can and explicit road-relative pattern language.
- visualPayoff: Excellent: one tracked car forward, congestion highlight upstream.
- explanationFit: Directly matches observed cluster turnover and experiment.
- clickbaitRisk: Low if no reverse-driving imagery.
- magnivisFit: Strong visual understanding payoff; recommended.

### A small slowdown can grow into stop-and-go traffic.

`phantom-traffic.hook.chain`

- comprehension: Strong causal intuition.
- curiosity: Good; small effect becomes collective stop.
- accuracy: Needs unstable-flow qualification immediately.
- visualPayoff: Good vehicle-to-vehicle development.
- explanationFit: Good, but can invite reaction-time-only simplification.
- clickbaitRisk: Moderate; do not promise any brake tap causes a jam.
- magnivisFit: Good if mechanism stays honest.

### Twenty-two cars. One circular track. A traffic jam with no obstruction.

`phantom-traffic.hook.experiment`

- comprehension: Strong concrete setup.
- curiosity: Strong experimental puzzle.
- accuracy: Directly supported in the 22-car ring.
- visualPayoff: Strong original ring reconstruction.
- explanationFit: Very good evidentiary anchor.
- clickbaitRisk: Low; do not imply deliberate jam instruction or universal proof.
- magnivisFit: Strong credible explanation; runner-up.

### You reach the end of a traffic jam—and find nothing. What could explain it?

`phantom-traffic.hook.everyday`

- comprehension: Strong familiar experience.
- curiosity: Strong unanswered personal mystery.
- accuracy: Question is safe; cause of a particular experienced jam unknown.
- visualPayoff: Good queue exit and zoom-out.
- explanationFit: Mixed: cleared blockage is another plausible answer.
- clickbaitRisk: Moderate if presented as a single-cause diagnosis.
- magnivisFit: Good but less precise than the paradox.

## Recommended hook

**“The cars move forward. But a traffic jam can move backward.”**

It is immediately visual, matches the observed cluster behavior and gives a satisfying distinction to explain. “Can” preserves the necessary scope. The circular-experiment hook is the strongest alternate if a later storyboard cannot make opposing motions clear immediately. No virality prediction or final hook approval is claimed.

## Exact proposed narration — unapproved

The cars move forward. But a traffic jam can move backward.

Researchers put twenty-two cars on a circular track. No obstruction. Yet stop-and-go traffic formed.

In dense traffic, small speed changes can grow as drivers adjust to the cars ahead—if the flow is unstable.

Cars join the slow patch at the back and leave at the front.

The cars change. The pattern moves backward.

Not every jam starts this way. But this kind needs no blocked road.

**Runtime estimate:** 78 words; about 31.2 seconds at 150 words/minute or 33.4 seconds at 140 words/minute, before pauses. Target **approximately 36–40 seconds** with a brief reveal pause; editorial duration intent is 34–40 seconds. No narration/audio timing has been generated or measured. If readable delivery exceeds 40 seconds, revise scope/duration at owner review rather than rushing the explanation.

## Narrative beats and conceptual VisualPlan

The following are editorial windows, not frame allocations, measured voice timing or a ProductionPlan.

| Approximate window | Narration beat | Viewers see | Truthfulness requirement |
|---|---|---|---|
| 0–4 s | Forward cars / backward jam | Physical overhead road scene with one tracked car moving forward and a separate slow-pattern highlight moving upstream. | Label direction cues distinctly; do not move vehicles in reverse. |
| 4–11 s | Controlled evidence | Original reconstruction of a ring with 22 recognizable cars; initially even flow develops a slow patch. | EXPERIMENT RECONSTRUCTION. Preserve reported vehicle count; no scientific-figure copy or measured trajectory claim. |
| 11–21 s | Conditional growth | Closer overhead scene: a modest speed/spacing disturbance and successive following responses; the slow patch grows in this illustrated unstable case. | SIMPLIFIED EXPLANATORY MODEL, with instability condition legible. No single-driver blame or obligatory escalating brake taps. |
| 21–27 s | Cars enter and leave | One car enters the rear, a different car accelerates out at the front. | Anchor front/rear to the forward driving direction; membership visibly changes. |
| 27–33 s | Zoomed-out payoff | Same road scene: tracked car continues forward while slow-pattern highlight progresses upstream. | Road-frame comparison, continuous forward car motion, no universal speed label. |
| 33–40 s | Scope and resolution | Return to the clear roadway and collective pattern; short scope reminder. | One possible origin; no diagnosis of an actual empty-road queue. |

Future visuals should favor an immediately recognizable physical scene with restrained explanatory overlays. A tracked vehicle and a soft pattern region must be visually different so the viewer sees the mechanism rather than interpreting an arbitrary arrow. Ring and road are distinct illustrative scenes; transitions must not imply they are the same experiment. Compression of time must be clear, with no representation that a 40-second animation replays measured real-time footage. The illustration is not a calibrated/validated simulator. No animation code, actual assets or production parameters are created.

## Caption direction — not a CaptionPlan

Speech-first, designed burned-in captions should follow natural phrases in the exact approved narration, preserving the “can” and “if the flow is unstable” qualifiers. Useful emphasis: **cars move forward**, **pattern moves backward**, **no obstruction**. The slow patch, tracked car and entry/exit action must stay clear. Allow the macro reveal to be understood before changing the next phrase. Disclosure/semantic direction labels must not compete with captions. No typography timings, word cues, placements or final CaptionPlan are set; Wood Frog informs quality, not a mandatory template.

## Production and platform risks

- Scientific: unqualified density/causality, reversed-car imagery, treating a ring as every highway, fixed/universal wave speed, or disguising an illustrative animation as measured simulation. Owner review must retain the scope in spoken words and visuals.
- Visual: a stable simulation mistakenly used to show growth, collisions/unphysical trajectories, confusion over front/rear, excessive diagram density, or an unsupported hand-authored animation presented as predictive. Later production planning must choose a truthful explanatory approach and visually audit it.
- Licensing: no copyrighted road footage or copied paper graphics required. Future vehicle shapes, audio, fonts, images and any external data/assets need recorded rights and provenance before use. The paper's reuse-label inconsistency is a reason to avoid figure reuse.
- Platform: the critical interaction should remain central, but exact safe-area geometry is not invented. Distinguish MASTER, PLATFORM VARIANT and PRESENTATION SURFACE later. Required review includes YouTube Shorts mobile and desktop, TikTok mobile, Instagram playback and profile/grid, Facebook dedicated Reel viewer and Page/feed, and desktop/web where materially relevant. Renewed real-device evidence is pending; local QA will not prove mobile safety.
- Readability/runtime: preserve the spoken condition and final scope; validate future designed captions against the action. The present word-rate estimate is not measured narration duration.

## Artifacts and validation

`knowledge-package.review.json`: phantom-traffic revision 1, **review**. `content-asset.review.json`: phantom-traffic.asset.backward-wave revision 1, **editorial-review**. `topic-candidate.researching.json`: topic.phantom-traffic revision 2, **researching**. `claim-review.json`: **ready-for-owner-decision**. Neither object has approval metadata; no claim has human review metadata or `verified` status.

Native source/claim/reference checks, workspace initial-state checks, hook validation, statement hashes, ledger/evidence/eligibility consistency and deterministic artifact hashes are checked by `scripts/validate-traffic-research.ts`. See its console result and repository tests. These checks verify structural traceability and gate state; human evidence/editorial judgment remains required. No renders or platform previews are applicable or authorized.

## Exact next human gate

Ahmet must explicitly approve or request changes to **the proposed promoted claims, qualifications, exclusions, selected hook, exact narration, narrative beats and conceptual VisualPlan**. A topic selection is not an editorial approval. Any wording changes require a new claim/script review and matching hashes. Only after this editorial gate may separately authorized production planning begin. No production or publication action is taken here.
