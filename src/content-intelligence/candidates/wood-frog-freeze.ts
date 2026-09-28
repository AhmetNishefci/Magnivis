import {topicCandidateSchema} from '../schema';

export const woodFrogFreezeTopicCandidate = topicCandidateSchema.parse({
  id: 'topic.wood-frog-freeze',
  revision: 2,
  proposedKnowledgePackageId: 'wood-frog-freeze-tolerance',
  title: 'How wood frogs survive being frozen',
  centralQuestion: 'How can a wood frog survive with much of its body water frozen and its heartbeat stopped?',
  discovery: {
    kind: 'manual',
    recordedAt: '2026-09-27',
    notes: 'Selected for the first real Content Intelligence operator trial because it combines a startling biological event, a clear mechanism, strong visual potential, and authoritative source coverage.',
  },
  taxonomy: {
    pillar: 'earth-nature',
    domains: ['zoology', 'physiology', 'cryobiology'],
    topics: ['wood-frog', 'freeze-tolerance', 'cryoprotectants'],
  },
  timeliness: 'evergreen',
  whyInteresting: 'The apparent contradiction—a vertebrate survives extensive extracellular ice and reversible cardiac arrest—creates an immediate curiosity gap with a real physiological explanation.',
  audienceRelevance: 'The premise is understandable without specialist knowledge and resolves a familiar assumption that freezing is always fatal to an animal.',
  noveltyHypothesis: 'Showing the difference between ice around cells and protected cell interiors can move the story beyond the familiar headline that a frog freezes.',
  visualPotential: 'A winter forest, progressive body freeze, stopped pulse, cell-level ice diagram, glucose and urea protection, and thaw sequence provide distinct visual beats.',
  narrativePotential: 'The story can open with reversible cardiac arrest, reveal that not all freezing is equal, explain chemical and spatial protection, and pay off with ordered thawing recovery.',
  status: 'researching',
});
