import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {oceanScale} from '../data/ocean';
import {palette, typography} from '../design/tokens';
import {easeOutQuint, mix, progress} from '../utils/math';

const seeded = (index: number, salt: number) => {
  const value = Math.sin(index * 91.173 + salt * 17.119) * 43758.5453;
  return value - Math.floor(value);
};

export const OceanAtmosphere = ({depth = 0}: {depth?: number}) => {
  const frame = useCurrentFrame();
  const darkness = Math.min(1, depth / 1300);
  const particles = Array.from({length: 44}, (_, index) => {
    const size = mix(2, 8, seeded(index, 1));
    const left = seeded(index, 2) * 1080;
    const base = seeded(index, 3) * 2050;
    const drift = ((base - frame * mix(0.35, 1.2, seeded(index, 4))) % 2050 + 2050) % 2050;
    const sway = Math.sin(frame * 0.012 + index) * 18;
    return (
      <div
        key={index}
        style={{
          position: 'absolute',
          left: left + sway,
          top: drift - 65,
          width: size,
          height: size,
          borderRadius: '50%',
          background: `rgba(194, 232, 255, ${mix(0.15, 0.34, darkness)})`,
          boxShadow: '0 0 12px rgba(110,190,235,0.22)',
          filter: `blur(${size > 6 ? 1.4 : 0}px)`,
        }}
      />
    );
  });

  return (
    <AbsoluteFill
      style={{
        overflow: 'hidden',
        background: `linear-gradient(180deg, ${depth < 350 ? '#146489' : '#07334e'} 0%, ${
          depth < 1000 ? '#041c30' : '#020912'
        } 58%, #010309 100%)`,
      }}
    >
      <AbsoluteFill
        style={{
          opacity: Math.max(0, 1 - darkness * 1.15),
          background:
            'radial-gradient(ellipse at 46% -5%, rgba(162,226,255,0.8) 0%, rgba(52,157,206,0.24) 27%, transparent 64%)',
        }}
      />
      <AbsoluteFill
        style={{
          opacity: Math.max(0, 0.72 - darkness),
          background:
            'repeating-linear-gradient(104deg, transparent 0 105px, rgba(177,227,255,0.08) 118px 145px, transparent 158px 270px)',
          transform: `translateX(${Math.sin(frame * 0.011) * 22}px)`,
          filter: 'blur(8px)',
        }}
      />
      {particles}
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(circle at 50% 48%, transparent 18%, rgba(0,5,15,0.25) 62%, rgba(0,2,8,0.72) 100%)',
        }}
      />
    </AbsoluteFill>
  );
};

export const WaterSurface = ({top = 380}: {top?: number}) => {
  const frame = useCurrentFrame();
  return (
    <div style={{position: 'absolute', top, left: 0, width: '100%', height: 46}}>
      <div
        style={{
          position: 'absolute',
          top: -10,
          left: -90,
          width: 1260,
          height: 34,
          opacity: 0.85,
          background:
            'radial-gradient(ellipse at 18px 30px, transparent 17px, rgba(180,232,255,0.75) 18px, transparent 20px)',
          backgroundSize: '72px 34px',
          transform: `translateX(${(frame * 0.75) % 72}px)`,
          filter: 'drop-shadow(0 0 12px rgba(132,215,255,0.65))',
        }}
      />
      <div style={{height: 2, background: 'linear-gradient(90deg, transparent, #c5efff 16%, #7bd0f6 72%, transparent)'}} />
    </div>
  );
};

export const DepthGauge = ({depth, label}: {depth: number; label?: string}) => {
  const formatted = Math.round(depth).toLocaleString('en-US');
  return (
    <div
      style={{
        position: 'absolute',
        left: 82,
        top: 740,
        width: 790,
        color: palette.ink,
      }}
    >
      <div style={{display: 'flex', alignItems: 'center', gap: 24}}>
        <div style={{width: 74, height: 2, background: '#6fd8ff', boxShadow: '0 0 18px rgba(90,210,255,0.7)'}} />
        <div style={{fontFamily: typography.body, fontWeight: 700, fontSize: 19, letterSpacing: '0.23em', color: '#9edcf5'}}>
          CURRENT DEPTH
        </div>
      </div>
      <div style={{fontFamily: typography.display, fontWeight: 600, fontSize: 142, lineHeight: 0.93, letterSpacing: '-0.07em', marginTop: 28}}>
        {formatted}
        <span style={{fontSize: 48, letterSpacing: '-0.02em', marginLeft: 24, color: '#a8c5d4'}}>M</span>
      </div>
      {label ? (
        <div style={{fontFamily: typography.body, fontSize: 25, fontWeight: 700, letterSpacing: '0.1em', color: '#d9eff8', marginTop: 28}}>
          {label}
        </div>
      ) : null}
    </div>
  );
};

export const EverestInChallenger = ({revealAt = 0}: {revealAt?: number}) => {
  const frame = useCurrentFrame();
  const amount = easeOutQuint(progress(frame, revealAt, revealAt + 24));
  const surfaceY = 382;
  const floorY = 1595;
  const waterHeight = floorY - surfaceY;
  const mountainHeight = waterHeight * oceanScale.everestFractionOfChallenger;
  const summitY = floorY - mountainHeight;
  const mountainPath = [
    `M 125 ${floorY}`,
    `L 205 ${floorY - 58}`,
    `L 270 ${floorY - 190}`,
    `L 335 ${floorY - 310}`,
    `L 384 ${floorY - 455}`,
    `L 430 ${floorY - 555}`,
    `L 470 ${floorY - 690}`,
    `L 510 ${floorY - 805}`,
    `L 548 ${summitY}`,
    `L 584 ${floorY - 795}`,
    `L 620 ${floorY - 722}`,
    `L 674 ${floorY - 620}`,
    `L 720 ${floorY - 482}`,
    `L 774 ${floorY - 365}`,
    `L 836 ${floorY - 230}`,
    `L 914 ${floorY - 92}`,
    `L 980 ${floorY}`,
    'Z',
  ].join(' ');

  return (
    <AbsoluteFill style={{opacity: amount}}>
      <OceanAtmosphere depth={10935} />
      <WaterSurface top={surfaceY} />
      <svg width="1080" height="1920" viewBox="0 0 1080 1920" style={{position: 'absolute', inset: 0}}>
        <defs>
          <linearGradient id="oceanMountain" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#c7d8df" />
            <stop offset="0.19" stopColor="#66899b" />
            <stop offset="0.54" stopColor="#1c3f52" />
            <stop offset="1" stopColor="#081b29" />
          </linearGradient>
          <linearGradient id="seafloor" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#07131d" />
            <stop offset="0.5" stopColor="#18313e" />
            <stop offset="1" stopColor="#050e17" />
          </linearGradient>
          <filter id="mountainGlow">
            <feGaussianBlur stdDeviation="9" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        <path d={mountainPath} fill="url(#oceanMountain)" opacity="0.92" stroke="rgba(171,218,236,0.38)" strokeWidth="2" filter="url(#mountainGlow)" />
        <path
          d={`M 450 ${floorY - 640} L 510 ${floorY - 805} L 548 ${summitY} L 584 ${floorY - 795} L 632 ${floorY - 702} L 570 ${floorY - 742} L 535 ${floorY - 690} L 505 ${floorY - 730} Z`}
          fill="rgba(228,244,250,0.7)"
        />
        <path d={`M 0 ${floorY} Q 160 ${floorY - 30} 340 ${floorY} T 700 ${floorY} T 1080 ${floorY} L 1080 1920 L 0 1920 Z`} fill="url(#seafloor)" />
        <line x1="112" y1={surfaceY} x2="112" y2={summitY} stroke="#7cdcff" strokeWidth="3" />
        <line x1="96" y1={surfaceY} x2="128" y2={surfaceY} stroke="#7cdcff" strokeWidth="3" />
        <line x1="96" y1={summitY} x2="128" y2={summitY} stroke="#7cdcff" strokeWidth="3" />
        <line x1="548" y1={summitY} x2="914" y2={summitY} stroke="rgba(156,219,245,0.44)" strokeWidth="2" strokeDasharray="10 10" />
      </svg>
      <div style={{position: 'absolute', left: 145, top: surfaceY + 62, color: '#8edcff', fontFamily: typography.display, fontSize: 38, fontWeight: 600, letterSpacing: '-0.025em'}}>
        ≈2.1 KM
        <div style={{fontFamily: typography.body, fontSize: 16, fontWeight: 700, letterSpacing: '0.19em', color: '#98afbd', marginTop: 8}}>WATER ABOVE THE SUMMIT</div>
      </div>
      <div style={{position: 'absolute', left: 650, top: summitY - 58, color: palette.ink, fontFamily: typography.body, fontSize: 18, fontWeight: 700, letterSpacing: '0.16em'}}>
        EVEREST · 8,849 M
      </div>
      <div style={{position: 'absolute', left: 84, top: floorY + 34, color: '#aec8d4', fontFamily: typography.body, fontSize: 18, fontWeight: 700, letterSpacing: '0.17em'}}>
        CHALLENGER DEEP · ≈10,935 M
      </div>
    </AbsoluteFill>
  );
};
