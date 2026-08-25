import { WW, CHARACTER } from '@/data';
import { ocrRegion, matchString } from '../ocrRegion';

const region = { x: 67, y: 24, w: 600, h: 54};

const nameToId = Object.fromEntries(
  Object.entries(CHARACTER[WW])
    .map(([id, { name }]) => ([name, id]))
);

export async function ocrId(imageBitmap, ocrWorker) {
  const ocrText = await ocrRegion(region, imageBitmap, ocrWorker, 7, 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz ');
  const name = matchString(ocrText, Object.keys(nameToId), 10);
  return nameToId[name];
}
