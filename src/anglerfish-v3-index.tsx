import React from 'react';
import {Composition,registerRoot} from 'remotion';
import {AnglerfishFusionV3} from './compositions/AnglerfishFusionV3';
import narration from './production/narration/anglerfish-fusion.json';
const Root:React.FC=()=> <Composition id="Magnivis-AnglerfishFusion-V3" component={AnglerfishFusionV3} durationInFrames={narration.durationFrames} fps={30} width={1080} height={1920} defaultProps={{inspectQa:false}}/>;
registerRoot(Root);
