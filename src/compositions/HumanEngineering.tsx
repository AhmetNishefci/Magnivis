import {Audio} from '@remotion/media';
import type {ReactNode} from 'react';
import {AbsoluteFill, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {BurjCountLine, BurjSilhouette, ColliderRing, DamWall, EngineeringAtmosphere, TunnelRun} from '../components/EngineeringWorld';
import {Finish} from '../components/Finish';
import {SceneWindow} from '../components/SceneWindow';
import {RevealText} from '../components/Typography';
import {humanEngineering} from '../content/videos/human-engineering';
import {engineeringScale} from '../data/engineering';
import {palette, typography} from '../design/tokens';
import {easeInOutCubic, easeOutQuint, mix, progress} from '../utils/math';

const fps = humanEngineering.format.fps;
const seconds = (value: number) => value * fps;

const HeadlineZone = ({children}: {children: ReactNode}) => (
  <div style={{position: 'absolute', left: 84, right: 190, top: 315}}>{children}</div>
);

const ScaleLabel = ({label, value, accent = palette.blue, top = 1370, valueSize = 70}: {label: string; value: ReactNode; accent?: string; top?: number; valueSize?: number}) => (
  <div style={{position: 'absolute', left: 84, top, maxWidth: 780}}>
    <div style={{width: 64, height: 3, background: accent, marginBottom: 18}} />
    <div style={{color: '#a9bec9', fontFamily: typography.body, fontSize: 19, fontWeight: 800, letterSpacing: '0.19em', marginBottom: 4}}>{label}</div>
    <div style={{color: '#f3f7f9', fontFamily: typography.display, fontSize: valueSize, fontWeight: 700, letterSpacing: '-0.045em', lineHeight: 0.9}}>{value}</div>
  </div>
);

const Hook = () => {
  const frame = useCurrentFrame();
  const amount = easeOutQuint(progress(frame, 0, seconds(1.25)));
  return (
    <SceneWindow start={0} end={seconds(4.55)} fadeIn={2} fadeOut={10}>
      <EngineeringAtmosphere />
      <BurjSilhouette amount={amount} compact />
      <HeadlineZone>
        <RevealText at={-10} eyebrow="HUMAN ENGINEERING" style={{fontSize: 78, fontWeight: 700, lineHeight: 0.9, letterSpacing: '-0.055em'}}>
          THE TALLEST
          <br />BUILDING IS
          <br />ONLY THE START
        </RevealText>
      </HeadlineZone>
    </SceneWindow>
  );
};

const Burj = () => {
  const frame = useCurrentFrame();
  const amount = progress(frame, seconds(3.45), seconds(5.7));
  const height = Math.round(mix(0, engineeringScale.burjHeightM, easeOutQuint(amount)));
  return (
    <SceneWindow start={seconds(3.35)} end={seconds(8.35)} fadeIn={10} fadeOut={11}>
      <EngineeringAtmosphere intensity={0.72} />
      <BurjSilhouette amount={amount} />
      <HeadlineZone>
        <RevealText at={seconds(3.55)} eyebrow="BURJ KHALIFA" style={{fontSize: 112, fontWeight: 700, lineHeight: 0.82, letterSpacing: '-0.065em'}}>
          {height.toLocaleString('en-US')}
          <br />METERS
        </RevealText>
      </HeadlineZone>
    </SceneWindow>
  );
};

const Dam = () => {
  const frame = useCurrentFrame();
  const amount = progress(frame, seconds(7.35), seconds(9.45));
  return (
    <SceneWindow start={seconds(7.05)} end={seconds(13.95)} fadeIn={10} fadeOut={12}>
      <EngineeringAtmosphere intensity={0.7} />
      <DamWall amount={amount} />
      <HeadlineZone>
        <RevealText at={seconds(7.3)} eyebrow="THREE GORGES DAM" style={{fontSize: 104, fontWeight: 700, lineHeight: 0.84, letterSpacing: '-0.06em'}}>
          ≈2.3 KM
          <br />ACROSS
        </RevealText>
      </HeadlineZone>
      <ScaleLabel label="LONGEST STATED DIMENSION" value={`≈${engineeringScale.damInBurjs.toFixed(1)}× BURJ`} />
    </SceneWindow>
  );
};

const Collider = () => {
  const frame = useCurrentFrame();
  const amount = easeInOutCubic(progress(frame, seconds(13), seconds(16)));
  return (
    <SceneWindow start={seconds(12.8)} end={seconds(20.15)} fadeIn={11} fadeOut={12}>
      <EngineeringAtmosphere intensity={0.82} />
      <ColliderRing amount={amount} />
      <HeadlineZone>
        <RevealText at={seconds(13.1)} eyebrow="CERN · UNDERGROUND" style={{fontSize: 102, fontWeight: 700, lineHeight: 0.84, letterSpacing: '-0.06em'}}>
          26.7 KM
          <br />AROUND
        </RevealText>
      </HeadlineZone>
      <ScaleLabel label="LARGE HADRON COLLIDER" value="ONE MACHINE" accent="#f0a24b" />
    </SceneWindow>
  );
};

const Gotthard = () => {
  const frame = useCurrentFrame();
  const amount = progress(frame, seconds(19.1), seconds(24.7));
  const distance = mix(0, engineeringScale.gotthardLengthKm, easeOutQuint(amount));
  return (
    <SceneWindow start={seconds(18.9)} end={seconds(26.25)} fadeIn={11} fadeOut={12}>
      <TunnelRun amount={amount} />
      <HeadlineZone>
        <RevealText at={seconds(19.25)} eyebrow="THROUGH THE ALPS" style={{fontSize: 100, fontWeight: 700, lineHeight: 0.84, letterSpacing: '-0.06em'}}>
          {distance.toFixed(1)} KM
          <br />OF TUNNEL
        </RevealText>
      </HeadlineZone>
      <ScaleLabel label="GOTTHARD BASE TUNNEL" value={<>WORLD’S LONGEST<br />RAIL TUNNEL</>} top={1270} valueSize={58} />
    </SceneWindow>
  );
};

const Coda = () => {
  const frame = useCurrentFrame();
  const amount = easeOutQuint(progress(frame, seconds(25.45), seconds(29.5)));
  const fade = progress(frame, seconds(30.55), seconds(31));
  return (
    <SceneWindow start={seconds(25.2)} end={seconds(31)} fadeIn={10} fadeOut={1}>
      <EngineeringAtmosphere intensity={0.52} />
      <BurjCountLine amount={amount} />
      <HeadlineZone>
        <RevealText at={seconds(25.45)} eyebrow="57.1 KILOMETERS" style={{fontSize: 90, fontWeight: 700, lineHeight: 0.86, letterSpacing: '-0.06em'}}>
          WE BUILT
          <br />THROUGH A
          <br />MOUNTAIN
        </RevealText>
      </HeadlineZone>
      <AbsoluteFill style={{backgroundColor: palette.void, opacity: fade}} />
    </SceneWindow>
  );
};

export const HumanEngineering = () => (
  <AbsoluteFill style={{backgroundColor: '#020609'}}>
    <Audio src={staticFile(humanEngineering.audio.file)} volume={0.31} />
    {humanEngineering.audio.narrationCues.map((cue) => (
      <Sequence key={cue.id} from={Math.round(cue.start * fps)} layout="none">
        <Audio src={staticFile(cue.file)} volume={1} />
      </Sequence>
    ))}
    <Hook />
    <Burj />
    <Dam />
    <Collider />
    <Gotthard />
    <Coda />
    <Finish />
  </AbsoluteFill>
);
