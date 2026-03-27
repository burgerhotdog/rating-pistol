import { distance } from 'fastest-levenshtein';

export async function cropBlob(region, bitmap) {
  const cropCanvas = new OffscreenCanvas(region.w, region.h);
  const cropCtx = cropCanvas.getContext('2d');
  cropCtx.drawImage(bitmap, region.x, region.y, region.w, region.h, 0, 0, region.w, region.h);
  return cropCanvas.convertToBlob();
};

export async function cropPixels(region, bitmap) {
  const cropCanvas = new OffscreenCanvas(region.w, region.h);
  const cropCtx = cropCanvas.getContext('2d');
  cropCtx.drawImage(bitmap, region.x, region.y, region.w, region.h, 0, 0, region.w, region.h);
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
