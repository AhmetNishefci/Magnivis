import {Composition,registerRoot} from 'remotion';
import {HeatBarrier} from './compositions/HeatBarrier';
import narration from './production/narration/heat.json';
const Root=()=> <Composition id="Magnivis-Heat-Barrier" component={HeatBarrier} width={1080} height={1920} fps={30} durationInFrames={narration.durationFrames} defaultProps={{inspectQa:false}}/>;
registerRoot(Root);
