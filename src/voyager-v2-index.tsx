import React from 'react';
import {Composition,registerRoot} from 'remotion';
import {VoyagerMemoryV2} from './compositions/VoyagerMemoryV2';
import narration from './production/narration/voyager.json';
const Root:React.FC=()=> <Composition id="Magnivis-Voyager-Memory-V2" component={VoyagerMemoryV2} durationInFrames={narration.durationFrames} fps={30} width={1080} height={1920} defaultProps={{inspectQa:false}}/>;
registerRoot(Root);
