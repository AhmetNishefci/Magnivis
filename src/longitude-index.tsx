import {Composition,registerRoot} from 'remotion';
import {LongitudeClock} from './compositions/LongitudeClock';
import metadata from './production/narration/longitude-clock.json';
// Story-specific entry preserves every historical composition/root byte.
const Root=()=> <Composition id="Magnivis-Longitude-Clock" component={LongitudeClock} width={1080} height={1920} fps={30} durationInFrames={metadata.durationFrames} defaultProps={{inspectQa:false}}/>;
registerRoot(Root);
