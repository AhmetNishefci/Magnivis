import {existsSync, mkdirSync, readFileSync, writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {woodFrogFreezeDraftAsset} from '../../content-assets/assets/wood-frog-freeze';
import {
  woodFrogFreezeClaimIds,
  woodFrogFreezeHookIds,
  woodFrogFreezeKnowledgePackage,
  woodFrogFreezeSourceIds,
} from '../../knowledge/packages/wood-frog-freeze-tolerance';
import {
  claimReviewBundleSchema,
  validateClaimReviewBundle,
  type ClaimReviewBundle,
} from '../claim-review';
import {sha256Json, stableJson} from '../run-schema';

const claim = (claimId: string) => {
  const found = woodFrogFreezeKnowledgePackage.claims.find(({id}) => id === claimId);
  if (!found) throw new Error(`Missing Wood Frog claim: ${claimId}`);
  return found;
};

const reviewEntry = ({
  claimId,
  decision,
  priorStatement,
  recommendedVerificationStatus = 'verified' as const,
  rationale,
  limitations,
}: {
  claimId: string;
  decision: 'retain' | 'revise' | 'reject';
  priorStatement?: string;
  recommendedVerificationStatus?: 'unverified' | 'supported' | 'conflicting' | 'uncertain' | 'verified';
  rationale: string;
  limitations: string[];
}) => {
  const reviewedClaim = claim(claimId);
  return {
    claimId,
    statement: reviewedClaim.statement,
    statementSha256: sha256Json(reviewedClaim.statement),
    decision,
    ...(priorStatement ? {priorStatement} : {}),
    recommendedVerificationStatus,
    rationale,
    evidence: reviewedClaim.evidence.map(({sourceId, locator, notes}) => ({
      sourceId,
      locator: locator ?? 'Source record without a narrower locator',
      assessment: notes,
    })),
    limitations,
    useInRecommendedAsset: woodFrogFreezeDraftAsset.selectedClaimIds.includes(claimId),
    ownerDecisionRequired: true as const,
  };
};

export const woodFrogClaimReview: ClaimReviewBundle = claimReviewBundleSchema.parse({
  schemaVersion: 1,
  id: 'claim-review.wood-frog-freeze.v1',
  packageId: woodFrogFreezeKnowledgePackage.id,
  packageRevision: woodFrogFreezeKnowledgePackage.revision,
  assetId: woodFrogFreezeDraftAsset.id,
  assetRevision: woodFrogFreezeDraftAsset.revision,
  preparedBy: {kind: 'ai-assisted-research', name: 'Codex evidence audit'},
  preparedAt: '2026-09-27T21:00:00.000Z',
  status: 'ready-for-owner-decision',
  sourceInspections: [
    {
      sourceId: woodFrogFreezeSourceIds.alaskaTolerance,
      accessStatus: 'inspected',
      identityConfirmed: true,
      evidenceLocations: ['Summary', 'Materials and Methods — Freeze tolerance trials', 'Results — Freeze tolerance trials with winter frogs', 'Discussion — Freeze tolerance', 'Discussion — Dynamics of water and ice'],
      supportsClaimIds: [woodFrogFreezeClaimIds.freezeSurvival, woodFrogFreezeClaimIds.iceRedistribution, woodFrogFreezeClaimIds.alaskaTemperature, woodFrogFreezeClaimIds.alaskaEightWeeks, woodFrogFreezeClaimIds.alaskaTwelveWeeks],
      limitations: ['The endurance frogs had already undergone severe freeze trials.', 'The summary phrase “endured a 2-month bout” omits that only two of four met the formal survival criterion.'],
    },
    {
      sourceId: woodFrogFreezeSourceIds.subarcticCryoprotectants,
      accessStatus: 'inspected',
      identityConfirmed: true,
      evidenceLocations: ['Abstract', 'Introduction', 'Results — Responses to Freezing, Figs 1–4', 'Discussion — Organ Dehydration', 'Discussion — Glycemic Response', 'Discussion — Ureic Response', '2015 correction to Table 5 footnotes'],
      supportsClaimIds: [woodFrogFreezeClaimIds.glucoseCryoprotectant, woodFrogFreezeClaimIds.ureaAndGlucose, woodFrogFreezeClaimIds.iceRedistribution, woodFrogFreezeClaimIds.circulationCessation],
      limitations: ['The paper states circulation cessation as established physiology but does not directly measure blood flow in this experiment.', 'The corrected Table 5 footnotes concern computed concentrations; the correction does not reverse the qualitative claims used here.'],
    },
    {
      sourceId: woodFrogFreezeSourceIds.glucoseLoading,
      accessStatus: 'abstract-only',
      identityConfirmed: true,
      evidenceLocations: ['PubMed abstract'],
      supportsClaimIds: [woodFrogFreezeClaimIds.glucoseCryoprotectant],
      limitations: ['Only the abstract was inspected.', 'Exogenous glucose loading is evidence for protective effect, not by itself for endogenous liver mobilization.'],
    },
    {
      sourceId: woodFrogFreezeSourceIds.glucoseTolerance,
      accessStatus: 'abstract-only',
      identityConfirmed: true,
      evidenceLocations: ['Publisher abstract'],
      supportsClaimIds: [woodFrogFreezeClaimIds.glucoseCryoprotectant],
      limitations: ['Full text was paywalled in the inspected publisher view.', 'The experiment used exogenous loading and southern Ohio frogs.'],
    },
    {
      sourceId: woodFrogFreezeSourceIds.ureaCryoprotection,
      accessStatus: 'abstract-only',
      identityConfirmed: true,
      evidenceLocations: ['PubMed abstract'],
      supportsClaimIds: [woodFrogFreezeClaimIds.ureaAndGlucose],
      limitations: ['Protective efficacy was tested principally in frozen/thawed erythrocytes and intact tissues in vitro.', 'Urea concentration and contribution vary with hydration, tissue and season.'],
    },
    {
      sourceId: woodFrogFreezeSourceIds.cardiacFreezing,
      accessStatus: 'inspected',
      identityConfirmed: true,
      evidenceLocations: ['Abstract', 'Methods, p. R1046', 'Results, pp. R1047–R1048, Figs 1–2'],
      supportsClaimIds: [woodFrogFreezeClaimIds.cardiacArrest, woodFrogFreezeClaimIds.thawRecovery],
      limitations: ['The post-thaw heartbeat resumption time was recorded in one frog.', 'The laboratory freezes were mild, controlled and nonlethal; cardiac arrest must not be equated with death.'],
    },
    {
      sourceId: woodFrogFreezeSourceIds.thawRecovery,
      accessStatus: 'abstract-only',
      identityConfirmed: true,
      evidenceLocations: ['PubMed abstract'],
      supportsClaimIds: [woodFrogFreezeClaimIds.thawRecovery],
      limitations: ['The abstract does not report the total sample size.', 'Not every frog resumed spontaneous breathing or hindleg reflexes within the 3–4 hour observation window.'],
    },
    {
      sourceId: woodFrogFreezeSourceIds.ventilation,
      accessStatus: 'partially-inspected',
      identityConfirmed: true,
      evidenceLocations: ['PubMed identity and abstract', 'Publisher PDF — Results, Fig. 1 and Table 1'],
      supportsClaimIds: [woodFrogFreezeClaimIds.ventilationCessation],
      limitations: ['Visible pulmonary ventilation is distinct from cutaneous gas exchange and whole-organism CO2 output.', 'The result describes experimental freeze–thaw events, not a universal time to breathing cessation.'],
    },
    {
      sourceId: woodFrogFreezeSourceIds.freezePhysiologyReview,
      accessStatus: 'partially-inspected',
      identityConfirmed: true,
      evidenceLocations: ['Review section on freeze-tolerant frogs and extracellular ice', 'Review section on physiological arrest during freezing'],
      supportsClaimIds: [woodFrogFreezeClaimIds.freezeSurvival, woodFrogFreezeClaimIds.circulationCessation],
      limitations: ['This is a peer-reviewed synthesis, not direct primary measurement for every statement.', 'Its broad range applies across the reviewed freeze-tolerant frog literature.'],
    },
    {
      sourceId: woodFrogFreezeSourceIds.denaliOverview,
      accessStatus: 'inspected',
      identityConfirmed: true,
      evidenceLocations: ['Wood frog winter-adaptation paragraphs', 'Page metadata, last updated May 5, 2022'],
      supportsClaimIds: [],
      limitations: ['The public summary uses “freeze solid” and a simplified glucose/freezing-point explanation.', 'It reports −12°C, whereas the primary 2013 laboratory study documents a more specific −16°C trial.', 'It is retained for public-context provenance but not used as primary support for the reviewed script.'],
    },
  ],
  claimReviews: [
    reviewEntry({
      claimId: woodFrogFreezeClaimIds.freezeSurvival,
      decision: 'revise',
      priorStatement: 'Wood frogs can survive substantial freezing of their body tissues and water during overwintering.',
      rationale: 'The revised wording states the approximate amount and, crucially, that survivable ice is extracellular rather than uniform inside cells.',
      limitations: ['The two-thirds figure is approximate and represents an upper range, not every freeze.'],
    }),
    reviewEntry({
      claimId: woodFrogFreezeClaimIds.cardiacArrest,
      decision: 'revise',
      priorStatement: 'During frozen dormancy, a wood frog can stop breathing and its heart can stop beating, with activity resuming after thawing.',
      rationale: 'A primary ECG study directly supports cessation of cardiac activity near completion of ice formation; the original combined statement improperly bundled heart, breathing and recovery.',
      limitations: ['Do not describe cardiac arrest as death.'],
    }),
    reviewEntry({
      claimId: woodFrogFreezeClaimIds.ventilationCessation,
      decision: 'revise',
      priorStatement: 'During frozen dormancy, a wood frog can stop breathing and its heart can stop beating, with activity resuming after thawing.',
      rationale: 'Primary respirometry observations separately support cessation of visible pulmonary ventilation during freezing.',
      limitations: ['Pulmonary ventilation is not identical to every form of gas exchange or metabolism.'],
    }),
    reviewEntry({
      claimId: woodFrogFreezeClaimIds.thawRecovery,
      decision: 'revise',
      priorStatement: 'During frozen dormancy, a wood frog can stop breathing and its heart can stop beating, with activity resuming after thawing.',
      rationale: 'The thaw study supports an ordered recovery: cardiac function first, followed by spontaneous breathing and hindleg reflexes.',
      limitations: ['Not all later responses returned within the 3–4 hour observation window; no universal exact time should be stated.'],
    }),
    reviewEntry({
      claimId: woodFrogFreezeClaimIds.circulationCessation,
      decision: 'reject',
      recommendedVerificationStatus: 'uncertain',
      rationale: 'Reviewed papers state that circulation ceases, but this audit did not locate a primary experiment directly measuring blood flow to zero. The main asset does not need this claim.',
      limitations: ['Physiological inference and review-level statements are not the same as direct measurement.'],
    }),
    reviewEntry({
      claimId: woodFrogFreezeClaimIds.glucoseCryoprotectant,
      decision: 'revise',
      priorStatement: 'Freezing triggers rapid mobilization of glucose from liver glycogen, and that glucose acts as a cryoprotectant that reduces tissue injury.',
      rationale: 'Primary studies separately support endogenous liver glycogenolysis and glucose’s reduction of body ice and cellular injury.',
      limitations: ['Glucose must not be presented as the only protective mechanism.'],
    }),
    reviewEntry({
      claimId: woodFrogFreezeClaimIds.ureaAndGlucose,
      decision: 'revise',
      priorStatement: 'Urea and glucose both contribute to wood-frog cryoprotection by limiting ice formation and helping preserve cellular structures.',
      rationale: 'The revision preserves their different timing and distribution: urea rises during winter conditioning, while glucose is mobilized rapidly after freezing begins.',
      limitations: ['Urea’s contribution varies across tissues and is not a second synchronized liver surge.'],
    }),
    reviewEntry({
      claimId: woodFrogFreezeClaimIds.iceRedistribution,
      decision: 'revise',
      priorStatement: 'Water redistribution and sequestration of ice in body compartments help limit damaging ice formation within organs and cells.',
      rationale: 'The revised wording names extracellular ice, cellular/organ dehydration and the coelomic, subdermal and lymphatic spaces described by the studies.',
      limitations: ['The diagram must not show ordinary survivable intracellular ice.'],
    }),
    reviewEntry({
      claimId: woodFrogFreezeClaimIds.alaskaTemperature,
      decision: 'revise',
      priorStatement: 'In one laboratory study, Interior Alaskan wood frogs survived experimental freezing to temperatures as low as −16°C.',
      rationale: 'The revision records the actual sample, slow-cooling protocol, six-hour target hold and righting-response criterion.',
      limitations: ['N=4, prior −8°C exposure, one population and one staged laboratory protocol.'],
    }),
    reviewEntry({
      claimId: woodFrogFreezeClaimIds.alaskaEightWeeks,
      decision: 'revise',
      priorStatement: 'In the same laboratory study, Interior Alaskan wood frogs endured a two-month freezing bout at −4°C.',
      rationale: 'The original wording hid the denominator and outcome. Only two of four met the survival criterion after eight weeks.',
      limitations: ['All four had experienced prior severe freeze trials, which the authors identify as a possible stressor.'],
    }),
    reviewEntry({
      claimId: woodFrogFreezeClaimIds.alaskaTwelveWeeks,
      decision: 'revise',
      priorStatement: 'In the same laboratory study, Interior Alaskan wood frogs endured a two-month freezing bout at −4°C.',
      rationale: 'The twelve-week outcome is necessary context for the endurance boundary: none of four survived by the study criterion.',
      limitations: ['Do not generalize this staged laboratory result to wild Alaskan overwintering.'],
    }),
  ],
  recommendedHookId: woodFrogFreezeHookIds.stoppedHeart,
  unresolvedResearch: [
    'Direct primary blood-flow measurement was not located; circulation cessation remains excluded from the asset.',
    'Full text was not accessible for every older paper; abstract-only sources are labeled as such.',
    'Final frog imagery/model provenance must be recorded during production; source figures are evidence, not production assets.',
  ],
});

const sourceName = (sourceId: string) => woodFrogFreezeKnowledgePackage.sources
  .find(({id}) => id === sourceId)?.title ?? sourceId;

export const createWoodFrogOwnerReviewReport = () => {
  const sourceSections = woodFrogClaimReview.sourceInspections.map((inspection) => {
    const source = woodFrogFreezeKnowledgePackage.sources.find(({id}) => id === inspection.sourceId);
    if (!source) throw new Error(`Missing source for inspection: ${inspection.sourceId}`);
    return `## ${source.id}\n\n- **Title:** ${source.title}\n- **Authors:** ${source.authors?.join('; ') ?? 'Institutional page; no named author recorded'}\n- **Publisher / institution:** ${source.organization}\n- **Published:** ${source.published ?? source.publicationLabel ?? 'No publication date recorded'}\n- **Identifiers:** ${source.identifiers?.map(({scheme, value}) => `${scheme}: ${value}`).join('; ') ?? 'None recorded'}\n- **URL:** ${source.url}\n- **Access status:** ${inspection.accessStatus}\n- **Identity confirmed:** ${inspection.identityConfirmed ? 'yes' : 'no'}\n- **Evidence locations inspected:** ${inspection.evidenceLocations.join('; ') || 'none'}\n- **Claims supported:** ${inspection.supportsClaimIds.join(', ') || 'none in the final evidence map'}\n- **Limitations:** ${inspection.limitations.join('; ') || 'none recorded'}\n`;
  }).join('\n');
  const claimSections = woodFrogClaimReview.claimReviews.map((entry) => {
    const evidence = entry.evidence.map(({sourceId, locator, assessment}) =>
      `- **${sourceName(sourceId)}** — ${locator}\n  ${assessment}`).join('\n');
    const finalWording = entry.decision === 'reject'
      ? 'REMOVE FROM THIS ASSET. Do not restore without directly reviewed primary evidence.'
      : entry.statement;
    return `## ${entry.claimId}\n\n**CLAIM**\n\n${entry.statement}\n\n**STATUS**\n\n${entry.decision.toUpperCase()} · current package state: ${claim(entry.claimId).verificationStatus.toUpperCase()} · recommended after owner review: ${entry.recommendedVerificationStatus.toUpperCase()}\n\n**WHY**\n\n${entry.rationale}\n\n**SOURCE(S) / EVIDENCE LOCATION / IMPORTANT EVIDENCE**\n\n${evidence}\n\n**LIMITATIONS / CAVEATS**\n\n${entry.limitations.map((value) => `- ${value}`).join('\n')}\n\n**RECOMMENDED FINAL WORDING**\n\n${finalWording}\n\n**OWNER DECISION REQUIRED:** YES\n`;
  }).join('\n');
  const safeClaims = woodFrogClaimReview.claimReviews
    .filter(({recommendedVerificationStatus}) => recommendedVerificationStatus === 'verified')
    .map(({claimId}) => `- ${claimId}`)
    .join('\n');
  const revisedClaims = woodFrogClaimReview.claimReviews
    .filter(({decision}) => decision === 'revise')
    .map(({claimId}) => `- ${claimId}`)
    .join('\n');
  const removeClaims = woodFrogClaimReview.claimReviews
    .filter(({decision}) => decision === 'reject')
    .map(({claimId}) => `- ${claimId}`)
    .join('\n');
  const script = woodFrogFreezeDraftAsset.script.segments.map(({text}) => text).join('\n\n');
  const visuals = woodFrogFreezeDraftAsset.visualPlan.map((visual) =>
    `- **${visual.timingIntentSeconds?.start ?? '?'}–${visual.timingIntentSeconds?.end ?? '?'}s:** ${visual.objective}\n  Provenance/asset requirement: ${(visual.assetRequirements ?? []).join('; ')}\n  Scientific guardrail: ${visual.notes ?? 'Use only the linked claims.'}`).join('\n');
  return `# Wood Frog Human Claim Review V1\n\n**Status:** READY FOR OWNER EDITORIAL APPROVAL — not production-ready\n\n**Package:** ${woodFrogFreezeKnowledgePackage.id} revision ${woodFrogFreezeKnowledgePackage.revision}\n\n**Asset:** ${woodFrogFreezeDraftAsset.id} revision ${woodFrogFreezeDraftAsset.revision}\n\nPrepared by an AI-assisted evidence audit. This preparation is not human verification. Every promotion decision below remains the owner/editor’s responsibility.\n\n# Source inspection record\n\n${sourceSections}\n# Claim-by-claim review\n\n${claimSections}\n# Claims safe to use after owner verification\n\n${safeClaims}\n\n# Claims requiring revision\n\n${revisedClaims}\n\n# Claims to remove from this asset\n\n${removeClaims || '- None'}\n\n# Unresolved research\n\n${woodFrogClaimReview.unresolvedResearch.map((value) => `- ${value}`).join('\n')}\n\n# Hook review\n\n${woodFrogFreezeKnowledgePackage.hooks.map((hook) => `- **${hook.id === woodFrogClaimReview.recommendedHookId ? 'RECOMMENDED · ' : ''}${hook.archetype}:** ${hook.text}\n  Claims: ${hook.claimIds.join(', ')}`).join('\n')}\n\nThe recommended hook is defensible because the 1989 ECG study directly measured cardiac arrest during a nonlethal freeze and the 1991 thaw study supports functional recovery. “Survive” is used instead of death/resurrection language. It still requires explicit owner approval.\n\n# Evidence-grounded script\n\n${script}\n\n# Narrative structure\n\n${woodFrogFreezeDraftAsset.narrativeStructure.map((beat) => `- **${beat.label}:** ${beat.purpose}`).join('\n')}\n\n# Visual plan and scientific guardrails\n\n${visuals}\n\n# Rights / provenance strategy\n\n- Prefer original procedural/vector frog, tissue, cell, cardiac-trace and molecule animation.\n- Scientific figures are evidence references, not production assets to copy.\n- If a public-domain government image is used, record the exact asset URL, creator/agency, rights statement and retrieval date.\n- If a reusable licensed asset is used, preserve license text, author, source URL and any attribution requirements before production.\n- Generated visuals may be used only as illustrative material; anatomy and freeze mechanism must be checked against the approved VisualPlan.\n- No random web imagery and no paid asset acquisition in this phase.\n\n# Owner approval gate\n\nBefore promotion, the owner must explicitly decide every claim, choose the hook, approve this script/narrative/VisualPlan, and provide reviewer identity plus timestamp through the approval command. Until then the package remains in review, every usable claim remains SUPPORTED rather than VERIFIED, and the asset remains DRAFT.\n`;
};

export const createWoodFrogOwnerDecisionTemplate = () => ({
  schemaVersion: 1,
  id: 'owner-decision.wood-frog-freeze.v1',
  reviewId: woodFrogClaimReview.id,
  reviewer: '',
  reviewedAt: '',
  packageId: woodFrogFreezeKnowledgePackage.id,
  packageRevision: woodFrogFreezeKnowledgePackage.revision,
  assetId: woodFrogFreezeDraftAsset.id,
  assetRevision: woodFrogFreezeDraftAsset.revision,
  claimDecisions: woodFrogClaimReview.claimReviews.map((entry) => ({
    claimId: entry.claimId,
    statementSha256: entry.statementSha256,
    decision: entry.recommendedVerificationStatus === 'verified' ? 'approve' : 'reject',
    notes: '',
  })),
  approvedHookId: woodFrogClaimReview.recommendedHookId,
  assetDecision: 'approve',
  notes: '',
  explicitConfirmation: 'I reviewed the evidence and approve these editorial decisions.',
  templateInstructions: 'This template is intentionally invalid until the human owner supplies reviewer, reviewedAt, every decision note, and final decisions after reviewing owner-review.md. Remove templateInstructions before submitting it to the approval command.',
});

export const writeWoodFrogClaimReviewArtifacts = (directory: string) => {
  const validated = validateClaimReviewBundle(
    woodFrogClaimReview,
    woodFrogFreezeKnowledgePackage,
    woodFrogFreezeDraftAsset,
  );
  mkdirSync(directory, {recursive: true});
  writeFileSync(resolve(directory, 'claim-review.json'), `${stableJson(validated, 2)}\n`, 'utf8');
  writeFileSync(resolve(directory, 'owner-review.md'), createWoodFrogOwnerReviewReport(), 'utf8');
  writeFileSync(resolve(directory, 'owner-decision.template.json'), `${stableJson(createWoodFrogOwnerDecisionTemplate(), 2)}\n`, 'utf8');
  return validated;
};

export const validateWoodFrogClaimReviewArtifacts = (directory: string) => {
  const reviewPath = resolve(directory, 'claim-review.json');
  const reportPath = resolve(directory, 'owner-review.md');
  const templatePath = resolve(directory, 'owner-decision.template.json');
  if (!existsSync(reviewPath)) throw new Error(`Missing claim review: ${reviewPath}`);
  if (!existsSync(reportPath)) throw new Error(`Missing owner review report: ${reportPath}`);
  if (!existsSync(templatePath)) throw new Error(`Missing owner decision template: ${templatePath}`);
  const review = validateClaimReviewBundle(
    JSON.parse(readFileSync(reviewPath, 'utf8')),
    woodFrogFreezeKnowledgePackage,
    woodFrogFreezeDraftAsset,
  );
  const report = readFileSync(reportPath, 'utf8');
  if (!report.includes('READY FOR OWNER EDITORIAL APPROVAL')) {
    throw new Error('Owner review report does not preserve the approval boundary');
  }
  return review;
};
