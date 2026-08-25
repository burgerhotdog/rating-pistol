import { ocrRegion, matchString } from '../ocrRegion';
import { whitelistStat, substatFragmentToSuffix } from '../helpers/maps';

export async function ocrSubstatId(imageBitmap, ocrWorker, index, offset, lineIndex) {
  const region = {
    x: 64 + index * 374 + offset,
    y: 882 + lineIndex * 34,
    w: 218,
    h: 21,
  };

  const ocrText = await ocrRegion(region, imageBitmap, ocrWorker, 7, whitelistStat);
  const substatFragment = matchString(ocrText, Object.keys(substatFragmentToSuffix));
  return substatFragmentToSuffix[substatFragment];
}
