import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {typography} from '../design/tokens';
import {easeOutQuint, mix} from '../utils/math';

const steel = {
  void: '#03070b',
  deep: '#08131c',
  blue: '#79b8d8',
  cyan: '#9ddcf4',
  concrete: '#76838a',
  concreteDark: '#27343b',
  orange: '#f0a24b',
  line: 'rgba(151, 203, 228, 0.24)',
} as const;

const seeded = (index: number, salt: number) => {
  const value = Math.sin(index * 79.31 + salt * 23.17) * 43758.5453;
  return value - Math.floor(value);
};

export const EngineeringAtmosphere = ({intensity = 1}: {intensity?: number}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{
        overflow: 'hidden',
        background: 'radial-gradient(circle at 52% 42%, #102634 0%, #07121a 36%, #020609 76%, #010203 100%)',
      }}
    >
      <AbsoluteFill
        style={{
          opacity: 0.3 * intensity,
          background: 'repeating-linear-gradient(90deg, transparent 0 107px, rgba(139,199,225,0.055) 108px 109px), repeating-linear-gradient(0deg, transparent 0 107px, rgba(139,199,225,0.04) 108px 109px)',
          transform: `translateY(${(frame * 0.16) % 108}px) perspective(920px) rotateX(57deg) scale(1.85)`,
          transformOrigin: '50% 78%',
        }}
      />
      {Array.from({length: 32}, (_, index) => {
        const top = (seeded(index, 2) * 2020 + frame * (0.15 + seeded(index, 3) * 0.24)) % 2020 - 50;
        const size = 1 + seeded(index, 4) * 3.2;
        return (
          <div
            key={index}
            style={{
              position: 'absolute',
              left: seeded(index, 1) * 1080,
              top,
              width: size,
              height: size,
              borderRadius: '50%',
              background: `rgba(169,218,239,${0.08 + seeded(index, 5) * 0.18})`,
            }}
          />
        );
      })}
      <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 52%, transparent 24%, rgba(0,0,0,0.63) 100%)'}} />
    </AbsoluteFill>
  );
};

export const BurjSilhouette = ({amount = 1, compact = false}: {amount?: number; compact?: boolean}) => {
  const eased = easeOutQuint(amount);
  const height = compact ? 630 : 1040;
  const width = compact ? 150 : 250;
  const bottom = compact ? 350 : 205;
  const left = compact ? 170 : 415;
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 250 1040"
      style={{
        position: 'absolute',
        left,
        bottom,
        overflow: 'visible',
        opacity: eased,
        transform: `scaleY(${mix(0.06, 1, eased)})`,
        transformOrigin: '50% 100%',
        filter: 'drop-shadow(0 0 28px rgba(121,184,216,0.28))',
      }}
    >
      <defs>
        <linearGradient id="burjSteel" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#263842" />
          <stop offset="0.48" stopColor="#b5cbd4" />
          <stop offset="0.7" stopColor="#607986" />
          <stop offset="1" stopColor="#1b2930" />
        </linearGradient>
      </defs>
      <path d="M124 0 L132 160 L151 225 L145 318 L174 365 L163 458 L194 512 L178 606 L213 672 L192 770 L230 842 L205 1040 L45 1040 L27 842 L67 770 L52 672 L85 606 L70 512 L102 458 L91 365 L116 318 L108 225 L119 160 Z" fill="url(#burjSteel)" stroke="rgba(193,224,235,0.6)" strokeWidth="2" />
      {Array.from({length: 27}, (_, index) => (
        <line key={index} x1={67 + index % 3 * 14} y1={330 + index * 24} x2={181 - index % 4 * 10} y2={330 + index * 24} stroke="rgba(197,228,238,0.23)" strokeWidth="2" />
      ))}
      <line x1="124" y1="0" x2="124" y2="1038" stroke="rgba(239,248,250,0.26)" strokeWidth="2" />
    </svg>
  );
};

export const DamWall = ({amount = 1}: {amount?: number}) => {
  const frame = useCurrentFrame();
  const eased = easeOutQuint(amount);
  const width = mix(60, 980, eased);
  return (
    <AbsoluteFill>
      <div
        style={{
          position: 'absolute',
          left: 50,
          top: 780,
          width,
          height: 480,
          clipPath: 'polygon(2% 13%, 98% 0, 100% 78%, 70% 91%, 28% 100%, 0 80%)',
          background: 'linear-gradient(155deg, #8d999e 0%, #4c5b62 36%, #1b282f 100%)',
          border: '2px solid rgba(184,212,221,0.42)',
          boxShadow: '0 34px 80px rgba(0,0,0,0.65), 0 0 48px rgba(101,172,203,0.12)',
        }}
      >
        <div style={{position: 'absolute', inset: 0, opacity: 0.28, background: 'repeating-linear-gradient(90deg, transparent 0 74px, rgba(220,236,240,0.25) 75px 77px)'}} />
        <div style={{position: 'absolute', left: 70, right: 70, top: 95, height: 16, background: '#18242a', boxShadow: '0 0 18px rgba(0,0,0,0.7)'}} />
        {Array.from({length: 12}, (_, index) => (
          <div key={index} style={{position: 'absolute', left: 78 + index * 72, top: 99, width: 7, height: 7, borderRadius: '50%', background: index % 3 === 0 ? steel.orange : '#d7eff8', boxShadow: `0 0 ${8 + Math.sin(frame * 0.05 + index) * 3}px currentColor`}} />
        ))}
      </div>
      <div style={{position: 'absolute', left: 65, top: 1270, width: width * 0.95, height: 3, background: 'linear-gradient(90deg, transparent, #8dd5ef, transparent)', opacity: 0.55}} />
    </AbsoluteFill>
  );
};

export const ColliderRing = ({amount = 1}: {amount?: number}) => {
  const frame = useCurrentFrame();
  const eased = easeOutQuint(amount);
  const angle = frame * 0.082;
  const dots = [0, Math.PI];
  return (
    <svg width="1080" height="1920" viewBox="0 0 1080 1920" style={{position: 'absolute', inset: 0}}>
      <defs>
        <radialGradient id="lhcGround">
          <stop offset="0" stopColor="#163347" stopOpacity="0.72" />
          <stop offset="1" stopColor="#04090d" stopOpacity="0" />
        </radialGradient>
        <filter id="lhcGlow"><feGaussianBlur stdDeviation="12" /></filter>
      </defs>
      <ellipse cx="540" cy="1110" rx="475" ry="335" fill="url(#lhcGround)" opacity={eased} />
      <ellipse cx="540" cy="1110" rx={mix(45, 410, eased)} ry={mix(35, 270, eased)} fill="none" stroke="rgba(115,190,222,0.16)" strokeWidth="42" />
      <ellipse cx="540" cy="1110" rx={mix(45, 410, eased)} ry={mix(35, 270, eased)} fill="none" stroke={steel.blue} strokeWidth="5" />
      <ellipse cx="540" cy="1110" rx={mix(45, 410, eased)} ry={mix(35, 270, eased)} fill="none" stroke="rgba(222,245,252,0.42)" strokeWidth="2" strokeDasharray="8 20" />
      {dots.map((offset, index) => {
        const x = 540 + Math.cos(angle + offset) * 410 * eased;
        const y = 1110 + Math.sin(angle + offset) * 270 * eased;
        return <g key={index}><circle cx={x} cy={y} r="34" fill={index === 0 ? steel.orange : steel.cyan} opacity="0.22" filter="url(#lhcGlow)" /><circle cx={x} cy={y} r="9" fill={index === 0 ? '#ffd08c' : '#d9f5ff'} /></g>;
      })}
      <circle cx="540" cy="1110" r={mix(120, 245, eased)} fill="none" stroke="rgba(137,190,212,0.08)" strokeWidth="1" strokeDasharray="5 22" />
    </svg>
  );
};

export const TunnelRun = ({amount = 1}: {amount?: number}) => {
  const frame = useCurrentFrame();
  const eased = easeOutQuint(amount);
  const vanishingY = 850;
  const pulse = (frame * 24) % 170;
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <svg width="1080" height="1920" viewBox="0 0 1080 1920" style={{position: 'absolute', inset: 0}}>
        <defs>
          <linearGradient id="tunnelWall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#101f29" /><stop offset="1" stopColor="#020507" /></linearGradient>
          <radialGradient id="portalGlow"><stop offset="0" stopColor="#d9f4ff" /><stop offset="0.18" stopColor="#6dbfe4" stopOpacity="0.72" /><stop offset="1" stopColor="#0a1620" stopOpacity="0" /></radialGradient>
        </defs>
        <rect width="1080" height="1920" fill="url(#tunnelWall)" />
        <ellipse cx="540" cy={vanishingY} rx={90 + eased * 30} ry={65 + eased * 20} fill="url(#portalGlow)" opacity={0.75 + Math.sin(frame * 0.08) * 0.12} />
        {Array.from({length: 17}, (_, index) => {
          const shifted = (index * 170 + pulse) % 2890;
          const t = shifted / 2890;
          const scale = t ** 2.15;
          const rx = 105 + scale * 790;
          const ry = 72 + scale * 930;
          return <ellipse key={index} cx="540" cy={vanishingY + scale * 310} rx={rx} ry={ry} fill="none" stroke={index % 4 === 0 ? 'rgba(240,162,75,0.32)' : 'rgba(131,197,224,0.22)'} strokeWidth={2 + scale * 5} />;
        })}
        <line x1="500" y1={vanishingY + 20} x2="155" y2="1920" stroke="rgba(194,224,235,0.52)" strokeWidth="6" />
        <line x1="580" y1={vanishingY + 20} x2="925" y2="1920" stroke="rgba(194,224,235,0.52)" strokeWidth="6" />
        <line x1="540" y1={vanishingY + 30} x2="540" y2="1920" stroke="rgba(240,162,75,0.28)" strokeWidth="3" strokeDasharray="16 30" />
      </svg>
    </AbsoluteFill>
  );
};

export const BurjCountLine = ({amount = 1}: {amount?: number}) => {
  const count = Math.min(69, Math.floor(amount * 70));
  return (
    <AbsoluteFill>
      <svg width="1080" height="1920" viewBox="0 0 1080 1920" style={{position: 'absolute', inset: 0}}>
        <path d="M110 1320 C330 1230 490 1120 610 980 C760 805 865 690 1000 590" fill="none" stroke="rgba(125,194,224,0.2)" strokeWidth="5" />
        {Array.from({length: 69}, (_, index) => {
          const t = index / 68;
          const x = 110 + t * 890;
          const y = 1320 - t * 730 - Math.sin(t * Math.PI) * 90;
          const visible = index < count;
          const height = 16 + t * 30;
          return <line key={index} x1={x} y1={y} x2={x + 4} y2={y - height} stroke={visible ? (index === 68 ? '#f7c876' : '#8dd5ef') : 'rgba(123,180,202,0.09)'} strokeWidth={visible ? 4 : 2} />;
        })}
      </svg>
      <div style={{position: 'absolute', left: 84, top: 1060, fontFamily: typography.display, color: '#f7c876', fontSize: 160, fontWeight: 700, letterSpacing: '-0.075em', lineHeight: 0.8}}>{Math.max(1, count)}×</div>
      <div style={{position: 'absolute', left: 92, top: 1205, fontFamily: typography.body, color: '#b5c8d1', fontSize: 20, fontWeight: 800, letterSpacing: '0.19em'}}>BURJ KHALIFA · END TO END</div>
    </AbsoluteFill>
  );
};
