# Phantom Traffic — agent frame inspection, candidate v1

This is an agent QA entry, **not owner master visual approval**. Candidate identity: `bdf22d48b4fe1b873fd659a487954c09c1573dd5466795656128c08d03208d4b`.

Inspected actual decoded candidate frames and the full 30-frame contact sheet. The set includes frame 0, approximately 0.5/1/1.5 seconds, all 15 designed-caption midpoints, controlled experiment, mechanism, membership turnover, backward-pattern payoff, qualified ending and final hold. All captures are from the MP4 rather than composition previews. See the [durable QA evidence](../../../artifacts/qa-evidence/phantom-traffic-candidate-v1/).

- Opening: cars are visible from frame zero, with an immediately moving road-fixed amber slow region and a gold tracked car. Comparing opening captures shows the car advancing upward while the region advances downward. There is no static introductory card. The disclosure and small brand mark sit above the action.
- Experiment: the original physical circular-track scene displays 22 vehicles, unobstructed track and a developing cluster. `EXPERIMENT RECONSTRUCTION` remains readable. It is an explanatory reconstruction, not measured trajectories or scientific footage.
- Mechanism: brake lights and spacing changes make one disturbance-response example visible. Captions retain `can sometimes grow`. Model responses are deliberately nonmonotonic; no narrative asserts every following driver overreacts. `SIMPLIFIED EXPLANATORY MODEL` remains visible.
- Membership: a gold car at the rear and a cyan car at the front provide distinct identities. The rear car joins while the front car leaves. At the later wide view, the gold car is ahead of a cluster with different members.
- Payoff: the road-fixed wider view gives the upstream-moving region room to remain visible while forward cars pass through it. The exact two payoff sentences are followed by a 1.5-second inter-clip hold, in addition to the measured clip's trailing silence.
- Captions: the lower band is separate from road/track action. No inspected line is cut off, collapsed against emphasis, or covered by another overlay. Gold/ice emphasis differentiates movement concepts and preserves qualifiers. Sentence transitions were adjusted to measured WAV silence intervals. The one internal experiment phrase boundary is manually estimated, not forced word alignment.
- Ending: the road remains visibly open ahead; the exact `Not every jam` caption preserves scope. The additional scene label describes this explanatory scene only, not a diagnostic rule about real queues.

Automated kinematics tests cover forward-only movement, vehicle ordering/body separation, conditional ring growth and changing cluster membership. Independent still renders of payoff frame 768 matched byte-for-byte. This does not prove full MP4 re-encoding will reproduce identical bytes.

Limits: frame inspection and geometric bounds cannot grant mobile/platform approval or replace watching/listening to the complete candidate. No external ASR/forced-alignment service was used. Exact TTS input is locked and hashed; Ahmet's master review includes pronunciation, phrase pacing, caption synchronization, sound balance and the muted opposing-motion test. Premium-quality acceptance remains his decision.
