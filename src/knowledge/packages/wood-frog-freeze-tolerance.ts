import {knowledgePackageSchema} from '../schema';

export const woodFrogFreezeClaimIds = {
  freezeSurvival: 'wood-frog-freeze-tolerance.claim.freeze-survival',
  heartbeatBreathing: 'wood-frog-freeze-tolerance.claim.heartbeat-breathing-stop',
  glucoseCryoprotectant: 'wood-frog-freeze-tolerance.claim.glucose-cryoprotectant',
  ureaAndGlucose: 'wood-frog-freeze-tolerance.claim.urea-and-glucose',
  iceRedistribution: 'wood-frog-freeze-tolerance.claim.ice-redistribution',
  alaskaTemperature: 'wood-frog-freeze-tolerance.claim.alaska-temperature',
  alaskaDuration: 'wood-frog-freeze-tolerance.claim.alaska-duration',
} as const;

export const woodFrogFreezeHookIds = {
  stoppedHeart: 'wood-frog-freeze-tolerance.hook.stopped-heart',
  iceWithoutDeath: 'wood-frog-freeze-tolerance.hook.ice-without-death',
  chemicalShield: 'wood-frog-freeze-tolerance.hook.chemical-shield',
  alaskaLaboratory: 'wood-frog-freeze-tolerance.hook.alaska-laboratory',
} as const;

export const woodFrogFreezeKnowledgePackage = knowledgePackageSchema.parse({
  id: 'wood-frog-freeze-tolerance',
  revision: 1,
  topic: 'Wood frog freeze tolerance',
  centralQuestion: 'How can a wood frog survive winter freezing that stops its breathing and heartbeat?',
  taxonomy: {
    pillar: 'earth-nature',
    domains: ['zoology', 'physiology', 'cryobiology'],
    topics: ['wood-frog', 'freeze-tolerance', 'cryoprotectants'],
  },
  timeliness: 'evergreen',
  thesis: 'Wood frogs survive controlled whole-body freezing by managing where ice forms and by accumulating cryoprotective glucose and urea that limit cellular injury.',
  viewerPayoff: 'The frog does not simply resist cold: it coordinates a reversible freeze in which circulation stops while cells remain chemically and physically protected.',
  sources: [
    {
      id: 'source.jeb.wood-frog-hibernation-2013',
      organization: 'The Company of Biologists — Journal of Experimental Biology',
      title: 'Hibernation physiology, freezing adaptation and extreme freeze tolerance in a northern population of the wood frog',
      sourceType: 'peer-reviewed',
      url: 'https://journals.biologists.com/jeb/article/216/18/3461/11609/Hibernation-physiology-freezing-adaptation-and',
      retrieved: '2026-09-27',
      notes: 'Primary study of Interior Alaskan and Ohio populations; population-specific results must not be generalized to all wood frogs.',
    },
    {
      id: 'source.plos.wood-frog-cryoprotectants-2015',
      organization: 'PLOS ONE',
      title: 'Cryoprotectants and Extreme Freeze Tolerance in a Subarctic Population of the Wood Frog',
      sourceType: 'peer-reviewed',
      url: 'https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0117234',
      retrieved: '2026-09-27',
      published: '2015-02-17',
      notes: 'Open-access primary study focused on the cryoprotectant system of a subarctic population.',
    },
    {
      id: 'source.pubmed.wood-frog-glucose-1991',
      organization: 'National Library of Medicine — PubMed',
      title: 'Glucose loading prevents freezing injury in rapidly cooled wood frogs',
      sourceType: 'peer-reviewed',
      url: 'https://pubmed.ncbi.nlm.nih.gov/1750578/',
      retrieved: '2026-09-27',
      notes: 'Abstract of a controlled experiment connecting glucose availability with reduced freezing injury.',
    },
    {
      id: 'source.nps.denali-wood-frog-2022',
      organization: 'U.S. National Park Service — Denali National Park and Preserve',
      title: 'Amphibians',
      sourceType: 'government',
      url: 'https://www.nps.gov/dena/learn/nature/amphibians.htm',
      retrieved: '2026-09-27',
      published: '2022-05-05',
      notes: 'Authoritative public-facing summary used for the heartbeat, breathing, thaw-order, and overwintering explanation; exact wording still awaits owner review.',
    },
  ],
  claims: [
    {
      id: woodFrogFreezeClaimIds.freezeSurvival,
      type: 'qualitative',
      statement: 'Wood frogs can survive substantial freezing of their body tissues and water during overwintering.',
      evidence: [
        {
          sourceId: 'source.jeb.wood-frog-hibernation-2013',
          locator: 'Introduction, paragraphs describing overwintering and survival of up to two-thirds body-water freezing',
          notes: 'The paper describes freeze tolerance throughout the species range while emphasizing geographic variation in its limits.',
        },
        {
          sourceId: 'source.nps.denali-wood-frog-2022',
          locator: 'Wood frog winter adaptation, paragraphs 2–4',
          notes: 'The NPS overview describes overwintering frogs freezing and later thawing in spring.',
        },
      ],
      verificationStatus: 'supported',
      caveats: ['The amount, duration, and minimum survivable temperature vary by population and experimental conditions.'],
    },
    {
      id: woodFrogFreezeClaimIds.heartbeatBreathing,
      type: 'qualitative',
      statement: 'During frozen dormancy, a wood frog can stop breathing and its heart can stop beating, with activity resuming after thawing.',
      evidence: [{
        sourceId: 'source.nps.denali-wood-frog-2022',
        locator: 'Wood frog winter adaptation, paragraphs 3–4',
        notes: 'The NPS states that hibernating frozen frogs do not breathe and their hearts do not beat, then describes spring thaw and resumed activity.',
      }],
      verificationStatus: 'supported',
      caveats: ['Before publication, a human reviewer should confirm the exact physiological wording against a primary source.'],
    },
    {
      id: woodFrogFreezeClaimIds.glucoseCryoprotectant,
      type: 'qualitative',
      statement: 'Freezing triggers rapid mobilization of glucose from liver glycogen, and that glucose acts as a cryoprotectant that reduces tissue injury.',
      evidence: [
        {
          sourceId: 'source.pubmed.wood-frog-glucose-1991',
          locator: 'Abstract',
          notes: 'The experiment found less cellular and neuromuscular injury in glucose-loaded frogs and strongly implicated glucose as a cryoprotectant.',
        },
        {
          sourceId: 'source.jeb.wood-frog-hibernation-2013',
          locator: 'Introduction, cryoprotectant mechanism paragraphs',
          notes: 'The study describes rapid glucose mobilization from hepatic glycogen in response to freezing.',
        },
      ],
      verificationStatus: 'supported',
      caveats: ['Glucose is one component of a broader freeze-tolerance system, not a complete explanation by itself.'],
    },
    {
      id: woodFrogFreezeClaimIds.ureaAndGlucose,
      type: 'qualitative',
      statement: 'Urea and glucose both contribute to wood-frog cryoprotection by limiting ice formation and helping preserve cellular structures.',
      evidence: [
        {
          sourceId: 'source.jeb.wood-frog-hibernation-2013',
          locator: 'Introduction, osmolyte and cryoprotection paragraphs',
          notes: 'The paper identifies urea and glucose as key osmolytes and describes effects on ice formation, membranes, and macromolecules.',
        },
        {
          sourceId: 'source.plos.wood-frog-cryoprotectants-2015',
          locator: 'Introduction, paragraphs 2–4',
          notes: 'The PLOS study describes urea accumulation before freezing and rapid glucose mobilization after freezing begins.',
        },
      ],
      verificationStatus: 'supported',
      caveats: ['Relative contributions differ across tissues, populations, acclimatization, and freezing history.'],
    },
    {
      id: woodFrogFreezeClaimIds.iceRedistribution,
      type: 'qualitative',
      statement: 'Water redistribution and sequestration of ice in body compartments help limit damaging ice formation within organs and cells.',
      evidence: [{
        sourceId: 'source.jeb.wood-frog-hibernation-2013',
        locator: 'Introduction, water redistribution and ice sequestration paragraph',
        notes: 'The paper describes sequestration in coelomic and lymphatic compartments as protection against intra-organ ice damage.',
      }],
      verificationStatus: 'supported',
      caveats: ['The popular phrase “frozen solid” must not imply that every cell interior freezes uniformly.'],
    },
    {
      id: woodFrogFreezeClaimIds.alaskaTemperature,
      type: 'quantitative',
      statement: 'In one laboratory study, Interior Alaskan wood frogs survived experimental freezing to temperatures as low as −16°C.',
      quantity: {kind: 'scalar', value: -16, unit: '°C', precision: 'exact'},
      basis: 'measured',
      display: 'as low as −16°C',
      evidence: [{
        sourceId: 'source.jeb.wood-frog-hibernation-2013',
        locator: 'Summary and Results',
        notes: 'The result applies to the studied Interior Alaskan population under experimental conditions.',
      }],
      verificationStatus: 'supported',
      caveats: ['This is population- and experiment-specific and must not be presented as a universal species threshold.'],
    },
    {
      id: woodFrogFreezeClaimIds.alaskaDuration,
      type: 'quantitative',
      statement: 'In the same laboratory study, Interior Alaskan wood frogs endured a two-month freezing bout at −4°C.',
      quantity: {kind: 'scalar', value: 2, unit: 'months', precision: 'exact'},
      basis: 'measured',
      display: '2 months at −4°C',
      evidence: [{
        sourceId: 'source.jeb.wood-frog-hibernation-2013',
        locator: 'Summary',
        notes: 'The duration and temperature describe one controlled study of an Interior Alaskan population.',
      }],
      verificationStatus: 'supported',
      caveats: ['The quantity does not establish the normal duration for every wild wood frog.'],
    },
  ],
  caveats: [
    {
      id: 'wood-frog-freeze-tolerance.caveat.population',
      statement: 'Freeze tolerance varies sharply among wood-frog populations; Alaska-specific temperature and duration results are not universal species limits.',
      claimIds: [woodFrogFreezeClaimIds.alaskaTemperature, woodFrogFreezeClaimIds.alaskaDuration],
    },
    {
      id: 'wood-frog-freeze-tolerance.caveat.frozen-solid',
      statement: '“Frozen solid” is useful shorthand, but the mechanism depends on limiting and spatially managing ice rather than uniformly freezing every cell interior.',
      claimIds: [woodFrogFreezeClaimIds.freezeSurvival, woodFrogFreezeClaimIds.iceRedistribution],
    },
  ],
  hooks: [
    {
      id: woodFrogFreezeHookIds.stoppedHeart,
      archetype: 'impossible-sounding-fact',
      text: 'This frog can freeze until its heart stops—then thaw and move again.',
      viewerPromise: 'Explain how an apparently lifeless frozen frog protects its cells and recovers.',
      claimIds: [woodFrogFreezeClaimIds.freezeSurvival, woodFrogFreezeClaimIds.heartbeatBreathing],
    },
    {
      id: woodFrogFreezeHookIds.iceWithoutDeath,
      archetype: 'contradiction',
      text: 'Ice forms through this frog’s body, but the most dangerous ice is kept away from its cells.',
      viewerPromise: 'Resolve why the location of ice matters more than the simple fact of freezing.',
      claimIds: [woodFrogFreezeClaimIds.freezeSurvival, woodFrogFreezeClaimIds.iceRedistribution],
    },
    {
      id: woodFrogFreezeHookIds.chemicalShield,
      archetype: 'mystery',
      text: 'What protects a frozen frog when its circulation stops?',
      viewerPromise: 'Reveal the glucose, urea, and water-management system behind freeze tolerance.',
      claimIds: [woodFrogFreezeClaimIds.heartbeatBreathing, woodFrogFreezeClaimIds.glucoseCryoprotectant, woodFrogFreezeClaimIds.ureaAndGlucose],
    },
    {
      id: woodFrogFreezeHookIds.alaskaLaboratory,
      archetype: 'comparison',
      text: 'At −16°C, water is solid—yet some Alaskan wood frogs survived a laboratory freeze at that temperature.',
      viewerPromise: 'Contrast an intuitive cold benchmark with a carefully scoped experimental survival result.',
      claimIds: [woodFrogFreezeClaimIds.alaskaTemperature],
    },
  ],
  narrativeOpportunities: [
    {
      id: 'wood-frog-freeze-tolerance.narrative.apparent-death',
      title: 'Apparent death to controlled survival',
      description: 'Open on stopped heartbeat and breathing, then reveal the coordinated physical and chemical protection that makes thawing possible.',
      claimIds: [woodFrogFreezeClaimIds.heartbeatBreathing, woodFrogFreezeClaimIds.glucoseCryoprotectant, woodFrogFreezeClaimIds.iceRedistribution],
    },
    {
      id: 'wood-frog-freeze-tolerance.narrative.population-spectrum',
      title: 'Not every wood frog has the same limit',
      description: 'Use the Alaskan results to explain geographic variation without presenting one temperature as a universal threshold.',
      claimIds: [woodFrogFreezeClaimIds.alaskaTemperature, woodFrogFreezeClaimIds.alaskaDuration],
    },
  ],
  visualOpportunities: [
    {
      id: 'wood-frog-freeze-tolerance.visual.pulse-freeze-thaw',
      title: 'Freeze, flatline, thaw',
      description: 'Track a frog silhouette, temperature, heartbeat, and breathing through a reversible freeze cycle.',
      claimIds: [woodFrogFreezeClaimIds.freezeSurvival, woodFrogFreezeClaimIds.heartbeatBreathing],
    },
    {
      id: 'wood-frog-freeze-tolerance.visual.cell-protection',
      title: 'Ice outside, protected cell inside',
      description: 'Diagram water shifting and ice collecting in safer compartments while glucose and urea surround vulnerable tissue.',
      claimIds: [woodFrogFreezeClaimIds.glucoseCryoprotectant, woodFrogFreezeClaimIds.ureaAndGlucose, woodFrogFreezeClaimIds.iceRedistribution],
    },
  ],
  relatedQuestions: [
    'Why does intracellular ice damage cells?',
    'How do Alaskan and temperate wood-frog populations differ?',
    'Could freeze-tolerant animals inform organ preservation research?',
  ],
  followUpOpportunities: [
    'A population-specific short about the −16°C laboratory result',
    'A deeper comparison of freeze tolerance and freeze avoidance in animals',
  ],
  editorialStatus: 'review',
});
