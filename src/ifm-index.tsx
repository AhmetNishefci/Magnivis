import {Composition,registerRoot} from 'remotion';
import {InteractionFree} from './compositions/InteractionFree';
import narration from './production/narration/ifm.json';
const Root=()=> <Composition id="Magnivis-Interaction-Free" component={InteractionFree} width={1080} height={1920} fps={30} durationInFrames={narration.durationFrames} defaultProps={{inspectQa:false}}/>;
registerRoot(Root);
