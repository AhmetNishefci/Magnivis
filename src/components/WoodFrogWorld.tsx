import {useMemo} from 'react';
import {interpolate} from 'remotion';
import {DiagramPanel, ProcessArrow, ScientificLabel} from './ScientificDiagram';
import {palette, typography} from '../design/tokens';

const crystalPath = (x: number, y: number, size: number, rotation = 0) => (
  <g transform={`translate(${x} ${y}) rotate(${rotation})`}>
    {[0, 60, 120].map((angle) => (
      <path
        key={angle}
        d={`M ${-size} 0 L ${size} 0 M ${size * 0.45} 0 l ${size * 0.22} ${-size * 0.18} M ${size * 0.45} 0 l ${size * 0.22} ${size * 0.18} M ${-size * 0.45} 0 l ${-size * 0.22} ${-size * 0.18} M ${-size * 0.45} 0 l ${-size * 0.22} ${size * 0.18}`}
        transform={`rotate(${angle})`}
        fill="none"
        stroke="#bfeaff"
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.78"
      />
    ))}
  </g>
);

export const ColdForest = ({thaw = 0}: {thaw?: number}) => (
  <div style={{position: 'absolute', inset: 0, overflow: 'hidden', background: `linear-gradient(180deg, ${thaw > 0.5 ? '#071514' : '#06131d'} 0%, #02070d 64%, #020408 100%)`}}>
    <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(circle at 48% 45%, rgba(48,112,123,0.22), transparent 38%), radial-gradient(circle at 10% 15%, rgba(118,156,144,0.1), transparent 28%)'}} />
    {Array.from({length: 16}, (_, index) => {
      const left = (index * 67 + 31) % 1060;
      const top = (index * 137 + 80) % 1680;
      const size = 2 + (index % 4);
      return <div key={index} style={{position: 'absolute', left, top, width: size, height: size, borderRadius: '50%', background: index % 3 === 0 ? '#89c5cf' : '#dbe7df', opacity: 0.12 + (index % 5) * 0.025}} />;
    })}
    <div style={{position: 'absolute', left: -80, right: -80, bottom: -70, height: 430, transform: 'rotate(-2deg)', background: 'linear-gradient(180deg, rgba(18,35,28,0), rgba(12,26,20,0.84) 38%, #06110e)', clipPath: 'polygon(0 22%, 12% 6%, 23% 20%, 35% 3%, 51% 16%, 66% 0, 79% 17%, 91% 4%, 100% 16%, 100% 100%, 0 100%)'}} />
    <div style={{position: 'absolute', inset: 0, background: `radial-gradient(circle at 50% 58%, rgba(137,203,171,${0.05 + thaw * 0.1}), transparent 31%)`}} />
  </div>
);

export const ProceduralWoodFrog = ({
  idPrefix,
  freezeAmount = 0,
  thawAmount = 0,
  legReflex = 0,
  style,
}: {
  idPrefix: string;
  freezeAmount?: number;
  thawAmount?: number;
  legReflex?: number;
  style?: React.CSSProperties;
}) => {
  const cold = Math.max(0, freezeAmount - thawAmount);
  const bodyGradientId = `${idPrefix}-frog-body`;
  const highlightGradientId = `${idPrefix}-frog-highlight`;
  const shadowFilterId = `${idPrefix}-frog-shadow`;
  return (
    <svg viewBox="0 0 700 500" style={{position: 'absolute', overflow: 'visible', ...style}} aria-label="Stylized explanatory wood frog">
      <defs>
        <linearGradient id={bodyGradientId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={cold > 0.55 ? '#688391' : '#927b4d'} />
          <stop offset="0.52" stopColor={cold > 0.55 ? '#3f6274' : '#5f6e3d'} />
          <stop offset="1" stopColor={cold > 0.55 ? '#203d51' : '#354329'} />
        </linearGradient>
        <radialGradient id={highlightGradientId} cx="0.35" cy="0.25" r="0.8">
          <stop offset="0" stopColor="rgba(238,225,173,0.7)" />
          <stop offset="1" stopColor="rgba(238,225,173,0)" />
        </radialGradient>
        <filter id={shadowFilterId} x="-40%" y="-40%" width="180%" height="180%">
          <feDropShadow dx="0" dy="22" stdDeviation="24" floodColor="#000" floodOpacity="0.48" />
        </filter>
      </defs>
      <ellipse cx="350" cy="433" rx="230" ry="30" fill="rgba(0,0,0,0.35)" />
      <g filter={`url(#${shadowFilterId})`}>
        <path d="M222 318 C150 350 105 419 51 437 C123 449 201 429 264 380 Z" fill={`url(#${bodyGradientId})`} stroke="#b9b06a" strokeOpacity="0.25" strokeWidth="5" />
        <path d="M478 318 C548 350 596 418 651 438 C573 452 503 429 436 380 Z" fill={`url(#${bodyGradientId})`} stroke="#b9b06a" strokeOpacity="0.25" strokeWidth="5" transform={`rotate(${legReflex * -7} 478 318)`} />
        <path d="M259 336 C224 374 208 415 169 439" fill="none" stroke="#697245" strokeWidth="31" strokeLinecap="round" />
        <path d="M441 336 C475 374 491 415 531 439" fill="none" stroke="#697245" strokeWidth="31" strokeLinecap="round" transform={`rotate(${legReflex * -9} 441 336)`} />
        <ellipse cx="350" cy="302" rx="177" ry="119" fill={`url(#${bodyGradientId})`} stroke="#cabd78" strokeOpacity="0.26" strokeWidth="6" />
        <ellipse cx="350" cy="207" rx="147" ry="106" fill={`url(#${bodyGradientId})`} stroke="#cabd78" strokeOpacity="0.26" strokeWidth="6" />
        <ellipse cx="300" cy="215" rx="112" ry="84" fill={`url(#${highlightGradientId})`} opacity="0.38" />
        <ellipse cx="255" cy="157" rx="31" ry="27" fill="#68754a" stroke="#b8b06d" strokeWidth="5" />
        <ellipse cx="445" cy="157" rx="31" ry="27" fill="#68754a" stroke="#b8b06d" strokeWidth="5" />
        <ellipse cx="255" cy="158" rx="11" ry="16" fill="#070c0d" />
        <ellipse cx="445" cy="158" rx="11" ry="16" fill="#070c0d" />
        <circle cx="251" cy="151" r="3.5" fill="#e9e7cf" opacity="0.82" />
        <circle cx="441" cy="151" r="3.5" fill="#e9e7cf" opacity="0.82" />
        <path d="M202 166 C244 178 280 190 320 213" fill="none" stroke="#24281d" strokeWidth="23" strokeLinecap="round" opacity="0.9" />
        <path d="M498 166 C456 178 420 190 380 213" fill="none" stroke="#24281d" strokeWidth="23" strokeLinecap="round" opacity="0.9" />
        <path d="M218 202 C252 232 278 254 305 286" fill="none" stroke="#c4b773" strokeWidth="5" strokeLinecap="round" opacity="0.24" />
        <path d="M482 202 C448 232 422 254 395 286" fill="none" stroke="#c4b773" strokeWidth="5" strokeLinecap="round" opacity="0.24" />
        <circle cx="330" cy="235" r="4" fill="#20291f" opacity="0.76" />
        <circle cx="370" cy="235" r="4" fill="#20291f" opacity="0.76" />
      </g>
      <g opacity={cold * 0.82}>
        <path d="M130 402 C203 337 246 311 330 293 C429 273 494 232 548 171" fill="none" stroke="#c9f1ff" strokeWidth="9" strokeLinecap="round" opacity="0.38" />
        <path d="M202 271 C276 250 345 217 425 137" fill="none" stroke="#effcff" strokeWidth="5" strokeLinecap="round" opacity="0.47" />
        {crystalPath(192, 330, 34, 12)}
        {crystalPath(364, 230, 28, -18)}
        {crystalPath(492, 300, 31, 22)}
      </g>
    </svg>
  );
};

export const CardiacTrace = ({amount, stopped}: {amount: number; stopped: number}) => {
  const path = useMemo(() => {
    const points: string[] = [];
    for (let x = 0; x <= 760; x += 8) {
      const normalized = x / 760;
      const pulseRate = interpolate(amount, [0, 1], [8, 3]);
      const cycle = (normalized * pulseRate) % 1;
      const active = normalized < 1 - stopped * 0.66;
      let y = 95;
      if (active) {
        if (cycle > 0.39 && cycle < 0.45) y -= (cycle - 0.39) / 0.06 * 16;
        if (cycle >= 0.45 && cycle < 0.49) y -= 16 + (cycle - 0.45) / 0.04 * 54;
        if (cycle >= 0.49 && cycle < 0.54) y += 38 - (cycle - 0.49) / 0.05 * 38;
        if (cycle >= 0.54 && cycle < 0.64) y -= Math.sin((cycle - 0.54) / 0.1 * Math.PI) * 13;
      }
      points.push(`${x},${y}`);
    }
    return `M ${points.join(' L ')}`;
  }, [amount, stopped]);
  return (
    <DiagramPanel style={{left: 82, right: 188, top: 1230, height: 255}}>
      <ScientificLabel tone="gold" style={{position: 'absolute', left: 26, top: 23}}>Heart activity</ScientificLabel>
      <svg viewBox="0 0 760 190" style={{position: 'absolute', left: 22, right: 22, bottom: 10, width: 'calc(100% - 44px)', height: 180}}>
        {[40, 95, 150].map((y) => <line key={y} x1="0" x2="760" y1={y} y2={y} stroke="#b6d7e5" strokeOpacity="0.08" />)}
        <path d={path} fill="none" stroke="#d9bd6c" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <div style={{position: 'absolute', right: 28, top: 28, color: stopped > 0.72 ? '#d7e9ef' : palette.muted, fontFamily: typography.body, fontSize: 24, fontWeight: 700, letterSpacing: '0.14em', opacity: Math.max(0, (stopped - 0.55) / 0.45)}}>STOPS</div>
    </DiagramPanel>
  );
};

const cells = [
  {x: 205, y: 220, r: 74}, {x: 405, y: 192, r: 68}, {x: 625, y: 225, r: 77},
  {x: 288, y: 405, r: 70}, {x: 520, y: 420, r: 82}, {x: 720, y: 393, r: 60},
];

export const ExtracellularTissue = ({amount}: {amount: number}) => (
  <DiagramPanel style={{left: 80, top: 620, width: 810, height: 730}}>
    <ScientificLabel tone="ice" style={{position: 'absolute', left: 28, top: 26}}>Explanatory tissue view</ScientificLabel>
    <svg viewBox="0 0 820 650" style={{position: 'absolute', inset: 20, width: 770, height: 680}}>
      <rect x="15" y="100" width="790" height="520" rx="64" fill="rgba(24,57,55,0.38)" stroke="#7ac1c8" strokeOpacity="0.18" strokeWidth="3" />
      {cells.map((cell, index) => (
        <g key={index}>
          <circle cx={cell.x} cy={cell.y} r={cell.r} fill="#4a5d3e" stroke="#c7bd72" strokeOpacity="0.48" strokeWidth="5" />
          <circle cx={cell.x - 15} cy={cell.y - 14} r={cell.r * 0.45} fill="rgba(176,185,112,0.12)" />
          <circle cx={cell.x + 16} cy={cell.y + 12} r={cell.r * 0.2} fill="#23382e" opacity="0.65" />
        </g>
      ))}
      <g opacity={amount}>
        <path d="M85 163 C172 311 260 280 356 340 C449 398 590 275 760 347" fill="none" stroke="#bfeaff" strokeWidth="36" strokeOpacity="0.28" strokeLinecap="round" />
        <path d="M112 520 C235 492 350 561 454 506 C568 444 660 534 762 488" fill="none" stroke="#d9f5ff" strokeWidth="29" strokeOpacity="0.24" strokeLinecap="round" />
        {crystalPath(165, 320, 38, 15)}
        {crystalPath(470, 298, 34, -12)}
        {crystalPath(652, 520, 32, 18)}
      </g>
    </svg>
    <div style={{position: 'absolute', left: 32, bottom: 30, color: '#cceaf3', fontFamily: typography.body, fontSize: 23, fontWeight: 700, letterSpacing: '0.12em'}}>ICE FORMS BETWEEN CELLS</div>
  </DiagramPanel>
);

export const CellDehydrationDiagram = ({amount}: {amount: number}) => {
  const radius = interpolate(amount, [0, 1], [172, 133]);
  const droplets = Array.from({length: 9}, (_, index) => ({
    angle: -1.8 + index * 0.42,
    distance: 112 + amount * (105 + (index % 3) * 18),
  }));
  return (
    <DiagramPanel style={{left: 80, top: 590, width: 810, height: 780}}>
      <ScientificLabel tone="ice" style={{position: 'absolute', left: 28, top: 26}}>Cell-level explanation</ScientificLabel>
      <svg viewBox="0 0 810 710" style={{position: 'absolute', inset: 0, width: '100%', height: '100%'}}>
        <g transform="translate(390 355)">
          <circle r="257" fill="rgba(111,190,218,0.05)" stroke="#a7e4f8" strokeOpacity="0.16" strokeWidth="3" strokeDasharray="9 13" />
          <circle r={radius} fill="#425c43" stroke="#d2c979" strokeWidth="8" />
          <circle r={radius * 0.74} fill="rgba(158,178,103,0.12)" />
          <circle cx={radius * 0.22} cy={radius * 0.08} r={radius * 0.22} fill="#213c31" opacity="0.72" />
          {droplets.map(({angle, distance}, index) => (
            <g key={index} transform={`translate(${Math.cos(angle) * distance} ${Math.sin(angle) * distance})`}>
              <path d="M0 -12 C10 2 13 8 13 15 A13 13 0 0 1 -13 15 C-13 8 -10 2 0 -12Z" fill="#91d8ee" opacity={0.35 + amount * 0.55} />
            </g>
          ))}
          <g opacity={amount}>
            {crystalPath(-220, -70, 37, 10)}
            {crystalPath(213, 90, 40, -12)}
            {crystalPath(-132, 213, 32, 17)}
          </g>
        </g>
      </svg>
      <ScientificLabel tone="gold" style={{position: 'absolute', right: 28, bottom: 28}}>Intracellular ice · avoided</ScientificLabel>
      <div style={{position: 'absolute', right: 30, bottom: 82, width: 160, height: 4, background: '#d8bd69', transform: 'rotate(-10deg)', transformOrigin: 'center'}} />
      <div style={{position: 'absolute', left: 32, bottom: 34, color: '#dff7ff', fontFamily: typography.display, fontSize: 36, fontWeight: 600}}>WATER MOVES OUT</div>
    </DiagramPanel>
  );
};

export const CryoprotectantDiagram = ({amount}: {amount: number}) => {
  const glucose = Math.max(0, Math.min(1, (amount - 0.42) / 0.45));
  const protection = Math.max(0, Math.min(1, (amount - 0.72) / 0.25));
  return (
    <DiagramPanel style={{left: 80, top: 590, width: 810, height: 790}}>
      <div style={{position: 'absolute', left: 30, right: 30, top: 34, display: 'flex', justifyContent: 'space-between'}}>
        <ScientificLabel tone="gold">Before freezing</ScientificLabel>
        <ScientificLabel tone="ice" style={{opacity: glucose}}>Freezing begins</ScientificLabel>
      </div>
      <div style={{position: 'absolute', left: 54, top: 150, width: 282, height: 160, borderRadius: 26, border: '1px solid rgba(216,189,105,0.35)', background: 'rgba(127,104,49,0.15)', padding: 26}}>
        <div style={{fontFamily: typography.display, fontSize: 52, fontWeight: 600, color: palette.gold}}>UREA ↑</div>
        <div style={{fontFamily: typography.body, fontSize: 19, fontWeight: 700, color: palette.muted, letterSpacing: '0.08em', marginTop: 10}}>ALREADY BUILT UP</div>
      </div>
      <div style={{position: 'absolute', right: 54, top: 150, width: 330, height: 160, borderRadius: 26, border: '1px solid rgba(143,215,242,0.35)', background: 'rgba(59,129,154,0.13)', padding: 26, opacity: glucose, transform: `translateY(${(1 - glucose) * 20}px)`}}>
        <div style={{fontFamily: typography.display, fontSize: 47, fontWeight: 600, color: '#bfeaff'}}>GLUCOSE ↑</div>
        <div style={{fontFamily: typography.body, fontSize: 18, fontWeight: 700, color: palette.muted, letterSpacing: '0.07em', marginTop: 10}}>RELEASED BY LIVER</div>
      </div>
      <ProcessArrow amount={glucose} style={{left: 338, top: 230, width: 88}} />
      <div style={{position: 'absolute', left: 304, top: 378, width: 204, height: 135, borderRadius: '48% 52% 54% 46%', background: 'linear-gradient(145deg, #8f654b, #51382f)', border: '3px solid rgba(236,186,120,0.4)', opacity: glucose}}>
        <div style={{position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', fontFamily: typography.body, color: '#f2d5aa', fontSize: 20, fontWeight: 700, letterSpacing: '0.12em'}}>LIVER</div>
      </div>
      <ProcessArrow amount={protection} style={{left: 404, top: 545, width: 5, height: 92, transform: `scaleY(${protection})`, background: 'linear-gradient(180deg, #8fd7f2, #d8bd69)'}} />
      <div style={{position: 'absolute', left: 219, top: 602, width: 370, height: 128, borderRadius: 32, border: '1px solid rgba(189,232,221,0.26)', background: `rgba(74,112,83,${0.08 + protection * 0.22})`, display: 'grid', placeItems: 'center', opacity: 0.35 + protection * 0.65}}>
        <div style={{fontFamily: typography.display, fontSize: 41, fontWeight: 600, color: '#e6f2d2'}}>CRYOPROTECTION</div>
      </div>
    </DiagramPanel>
  );
};

export const RecoveryIndicators = ({amount}: {amount: number}) => {
  const steps = [
    {label: 'HEART', threshold: 0.18, color: '#d8bd69'},
    {label: 'BREATHING', threshold: 0.48, color: '#9cdbeb'},
    {label: 'LEG REFLEX', threshold: 0.75, color: '#a9d78f'},
  ];
  return (
    <div style={{position: 'absolute', left: 82, right: 190, top: 1280, display: 'flex', gap: 13}}>
      {steps.map(({label, threshold, color}, index) => {
        const active = Math.max(0, Math.min(1, (amount - threshold) / 0.15));
        return (
          <div key={label} style={{flex: 1, minHeight: 132, borderRadius: 25, border: `1px solid ${color}${active > 0.5 ? '88' : '22'}`, background: `linear-gradient(150deg, ${color}${active > 0.5 ? '22' : '08'}, rgba(5,15,20,0.72))`, padding: '22px 17px', opacity: 0.38 + active * 0.62, transform: `translateY(${(1 - active) * 14}px)`}}>
            <div style={{fontFamily: typography.body, fontSize: 16, fontWeight: 700, color: palette.muted, letterSpacing: '0.15em'}}>0{index + 1}</div>
            <div style={{fontFamily: typography.display, fontSize: 28, fontWeight: 600, color, marginTop: 14}}>{label}</div>
          </div>
        );
      })}
    </div>
  );
};
