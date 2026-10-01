import {execFileSync} from 'node:child_process';
import {mkdtempSync, readFileSync, rmSync, writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {describe, expect, it} from 'vitest';
import type {AIProvider} from '../src/ai/provider';
import {createTopicCandidateRegistry} from '../src/content-intelligence/registry';
import {topicCandidateSchema, topicEvaluationDraftSchema} from '../src/content-intelligence/schema';
import {evaluateTopicCandidate} from '../src/content-intelligence/workflow';
import {validateAdaptiveHistoricalBytes} from '../scripts/adaptive-historical-integrity';
import historicalBaseline from '../system-audits/adaptive-creative-direction-v1/historical-baseline.json';

const root = 'content-intelligence/discovery/cycle-2-2026-10-01';
const bundle = JSON.parse(readFileSync(`${root}/discovery.json`, 'utf8'));
const editorial = JSON.parse(readFileSync(`${root}/editorial-review.json`, 'utf8'));
const validate = (input: unknown) => {
  const directory = mkdtempSync(join(tmpdir(), 'magnivis-discovery-'));
  try {
    const path = join(directory, 'discovery.json');
    writeFileSync(path, JSON.stringify(input));
    return execFileSync(process.execPath, [
      '--import', 'tsx', 'scripts/validate-discovery.ts', path,
    ], {encoding: 'utf8', stdio: 'pipe'});
  } finally {
    rmSync(directory, {recursive: true, force: true});
  }
};

describe('open-world discovery and Cycle #2 stop boundary', () => {
  it('recognizes exact Cycle #1 closure without permitting further manifest edits', () => {
    const file = historicalBaseline.files.find(({path}) => path === 'artifacts/manifests.json')!;
    const bytes = readFileSync(file.path);
    expect(validateAdaptiveHistoricalBytes(file, bytes)).toBe('exact-cycle-1-closure');
    const records = JSON.parse(bytes.toString('utf8'));
    const edited = structuredClone(records);
    edited[0].artifactId = 'tampered-historical-record';
    expect(() => validateAdaptiveHistoricalBytes(file, Buffer.from(JSON.stringify(edited)))).toThrow('Historical byte regression');
    const appended = [...records, {...records.at(-1), artifactId: 'unauthorized-append'}];
    expect(() => validateAdaptiveHistoricalBytes(file, Buffer.from(JSON.stringify(appended)))).toThrow('Historical byte regression');
    expect(() => validateAdaptiveHistoricalBytes({...file, path: 'another-file.json'}, bytes)).toThrow('Historical byte regression');
  });

  it('evaluates an unseen legitimate field without category authorization', async () => {
    const candidate = topicCandidateSchema.parse({
      ...bundle.candidates[0],
      taxonomy: {
        pillar: 'interdisciplinary',
        domains: ['olfactory-heritage-studies'],
        topics: ['historical-scent-preservation'],
      },
    });
    const registry = createTopicCandidateRegistry([candidate]);
    const evaluation = topicEvaluationDraftSchema.parse(bundle.evaluations[0]);
    const provider: AIProvider = {
      id: 'fixture',
      generateStructured: async (request) => {
        expect(request.systemInstructions.join(' ')).toContain('taxonomy does not authorize a topic');
        expect(request.userPrompt).toContain('olfactory-heritage-studies');
        return {output: evaluation, model: 'fixture-open-world', generatedAt: '2026-10-01T00:00:00Z'};
      },
    };
    const result = await evaluateTopicCandidate(provider, registry.get(candidate.id));
    expect(result.artifact.recommendation).toBe('research');
    const modified = structuredClone(bundle);
    modified.candidates[0] = candidate;
    expect(JSON.parse(validate(modified)).selectedTopicId).toBeNull();
  });

  it('preserves discovery-only states and separates shortlist from finalists', () => {
    const result = JSON.parse(validate(bundle));
    expect(result.ownerReview).toBe('pending-selection');
    expect(result.selectedTopicId).toBeNull();
    const candidates = bundle.candidates.map((candidate: unknown) => topicCandidateSchema.parse(candidate));
    const evaluations = bundle.evaluations.map((evaluation: unknown) => topicEvaluationDraftSchema.parse(evaluation));
    const evaluated = new Set(evaluations.map(({topicCandidateId}: {topicCandidateId: string}) => topicCandidateId));
    expect(new Set(editorial.finalists).size).toBe(5);
    for (const id of editorial.finalists) expect(evaluated.has(id)).toBe(true);
    expect(evaluated.has(editorial.proposedTopicId)).toBe(true);
    expect(editorial.proposalIsOwnerApproval).toBe(false);
    expect(editorial.selectedTopicId).toBeNull();
    for (const candidate of candidates) {
      expect(candidate.status).toBe('evaluating');
      expect(candidate.review).toBeUndefined();
    }
    const sourceIds = new Set(JSON.parse(readFileSync(`${root}/search-log.json`, 'utf8')).sources
      .map(({id}: {id: string}) => id));
    expect(new Set(editorial.broadSignals.map(({topicCandidateId}: {topicCandidateId: string}) => topicCandidateId)))
      .toEqual(new Set(candidates.map(({id}: {id: string}) => id)));
    for (const signal of editorial.broadSignals) {
      for (const sourceId of signal.sourceIds) expect(sourceIds.has(sourceId)).toBe(true);
    }
  });

  it.each(['selection', 'approval', 'missing-triage', 'stale-evaluation', 'duplicate-identity'])(
    'rejects %s corruption at the durable discovery boundary',
    (kind) => {
      const corrupted = structuredClone(bundle);
      if (kind === 'selection') corrupted.selectedTopicId = editorial.proposedTopicId;
      if (kind === 'approval') corrupted.candidates[0].review = {
        reviewedBy: 'Invented reviewer', reviewedAt: '2026-10-01',
      };
      if (kind === 'missing-triage') corrupted.triage.pop();
      if (kind === 'stale-evaluation') corrupted.evaluations[0].candidateRevision++;
      if (kind === 'duplicate-identity') corrupted.candidates.push(corrupted.candidates[0]);
      expect(() => validate(corrupted)).toThrow();
    },
  );

  it('keeps the immutable Cycle #1 handoff valid', () => {
    const historical = JSON.parse(readFileSync(
      'content-intelligence/discovery/cycle-1-2026-09-30/discovery.json', 'utf8',
    ));
    expect(JSON.parse(validate(historical)).ownerReview).toBe('pending-selection');
  });
});
