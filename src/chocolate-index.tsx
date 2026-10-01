import {Composition,registerRoot} from 'remotion';
import {Chocolate} from './compositions/Chocolate';
import metadata from './production/narration/chocolate.json';
const Root=()=> <Composition id="Magnivis-Chocolate-Material-Cutaway" component={Chocolate} width={1080} height={1920} fps={30} durationInFrames={metadata.durationFrames} defaultProps={{inspectQa:false}}/>;
registerRoot(Root);
