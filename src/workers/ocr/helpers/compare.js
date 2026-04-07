import { distance } from "fastest-levenshtein";

export function comparePixels(a, b) {
  let sad = 0;
  for (let i = 0; i < a.length; i += 4) {
    sad += Math.abs(a[i]   - b[i]);   // R
    sad += Math.abs(a[i+1] - b[i+1]); // G
    sad += Math.abs(a[i+2] - b[i+2]); // B
    // skipping alpha
  }
  const maxSAD = 255 * 3 * (a.length * a.length);
  return 1 - sad / maxSAD;
}

export function compareStrings(a, b) {
  return distance(String(a), String(b));
}
