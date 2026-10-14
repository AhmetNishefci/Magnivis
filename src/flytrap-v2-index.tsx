import {Composition,registerRoot} from 'remotion';
import {FlytrapMemoryV2} from './compositions/FlytrapMemoryV2';
import narration from './production/narration/flytrap.json';
const Root=()=> <Composition id="Magnivis-Flytrap-Memory-V2" component={FlytrapMemoryV2} width={1080} height={1920} fps={30} durationInFrames={narration.durationFrames} defaultProps={{inspectQa:false}}/>;
registerRoot(Root);
