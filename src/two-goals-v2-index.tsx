import {Composition,registerRoot} from 'remotion';
import {TwoGoalsV2} from './compositions/TwoGoalsV2';
import narration from './production/narration/two-goals-v2.json';
const Root=()=> <Composition id="Magnivis-Two-Goals-V2" component={TwoGoalsV2} width={1080} height={1920} fps={30} durationInFrames={narration.durationFrames} defaultProps={{inspectQa:false}}/>;
registerRoot(Root);
