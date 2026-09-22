import type {CSSProperties, ReactNode} from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {sceneOpacity} from '../utils/math';

type SceneWindowProps = {
  start: number;
  end: number;
  fadeIn?: number;
  fadeOut?: number;
  children: ReactNode;
  style?: CSSProperties;
};

export const SceneWindow = ({
  start,
  end,
  fadeIn,
  fadeOut,
  children,
  style,
}: SceneWindowProps) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{
        ...style,
        opacity: sceneOpacity(frame, start, end, fadeIn, fadeOut),
      }}
    >
      {children}
    </AbsoluteFill>
  );
};
