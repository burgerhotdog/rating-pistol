import { comparePixels, bitmapToPixels } from "./helpers";

import { COST_TEMPLATES as cost0 } from '@/assets/ocr/cost/0/templates';
import { COST_TEMPLATES as cost1 } from '@/assets/ocr/cost/1/templates';
import { COST_TEMPLATES as cost2 } from '@/assets/ocr/cost/2/templates';
import { COST_TEMPLATES as cost3 } from '@/assets/ocr/cost/3/templates';
import { COST_TEMPLATES as cost4 } from '@/assets/ocr/cost/4/templates';
const costPixelDataOptions = [cost0, cost1, cost2, cost3, cost4];

const CROPS = [
  { x: 323, y: 664, w: 47, h: 47},
  { x: 696, y: 664, w: 47, h: 47},
  { x: 1070, y: 664, w: 47, h: 47},
  { x: 1445, y: 664, w: 47, h: 47},
  { x: 1819, y: 664, w: 47, h: 47},
];

export async function getCost(imageBitmap, index) {
  const templates = costPixelDataOptions[index];
  const cropPixels = bitmapToPixels(imageBitmap, CROPS[index]);

  let bestMatch = null;
  let bestScore = -Infinity;

  for (const [option, pixels] of Object.entries(templates)) {
    const score = comparePixels(cropPixels, pixels);

    if (score > bestScore) {
      bestScore = score;
      bestMatch = option;
    }
  }

  return bestMatch;
}