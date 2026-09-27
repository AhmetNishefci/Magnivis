import {knowledgePackageRegistry, type KnowledgePackageRegistry} from '../knowledge/registry';
import {speedOfLightTopicCandidate} from './candidates/speed-of-light';
import {topicCandidateSchema, type TopicCandidate} from './schema';

export const createTopicCandidateRegistry = (
  inputs: readonly unknown[],
  packageRegistry: KnowledgePackageRegistry = knowledgePackageRegistry,
) => {
  const candidateMap = new Map<string, TopicCandidate>();
  const proposedPackageIds = new Set<string>();
  for (const input of inputs) {
    const candidate = topicCandidateSchema.parse(input);
    if (candidateMap.has(candidate.id)) {
      throw new Error(`Duplicate topic candidate ID: ${candidate.id}`);
    }
    if (proposedPackageIds.has(candidate.proposedKnowledgePackageId)) {
      throw new Error(`Duplicate proposed KnowledgePackage ID: ${candidate.proposedKnowledgePackageId}`);
    }
    if (candidate.status === 'accepted') {
      packageRegistry.get(candidate.proposedKnowledgePackageId);
    }
    candidateMap.set(candidate.id, candidate);
    proposedPackageIds.add(candidate.proposedKnowledgePackageId);
  }
  const candidates = [...candidateMap.values()].sort((left, right) =>
    left.id.localeCompare(right.id));
  return Object.freeze({
    get: (id: string) => {
      const candidate = candidateMap.get(id);
      if (!candidate) throw new Error(`Unknown topic candidate: ${id}`);
      return candidate;
    },
    list: () => [...candidates],
  });
};

export const topicCandidateRegistry = createTopicCandidateRegistry([
  speedOfLightTopicCandidate,
]);
