import {Composition,registerRoot} from 'remotion';
import {DicePuzzle} from './compositions/DicePuzzle';
import narration from './production/narration/dice.json';
const Root=()=> <Composition id="Magnivis-Dice-Puzzle" component={DicePuzzle} width={1080} height={1920} fps={30} durationInFrames={narration.durationFrames} defaultProps={{inspectQa:false}}/>;
registerRoot(Root);
