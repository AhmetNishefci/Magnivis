import {Composition,registerRoot} from 'remotion';
import {OkloRevisedV5} from './compositions/OkloRevisedV5';
import narration from './production/narration/oklo-v4-r2.json';
const Root=()=> <Composition id="Magnivis-Oklo-V5" component={OkloRevisedV5} width={1080} height={1920} fps={30} durationInFrames={narration.durationFrames} defaultProps={{inspectQa:false}}/>;
registerRoot(Root);
