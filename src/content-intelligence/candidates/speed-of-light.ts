import {speedOfLightKnowledgePackage} from '../../knowledge/packages/speed-of-light';
import {topicCandidateSchema} from '../schema';

export const speedOfLightTopicCandidate = topicCandidateSchema.parse({
  id: 'topic.speed-of-light',
  revision: 1,
  proposedKnowledgePackageId: speedOfLightKnowledgePackage.id,
  title: 'What the speed of light actually means',
  centralQuestion: 'How can light cross Earth repeatedly in one second and still take years to reach another star?',
  discovery: {
    kind: 'legacy-migration',
    recordedAt: '2026-09-27',
    notes: 'Retrospective candidate record for the first production KnowledgePackage; the original discovery date was not reconstructed.',
  },
  taxonomy: speedOfLightKnowledgePackage.taxonomy,
  timeliness: speedOfLightKnowledgePackage.timeliness,
  whyInteresting: 'It creates an immediate contradiction between an intuitively enormous speed and an even larger cosmic distance.',
  audienceRelevance: 'The familiar Earth, Moon, Sun, and nearest-star references make an abstract physical constant understandable.',
  noveltyHypothesis: 'A continuous visual scale ladder can make the familiar speed-of-light fact feel newly surprising.',
  visualPotential: 'Photon laps, distance beams, numeric motion, and progressively larger astronomical scales can carry the explanation.',
  narrativePotential: 'The story can escalate from one second on Earth to multiple years between stars while preserving one clear idea.',
  status: 'accepted',
  review: {
    reviewedBy: 'Magnivis human editorial review',
    reviewedAt: '2026-09-27',
    notes: 'Retrospective acceptance based on the approved package and reviewed production asset.',
  },
});
