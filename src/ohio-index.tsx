import React from 'react';
import {Composition,registerRoot} from 'remotion';
import {OhioPedestal} from './compositions/OhioPedestal';
import narration from './production/narration/ohio.json';
const Root:React.FC=()=> <Composition id="Magnivis-Ohio-Pedestal" component={OhioPedestal} durationInFrames={narration.durationFrames} fps={30} width={1080} height={1920} defaultProps={{inspectQa:false}}/>;
registerRoot(Root);
