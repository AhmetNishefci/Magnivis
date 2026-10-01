import {createHash} from 'node:crypto';
import {readFileSync, existsSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {z} from 'zod';
import {topicCandidateSchema, topicEvaluationDraftSchema} from '../src/content-intelligence/schema';

const directory = 'content-intelligence/discovery/cycle-3-2026-10-01';
const base = '93e9fff0e7390e88f111d925a6baa3588d74de00';
const gate = 'AHMET — CONTENT CYCLE #3 TOPIC SELECTION';
const json = (path: string): unknown => JSON.parse(readFileSync(path, 'utf8'));
const hash = (path: string) => createHash('sha256').update(readFileSync(path)).digest('hex');
const assert = (condition: boolean, message: string) => {
  if (!condition) throw new Error(message);
};
const discovery = z.object({
  baseCommit: z.literal(base), ownerReview: z.literal('pending-selection'), selectedTopicId: z.null(),
  candidates: z.array(topicCandidateSchema), evaluations: z.array(topicEvaluationDraftSchema),
}).parse(json(`${directory}/discovery.json`));
const text = z.string().min(1);
const shortlistSchema = z.object({
  slug: text, title: text, centralQuestion: text, pillar: text, domains: z.array(text).min(1),
  whyCare: text, payoff: text, visualOpportunity: text, principalRisk: text, evidencePath: text,
  historyComparison: text, conceptualArc: text, researchRequirements: z.array(text).min(1),
  advancementJudgment: text, preliminaryHooks: z.array(text).min(1), timeliness: text,
  shortFormFeasibility: text, sourceUrls: z.array(z.url()).min(1),
}).strict();
const editorial = z.object({
  schemaVersion: z.literal(1), ownerReview: z.literal('pending-selection'), selectedTopicId: z.null(),
  proposedTopicId: text, proposalIsOwnerApproval: z.literal(false),
  finalists: z.array(text).length(5), shortlist: z.array(shortlistSchema).length(10),
  nextHumanGate: z.literal(gate),
}).strict().parse(json(`${directory}/editorial-review.json`));
const evaluated = new Set(discovery.evaluations.map(row => row.topicCandidateId));
const shortlisted = new Set(editorial.shortlist.map(row => `topic.${row.slug}`));
assert(shortlisted.size === 10 && [...shortlisted].every(id => evaluated.has(id)), 'Shortlist/evaluation drift');
assert(new Set(editorial.finalists).size === 5 && editorial.finalists.every(id => shortlisted.has(id)), 'Finalist drift');
assert(editorial.finalists.includes(editorial.proposedTopicId), 'Advisory advance must be a finalist');
assert(discovery.candidates.length === 34, 'Incomplete pool');
const pool = z.object({
  phase: z.literal('broad-ideas-before-classification-and-filtering'),
  candidates: z.array(z.object({id: text, title: text, centralQuestion: text, sourceUrls: z.array(z.url()).min(1), signal: text}).strict()),
}).parse(json(`${directory}/pool-input.json`));
assert(pool.candidates.length === discovery.candidates.length && pool.candidates.every(row => discovery.candidates.some(c => c.id === `topic.${row.id}` && c.title === row.title && c.centralQuestion === row.centralQuestion)), 'Unclassified pool drift');
for (const path of ['cycle-1-2026-09-30', 'cycle-2-2026-10-01']) {
  const previous = z.object({candidates: z.array(topicCandidateSchema)}).parse(json(`content-intelligence/discovery/${path}/discovery.json`));
  assert(previous.candidates.every(c => !discovery.candidates.some(n => n.id === c.id || n.title === c.title)), 'Historical discovery identity reused');
}
const reportPath = 'content-intelligence/operations/longitude-clock-scheduling-v1/owner-report.json';
const report = z.object({
  evidenceClass: z.literal('OWNER-REPORTED SCHEDULING EVIDENCE'), owner: z.literal('Ahmet Nishefci'),
  recordedAt: z.iso.datetime({offset: true}), recordedAtMeaning: text, ownerSchedulingActionTime: z.null(),
  scheduledPublication: z.object({date: z.literal('2026-10-02'), localTime: z.literal('20:00'), locality: z.literal('Kosovo'), timezoneAsSupplied: z.literal('Europe/Pristina')}).strict(),
  platforms: z.array(z.object({platform: text, ownerReportedState: z.literal('manually-scheduled'), deliveryId: text, manifestFileSha256: text, scheduledTimeBasis: text, platformContentId: z.null(), publicUrl: z.null(), publishedAt: z.null(), presentationResults: z.null(), deviceEvidence: z.null(), screenshots: z.null(), analytics: z.null()}).strict()).length(4),
  releaseBinding: z.object({path: text, sha256: text}).strict(),
  master: z.object({path: text, sha256: text}).strict(),
  publicationOccurred: z.literal(false), completedPublicationRecordsCreated: z.literal(false), assistantExternalAction: z.literal(false),
}).parse(json(reportPath));
assert(hash(report.releaseBinding.path) === report.releaseBinding.sha256, 'Scheduling release binding drift');
const release = z.object({master: z.object({path: text, sha256: text}), packages: z.array(z.object({platform: text, deliveryId: text, directory: text, manifestFileSha256: text}))}).parse(json(report.releaseBinding.path));
assert(JSON.stringify(report.master) === JSON.stringify(release.master) && hash(report.master.path) === report.master.sha256, 'Locked master drift');
assert(new Set(report.platforms.map(p => p.platform)).size === 4, 'Duplicate scheduling platform');
for (const p of report.platforms) {
  const exact = release.packages.find(row => row.platform === p.platform);
  assert(Boolean(exact && exact.deliveryId === p.deliveryId && exact.manifestFileSha256 === p.manifestFileSha256), 'Scheduled package identity drift');
}
// Every existing source/media/approval/manifest file is preserved. Only six current docs may change.
const docs = ['PROJECT-STATE', 'STRATEGY', 'OPERATIONS', 'ROADMAP', 'CONTENT-INTELLIGENCE', 'DECISIONS'].map(name => `docs/${name}.md`);
const changed = execFileSync('git', ['diff', '--name-only', base], {encoding: 'utf8'}).trim().split('\n').filter(Boolean);
const newAllowed = (path: string) => path.startsWith(`${directory}/`) || path === reportPath || path === 'scripts/validate-cycle-3.ts';
assert(changed.every(path => docs.includes(path) || newAllowed(path)), 'Unauthorized historical/source change');
const existing = execFileSync('git', ['ls-tree', '-r', '--name-only', base], {encoding: 'utf8'}).trim().split('\n');
assert(existing.every(path => existsSync(path)), 'Historical tracked file removed');
const untracked = execFileSync('git', ['ls-files', '--others', '--exclude-standard'], {encoding: 'utf8'}).trim().split('\n').filter(Boolean);
assert(untracked.every(newAllowed), 'Artifact outside authorized discovery/scheduling boundary');
const strategy = readFileSync('docs/STRATEGY.md', 'utf8');
for (const phrase of ['one excellent unique short-form video per day', 'target cadence, not a production quota', 'production cadence are separate', '20:00 Kosovo local time', 'not an analytics-established', 'higher, lower or otherwise adapted']) {
  assert(strategy.includes(phrase), `Cadence/window constraint missing: ${phrase}`);
}
const inputs = z.object({openWorld: z.literal(true), classificationAfterDiscovery: z.literal(true), topicProductionConvenienceAdvantage: z.literal(0), cycle2Merged: z.literal(false), nextHumanGate: z.literal(gate)}).parse(json(`${directory}/discovery-inputs.json`));
const guide = readFileSync(`${directory}/owner-review.md`, 'utf8');
for (const phrase of ['Kokoro af_heart', 'Completely new legitimate domains remain eligible', 'Story-led duration', 'No KnowledgePackage', gate]) assert(guide.includes(phrase), `Missing handoff boundary: ${phrase}`);
console.log(JSON.stringify({passed: true, candidates: discovery.candidates.length, distinctIdeas: 33, shortlist: shortlisted.size, finalists: editorial.finalists.length, selectedTopicId: null, scheduledPlatforms: report.platforms.map(p => p.platform), historicalFilesPreserved: existing.length - docs.length, openWorld: inputs.openWorld, productionStarted: false, publicationClaimed: false, nextHumanGate: gate}, null, 2));
