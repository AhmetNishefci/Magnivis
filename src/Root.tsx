import {Composition} from 'remotion';
import {BillionDollars} from './compositions/BillionDollars';
import {EarthToStars} from './compositions/EarthToStars';
import {HumanEngineering} from './compositions/HumanEngineering';
import {OceanDepth} from './compositions/OceanDepth';
import {SpeedOfLight} from './compositions/SpeedOfLight';
import {billionDollars, billionDollarsFrames} from './content/videos/billion-dollars';
import {earthToStars, earthToStarsFrames} from './content/videos/earth-to-stars';
import {humanEngineering, humanEngineeringFrames} from './content/videos/human-engineering';
import {oceanDepth, oceanDepthFrames} from './content/videos/ocean-depth';
import {speedOfLight, speedOfLightFrames} from './content/videos/speed-of-light';

export const RemotionRoot = () => (
  <>
    <Composition
      id={earthToStars.compositionId}
      component={EarthToStars}
      durationInFrames={earthToStarsFrames}
      fps={earthToStars.format.fps}
      width={earthToStars.format.width}
      height={earthToStars.format.height}
    />
    <Composition
      id={oceanDepth.compositionId}
      component={OceanDepth}
      durationInFrames={oceanDepthFrames}
      fps={oceanDepth.format.fps}
      width={oceanDepth.format.width}
      height={oceanDepth.format.height}
    />
    <Composition
      id={billionDollars.compositionId}
      component={BillionDollars}
      durationInFrames={billionDollarsFrames}
      fps={billionDollars.format.fps}
      width={billionDollars.format.width}
      height={billionDollars.format.height}
    />
    <Composition
      id={speedOfLight.compositionId}
      component={SpeedOfLight}
      durationInFrames={speedOfLightFrames}
      fps={speedOfLight.format.fps}
      width={speedOfLight.format.width}
      height={speedOfLight.format.height}
    />
    <Composition
      id={humanEngineering.compositionId}
      component={HumanEngineering}
      durationInFrames={humanEngineeringFrames}
      fps={humanEngineering.format.fps}
      width={humanEngineering.format.width}
      height={humanEngineering.format.height}
    />
  </>
);
