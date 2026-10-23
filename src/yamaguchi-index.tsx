import React from 'react';
import {Composition,registerRoot} from 'remotion';
import {YamaguchiTwoBombs} from './compositions/YamaguchiTwoBombs';
import narration from './production/narration/yamaguchi-two-bombs.json';
const Root:React.FC=()=> <Composition id="Magnivis-Yamaguchi-Two-Bombs" component={YamaguchiTwoBombs} durationInFrames={narration.durationFrames} fps={30} width={1080} height={1920} defaultProps={{inspectQa:false}}/>;
registerRoot(Root);
