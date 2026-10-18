import React from 'react';
import {Composition,registerRoot} from 'remotion';
import {SelfTickleV2} from './compositions/SelfTickleV2';
import narration from './production/narration/self-tickle.json';
const Root:React.FC=()=> <Composition id="Magnivis-SelfTickleV2" component={SelfTickleV2} durationInFrames={narration.durationFrames} fps={30} width={1080} height={1920} defaultProps={{inspectQa:false}}/>;
registerRoot(Root);
