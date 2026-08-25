import { ocrRegion, matchString } from '../ocrRegion';
import { whitelistStat, mainstatNameToIdByCost } from '../helpers/maps';

export async function ocrMainstatId(imageBitmap, ocrWorker, cost, index, offset) {
  const region = { 
    x: 219 + index * 374 + offset,
    y: 724,
    w: 153,
    h: 20,
  };

  const ocrText = await ocrRegion(region, imageBitmap, ocrWorker, 7, whitelistStat);
  const mainstatName = matchString(ocrText, Object.keys(mainstatNameToIdByCost[cost]));
  return mainstatNameToIdByCost[cost][mainstatName];
}
