export const proofSize = {width: 1080, height: 1920, fps: 30, frames: 180, durationSeconds: 6} as const;
export const proofSamples = [
  {frame: 0, reason: 'frame-zero'}, {frame: 8, reason: 'quarter-second-nearest-frame'},
  {frame: 15, reason: 'half-second'}, {frame: 17, reason: 'peak-deck-displacement'},
  {frame: 30, reason: 'one-second-torso-arm-reaction'}, {frame: 36, reason: 'corrective-foot-search'},
  {frame: 45, reason: 'corrective-placement'}, {frame: 96, reason: 'camera-foot-approach'},
  {frame: 123, reason: 'transition-midpoint'}, {frame: 140, reason: 'macro-contact'},
  {frame: 179, reason: 'final-prototype-frame'},
] as const;
export const smooth = (a: number, b: number, t: number) => {const v = Math.max(0, Math.min(1, (t - a) / (b - a))); return v * v * (3 - 2 * v);};
export const motionState = (frame: number) => {
  if (!Number.isInteger(frame) || frame < 0 || frame >= proofSize.frames) throw new Error('Motion proof frame outside authorized six-second range');
  const t = frame / proofSize.fps;
  const deck = 32 * Math.sin(t * Math.PI / 1.1) * (1 - .55 * smooth(.6, 2.6, t));
  const reaction = smooth(.28, .92, t) * (1 - .55 * smooth(1.8, 2.8, t));
  const step = smooth(.75, 1.5, t);
  const lift = t <= .75 || t >= 1.5 ? 0 : Math.sin(Math.PI * (t - .75) / .75) * 6;
  const push = smooth(2.75, 4.1, t);
  return {t, deck, torso: -24 * reaction, arm: -12 * reaction, step: 14 * step, lift,
    macroMix: smooth(3.95, 4.25, t), cameraScale: 1.018 + .032 * smooth(0, 2.6, t) + 3.35 * push,
    cameraX: 540 + (393 - 540) * push, cameraY: 960 + (1128 - 960) * push,
    macroDeck: 16 * Math.sin((t - 4.25) * Math.PI / 1.3), macroCorrection: smooth(4.55, 5.5, t) * 18};
};

// Hand-authored pixel-space influence masks, NOT generated segmentation or clean plates.
// Feathered weights drive one continuous inverse UV field; no detached alpha cards or hole inpainting.
export const maskSvgs = {
  human: '<path d="M425 325 Q478 302 532 340 Q580 372 570 425 L576 475 L642 587 L701 670 L754 700 L825 721 L840 738 L823 750 L785 734 L745 716 L714 718 L671 683 L626 650 L654 832 L644 880 L705 1020 L753 1140 L781 1160 L821 1183 L850 1214 L850 1244 L798 1254 L744 1233 L724 1190 L677 1160 L583 1065 L503 979 L426 950 L403 1087 L410 1138 L394 1187 L342 1198 L310 1184 L302 1160 L320 1110 L316 1005 L303 916 L260 912 L235 876 L243 699 L231 638 L218 599 L226 532 L244 472 L270 438 L414 427 L409 394 Z" fill="white"/>',
  deck: '<path d="M0 510 L260 667 L540 925 L818 667 L1080 602 L1080 1920 L0 1920Z" fill="white"/>',
  torso: '<ellipse cx="430" cy="620" rx="225" ry="325" fill="white"/>',
  arm: '<ellipse cx="694" cy="663" rx="155" ry="100" fill="white"/>',
  freeFoot: '<ellipse cx="744" cy="1153" rx="125" ry="130" fill="white"/>',
  plantedContact: '<ellipse cx="361" cy="1178" rx="68" ry="31" fill="white"/>',
  freeContact: '<ellipse cx="782" cy="1235" rx="69" ry="30" fill="white"/>',
  macroFoot: '<path d="M78 0 L1030 0 L1040 930 L933 1024 L717 1015 L642 899 L601 1165 L122 1193 L85 1089 L272 841 L249 603Z" fill="white"/>',
} as const;
export type ProofMask = keyof typeof maskSvgs;
export const maskSvg = (id: ProofMask) => `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1920"><rect width="1080" height="1920" fill="black"/>${maskSvgs[id]}</svg>`;
