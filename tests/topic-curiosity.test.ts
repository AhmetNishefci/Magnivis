import {mkdtempSync, readFileSync, rmSync, writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {afterEach, describe, expect, it} from 'vitest';
import {mediaHash} from '../src/artifacts/media';
import {contentIntelligencePromptRegistry} from '../src/content-intelligence/prompts';
import {chooseTopicAutonomously, validateTopicSelection} from '../src/workflow/topic-selection';
import historical from '../system-audits/topic-curiosity-v3/historical-selections.json';

const roots: string[] = [];
afterEach(() => roots.splice(0).forEach(root => rmSync(root, {recursive: true, force: true})));
const fixture = () => {
  const root = mkdtempSync(join(tmpdir(), 'magnivis-curiosity-')); roots.push(root);
  let sequence = 0;
  const preserve = async (value: unknown) => {
    const path = `record-${++sequence}.json`;
    writeFileSync(join(root, path), JSON.stringify(value));
    return {path, sha256: mediaHash(join(root, path))};
  };
  writeFileSync(join(root, 'source.json'), '{}');
  const source = {path: 'source.json', sha256: mediaHash(join(root, 'source.json'))};
  const review = {honestPremise: 'A defensible question independent of specialist interest.', coldAudienceReason: 'The premise raises an accessible unresolved tension.', interestOrigin: 'premise-led' as const, storyRoute: 'An unenumerated documented narrative form', truthBoundary: {state: 'credible-lead' as const, rationale: 'Source inspection still required.'}, opportunityJudgment: {sufficient: true, rationale: 'Compelling qualitative test opportunity.'}, shareability: null};
  const candidate = {id: 'one', subject: 'Synthetic question', domains: ['a-domain-never-enumerated'], novelty: 'New question.', evidenceFeasibility: 'Bound lead.', explanatoryPayoff: 'Resolve tension.', visualPotential: 'Story determines treatment.', audienceCuriosity: 'Question creates interest.', productionFeasibility: 'No renderer preference.', portfolioDiversity: 'No rotation.', comparison: 'Qualitative comparison.', evidence: [source], disposition: 'eligible' as const, limitations: ['Synthetic tests are not source verification.'], curiosityReview: review};
  const selection = {schemaVersion: 3 as const, method: 'qualitative-open-world-comparison' as const, cycleId: 'cycle.curiosity-test', searchRecord: source, searchBreadth: 'Open-world synthetic search.', classificationAfterDiscovery: true as const, historyReviewed: [source], analyticsInfluence: 'provenance-bearing-signals-not-category-rules' as const, convenienceAdvantageRejected: true as const, selectionStandard: 'cold-audience-curiosity.v1' as const, poolReview: {adequateOpportunityFound: true, rationale: 'An adequate opportunity exists.', nextSearchChange: null as string | null}, candidates: [candidate, {...candidate, id: 'two', domains: ['abstract-new-domain']}], selectedId: 'one', outcome: 'selected' as const, rationale: 'Story quality is authority.'};
  const continuing = {...selection, outcome: 'continue-discovery' as const, selectedId: null, poolReview: {adequateOpportunityFound: false, rationale: 'Only acceptable opportunities so far.', nextSearchChange: 'Broaden sources and pursue new narrative questions.'}};
  return {root, preserve, selection, continuing};
};

describe('Prospective curiosity standard inside V3', () => {
  it('requires qualitative premise and absolute pool judgments without a numerical score', () => {
    const f = fixture();
    expect(validateTopicSelection(f.selection, f.root).selectedId).toBe('one');
    const {curiosityReview: _review, ...legacyCandidate} = f.selection.candidates[0]!; void _review;
    expect(() => validateTopicSelection({...f.selection, candidates: [legacyCandidate, f.selection.candidates[1]]}, f.root)).toThrow(/cold-audience/);
    expect(() => validateTopicSelection({...f.selection, viralScore: 99}, f.root)).toThrow();
    expect(() => validateTopicSelection({...f.selection, poolReview: {...f.selection.poolReview, adequateOpportunityFound: false}}, f.root)).toThrow(/compelling/);
    const candidates = f.selection.candidates.map(c => ({...c, curiosityReview: {...c.curiosityReview, opportunityJudgment: {sufficient: false, rationale: 'Merely acceptable.'}}}));
    expect(() => validateTopicSelection({...f.selection, candidates}, f.root)).toThrow(/compelling/);
  });
  it('keeps unseen domains, subtle subjects and open narrative forms eligible; sharing is optional', () => {
    const f = fixture();
    const candidates = f.selection.candidates.map(c => ({...c, subject: 'An abstract philosophical tension', curiosityReview: {...c.curiosityReview, interestOrigin: 'context-led', storyRoute: 'A documented decision and its consequences'}}));
    expect(validateTopicSelection({...f.selection, candidates}, f.root).selectedId).toBe('one');
    expect(validateTopicSelection(f.selection, f.root).candidates[0]!.curiosityReview!.shareability).toBeNull();
  });
  it('rejects unsupported curiosity while allowing a truthful reframing', () => {
    const f = fixture();
    const candidates = f.selection.candidates.map(c => ({...c, curiosityReview: {...c.curiosityReview, truthBoundary: {state: 'unsupported', rationale: 'Popular premise unsupported.'}}}));
    expect(() => validateTopicSelection({...f.selection, candidates}, f.root)).toThrow(/legitimate/);
    const reframed = candidates.map(c => ({...c, curiosityReview: {...c.curiosityReview, truthBoundary: {state: 'reframed', rationale: 'An honest underlying question remains, pending evidence verification.'}}}));
    expect(validateTopicSelection({...f.selection, candidates: reframed}, f.root).outcome).toBe('selected');
  });
  it('preserves exact historical decisions but does not let their exemption authorize altered or new decisions', () => {
    for (const record of historical) {
      const selection = JSON.parse(readFileSync(record.path, 'utf8'));
      expect(validateTopicSelection(selection).outcome).toBe('selected');
      expect(() => validateTopicSelection({...selection, rationale: 'Changed decision'})).toThrow(/cold-audience/);
      expect(() => validateTopicSelection({...selection, cycleId: 'cycle.another'})).toThrow(/cold-audience/);
    }
  });
  it('stops weak pools at the effort bound, resumes remaining rounds and never makes exhaustion an owner gate', async () => {
    const f = fixture(); let calls = 0;
    const first = await chooseTopicAutonomously({root: f.root, maximumRounds: 1, preserve: f.preserve, discoverAndCompare: async () => {calls++; return f.continuing;}});
    expect(first.outcome).toBe('continue-discovery'); expect(first.selection).toBeNull(); expect(calls).toBe(1);
    const exhausted = await chooseTopicAutonomously({root: f.root, maximumRounds: 1, priorRecords: first.records, preserve: f.preserve, discoverAndCompare: async () => {throw new Error('Budget was reset');}});
    expect(exhausted.records).toEqual(first.records);
    const resumed = await chooseTopicAutonomously({root: f.root, maximumRounds: 2, priorRecords: first.records, preserve: f.preserve, discoverAndCompare: async (round, pools) => {expect(round).toBe(2); expect(pools).toHaveLength(1); return {...f.selection, candidates: [{...f.selection.candidates[0]!, id: 'fresh-opportunity'}, f.selection.candidates[1]!], selectedId: 'fresh-opportunity'};}});
    expect(resumed.outcome).toBe('selected'); expect(resumed.selection?.selectedId).toBe('fresh-opportunity'); expect(resumed.records).toHaveLength(2);
    await expect(chooseTopicAutonomously({root: f.root, maximumRounds: 3, priorRecords: resumed.records, preserve: f.preserve, discoverAndCompare: async () => f.selection})).rejects.toThrow(/unfinished/);
  });
  it('rejects repeated, cross-cycle and tampered resumed pools; continuation explains the next search', async () => {
    const f = fixture(); const ref = await f.preserve(f.continuing);
    const run = (priorRecords = [ref]) => chooseTopicAutonomously({root: f.root, maximumRounds: 2, priorRecords, preserve: f.preserve, discoverAndCompare: async () => ({...f.selection, cycleId: 'cycle.different'})});
    await expect(run([ref, ref])).rejects.toThrow(/Duplicate/);
    await expect(run()).rejects.toThrow(/switch cycles/);
    expect(() => validateTopicSelection({...f.continuing, poolReview: {...f.continuing.poolReview, nextSearchChange: null}}, f.root)).toThrow(/broaden/);
    writeFileSync(join(f.root, ref.path), '{}'); await expect(run()).rejects.toThrow(/digest/);
  });
  it('uses the strengthened advisory prompt prospectively and preserves old workflow-version validation', () => {
    const current = contentIntelligencePromptRegistry.get('workflow.topic-evaluation');
    expect(current.version).toBe(3);
    const instructions = current.systemInstructions.join(' ');
    expect(instructions).toMatch(/zero domain interest/);
    expect(instructions).toMatch(/actual evidence is retrieved and inspected under V3/);
    expect(instructions).not.toMatch(/until a human retrieves it/);
    expect(instructions).toMatch(/subtle or abstract/);
    expect(instructions).toMatch(/documented events/);
    expect(instructions).toMatch(/truthful underlying/);
    expect(instructions).toMatch(/never mandatory queue/);
    expect(instructions).toMatch(/scheduling and qualitative feedback are not analytics/);
    expect(instructions).toMatch(/not a whitelist/);
    expect(contentIntelligencePromptRegistry.get(current.id, 1).version).toBe(1);
    expect(contentIntelligencePromptRegistry.get(current.id, 2).version).toBe(2);
    expect(instructions).toMatch(/no avoidance penalty, automatic preference or novelty bonus/);
    expect(instructions).toMatch(/strong hook with a trivial payoff is insufficient/);
    expect(instructions).toMatch(/Production potential alone cannot rescue/);
    expect(instructions).toMatch(/claims.*remain investigable/);
    expect(instructions).toMatch(/Hooks must be truthful independently/);
    expect(() => contentIntelligencePromptRegistry.get(current.id, 99)).toThrow();
  });
});
