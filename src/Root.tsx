import {Composition} from 'remotion';
import {EarthToStars} from './compositions/EarthToStars';
import {earthToStars, earthToStarsFrames} from './content/videos/earth-to-stars';

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
  </>
);

