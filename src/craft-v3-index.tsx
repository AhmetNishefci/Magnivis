import {Composition,registerRoot} from 'remotion';
import {CraftEscapeV3} from './compositions/CraftEscapeV3';
import narration from './production/narration/craft-escape-v2.json';
const Root=()=> <Composition id="Magnivis-Craft-Escape-V3" component={CraftEscapeV3} width={1080} height={1920} fps={30} durationInFrames={narration.durationFrames} defaultProps={{inspectQa:false}}/>;
registerRoot(Root);
