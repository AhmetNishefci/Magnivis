import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {describe, expect, it} from 'vitest';
import {captionPlanToDerivedCaptions, captionsToWebVtt, splitCaptionPhrases} from '../src/captions/derive';
import {woodFrogCaptionPlan} from '../src/captions/plans/wood-frog';
import {reconstructCanonicalNarration} from '../src/captions/plan';
import {woodFrogApprovedContentAsset} from '../src/content-assets/assets/wood-frog-approved';
import {woodFrog, woodFrogTiktok} from '../src/content/videos/wood-frog';
import {safeAreaContains, safeAreaProfileIds, safeAreaProfileRegistry} from '../src/design/safe-areas';
import {woodFrogApprovedKnowledgePackage} from '../src/knowledge/packages/wood-frog-approved';
import {woodFrogFreezeClaimIds} from '../src/knowledge/packages/wood-frog-freeze-tolerance';
import {woodFrogPlatformVariants, woodFrogYoutubeReviewVariant} from '../src/platform-variants/variants/wood-frog';
import {
  validateWoodFrogProductionPlan,
  validateWoodFrogVideoSpec,
  woodFrogApprovalHashes,
} from '../src/production/integrity';
import {woodFrogProductionPlan} from '../src/production/plans/wood-frog';
import {validateProductionPlanReferences} from '../src/production/schema';

const sha256 = (path: string) => createHash('sha256')
  .update(readFileSync(path))
  .digest('hex');

describe('Wood Frog production source chain', () => {
  it('validates the approved VisualPlan to ProductionPlan bridge', () => {
    const plan = validateWoodFrogProductionPlan();
    expect(plan.beats.map(({sourceVisualPlanId}) => sourceVisualPlanId)).toEqual(
      woodFrogApprovedContentAsset.visualPlan.map(({id}) => id),
    );
    expect(plan.status).toBe('owner-visual-approved');
    expect(plan.visualApproval).toMatchObject({
      decision: 'approved',
      reviewedBy: 'Ahmet Nishefci',
      reviewedAt: '2026-09-29T10:44:24Z',
      artifact: {
        path: 'output/wood-frog-narrated.mp4',
        sha256: '4c5354d9368908f11f5f9b5767371694c2e51ad895786b2c31f7e329b83eaac2',
      },
      platformVariantApprovalGranted: false,
      publicationApprovalGranted: false,
    });
    expect(plan.safeAreaProfileId).toBe(safeAreaProfileIds.verticalShortMaster);
  });

  it('allows only selected, verified claim references', () => {
    const verified = new Set(woodFrogApprovedKnowledgePackage.claims
      .filter(({verificationStatus}) => verificationStatus === 'verified')
      .map(({id}) => id));
    const referenced = woodFrogProductionPlan.beats.flatMap((beat) => [
      ...beat.claimIds,
      ...beat.onScreenText.flatMap(({claimIds}) => claimIds),
    ]);
    expect(referenced.every((claimId) => verified.has(claimId))).toBe(true);
    expect(referenced).not.toContain(woodFrogFreezeClaimIds.circulationCessation);
    expect(woodFrogProductionPlan.excludedClaimIds).toContain(
      woodFrogFreezeClaimIds.circulationCessation,
    );
  });

  it('rejects stale editorial revisions and excluded claims', () => {
    const stalePlan = structuredClone(woodFrogProductionPlan);
    stalePlan.contentAsset.revision -= 1;
    expect(() => validateProductionPlanReferences(
      stalePlan,
      woodFrogApprovedKnowledgePackage,
      woodFrogApprovedContentAsset,
    )).toThrow(/stale/i);

    const unsafePlan = structuredClone(woodFrogProductionPlan);
    unsafePlan.beats[0]!.claimIds.push(woodFrogFreezeClaimIds.circulationCessation);
    expect(() => validateProductionPlanReferences(
      unsafePlan,
      woodFrogApprovedKnowledgePackage,
      woodFrogApprovedContentAsset,
    )).toThrow(/not selected and verified|explicitly excluded/i);

    const duplicateVisualPlan = structuredClone(woodFrogProductionPlan);
    duplicateVisualPlan.beats[1]!.sourceVisualPlanId = duplicateVisualPlan.beats[0]!.sourceVisualPlanId;
    expect(() => validateProductionPlanReferences(
      duplicateVisualPlan,
      woodFrogApprovedKnowledgePackage,
      woodFrogApprovedContentAsset,
    )).toThrow(/every approved VisualPlan item exactly once/i);
  });

  it('locks the VideoSpec to the approved revisions, hashes, and exact script', () => {
    expect(validateWoodFrogVideoSpec(woodFrog)).toEqual(woodFrog);
    expect(woodFrog.production).toMatchObject({
      knowledgePackageRevision: 2,
      contentAssetRevision: 2,
      approvedPackageSha256: woodFrogApprovalHashes.knowledgePackage,
      approvedContentAssetSha256: woodFrogApprovalHashes.contentAsset,
      ownerDecisionSha256: woodFrogApprovalHashes.ownerDecision,
      approvedScriptSha256: woodFrogApprovalHashes.script,
      captionPlanId: woodFrogCaptionPlan.id,
      captionPlanRevision: woodFrogCaptionPlan.revision,
      captionPlanSha256: woodFrogApprovalHashes.captionPlan,
      outputReviewState: 'owner-visual-approved',
    });
    expect(woodFrog.audio.narrationCues.map(({transcript}) => transcript)).toEqual(
      woodFrogApprovedContentAsset.script.segments.map(({text}) => text),
    );

    const staleVideo = structuredClone(woodFrog);
    if (!staleVideo.production) throw new Error('Expected Wood Frog production metadata');
    staleVideo.production.contentAssetRevision = 1;
    expect(() => validateWoodFrogVideoSpec(staleVideo)).toThrow(/stale or inconsistent/i);
  });

  it('keeps the TikTok derivative on the exact approved editorial and caption chain', () => {
    expect(validateWoodFrogVideoSpec(woodFrogTiktok)).toEqual(woodFrogTiktok);
    expect(woodFrogTiktok.production).toMatchObject({
      productionPlanRevision: woodFrogProductionPlan.revision,
      contentAssetRevision: woodFrogApprovedContentAsset.revision,
      captionPlanRevision: woodFrogCaptionPlan.revision,
      captionPlanSha256: woodFrogApprovalHashes.captionPlan,
      safeAreaProfileId: safeAreaProfileIds.tiktokFeed,
      outputReviewState: 'visual-review-required',
    });
    expect(woodFrogTiktok.audio).toEqual(woodFrog.audio);
    expect(woodFrogTiktok.scenes).toEqual(woodFrog.scenes);
  });

  it('matches every generated audio artifact to recorded SHA-256 provenance', () => {
    const provenance = woodFrog.audio.provenance;
    if (!provenance) throw new Error('Expected Wood Frog audio provenance');
    expect(sha256(`public/${woodFrog.audio.file}`)).toBe(provenance.soundscape.sha256);
    expect(provenance.narration.cueArtifacts).toHaveLength(woodFrog.audio.narrationCues.length);
    for (const cue of woodFrog.audio.narrationCues) {
      const artifact = provenance.narration.cueArtifacts.find(({id}) => id === cue.id);
      expect(artifact).toBeDefined();
      expect(sha256(`public/${cue.file}`)).toBe(artifact?.sha256);
    }
  });
});

describe('narration-derived captions', () => {
  it('preserves approved narration while producing speech-first timed phrases', () => {
    const captions = captionPlanToDerivedCaptions(woodFrogCaptionPlan);
    for (const narration of woodFrog.audio.narrationCues) {
      const planned = woodFrogCaptionPlan.cues.filter(
        ({sourceNarrationCueId}) => sourceNarrationCueId === narration.id,
      );
      expect(reconstructCanonicalNarration(planned))
        .toBe(narration.transcript);
    }
    expect(captions.every(({start, end, text}) => end > start && text.length <= 72)).toBe(true);
    expect(captions.at(-1)?.end).toBeLessThanOrEqual(woodFrog.format.durationSeconds);

    const expected = `${captionsToWebVtt(captions).trimEnd()}\n`;
    expect(readFileSync('captions/wood-frog.en.vtt', 'utf8')).toBe(expected);
  });

  it('does not leave a two-word orphan at the end of a cue', () => {
    expect(splitCaptionPhrases('It survived by controlling the freeze—not by staying unfrozen.').at(-1))
      .toBe('It survived by controlling the freeze—not by staying unfrozen.');
  });
});

describe('Wood Frog platform review boundary', () => {
  it('keeps the owner-approved master non-publishable pending platform review', () => {
    expect(woodFrogYoutubeReviewVariant.status).toBe('editorial-review');
    expect(woodFrogYoutubeReviewVariant.captions.designedBurnedIn).toBe(true);
    expect(woodFrogYoutubeReviewVariant.productionIntent.platformPreviewRequired).toBe(true);
    expect(woodFrog.production?.outputReviewState).toBe('owner-visual-approved');
    expect(woodFrogPlatformVariants.every(({previewStatus}) => (
      previewStatus === 'ready-for-private-preview'
    ))).toBe(true);
  });

  it('rejects visual approval without exact approval metadata', () => {
    const missingApproval = structuredClone(woodFrogProductionPlan);
    delete missingApproval.visualApproval;
    expect(() => validateProductionPlanReferences(
      missingApproval,
      woodFrogApprovedKnowledgePackage,
      woodFrogApprovedContentAsset,
    )).toThrow(/approval metadata/i);

    const staleCaptionApproval = structuredClone(woodFrogProductionPlan);
    staleCaptionApproval.visualApproval!.captionPlan.revision -= 1;
    expect(() => validateProductionPlanReferences(
      staleCaptionApproval,
      woodFrogApprovedKnowledgePackage,
      woodFrogApprovedContentAsset,
    )).toThrow(/exact CaptionPlan/i);
  });

  it('uses a reusable master safe area without claiming TikTok V2 compatibility', () => {
    const master = safeAreaProfileRegistry.get(safeAreaProfileIds.verticalShortMaster);
    for (const id of [
      safeAreaProfileIds.youtubeShorts,
      safeAreaProfileIds.instagramReels,
      safeAreaProfileIds.facebookReels,
    ]) {
      expect(safeAreaContains(safeAreaProfileRegistry.get(id), master)).toBe(true);
    }
    expect(safeAreaContains(
      safeAreaProfileRegistry.get(safeAreaProfileIds.tiktokFeed),
      master,
    )).toBe(false);
  });
});
