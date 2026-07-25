import { ECHO } from '@/data';
import { comparePixels, bitmapToPixels } from './helpers';

const CROP = { x: 267, y: 662, w: 50, h: 50 };

// load + resize all templates once, store raw pixel arrays
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
    const pixels = bitmapToPixels(bitmap, null, { w: 50, h: 50 });

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
  const cropPixels = bitmapToPixels(imageBitmap, CROP);

  let bestMatch = null;
  let bestScore = -Infinity;

  for (const template of templates) {
    const score = comparePixels(cropPixels, template.pixels);

    if (score > bestScore) {
      bestScore = score;
      bestMatch = template.name;
    }
  }

  return bestMatch;
}
