import { CHARACTERS } from "@/data";
import { compareStrings } from "./helpers";

const REGION = { x: 67, y: 24, w: 600, h: 54};
const PARAMS = {
  tessedit_pageseg_mode: 7,
  tessedit_char_whitelist: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz ",
};
const nameToId = Object.fromEntries(
  Object.entries(CHARACTERS['wuthering-waves'])
    .map(([id, { name }]) => ([name, id]))
);

export async function getId(imageBitmap, ocrWorker) {
  const canvas = new OffscreenCanvas(REGION.w, REGION.h);
  const ctx = canvas.getContext('2d');
  ctx.drawImage(
    imageBitmap,
    REGION.x, REGION.y, REGION.w, REGION.h,
    0, 0, REGION.w, REGION.h
  );
  const blob = await canvas.convertToBlob();
  const { data } = await ocrWorker.recognize(blob, PARAMS);
  const { text } = data;
  const cleaned = text.replace(/\s+/g, ' ').trim();

  let bestMatch = null;
  let closest = Infinity;

  for (const name of Object.keys(nameToId)) {
    const distance = compareStrings(cleaned, name);
    if (distance < closest) {
      closest = distance;
      bestMatch = name;
    }
  }

  if (closest > 10) return null;

  return nameToId[bestMatch];
}
