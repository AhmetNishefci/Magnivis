import React from 'react';
import {Composition,registerRoot} from 'remotion';
import {VoyagerMemory} from './compositions/VoyagerMemory';
import narration from './production/narration/voyager.json';
const Root:React.FC=()=> <Composition id="Magnivis-Voyager-Memory" component={VoyagerMemory} durationInFrames={narration.durationFrames} fps={30} width={1080} height={1920} defaultProps={{inspectQa:false}}/>;
registerRoot(Root);
