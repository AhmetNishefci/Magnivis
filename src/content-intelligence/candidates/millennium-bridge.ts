import {topicCandidateSchema} from '../schema';

export const millenniumBridgeTopicCandidate = topicCandidateSchema.parse({
  id: 'topic.millennium-bridge', revision: 1, proposedKnowledgePackageId: 'millennium-bridge',
  title: 'How balancing pedestrians can amplify bridge sway',
  centralQuestion: 'How can trying to keep your balance make a bridge sway more?',
  discovery: {kind: 'manual', recordedAt: '2026-09-30', notes: 'Post-reset reconstruction authorized by the owner; historical source leads required fresh inspection. See docs/RECOVERY.md.'},
  taxonomy: {pillar: 'technology-built-world', domains: ['structural-engineering', 'biomechanics'], topics: ['millennium-bridge', 'negative-damping']},
  timeliness: 'evergreen', whyInteresting: 'An individual balance correction can contribute to collective structural feedback.',
  audienceRelevance: 'Walking and balance provide familiar references for an engineering mechanism.',
  noveltyHypothesis: 'Distinguish force feedback from the simplified everyone-in-step story.',
  visualPotential: 'Original lateral walkway, varied pedestrians, energy-in and energy-out diagrams.',
  narrativePotential: 'Balance paradox, event, foot placement, collective response, caveat, damping.',
  status: 'researching',
});
