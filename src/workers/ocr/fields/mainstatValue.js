import { ocrRegion } from '../ocrRegion';
import { whitelistValue } from '../helpers/maps';

export async function ocrMainstatValue(imageBitmap, ocrWorker, index, offset) {
  const region = {
    x: 315 + index * 374 + offset,
    y: 756,
    w: 31,
    h: 24,
  };

  const ocrText = await ocrRegion(region, imageBitmap, ocrWorker, 8, whitelistValue);
  return Math.round(Number(ocrText) * 100);
}
