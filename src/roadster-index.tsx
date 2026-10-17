import React from 'react';
import {Composition,registerRoot} from 'remotion';
import {Roadster} from './compositions/Roadster';
import narration from './production/narration/roadster.json';
const Root:React.FC=()=> <Composition id="Magnivis-Roadster" component={Roadster} durationInFrames={narration.durationFrames} fps={30} width={1080} height={1920} defaultProps={{inspectQa:false}}/>;
registerRoot(Root);
