import {Composition,registerRoot} from 'remotion';
import {PaperHalfShape} from './compositions/PaperHalfShape';
import narration from './production/narration/paper.json';
const Root=()=> <Composition id="Magnivis-Paper-Half-Shape" component={PaperHalfShape} width={1080} height={1920} fps={30} durationInFrames={narration.durationFrames} defaultProps={{inspectQa:false}}/>;
registerRoot(Root);
