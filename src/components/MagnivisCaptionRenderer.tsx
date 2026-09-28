import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {captionRegionStyle, magnivisCaptionDesignSystem} from '../captions/design-system';
import type {CaptionCue, CaptionPlan} from '../captions/schema';
import {
  captionSegmentWhitespaceStyle,
  segmentStyledCaptionLine,
} from '../captions/styled-text';
import {palette, typography} from '../design/tokens';
import {easeOutQuint, progress} from '../utils/math';

const toneColors = {
  ice: '#a9e8fb',
  gold: palette.gold,
} as const;

export const MagnivisCaptionLine = ({
  line,
  cue,
  focus,
}: {
  line: string;
  cue: CaptionCue;
  focus: number;
}) => (
  <>
    {segmentStyledCaptionLine(line, cue.emphasis).map((segment, index) => {
      const emphasis = segment.emphasis;
      const strong = emphasis?.level === 'strong';
      return (
        <span
          key={`${cue.id}-${index}`}
          style={emphasis ? {
            ...captionSegmentWhitespaceStyle,
            color: toneColors[emphasis.tone],
            fontWeight: strong
              ? magnivisCaptionDesignSystem.typography.strongWeight
              : 750,
            fontSize: `${1 + focus * (strong ? 0.025 : 0.012)}em`,
            textShadow: `0 0 ${10 + focus * 10}px ${toneColors[emphasis.tone]}44`,
          } : captionSegmentWhitespaceStyle}
        >
          {segment.text}
        </span>
      );
    })}
  </>
);

export const MagnivisCaptionRenderer = ({
  plan,
  safeAreaProfileId = plan.safeAreaProfileId,
}: {
  plan: CaptionPlan;
  safeAreaProfileId?: string;
}) => {
  const frame = useCurrentFrame();
  const cue = plan.cues.find(({startFrame, endFrame}) => (
    frame >= startFrame && frame < endFrame
  ));
  if (!cue) return null;

  const entry = easeOutQuint(progress(
    frame,
    cue.startFrame,
    cue.startFrame + magnivisCaptionDesignSystem.entryFrames,
  ));
  const exit = 1 - progress(
    frame,
    cue.endFrame - magnivisCaptionDesignSystem.exitFrames,
    cue.endFrame,
  );
  const visibility = Math.min(entry, exit);
  const focus = easeOutQuint(progress(
    frame,
    cue.startFrame + Math.round((cue.endFrame - cue.startFrame) * 0.18),
    cue.startFrame + Math.round((cue.endFrame - cue.startFrame) * 0.5),
  ));
  const scale = cue.animation === 'soft-scale'
    ? 0.975 + entry * 0.025
    : cue.animation === 'focus-highlight'
      ? 0.99 + focus * 0.01
      : 1;
  const translateY = cue.animation === 'fade-slide' ? (1 - entry) * 12 : 0;

  return (
    <AbsoluteFill style={{pointerEvents: 'none', zIndex: 50}}>
      <div
        style={{
          ...captionRegionStyle(cue.placement, safeAreaProfileId),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: visibility,
          transform: `translateY(${translateY}px) scale(${scale})`,
        }}
      >
        <div
          style={{
            maxWidth: '100%',
            display: 'inline-flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2,
            padding: '16px 24px 17px',
            boxSizing: 'border-box',
            borderRadius: 20,
            border: '1px solid rgba(205, 231, 239, 0.16)',
            background: 'linear-gradient(150deg, rgba(2, 9, 14, 0.88), rgba(5, 18, 23, 0.75))',
            boxShadow: '0 18px 48px rgba(0,0,0,0.42), inset 0 1px 0 rgba(255,255,255,0.05)',
            backdropFilter: 'blur(10px)',
          }}
        >
          {cue.lines.map((line) => (
            <div
              key={line}
              style={{
                color: palette.ink,
                fontFamily: typography.body,
                fontSize: magnivisCaptionDesignSystem.typography.fontSize,
                fontWeight: magnivisCaptionDesignSystem.typography.fontWeight,
                lineHeight: magnivisCaptionDesignSystem.typography.lineHeight,
                letterSpacing: '-0.025em',
                textAlign: 'center',
                whiteSpace: 'nowrap',
                WebkitTextStroke: '0.35px rgba(1,5,8,0.72)',
                textShadow: '0 3px 12px rgba(0,0,0,0.95)',
              }}
            >
              <MagnivisCaptionLine line={line} cue={cue} focus={focus} />
            </div>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};
