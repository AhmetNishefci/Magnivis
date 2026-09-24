import {Composition} from 'remotion';
import {BillionDollars} from './compositions/BillionDollars';
import {EarthToStars} from './compositions/EarthToStars';
import {OceanDepth} from './compositions/OceanDepth';
import {billionDollars, billionDollarsFrames} from './content/videos/billion-dollars';
import {earthToStars, earthToStarsFrames} from './content/videos/earth-to-stars';
import {oceanDepth, oceanDepthFrames} from './content/videos/ocean-depth';

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
  </>
);
