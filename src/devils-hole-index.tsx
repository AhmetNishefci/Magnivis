import {Composition,registerRoot} from 'remotion';
import {DevilsHole} from './compositions/DevilsHole';
import narration from './production/narration/devils-hole.json';
const Root=()=> <Composition id="Magnivis-Devils-Hole" component={DevilsHole} width={1080} height={1920} fps={30} durationInFrames={narration.durationFrames} defaultProps={{inspectQa:false}}/>;
registerRoot(Root);
