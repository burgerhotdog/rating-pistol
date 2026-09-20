import { toArray } from '../toArray';

function mergeValues(a, b) {
  if (typeof a === 'number' && typeof b === 'number') {
    return a + b;
  }

  if (typeof a === 'string' && typeof b === 'string') {
    return [a, b];
  }

  if (Array.isArray(a) || Array.isArray(b)) {
    return [...toArray(a), ...toArray(b)];
  }

  if (a && typeof a === 'object' && b && typeof b === 'object') {
    const merged = { ...a };

    for (const [key, value] of Object.entries(b)) {
      if (key in merged) {
        merged[key] = mergeValues(merged[key], value);
      } else {
        merged[key] = value;
      }
    }

    return merged;
  }

  return b;
}

export function modifyEffect(effect, spec) {
  const modified = structuredClone(effect);

  for (const [field, add] of Object.entries(spec)) {
    if (field in modified) {
      modified[field] = mergeValues(modified[field], add);
    } else {
      modified[field] = add;
    }
  }

  return modified;
}
