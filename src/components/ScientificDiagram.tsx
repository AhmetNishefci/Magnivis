import type {CSSProperties, ReactNode} from 'react';
import {palette, typography} from '../design/tokens';

export const DiagramPanel = ({
  children,
  style,
}: {
  children: ReactNode;
  style?: CSSProperties;
}) => (
  <div style={{
    position: 'absolute',
    border: '1px solid rgba(155, 205, 232, 0.18)',
    borderRadius: 30,
    background: 'linear-gradient(145deg, rgba(13, 32, 41, 0.84), rgba(4, 13, 21, 0.7))',
    boxShadow: 'inset 0 1px rgba(255,255,255,0.05), 0 30px 90px rgba(0,0,0,0.26)',
    overflow: 'hidden',
    ...style,
  }}>
    {children}
  </div>
);
export const ScientificLabel = ({
  children,
  tone = 'blue',
  style,
}: {
  children: ReactNode;
  tone?: 'blue' | 'gold' | 'ice' | 'muted';
  style?: CSSProperties;
}) => {
  const color = tone === 'gold'
    ? palette.gold
    : tone === 'ice'
      ? '#bfeaff'
      : tone === 'muted'
        ? palette.muted
        : palette.blue;
  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      minHeight: 38,
      padding: '8px 13px 7px',
      border: `1px solid ${color}55`,
      borderRadius: 999,
      background: `${color}12`,
      color,
      fontFamily: typography.body,
      fontSize: 18,
      fontWeight: 700,
      letterSpacing: '0.12em',
      lineHeight: 1,
      textTransform: 'uppercase',
      ...style,
    }}>
      {children}
    </div>
  );
};

export const ProcessArrow = ({
  amount,
  color = '#8fd7f2',
  style,
}: {
  amount: number;
  color?: string;
  style?: CSSProperties;
}) => (
  <div style={{
    position: 'absolute',
    height: 3,
    transformOrigin: 'left center',
    transform: `scaleX(${Math.max(0, Math.min(1, amount))})`,
    background: `linear-gradient(90deg, ${color}22, ${color})`,
    borderRadius: 999,
    ...style,
  }}>
    <div style={{
      position: 'absolute',
      right: -2,
      top: -6,
      width: 14,
      height: 14,
      borderTop: `3px solid ${color}`,
      borderRight: `3px solid ${color}`,
      transform: 'rotate(45deg)',
    }} />
  </div>
);
