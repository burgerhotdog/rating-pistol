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

export const SUB_NAME_TO_ID = {
  'HP': 'HP',
  'ATK': 'ATK',
  'DEF': 'DEF',
  'Crit. Rate': 'CR',
  'Crit. DMG': 'CD',
  'Energy Regen': 'ER',
  'Basic Attack DMG Bonus': 'BA',
  'Heavy Attack DMG Bonus': 'HA',
  'Resonance Skill DMG': 'RS',
  'Resonance Liberation': 'RL',
};

export const COST_CROPS = [
  { x: 323, y: 664, w: 47, h: 47},
  { x: 696, y: 664, w: 47, h: 47},
  { x: 1070, y: 664, w: 47, h: 47},
  { x: 1445, y: 664, w: 47, h: 47},
  { x: 1819, y: 664, w: 47, h: 47},
]

export const COST_CROPS2 = [
  { x: 339, y: 676, w: 15, h: 23},
  { x: 712, y: 676, w: 15, h: 23},
  { x: 1086, y: 676, w: 15, h: 23},
  { x: 1461, y: 676, w: 15, h: 23},
  { x: 1836, y: 676, w: 13, h: 23},
]

export const VALUE_OPTIONS = null;

export const SUBSTAT_DICT = Object.fromEntries(
  Object.entries(SUB_STAT_TYPES).map(([id, { NAME }]) => ([NAME, id]))
);

function cropCanvas(region, imageBitmap) {
  const canvas = new OffscreenCanvas(region.w, region.h);
  const cropCtx = canvas.getContext('2d');
  cropCtx.drawImage(imageBitmap, region.x, region.y, region.w, region.h, 0, 0, region.w, region.h);
  return canvas;
}

function scoreTemplateMatch(region, imageBitmap, templatePixels) {
  const canvas = cropCanvas(region, imageBitmap);
  const cropPixels = canvas.getImageData(0, 0, region.w, region.h).data;
  let score = 0;
  for (let i = 0; i < cropPixels.length; i += 4) {
    const gray1 = 0.299 * cropPixels[i] + 0.587 * cropPixels[i + 1] + 0.114 * cropPixels[i + 2];
    const gray2 = 0.299 * templatePixels[i] + 0.587 * templatePixels[i + 1] + 0.114 * templatePixels[i + 2];
    score += Math.abs(gray1 - gray2);
  }
  return score;
}

export function findBestMatch(cropPixels, imageBitmap, templates) {
  let bestMatch = null;
  let bestScore = Infinity;

  for (const [name, templatePixels] of Object.entries(templates)) {
    const score = scoreTemplateMatch(cropPixels, imageBitmap, templatePixels);
    if (score < bestScore) {
      bestScore = score;
      bestMatch = name;
    }
  }

  return bestMatch;
}

export const wlId = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz .';
export const wlValue = '0123456789.%';

export async function ocrRegion(region, imageBitmap, ocrWorker, dict, mode = 7, whitelist = '', threshold = 8) {
  const canvas = cropCanvas(region, imageBitmap);
  const blob = await canvas.convertToBlob();
  const params = {
    tessedit_pageseg_mode: mode,
    ...(whitelist && { tessedit_char_whitelist: whitelist }),
  };

  const { data: { text } } = await ocrWorker.recognize(blob, params);

  const cleaned = text.replace(/\s+/g, ' ').trim().toLowerCase();
  let bestMatch = null;
  let shortest = Infinity;

  for (const option of Object.keys(dict)) {
    const dist = distance(cleaned, option.toLowerCase());
    if (dist < shortest) {
      shortest = dist;
      bestMatch = option;
    }
  }

  return shortest <= threshold ? bestMatch : null;
}
