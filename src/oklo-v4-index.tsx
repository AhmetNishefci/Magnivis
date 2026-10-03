import {Composition,registerRoot} from 'remotion';
import {OkloRevised} from './compositions/OkloRevised';
import narration from './production/narration/oklo-v4-r2.json';
const Root=()=> <Composition id="Magnivis-Oklo-V4" component={OkloRevised} width={1080} height={1920} fps={30} durationInFrames={narration.durationFrames} defaultProps={{inspectQa:false}}/>;
registerRoot(Root);
