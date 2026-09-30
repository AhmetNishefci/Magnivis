import {createHash} from 'node:crypto';
import {mkdirSync, readFileSync, writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {millenniumBridgeContentAsset as asset} from '../../content-assets/assets/millennium-bridge';
import {createContentAssetRegistry} from '../../content-assets/registry';
import {millenniumBridgeKnowledgePackage as knowledgePackage, millenniumBridgeClaimIds as c, millenniumBridgeSourceIds as s} from '../../knowledge/packages/millennium-bridge';
import {createKnowledgePackageRegistry} from '../../knowledge/registry';
import {claimReviewBundleSchema, validateClaimReviewBundle, type ClaimReviewBundle} from '../claim-review';
import {sha256Json, stableJson} from '../run-schema';

// Owner-supplied historical text, not bytes recovered from the lost repository.
export const historicalMillenniumBridgeNarration = 'How can trying to keep your balance make a bridge sway more? On opening day, London’s Millennium Bridge moved sideways. When a walkway shifts, people adjust where they step to stay upright. In a crowd, those sideways forces can feed energy back into the bridge. Instead of dying away, the sway can grow. That can begin without everyone matching footsteps. Later coordination may change the motion; its exact role that day remains uncertain. Engineers added dampers to take energy out of the movement, suppressing the sway.';
export const reconstructedMillenniumBridgeNarration = asset.script.segments.map(({text}) => text).join(' ');
const sha256Bytes = (text: string) => createHash('sha256').update(text, 'utf8').digest('hex');
const access: Record<string, ClaimReviewBundle['sourceInspections'][number]['accessStatus']> = {
  [s.investigation]: 'partially-inspected', [s.asce]: 'abstract-only',
  [s.oscillators]: 'partially-inspected', [s.balance]: 'abstract-only',
  [s.footPlacement]: 'partially-inspected', [s.synthesis]: 'partially-inspected',
  [s.chronology]: 'partially-inspected', [s.retrospective]: 'partially-inspected',
};

export const millenniumBridgeClaimReview = claimReviewBundleSchema.parse({
  schemaVersion: 1, id: 'claim-review.millennium-bridge.reconstruction.v1',
  packageId: knowledgePackage.id, packageRevision: knowledgePackage.revision,
  assetId: asset.id, assetRevision: asset.revision,
  preparedBy: {kind: 'ai-assisted-research', name: 'Codex fresh evidence inspection'},
  preparedAt: '2026-09-30T15:28:26.000Z', status: 'ready-for-owner-decision',
  sourceInspections: knowledgePackage.sources.map((source) => ({
    sourceId: source.id, accessStatus: access[source.id], identityConfirmed: true,
    evidenceLocations: [...new Set(knowledgePackage.claims.flatMap(({evidence}) => evidence.filter(({sourceId}) => sourceId === source.id).map(({locator}) => locator!)))],
    supportsClaimIds: knowledgePackage.claims.filter(({evidence}) => evidence.some(({sourceId}) => sourceId === source.id)).map(({id}) => id),
    limitations: [source.notes!],
  })),
  claimReviews: knowledgePackage.claims.map((claim) => ({
    claimId: claim.id, statement: claim.statement, statementSha256: sha256Json(claim.statement),
    decision: 'retain', recommendedVerificationStatus: 'verified',
    rationale: claim.id === c.dayUncertainty
      ? 'Qualified inference about the inspected evidence limits; no unique event attribution or measured mechanism share is asserted.'
      : 'Freshly inspected evidence supports this wording within the recorded caveats. Verification remains an owner decision, not an automatic promotion.',
    evidence: claim.evidence.map(({sourceId, locator, notes}) => ({sourceId, locator: locator!, assessment: `Inspection paraphrase, not a quotation: ${notes}`})),
    limitations: claim.caveats,
    useInRecommendedAsset: asset.selectedClaimIds.includes(claim.id), ownerDecisionRequired: true,
  })),
  recommendedHookId: asset.hookId,
  unresolvedResearch: [
    'Injury status not established by inspected authoritative sources; omit all injury assertions.',
    'No unique reconstruction of the opening-day mixture of coordination and gait mechanisms.',
    'Original investigation mirror omits printed pages 22–23; ASCE and Macdonald paper access was abstract-only.',
    'Final 2002 commissioning dataset not inspected; testing claim is limited to the 2001 prototype report.',
  ],
});

export const millenniumBridgeExclusions = [
  {wording: 'Everyone deliberately walked in step.', result: 'exclude', reason: 'No evidence for deliberate crowd-wide lockstep.'},
  {wording: 'Crowd-wide synchronization was necessarily the sole initiating cause.', result: 'reject', reason: 'Balance models permit instability without that necessary condition.'},
  {wording: 'Synchronization played no role at all.', result: 'reject', reason: 'Later coherence can influence response; event attribution is limited.'},
  {wording: 'The primary problem was vertical bouncing.', result: 'reject', reason: 'Contemporary investigation describes lateral motion.'},
  {wording: 'The bridge simply exceeded its weight capacity.', result: 'exclude', reason: 'Dynamic instability is not evidence of exceeding static weight capacity.'},
  {wording: 'Dampers made future motion physically impossible.', result: 'reject', reason: 'Damping dissipates energy; it does not prohibit displacement.'},
  {wording: 'The problem could never recur.', result: 'exclude', reason: 'No absolute future guarantee is established.'},
  {wording: 'No one was injured.', result: 'exclude-unknown', reason: 'No sufficiently authoritative inspected evidence establishing injury status.'},
] as const;

const claimLedger = knowledgePackage.claims.map((claim) => ({
  claimId: claim.id, claimWording: claim.statement, evidence: millenniumBridgeClaimReview.claimReviews.find(({claimId}) => claimId === claim.id)!.evidence,
  qualification: claim.caveats,
  confidence: claim.id === c.dayUncertainty ? 'qualified evidence-limit inference' : claim.caveats.length ? 'supported within explicit qualifications' : 'supported by inspected source context',
  status: claim.verificationStatus, reviewState: 'ready-for-owner-decision',
  narrationEligibility: asset.selectedClaimIds.includes(claim.id) ? 'proposed exact script use; requires owner approval' : 'context only; not selected in this script',
  onScreenEligibility: 'only within approved wording and caveats after owner approval',
  productionEligible: false,
}));

const provenance = {
  kind: 'post-reset-reconstruction', baseline: 'ae797996382c337759612265fd8229e8d5f06eef',
  recoveryBranch: 'recovery/magnivis-post-reset', exactLostGitObjectsRecovered: false,
  historicalInput: 'Owner-supplied post-reset handoff; reported historical editorial approval, not a recovered file or fresh approval.',
  historicalApprovalTimestamp: null, freshEvidenceInspection: millenniumBridgeClaimReview.preparedAt,
  historicalNarration: historicalMillenniumBridgeNarration, reconstructedNarration: reconstructedMillenniumBridgeNarration,
  utf8TextMatchesHistoricalHandoff: Buffer.from(historicalMillenniumBridgeNarration).equals(Buffer.from(reconstructedMillenniumBridgeNarration)),
  reconstructedNarrationUtf8Sha256: sha256Bytes(reconstructedMillenniumBridgeNarration),
  freshOwnerApproval: 'pending', productionAuthorized: false,
  evidenceMethod: 'Manual source inspection in this session; no fictional AI-provider runs or recovered original artifacts.',
  durableHistory: 'docs/RECOVERY.md',
};

const reviewMarkdown = () => [
  '# Millennium Bridge reconstruction owner review', '',
  'Research reconstructed; claims supported/qualified for owner verification; editorial package reconstructed. Ready for owner reconstruction review. Production is not authorized.', '',
  'Historical approval is reported in the owner handoff. This review records fresh evidence inspection, not a new owner approval. All claim statuses remain supported until an explicit owner decision.', '',
  '## Source inspections', '',
  ...knowledgePackage.sources.flatMap((source) => [`- **${source.title}** — ${access[source.id]}. [Canonical source](${source.url}). ${source.notes}`, '']),
  '## Claim ledger', '',
  ...claimLedger.flatMap((entry) => [
    `### ${entry.claimId}`, '', entry.claimWording, '',
    `Confidence: ${entry.confidence}. Status: ${entry.status}; ${entry.reviewState}. Narration: ${entry.narrationEligibility}. On-screen: ${entry.onScreenEligibility}.`, '',
    ...entry.evidence.map(({sourceId, locator, assessment}) => `- ${sourceId}: ${locator}. ${assessment}`), '',
    `Qualifications: ${entry.qualification.join(' ') || 'No additional claim-specific qualification.'}`, '',
  ]),
  '## Exact proposed hook and narration', '', asset.script.segments[0]!.text, '', reconstructedMillenniumBridgeNarration, '',
  'All factual segments are bound to selected claims. Text matches the historical owner handoff byte-for-byte in UTF-8; this does not demonstrate identity with any lost file or media.', '',
  '## Six beats and editorial VisualPlan', '',
  ...asset.narrativeStructure.flatMap((beat) => {
    const visual = asset.visualPlan.find(({narrativeBeatId}) => narrativeBeatId === beat.id)!;
    return [`- **${beat.label}:** ${visual.objective} ${visual.notes}`, ''];
  }),
  '## Exclusions and uncertainty', '',
  ...millenniumBridgeExclusions.map(({wording, result, reason}) => `- ${result}: “${wording}” ${reason}`), '',
  'Injury inquiry: original investigation, official operator and Arup material plus targeted official-source searches did not establish injury status. Unknown; no positive or negative injury claim is eligible.', '',
  '## Owner gate', '',
  'Review all 18 claims and their evidence/access limitations, the exact hook/narration, six beats, original-vector VisualPlan and disclosure requirements. Record an explicit reconstruction editorial decision with current statement hashes and an actual reviewer/time. The unfilled template is not approval. Production requires a separate authorization after this gate.', '',
].join('\n');

export const millenniumBridgeReviewArtifacts = () => {
  validateClaimReviewBundle(millenniumBridgeClaimReview, knowledgePackage, asset);
  createContentAssetRegistry([asset], createKnowledgePackageRegistry([knowledgePackage]));
  if (!provenance.utf8TextMatchesHistoricalHandoff) throw new Error('Historical narration changed; owner review of factual change required');
  const json = (value: unknown) => `${stableJson(value, 2)}\n`;
  const files: Record<string, string> = {
    'knowledge-package.review.json': json(knowledgePackage), 'content-asset.review.json': json(asset),
    'claim-review.json': json(millenniumBridgeClaimReview), 'claim-ledger.json': json(claimLedger),
    'reconstruction-provenance.json': json(provenance), 'review.md': reviewMarkdown(),
    'owner-decision.template.json': json({
      schemaVersion: 1, id: 'owner-decision.millennium-bridge.reconstruction.v1', reviewId: millenniumBridgeClaimReview.id,
      reviewer: '', reviewedAt: '', packageId: knowledgePackage.id, packageRevision: knowledgePackage.revision,
      assetId: asset.id, assetRevision: asset.revision,
      claimDecisions: millenniumBridgeClaimReview.claimReviews.map(({claimId, statementSha256}) => ({claimId, statementSha256, decision: 'approve', notes: ''})),
      approvedHookId: asset.hookId, assetDecision: 'approve', notes: '', explicitConfirmation: '',
    }),
  };
  files['artifact-manifest.json'] = json({
    kind: 'new-reconstruction-file-identities', algorithm: 'SHA-256',
    files: Object.entries(files).map(([path, text]) => ({path, sha256: sha256Bytes(text), bytes: Buffer.byteLength(text)})),
  });
  return files;
};

export const writeMillenniumBridgeReviewArtifacts = (directory: string) => {
  mkdirSync(directory, {recursive: true});
  for (const [filename, text] of Object.entries(millenniumBridgeReviewArtifacts())) writeFileSync(resolve(directory, filename), text, 'utf8');
};
export const validateMillenniumBridgeReviewArtifacts = (directory: string) => {
  for (const [filename, expected] of Object.entries(millenniumBridgeReviewArtifacts())) {
    if (readFileSync(resolve(directory, filename), 'utf8') !== expected) throw new Error(`Stale or modified reconstruction artifact: ${filename}`);
  }
  return millenniumBridgeClaimReview;
};
