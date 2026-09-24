import {Audio} from '@remotion/media';
import {AbsoluteFill, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {EverestInChallenger, DepthGauge, OceanAtmosphere} from '../components/OceanDepthWorld';
import {Finish} from '../components/Finish';
import {SceneWindow} from '../components/SceneWindow';
import {ShortSafeArea} from '../components/ShortSafeArea';
import {RevealText} from '../components/Typography';
import {oceanDepth} from '../content/videos/ocean-depth';
import {typography} from '../design/tokens';
import {easeInOutCubic, easeOutQuint, mix, progress} from '../utils/math';

const fps = oceanDepth.format.fps;
const seconds = (value: number) => value * fps;

const Hook = () => (
  <SceneWindow start={-1} end={seconds(3.25)} fadeIn={1} fadeOut={10}>
    <EverestInChallenger revealAt={-18} />
    <ShortSafeArea>
      <RevealText
        at={-8}
        eyebrow="THE DEEPEST OCEAN"
        style={{fontSize: 94, fontWeight: 700, lineHeight: 0.88, letterSpacing: '-0.065em'}}
      >
        EVEREST
        <br />
        WOULD
        <br />
        DISAPPEAR.
      </RevealText>
    </ShortSafeArea>
  </SceneWindow>
);

const Descent = () => {
  const frame = useCurrentFrame();
  const depth = frame < seconds(6.7)
    ? mix(0, 200, easeInOutCubic(progress(frame, seconds(2.7), seconds(6.7))))
    : frame < seconds(10.7)
      ? mix(200, 1000, easeInOutCubic(progress(frame, seconds(6.7), seconds(10.7))))
      : mix(1000, 3682, easeInOutCubic(progress(frame, seconds(10.7), seconds(15.8))));

  return (
    <SceneWindow start={seconds(2.55)} end={seconds(16.25)} fadeIn={8} fadeOut={12}>
      <OceanAtmosphere depth={depth} />
      <div
        style={{
          position: 'absolute',
          left: 82,
          top: 252,
          fontFamily: typography.body,
          fontWeight: 700,
          fontSize: 18,
          letterSpacing: '0.23em',
          color: '#a6c9da',
        }}
      >
        DESCENDING
      </div>
      <DepthGauge
        depth={depth}
        label={depth < 200 ? 'SUNLIGHT ZONE' : depth < 1000 ? 'TWILIGHT ZONE' : depth < 3600 ? 'NO SUNLIGHT' : 'AVERAGE OCEAN FLOOR'}
      />
      <SceneWindow start={seconds(2.65)} end={seconds(7.15)} fadeIn={8} fadeOut={8}>
        <ShortSafeArea>
          <RevealText at={seconds(2.85)} eyebrow="≈200 METERS" style={{fontSize: 76, fontWeight: 650, lineHeight: 0.92, marginTop: 30}}>
            SUNLIGHT
            <br />
            STARTS TO FADE
          </RevealText>
        </ShortSafeArea>
      </SceneWindow>
      <SceneWindow start={seconds(6.65)} end={seconds(11.15)} fadeIn={8} fadeOut={8}>
        <ShortSafeArea>
          <RevealText at={seconds(6.85)} eyebrow="≈1,000 METERS" style={{fontSize: 82, fontWeight: 650, lineHeight: 0.9, marginTop: 30}}>
            TOTAL
            <br />
            DARKNESS
          </RevealText>
        </ShortSafeArea>
      </SceneWindow>
      <SceneWindow start={seconds(10.65)} end={seconds(16.2)} fadeIn={8} fadeOut={8}>
        <ShortSafeArea>
          <RevealText at={seconds(10.9)} eyebrow="≈3,682 METERS" style={{fontSize: 78, fontWeight: 650, lineHeight: 0.91, marginTop: 30}}>
            THE AVERAGE
            <br />
            OCEAN DEPTH
          </RevealText>
        </ShortSafeArea>
      </SceneWindow>
    </SceneWindow>
  );
};

const Comparison = () => {
  const frame = useCurrentFrame();
  const enter = easeOutQuint(progress(frame, seconds(15.5), seconds(17.2)));
  const settle = easeInOutCubic(progress(frame, seconds(15.5), seconds(16.7)));
  const finalFade = progress(frame, seconds(31.55), seconds(32));
  return (
    <SceneWindow start={seconds(15.45)} end={seconds(32)} fadeIn={10} fadeOut={1}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: enter,
          transform: `scale(${mix(1.34, 1, settle)}) translateY(${mix(150, 0, settle)}px)`,
          transformOrigin: '50% 82%',
        }}
      >
        <EverestInChallenger revealAt={seconds(15.5)} />
      </div>
      <SceneWindow start={seconds(15.5)} end={seconds(20.1)} fadeIn={8} fadeOut={8}>
        <ShortSafeArea>
          <RevealText at={seconds(15.7)} eyebrow="NOW ADD" style={{fontSize: 94, fontWeight: 700, lineHeight: 0.88}}>
            MOUNT
            <br />
            EVEREST
          </RevealText>
        </ShortSafeArea>
      </SceneWindow>
      <SceneWindow start={seconds(19.75)} end={seconds(25.9)} fadeIn={8} fadeOut={10}>
        <ShortSafeArea>
          <RevealText at={seconds(19.95)} eyebrow="THE SUMMIT IS STILL" style={{fontSize: 92, fontWeight: 700, lineHeight: 0.9}}>
            2.1 KM
            <br />
            UNDERWATER
          </RevealText>
        </ShortSafeArea>
      </SceneWindow>
      <SceneWindow start={seconds(25.6)} end={seconds(31.9)} fadeIn={8} fadeOut={5}>
        <ShortSafeArea>
          <RevealText at={seconds(25.8)} eyebrow="THE DEEPEST POINT" style={{fontSize: 74, fontWeight: 700, lineHeight: 0.92}}>
            CHALLENGER
            <br />
            DEEP
          </RevealText>
          <RevealText
            at={seconds(28.2)}
            style={{
              fontFamily: typography.body,
              fontSize: 24,
              fontWeight: 700,
              letterSpacing: '0.12em',
              color: '#b4ccd7',
              marginTop: 32,
            }}
          >
            ≈10,935 M BELOW THE SURFACE
          </RevealText>
        </ShortSafeArea>
      </SceneWindow>
      <AbsoluteFill style={{backgroundColor: '#010309', opacity: finalFade}} />
    </SceneWindow>
  );
};

export const OceanDepth = () => (
  <AbsoluteFill style={{backgroundColor: '#010309'}}>
    <Audio src={staticFile(oceanDepth.audio.file)} volume={0.3} />
    {oceanDepth.audio.narrationCues.map((cue) => (
      <Sequence key={cue.id} from={Math.round(cue.start * fps)} layout="none">
        <Audio src={staticFile(cue.file)} volume={1} />
      </Sequence>
    ))}
    <Hook />
    <Descent />
    <Comparison />
    <Finish />
  </AbsoluteFill>
);
