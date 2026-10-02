import {Composition,registerRoot} from 'remotion';
import {ChladniSand} from './compositions/ChladniSand';
import narration from './production/narration/chladni.json';
const Root=()=> <Composition id="Magnivis-Chladni-Sand" component={ChladniSand} width={1080} height={1920} fps={30} durationInFrames={narration.durationFrames} defaultProps={{inspectQa:false}}/>;
registerRoot(Root);
