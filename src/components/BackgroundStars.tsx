import {useMemo} from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';

const seeded = (index: number, salt: number) => {
  const value = Math.sin(index * 9283.17 + salt * 77.13) * 43758.5453;
  return value - Math.floor(value);
};

type Star = {x: number; y: number; radius: number; opacity: number; phase: number};

export const BackgroundStars = () => {
  const frame = useCurrentFrame();
  const stars = useMemo<Star[]>(
    () =>
      Array.from({length: 150}, (_, index) => ({
        x: seeded(index, 1) * 1080,
        y: seeded(index, 2) * 2160 - 120,
        radius: 0.45 + seeded(index, 3) * 1.8,
        opacity: 0.18 + seeded(index, 4) * 0.64,
        phase: seeded(index, 5) * Math.PI * 2,
      })),
    [],
  );
  const drift = (frame * 0.22) % 120;

  return (
    <AbsoluteFill
      style={{
        background:
          'radial-gradient(circle at 25% 22%, rgba(38,67,116,0.16), transparent 34%), radial-gradient(circle at 78% 62%, rgba(84,32,66,0.09), transparent 38%), linear-gradient(180deg, #050916 0%, #02030a 60%, #010208 100%)',
      }}
    >
      <svg width="1080" height="1920" viewBox="0 0 1080 1920" aria-hidden="true">
        {stars.map((star, index) => {
          const y = ((star.y + drift + 120) % 2160) - 120;
          const twinkle = 0.82 + Math.sin(frame / 19 + star.phase) * 0.18;
          return (
            <circle
              key={`${Math.round(star.x)}-${index}`}
              cx={star.x}
              cy={y}
              r={star.radius}
              fill="#d9e8ff"
              opacity={star.opacity * twinkle}
            />
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};

