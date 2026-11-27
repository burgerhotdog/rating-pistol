function resolveBuffValueFlat(rawFlat, mvIndex) {
  if (!rawFlat) return 0;
  return Array.isArray(rawFlat) ? rawFlat[mvIndex] : rawFlat;
}

export function resolveBuffValue(hit, baseAttrValue, mvIndex) {
  let mv = 0;
  if (Object.hasOwn(hit, 'mv')) {
    const value = hit.mv
    mv = Array.isArray(value) ? value[mvIndex] : value;
  }

  const flat = resolveBuffValueFlat(hit.flat, mvIndex);

  return mv * baseAttrValue + flat;
}

export function normalizeActionBuff(action, baseMap, mvIndex) {
  const buff = action.buff = { ...action.buff };

  const baseAttrValue = baseMap[buff.baseAttr] ?? 0;
  buff.baseAttrValue = baseAttrValue;
  buff.mvIndex = mvIndex;
  buff.value = resolveBuffValue(buff.multipliers[0], baseAttrValue, mvIndex);
}
