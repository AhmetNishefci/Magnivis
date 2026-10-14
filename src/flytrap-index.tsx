import {Composition,registerRoot} from 'remotion';
import {FlytrapMemory} from './compositions/FlytrapMemory';
import narration from './production/narration/flytrap.json';
const Root=()=> <Composition id="Magnivis-Flytrap-Memory" component={FlytrapMemory} width={1080} height={1920} fps={30} durationInFrames={narration.durationFrames} defaultProps={{inspectQa:false}}/>;
registerRoot(Root);
