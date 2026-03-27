import { distance } from 'fastest-levenshtein';
import { WEAPON_LOOKUP, GENERAL_LOOKUP } from '@/lookups';

export const WEAPON_DICT = Object.fromEntries(
  Object.entries(WEAPON_LOOKUP['wuthering-waves']).map(([id, { NAME }]) => ([NAME, id]))
);

const { MAIN_STAT_TYPES, SUB_STAT_TYPES } = GENERAL_LOOKUP['wuthering-waves'];
export const MAIN_STAT_DICT_PER_COST = Object.fromEntries(MAIN_STAT_TYPES.map((map, index) => {
  const dict = {};
  for (const [id, { NAME }] of Object.entries(map)) {
    dict[NAME] = id;
  }
  switch (index) {
    case 0:
      return [1, dict];
    case 1:
      return [3, dict];
    case 2:
      return [4, dict];
  }
}));

export const SUBSTAT_DICT = Object.fromEntries(
  Object.entries(SUB_STAT_TYPES).map(([id, { NAME }]) => ([NAME, id]))
);

export async function cropBlob(region, imageBitmap) {
  const cropCanvas = new OffscreenCanvas(region.w, region.h);
  const cropCtx = cropCanvas.getContext('2d');
  cropCtx.drawImage(imageBitmap, region.x, region.y, region.w, region.h, 0, 0, region.w, region.h);
  return cropCanvas.convertToBlob();
};

export async function cropPixels(region, imageBitmap) {
  const cropCanvas = new OffscreenCanvas(region.w, region.h);
  const cropCtx = cropCanvas.getContext('2d');
  cropCtx.drawImage(imageBitmap, region.x, region.y, region.w, region.h, 0, 0, region.w, region.h);
  return cropCtx.getImageData(0, 0, region.w, region.h).data;
};

export function snapToOption(rawText, optionsList, threshold = 8) {
  const cleaned = rawText.replace(/\./g, '').trim().toLowerCase();
  let bestMatch = null;
  let shortest = Infinity;

  for (const option of optionsList) {
    const dist = distance(cleaned, option.toLowerCase());
    if (dist < shortest) {
      shortest = dist;
      bestMatch = option;
    }
  }

  return shortest <= threshold ? bestMatch : null; 
};
