import {Composition,registerRoot} from 'remotion';
import {HeatBarrierV4} from './compositions/HeatBarrierV4';
import narration from './production/narration/heat-v4.json';
const Root=()=> <Composition id="Magnivis-Heat-Barrier-V4" component={HeatBarrierV4} width={1080} height={1920} fps={30} durationInFrames={narration.durationFrames} defaultProps={{inspectQa:false}}/>;
registerRoot(Root);
