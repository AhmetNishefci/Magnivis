import {Audio} from '@remotion/media';
import {AbsoluteFill, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {BackgroundStars} from '../components/BackgroundStars';
import {CelestialBody} from '../components/CelestialBody';
import {Finish} from '../components/Finish';
import {SceneWindow} from '../components/SceneWindow';
import {ShortSafeArea} from '../components/ShortSafeArea';
import {Metric, RevealText} from '../components/Typography';
import {earthToStars} from '../content/videos/earth-to-stars';
import {scaleRatios} from '../data/astronomy';
import {palette, typography} from '../design/tokens';
import {easeInOutCubic, easeOutQuint, mix, progress} from '../utils/math';

const fps = earthToStars.format.fps;
const seconds = (value: number) => value * fps;

const Hook = () => {
  const frame = useCurrentFrame();
  const zoom = easeOutQuint(progress(frame, 0, seconds(2.5)));
  const size = mix(1780, 1260, zoom);
  return (
    <SceneWindow start={0} end={seconds(2.7)} fadeIn={5} fadeOut={10}>
      <CelestialBody kind="earth" diameter={size} centerX={540} centerY={1330} rotationSpeed={0.012} />
      <ShortSafeArea>
        <RevealText at={2} style={{fontSize: 112, fontWeight: 700, lineHeight: 0.91, letterSpacing: '-0.065em'}}>
          EARTH
          <br />
          IS HUGE.
        </RevealText>
        <RevealText
          at={seconds(1.15)}
          style={{fontFamily: typography.body, fontSize: 31, fontWeight: 600, letterSpacing: '0.04em', marginTop: 36}}
        >
          Until you see this.
        </RevealText>
      </ShortSafeArea>
    </SceneWindow>
  );
};

const Earth = () => {
  const frame = useCurrentFrame();
  const amount = easeInOutCubic(progress(frame, seconds(2), seconds(8)));
  return (
    <SceneWindow start={seconds(2)} end={seconds(8.15)} fadeIn={12} fadeOut={16}>
      <CelestialBody
        kind="earth"
        diameter={mix(1120, 390, amount)}
        centerX={mix(510, 560, amount)}
        centerY={mix(1190, 920, amount)}
        rotationSpeed={0.018}
      />
      <ShortSafeArea>
        <RevealText at={seconds(2.7)} eyebrow="OUR REFERENCE" style={{fontSize: 74, fontWeight: 600, lineHeight: 1}}>
          A WORLD
          <br />
          12,742 KM WIDE
        </RevealText>
      </ShortSafeArea>
      <Metric at={seconds(5.4)} label="VOLUMETRIC MEAN DIAMETER" value="EARTH · 1×" />
    </SceneWindow>
  );
};

const Jupiter = () => {
  const frame = useCurrentFrame();
  const amount = easeInOutCubic(progress(frame, seconds(7.2), seconds(14.7)));
  const jupiter = mix(2380, 610, amount);
  const earth = jupiter / scaleRatios.jupiterToEarth;
  return (
    <SceneWindow start={seconds(7)} end={seconds(15.2)} fadeIn={16} fadeOut={14}>
      <CelestialBody
        kind="jupiter"
        diameter={jupiter}
        centerX={mix(210, 410, amount)}
        centerY={mix(1130, 980, amount)}
        rotationSpeed={-0.004}
      />
      <CelestialBody
        kind="earth"
        diameter={earth}
        centerX={mix(900, 820, amount)}
        centerY={mix(1010, 1040, amount)}
        rotationSpeed={0.018}
      />
      <ShortSafeArea>
        <RevealText at={seconds(8.2)} eyebrow="THEN COMES" style={{fontSize: 92, fontWeight: 650, lineHeight: 0.9}}>
          JUPITER
        </RevealText>
      </ShortSafeArea>
      <Metric at={seconds(11.4)} label="MEAN RADIUS COMPARISON" value="≈11× EARTH" accent="#e5b583" />
    </SceneWindow>
  );
};

const Sun = () => {
  const frame = useCurrentFrame();
  const amount = easeInOutCubic(progress(frame, seconds(14.2), seconds(22.6)));
  const sun = mix(2460, 650, amount);
  const jupiter = sun / scaleRatios.sunToJupiter;
  const earth = jupiter / scaleRatios.jupiterToEarth;
  return (
    <SceneWindow start={seconds(14)} end={seconds(23.15)} fadeIn={16} fadeOut={16}>
      <CelestialBody kind="sun" diameter={sun} centerX={mix(890, 470, amount)} centerY={mix(1110, 950, amount)} />
      <CelestialBody
        kind="jupiter"
        diameter={jupiter}
        centerX={mix(145, 856, amount)}
        centerY={mix(1080, 970, amount)}
        rotationSpeed={-0.004}
      />
      <CelestialBody
        kind="earth"
        diameter={earth}
        centerX={mix(70, 934, amount)}
        centerY={mix(1080, 970, amount)}
        emphasizeTiny
      />
      <ShortSafeArea>
        <RevealText at={seconds(15.4)} eyebrow="OUR STAR" style={{fontSize: 98, fontWeight: 650, lineHeight: 0.9}}>
          THE SUN
        </RevealText>
      </ShortSafeArea>
      <Metric at={seconds(18.5)} label="MEAN RADIUS COMPARISON" value="≈10× JUPITER" accent={palette.gold} />
    </SceneWindow>
  );
};

const Rigel = () => {
  const frame = useCurrentFrame();
  const amount = easeInOutCubic(progress(frame, seconds(22.2), seconds(29.7)));
  const rigel = mix(2440, 760, amount);
  const sun = rigel / scaleRatios.rigelToSun;
  return (
    <SceneWindow start={seconds(22)} end={seconds(30.2)} fadeIn={16} fadeOut={14}>
      <CelestialBody kind="rigel" diameter={rigel} centerX={mix(180, 430, amount)} centerY={mix(1120, 955, amount)} />
      <CelestialBody kind="sun" diameter={sun} centerX={mix(890, 865, amount)} centerY={995} emphasizeTiny />
      <ShortSafeArea>
        <RevealText at={seconds(23.2)} eyebrow="A BLUE SUPERGIANT" style={{fontSize: 102, fontWeight: 650, lineHeight: 0.88}}>
          RIGEL
        </RevealText>
      </ShortSafeArea>
      <Metric at={seconds(26)} label="APPROXIMATE STELLAR RADIUS" value="≈50× THE SUN" accent="#91c8ff" />
    </SceneWindow>
  );
};

const Betelgeuse = () => {
  const frame = useCurrentFrame();
  const amount = easeInOutCubic(progress(frame, seconds(29.1), seconds(38.6)));
  const body = mix(2740, 880, amount);
  const rigel = body / (scaleRatios.betelgeuseToSun / scaleRatios.rigelToSun);
  const sun = body / scaleRatios.betelgeuseToSun;
  return (
    <SceneWindow start={seconds(29)} end={seconds(39.1)} fadeIn={15} fadeOut={14}>
      <CelestialBody kind="betelgeuse" diameter={body} centerX={mix(900, 480, amount)} centerY={mix(1160, 970, amount)} />
      <CelestialBody kind="rigel" diameter={rigel} centerX={mix(95, 858, amount)} centerY={990} emphasizeTiny />
      <CelestialBody kind="sun" diameter={sun} centerX={mix(30, 950, amount)} centerY={990} emphasizeTiny />
      <ShortSafeArea>
        <RevealText at={seconds(30)} eyebrow="A RED SUPERGIANT" style={{fontSize: 82, fontWeight: 650, lineHeight: 0.88, letterSpacing: '-0.055em'}}>
          BETELGEUSE
        </RevealText>
      </ShortSafeArea>
      <Metric at={seconds(33.4)} label="ESTIMATED STELLAR RADIUS" value="≈724× THE SUN" accent={palette.ember} />
    </SceneWindow>
  );
};

const Coda = () => {
  const frame = useCurrentFrame();
  const amount = easeOutQuint(progress(frame, seconds(38), seconds(41.5)));
  const endFade = progress(frame, seconds(41.55), seconds(42));
  return (
    <SceneWindow start={seconds(38)} end={seconds(42)} fadeIn={12} fadeOut={1}>
      <CelestialBody
        kind="betelgeuse"
        diameter={mix(920, 245, amount)}
        centerX={mix(485, 540, amount)}
        centerY={mix(990, 760, amount)}
      />
      <ShortSafeArea>
        <RevealText
          at={seconds(38.65)}
          align="center"
          style={{fontSize: 74, fontWeight: 650, lineHeight: 0.96, marginTop: 790, marginLeft: -34, width: 760}}
        >
          AND THAT'S
          <br />
          JUST ONE STAR.
        </RevealText>
        <RevealText
          at={seconds(40.35)}
          align="center"
          style={{fontFamily: typography.body, fontSize: 20, fontWeight: 700, letterSpacing: '0.28em', color: palette.muted, marginTop: 46, marginLeft: -34, width: 760}}
        >
          MAGNIVIS · SEE THE UNIMAGINABLE
        </RevealText>
      </ShortSafeArea>
      <AbsoluteFill style={{backgroundColor: palette.void, opacity: endFade}} />
    </SceneWindow>
  );
};

export const EarthToStars = () => (
  <AbsoluteFill style={{backgroundColor: palette.void}}>
    <BackgroundStars />
    <Audio src={staticFile(earthToStars.audio.file)} volume={0.34} />
    {earthToStars.audio.narrationCues.map((cue) => (
      <Sequence key={cue.id} from={Math.round(cue.start * fps)} layout="none">
        <Audio src={staticFile(cue.file)} volume={1} />
      </Sequence>
    ))}
    <Hook />
    <Earth />
    <Jupiter />
    <Sun />
    <Rigel />
    <Betelgeuse />
    <Coda />
    <Finish />
  </AbsoluteFill>
);
