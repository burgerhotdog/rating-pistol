import { ocrRegion } from '../ocrRegion';
import { whitelistValue } from '../helpers/maps';

export async function ocrSubstatValue(imageBitmap, ocrWorker, index, offset, lineIndex) {
  const region = {
    x: 315 + index * 374 + offset,
    y: 882 + lineIndex * 34,
    w: 58,
    h: 21,
  };

  const ocrText = await ocrRegion(region, imageBitmap, ocrWorker, 13, whitelistValue);
  return ocrText;
}
