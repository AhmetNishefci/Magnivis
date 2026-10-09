import {Composition,registerRoot} from 'remotion';
import {VermeerForgeryV2} from './compositions/VermeerForgeryV2';
import narration from './production/narration/vermeer-forgery.json';
const Root=()=> <Composition id="Magnivis-Vermeer-Forgery-V2" component={VermeerForgeryV2} width={1080} height={1920} fps={30} durationInFrames={narration.durationFrames} defaultProps={{inspectQa:false}}/>;
registerRoot(Root);
