import {Composition,registerRoot} from 'remotion';
import {DevilsHoleV2} from './compositions/DevilsHoleV2';
import narration from './production/narration/devils-hole.json';
const Root=()=> <Composition id="Magnivis-Devils-Hole-V2" component={DevilsHoleV2} width={1080} height={1920} fps={30} durationInFrames={narration.durationFrames} defaultProps={{inspectQa:false}}/>;
registerRoot(Root);
