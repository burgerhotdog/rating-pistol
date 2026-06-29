import { comparePixels, bitmapToPixels } from './helpers';
import { LOCK_TEMPLATES } from '@/assets/ocr/rank/templates';

const CROPS = [
  { x: 187, y: 578, w: 5, h: 6 },
  { x: 261, y: 578, w: 5, h: 6 },
  { x: 342, y: 578, w: 5, h: 6 },
  { x: 422, y: 578, w: 5, h: 6 },
  { x: 502, y: 578, w: 5, h: 6 },
  { x: 582, y: 578, w: 5, h: 6 },
];

const LOCK_THRESHOLD = 0.9992;

const isLocked = (imageBitmap, rank) => {
  const crop = CROPS[rank - 1]
  const cropPixels = bitmapToPixels(imageBitmap, crop);
  const lockPixels = LOCK_TEMPLATES[rank];
  const score = comparePixels(cropPixels, lockPixels);

  return score >= LOCK_THRESHOLD;
};

export const getRank = (imageBitmap) => {
  for (let rank = 1; rank <= 6; rank++) {
    if (isLocked(imageBitmap, rank)) {
      return rank - 1;
    }
  }

  return 6;
};
