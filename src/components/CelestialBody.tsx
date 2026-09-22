import type {CSSProperties} from 'react';
import {useCurrentFrame} from 'remotion';

export type CelestialKind = 'earth' | 'jupiter' | 'sun' | 'rigel' | 'betelgeuse';

type CelestialBodyProps = {
  kind: CelestialKind;
  diameter: number;
  centerX: number;
  centerY: number;
  opacity?: number;
  rotationSpeed?: number;
  emphasizeTiny?: boolean;
};

const bodyStyles: Record<CelestialKind, CSSProperties> = {
  earth: {
    background:
      'radial-gradient(ellipse at 64% 64%, rgba(36,78,45,0.94) 0 7%, transparent 8%), radial-gradient(ellipse at 38% 42%, #6b8e64 0 10%, transparent 11%), radial-gradient(ellipse at 52% 33%, #95a776 0 5%, transparent 6%), radial-gradient(circle at 31% 27%, rgba(220,241,255,0.94), transparent 10%), radial-gradient(circle at 35% 30%, #4c9ad4 0%, #1f5c9b 42%, #0b244c 72%, #030712 100%)',
  },
  jupiter: {
    background:
      'radial-gradient(ellipse at 68% 63%, #b54f32 0 5%, #d7865f 6% 8%, transparent 9%), repeating-linear-gradient(180deg, #dbc5a1 0 5%, #a96648 7% 10%, #e8d5b1 12% 18%, #805041 20% 23%, #c49a71 25% 31%, #f0ddbb 33% 38%, #8c5848 40% 44%, #d4aa7d 46% 53%)',
  },
  sun: {
    background:
      'radial-gradient(circle at 34% 28%, #fff8d4 0%, #ffe693 20%, #ffc247 48%, #f58422 77%, #b82e0d 100%)',
  },
  rigel: {
    background:
      'radial-gradient(circle at 36% 30%, #ffffff 0%, #e9f6ff 19%, #b9dcff 48%, #6399ec 76%, #183e8f 100%)',
  },
  betelgeuse: {
    background:
      'radial-gradient(circle at 67% 35%, rgba(255,205,119,0.7) 0 4%, transparent 16%), radial-gradient(circle at 28% 64%, rgba(134,21,10,0.62) 0 9%, transparent 25%), radial-gradient(circle at 42% 28%, #ffba5f 0%, #ef6e2d 34%, #ad281b 68%, #4f0d13 100%)',
  },
};

const glow: Record<CelestialKind, string> = {
  earth: '0 0 30px rgba(83,165,255,0.36), -18px 4px 70px rgba(28,93,180,0.24)',
  jupiter: '0 0 42px rgba(255,207,151,0.3)',
  sun: '0 0 42px rgba(255,211,91,0.85), 0 0 130px rgba(255,130,35,0.48), 0 0 260px rgba(255,95,21,0.22)',
  rigel: '0 0 44px rgba(201,232,255,0.95), 0 0 150px rgba(80,151,255,0.56), 0 0 280px rgba(53,96,224,0.22)',
  betelgeuse: '0 0 50px rgba(255,145,61,0.9), 0 0 180px rgba(232,68,31,0.44), 0 0 320px rgba(145,23,26,0.28)',
};

export const CelestialBody = ({
  kind,
  diameter,
  centerX,
  centerY,
  opacity = 1,
  rotationSpeed = 0,
  emphasizeTiny = false,
}: CelestialBodyProps) => {
  const frame = useCurrentFrame();
  const visibleDiameter = Math.max(diameter, emphasizeTiny ? 2.4 : 0);
  const rim = kind === 'earth' || kind === 'jupiter' ? 'inset -24px -10px 65px rgba(0,0,0,0.72)' : '';
  const rotation = frame * rotationSpeed;

  return (
    <div
      style={{
        position: 'absolute',
        left: centerX,
        top: centerY,
        width: visibleDiameter,
        height: visibleDiameter,
        opacity,
        borderRadius: '50%',
        transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
        ...bodyStyles[kind],
        boxShadow: `${rim}${rim ? ', ' : ''}${glow[kind]}`,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: '-3%',
          borderRadius: '50%',
          background:
            kind === 'jupiter'
              ? 'repeating-linear-gradient(178deg, transparent 0 7%, rgba(255,255,255,0.12) 8%, transparent 10% 17%)'
              : 'radial-gradient(circle at 29% 24%, rgba(255,255,255,0.28), transparent 25%), radial-gradient(circle at 74% 76%, rgba(0,0,0,0.38), transparent 52%)',
          mixBlendMode: kind === 'sun' || kind === 'rigel' ? 'screen' : 'soft-light',
        }}
      />
    </div>
  );
};

