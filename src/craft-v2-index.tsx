import {Composition,registerRoot} from 'remotion';
import {CraftEscapeV2} from './compositions/CraftEscapeV2';
import narration from './production/narration/craft-escape-v2.json';
const Root=()=> <Composition id="Magnivis-Craft-Escape-V2" component={CraftEscapeV2} width={1080} height={1920} fps={30} durationInFrames={narration.durationFrames} defaultProps={{inspectQa:false}}/>;
registerRoot(Root);
