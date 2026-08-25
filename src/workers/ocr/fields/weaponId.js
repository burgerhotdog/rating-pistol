import { ocrRegion, matchString } from '../ocrRegion';
import { weaponNameToId } from '../helpers/maps';

const region = { x: 1600, y: 450, w: 250, h: 30 };

export async function ocrWeaponId(imageBitmap, ocrWorker) {
  const ocrText = await ocrRegion(region, imageBitmap, ocrWorker);
  const weaponName = matchString(ocrText, Object.keys(weaponNameToId));
  return weaponNameToId[weaponName];
}
