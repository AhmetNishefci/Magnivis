import React from 'react';
import {Composition,registerRoot} from 'remotion';
import {OhioPedestalV2} from './compositions/OhioPedestalV2';
import narration from './production/narration/ohio.json';
const Root:React.FC=()=> <Composition id="Magnivis-Ohio-Pedestal-V2" component={OhioPedestalV2} durationInFrames={narration.durationFrames} fps={30} width={1080} height={1920} defaultProps={{inspectQa:false}}/>;
registerRoot(Root);
