import {createRequire} from 'node:module';
import {execFileSync} from 'node:child_process';
import {mkdirSync, readFileSync, writeFileSync} from 'node:fs';
import {validateLongitudeLockedMaster} from '../src/production/longitude-master-integrity';
import {longitudeFileHash} from '../src/production/longitude-integrity';
import {stableJson} from '../src/content-intelligence/run-schema';

const require = createRequire(import.meta.url);
const ffmpeg: string = require('ffmpeg-static');
const master = validateLongitudeLockedMaster();
const root = 'artifacts/qa-evidence/longitude-clock-platform-v1';
mkdirSync(root, {recursive: true});
execFileSync(ffmpeg, ['-v', 'error', '-xerror', '-i', master.artifact.path, '-f', 'null', '-'], {stdio: 'pipe'});
const observations = [];
for (const key of ['youtube-mobile', 'tiktok-mobile', 'instagram-reel', 'facebook-reel']) {
  const report = JSON.parse(readFileSync(`${root}/${key}.json`, 'utf8'));
  const {left, right, top, bottom} = report.assessment.insets;
  const paths = [];
  for (const [name, time] of [['correction', 10.5], ['comparison', 14.25], ['readings', 25], ['east-reveal', 29.1]] as const) {
    const path = `${root}/${key}-${name}-local-model.png`;
    execFileSync(ffmpeg, ['-y', '-v', 'error', '-ss', String(time), '-i', master.artifact.path, '-frames:v', '1', '-vf', `drawbox=x=${left}:y=${top}:w=${1080-left-right}:h=${1920-top-bottom}:color=0xC23A65:t=3,scale=270:480`, path]);
    paths.push(path);
    observations.push({surface: key, beat: name, seconds: time, path, sha256: longitudeFileHash(path), overlay: 'Known inset boundary only. Native UI is unmeasured; this is not a device screenshot.'});
  }
  const sheet = `${root}/${key}-local-contact-sheet.png`;
  execFileSync(ffmpeg, ['-y', '-v', 'error', ...paths.flatMap(p => ['-i', p]), '-filter_complex', '[0:v][1:v][2:v][3:v]hstack=inputs=4[out]', '-map', '[out]', '-frames:v', '1', sheet]);
}
writeFileSync(`${root}/media-decode.json`, stableJson({passed: true, checkedAt: new Date().toISOString(), mediaSha256: longitudeFileHash(master.artifact.path), fullVideoAndAudioDecode: true, masterModified: false, sourceCaptionMidpointCount: 24, sourceDecodedFrameCount: 56, originalContactSheet: 'artifacts/qa-evidence/longitude-clock-candidate-v2/contact-sheet.jpg', localModelObservations: observations, realDevicePasses: 0, limitation: 'Known inset outlines only. No native exclusion zones, caption region, grid/feed crop, desktop or device approval inferred.'}, 2)+'\n');
console.log({passed: true, fullDecode: true, overlays: observations.length, masterUnchanged: true});
