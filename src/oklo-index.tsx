import {Composition,registerRoot} from 'remotion';
import {Oklo} from './compositions/Oklo';
import narration from './production/narration/oklo.json';
const Root=()=> <Composition id="Magnivis-Oklo" component={Oklo} width={1080} height={1920} fps={30} durationInFrames={narration.durationFrames} defaultProps={{inspectQa:false}}/>;
registerRoot(Root);
