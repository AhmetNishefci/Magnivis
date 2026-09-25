import {useMemo} from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {CelestialBody} from './CelestialBody';
import {clamp01, easeOutQuint, mix} from '../utils/math';

const seeded = (index: number, salt: number) => {
  const value = Math.sin(index * 7151.81 + salt * 193.37) * 43758.5453;
  return value - Math.floor(value);
};

export const LightAtmosphere = ({intensity = 1}: {intensity?: number}) => {
  const frame = useCurrentFrame();
  const motes = useMemo(
    () => Array.from({length: 54}, (_, index) => ({
      x: seeded(index, 1) * 1080,
      y: seeded(index, 2) * 1920,
      size: 1 + seeded(index, 3) * 3,
      phase: seeded(index, 4) * Math.PI * 2,
    })),
    [],
  );

  return (
    <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 55%, rgba(30,78,122,0.22), transparent 36%), linear-gradient(180deg, #02050d 0%, #030a17 55%, #010208 100%)'}}>
      <AbsoluteFill style={{background: 'radial-gradient(circle at 74% 20%, rgba(255,205,105,0.08), transparent 27%)', opacity: intensity}} />
      <svg width="1080" height="1920" viewBox="0 0 1080 1920" aria-hidden="true">
        {motes.map((mote, index) => (
          <circle
            key={index}
            cx={mote.x}
            cy={(mote.y + frame * (0.08 + seeded(index, 5) * 0.12)) % 1920}
            r={mote.size}
            fill="#ddecff"
            opacity={(0.14 + Math.sin(frame / 24 + mote.phase) * 0.08) * intensity}
          />
        ))}
      </svg>
    </AbsoluteFill>
  );
};

export const PhotonOrbit = ({amount}: {amount: number}) => {
  const totalLaps = amount * 7.5;
  const angle = totalLaps * Math.PI * 2 - Math.PI / 2;
  const centerX = 540;
  const centerY = 1060;
  const radiusX = 325;
  const radiusY = 192;
  const photonX = centerX + Math.cos(angle) * radiusX;
  const photonY = centerY + Math.sin(angle) * radiusY;
  return (
    <AbsoluteFill>
      <CelestialBody kind="earth" diameter={500} centerX={centerX} centerY={centerY} rotationSpeed={0.022} />
      <svg width="1080" height="1920" viewBox="0 0 1080 1920" style={{position: 'absolute', inset: 0}} aria-hidden="true">
        {Array.from({length: 8}, (_, index) => {
          const lap = clamp01(totalLaps - index);
          const rx = radiusX + index * 7;
          const ry = radiusY + index * 4;
          const circumference = Math.PI * (3 * (rx + ry) - Math.sqrt((3 * rx + ry) * (rx + 3 * ry)));
          return (
            <ellipse
              key={index}
              cx={centerX}
              cy={centerY}
              rx={rx}
              ry={ry}
              fill="none"
              stroke={index === 7 ? '#fff4bd' : '#e8bb5d'}
              strokeWidth={index === 7 ? 5 : 3}
              opacity={0.2 + lap * 0.66}
              strokeDasharray={circumference}
              strokeDashoffset={circumference * (1 - lap)}
              transform={`rotate(-90 ${centerX} ${centerY})`}
            />
          );
        })}
        <circle cx={photonX} cy={photonY} r={34} fill="#ffe28b" opacity={0.1} />
        <circle cx={photonX} cy={photonY} r={21} fill="#ffe8a8" opacity={0.2} />
        <circle cx={photonX} cy={photonY} r={10} fill="#fffde8" />
      </svg>
    </AbsoluteFill>
  );
};

type DistanceBeamProps = {
  amount: number;
  start: {x: number; y: number};
  end: {x: number; y: number};
  color?: string;
};

export const DistanceBeam = ({amount, start, end, color = '#ffe28b'}: DistanceBeamProps) => {
  const x = mix(start.x, end.x, amount);
  const y = mix(start.y, end.y, amount);
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const length = Math.sqrt(dx * dx + dy * dy);
  return (
    <svg width="1080" height="1920" viewBox="0 0 1080 1920" style={{position: 'absolute', inset: 0}} aria-hidden="true">
      <line x1={start.x} y1={start.y} x2={end.x} y2={end.y} stroke="rgba(171,203,240,0.22)" strokeWidth={2} strokeDasharray="8 14" />
      <line
        x1={start.x}
        y1={start.y}
        x2={end.x}
        y2={end.y}
        stroke={color}
        strokeWidth={22}
        opacity={0.08}
        strokeDasharray={length}
        strokeDashoffset={length * (1 - amount)}
      />
      <line
        x1={start.x}
        y1={start.y}
        x2={end.x}
        y2={end.y}
        stroke={color}
        strokeWidth={5}
        opacity={0.72}
        strokeDasharray={length}
        strokeDashoffset={length * (1 - amount)}
      />
      <circle cx={x} cy={y} r={35} fill={color} opacity={0.09} />
      <circle cx={x} cy={y} r={22} fill={color} opacity={0.2} />
      <circle cx={x} cy={y} r={11} fill="#fffde8" />
    </svg>
  );
};

export const Moon = ({centerX, centerY, diameter}: {centerX: number; centerY: number; diameter: number}) => (
  <div style={{position: 'absolute', left: centerX, top: centerY, width: diameter, height: diameter, borderRadius: '50%', transform: 'translate(-50%, -50%)', background: 'radial-gradient(circle at 32% 28%, #f0f3f4 0%, #aeb6bd 45%, #505a66 77%, #161d29 100%)', boxShadow: 'inset -18px -10px 42px rgba(0,0,0,0.62), 0 0 42px rgba(190,211,235,0.24)'}} />
);

export const LightTunnel = ({amount}: {amount: number}) => {
  const rays = useMemo(() => Array.from({length: 44}, (_, index) => ({
    angle: seeded(index, 8) * Math.PI * 2,
    distance: 120 + seeded(index, 9) * 650,
    length: 70 + seeded(index, 10) * 280,
    width: 1 + seeded(index, 11) * 3,
    opacity: 0.18 + seeded(index, 12) * 0.5,
  })), []);
  const eased = easeOutQuint(amount);
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <svg width="1080" height="1920" viewBox="0 0 1080 1920" aria-hidden="true">
        <defs>
          <linearGradient id="ray" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#9acfff" stopOpacity="0" /><stop offset="1" stopColor="#fff0ad" /></linearGradient>
        </defs>
        {rays.map((ray, index) => {
          const distance = ray.distance * (0.35 + eased * 1.25);
          const x1 = 540 + Math.cos(ray.angle) * distance;
          const y1 = 1030 + Math.sin(ray.angle) * distance;
          const x2 = 540 + Math.cos(ray.angle) * (distance + ray.length * (0.2 + eased));
          const y2 = 1030 + Math.sin(ray.angle) * (distance + ray.length * (0.2 + eased));
          return <line key={index} x1={x1} y1={y1} x2={x2} y2={y2} stroke="url(#ray)" strokeWidth={ray.width} opacity={ray.opacity} />;
        })}
        <circle cx={540} cy={1030} r={12 + eased * 16} fill="#fffbe0" opacity={0.96} />
        <circle cx={540} cy={1030} r={90 + eased * 120} fill="none" stroke="#ffe69a" strokeWidth={2} opacity={0.12 + eased * 0.12} />
      </svg>
    </AbsoluteFill>
  );
};

export const ProximaDistance = ({amount}: {amount: number}) => {
  const pulse = clamp01(amount);
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: 128, top: 1080, width: 24, height: 24, borderRadius: '50%', background: '#6dbbff', boxShadow: '0 0 30px #4b9cff'}} />
      <div style={{position: 'absolute', right: 150, top: 1038, width: 70, height: 70, borderRadius: '50%', background: 'radial-gradient(circle, #fff6dc 0%, #ff946b 22%, #9e211d 52%, #31070b 78%, transparent 79%)', boxShadow: '0 0 55px rgba(255,94,53,0.7), 0 0 150px rgba(188,30,30,0.24)'}} />
      <DistanceBeam amount={pulse} start={{x: 150, y: 1092}} end={{x: 895, y: 1073}} color="#ffe183" />
      <div style={{position: 'absolute', left: 118, top: 1140, color: '#9fcfff', fontFamily: '"Manrope", system-ui, sans-serif', fontSize: 18, letterSpacing: '0.18em', fontWeight: 800}}>EARTH</div>
      <div style={{position: 'absolute', right: 92, top: 1140, color: '#ffad8c', fontFamily: '"Manrope", system-ui, sans-serif', fontSize: 18, letterSpacing: '0.18em', fontWeight: 800}}>PROXIMA</div>
    </AbsoluteFill>
  );
};
