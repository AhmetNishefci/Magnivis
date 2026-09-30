import {knowledgePackageSchema, type KnowledgeClaim, type KnowledgeSource} from '../schema';

export const millenniumBridgePackageId = 'millennium-bridge';
const claimId = (suffix: string) => `${millenniumBridgePackageId}.claim.${suffix}`;
export const millenniumBridgeClaimIds = {
  opening: claimId('opening-date'), crossings: claimId('opening-crossings'),
  occupancy: claimId('simultaneous-occupancy'), lateral: claimId('opening-lateral-motion'),
  visibleBalance: claimId('visible-balance-response'), restriction: claimId('access-restriction'),
  closure: claimId('closure-date'), reopening: claimId('reopening-date'),
  earlyExplanation: claimId('early-synchronous-excitation-explanation'),
  footPlacement: claimId('balance-foot-placement'), negativeDamping: claimId('effective-negative-damping'),
  growth: claimId('response-growth'), withoutSynchrony: claimId('onset-without-crowd-synchrony'),
  laterCoherence: claimId('later-coherence-effects'), dayUncertainty: claimId('opening-day-attribution-limit'),
  dampingRetrofit: claimId('damping-energy-removal'), damperSystems: claimId('damper-systems'),
  prototypeValidation: claimId('prototype-test-validation'),
} as const;
export const millenniumBridgeSourceIds = {
  investigation: 'source.dallard-millennium-structural-engineer-2001',
  asce: 'source.dallard-millennium-asce-2001',
  oscillators: 'source.eckhardt-millennium-pre-2007',
  balance: 'source.macdonald-balancing-pedestrians-2009',
  footPlacement: 'source.bocian-foot-placement-eurodyn-2020',
  synthesis: 'source.belykh-instability-without-synchronisation-2021',
  chronology: 'source.city-bridge-millennium-anniversary-2025',
  retrospective: 'source.arup-damped-outriggers-2008',
} as const;
const s = millenniumBridgeSourceIds;
const c = millenniumBridgeClaimIds;
const retrieved = '2026-09-30';

const sources: KnowledgeSource[] = [
  {
    id: s.investigation, organization: 'Institution of Structural Engineers',
    title: 'The London Millennium Footbridge', sourceType: 'primary-source',
    url: 'https://www.istructe.org/journal/volumes/volume-79-(published-in-2001)/issue-22/the-london-millennium-footbridge/',
    retrieved, published: '2001-11-20',
    authors: ['P. Dallard', 'A. J. Fitzpatrick', 'A. Flint', 'S. Le Bourva', 'A. Low', 'R. M. Ridsdill Smith', 'M. Willford'],
    notes: 'Publisher confirms title, authors, date, synopsis and Volume 79(22), pp. 17–33. Selected paper sections inspected in a public teaching mirror: https://researchcourse.pbworks.com/f/structural%2Bengineering.pdf . Its 15-page scan omits printed pages 22–23. Publisher full text requires purchase/membership; mirror rights and completeness are not certified. No access control was bypassed; no source PDF or figure is redistributed.',
  },
  {
    id: s.asce, organization: 'American Society of Civil Engineers',
    title: 'London Millennium Bridge: Pedestrian-Induced Lateral Vibration', sourceType: 'peer-reviewed',
    url: 'https://ascelibrary.org/doi/10.1061/(ASCE)1084-0702(2001)6:6(412)', retrieved,
    published: '2001-12-01', authors: ['Pat Dallard', 'Tony Fitzpatrick', 'Anthony Flint', 'Angus Low', 'Roger Ridsdill Smith', 'Michael Willford', 'Mark Roche'],
    identifiers: [{scheme: 'DOI', value: '10.1061/(ASCE)1084-0702(2001)6:6(412)'}],
    notes: 'Publisher abstract and bibliographic record inspected through indexed publisher content at ascelibrary.com; direct requests to .org failed and .com returned 403. Full paper not inspected. Journal of Bridge Engineering 6(6), pp. 412–417; retrofit was still underway when written.',
  },
  {
    id: s.oscillators, organization: 'American Physical Society',
    title: 'Modeling walker synchronization on the Millennium Bridge', sourceType: 'peer-reviewed',
    url: 'https://doi.org/10.1103/PhysRevE.75.021110', retrieved, published: '2007-02-12',
    authors: ['Bruno Eckhardt', 'Edward Ott', 'Steven H. Strogatz', 'Daniel M. Abrams', 'Allan McRobie'],
    identifiers: [{scheme: 'DOI', value: '10.1103/PhysRevE.75.021110'}],
    notes: 'APS identity/abstract corroborated with author-hosted university PDF: https://dmabrams.esam.northwestern.edu/pubs/Eckhardt%20et%20al%20-%20Modeling%20walker%20synchronization%20on%20the%20Millennium%20Bridge%20-%20PRE%202007.pdf . Introduction, modelling assumptions and closing remarks inspected; not a retrospective measurement of every opening-day pedestrian.',
  },
  {
    id: s.balance, organization: 'Royal Society / University of Bristol',
    title: 'Lateral excitation of bridges by balancing pedestrians', sourceType: 'peer-reviewed',
    url: 'https://research-information.bris.ac.uk/en/publications/lateral-excitation-of-bridges-by-balancing-pedestrians/',
    retrieved, publicationLabel: 'April 2009; first online 16 December 2008', authors: ['John H. G. Macdonald'],
    identifiers: [{scheme: 'DOI', value: '10.1098/rspa.2008.0367'}],
    notes: 'Bristol institutional abstract and metadata inspected; Royal Society DOI request failed. Full paper not inspected. Proceedings of the Royal Society A 465(2104), pp. 1055–1073. Abstract distinguishes negative and positive damping.',
  },
  {
    id: s.footPlacement, organization: 'EASD Procedia / White Rose Research Online',
    title: 'Pedestrian lateral foot placement and lateral dynamic instability of bridges', sourceType: 'primary-source',
    url: 'https://eprints.whiterose.ac.uk/id/eprint/213667/1/Bocian%202020%20-%20Pedestrian%20lateral%20foot%20placement%20and%20lateral%20dynamic%20instability%20of%20bridges.pdf',
    retrieved, publicationLabel: 'EURODYN 2020, 23–26 November 2020',
    authors: ['Mateusz Bocian', 'Jeremy F. Burn', 'John H. G. Macdonald'],
    identifiers: [{scheme: 'DOI', value: '10.47964/1120.9148.19337'}],
    notes: 'Institutional repository published version, pp. 1835–1843. Abstract, methodology and conclusions inspected. A single participant on a laterally oscillating treadmill; cannot establish the opening-day crowd distribution. PDF screenshot fetch failed; no quantitative graph values are used.',
  },
  {
    id: s.synthesis, organization: 'Nature Communications',
    title: 'Emergence of the London Millennium Bridge instability without synchronisation', sourceType: 'peer-reviewed',
    url: 'https://www.nature.com/articles/s41467-021-27568-y', retrieved, published: '2021-12-10',
    authors: ['Igor Belykh', 'Mateusz Bocian', 'Alan R. Champneys', 'Kevin Daley', 'Russell Jeter', 'John H. G. Macdonald', 'Allan McRobie'],
    identifiers: [{scheme: 'DOI', value: '10.1038/s41467-021-27568-y'}],
    notes: 'Publisher-indexed article and author-hosted published PDF inspected: https://math.gsu.edu/ibelykh/2021_Nature_Communications_Emergence_of_London_Millennium_Bridge_Instability.pdf . Abstract, introduction, results and discussion; later direct publisher fetch failed. Article 12:7223. Supplementary material not independently inspected.',
  },
  {
    id: s.chronology, organization: 'City Bridge Foundation',
    title: 'It’s 25-up for London’s iconic Millennium Bridge', sourceType: 'primary-source',
    url: 'https://www.citybridgefoundation.org.uk/news-and-blog/its-25-up-for-londons-iconic-millennium-bridge',
    retrieved, published: '2025-06-05',
    notes: 'Operator anniversary page inspected through indexed official content, including numbered facts 17–18; later direct fetch timed out. Opening/ownership corroborated at https://www.citybridgefoundation.org.uk/what-we-do/bridges . Its simplified mechanism account is not used to override research papers.',
  },
  {
    id: s.retrospective, organization: 'Arup', title: 'Damped outriggers for tall buildings — Where the idea came from',
    sourceType: 'primary-source', url: 'https://www.arup.com/globalassets/downloads/arup-journal/the-arup-journal-2008-issue-3.pdf',
    retrieved, publicationLabel: 'The Arup Journal 3/2008, pp. 15–21', authors: ['Rob Smith', 'Michael Willford'],
    notes: 'Official journal PDF; bridge retrospective paragraph on printed p. 18 inspected. Adjacent tall-building specifications must not be attributed to the bridge. This is a rediscovered retrospective, not a claim to have identified the exact lost source URL.',
  },
];

const evidence = (sourceId: string, locator: string, notes: string) => ({sourceId, locator, notes});
const qualitative = (id: string, statement: string, refs: KnowledgeClaim['evidence'], caveats: string[] = []): KnowledgeClaim => ({
  id, type: 'qualitative', statement, evidence: refs, caveats, verificationStatus: 'supported',
});
const claims: KnowledgeClaim[] = [
  qualitative(c.opening, 'London’s Millennium Bridge opened to the public on 10 June 2000.', [
    evidence(s.investigation, 'Synopsis, printed p. 17', 'Opening date stated.'),
    evidence(s.chronology, 'Opening paragraphs', 'Operator gives the same date.'),
  ]),
  {
    id: c.crossings, type: 'quantitative', statement: 'The original investigation estimated 80,000–100,000 opening-day crossings.',
    quantity: {kind: 'range', minimum: 80000, maximum: 100000, unit: 'crossings', precision: 'approximate'},
    basis: 'estimated', display: 'approximately 80,000–100,000', verificationStatus: 'supported',
    evidence: [evidence(s.investigation, 'Opening day, printed p. 20', 'Daily total estimated; not an exact counter.')],
    caveats: ['Do not confuse daily crossings with simultaneous occupancy or unique visitors.'],
  },
  {
    id: c.occupancy, type: 'quantitative', statement: 'Video analysis estimated a maximum of roughly 2,000 pedestrians simultaneously on the deck.',
    quantity: {kind: 'scalar', value: 2000, unit: 'pedestrians', precision: 'approximate'},
    basis: 'estimated', display: 'roughly 2,000 at once', verificationStatus: 'supported',
    evidence: [evidence(s.investigation, 'Opening day, printed p. 20', 'Peak occupancy inferred from video.')],
    caveats: ['Approximate peak, not a prescribed instability threshold.'],
  },
  qualitative(c.lateral, 'The unexpected opening-day bridge motion was predominantly lateral, or side-to-side.', [
    evidence(s.investigation, 'Opening day, printed pp. 20–21', 'Sideways vibration reported; excessive vertical vibration absent.'),
    evidence(s.asce, 'Publisher abstract', 'Opening-day lateral movement described.'),
  ], ['Do not depict vertical bouncing as the primary problem.']),
  qualitative(c.visibleBalance, 'Pedestrians had difficulty walking during the motion and some held the balustrades for support.', [
    evidence(s.investigation, 'Opening day, printed p. 21', 'Walking difficulty and handrail support observed.'),
    evidence(s.oscillators, 'I. Introduction, p. 021110-1', 'Handrail use recounted.'),
  ], ['These observations alone do not measure individual foot-placement laws.']),
  qualitative(c.restriction, 'Pedestrian access was reduced on 11 June 2000.', [
    evidence(s.investigation, 'Opening day, printed p. 21', 'Second-day access reduction recorded.'),
  ]),
  qualitative(c.closure, 'The bridge was closed on 12 June 2000 for investigation.', [
    evidence(s.investigation, 'Opening day, printed p. 21', 'Closure decision dated.'),
    evidence(s.asce, 'Publisher abstract', 'Closure date independently repeated.'),
  ]),
  qualitative(c.reopening, 'The bridge reopened on 22 February 2002 after damping modifications and testing.', [
    evidence(s.chronology, 'Opening paragraphs; numbered facts 17–18', 'February reopening after dampers; fact 18 names February 22 as reopening day.'),
    evidence(s.retrospective, 'Where the idea came from, printed p. 18', 'Completed damping solution described as effective.'),
    evidence(s.investigation, 'Validation by testing / Validation of final scheme, printed pp. 31–33', 'Prototype validation precedes the later reopening; not a final 2002 crowd-test report.'),
  ], ['The 2001 paper cannot itself verify events in 2002.']),
  qualitative(c.earlyExplanation, 'Early engineering accounts described synchronous lateral excitation and correlated pedestrian forces.', [
    evidence(s.investigation, 'Description of synchronous lateral excitation, printed p. 21', 'Contemporary force-correlation explanation.'),
    evidence(s.oscillators, 'Abstract; II. Modeling; VI. Closing remarks', 'Later phase-oscillator theory is an alternative modelling tradition.'),
  ], ['Force correlation with bridge motion is not proof that every footstep synchronized.']),
  qualitative(c.footPlacement, 'A laterally moving walkway can change the foot placement used by pedestrians to maintain balance.', [
    evidence(s.balance, 'Institutional abstract', 'Balance model controls lateral step position, not necessarily timing.'),
    evidence(s.footPlacement, 'Abstract; 2 Methodology, p. 1837; 4 Conclusions, p. 1841', 'Treadmill observations support a foot-placement control law.'),
  ], ['Model and laboratory support, not a tracked reconstruction of every opening-day walker.', 'The 2020 experiment used one participant.']),
  qualitative(c.negativeDamping, 'Aggregate pedestrian lateral forces can feed energy into bridge motion, acting as effective negative damping.', [
    evidence(s.balance, 'Institutional abstract', 'Balance feedback can contribute negative damping.'),
    evidence(s.synthesis, 'Introduction; Results — Analytical prediction, p. 4, equations (1)–(2)', 'Uncorrelated contributions can have a nonzero mean energy input.'),
  ], ['Can, not always: gait strategy and frequency can also yield positive damping.']),
  qualitative(c.growth, 'Bridge sway can grow when pedestrian energy input exceeds the energy removed by structural damping.', [
    evidence(s.investigation, 'Theory, printed pp. 24–25', 'Excitation and absorbed power determine modal-energy change.'),
    evidence(s.balance, 'Institutional abstract, final sentence', 'Divergent response above a critical pedestrian number.'),
  ], ['Growth is conditional; do not imply unbounded amplitude or inevitable collapse.']),
  qualitative(c.withoutSynchrony, 'Lateral instability can begin without crowd-wide footstep synchronization being a necessary initiating condition.', [
    evidence(s.balance, 'Institutional abstract', 'Unchanged pacing frequency can produce negative damping.'),
    evidence(s.synthesis, 'Abstract; Results — Simulation results, pp. 4–5; Discussion', 'Instability also occurs in a model unable to synchronize.'),
  ], ['A supported mechanism possibility, not proof of an exclusive cause on 10 June 2000.']),
  qualitative(c.laterCoherence, 'Later footstep coherence can change the response, amplifying or moderating the motion depending on phase and gait.', [
    evidence(s.synthesis, 'Introduction; Results — The role of foot placement strategies, pp. 6–8; Discussion', 'Coherence has secondary nonlinear effects of differing sign.'),
  ], ['Do not say synchronization never occurs or has no role.']),
  qualitative(c.dayUncertainty, 'The inspected evidence does not uniquely establish the opening-day contribution of footstep coordination and other gait mechanisms.', [
    evidence(s.synthesis, 'Results — Review of observational and experimental evidence; Discussion', 'Limited synchrony observations and unknown crowd control-law distribution constrain attribution.'),
    evidence(s.oscillators, 'II. Modeling, assumptions (i)–(ii)', 'Specific interaction assumptions are not direct event measurements.'),
  ], ['Conservative editorial inference about evidence limits, not a measured percentage or proof that reconstruction is impossible in principle.']),
  qualitative(c.dampingRetrofit, 'Engineers chose a damping-based retrofit over major stiffening; damping removes vibration energy and suppresses excessive sway.', [
    evidence(s.investigation, 'Lateral stiffening options / Damping options, printed p. 29; Quantification and optimisation, printed p. 31', 'Less intrusive damping chosen; components dissipate energy.'),
    evidence(s.retrospective, 'Where the idea came from, printed p. 18', 'Arup reports effective reduction.'),
  ], ['Suppression does not mean all future movement is physically impossible.', 'Added supporting chevrons do not make this a major bridge-stiffening strategy.']),
  qualitative(c.damperSystems, 'The retrofit scheme included fluid-viscous and tuned-mass damping systems.', [
    evidence(s.investigation, 'Synopsis, p. 17; Description of scheme, printed pp. 29–31', 'Both system types specified.'),
    evidence(s.asce, 'Publisher abstract', 'Extensive passive damping was being installed.'),
  ], ['System roles differ; do not imply every tuned-mass device controlled lateral motion.']),
  qualitative(c.prototypeValidation, 'Prototype tests showed increased damping and reduced response consistent with the retrofit’s analytical predictions.', [
    evidence(s.investigation, 'Synopsis, p. 17; Validation by testing / Validation of final scheme, printed pp. 31–33', 'Measured prototype behaviour compared with prediction.'),
  ], ['Prototype validation, not a claim to have inspected the final 2002 commissioning dataset.', 'No exact response-reduction multiplier is asserted.']),
];

export const millenniumBridgeHookIds = {
  balanceFeedback: 'millennium-bridge.hook.balance-feedback',
  misconception: 'millennium-bridge.hook.synchrony-misconception',
} as const;
export const millenniumBridgeKnowledgePackage = knowledgePackageSchema.parse({
  id: millenniumBridgePackageId, revision: 1, topic: 'London Millennium Bridge pedestrian–structure feedback',
  centralQuestion: 'How can trying to keep your balance make a bridge sway more?',
  taxonomy: {pillar: 'technology-built-world', domains: ['structural-engineering', 'biomechanics'], topics: ['millennium-bridge', 'pedestrian-structure-interaction', 'negative-damping']},
  timeliness: 'evergreen', thesis: 'Balance corrections can feed lateral energy into a flexible bridge without unanimous footstep timing; event attribution remains qualified.',
  viewerPayoff: 'Understand the feedback loop and why damping addresses it.', sources, claims,
  caveats: [{id: 'millennium-bridge.caveat.event-attribution', statement: 'Mechanism support does not uniquely identify the opening-day mixture.', claimIds: [c.withoutSynchrony, c.laterCoherence, c.dayUncertainty]}],
  hooks: [
    {id: millenniumBridgeHookIds.balanceFeedback, archetype: 'question', text: 'How can trying to keep your balance make a bridge sway more?', viewerPromise: 'Reveal balance-driven structural feedback.', claimIds: [c.footPlacement, c.negativeDamping]},
    {id: millenniumBridgeHookIds.misconception, archetype: 'misconception', text: 'A crowd does not have to match footsteps to amplify a bridge’s sway.', viewerPromise: 'Separate force feedback from unanimous lockstep.', claimIds: [c.withoutSynchrony]},
  ],
  narrativeOpportunities: [{id: 'millennium-bridge.narrative.balance-feedback', title: 'The balance-feedback reveal', description: 'Move from corrective steps to collective response and energy removal.', claimIds: [c.footPlacement, c.negativeDamping, c.dampingRetrofit]}],
  visualOpportunities: [{id: 'millennium-bridge.visual.varied-phases', title: 'Varied pedestrians, shared structural response', description: 'Original explanatory geometry with varied phases and explicit model disclosures.', claimIds: [c.footPlacement, c.withoutSynchrony, c.laterCoherence]}],
  relatedQuestions: ['How do force correlation and footstep synchronization differ?'],
  followUpOpportunities: ['Explain the distinct roles of viscous and tuned-mass dampers.'],
  editorialStatus: 'review',
});
