import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import sharp from 'sharp';
import {outlinedText} from '../../design-exploration/millennium-bridge/frames';
import {validateRasterSource} from '../../design-exploration/raster-source';
import {explorationBDirectory, validateExplorationBEditorial} from '../../design-exploration/millennium-bridge-b/review';
import {warpRaster, sampleMask, compositePixels, type Raster} from '../continuous-raster';
import {maskSvgs, maskSvg, motionState, proofSize, smooth, type ProofMask} from './model';

export const prepareProofInputs = async () => {
  validateExplorationBEditorial();
  const dir = resolve(explorationBDirectory);
  const sources: unknown[] = JSON.parse(readFileSync(resolve(dir, 'source-assets.json'), 'utf8'));
  const selected = await Promise.all(sources.slice(0, 2).map((source) => validateRasterSource(dir, source)));
  const rasters: Raster[] = await Promise.all(selected.map(async ({bytes}) => ({width: 1080, height: 1920, rgba: await sharp(bytes).resize(1080, 1920, {fit: 'cover', kernel: 'lanczos3'}).ensureAlpha().raw().toBuffer()})));
  const masks = {} as Record<ProofMask, Uint8Array>;
  for (const id of Object.keys(maskSvgs) as ProofMask[]) masks[id] = await sharp(Buffer.from(maskSvg(id))).blur(id === 'human' ? 40 : 26).removeAlpha().greyscale().raw().toBuffer();
  const disclosureSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1920"><rect x="94" y="1480" width="500" height="110" rx="6" fill="#061521" opacity=".78"/>${outlinedText('SIMPLIFIED EXPLANATORY MODEL',108,1525,25,'#edf1f1')}${outlinedText('MOTION EXAGGERATED',108,1560,25,'#edf1f1')}</svg>`;
  const overlay = await sharp(Buffer.from(disclosureSvg)).ensureAlpha().raw().toBuffer();
  return {rasters, masks, selected, overlay, disclosureSvg};
};
export type ProofInputs = Awaited<ReturnType<typeof prepareProofInputs>>;
export const openingDisplacement = (inputs: ProofInputs, frame: number, x: number, y: number) => {
  const s = motionState(frame);
  const m = (id: ProofMask) => sampleMask(inputs.masks[id], 1080, 1920, x, y);
  const human = m('human'); const deck = m('deck');
  const depth = .2 + .8 * smooth(650, 1550, y);
  const support = s.deck * ((1 - human) * deck * depth + human * .70);
  const torso = human * m('torso') * smooth(1030, 300, y);
  const arm = human * m('arm'); const free = human * m('freeFoot');
  return {dx: support + s.torso * torso + s.arm * arm + s.step * free, dy: s.torso * torso * (x - 430) / 700 - s.lift * free};
};
export const renderProofFrame = (inputs: ProofInputs, frame: number) => {
  const state = motionState(frame);
  let pixels: Buffer;
  if (state.macroMix < 1) {
    pixels = warpRaster(inputs.rasters[0]!, (x,y) => openingDisplacement(inputs, frame, x,y), {scale: state.cameraScale, x: state.cameraX, y: state.cameraY});
  } else pixels = Buffer.alloc(proofSize.width * proofSize.height * 4);
  if (state.macroMix > 0) {
    const macro = warpRaster(inputs.rasters[1]!, (x,y) => {
      const foot = sampleMask(inputs.masks.macroFoot, 1080, 1920, x,y);
      const free = smooth(600, 920, x) * foot;
      return {dx: state.macroDeck * (.85 + .15 * (1 - foot)) + state.macroCorrection * free, dy: 0};
    }, {scale: 1.02, x: 540, y: 960});
    pixels = compositePixels(pixels, macro, state.macroMix);
  }
  return compositePixels(pixels, inputs.overlay, 1, true);
};
