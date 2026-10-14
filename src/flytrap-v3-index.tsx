import {Composition,registerRoot} from 'remotion';
import {FlytrapMemoryV3} from './compositions/FlytrapMemoryV3';
import narration from './production/narration/flytrap.json';
const Root=()=> <Composition id="Magnivis-Flytrap-Memory-V3" component={FlytrapMemoryV3} width={1080} height={1920} fps={30} durationInFrames={narration.durationFrames} defaultProps={{inspectQa:false}}/>;
registerRoot(Root);
