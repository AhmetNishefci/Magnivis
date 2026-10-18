import React from 'react';
import {Composition,registerRoot} from 'remotion';
import {SelfTickle} from './compositions/SelfTickle';
import narration from './production/narration/self-tickle.json';
const Root:React.FC=()=> <Composition id="Magnivis-SelfTickle" component={SelfTickle} durationInFrames={narration.durationFrames} fps={30} width={1080} height={1920} defaultProps={{inspectQa:false}}/>;
registerRoot(Root);
