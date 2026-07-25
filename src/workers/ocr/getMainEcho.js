import { ECHO } from '@/data';
import { bitmapToPixels } from './helpers';

const CROP = { x: 22, y: 651, w: 190, h: 180 };

function compareIgnoringTransparency(cropPixels, templatePixels, alphaThreshold = 16) {
  let sad = 0;
  let count = 0;

  for (let i = 0; i < templatePixels.length; i += 4) {
    const alpha = templatePixels[i + 3];
    if (alpha < alphaThreshold) continue; // skip transparent template pixel

    sad += Math.abs(cropPixels[i]     - templatePixels[i]);     // R
    sad += Math.abs(cropPixels[i + 1] - templatePixels[i + 1]); // G
    sad += Math.abs(cropPixels[i + 2] - templatePixels[i + 2]); // B
    count++;
  }

  if (count === 0) return -Infinity; // fully transparent template, avoid divide-by-zero

  const maxSAD = 255 * 3 * count;
  return 1 - sad / maxSAD;
}

// Comparison resolution — keep it proportional to the crop's aspect ratio
const COMPARE_SIZE = { w: 50, h: Math.round((50 * CROP.h) / CROP.w) }; // 50x47

// Figure out the source region of a 256x256 template that, once scaled
// down to CROP.w wide, matches the same vertical window CROP captures
// (i.e. scaled to CROP.w x CROP.w, then 5px trimmed off top and bottom).
function templateRegionFor(bitmap) {
  const scale = bitmap.width / CROP.w; // e.g. 256 / 190
  const yTrim = (CROP.w - CROP.h) / 2; // 5, in "scaled to CROP.w" space

  return {
    x: 0,
    y: yTrim * scale,      // trim, translated back into original template pixels
    w: bitmap.width,
    h: CROP.h * scale,     // 180's worth, translated back into original template pixels
  };
}

async function loadTemplates(allowedNames = []) {
  const allowed = new Set(allowedNames);

  const res = await fetch('/rating-pistol/wuthering-waves/echo/manifest.json');
  const paths = await res.json();

  const templates = [];
  for (const path of paths) {
    const filename = path.split('/').pop().split('.')[0];
    if (allowed.size > 0 && !allowed.has(filename)) {
      continue;
    }

    const blob = await fetch(path).then((r) => r.blob());
    const bitmap = await createImageBitmap(blob);

    const region = templateRegionFor(bitmap);
    const pixels = bitmapToPixels(bitmap, region, COMPARE_SIZE);

    templates.push({ name: filename, pixels });
  }
  return templates;
}

export async function getMainEcho(imageBitmap, mainEchoSet, mainEchoCost) {
  const allowedNames =
    Object.values(ECHO)
      .filter(({ sets, cost }) => sets.includes(mainEchoSet) && cost === mainEchoCost)
      .map(({ id }) => id);

  const templates = await loadTemplates(allowedNames);
  const cropPixels = bitmapToPixels(imageBitmap, CROP, COMPARE_SIZE);

  let bestMatch = null;
  let bestScore = -Infinity;

  for (const template of templates) {
    const score = compareIgnoringTransparency(cropPixels, template.pixels);

    if (score > bestScore) {
      bestScore = score;
      bestMatch = template.name;
    }
  }

  return bestMatch;
}