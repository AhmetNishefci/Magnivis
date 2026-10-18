import React from 'react';
import {Composition,registerRoot} from 'remotion';
import {JellyfishReversalV2} from './compositions/JellyfishReversalV2';
import narration from './production/narration/jellyfish-reversal.json';
const Root:React.FC=()=> <Composition id="Magnivis-JellyfishReversalV2" component={JellyfishReversalV2} durationInFrames={narration.durationFrames} fps={30} width={1080} height={1920} defaultProps={{inspectQa:false}}/>;
registerRoot(Root);
