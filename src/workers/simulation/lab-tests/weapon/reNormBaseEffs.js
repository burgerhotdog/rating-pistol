export function reNormBaseEffs(nonWeapBaseEffs, baseMap) {
  const resolved = structuredClone(nonWeapBaseEffs);

  for (const effect of Object.values(resolved)) {
    for (const buff of effect.buff) {
      if (buff.statRefs) {
        for (const [id, { baseAttr, multipliers, mvIndex }] of Object.entries(buff.statRefsRaw)) {
          if (!baseAttr) continue;

          const baseAttrValue = baseMap[baseAttr] ?? 0;

          const { mv, flat } = multipliers[0];
          const mvBuffValue = mv?.[mvIndex] ?? 0;
          const flatBuffValue = flat?.[mvIndex] ?? 0;

          buff.stats[id] = mvBuffValue * baseAttrValue + flatBuffValue;
        }
      }

      if (buff.specRefs) {
        for (const [id, fieldMap] of Object.entries(buff.specRefsRaw)) {
          for (const [field, { baseAttr, multipliers, mvIndex }] of Object.entries(fieldMap)) {
            if (!baseAttr) continue;

            const baseAttrValue = baseMap[baseAttr] ?? 0;

            const { mv, flat } = multipliers[0];
            const mvBuffValue = mv?.[mvIndex] ?? 0;
            const flatBuffValue = flat?.[mvIndex] ?? 0;

            buff.specs[id][field] = mvBuffValue * baseAttrValue + flatBuffValue;
          }
        }
      }
    }
  }

  return resolved;
}
