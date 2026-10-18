import React from 'react';
import {Composition,registerRoot} from 'remotion';
import {AnglerfishFusion} from './compositions/AnglerfishFusion';
import narration from './production/narration/anglerfish-fusion.json';
const Root:React.FC=()=> <Composition id="Magnivis-AnglerfishFusion" component={AnglerfishFusion} durationInFrames={narration.durationFrames} fps={30} width={1080} height={1920} defaultProps={{inspectQa:false}}/>;
registerRoot(Root);
