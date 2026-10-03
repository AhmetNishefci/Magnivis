import {Composition,registerRoot} from 'remotion';
import {TallyFire} from './compositions/TallyFire';
import narration from './production/narration/tally.json';
const Root=()=> <Composition id="Magnivis-Tally-Fire" component={TallyFire} width={1080} height={1920} fps={30} durationInFrames={narration.durationFrames} defaultProps={{inspectQa:false}}/>;
registerRoot(Root);
