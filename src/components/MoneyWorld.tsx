import type {CSSProperties} from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {moneyScale} from '../data/money';
import {typography} from '../design/tokens';
import {easeOutQuint, mix} from '../utils/math';

const money = {
  ink: '#f3f0df',
  mint: '#9cb98c',
  deep: '#17271d',
  gold: '#d9b66f',
  line: 'rgba(226, 224, 183, 0.25)',
} as const;

const seeded = (index: number, salt: number) => {
  const value = Math.sin(index * 73.17 + salt * 19.91) * 43758.5453;
  return value - Math.floor(value);
};

export const MoneyAtmosphere = ({intensity = 1}: {intensity?: number}) => {
  const frame = useCurrentFrame();
  const dust = Array.from({length: 30}, (_, index) => {
    const left = seeded(index, 2) * 1080;
    const top = (seeded(index, 3) * 2050 + frame * (0.18 + seeded(index, 4) * 0.35)) % 2050 - 65;
    const size = 1.5 + seeded(index, 5) * 4;
    return (
      <div
        key={index}
        style={{
          position: 'absolute',
          left,
          top,
          width: size,
          height: size,
          borderRadius: '50%',
          background: `rgba(222, 207, 143, ${0.08 + seeded(index, 6) * 0.16})`,
          filter: size > 4 ? 'blur(1px)' : undefined,
        }}
      />
    );
  });

  return (
    <AbsoluteFill
      style={{
        overflow: 'hidden',
        background:
          'radial-gradient(circle at 52% 28%, #193125 0%, #0a1510 38%, #030705 76%, #010302 100%)',
      }}
    >
      <AbsoluteFill
        style={{
          opacity: 0.34 * intensity,
          background:
            'repeating-linear-gradient(90deg, transparent 0 107px, rgba(185,210,173,0.035) 108px 109px), repeating-linear-gradient(0deg, transparent 0 107px, rgba(185,210,173,0.025) 108px 109px)',
          transform: `translateY(${(frame * 0.12) % 108}px) perspective(900px) rotateX(58deg) scale(1.8)`,
          transformOrigin: '50% 82%',
        }}
      />
      <AbsoluteFill
        style={{
          opacity: 0.9,
          background:
            'linear-gradient(180deg, transparent 54%, rgba(2,8,5,0.48) 78%, rgba(0,2,1,0.9) 100%), radial-gradient(circle at 50% 45%, transparent 20%, rgba(0,0,0,0.58) 100%)',
        }}
      />
      {dust}
    </AbsoluteFill>
  );
};

type StylizedNoteProps = {
  width?: number;
  style?: CSSProperties;
  value?: string;
};

export const StylizedNote = ({width = 700, style, value = '100'}: StylizedNoteProps) => {
  const frame = useCurrentFrame();
  const height = width / (6.14 / 2.61);
  return (
    <div
      style={{
        position: 'absolute',
        width,
        height,
        borderRadius: 18,
        overflow: 'hidden',
        color: money.ink,
        background:
          'linear-gradient(135deg, #59705a 0%, #293e30 34%, #8fa884 63%, #314735 100%)',
        border: '3px solid rgba(224,224,188,0.42)',
        boxShadow: '0 28px 70px rgba(0,0,0,0.55), inset 0 0 46px rgba(236,225,176,0.12)',
        ...style,
      }}
    >
      <div style={{position: 'absolute', inset: 15, border: '2px solid rgba(237,232,195,0.38)', borderRadius: 11}} />
      <div
        style={{
          position: 'absolute',
          inset: 30,
          border: '1px solid rgba(225,224,184,0.22)',
          borderRadius: 160,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: width * 0.39,
          top: height * 0.2,
          width: height * 0.58,
          height: height * 0.58,
          borderRadius: '50%',
          border: '3px solid rgba(237,226,173,0.38)',
          background: 'radial-gradient(circle, rgba(223,209,142,0.22), rgba(13,32,20,0.42))',
          boxShadow: `0 0 ${22 + Math.sin(frame * 0.04) * 6}px rgba(225,202,115,0.16)`,
        }}
      />
      <div style={{position: 'absolute', left: 42, top: 30, fontFamily: typography.display, fontSize: width * 0.085, fontWeight: 700}}>{value}</div>
      <div style={{position: 'absolute', right: 42, bottom: 24, fontFamily: typography.display, fontSize: width * 0.085, fontWeight: 700}}>{value}</div>
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          fontFamily: typography.body,
          fontSize: width * 0.035,
          fontWeight: 800,
          letterSpacing: '0.26em',
          color: 'rgba(244,239,208,0.82)',
        }}
      >
        MAGNIVIS
      </div>
    </div>
  );
};

const point = (x: number, y: number) => ({x, y});
const lerpPoint = (a: {x: number; y: number}, b: {x: number; y: number}, amount: number) => ({
  x: mix(a.x, b.x, amount),
  y: mix(a.y, b.y, amount),
});

export const BillionBlock = ({amount = 1}: {amount?: number}) => {
  const frame = useCurrentFrame();
  const eased = easeOutQuint(amount);
  const p00 = point(170, 865);
  const p10 = point(650, 700);
  const p11 = point(930, 880);
  const p01 = point(445, 1050);
  const floorY = 1320;
  const verticalLines = Array.from({length: moneyScale.blockColumns + 1}, (_, index) => {
    const t = index / moneyScale.blockColumns;
    const start = lerpPoint(p00, p10, t);
    const end = lerpPoint(p01, p11, t);
    return <line key={`v-${index}`} x1={start.x} y1={start.y} x2={end.x} y2={end.y} />;
  });
  const horizontalLines = Array.from({length: moneyScale.blockRows + 1}, (_, index) => {
    const t = index / moneyScale.blockRows;
    const start = lerpPoint(p00, p01, t);
    const end = lerpPoint(p10, p11, t);
    return <line key={`h-${index}`} x1={start.x} y1={start.y} x2={end.x} y2={end.y} />;
  });
  return (
    <svg
      width="1080"
      height="1920"
      viewBox="0 0 1080 1920"
      style={{
        position: 'absolute',
        inset: 0,
        opacity: eased,
        transform: `translateY(${mix(180, 0, eased)}px) scale(${mix(0.86, 1, eased)})`,
        transformOrigin: '50% 72%',
        filter: `drop-shadow(0 36px 46px rgba(0,0,0,0.62)) drop-shadow(0 0 ${30 + Math.sin(frame * 0.025) * 8}px rgba(178,194,125,0.13))`,
      }}
    >
      <defs>
        <linearGradient id="moneyTop" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#91aa7d" />
          <stop offset="0.5" stopColor="#4f6c52" />
          <stop offset="1" stopColor="#b9b77d" />
        </linearGradient>
        <linearGradient id="moneyFront" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#344f3a" />
          <stop offset="1" stopColor="#101d15" />
        </linearGradient>
        <linearGradient id="moneySide" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#17281d" />
          <stop offset="1" stopColor="#426047" />
        </linearGradient>
      </defs>
      <polygon points={`${p00.x},${p00.y} ${p10.x},${p10.y} ${p11.x},${p11.y} ${p01.x},${p01.y}`} fill="url(#moneyTop)" stroke="rgba(236,225,169,0.55)" strokeWidth="2" />
      <g stroke="rgba(240,235,196,0.2)" strokeWidth="1">{verticalLines}{horizontalLines}</g>
      <polygon points={`${p01.x},${p01.y} ${p11.x},${p11.y} ${p11.x},${floorY - 175} ${p01.x},${floorY}`} fill="url(#moneyFront)" stroke="rgba(214,214,168,0.28)" strokeWidth="2" />
      <polygon points={`${p00.x},${p00.y} ${p01.x},${p01.y} ${p01.x},${floorY} ${p00.x},${floorY - 190}`} fill="url(#moneySide)" stroke="rgba(214,214,168,0.22)" strokeWidth="2" />
      {Array.from({length: 12}, (_, index) => {
        const t = index / 12;
        return <line key={index} x1={p01.x} y1={mix(p01.y, floorY, t)} x2={p11.x} y2={mix(p11.y, floorY - 175, t)} stroke="rgba(217,216,176,0.13)" strokeWidth="2" />;
      })}
    </svg>
  );
};

export const PersonSilhouette = ({left = 116, bottom = 260, height = 420}: {left?: number; bottom?: number; height?: number}) => (
  <svg
    width={height * 0.34}
    height={height}
    viewBox="0 0 140 420"
    style={{position: 'absolute', left, bottom, filter: 'drop-shadow(0 0 20px rgba(199,219,184,0.18))'}}
  >
    <circle cx="70" cy="48" r="35" fill="#cad5c2" />
    <path d="M42 92 Q70 74 98 92 L113 245 L96 252 L92 410 L61 410 L55 270 L46 410 L17 410 L29 245 L12 236 Z" fill="#9baa96" />
  </svg>
);

export const MillionStack = ({amount = 1}: {amount?: number}) => {
  const height = mix(12, 340, easeOutQuint(amount));
  return (
    <div style={{position: 'absolute', left: 385, bottom: 300, width: 310, height}}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '8px 8px 2px 2px',
          border: '2px solid rgba(221,216,165,0.45)',
          background:
            'repeating-linear-gradient(0deg, rgba(231,226,186,0.19) 0 2px, rgba(47,73,51,0.42) 2px 5px), linear-gradient(90deg, #233c2a, #789069 52%, #263f2d)',
          boxShadow: '0 24px 54px rgba(0,0,0,0.55), 0 0 44px rgba(183,201,145,0.16)',
        }}
      />
      <div style={{position: 'absolute', left: -62, top: 0, bottom: 0, width: 36, borderLeft: '3px solid #d6b86f', borderTop: '3px solid #d6b86f', borderBottom: '3px solid #d6b86f'}} />
      <div style={{position: 'absolute', left: -210, top: '45%', width: 130, color: money.gold, fontFamily: typography.display, fontSize: 38, fontWeight: 650, textAlign: 'right'}}>≈1.1 M</div>
    </div>
  );
};

export const TowerComparison = ({amount = 1}: {amount?: number}) => {
  const base = 1650;
  const pxPerMetre = 1.04;
  const moneyHeight = moneyScale.billionStackHeightM * pxPerMetre * easeOutQuint(amount);
  const burjHeight = moneyScale.burjHeightM * pxPerMetre;
  return (
    <AbsoluteFill>
      <div
        style={{
          position: 'absolute',
          left: 660,
          bottom: 1920 - base,
          width: 128,
          height: moneyHeight,
          background: 'repeating-linear-gradient(0deg, #a7aa72 0 2px, #3c5c41 2px 7px)',
          border: '2px solid rgba(234,223,161,0.48)',
          boxShadow: '0 0 48px rgba(184,190,114,0.24)',
          transformOrigin: '50% 100%',
        }}
      />
      <svg width="1080" height="1920" viewBox="0 0 1080 1920" style={{position: 'absolute', inset: 0}}>
        <path
          d={`M 180 ${base} L 210 ${base - burjHeight * 0.16} L 248 ${base - burjHeight * 0.31} L 265 ${base - burjHeight * 0.52} L 284 ${base - burjHeight * 0.68} L 302 ${base - burjHeight * 0.79} L 318 ${base - burjHeight} L 331 ${base - burjHeight * 0.79} L 349 ${base - burjHeight * 0.68} L 368 ${base - burjHeight * 0.52} L 389 ${base - burjHeight * 0.31} L 426 ${base - burjHeight * 0.16} L 456 ${base} Z`}
          fill="rgba(131,157,142,0.42)"
          stroke="rgba(201,218,198,0.52)"
          strokeWidth="3"
        />
        <line x1="82" y1={base} x2="978" y2={base} stroke="rgba(223,221,181,0.35)" strokeWidth="2" />
      </svg>
      <div style={{position: 'absolute', left: 132, top: base - burjHeight - 80, color: '#b8c9bd', fontFamily: typography.body, fontSize: 18, fontWeight: 800, letterSpacing: '0.16em'}}>BURJ KHALIFA · 828 M</div>
      <div style={{position: 'absolute', left: 625, top: Math.max(430, base - moneyHeight - 74), color: money.gold, fontFamily: typography.display, fontSize: 44, fontWeight: 650}}>≈1.1 KM</div>
    </AbsoluteFill>
  );
};
