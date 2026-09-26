import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {shortSafeArea, typography} from '../design/tokens';

export type ShortCaptionCue = {
  start: number;
  end: number;
  lines: string[];
};

export const ShortOpenCaptions = ({cues}: {cues: ShortCaptionCue[]}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const time = frame / fps;
  const cue = cues.find(({start, end}) => time >= start && time < end);

  if (!cue) return null;

  const startFrame = cue.start * fps;
  const endFrame = cue.end * fps;
  const enter = interpolate(frame, [startFrame, startFrame + 4], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const exit = interpolate(frame, [endFrame - 4, endFrame], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const opacity = Math.min(enter, exit);

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: shortSafeArea.bottom + 32,
        zIndex: 30,
        display: 'flex',
        justifyContent: 'center',
        padding: '0 110px',
        pointerEvents: 'none',
        opacity,
        transform: `translateY(${(1 - enter) * 8}px)`,
      }}
    >
      <div
        style={{
          maxWidth: 860,
          padding: '11px 22px 13px',
          border: '1px solid rgba(230, 238, 255, 0.14)',
          borderRadius: 12,
          backgroundColor: 'rgba(2, 5, 13, 0.78)',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.38)',
          color: '#f7f9ff',
          fontFamily: typography.body,
          fontSize: 39,
          fontWeight: 700,
          lineHeight: 1.22,
          letterSpacing: '-0.015em',
          textAlign: 'center',
        }}
      >
        {cue.lines.map((line) => <div key={line} style={{whiteSpace: 'nowrap'}}>{line}</div>)}
      </div>
    </div>
  );
};
