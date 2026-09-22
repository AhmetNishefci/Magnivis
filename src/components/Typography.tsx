import type {CSSProperties, ReactNode} from 'react';
import {useCurrentFrame} from 'remotion';
import {palette, typography} from '../design/tokens';
import {easeOutQuint, progress} from '../utils/math';

type RevealTextProps = {
  children: ReactNode;
  at: number;
  style?: CSSProperties;
  eyebrow?: string;
  align?: 'left' | 'center';
};

export const RevealText = ({children, at, style, eyebrow, align = 'left'}: RevealTextProps) => {
  const frame = useCurrentFrame();
  const amount = easeOutQuint(progress(frame, at, at + 16));
  return (
    <div
      style={{
        color: palette.ink,
        fontFamily: typography.display,
        textAlign: align,
        opacity: amount,
        transform: `translateY(${(1 - amount) * 34}px)`,
        filter: `blur(${(1 - amount) * 7}px)`,
        ...style,
      }}
    >
      {eyebrow ? (
        <div
          style={{
            color: palette.blue,
            fontFamily: typography.body,
            fontSize: 21,
            fontWeight: 700,
            letterSpacing: '0.22em',
            marginBottom: 18,
          }}
        >
          {eyebrow}
        </div>
      ) : null}
      {children}
    </div>
  );
};

type MetricProps = {
  at: number;
  label: string;
  value: string;
  accent?: string;
};

export const Metric = ({at, label, value, accent = palette.blue}: MetricProps) => {
  const frame = useCurrentFrame();
  const amount = easeOutQuint(progress(frame, at, at + 14));
  return (
    <div
      style={{
        position: 'absolute',
        left: 84,
        bottom: 330,
        width: 760,
        opacity: amount,
        transform: `translateY(${(1 - amount) * 26}px)`,
      }}
    >
      <div style={{height: 2, width: 62, background: accent, marginBottom: 18}} />
      <div
        style={{
          fontFamily: typography.body,
          fontSize: 20,
          letterSpacing: '0.2em',
          fontWeight: 700,
          color: palette.muted,
          marginBottom: 7,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: typography.display,
          fontSize: 48,
          letterSpacing: '-0.035em',
          fontWeight: 600,
          color: palette.ink,
        }}
      >
        {value}
      </div>
    </div>
  );
};

