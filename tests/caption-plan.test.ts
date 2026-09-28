import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {describe, expect, it} from 'vitest';
import {assertCaptionRegionIsSafe, magnivisCaptionDesignSystem} from '../src/captions/design-system';
import {captionPlanToDerivedCaptions} from '../src/captions/derive';
import {woodFrogCaptionPlan} from '../src/captions/plans/wood-frog';
import {validateCaptionPlanAgainstNarration} from '../src/captions/plan';
import {captionPlanSchema} from '../src/captions/schema';
import {
  captionSegmentWhitespaceStyle,
  segmentStyledCaptionLine,
} from '../src/captions/styled-text';
import {MagnivisCaptionLine} from '../src/components/MagnivisCaptionRenderer';
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

  it.each([
    ['normal-emphasis-normal', 'I am Ahmet Nishefci', ['Ahmet']],
    ['emphasis-at-start', 'Glucose protects cells', ['Glucose']],
    ['emphasis-at-end', 'the heart stops', ['stops']],
    ['multiple-emphasis', 'glucose and urea protect cells', ['glucose', 'urea']],
    ['punctuation-after-emphasis', 'glucose, while urea...', ['glucose', 'urea']],
    ['phrase-emphasis', 'a freeze stops its heartbeat', ['stops its heartbeat']],
    ['multiple-styled-boundaries', 'glucose and urea protect cells', ['glucose', 'and', 'urea']],
    ['whole-caption-emphasis', 'Glucose', ['Glucose']],
    ['adjacent-emphasis-without-source-space', 'glucose/urea', ['glucose', '/urea']],
  ])('preserves exact source text and whitespace for %s', (_name, source, emphasized) => {
    const emphasis = emphasized.map((text) => ({
      text,
      level: 'strong' as const,
      tone: 'gold' as const,
    }));
    const segments = segmentStyledCaptionLine(source, emphasis);
    expect(segments.map(({text}) => text).join('')).toBe(source);
    expect(segments.every(({text}) => text.length > 0)).toBe(true);
  });

  it('renders every styled and unstyled segment with source-preserving CSS whitespace', () => {
    const cue = captionPlanSchema.parse(woodFrogCaptionPlan).cues.find(
      ({id}) => id.endsWith('payoff-2'),
    );
    expect(cue).toBeDefined();
    const line = 'its heart starts beating first;';
    const segments = segmentStyledCaptionLine(line, cue!.emphasis);
    expect(segments).toEqual([
      {text: 'its '},
      {text: 'heart starts beating first', emphasis: cue!.emphasis[0]},
      {text: ';'},
    ]);
    expect(captionSegmentWhitespaceStyle.whiteSpace).toBe('pre');

    const markup = renderToStaticMarkup(createElement(MagnivisCaptionLine, {
      line,
      cue: cue!,
      focus: 1,
    }));
    expect(markup.match(/white-space:pre/g)).toHaveLength(3);
    expect(markup).toContain('its </span>');
    expect(markup).toContain('first</span><span style="white-space:pre">;</span>');
    expect(markup).toContain('font-size:1.025em');
    expect(markup).not.toContain('transform:scale');
  });

  it('preserves styled boundaries independently on wrapped caption lines', () => {
    const cue = woodFrogCaptionPlan.cues.find(({id}) => id.endsWith('chemistry-2'))!;
    const reconstructed = cue.lines.map((line) => (
      segmentStyledCaptionLine(line, cue.emphasis).map(({text}) => text).join('')
    ));
    expect(reconstructed).toEqual(cue.lines);
    expect(reconstructed.join(' ')).toBe('while urea has already built up before freezing.');
  });

  it('preserves every real Wood Frog caption line across all emphasis boundaries', () => {
    const lines = woodFrogCaptionPlan.cues.flatMap((cue) => cue.lines.map((line) => ({cue, line})));
    expect(lines).toHaveLength(25);
    for (const {cue, line} of lines) {
      const segments = segmentStyledCaptionLine(line, cue.emphasis);
      expect(segments.map(({text}) => text).join('')).toBe(line);
      expect(renderToStaticMarkup(createElement(MagnivisCaptionLine, {
        line,
        cue,
        focus: 1,
      }))).not.toContain('white-space:normal');
    }
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
