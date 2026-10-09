import {Composition,registerRoot} from 'remotion';
import {VermeerForgery} from './compositions/VermeerForgery';
import narration from './production/narration/vermeer-forgery.json';
const Root=()=> <Composition id="Magnivis-Vermeer-Forgery" component={VermeerForgery} width={1080} height={1920} fps={30} durationInFrames={narration.durationFrames} defaultProps={{inspectQa:false}}/>;
registerRoot(Root);
