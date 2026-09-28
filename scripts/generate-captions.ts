import {mkdirSync, writeFileSync} from 'node:fs';
import {dirname} from 'node:path';
import {captionPlanToDerivedCaptions, captionsToWebVtt} from '../src/captions/derive';
import {woodFrogCaptionPlan} from '../src/captions/plans/wood-frog';
import {woodFrog} from '../src/content/videos/wood-frog';

const requestedId = process.argv[2];
if (requestedId !== woodFrog.id) {
  throw new Error(`Unknown caption target: ${requestedId ?? '(missing)'}. Available: ${woodFrog.id}`);
}
const captionFile = woodFrog.captions[0]?.file;
if (!captionFile) throw new Error('Wood Frog VideoSpec has no caption output');
const captions = captionPlanToDerivedCaptions(woodFrogCaptionPlan);
const output = captionsToWebVtt(captions);
mkdirSync(dirname(captionFile), {recursive: true});
writeFileSync(captionFile, `${output.trimEnd()}\n`, 'utf8');
console.log(`Generated ${captionFile} from ${woodFrogCaptionPlan.cues.length} CaptionPlan cues`);
