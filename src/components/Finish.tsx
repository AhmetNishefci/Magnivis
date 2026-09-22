import {AbsoluteFill} from 'remotion';

export const Finish = () => (
  <AbsoluteFill
    style={{
      pointerEvents: 'none',
      background:
        'radial-gradient(circle at 50% 46%, transparent 38%, rgba(0,0,0,0.42) 100%), linear-gradient(180deg, rgba(2,3,10,0.05), rgba(2,3,10,0.22))',
      boxShadow: 'inset 0 0 180px rgba(0,0,0,0.54)',
    }}
  />
);

