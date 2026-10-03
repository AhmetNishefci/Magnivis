import {Composition,registerRoot} from 'remotion';
import {SealedScroll} from './compositions/SealedScroll';
import narration from './production/narration/scroll.json';
const Root=()=> <Composition id="Magnivis-Sealed-Scroll" component={SealedScroll} width={1080} height={1920} fps={30} durationInFrames={narration.durationFrames} defaultProps={{inspectQa:false}}/>;
registerRoot(Root);
