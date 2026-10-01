import {createRequire} from 'node:module';
import {execFileSync} from 'node:child_process';
import {writeFileSync} from 'node:fs';
import captions from '../src/captions/plans/longitude-clock-v2.json';
import {longitudeMasterDecision as master} from '../src/production/longitude-master-integrity';
import {longitudeFileHash} from '../src/production/longitude-integrity';
import {stableJson} from '../src/content-intelligence/run-schema';

const require = createRequire(import.meta.url);
const ffmpeg: string = require('ffmpeg-static');
const root = 'artifacts/qa-evidence/longitude-clock-platform-v1';
const sheets = [];
for (let index = 0; index < captions.cues.length; index += 4) {
  const cues = captions.cues.slice(index, index+4);
  const path = `${root}/caption-midpoints-sheet-${index/4+1}.png`;
  const frames = cues.map(cue => Math.floor((cue.startFrame+cue.endFrame)/2));
  const select = frames.map(frame => `eq(n\\,${frame})`).join('+');
  execFileSync(ffmpeg, ['-y', '-v', 'error', '-i', master.artifact.path, '-vf', `select=${select},setpts=N/FRAME_RATE/TB,scale=360:640,tile=4x1:nb_frames=4`, '-frames:v', '1', path]);
  sheets.push({path, sha256: longitudeFileHash(path), observations: cues.map((cue, offset) => ({cueId: cue.id, frame: frames[offset], lines: cue.lines}))});
}
writeFileSync(`${root}/caption-midpoints.json`, stableJson({mediaSha256: master.artifact.sha256, captionPlanId: captions.id, captionPlanRevision: captions.revision, phoneScaleWidth: 360, method: 'Actual full decoded frames at all 24 caption midpoints, grouped in reading order. No native UI/crop/device screenshot implied.', sheets}, 2)+'\n');
console.log({sheets: sheets.length, captionMidpoints: captions.cues.length});
