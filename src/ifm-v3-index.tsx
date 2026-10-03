import {Composition,registerRoot} from 'remotion';
import {InteractionFreeV3} from './compositions/InteractionFreeV3';
import narration from './production/narration/ifm-v3.json';
const Root=()=> <Composition id="Magnivis-Interaction-Free-V3" component={InteractionFreeV3} width={1080} height={1920} fps={30} durationInFrames={narration.durationFrames} defaultProps={{inspectQa:false}}/>;
registerRoot(Root);
