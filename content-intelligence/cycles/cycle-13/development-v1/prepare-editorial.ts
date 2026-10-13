/** One-time evidence-led authoring adapter. No paid provider, production or release. */
import {mkdirSync, readFileSync, writeFileSync} from 'node:fs';
import {knowledgePackageSchema} from '../../../../src/knowledge/schema';
import {contentAssetSchema} from '../../../../src/content-assets/schema';
import {verifyInternalEditorial} from '../../../../src/workflow/editorial';
import {sha256Json} from '../../../../src/content-intelligence/run-schema';
import {loadMediaRegistry, mediaHash} from '../../../../src/artifacts/media';
import {loadCycle, persistCycleEvent} from '../../../../src/workflow/store';
import data from './authoring-data.json';
const base = 'content-intelligence/cycles/cycle-13/development-v1';
const cycleRoot = 'content-intelligence/cycles/cycle-13';
const now = new Date().toISOString();
const id = 'devils-hole-seismic-seiche', aid = `${id}.asset.connection`;
const cid = (key: string) => `${id}.claim.${key}`;
const ref = (path: string) => ({path, sha256: mediaHash(path)});
const put = (name: string, value: unknown) => {
 const path = `${base}/${name}.json`; mkdirSync(path.slice(0, path.lastIndexOf('/')), {recursive: true});
 writeFileSync(path, JSON.stringify(value, null, 2) + '\n', {flag: 'wx'}); return ref(path);
};
const sources = data.sources.map(s => ({...s, sourceId: `source.${id}.${s.key}`, inspectedEvidence: put(`research/${s.key}-inspection`, {
 sourceId: `source.${id}.${s.key}`, url: s.url, retrievedAt: now,
 retrievalTimeBasis: 'Entry following actual session retrieval and inspection, not source publication time.',
 accessStatus: 'partially-inspected', acquisition: s.key === 'catalog' ? 'http-body' : 'manual-source-inspection',
 inspectedText: s.text, locator: s.locator, sourceQualityRationale: s.quality, limitations: s.limits,
 bodyRecord: ref(`${base}/${s.body}`),
 method: 'Bounded paraphrased assessment of actual inspected passages, with raw acquisition/extracted text retained. No search-snippet verification or monitoring-video playback implied.',
})}));
const quantities: Record<string, {value: number; unit: string; basis: 'estimated' | 'measured'; display: string}> = {
 magnitude: {value: 8.8, unit: 'magnitude', basis: 'estimated', display: 'magnitude 8.8'},
 distance: {value: 4000, unit: 'mile', basis: 'estimated', display: 'nearly 4,000 miles'},
 delay: {value: 21, unit: 'min', basis: 'estimated', display: '21 minutes (NPS reported)'},
 'wave-size': {value: 10, unit: 'in', basis: 'estimated', display: 'about ten inches (NPS reported)'},
};
const claims = data.definitions.map(d => {
 const key = d[0] as string, q = quantities[key];
 return {id: cid(key), statement: d[1] as string,
  ...(q ? {type: 'quantitative' as const, quantity: {kind: 'scalar' as const, value: q.value, unit: q.unit, precision: 'approximate' as const}, basis: q.basis, display: q.display} : {type: 'qualitative' as const}),
  verificationStatus: d[4] === 'verify' ? 'supported' as const : d[4] === 'unresolved' ? 'uncertain' as const : 'unverified' as const,
  caveats: [d[3] as string], evidence: (d[2] as string[]).map(key => {const s = sources.find(s => s.key === key)!; return {sourceId: s.sourceId, locator: s.locator, notes: d[3] as string};}),
 };
});
const selected = claims.filter(c => c.verificationStatus === 'supported').map(c => c.id);
const pkg = knowledgePackageSchema.parse({
 id, revision: 1, topic: 'Devils Hole and the distant Kamchatka earthquake',
 centralQuestion: 'How did an earthquake thousands of miles away make waves in a Nevada desert cave?',
 taxonomy: {pillar: 'earth-nature', domains: ['seismology', 'geography', 'conservation'], topics: ['devils-hole', 'seismic-seiche', 'kamchatka-earthquake', 'pupfish']},
 timeliness: 'evergreen', thesis: 'Passing seismic motion can set local enclosed water oscillating; a modest physical disturbance can affect the shallow shelf of an apparently isolated habitat.',
 viewerPayoff: 'Explain the distant-earthquake/local-water connection and its limited, real ecological consequence.',
 sources: sources.map(s => ({id: s.sourceId, organization: s.organization, title: s.title, sourceType: s.type, url: s.url, retrieved: now.slice(0, 10), notes: s.quality + ' ' + s.limits.join(' ')})),
 claims, caveats: [{id: `${id}.caveat.bounds`, statement: 'Reported event values remain qualified. Energy travels through/along Earth; local water oscillates. Ten-inch July 2025 waves and minor shelf disturbance, not an ocean tsunami reaching Nevada, a two-metre wall of water, near-extinction or a current fish count. Cave/ground-motion illustrations are schematic, not measured data or footage.', claimIds: selected}],
 hooks: [{id: `${id}.hook.connection`, archetype: 'distant-local-connection', text: data.lines[0]![0], viewerPromise: 'Explain what traveled and why water already inside a Nevada cave moved.', claimIds: [cid('local-event'), cid('distance')]},
 {id: `${id}.hook.delay`, archetype: 'delayed-observation', text: 'Twenty-one minutes after a distant earthquake, this desert pool was moving. How?', viewerPromise: 'Distinguish seismic energy from traveling ocean water.', claimIds: [cid('delay'), cid('local-water')]}],
 narrativeOpportunities: [{id: `${id}.narrative.connection`, title: 'What traveled?', description: 'Local slosh linked to remote quake → brief event context → seismic forcing → enclosed oscillation → shelf consequence → connected Earth insight.', claimIds: selected}],
 visualOpportunities: [{id: `${id}.visual.local-water`, title: 'The water stays here', description: 'Original geographic locator and faithful near-surface cave illustration; separate seismic ground motion from local water rocking and limited shelf-material movement.', claimIds: selected}],
 relatedQuestions: ['Why do different pools respond differently to the same earthquake?', 'How can ground-water systems register distant seismic motion?'], followUpOpportunities: [], editorialStatus: 'review',
});
const script = {language: 'en', segments: data.lines.map((line, i) => {
 const ids = line[1] as string[];
 return ids.length ? {id: `${aid}.script.${i + 1}`, type: 'factual' as const, text: line[0] as string, claimIds: ids.map(cid)} : {id: `${aid}.script.${i + 1}`, type: 'editorial' as const, text: line[0] as string};
})};
const asset = contentAssetSchema.parse({
 id: aid, revision: 1, knowledgePackageId: id, assetType: 'short-form-video', editorialPurpose: pkg.viewerPayoff,
 storyAngle: 'An isolated-looking pool responds to a remote earthquake through seismic motion, with a modest consequence for a vulnerable habitat.',
 hookId: pkg.hooks[0]!.id, selectedClaimIds: selected,
 durationIntentSeconds: {minimum: 45, maximum: 85},
 script, narrativeStructure: data.lines.map((_, i) => ({id: `${aid}.beat.${i + 1}`, label: `understanding-${i + 1}`, purpose: data.objectives[i], scriptSegmentIds: [`${aid}.script.${i + 1}`]})),
 visualPlan: data.lines.map((line, i) => ({id: `${aid}.visual.${i + 1}`, narrativeBeatId: `${aid}.beat.${i + 1}`, objective: data.objectives[i], visualType: i < 3 ? 'hybrid' : 'animation', suggestedPrimitive: 'bespoke', scriptSegmentIds: [`${aid}.script.${i + 1}`], claimIds: (line[1] as string[]).map(cid), notes: 'Original explanatory reconstruction, not monitoring footage. A geographic locator is schematic; seismic cues run through/along Earth, not seawater. Near-surface cave geometry and exaggerated ground motion are labeled schematic, with no claimed calibrated displacement or wave period. Reported ten inches is context, not an invented amplitude convention. Shelf persists; no implied complete stripping or fish death.'})),
 narrationPlan: {mode: 'narrated', voiceDirection: 'Established Kokoro af_heart. Connected natural English, immediate curiosity, calm physical explanation and proportional ecological consequence. No disaster delivery or unnecessary number recital speed. No narration generated at this stage.', pronunciationNotes: ['USGS gives seiche as SAYSH /seɪʃ/. Review Kamchatka and Devils Hole in complete speech units during authorized production; no ASR-only pronunciation pass or subjective listening claim.']},
 editorialStatus: 'editorial-review',
});
const review = {
 schemaVersion: 3, cycleId: 'cycle.13', topicCandidateId: 'topic.cycle13.devils-hole', enteredAt: now, reviewer: 'Codex internal evidence review; not Ahmet claim/script/visual approval',
 premiseAlignment: {selectionSha256: sha256Json(JSON.parse(readFileSync(`${cycleRoot}/topic-selection.json`, 'utf8'))), preservesPublishingOpportunity: true, rationale: 'Actual NPS event body, reviewed USGS catalog, seismic-seiche/ground-motion passages and site ecology preserve the approved distant-earthquake/local-cave premise and modest shelf consequence. Number qualifications and date conversion refine comprehension without changing the publishing question.'},
 packageSha256: sha256Json(pkg), assetSha256: sha256Json(asset), scriptSha256: sha256Json(asset.script),
 inspections: sources.map(s => ({sourceId: s.sourceId, accessStatus: 'partially-inspected', identityConfirmed: true, evidenceLocations: [s.locator], supportsClaimIds: claims.filter(c => c.verificationStatus === 'supported' && c.evidence.some(e => e.sourceId === s.sourceId)).map(c => c.id), limitations: s.limits, inspectedEvidence: s.inspectedEvidence, sourceQualityRationale: s.quality})),
 claims: claims.map(c => ({id: c.id, statementSha256: sha256Json(c.statement), disposition: c.verificationStatus === 'supported' ? 'verify' : c.verificationStatus === 'uncertain' ? 'unresolved' : 'exclude', rationale: c.caveats[0], evidence: c.verificationStatus === 'supported' ? c.evidence.map(e => ({sourceId: e.sourceId, locator: e.locator!, assessment: e.notes, sufficientForWording: true})) : [], qualificationsPreserved: true})),
 misconceptionSafeguards: ['Energy propagation and water displacement are distinct. No ocean-water path or subterranean channel from Russia to Nevada.', 'Distant forcing is represented by qualitative seismic surface-motion cues; no ray through Earth’s core, calibrated travel speed or human-perceptible shaking at the cave.', 'Date context is July29 Nevada/UTC, July30 Kamchatka local. No invented exact cave-arrival timestamp from a rounded interval.', 'Ten inches is a reported event value with unspecified height convention. No universal seiche size, metre-scale July wave or magnitude-equals-local-intensity claim.', 'Shelf dependence and limited July material loss are distinct from previous disturbances, extinction risk estimates and current population.', 'NPS before/after frames bear July14 and July30; not adjacent observations, a mortality test or a measured removal ratio.', 'An ocean tsunami can also have been generated by this earthquake; its existence does not make the cave waves a tsunami.', 'All new illustrations must identify schematic geometry/motion and reconstruction; source photos are consultation-only.'],
 comprehensionReview: 'First frame links a recognizable dry-rock pool to a distant earthquake without waiting for generic establishing footage. Event numbers appear sequentially. Existing water remains continuous as ground motion is separated and translated into rocking. The term seiche follows the visual causal explanation; the feeding shelf becomes meaningful only afterward. Ending resolves the connected-Earth idea. Actual first-frame clarity, caption density and pacing need future rendered review; no audience panel conducted.',
 rightsReview: 'Original geographic/cave/shelf illustrations selected conceptually. Three NPS-credited reference photos were inspected ephemerally under the published government-work policy, with asset URLs/hashes/credits retained; none imported for production. No monitoring video viewed or audio copied, no protected logo or source image selected. Established Manrope and af_heart remain proposed; record licenses and canonical identities for actual future assets when authorized.',
 careAssessment: {state: 'routine', rationale: 'Historical geophysical explanation with inspected operator evidence and corroborating scientific-agency mechanisms/catalog. No medical advice, exceptional cost, rights exception or brand deviation. Unselected exact resonance and exaggerated impact claims are excluded from the artifact.'},
 exceptionalConditions: [],
};
put('draft-package', pkg); put('draft-asset', asset); put('internal-editorial-review', review);
const ready = verifyInternalEditorial(review, pkg, asset);
put('knowledge-package.ready', ready.knowledgePackage); put('content-asset.ready', ready.contentAsset);
const record = put('editorial-receipt', {draftPackage: pkg, draftAsset: asset, review});
const registry = loadMediaRegistry();
const state = persistCycleEvent(process.cwd(), loadCycle(process.cwd(), 'cycle.13', registry), {type: 'complete-internal', stage: 'editorial', record, at: new Date().toISOString()}, registry);
console.log(JSON.stringify({stage: state.stage, revision: state.revision, words: script.segments.map(s => s.text).join(' ').split(/\s+/).length, verified: selected.length, excluded: 5, unresolvedUnselected: 1, ownerScriptApproval: false, productionBegun: false}, null, 2));
