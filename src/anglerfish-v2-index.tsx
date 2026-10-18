import React from 'react';
import {Composition,registerRoot} from 'remotion';
import {AnglerfishFusionV2} from './compositions/AnglerfishFusionV2';
import narration from './production/narration/anglerfish-fusion.json';
const Root:React.FC=()=> <Composition id="Magnivis-AnglerfishFusion-V2" component={AnglerfishFusionV2} durationInFrames={narration.durationFrames} fps={30} width={1080} height={1920} defaultProps={{inspectQa:false}}/>;
registerRoot(Root);
