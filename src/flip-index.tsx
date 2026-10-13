import {Composition,registerRoot} from 'remotion';
import {FlipLaboratory} from './compositions/FlipLaboratory';
import narration from './production/narration/flip.json';
const Root=()=> <Composition id="Magnivis-FLIP-Laboratory" component={FlipLaboratory} width={1080} height={1920} fps={30} durationInFrames={narration.durationFrames} defaultProps={{inspectQa:false}}/>;
registerRoot(Root);
