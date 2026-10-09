import {Composition,registerRoot} from 'remotion';
import {CraftEscape} from './compositions/CraftEscape';
import narration from './production/narration/craft-escape.json';
const Root=()=> <Composition id="Magnivis-Craft-Escape" component={CraftEscape} width={1080} height={1920} fps={30} durationInFrames={narration.durationFrames} defaultProps={{inspectQa:false}}/>;
registerRoot(Root);
