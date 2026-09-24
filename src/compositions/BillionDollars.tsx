import {Audio} from '@remotion/media';
import {AbsoluteFill, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {BillionBlock, MillionStack, MoneyAtmosphere, PersonSilhouette, StylizedNote, TowerComparison} from '../components/MoneyWorld';
import {Finish} from '../components/Finish';
import {SceneWindow} from '../components/SceneWindow';
import {ShortSafeArea} from '../components/ShortSafeArea';
import {RevealText} from '../components/Typography';
import {billionDollars} from '../content/videos/billion-dollars';
import {moneyScale} from '../data/money';
import {palette, typography} from '../design/tokens';
import {easeInOutCubic, easeOutQuint, mix, progress} from '../utils/math';

const fps = billionDollars.format.fps;
const seconds = (value: number) => value * fps;

const Hook = () => {
  const frame = useCurrentFrame();
  const amount = easeOutQuint(progress(frame, 0, seconds(1.15)));
  return (
    <SceneWindow start={0} end={seconds(3.45)} fadeIn={3} fadeOut={10}>
      <MoneyAtmosphere />
      <BillionBlock amount={amount} />
      <PersonSilhouette left={94} bottom={600} height={420} />
      <ShortSafeArea>
        <RevealText at={1} eyebrow="IN $100 BILLS" style={{fontSize: 94, fontWeight: 700, lineHeight: 0.88, letterSpacing: '-0.06em'}}>
          THIS IS
          <br />
          $1 BILLION.
        </RevealText>
      </ShortSafeArea>
    </SceneWindow>
  );
};

const NoteCount = () => {
  const frame = useCurrentFrame();
  const amount = easeOutQuint(progress(frame, seconds(2.85), seconds(4.1)));
  const countAmount = easeInOutCubic(progress(frame, seconds(3.2), seconds(6.2)));
  const count = Math.round(mix(1, moneyScale.billionNoteCount, countAmount));
  return (
    <SceneWindow start={seconds(2.75)} end={seconds(8.25)} fadeIn={10} fadeOut={10}>
      <MoneyAtmosphere intensity={0.75} />
      <StylizedNote
        width={760}
        style={{
          left: 160,
          top: 750,
          opacity: amount,
          transform: `perspective(1000px) rotateX(${mix(36, 18, amount)}deg) rotateZ(-6deg) translateY(${mix(110, 0, amount)}px)`,
        }}
      />
      <ShortSafeArea>
        <RevealText at={seconds(2.95)} eyebrow="$100 EACH" style={{fontSize: 74, fontWeight: 650, lineHeight: 0.94}}>
          {count.toLocaleString('en-US')}
          <br />
          NOTES
        </RevealText>
      </ShortSafeArea>
    </SceneWindow>
  );
};

const Million = () => {
  const frame = useCurrentFrame();
  const amount = progress(frame, seconds(7.55), seconds(10.4));
  return (
    <SceneWindow start={seconds(7.35)} end={seconds(13.25)} fadeIn={10} fadeOut={12}>
      <MoneyAtmosphere intensity={0.65} />
      <MillionStack amount={amount} />
      <PersonSilhouette left={735} bottom={292} height={530} />
      <ShortSafeArea>
        <RevealText at={seconds(7.65)} eyebrow="10,000 NOTES" style={{fontSize: 92, fontWeight: 700, lineHeight: 0.9}}>
          $1 MILLION
        </RevealText>
      </ShortSafeArea>
    </SceneWindow>
  );
};

const Block = () => {
  const frame = useCurrentFrame();
  const amount = progress(frame, seconds(12.1), seconds(14));
  return (
    <SceneWindow start={seconds(12)} end={seconds(19.8)} fadeIn={12} fadeOut={12}>
      <MoneyAtmosphere />
      <BillionBlock amount={amount} />
      <ShortSafeArea>
        <RevealText at={seconds(12.3)} eyebrow="1,000 MILLION-DOLLAR STACKS" style={{fontSize: 84, fontWeight: 700, lineHeight: 0.9}}>
          ONE
          <br />
          BILLION
        </RevealText>
      </ShortSafeArea>
      <div style={{position: 'absolute', left: 84, bottom: 190, color: '#b3c5ad', fontFamily: typography.body, fontSize: 17, fontWeight: 800, letterSpacing: '0.16em'}}>
        ≈{moneyScale.blockWidthM.toFixed(1)} × {moneyScale.blockDepthM.toFixed(1)} × {moneyScale.millionStackHeightM.toFixed(1)} M
      </div>
    </SceneWindow>
  );
};

const Weight = () => {
  const frame = useCurrentFrame();
  const impact = easeOutQuint(progress(frame, seconds(18.25), seconds(19.1)));
  return (
    <SceneWindow start={seconds(18)} end={seconds(25)} fadeIn={10} fadeOut={12}>
      <MoneyAtmosphere intensity={0.9} />
      <div style={{position: 'absolute', inset: 0, transform: `translateY(${mix(-40, 70, impact)}px) scale(${mix(1.08, 0.84, impact)})`, transformOrigin: '50% 68%'}}>
        <BillionBlock amount={1} />
      </div>
      <ShortSafeArea>
        <RevealText at={seconds(18.2)} eyebrow="APPROXIMATE MASS" style={{fontSize: 126, fontWeight: 700, lineHeight: 0.78, letterSpacing: '-0.07em'}}>
          10
          <br />
          TONNES
        </RevealText>
      </ShortSafeArea>
    </SceneWindow>
  );
};

const Tower = () => {
  const frame = useCurrentFrame();
  const amount = progress(frame, seconds(23.5), seconds(27.6));
  return (
    <SceneWindow start={seconds(23.25)} end={seconds(32.55)} fadeIn={12} fadeOut={12}>
      <MoneyAtmosphere intensity={0.58} />
      <TowerComparison amount={amount} />
      <ShortSafeArea>
        <RevealText at={seconds(23.5)} eyebrow="ONE SINGLE STACK" style={{fontSize: 78, fontWeight: 700, lineHeight: 0.92}}>
          HIGHER THAN
          <br />
          BURJ KHALIFA
        </RevealText>
      </ShortSafeArea>
    </SceneWindow>
  );
};

const Coda = () => {
  const frame = useCurrentFrame();
  const fade = progress(frame, seconds(34.55), seconds(35));
  return (
    <SceneWindow start={seconds(31.85)} end={seconds(35)} fadeIn={10} fadeOut={1}>
      <MoneyAtmosphere intensity={0.45} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 650, textAlign: 'center', color: '#d6b86f', fontFamily: typography.display, fontSize: 132, fontWeight: 700, letterSpacing: '-0.065em'}}>
        $1,000,000,000
      </div>
      <ShortSafeArea>
        <RevealText at={seconds(32.05)} eyebrow="10,000,000 PIECES OF PAPER" style={{fontSize: 86, fontWeight: 700, lineHeight: 0.9}}>
          ONE
          <br />
          BILLION DOLLARS
        </RevealText>
      </ShortSafeArea>
      <AbsoluteFill style={{backgroundColor: palette.void, opacity: fade}} />
    </SceneWindow>
  );
};

export const BillionDollars = () => (
  <AbsoluteFill style={{backgroundColor: '#010302'}}>
    <Audio src={staticFile(billionDollars.audio.file)} volume={0.32} />
    {billionDollars.audio.narrationCues.map((cue) => (
      <Sequence key={cue.id} from={Math.round(cue.start * fps)} layout="none">
        <Audio src={staticFile(cue.file)} volume={1} />
      </Sequence>
    ))}
    <Hook />
    <NoteCount />
    <Million />
    <Block />
    <Weight />
    <Tower />
    <Coda />
    <Finish />
  </AbsoluteFill>
);
