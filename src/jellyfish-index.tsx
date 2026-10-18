import React from 'react';
import {Composition,registerRoot} from 'remotion';
import {JellyfishReversal} from './compositions/JellyfishReversal';
import narration from './production/narration/jellyfish-reversal.json';
const Root:React.FC=()=> <Composition id="Magnivis-JellyfishReversal" component={JellyfishReversal} durationInFrames={narration.durationFrames} fps={30} width={1080} height={1920} defaultProps={{inspectQa:false}}/>;
registerRoot(Root);
