import {describe, expect, it} from 'vitest';
import {assertCaptionRegionIsSafe, magnivisCaptionDesignSystem} from '../src/captions/design-system';
import {captionPlanToDerivedCaptions} from '../src/captions/derive';
import {woodFrogCaptionPlan} from '../src/captions/plans/wood-frog';
import {validateCaptionPlanAgainstNarration} from '../src/captions/plan';
import {captionPlanSchema} from '../src/captions/schema';
import {woodFrog} from '../src/content/videos/wood-frog';
import {safeAreaProfileIds} from '../src/design/safe-areas';
import {woodFrogApprovalHashes} from '../src/production/integrity';

describe('Magnivis CaptionPlan V1', () => {
  it('preserves every approved narration cue with complete, non-overlapping timing', () => {
    expect(validateCaptionPlanAgainstNarration(
      woodFrogCaptionPlan,
      woodFrog.audio.narrationCues,
      safeAreaProfileIds.verticalShortMaster,
    )).toEqual(woodFrogCaptionPlan);
    expect(woodFrogCaptionPlan.cues).toHaveLength(17);
    expect(woodFrogCaptionPlan.cues.every((cue, index) => (
      index === 0 || cue.startFrame >= woodFrogCaptionPlan.cues[index - 1]!.endFrame
    ))).toBe(true);
  });

  it('rejects invented caption wording and timing outside narration', () => {
    const invented = structuredClone(woodFrogCaptionPlan);
    invented.cues[0]!.lines[0] = 'A wood frog may survive';
    expect(() => validateCaptionPlanAgainstNarration(
      invented,
      woodFrog.audio.narrationCues,
      safeAreaProfileIds.verticalShortMaster,
    )).toThrow(/preserve approved narration/i);

    const mistimed = structuredClone(woodFrogCaptionPlan);
    mistimed.cues[0]!.startFrame += 2;
    expect(() => validateCaptionPlanAgainstNarration(
      mistimed,
      woodFrog.audio.narrationCues,
      safeAreaProfileIds.verticalShortMaster,
    )).toThrow(/timing does not fully cover/i);
  });

  it('rejects unsupported animation, placement, and emphasis text', () => {
    const animation = structuredClone(woodFrogCaptionPlan) as unknown as Record<string, unknown>;
    (animation.cues as Array<Record<string, unknown>>)[0]!.animation = 'word-bounce';
    expect(() => captionPlanSchema.parse(animation)).toThrow();

    const placement = structuredClone(woodFrogCaptionPlan) as unknown as Record<string, unknown>;
    (placement.cues as Array<Record<string, unknown>>)[0]!.placement = 'absolute-bottom';
    expect(() => captionPlanSchema.parse(placement)).toThrow();

    const emphasis = structuredClone(woodFrogCaptionPlan);
    emphasis.cues[0]!.emphasis[0]!.text = 'invented emphasis';
    expect(() => captionPlanSchema.parse(emphasis)).toThrow(/must occur exactly/i);
  });

  it('keeps both approved caption regions safe across all four short-form surfaces', () => {
    for (const profileId of [
      safeAreaProfileIds.youtubeShorts,
      safeAreaProfileIds.tiktokFeed,
      safeAreaProfileIds.instagramReels,
      safeAreaProfileIds.facebookReels,
    ]) {
      for (const placement of ['middle-lower', 'lower-safe'] as const) {
        expect(assertCaptionRegionIsSafe(placement, profileId)).toEqual(
          magnivisCaptionDesignSystem.regions[placement],
        );
      }
    }
  });

  it('keeps deterministic render and WebVTT inputs in one plan', () => {
    expect(woodFrogApprovalHashes.captionPlan).toBe(
      woodFrog.production?.captionPlanSha256,
    );
    expect(captionPlanToDerivedCaptions(woodFrogCaptionPlan).map(({text}) => text))
      .toEqual(woodFrogCaptionPlan.cues.map(({lines}) => lines.join(' ')));
    expect(woodFrogCaptionPlan.designSystem).toEqual({
      id: magnivisCaptionDesignSystem.id,
      revision: magnivisCaptionDesignSystem.revision,
    });
  });
});
