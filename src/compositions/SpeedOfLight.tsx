import {Audio} from '@remotion/media';
import {AbsoluteFill, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {BackgroundStars} from '../components/BackgroundStars';
import {CelestialBody} from '../components/CelestialBody';
import {Finish} from '../components/Finish';
import {DistanceBeam, LightAtmosphere, LightTunnel, Moon, PhotonOrbit, ProximaDistance} from '../components/LightWorld';
import {SceneWindow} from '../components/SceneWindow';
import {ShortSafeArea} from '../components/ShortSafeArea';
import {RevealText} from '../components/Typography';
import {speedOfLight} from '../content/videos/speed-of-light';
import {lightScale} from '../data/light';
import {palette, typography} from '../design/tokens';
import {easeInOutCubic, easeOutQuint, mix, progress} from '../utils/math';

const fps = speedOfLight.format.fps;
const seconds = (value: number) => value * fps;

const Hook = () => {
  const frame = useCurrentFrame();
  const amount = easeOutQuint(progress(frame, 0, seconds(1)));
  const laps = amount * lightScale.earthLapsPerSecond;
  return (
    <SceneWindow start={0} end={seconds(4.45)} fadeIn={2} fadeOut={10}>
      <LightAtmosphere />
      <PhotonOrbit amount={amount} />
      <ShortSafeArea>
        <RevealText at={-16} eyebrow="IN ONE SECOND" style={{fontSize: 88, fontWeight: 700, lineHeight: 0.9, letterSpacing: '-0.06em'}}>
          LIGHT CIRCLES
          <br />
          EARTH
        </RevealText>
      </ShortSafeArea>
      <div style={{position: 'absolute', left: 84, top: 1130, color: palette.gold, fontFamily: typography.display, fontSize: 116, fontWeight: 700, lineHeight: 0.82, letterSpacing: '-0.06em'}}>
        {laps.toFixed(1)}×
      </div>
      <div style={{position: 'absolute', left: 89, top: 1242, color: palette.muted, fontFamily: typography.body, fontSize: 21, fontWeight: 800, letterSpacing: '0.16em'}}>AROUND EARTH</div>
    </SceneWindow>
  );
};

const ExactSpeed = () => {
  const frame = useCurrentFrame();
  const amount = progress(frame, seconds(3.75), seconds(7.8));
  const displayed = mix(0, lightScale.speedMps / 1000, easeOutQuint(amount));
  return (
    <SceneWindow start={seconds(3.65)} end={seconds(10.2)} fadeIn={10} fadeOut={12}>
      <LightAtmosphere intensity={0.6} />
      <LightTunnel amount={amount} />
      <ShortSafeArea>
        <RevealText at={seconds(3.85)} eyebrow="IN A VACUUM" style={{fontSize: 73, fontWeight: 700, lineHeight: 0.92}}>
          {displayed.toLocaleString('en-US', {minimumFractionDigits: 3, maximumFractionDigits: 3})}
          <br />
          KM / SECOND
        </RevealText>
      </ShortSafeArea>
      <div style={{position: 'absolute', left: 84, top: 1460, fontFamily: typography.body, fontSize: 18, fontWeight: 800, color: '#abc8e8', letterSpacing: '0.18em'}}>EXACT CONVERSION · SI DEFINITION</div>
    </SceneWindow>
  );
};

const MoonScene = () => {
  const frame = useCurrentFrame();
  const amount = easeInOutCubic(progress(frame, seconds(9.3), seconds(12.7)));
  return (
    <SceneWindow start={seconds(9.05)} end={seconds(15.35)} fadeIn={11} fadeOut={12}>
      <BackgroundStars />
      <CelestialBody kind="earth" diameter={260} centerX={250} centerY={1120} rotationSpeed={0.018} />
      <Moon centerX={840} centerY={920} diameter={105} />
      <DistanceBeam amount={amount} start={{x: 365, y: 1080}} end={{x: 785, y: 940}} />
      <ShortSafeArea>
        <RevealText at={seconds(9.25)} eyebrow="EARTH → MOON" style={{fontSize: 105, fontWeight: 700, lineHeight: 0.86}}>
          ≈1.28
          <br />SECONDS
        </RevealText>
      </ShortSafeArea>
      <div style={{position: 'absolute', left: 84, top: 1450, color: palette.muted, fontFamily: typography.body, fontSize: 19, fontWeight: 800, letterSpacing: '0.18em'}}>AVERAGE DISTANCE · 384,400 KM</div>
    </SceneWindow>
  );
};

const SunScene = () => {
  const frame = useCurrentFrame();
  const amount = easeInOutCubic(progress(frame, seconds(14.2), seconds(19.1)));
  return (
    <SceneWindow start={seconds(13.95)} end={seconds(21.25)} fadeIn={12} fadeOut={12}>
      <BackgroundStars />
      <CelestialBody kind="sun" diameter={470} centerX={205} centerY={1110} />
      <CelestialBody kind="earth" diameter={92} centerX={868} centerY={1020} rotationSpeed={0.018} />
      <DistanceBeam amount={amount} start={{x: 414, y: 1070}} end={{x: 820, y: 1025}} />
      <ShortSafeArea>
        <RevealText at={seconds(14.15)} eyebrow="SUN → EARTH" style={{fontSize: 92, fontWeight: 700, lineHeight: 0.88}}>
          8 MINUTES
          <br />20 SECONDS
        </RevealText>
      </ShortSafeArea>
      <div style={{position: 'absolute', left: 84, top: 1450, color: palette.muted, fontFamily: typography.body, fontSize: 18, fontWeight: 800, letterSpacing: '0.17em'}}>ILLUSTRATIVE DISTANCE · NOT TO SCALE</div>
    </SceneWindow>
  );
};

const LightYearScene = () => {
  const frame = useCurrentFrame();
  const amount = progress(frame, seconds(20), seconds(25.7));
  return (
    <SceneWindow start={seconds(19.85)} end={seconds(26.7)} fadeIn={10} fadeOut={12}>
      <LightAtmosphere intensity={0.55} />
      <LightTunnel amount={amount} />
      <ShortSafeArea>
        <RevealText at={seconds(20.05)} eyebrow="ONE YEAR OF LIGHT" style={{fontSize: 99, fontWeight: 700, lineHeight: 0.86}}>
          9.46
          <br />TRILLION KM
        </RevealText>
      </ShortSafeArea>
      <div style={{position: 'absolute', left: 84, top: 1450, color: palette.gold, fontFamily: typography.body, fontSize: 21, fontWeight: 800, letterSpacing: '0.2em'}}>THIS DISTANCE IS ONE LIGHT-YEAR</div>
    </SceneWindow>
  );
};

const ProximaScene = () => {
  const frame = useCurrentFrame();
  const amount = easeInOutCubic(progress(frame, seconds(25.6), seconds(32)));
  const fade = progress(frame, seconds(32.55), seconds(33));
  return (
    <SceneWindow start={seconds(25.4)} end={seconds(33)} fadeIn={11} fadeOut={1}>
      <LightAtmosphere intensity={0.42} />
      <ProximaDistance amount={amount} />
      <ShortSafeArea>
        <RevealText at={seconds(25.6)} eyebrow="THE NEAREST STAR" style={{fontSize: 91, fontWeight: 700, lineHeight: 0.88}}>
          4.25 YEARS
          <br />AT LIGHT SPEED
        </RevealText>
      </ShortSafeArea>
      <div style={{position: 'absolute', left: 84, top: 1450, color: '#c9d4e7', fontFamily: typography.body, fontSize: 18, fontWeight: 800, letterSpacing: '0.19em'}}>PROXIMA CENTAURI · ≈4.25 LIGHT-YEARS</div>
      <AbsoluteFill style={{backgroundColor: palette.void, opacity: fade}} />
    </SceneWindow>
  );
};

export const SpeedOfLight = () => (
  <AbsoluteFill style={{backgroundColor: palette.void}}>
    <Audio src={staticFile(speedOfLight.audio.file)} volume={0.3} />
    {speedOfLight.audio.narrationCues.map((cue) => (
      <Sequence key={cue.id} from={Math.round(cue.start * fps)} layout="none">
        <Audio src={staticFile(cue.file)} volume={1} />
      </Sequence>
    ))}
    <Hook />
    <ExactSpeed />
    <MoonScene />
    <SunScene />
    <LightYearScene />
    <ProximaScene />
    <Finish />
  </AbsoluteFill>
);
