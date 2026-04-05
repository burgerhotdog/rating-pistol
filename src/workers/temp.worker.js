const CROPS = [
  { x: 267, y: 662, w: 50, h: 50 },
  { x: 640, y: 662, w: 50, h: 50 },
  { x: 1014, y: 662, w: 50, h: 50 },
  { x: 1389, y: 662, w: 50, h: 50 },
  { x: 1763, y: 662, w: 50, h: 50 },
];

const TARGET_SIZE = 50;

// resize any bitmap to TARGET_SIZExTARGET_SIZE and return its pixel array
async function bitmapToPixels(bitmap) {
  const canvas = new OffscreenCanvas(TARGET_SIZE, TARGET_SIZE);
  const ctx = canvas.getContext('2d');
  ctx.drawImage(bitmap, 0, 0, TARGET_SIZE, TARGET_SIZE);
  return ctx.getImageData(0, 0, TARGET_SIZE, TARGET_SIZE).data; // Uint8ClampedArray
}

// SAD-based comparison, returns 0–1 (1 = perfect match)
function comparePixels(a, b) {
  let sad = 0;
  for (let i = 0; i < a.length; i += 4) {
    sad += Math.abs(a[i]   - b[i]);   // R
    sad += Math.abs(a[i+1] - b[i+1]); // G
    sad += Math.abs(a[i+2] - b[i+2]); // B
    // skipping alpha
  }
  const maxSAD = 255 * 3 * (TARGET_SIZE * TARGET_SIZE);
  return 1 - sad / maxSAD;
}

// load + resize all templates once, store raw pixel arrays
async function loadTemplates() {
  const res = await fetch('/rating-pistol/wuthering-waves/set/manifest.json');
  const paths = await res.json();

  const templates = [];
  for (const path of paths) {
    const blob = await fetch(path).then(r => r.blob());
    const bitmap = await createImageBitmap(blob);
    const pixels = await bitmapToPixels(bitmap);
    templates.push({ name: path.split('/').pop(), pixels });
  }
  return templates;
}

// cache templates (load once)
const templatesPromise = loadTemplates();

self.onmessage = async (e) => {
  const { imageBitmap } = e.data;

  const templates = await templatesPromise;

  const results = [];

  for (const crop of CROPS) {
    // crop the region out of the source bitmap
    const cropBitmap = await createImageBitmap(
      imageBitmap,
      crop.x, crop.y, crop.w, crop.h
    );
    const cropPixels = await bitmapToPixels(cropBitmap);

    let bestMatch = null;
    let bestScore = -Infinity;

    for (const template of templates) {
      const score = comparePixels(cropPixels, template.pixels);

      if (score > bestScore) {
        bestScore = score;
        bestMatch = template.name;
      }
    }

    results.push({ match: bestMatch, score: bestScore });
  }

  console.log(results);

  self.postMessage(results);
};
