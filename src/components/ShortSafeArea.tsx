import type {ReactNode} from 'react';
import {AbsoluteFill} from 'remotion';
import {shortSafeArea} from '../design/tokens';

export const ShortSafeArea = ({children}: {children: ReactNode}) => (
  <AbsoluteFill
    style={{
      paddingTop: shortSafeArea.top,
      paddingRight: shortSafeArea.right,
      paddingBottom: shortSafeArea.bottom,
      paddingLeft: shortSafeArea.left,
      boxSizing: 'border-box',
    }}
  >
    {children}
  </AbsoluteFill>
);

