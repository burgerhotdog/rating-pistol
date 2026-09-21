import { toArray } from '../toArray';

function mergeValues(base, addition) {
  if (typeof base === 'number' && typeof addition === 'number') {
    return base + addition;
  }

  if (typeof base === 'string' && typeof addition === 'string') {
    return [base, addition];
  }

  if (Array.isArray(base) || Array.isArray(addition)) {
    return [...toArray(base), ...toArray(addition)];
  }

  if (
    base &&
    typeof base === 'object' &&
    addition &&
    typeof addition === 'object'
  ) {
    const merged = { ...base };

    for (const key in addition) {
      merged[key] = mergeValues(merged[key], addition[key]);
    }

    return merged;
  }

  return addition;
}

const OPERATION_FIELDS = new Set(['apply', 'remove', 'use']);

function modifyOperationField(values, addition) {
  return values.map((value) => mergeValues(value, addition));
}

export function modifyEffect(effect, spec) {
  const modified = structuredClone(effect);

  for (const field in spec) {
    const addition = spec[field];

    if (OPERATION_FIELDS.has(field)) {
      modified[field] = modifyOperationField(modified[field], addition);
    } else {
      modified[field] = mergeValues(modified[field], addition);
    }
  }

  return modified;
}
