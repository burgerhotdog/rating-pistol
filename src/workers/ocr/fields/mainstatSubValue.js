import { ocrRegion } from '../ocrRegion';
import { whitelistValue } from '../helpers/maps';

export async function ocrMainstatSubValue(imageBitmap, ocrWorker, index, offset) {
  const region = {
    x: 329 + index * 374 + offset,
    y: 846,
    w: 43,
    h: 18,
  };

  const ocrText = await ocrRegion(region, imageBitmap, ocrWorker, 8, whitelistValue);

  return Number(ocrText);
}
