import {Composition,registerRoot} from 'remotion';
import {DicePuzzleV4} from './compositions/DicePuzzleV4';
import narration from './production/narration/dice-v4.json';
const Root=()=> <Composition id="Magnivis-Dice-Puzzle-V4" component={DicePuzzleV4} width={1080} height={1920} fps={30} durationInFrames={narration.durationFrames} defaultProps={{inspectQa:false}}/>;
registerRoot(Root);
