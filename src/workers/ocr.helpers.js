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

export const SUBSTAT_DICT = Object.fromEntries(
  Object.entries(SUB_STAT_TYPES).map(([id, { NAME }]) => ([NAME, id]))
);

export async function cropBlob(region, imageBitmap) {
  const cropCanvas = new OffscreenCanvas(region.w, region.h);
  const cropCtx = cropCanvas.getContext('2d');
  cropCtx.drawImage(imageBitmap, region.x, region.y, region.w, region.h, 0, 0, region.w, region.h);
  return cropCanvas.convertToBlob();
}

export async function cropPixels(region, imageBitmap) {
  const cropCanvas = new OffscreenCanvas(region.w, region.h);
  const cropCtx = cropCanvas.getContext('2d');
  cropCtx.drawImage(imageBitmap, region.x, region.y, region.w, region.h, 0, 0, region.w, region.h);
  return cropCtx.getImageData(0, 0, region.w, region.h).data;
}

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
}

export function imageMatch(cropPixels, templatePixels) {
  let score = 0;
  for (let i = 0; i < cropPixels.length; i += 4) {
    const gray1 = 0.299 * cropPixels[i] + 0.587 * cropPixels[i + 1] + 0.114 * cropPixels[i + 2];
    const gray2 = 0.299 * templatePixels[i] + 0.587 * templatePixels[i + 1] + 0.114 * templatePixels[i + 2];
    score += Math.abs(gray1 - gray2);
  }
  return score;
}

export function findBestMatch(cropPixels, templates) {
  let bestMatch = null;
  let bestScore = Infinity;

  for (const [name, templatePixels] of Object.entries(templates)) {
    const score = imageMatch(cropPixels, templatePixels);
    if (score < bestScore) {
      bestScore = score;
      bestMatch = name;
    }
  }

  return bestMatch;
}
export async function regionToName(region, dict, imageBitmap, ocrWorker) {
  const blob = await cropBlob(region, imageBitmap);
  const { data: { text } } = await ocrWorker.recognize(blob, {
    tessedit_pageseg_mode: '7',
    tessedit_char_whitelist: '',
  });
  const validatedText = await snapToOption(text.trim(), Object.keys(dict));
  return validatedText;
}

export async function regionToText(region, dict, imageBitmap, ocrWorker) {
  const blob = await cropBlob(region, imageBitmap);
  const { data: { text } } = await ocrWorker.recognize(blob, {
    tessedit_pageseg_mode: '7',
    tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz .',
  });
  const validatedText = await snapToOption(text.trim(), Object.keys(dict));
  return validatedText;
}

export async function regionToNumber(region, imageBitmap, ocrWorker) {
  const blob = await cropBlob(region, imageBitmap);
  const { data: { text } } = await ocrWorker.recognize(blob, {
    tessedit_pageseg_mode: '7',
    tessedit_char_whitelist: '0123456789.%',
  });
  return text.trim();
}

export async function regionToCost(region, imageBitmap, ocrWorker) {
  const blob = await cropBlob(region, imageBitmap);
  const { data: { text } } = await ocrWorker.recognize(blob, {
    tessedit_pageseg_mode: '10',
    tessedit_char_whitelist: '134',
  });
  return text.trim();
}

export async function regionToCost2(region, imageBitmap, ocrWorker) {
  const cropCanvas = new OffscreenCanvas(region.w, region.h);
  const cropCtx = cropCanvas.getContext('2d');
  cropCtx.drawImage(imageBitmap, region.x, region.y, region.w, region.h, 0, 0, region.w, region.h);

  const imageData = cropCtx.getImageData(0, 0, region.w, region.h);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
    const value = gray > 128 ? 255 : 0;
    data[i] = value;
    data[i + 1] = value;
    data[i + 2] = value;
  }

  cropCtx.putImageData(imageData, 0, 0);
  const blob = await cropCanvas.convertToBlob({ type: 'image/png' });

  const { data: { text } } = await ocrWorker.recognize(blob, {
    tessedit_pageseg_mode: '10',
    tessedit_char_whitelist: '134',
  });
  return text.trim();
}
