import {Audio} from '@remotion/media';
import {AbsoluteFill, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {ColdForest, CardiacTrace, CellDehydrationDiagram, CryoprotectantDiagram, ExtracellularTissue, ProceduralWoodFrog, RecoveryIndicators} from '../components/WoodFrogWorld';
import {Finish} from '../components/Finish';
import {MagnivisCaptionRenderer} from '../components/MagnivisCaptionRenderer';
import {SceneWindow} from '../components/SceneWindow';
import {ScientificLabel} from '../components/ScientificDiagram';
import {ShortSafeArea} from '../components/ShortSafeArea';
import {RevealText} from '../components/Typography';
import {woodFrog} from '../content/videos/wood-frog';
import {woodFrogCaptionPlan} from '../captions/plans/wood-frog';
import {safeAreaProfileIds, safeAreaProfileRegistry} from '../design/safe-areas';
import {palette, typography} from '../design/tokens';
import {easeInOutCubic, easeOutQuint, progress} from '../utils/math';

const fps = woodFrog.format.fps;
const seconds = (value: number) => value * fps;
type WoodFrogLayoutProps = {
  safeAreaProfileId?: string;
};

const Hook = ({safeAreaProfileId}: Required<WoodFrogLayoutProps>) => {
  const frame = useCurrentFrame();
  const freeze = easeInOutCubic(progress(frame, seconds(0.35), seconds(4.75)));
  const stopped = easeOutQuint(progress(frame, seconds(2.2), seconds(4.7)));
  return (
    <SceneWindow start={-1} end={seconds(5.2)} fadeIn={1} fadeOut={1}>
      <ColdForest />
      <ShortSafeArea profileId={safeAreaProfileId}>
        <RevealText at={-16} eyebrow="SURVIVABLE FREEZE" style={{fontSize: 88, fontWeight: 700, lineHeight: 0.89, letterSpacing: '-0.055em', maxWidth: 775}}>
          ITS HEARTBEAT
          <br />CAN STOP
        </RevealText>
      </ShortSafeArea>
      <ProceduralWoodFrog idPrefix="hook" freezeAmount={freeze} style={{left: 176, top: 460, width: 700, height: 500, transform: `scale(${1 + freeze * 0.025})`}} />
      <div style={{position: 'absolute', left: 500, top: 885, opacity: 0.28 + stopped * 0.5}}>
        <ScientificLabel tone="ice">Nonlethal freezing</ScientificLabel>
      </div>
      <CardiacTrace amount={freeze} stopped={stopped} />
    </SceneWindow>
  );
};

const OutsideCells = ({safeAreaProfileId}: Required<WoodFrogLayoutProps>) => {
  const frame = useCurrentFrame();
  const amount = easeOutQuint(progress(frame, seconds(5.25), seconds(9.25)));
  return (
    <SceneWindow start={seconds(5.2)} end={seconds(9.4)} fadeIn={1} fadeOut={1}>
      <ColdForest />
      <ShortSafeArea profileId={safeAreaProfileId}>
        <RevealText at={seconds(5)} eyebrow="MUCH OF ITS BODY WATER" style={{fontSize: 82, fontWeight: 700, lineHeight: 0.88, letterSpacing: '-0.05em'}}>
          ICE FORMS
          <br /><span style={{color: '#a9e8fb'}}>OUTSIDE CELLS</span>
        </RevealText>
      </ShortSafeArea>
      <ExtracellularTissue amount={amount} />
    </SceneWindow>
  );
};

const WaterLeavesCells = ({safeAreaProfileId}: Required<WoodFrogLayoutProps>) => {
  const frame = useCurrentFrame();
  const amount = easeInOutCubic(progress(frame, seconds(9.75), seconds(16.8)));
  return (
    <SceneWindow start={seconds(9.4)} end={seconds(17.8)} fadeIn={1} fadeOut={1}>
      <ColdForest />
      <ShortSafeArea profileId={safeAreaProfileId}>
        <RevealText at={seconds(9.5)} eyebrow="AS EXTRACELLULAR ICE GROWS" style={{fontSize: 83, fontWeight: 700, lineHeight: 0.9, letterSpacing: '-0.05em'}}>
          WATER
          <br />MOVES OUT
        </RevealText>
      </ShortSafeArea>
      <CellDehydrationDiagram amount={amount} />
    </SceneWindow>
  );
};

const TwoDefenses = ({safeAreaProfileId}: Required<WoodFrogLayoutProps>) => {
  const frame = useCurrentFrame();
  const amount = easeInOutCubic(progress(frame, seconds(18), seconds(28.55)));
  return (
    <SceneWindow start={seconds(17.8)} end={seconds(28.6)} fadeIn={1} fadeOut={1}>
      <ColdForest />
      <ShortSafeArea profileId={safeAreaProfileId}>
        <RevealText at={seconds(17.75)} eyebrow="TWO CRYOPROTECTANTS" style={{fontSize: 78, fontWeight: 700, lineHeight: 0.9, letterSpacing: '-0.05em'}}>
          DIFFERENT
          <br />TIMING
        </RevealText>
      </ShortSafeArea>
      <CryoprotectantDiagram amount={amount} />
    </SceneWindow>
  );
};

const Recovery = ({safeAreaProfileId}: Required<WoodFrogLayoutProps>) => {
  const frame = useCurrentFrame();
  const {insets} = safeAreaProfileRegistry.get(safeAreaProfileId);
  const amount = easeInOutCubic(progress(frame, seconds(28.75), seconds(37.1)));
  const final = easeOutQuint(progress(frame, seconds(35.4), seconds(38.2)));
  return (
    <SceneWindow start={seconds(28.6)} end={seconds(40)} fadeIn={1} fadeOut={1}>
      <ColdForest thaw={amount} />
      <ShortSafeArea profileId={safeAreaProfileId}>
        <RevealText at={seconds(28.6)} eyebrow="DURING THAWING" style={{fontSize: 76, fontWeight: 700, lineHeight: 0.9, letterSpacing: '-0.05em', opacity: 1 - final}}>
          FUNCTION
          <br />RETURNS IN ORDER
        </RevealText>
      </ShortSafeArea>
      <ProceduralWoodFrog idPrefix="recovery" freezeAmount={1} thawAmount={amount} legReflex={Math.max(0, (amount - 0.75) / 0.25)} style={{left: 170, top: 500, width: 710, height: 510, transform: `translateY(${(1 - amount) * 8}px)`}} />
      <RecoveryIndicators amount={amount} />
      <div style={{position: 'absolute', left: insets.left, right: insets.right, top: insets.top, opacity: final, transform: `translateY(${(1 - final) * 28}px)`}}>
        <div style={{fontFamily: typography.body, fontSize: 20, fontWeight: 700, letterSpacing: '0.21em', color: '#8fc9ff', marginBottom: 18}}>THE PAYOFF</div>
        <div style={{fontFamily: typography.display, fontSize: 79, fontWeight: 700, lineHeight: 0.89, letterSpacing: '-0.055em', color: palette.ink}}>
          IT CONTROLLED
          <br /><span style={{color: palette.gold}}>THE FREEZE</span>
        </div>
      </div>
      <div style={{position: 'absolute', left: 84, bottom: 308, opacity: final, color: palette.muted, fontFamily: typography.body, fontSize: 17, fontWeight: 700, letterSpacing: '0.18em'}}>MAGNIVIS · EXPLANATORY VISUALIZATION</div>
    </SceneWindow>
  );
};

export const WoodFrog = ({
  safeAreaProfileId = safeAreaProfileIds.verticalShortMaster,
}: WoodFrogLayoutProps) => {
  const layout = {safeAreaProfileId};
  return (
    <AbsoluteFill style={{backgroundColor: '#02070d'}}>
      <Audio src={staticFile(woodFrog.audio.file)} volume={0.32} />
      {woodFrog.audio.narrationCues.map((cue) => (
        <Sequence key={cue.id} from={Math.round(cue.start * fps)} layout="none">
          <Audio src={staticFile(cue.file)} volume={1} />
        </Sequence>
      ))}
      <Hook {...layout} />
      <OutsideCells {...layout} />
      <WaterLeavesCells {...layout} />
      <TwoDefenses {...layout} />
      <Recovery {...layout} />
      <Finish />
      <MagnivisCaptionRenderer plan={woodFrogCaptionPlan} safeAreaProfileId={safeAreaProfileId} />
    </AbsoluteFill>
  );
};
