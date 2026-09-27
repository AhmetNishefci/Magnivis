import {videoSpecSchema} from '../schema';
import {
  speedOfLightPublishedScriptSegmentIds,
  speedOfLightPublishedShortAsset,
} from '../../content-assets/assets/speed-of-light';
import {contentAssetRegistry} from '../../content-assets/registry';
import {platformVariantRegistry} from '../../platform-variants/registry';
import {
  speedOfLightYoutubeShortsVariant,
} from '../../platform-variants/variants/speed-of-light';

const scriptText = (segmentId: string) => {
  const segment = speedOfLightPublishedShortAsset.script.segments.find(
    ({id}) => id === segmentId,
  );
  if (!segment) throw new Error(`Missing Speed of Light script segment: ${segmentId}`);
  return segment.text;
};

export const speedOfLight = videoSpecSchema.parse({
  id: 'speed-of-light',
  compositionId: 'Magnivis-Speed-Of-Light',
  workingTitle: 'How Fast Is the Speed of Light?',
  titleCandidates: [
    'Light Is Fast — Space Is Bigger',
    'This Is How Fast Light Really Is',
    'How Far Does Light Travel in One Second?',
  ],
  descriptionCandidates: [
    'Light crosses nearly 300,000 kilometers every second—enough to circle Earth about 7.5 times. Yet even light needs 4.25 years to reach our nearest neighboring star.',
  ],
  hook: 'ONE SECOND. 7.5 TRIPS AROUND EARTH.',
  pillar: 'universe',
  status: 'published',
  publication: {
    platform: 'youtube',
    videoId: 'ATPAdRdrRRw',
    publicUrl: 'https://www.youtube.com/shorts/ATPAdRdrRRw',
    publishedDate: '2026-09-26',
  },
  language: 'en',
  captions: [{language: 'en', label: 'English', file: 'captions/speed-of-light.en.vtt'}],
  format: {width: 1080, height: 1920, fps: 30, durationSeconds: 33},
  scenes: [
    {id: 'hook', start: 0, end: 4.4, purpose: 'Prove the speed immediately with laps around a familiar Earth.'},
    {id: 'exact-speed', start: 3.7, end: 10.1, purpose: 'Anchor the visual claim to the exact SI-defined speed in vacuum.'},
    {id: 'moon', start: 9.2, end: 15.3, purpose: 'Translate speed into the familiar Earth–Moon distance.'},
    {id: 'sun', start: 14.1, end: 21.2, purpose: 'Expand the reference to sunlight crossing the inner solar system.'},
    {id: 'light-year', start: 20, end: 26.6, purpose: 'Define a light-year as distance rather than time.'},
    {id: 'proxima', start: 25.4, end: 33, purpose: 'End by making even light feel slow against interstellar distance.'},
  ],
  platformVariantId: speedOfLightYoutubeShortsVariant.id,
  audio: {
    file: 'audio/speed-of-light.wav',
    layers: ['ambient', 'transition', 'impact', 'narration'],
    narration: true,
    narrationCues: [
      {id: 'hook', file: 'audio/narration/speed-of-light/hook.wav', start: 0.03, transcript: scriptText(speedOfLightPublishedScriptSegmentIds.hook)},
      {id: 'speed', file: 'audio/narration/speed-of-light/speed.wav', start: 4.15, transcript: scriptText(speedOfLightPublishedScriptSegmentIds.speed)},
      {id: 'moon', file: 'audio/narration/speed-of-light/moon.wav', start: 9.75, transcript: scriptText(speedOfLightPublishedScriptSegmentIds.moon)},
      {id: 'sun', file: 'audio/narration/speed-of-light/sun.wav', start: 14.75, transcript: scriptText(speedOfLightPublishedScriptSegmentIds.sun)},
      {id: 'year', file: 'audio/narration/speed-of-light/year.wav', start: 20.5, transcript: scriptText(speedOfLightPublishedScriptSegmentIds.year)},
      {id: 'proxima', file: 'audio/narration/speed-of-light/proxima.wav', start: 26, transcript: scriptText(speedOfLightPublishedScriptSegmentIds.proxima)},
    ],
  },
});

if (!speedOfLight.platformVariantId) {
  throw new Error('Speed of Light must reference its production platform variant');
}
const speedOfLightProductionVariant = platformVariantRegistry.get(
  speedOfLight.platformVariantId,
);
if (speedOfLightProductionVariant.contentAssetId !== speedOfLightPublishedShortAsset.id) {
  throw new Error('Speed of Light platform variant must reference its published content asset');
}
contentAssetRegistry.get(speedOfLightProductionVariant.contentAssetId);

export const speedOfLightFrames = speedOfLight.format.fps * speedOfLight.format.durationSeconds;
