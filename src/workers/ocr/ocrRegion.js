import { compareStrings } from './helpers';

export async function ocrRegion(region, imageBitmap, worker, mode = 7, whitelist = '') {
  const canvas = new OffscreenCanvas(region.w, region.h);
  const ctx = canvas.getContext('2d');
  ctx.drawImage(
    imageBitmap,
    region.x, region.y, region.w, region.h,
    0, 0, region.w, region.h
  );

  const blob = await canvas.convertToBlob();

  const { data } = await worker.recognize(blob, {
    tessedit_pageseg_mode: mode,
    ...(whitelist && { tessedit_char_whitelist: whitelist }),
  });

  return data.text.replace(/\s+/g, ' ').trim();
}

export function matchString(text, options, threshold = 8) {
  let bestMatch = null;
  let shortest = Infinity;

  for (const option of options) {
    const distance = compareStrings(text, option);
    if (distance < shortest) {
      shortest = distance;
      bestMatch = option;
    }
  }

  return shortest <= threshold ? bestMatch : null;
}
