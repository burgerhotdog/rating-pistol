import { comparePixels, bitmapToPixels } from './helpers';

const CROPS = [
  { x: 267, y: 662, w: 50, h: 50 },
  { x: 640, y: 662, w: 50, h: 50 },
  { x: 1014, y: 662, w: 50, h: 50 },
  { x: 1389, y: 662, w: 50, h: 50 },
  { x: 1763, y: 662, w: 50, h: 50 },
];

// load + resize all templates once, store raw pixel arrays
async function loadTemplates() {
  const res = await fetch('/rating-pistol/wuthering-waves/set/manifest.json');
  const paths = await res.json();

  const templates = [];
  for (const path of paths) {
    const blob = await fetch(path).then(r => r.blob());
    const bitmap = await createImageBitmap(blob);
    const pixels = bitmapToPixels(bitmap, null, { w: 50, h: 50 });
    templates.push({ name: path.split('/').pop().split('.')[0], pixels });
  }
  return templates;
}

const templatesPromise = loadTemplates();

export async function getSetId(imageBitmap, index) {
  const templates = await templatesPromise;
  const cropPixels = bitmapToPixels(imageBitmap, CROPS[index]);

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
