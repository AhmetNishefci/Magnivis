import {Composition,registerRoot} from 'remotion';
import {TwoGoals} from './compositions/TwoGoals';
import narration from './production/narration/two-goals.json';
const Root=()=> <Composition id="Magnivis-Two-Goals" component={TwoGoals} width={1080} height={1920} fps={30} durationInFrames={narration.durationFrames} defaultProps={{inspectQa:false}}/>;
registerRoot(Root);
