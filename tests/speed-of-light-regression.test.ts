import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {describe, expect, it} from 'vitest';
import {speedOfLight, speedOfLightFrames} from '../src/content/videos/speed-of-light';
import {lightScale} from '../src/data/light';
import {
  speedOfLightContentAssetIds,
  speedOfLightPublishedShortAsset,
} from '../src/content-assets/assets/speed-of-light';
import {platformVariantRegistry} from '../src/platform-variants/registry';
import {
  speedOfLightPlatformVariantIds,
} from '../src/platform-variants/variants/speed-of-light';

const sha256 = (file: string) => createHash('sha256')
  .update(readFileSync(file))
  .digest('hex');

describe('published Speed of Light production regression', () => {
  it('preserves composition, format, scenes, captions, publication and runtime', () => {
    expect({
      compositionId: speedOfLight.compositionId,
      hook: speedOfLight.hook,
      format: speedOfLight.format,
      scenes: speedOfLight.scenes,
      captions: speedOfLight.captions,
      publication: speedOfLight.publication,
      frames: speedOfLightFrames,
    }).toEqual({
      compositionId: 'Magnivis-Speed-Of-Light',
      hook: 'ONE SECOND. 7.5 TRIPS AROUND EARTH.',
      format: {width: 1080, height: 1920, fps: 30, durationSeconds: 33},
      scenes: [
        {id: 'hook', start: 0, end: 4.4, purpose: 'Prove the speed immediately with laps around a familiar Earth.'},
        {id: 'exact-speed', start: 3.7, end: 10.1, purpose: 'Anchor the visual claim to the exact SI-defined speed in vacuum.'},
        {id: 'moon', start: 9.2, end: 15.3, purpose: 'Translate speed into the familiar Earth–Moon distance.'},
        {id: 'sun', start: 14.1, end: 21.2, purpose: 'Expand the reference to sunlight crossing the inner solar system.'},
        {id: 'light-year', start: 20, end: 26.6, purpose: 'Define a light-year as distance rather than time.'},
        {id: 'proxima', start: 25.4, end: 33, purpose: 'End by making even light feel slow against interstellar distance.'},
      ],
      captions: [{
        language: 'en',
        label: 'English',
        file: 'captions/speed-of-light.en.vtt',
      }],
      publication: {
        platform: 'youtube',
        videoId: 'ATPAdRdrRRw',
        publicUrl: 'https://www.youtube.com/shorts/ATPAdRdrRRw',
        publishedDate: '2026-09-26',
      },
      frames: 990,
    });
  });

  it('preserves every narration cue and audio input', () => {
    expect(speedOfLight.audio).toEqual({
      file: 'audio/speed-of-light.wav',
      layers: ['ambient', 'transition', 'impact', 'narration'],
      narration: true,
      narrationCues: [
        {id: 'hook', file: 'audio/narration/speed-of-light/hook.wav', start: 0.03, transcript: 'In one second, light could circle Earth seven and a half times.'},
        {id: 'speed', file: 'audio/narration/speed-of-light/speed.wav', start: 4.15, transcript: 'In a vacuum, it travels nearly 300,000 kilometers every second.'},
        {id: 'moon', file: 'audio/narration/speed-of-light/moon.wav', start: 9.75, transcript: 'Earth to the Moon takes only about 1.28 seconds.'},
        {id: 'sun', file: 'audio/narration/speed-of-light/sun.wav', start: 14.75, transcript: 'Sunlight needs about eight minutes and twenty seconds to reach us.'},
        {id: 'year', file: 'audio/narration/speed-of-light/year.wav', start: 20.5, transcript: 'In one year, light covers 9.46 trillion kilometers.'},
        {id: 'proxima', file: 'audio/narration/speed-of-light/proxima.wav', start: 26, transcript: 'Yet even at that speed, Proxima Centauri is still 4.25 years away.'},
      ],
    });
  });

  it('preserves all numeric inputs consumed by the composition', () => {
    expect(lightScale).toEqual({
      speedMps: 299792458,
      earthCircumferenceKm: 40030.2,
      earthLapsPerSecond: (299792458 / 1000) / 40030.2,
      moonDistanceKm: 384400,
      moonLightTimeSeconds: 384400 / (299792458 / 1000),
      sunLightTimeMinutes: 8 + 20 / 60,
      lightYearKm: 9.46e12,
      proximaLightYears: 4.25,
    });
  });

  it('links the video through its YouTube variant without retaining legacy fact IDs', () => {
    expect(speedOfLight.factIds).toEqual([]);
    expect(speedOfLight.contentAssetId).toBeUndefined();
    expect(speedOfLight.platformVariantId).toBe(
      speedOfLightPlatformVariantIds.youtubeShorts,
    );
    expect(
      platformVariantRegistry.get(speedOfLight.platformVariantId!).contentAssetId,
    ).toBe(speedOfLightContentAssetIds.publishedShort);
    expect(speedOfLightPublishedShortAsset.knowledgePackageId).toBe('speed-of-light');
  });

  it('preserves the reviewed caption and soundscape source artifacts', () => {
    expect(sha256('captions/speed-of-light.en.vtt')).toBe(
      '48e22610b1aa0b14b30557c9741649f8ad9306b4245da6a9c3fab371736bd3f6',
    );
    expect(sha256('public/audio/speed-of-light.wav')).toBe(
      '5ccdef44bd52a19f56ceb55d2ed5779a20cd1c3e7afee98b72e635a21f0c9602',
    );
  });
});
