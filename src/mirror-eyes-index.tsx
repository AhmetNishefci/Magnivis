import React from 'react';
import {Composition,registerRoot} from 'remotion';
import {MirrorEyes} from './compositions/MirrorEyes';
import narration from './production/narration/mirror-eyes.json';
const Root:React.FC=()=> <Composition id="Magnivis-MirrorEyes" component={MirrorEyes} durationInFrames={narration.durationFrames} fps={30} width={1080} height={1920} defaultProps={{inspectQa:false}}/>;
registerRoot(Root);
