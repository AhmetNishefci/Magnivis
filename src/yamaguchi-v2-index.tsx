import React from 'react';
import {Composition,registerRoot} from 'remotion';
import {YamaguchiTwoBombsV2} from './compositions/YamaguchiTwoBombsV2';
import narration from './production/narration/yamaguchi-two-bombs.json';
const Root:React.FC=()=> <Composition id="Magnivis-Yamaguchi-Two-Bombs-V2" component={YamaguchiTwoBombsV2} durationInFrames={narration.durationFrames} fps={30} width={1080} height={1920} defaultProps={{inspectQa:false}}/>;
registerRoot(Root);
