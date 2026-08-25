import { distance } from 'fastest-levenshtein';

export function matchString(text, options, threshold = 8) {
  let bestMatch = null;
  let shortest = Infinity;

  for (const option of options) {
    const dist = distance(String(text), String(option));

    if (dist < shortest) {
      shortest = dist;
      bestMatch = option;
    }
  }

  return shortest <= threshold ? bestMatch : null;
}
