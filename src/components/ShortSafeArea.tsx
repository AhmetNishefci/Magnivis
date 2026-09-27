import type {ReactNode} from 'react';
import {AbsoluteFill} from 'remotion';
import {
  safeAreaProfileIds,
  safeAreaProfileRegistry,
} from '../design/safe-areas';

export const ShortSafeArea = ({
  children,
  profileId = safeAreaProfileIds.verticalShortMaster,
}: {
  children: ReactNode;
  profileId?: string;
}) => {
  const {insets} = safeAreaProfileRegistry.get(profileId);
  return (
    <AbsoluteFill
      style={{
        paddingTop: insets.top,
        paddingRight: insets.right,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        boxSizing: 'border-box',
      }}
    >
      {children}
    </AbsoluteFill>
  );
};
